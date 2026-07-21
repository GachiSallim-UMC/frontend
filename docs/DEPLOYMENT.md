# 배포 (AWS, develop → dev / main → prod 블루그린)

`develop` push → dev 환경 자동 배포, `main` push → prod 환경 블루그린 배포(스모크 테스트 통과 시 자동 승격)로 구성되어 있습니다. 정적 SPA(Vite build)라 AWS는 S3+CloudFront 조합만 사용합니다.

인프라(S3·CloudFront·IAM 등)는 AWS CDK(TypeScript)로 별도 관리되고, 이 레포에는 배포 실행을 담당하는 `.github/workflows/deploy-dev.yml` · `deploy-prod.yml` · `rollback-prod.yml`과 그 안에서 쓰는 [`infra/scripts/smoke-test.sh`](../infra/scripts/smoke-test.sh)만 포함되어 있습니다.

## 아키텍처

```
              루트 DNS (도메인 등록기관, Route53 아님)
                         │
        ┌────────────────┴────────────────┐
        │ CNAME                     ALIAS(A) │
        │                                  │
   dev.<domain>                       <domain> (prod, apex)
        │                                  │
  CloudFront (dev, 단일)          CloudFront Primary ←─승격→ CloudFront Staging
        │                              │                          │
   S3 dev 버킷                   S3 prod/blue/*             S3 prod/green/*
                                 (active-color가 가리키는 쪽)
```

hosted zone 위임 없이 dev·prod 모두 루트 DNS에 직접 레코드를 등록하는 구조라, AWS 계정 쪽엔 Route53 hosted zone이 존재하지 않습니다.

- **dev**: distribution 1개, push마다 즉시 배포
- **prod**: primary(실제 트래픽) + staging(신규 버전) — CloudFront **Continuous Deployment Policy**로 연결된 블루그린. 매 배포마다 비활성 색(prefix)에 새 빌드를 올리고, staging distribution origin을 그쪽으로 돌린 뒤 staging 전용 도메인으로 스모크 테스트 → 통과 시 `update-distribution-with-staging-config` API로 primary 설정을 원자적으로 승격
- **활성 색 추적**: SSM Parameter Store `/gachi-salim/prod/active-color` (`blue`|`green`) — 배포 파이프라인이 읽고, 승격 후 플립. 이전 색 S3 콘텐츠는 지우지 않아 즉시 롤백 가능

**승격은 완전 자동**(수동 승인 게이트 없음)입니다. 그 대신 [`rollback-prod.yml`](../.github/workflows/rollback-prod.yml)로 즉시 원복할 수 있게 해뒀습니다 — 배포 후 이상이 보이면 지체 없이 실행하세요.

## 최초 1회 부트스트랩

### 1. CDK 부트스트랩 및 스택 배포 (2단계)

`FrontendProdStack`의 staging distribution은 CDK가 직접 만들 수 없습니다 — CloudFront는 `copy-distribution`으로 primary를 복사해 만든 distribution만 continuous deployment policy와 연결해줍니다. CDK가 독립적으로 새로 만든 distribution은 겉보기엔 똑같아도 연결 시도 시 `IllegalUpdate: One or more fields updated are not supported for continuous deployment`로 거부당합니다(실제로 겪은 문제). 그래서 배포가 2단계로 나뉩니다.

**1단계 — primary distribution까지만 생성**

```bash
cd infra
npm install
npx cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
npx cdk deploy GithubOidcProviderStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
npx cdk deploy FrontendDevStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
npx cdk deploy FrontendProdStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
```

CloudFront용 ACM 인증서는 us-east-1 고정이라 전체 스택을 us-east-1에 배포합니다. 이 시점엔 `FrontendProdStack`에 staging distribution과 continuous deployment policy가 아직 없습니다(`StagingBootstrapNote` 출력 참고).

**2단계 — staging distribution을 copy-distribution으로 만든 뒤 재배포**

```bash
PRIMARY_ID=<PrimaryDistributionId 출력값>
PRIMARY_ETAG=$(aws cloudfront get-distribution --id "$PRIMARY_ID" --query 'ETag' --output text)
aws cloudfront copy-distribution --primary-distribution-id "$PRIMARY_ID" --if-match "$PRIMARY_ETAG" \
  --staging --caller-reference "gachi-salim-staging-bootstrap"
# 출력의 Id·DomainName을 기록

# copy-distribution은 origin path까지 primary(/blue)를 그대로 복사하므로 /green으로 수정
# 필요 (get-distribution-config → OriginPath 수정 → update-distribution, 아래 2번과 같은
# --cli-input-json 패턴 사용)

npx cdk deploy FrontendProdStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend \
  -c stagingDistributionId=<위 Id> -c stagingDistributionDomainName=<위 DomainName>
```

이제 `ContinuousDeploymentPolicy`와 관련 IAM 권한이 만들어집니다.

### 2. Continuous Deployment Policy를 primary에 연결 (최초 1회)

CloudFront API는 distribution 생성과 동시에 `ContinuousDeploymentPolicyId`를 설정하는 것도, 흔한 `--if-match`/`--distribution-config` 분리 호출로 나중에 붙이는 것도 허용하지 않습니다(둘 다 `IllegalUpdate` 에러). **`ETag`를 `IfMatch`로 이름만 바꿔서 `Id`·`IfMatch`·`DistributionConfig`를 한 파일에 담아 `--cli-input-json`으로** 넘겨야 통과합니다 — 이 최초 연결 자체는 **한 번만** 하면 됩니다:

> **주의**: CloudFront는 승격(promote)할 때마다 이 정책을 자동으로 **비활성화**합니다(AWS 공식 문서). 그래서 `deploy-prod.yml`은 매 배포의 승격 직후 정책을 다시 활성화하는 스텝을 포함하고 있습니다 — 이건 파이프라인이 자동으로 처리하므로 사람이 반복할 필요는 없지만, "한 번 연결하면 끝"은 아니라는 점을 알아두세요.

```bash
POLICY_ID=<ContinuousDeploymentPolicyId 출력값>
aws cloudfront get-distribution-config --id "$PRIMARY_ID" --output json > primary.json
python3 -c "
import json
data = json.load(open('primary.json'))
payload = {'Id': '$PRIMARY_ID', 'IfMatch': data['ETag'], 'DistributionConfig': data['DistributionConfig']}
payload['DistributionConfig']['ContinuousDeploymentPolicyId'] = '$POLICY_ID'
json.dump(payload, open('primary-input.json', 'w'))
"
aws cloudfront update-distribution --id "$PRIMARY_ID" --cli-input-json file://primary-input.json
```

### 3. 도메인 연결 (백엔드와 AWS 계정이 달라도 무관하도록)

DNS 관리 도구가 NS·ALIAS 레코드 타입을 지원하지 않는 환경을 고려해 dev·prod 모두 **hosted zone 위임 없이 수동 CNAME/ALIAS 등록** 방식으로 통일했습니다. 루트 존 관리자가 각 스택 배포당 **최초 1회**만 아래를 추가하면 됩니다:

- **dev (`dev.<domain>`)**:
  1. `CertificateValidationNote` 출력의 DNS 검증 CNAME
  2. `ManualAliasTarget` 출력값을 `dev.<domain>`의 CNAME으로
- **prod (`<domain>` apex)**:
  1. `CertificateValidationNote` 출력의 DNS 검증 CNAME (`cdk deploy`가 인증서 ISSUED까지 최대 45분 대기하니, 그 사이에 추가)
  2. `ManualAliasTarget` 출력값을 `<domain>`의 ALIAS(A) 레코드로 — apex는 CNAME을 직접 쓸 수 없어 DNS 도구의 ALIAS/ANAME 기능이 필요합니다. 지원하지 않으면 별도 확인 필요.

  블루그린 승격은 primary distribution의 **내부 설정만** 바꾸고 distribution ID는 그대로 유지되므로, 이 레코드들은 이후 배포·승격 때마다 다시 손댈 필요가 없습니다.

### 4. GitHub 설정

- **Environments**: repo Settings → Environments에 `dev`, `prod` 생성 (워크플로우가 참조)
- **Secrets** (repo Settings → Secrets): `AWS_ACCOUNT_ID` — 이 레포가 퍼블릭이라 워크플로우 실행 로그에 노출되지 않도록 Variable이 아닌 Secret으로 둡니다.
- **Variables** (repo Settings → Variables, 민감값 아님):
  - `AWS_REGION`(`us-east-1`)
  - `DEV_BUCKET_NAME`, `DEV_DISTRIBUTION_ID` — `FrontendDevStack` 출력값
  - `PROD_BUCKET_NAME`, `PROD_PRIMARY_DISTRIBUTION_ID`, `PROD_STAGING_DISTRIBUTION_ID`, `PROD_STAGING_DISTRIBUTION_DOMAIN`, `PROD_CONTINUOUS_DEPLOYMENT_POLICY_ID` — `FrontendProdStack` 출력값

### 5. 애플리케이션 빌드 시크릿 시딩

CDK가 인프라는 만들지만 애플리케이션 값(API 주소 등)까지는 모르므로 최초 1회 직접 채워야 합니다.

```bash
aws ssm put-parameter --name "/gachi-salim/dev/VITE_API_BASE_URL" --type String --value "https://api-dev.example.com"
aws ssm put-parameter --name "/gachi-salim/prod/VITE_API_BASE_URL" --type String --value "https://api.example.com"
```

이후 새 빌드 시크릿이 필요하면 같은 방식으로 `/gachi-salim/<env>/<KEY>` 아래 추가하고, 워크플로우의 "SSM에서 빌드 환경변수 로드" 스텝에 한 줄만 더하면 됩니다.

## 일상적인 배포 흐름

- `develop`에 push → `deploy-dev.yml`이 type-check·lint·build 후 S3 sync + CloudFront invalidation. 몇 분 내 `dev.<domain>`에 반영.
- `main`에 push → `deploy-prod.yml`이 비활성 색에 배포 → staging distribution에서 스모크 테스트(`infra/scripts/smoke-test.sh`) → 통과 시 자동 승격 → 실패 시 그 자리에서 중단(기존 색 그대로 서빙, 워크플로우 실패 알림).

## 롤백

prod 배포 후 문제가 보이면:

1. GitHub repo → Actions → **Rollback Prod** → Run workflow
2. `confirm` 입력란에 정확히 `ROLLBACK` 입력 후 실행
3. primary distribution이 이전 색으로 즉시 되돌아가고 캐시 무효화까지 자동 수행

재빌드나 재배포가 필요 없어 수 분 내로 완료됩니다. 실제 원인 파악 후 수정한 새 커밋으로 다시 `main`에 push하면 정상적인 블루그린 배포 흐름을 탑니다.
