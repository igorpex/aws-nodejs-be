import { middyfy } from '@libs/lambda';
import { Handler, SQSEvent } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import { SNS } from 'aws-sdk';
import 'dotenv/config';

const catalogBatchProcess: Handler = async (event: SQSEvent): Promise<InvokeAsyncResponse> => {

  const SNS_ARN = process.env.SNS_ARN;
  console.log('####SNS_ARN:', SNS_ARN);

  const products = event.Records.map(({ body }) => JSON.parse(body));
  console.log('####Products received from Queue:', products);
  const sns = new SNS({ region: 'eu-west-1' });
  let len = products.length;
  for (let i = 0; i < len; i++) {
    const product = products[i];
    let priceCategory: string;
    if (product.price <= 200) {
      priceCategory = 'very good'
    } else if (product.price <= 500) {
      priceCategory = 'good'
    } else {
      priceCategory = 'bad'
    }
    console.log('####Product:', product, ' ####Category:', priceCategory);

    const sent = await sns.publish({
      Subject: 'New product imported - ' + priceCategory + ' price',
      Message: JSON.stringify(product),
      TopicArn: SNS_ARN,
      MessageAttributes: {
        'priceCategory': { DataType: 'String', StringValue: priceCategory },
      },
    }).promise();

    console.log('####Sent result:', sent);
  }

  return {
    Status: 202,
  };
};

export const main = middyfy(catalogBatchProcess);
