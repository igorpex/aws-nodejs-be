import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
// import { getSignedUrl } from './getSignedUrl';

import schema from './schema';

import * as AWS from 'aws-sdk';

const getSignedUrl = async (fileName = 'catalog.csv') => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const BUCKET = 'node-in-aws-catalog2';
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
  // console.log('event: ', event);// queryStringParameters: { name: 'test.csv' },
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


// "https://node-in-aws-catalog2.s3.eu-west-1.amazonaws.com/uploaded/test.csv?
// AWSAccessKeyId=ASIASBHYJVI6IZLJO26D
// &Content-Type=text%2Fcsv
// &Expires=1656821489&
// Signature=mtnSnXJoSa63YlPKisq6llYe7RM%3D&
// x-amz-security-token=IQoJb3JpZ2luX2VjEEQaCWV1LXdlc3QtMSJGMEQCICw7nGg5al1wexe6XnpmKZfWHRyrPeSoC3YO8ttJSX%2FTAiBpQ6LJ2Gr%2Firw5yj%2BR7esuyzgoLhqLC4Cdvo%2FJlTw3gCqlAwhtEAAaDDE0MDEwNzE2NDIyMCIMAxzoYNgz89CoHkzdKoIDdxGtlBXFft5yj51ZOQ7Ktorkq0EyeanvpMN4UA85a0S6VsXaOJTpLEaDqaN53ktSWcrOns7fjBB%2FAGZQ13zMZSjBKNUrXMkbxLh8q2TnRXDA98rIN7rQUnTIn1etOqRJQ1DIf2r3WDdRknRxIyUtNM5iC4lKCQZh%2FOS7LTRhq%2FphUKh8Dl2zrhC4CT7WCxhbsLEAGy1o0cPV1HiYtoYXd8bMACrnnjffVztngQN0nk1rTwC1UR27bFe5ZTBDI719rtMHVMIpeIUKckqEvUfUWJYJUMTk5KgVrSpRAGay2PrgyqEZ9NdKTMtmEXjSe1ZivADtsjPQGNU%2B%2BGnHm49Js1NWxJdGJbm8UX9x2x%2FtK3KJ9rkFAdWhRt01%2FoxDxpjmB3Tbru3LZ8kcIFjp5WXsJKbiccQScT4jcnl54BlRLqdIZ1c1ToT79jilsPRPDWOKWuwz2FkdtVDHnA4dSttGqwb%2BXf1WLKMgZP2RmFU9Em4HKp3eL4AHTAKaOaJF7QJVVW4wta2ElgY6ngH4zaTstj7VB0DDOpV9FwlkQhd3lJwYBp%2BeGScc9mdvXA9mdfIWtBKzziFkej8lJbvaHM9OolsNm8hHapz0i4mp0QBn9gz8yQqVgjo72R8uDmh1EG8OjJBS3NydHfcidayMvTsEYbACUadiJs8NSMmtthq40IvKz2KIpNYsNwDEF3R%2BkIIhPYb3SkefymfcpJj%2Bo%2BooLnjzRD9zL4UkMw%3D%3D"