# 배포 (AWS, develop → dev / main → prod 블루그린)

`develop` push → dev 환경 자동 배포, `main` push → prod 환경 블루그린 배포(스모크 테스트 통과 시 자동 승격)로 구성되어 있습니다. 정적 SPA(Vite build)라 AWS는 S3+CloudFront 조합만 사용합니다.

인프라는 [`infra/`](../infra)에 AWS CDK(TypeScript)로 코드화되어 있고, 배포 실행은 `.github/workflows/deploy-dev.yml` · `deploy-prod.yml` · `rollback-prod.yml`이 담당합니다.

## 아키텍처

```
                    Route53 (도메인)
                         │
        ┌────────────────┴────────────────┐
        │                                  │
   dev.<domain>                       <domain> (prod, apex)
        │                                  │
  CloudFront (dev, 단일)          CloudFront Primary ←─승격→ CloudFront Staging
        │                              │                          │
   S3 dev 버킷                   S3 prod/blue/*             S3 prod/green/*
                                 (active-color가 가리키는 쪽)
```

- **dev**: distribution 1개, push마다 즉시 배포
- **prod**: primary(실제 트래픽) + staging(신규 버전) — CloudFront **Continuous Deployment Policy**로 연결된 블루그린. 매 배포마다 비활성 색(prefix)에 새 빌드를 올리고, staging distribution origin을 그쪽으로 돌린 뒤 staging 전용 도메인으로 스모크 테스트 → 통과 시 `update-distribution-with-staging-config` API로 primary 설정을 원자적으로 승격
- **활성 색 추적**: SSM Parameter Store `/gachi-salim/prod/active-color` (`blue`|`green`) — 배포 파이프라인이 읽고, 승격 후 플립. 이전 색 S3 콘텐츠는 지우지 않아 즉시 롤백 가능

**승격은 완전 자동**(수동 승인 게이트 없음)입니다. 그 대신 [`rollback-prod.yml`](../.github/workflows/rollback-prod.yml)로 즉시 원복할 수 있게 해뒀습니다 — 배포 후 이상이 보이면 지체 없이 실행하세요.

## 최초 1회 부트스트랩

### 1. CDK 부트스트랩 및 스택 배포

```bash
cd infra
npm install
npx cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
npx cdk deploy GithubOidcProviderStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
npx cdk deploy FrontendDevStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
npx cdk deploy FrontendProdStack -c domainName=<실제 도메인> -c githubOrg=GachiSallim-UMC -c githubRepo=frontend
```

CloudFront용 ACM 인증서는 us-east-1 고정이라 전체 스택을 us-east-1에 배포합니다(`infra/bin/app.ts` 참고).

### 2. 도메인 연결 (백엔드와 AWS 계정이 달라도 무관하도록)

- **dev (`dev.<domain>`)**: `FrontendDevStack` 배포 로그의 `NameServers` 출력값을, 루트 존(도메인이 실제 등록된 곳) 관리자가 `dev.<domain>` NS 레코드로 **최초 1회** 추가. 이후 dev 관련 모든 걸 이 AWS 계정이 독립적으로 관리.
- **prod (`<domain>` apex)**: apex는 서브도메인 위임이 안 되므로, 루트 존 관리자가 아래 2개를 **최초 1회**만 추가:
  1. `CertificateValidationNote` 출력의 안내대로 ACM 콘솔에서 확인한 DNS 검증 CNAME (`cdk deploy`가 인증서 ISSUED까지 최대 45분 대기하니, 그 사이에 추가)
  2. `ManualAliasTarget` 출력값을 `<domain>`의 ALIAS(A) 레코드로

  블루그린 승격은 primary distribution의 **내부 설정만** 바꾸고 distribution ID는 그대로 유지되므로, 이 ALIAS 레코드는 이후 배포·승격 때마다 다시 손댈 필요가 없습니다.

### 3. GitHub 설정

- **Environments**: repo Settings → Environments에 `dev`, `prod` 생성 (워크플로우가 참조)
- **Variables** (repo Settings → Variables, secrets 아님 — 민감값 아님):
  - `AWS_ACCOUNT_ID`, `AWS_REGION`(`us-east-1`)
  - `DEV_BUCKET_NAME`, `DEV_DISTRIBUTION_ID` — `FrontendDevStack` 출력값
  - `PROD_BUCKET_NAME`, `PROD_PRIMARY_DISTRIBUTION_ID`, `PROD_STAGING_DISTRIBUTION_ID`, `PROD_STAGING_DISTRIBUTION_DOMAIN` — `FrontendProdStack` 출력값

### 4. 애플리케이션 빌드 시크릿 시딩

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

## 알아둘 것 / 한계

- **`update-distribution-with-staging-config`의 정확한 CLI 파라미터**는 CloudFront Continuous Deployment가 비교적 신규 기능(2023년 출시)이라 `deploy-prod.yml`에 작성된 형태(특히 `--if-match`에 primary/staging ETag를 함께 넘기는 부분)를 실제 실행 전에 `aws cloudfront update-distribution-with-staging-config help`로 재확인하세요. **최초 실행은 반드시 별도 테스트 계정/스테이징에서 리허설**하고 main에 반영하는 걸 권장합니다.
- CDK 코드의 `CfnContinuousDeploymentPolicy` 관련 부분도 같은 이유로 `cdk synth` 결과를 실제 배포 전 검토하세요.
- 비용: S3+CloudFront+Route53+SSM Parameter Store 조합은 소규모 트래픽 기준 월 몇 달러 수준입니다(참고용 추정치, 확정 견적 아님).
