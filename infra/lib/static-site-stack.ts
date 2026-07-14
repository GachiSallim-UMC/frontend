import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

/**
 * S3 + CloudFront 정적 사이트 구성. dev/prod가 재사용하는 construct (Stack이 아님 —
 * 각 환경 Stack 안에서 인스턴스화해서 그 Stack의 IAM 리소스와 같은 스코프에 둔다).
 *
 * SPA 클라이언트 라우팅을 위해 403/404를 index.html로 폴백시킨다.
 */
export interface StaticSiteProps {
  /** 예: "dev.example.com" (서브도메인) 또는 "example.com" (apex) */
  domainName: string;
  bucketName: string;
  /**
   * true: 이 construct가 Route53 Public Hosted Zone을 새로 만든다 (서브도메인 위임용 —
   *   루트 존 관리자가 NS 레코드 4줄만 최초 1회 추가하면 그 이후로는 완전히 독립적으로 관리 가능).
   * false: hosted zone을 만들지 않는다 (apex 등, 루트 존이 이 계정에 없을 수 있는 경우).
   *   이 경우 ACM 인증서 DNS 검증 CNAME과 CloudFront 별칭용 도메인 값을 CfnOutput으로만
   *   내보내고, 루트 존 관리자가 수동으로 레코드를 추가해야 한다 (최초 1회, 이후 블루그린
   *   승격 등에서는 다시 손댈 필요 없음 — distribution ID가 승격 후에도 유지되기 때문).
   */
  createHostedZone: boolean;
}

export class StaticSite extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly certificate: acm.Certificate;
  public readonly hostedZone?: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: props.bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    if (props.createHostedZone) {
      this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
        zoneName: props.domainName,
      });

      new cdk.CfnOutput(this, 'NameServers', {
        value: cdk.Fn.join(', ', this.hostedZone.hostedZoneNameServers ?? []),
        description: `루트 존 관리자가 ${props.domainName}에 대한 NS 레코드로 이 값들을 최초 1회 추가해야 함`,
      });
    }

    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: this.hostedZone
        ? acm.CertificateValidation.fromDns(this.hostedZone)
        : acm.CertificateValidation.fromDns(),
    });
    if (!this.hostedZone) {
      // hosted zone 참조가 없으면 CDK가 검증 CNAME을 자동으로 추가하지 못한다.
      // `cdk deploy`가 인증서 ISSUED 상태를 기다리며 멈춰 있는 동안, ACM 콘솔에서
      // 검증용 CNAME 이름/값을 확인해 루트 존에 수동으로 추가해야 진행된다 (최초 1회).
      new cdk.CfnOutput(this, 'CertificateValidationNote', {
        value: `ACM 콘솔에서 ${props.domainName} 인증서의 DNS 검증 CNAME을 확인해 루트 존에 추가하세요 (cdk deploy가 대기 중)`,
      });
    }

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [props.domainName],
      certificate: this.certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(0) },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(0) },
      ],
    });

    if (this.hostedZone) {
      new route53.ARecord(this, 'AliasRecord', {
        zone: this.hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution)),
      });
    } else {
      new cdk.CfnOutput(this, 'ManualAliasTarget', {
        value: this.distribution.distributionDomainName,
        description: `루트 존 관리자가 ${props.domainName}의 ALIAS(A) 레코드로 이 값을 가리키도록 최초 1회 추가 필요. 이후 블루그린 승격에도 이 값은 바뀌지 않음`,
      });
    }
  }
}
