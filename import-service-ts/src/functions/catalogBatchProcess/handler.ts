import { middyfy } from '@libs/lambda';
import { Handler, SQSEvent } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import { SNS } from 'aws-sdk';
import 'dotenv/config';

const catalogBatchProcess: Handler = async (event: SQSEvent): Promise<InvokeAsyncResponse> => {

  const SNS_ARN = process.env.SNS_ARN;
  console.log('####SNS_ARN:', SNS_ARN);

  const products = event.Records.map(({ body }) => body);
  console.log('####Products received from Queue:', products);
  const sns = new SNS({ region: 'eu-west-1' });

  const sent = await sns.publish({
    Subject: 'New product imported',
    Message: JSON.stringify(products),
    TopicArn: SNS_ARN
  }).promise();

  console.log('####Sent result:', sent);
  return {
    Status: 202,
  };
};

export const main = middyfy(catalogBatchProcess);
