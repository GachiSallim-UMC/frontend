import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * GitHub Actions가 정적 AWS 액세스 키 없이 역할을 assume할 수 있게 해주는
 * OIDC ID 공급자. AWS 계정당 이 공급자는 정확히 1개만 존재할 수 있으므로
 * dev/prod 스택과 분리된 별도 스택으로 관리한다.
 */
export class GithubOidcProviderStack extends cdk.Stack {
  public readonly provider: iam.OpenIdConnectProvider;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.provider = new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    new cdk.CfnOutput(this, 'OidcProviderArn', {
      value: this.provider.openIdConnectProviderArn,
      description: 'FrontendDevStack/FrontendProdStack에 oidcProviderArn prop으로 전달',
    });
  }
}
