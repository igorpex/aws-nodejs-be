import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import 'dotenv/config';
import schema from './schema';
import * as AWS from 'aws-sdk';

const getSignedUrl = async (fileName = 'catalog.csv') => {
  const BUCKET = process.env.BUCKET;
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const catalogPath = `uploaded/${fileName}`;
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  return await s3.getSignedUrl('putObject', params)
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json;charset=UTF-8",
};

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ queryStringParameters }) => {
  const { name } = queryStringParameters;
  const signedUrl = await getSignedUrl(name);
  console.log('signedUrl: ', signedUrl);
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(signedUrl)
  }
};

export const main = middyfy(importProductsFile);
