import { Duration, RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as path from 'path';

const DEV_ORIGIN = 'http://localhost:5173';

export class CustomerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const customersTable = new Table(this, 'CustomersTable', {
      tableName: 'customers',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });

    customersTable.addGlobalSecondaryIndex({
      indexName: 'registration_date_index',
      partitionKey: { name: 'entity_type', type: AttributeType.STRING },
      sortKey: { name: 'registration_date', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL
    });

    const fetchCustomersLambda = new Function(this, 'FetchCustomersLambda', {
      functionName: 'customers-fetch',
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.getCustomersHandler',
      code: Code.fromAsset(path.join(__dirname, '../../../backend/lambda/dist')),
      timeout: Duration.seconds(10),
      environment: {
        CUSTOMERS_TABLE_NAME: customersTable.tableName,
        REGISTRATION_DATE_INDEX: 'registration_date_index'
      }
    });

    customersTable.grantReadData(fetchCustomersLambda);

    const api = new RestApi(this, 'CustomersApi', {
      restApiName: 'customers-api',
      defaultCorsPreflightOptions: {
        allowOrigins: [DEV_ORIGIN],
        allowMethods: Cors.ALL_METHODS
      }
    });

    const customersResource = api.root.addResource('customers');
    customersResource.addMethod('GET', new LambdaIntegration(fetchCustomersLambda));

    // Frontend hosting with S3 + CloudFront
    const websiteBucket = new Bucket(this, 'CustomerExplorerBucket', {
      bucketName: `customer-explorer-${this.account}-${this.region}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true
      }
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'CustomerExplorerOAI', {
      comment: 'OAI for Customer Explorer frontend'
    });

    websiteBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, 'CustomerExplorerDistribution', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, {
          originAccessIdentity: originAccessIdentity
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway base URL'
    });

    new CfnOutput(this, 'DynamoDBTableName', {
      value: customersTable.tableName,
      description: 'DynamoDB table name'
    });

    new CfnOutput(this, 'FrontendUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Frontend application URL'
    });

    new CfnOutput(this, 'S3BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 bucket for frontend hosting'
    });

    new CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID'
    });
  }
}
