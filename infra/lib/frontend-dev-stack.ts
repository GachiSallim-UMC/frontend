import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StaticSite } from './static-site-stack';

const PARAM_PREFIX = '/gachi-salim/dev';

export interface FrontendDevStackProps extends cdk.StackProps {
  /** 예: "example.com" — 실제로는 dev.example.com에 배포됨 */
  rootDomainName: string;
  oidcProviderArn: string;
  githubOrg: string;
  githubRepo: string;
}

export class FrontendDevStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendDevStackProps) {
    super(scope, id, props);

    const site = new StaticSite(this, 'Site', {
      domainName: `dev.${props.rootDomainName}`,
      bucketName: 'gachi-salim-frontend-dev',
      createHostedZone: true,
    });

    // GitHub Actions(develop 브랜치 한정)가 OIDC로 assume하는 배포 전용 역할.
    // 정적 액세스 키를 GitHub Secrets에 두지 않기 위함.
    const deployRole = new iam.Role(this, 'GithubDeployRole', {
      roleName: 'gha-deploy-dev',
      assumedBy: new iam.WebIdentityPrincipal(props.oidcProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:ref:refs/heads/develop`,
        },
      }),
      description: 'GitHub Actions(develop)가 dev 환경에 배포할 때 assume하는 역할',
    });

    site.bucket.grantReadWrite(deployRole);

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${site.distribution.distributionId}`,
        ],
      }),
    );

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParameter', 'ssm:GetParameters', 'ssm:GetParametersByPath'],
        resources: [`arn:aws:ssm:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:parameter${PARAM_PREFIX}/*`],
      }),
    );

    new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn });
    new cdk.CfnOutput(this, 'BucketName', { value: site.bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: site.distribution.distributionId });
    new cdk.CfnOutput(this, 'DistributionDomainName', { value: site.distribution.distributionDomainName });
  }
}
