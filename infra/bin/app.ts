#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GithubOidcProviderStack } from '../lib/github-oidc-provider-stack';
import { FrontendDevStack } from '../lib/frontend-dev-stack';
import { FrontendProdStack } from '../lib/blue-green-site-stack';

const app = new cdk.App();

// CloudFront용 ACM 인증서는 us-east-1에서만 발급 가능 — CloudFront가 전역 서비스라
// 인프라 전체를 us-east-1로 고정해서 리전 간 인증서 참조 복잡도를 없앤다.
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
};

// 실제 값으로 교체 필요 (cdk.json의 context 또는 -c 플래그로 주입)
const rootDomainName = app.node.tryGetContext('domainName') ?? 'CHANGE_ME.example.com';
const githubOrg = app.node.tryGetContext('githubOrg') ?? 'GachiSallim-UMC';
const githubRepo = app.node.tryGetContext('githubRepo') ?? 'frontend';

const oidcStack = new GithubOidcProviderStack(app, 'GithubOidcProviderStack', { env });

new FrontendDevStack(app, 'FrontendDevStack', {
  env,
  rootDomainName,
  githubOrg,
  githubRepo,
  oidcProviderArn: oidcStack.provider.openIdConnectProviderArn,
});

new FrontendProdStack(app, 'FrontendProdStack', {
  env,
  domainName: rootDomainName,
  githubOrg,
  githubRepo,
  oidcProviderArn: oidcStack.provider.openIdConnectProviderArn,
});
