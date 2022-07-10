import type { AWS } from '@serverless/typescript';
import 'dotenv/config';
const BUCKET = process.env.BUCKET;
// const SQS_URL = process.env.SQS_URL;

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-service-ts',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-1',
    stage: 'dev',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET}`,
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET}/*`
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] }
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET,
      SQS_URL: { 'Fn::GetAtt': ['SQSQueue', 'QueueUrl'] },
      SQS_NAME: { 'Fn::GetAtt': ['SQSQueue', 'QueueName'] },
      SQS_ARN: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'import-service-ts-queue',
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'igor.bogdanov@gmail.com',
          Protocol: 'email',
          TopicArn: { 'Fn::GetAtt': ['SNSTopic', 'Arn'] },
        }
      }
    }
  },

  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
