import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { dbConfig } from 'src/dbConfig';
import { Client } from 'pg';

import schema from './schema';

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json;charset=UTF-8",
};

const productById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters }) => {
  const { productId } = pathParameters;
  console.log('Get product by Id request received.');
  console.log('pathParameters: ', pathParameters);

  // const productId = pathParameters['productId'];
  console.log('productId: ', productId);

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log(`making request to DB with product id: ${productId}`);

    const product = await client.query(
      `select * from products inner join stocks on products.id = stocks.product_id where id = '${productId}';`
    );

    console.log('product from DB: ', product);

    if (product) {
      return {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify(product.rows[0])
      }

    } else {
      return {
        headers: headers,
        statusCode: 404,
        body: JSON.stringify({ "Error": "Product not found" })
      }
    }
  } catch (e) {
    console.error('Error during database request', e);

    return {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify({ "Error": "Error during database request" })
    }

  } finally {
    client.end();
  }
};

export const main = middyfy(productById);
