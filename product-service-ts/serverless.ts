import type { AWS } from '@serverless/typescript';
import 'dotenv/config';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

import hello from '@functions/hello';
import products from '@functions/products';
import productById from '@functions/productById';
import postProduct from '@functions/postProduct';
import putProduct from '@functions/putProduct';
import deleteProduct from '@functions/deleteProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service-ts',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    region: 'eu-west-1',
    stage: 'dev',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST,
      PG_PORT,
      PG_DATABASE,
      PG_USERNAME,
      PG_PASSWORD,
    },
  },
  // import the function via paths
  functions: { hello, products, productById, postProduct, putProduct, deleteProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
