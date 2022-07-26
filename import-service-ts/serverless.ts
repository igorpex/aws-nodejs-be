import type { AWS } from '@serverless/typescript';
import 'dotenv/config';
// const BUCKET = process.env.BUCKET;
const BUCKET = 'node-in-aws-catalog2'
const QUEUE_NAME = 'catalogItemsQueue';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';
import catalogBatchProcess from '@functions/catalogBatchProcess';

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
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { 'Ref': 'SNSTopic' },
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
      // SQS_URL: { 'Fn::GetAtt': ['SQSQueue', 'QueueUrl'] },
      SQS_URL: { 'Ref': 'SQSQueue' },
      SQS_NAME: { 'Fn::GetAtt': ['SQSQueue', 'QueueName'] },
      SQS_ARN: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      SNS_ARN: { 'Ref': 'SNSTopic' },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: QUEUE_NAME,
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
          FilterPolicy: {
            "priceCategory": [
              "very good"
            ]
          },
          Protocol: 'email',
          TopicArn: { 'Ref': 'SNSTopic' },
        }
      },
      SNSSubscription2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'sns-email-1@mailforspam.com',
          FilterPolicy: {
            "priceCategory": [
              "good"
            ]
          },
          Protocol: 'email',
          TopicArn: { 'Ref': 'SNSTopic' },
        }
      },
      SNSSubscription3: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'sns-email-2@mailforspam.com',
          FilterPolicy: {
            "priceCategory": [
              "bad"
            ]
          },
          Protocol: 'email',
          TopicArn: { 'Ref': 'SNSTopic' },
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
