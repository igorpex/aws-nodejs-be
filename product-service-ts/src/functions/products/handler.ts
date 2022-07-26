import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from '../../productList';
import { dbConfig } from '../../dbConfig';
import { Client } from 'pg';

import schema from './schema';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json;charset=UTF-8",
  }

console.log('GET request: getProducts');
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const { rows } = await client.query(
      'select * from products inner join stocks on products.id = stocks.product_id;'
    );

    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(rows)
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

export const main = middyfy(products);
