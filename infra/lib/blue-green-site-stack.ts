import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';

const PARAM_PREFIX = '/gachi-salim/prod';
/** 스모크 테스트가 staging distribution을 식별할 때 보내는 헤더. 실사용자 트래픽은 이 헤더가 없으므로 항상 primary(활성 색)로 감 */
const STAGING_HEADER = 'aws-cf-cd-staging';

export interface FrontendProdStackProps extends cdk.StackProps {
  /** apex 도메인, 예: "example.com" */
  domainName: string;
  oidcProviderArn: string;
  githubOrg: string;
  githubRepo: string;
}

/**
 * prod 블루그린 배포.
 *
 * - S3 버킷 하나에 /blue, /green 두 prefix — 배포마다 비활성 색 쪽에 새 빌드를 올림
 * - Primary distribution: 실제 트래픽(도메인 별칭 보유), origin path는 SSM active-color가
 *   가리키는 색으로 고정
 * - Staging distribution: ContinuousDeploymentPolicy로 primary와 연결. origin path는
 *   배포 파이프라인이 매번 "비활성 색"으로 갱신. 도메인 별칭 없이 자체 *.cloudfront.net
 *   도메인 + STAGING_HEADER 헤더로만 접근 (실트래픽 유입 없음)
 * - 승격(promote)은 CloudFront의 UpdateDistributionWithStagingConfig API로 원자적으로
 *   수행 — primary의 distribution ID 자체는 유지되므로 apex ALIAS 레코드는 최초 설정
 *   이후 다시 손댈 필요 없음
 *
 * ContinuousDeploymentPolicy는 aws-cdk-lib에 L2 construct가 아직 없어 L1(Cfn*)로 구성했다.
 */
export class FrontendProdStack extends cdk.Stack {
  public readonly activeColorParam: ssm.StringParameter;
  public readonly primaryDistribution: cloudfront.Distribution;
  public readonly stagingDistribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: FrontendProdStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: 'gachi-salim-frontend-prod',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // apex는 서브도메인 위임이 불가능 — 루트 존 참조 없이 진행, 검증 CNAME은 수동 추가
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(),
    });
    new cdk.CfnOutput(this, 'CertificateValidationNote', {
      value: `ACM 콘솔에서 ${props.domainName} 인증서의 DNS 검증 CNAME을 확인해 루트 존에 추가하세요 (cdk deploy가 대기 중)`,
    });

    const commonErrorResponses: cloudfront.ErrorResponse[] = [
      { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(0) },
      { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(0) },
    ];

    // --- Staging distribution (초기 origin path는 /green — 배포 파이프라인이 매번 비활성 색으로 갱신) ---
    this.stagingDistribution = new cloudfront.Distribution(this, 'StagingDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, { originPath: '/green' }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: commonErrorResponses,
      comment: 'gachi-salim prod staging (blue-green 승격 전 스모크 테스트 전용)',
    });
    const cfnStaging = this.stagingDistribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnStaging.addPropertyOverride('DistributionConfig.Staging', true);

    const continuousDeploymentPolicy = new cloudfront.CfnContinuousDeploymentPolicy(this, 'ContinuousDeploymentPolicy', {
      continuousDeploymentPolicyConfig: {
        enabled: true,
        stagingDistributionDnsNames: [this.stagingDistribution.distributionDomainName],
        trafficConfig: {
          type: 'SingleHeader',
          singleHeaderConfig: { header: STAGING_HEADER, value: 'true' },
        },
      },
    });

    // --- Primary distribution (초기 origin path는 /blue, apex 도메인 별칭 보유) ---
    this.primaryDistribution = new cloudfront.Distribution(this, 'PrimaryDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, { originPath: '/blue' }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [props.domainName],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: commonErrorResponses,
      comment: 'gachi-salim prod primary (실제 트래픽)',
    });
    const cfnPrimary = this.primaryDistribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnPrimary.addPropertyOverride('DistributionConfig.ContinuousDeploymentPolicyId', continuousDeploymentPolicy.attrId);

    new cdk.CfnOutput(this, 'ManualAliasTarget', {
      value: this.primaryDistribution.distributionDomainName,
      description: `루트 존 관리자가 ${props.domainName}의 ALIAS(A) 레코드로 이 값을 가리키도록 최초 1회 추가 필요. 블루그린 승격 후에도 이 값은 바뀌지 않음`,
    });
    new cdk.CfnOutput(this, 'StagingDomainName', {
      value: this.stagingDistribution.distributionDomainName,
      description: '스모크 테스트가 curl로 두드릴 staging distribution 도메인',
    });

    // 현재 어느 색이 실제 서빙 중인지 추적 — 배포 파이프라인이 읽고, 승격 성공 후 갱신
    this.activeColorParam = new ssm.StringParameter(this, 'ActiveColorParam', {
      parameterName: `${PARAM_PREFIX}/active-color`,
      stringValue: 'blue',
      description: 'Color currently serving live prod traffic (blue|green)',
    });

    // GitHub Actions(main 브랜치 한정) 배포 역할
    const deployRole = new iam.Role(this, 'GithubDeployRole', {
      roleName: 'gha-deploy-prod',
      assumedBy: new iam.WebIdentityPrincipal(props.oidcProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:ref:refs/heads/main`,
        },
      }),
      description: 'Assumed by GitHub Actions (main) for prod blue-green deploy, promote, and rollback',
    });

    bucket.grantReadWrite(deployRole);

    const account = cdk.Stack.of(this).account;
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${account}:distribution/${this.primaryDistribution.distributionId}`,
          `arn:aws:cloudfront::${account}:distribution/${this.stagingDistribution.distributionId}`,
        ],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'cloudfront:GetDistribution',
          'cloudfront:GetDistributionConfig',
          'cloudfront:UpdateDistribution',
          'cloudfront:UpdateDistributionWithStagingConfig',
        ],
        resources: [
          `arn:aws:cloudfront::${account}:distribution/${this.primaryDistribution.distributionId}`,
          `arn:aws:cloudfront::${account}:distribution/${this.stagingDistribution.distributionId}`,
        ],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'cloudfront:GetContinuousDeploymentPolicy',
          'cloudfront:GetContinuousDeploymentPolicyConfig',
          'cloudfront:UpdateContinuousDeploymentPolicy',
        ],
        resources: [`arn:aws:cloudfront::${account}:continuous-deployment-policy/${continuousDeploymentPolicy.attrId}`],
      }),
    );
    this.activeColorParam.grantRead(deployRole);
    this.activeColorParam.grantWrite(deployRole);

    new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn });
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'PrimaryDistributionId', { value: this.primaryDistribution.distributionId });
    new cdk.CfnOutput(this, 'StagingDistributionId', { value: this.stagingDistribution.distributionId });
    new cdk.CfnOutput(this, 'ContinuousDeploymentPolicyId', { value: continuousDeploymentPolicy.attrId });
  }
}
