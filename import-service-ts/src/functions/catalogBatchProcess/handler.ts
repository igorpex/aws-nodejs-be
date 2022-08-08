import { middyfy } from '@libs/lambda';
import { Handler, SQSEvent } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import { SNS } from 'aws-sdk';
import 'dotenv/config';
import { dbConfig } from 'src/dbConfig';
import { Client } from 'pg';

const catalogBatchProcess: Handler = async (event: SQSEvent): Promise<InvokeAsyncResponse> => {

  const products = event.Records.map(({ body }) => JSON.parse(body));
  console.log('####Products received from Queue:', products);
  let len = products.length;

  // Add to database
  for (let i = 0; i < len; i++) {
    const product = products[i];
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await client.query(`begin`);
      const res = await client.query(`insert into products (title, description, imageurl , price) values ('${product.title}', '${product.description}', '${product.imageurl}', ${product.price}) returning id;`);
      const newProductId = res.rows[0].id;
      await client.query(`insert into stocks (product_id, count) values ('${newProductId}', ${product.count});`);
      await client.query('commit');
      console.log(`POST request for product and add to database fulfilled successfully. Product id:np ${newProductId}`);
    } catch (e) {
      await client.query('rollback');
      console.error('Error during database request', e);
    } finally {
      await client.end();
    }
  }


  // Make email notifications
  const SNS_ARN = process.env.SNS_ARN;
  console.log('####SNS_ARN:', SNS_ARN);

  const sns = new SNS({ region: 'eu-west-1' });

  for (let i = 0; i < len; i++) {
    const product = products[i];
    let priceCategory: string;
    if (product.price <= 20) {
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
