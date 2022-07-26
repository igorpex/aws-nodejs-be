import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { dbConfig } from 'src/dbConfig';
import { Client } from 'pg';

import schema from './schema';

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json;charset=UTF-8",
}

const putProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log("PUT product request received.");
  console.log('event.pathParameters:', event.pathParameters);
  //event.pathParameters: { productId: '9cb146ab-b227-4601-8f5d-60103585cb2f' }
  console.log("Request body: ", event.body);

  const { productId } = event.pathParameters;

  const { id, title, description, price, imageurl, count } = event.body;
  console.log('id from body:', id);

  console.log(
    `PUT request data: {id: '${id}', title: '${title}', description: '${description}', image: '${imageurl}', price: ${price}, count: ${count};`
  );

  console.log('productId:', productId, 'id: ', id);
  if (!title || price != Number(price) || count != Number(count) || productId !== id) {
    console.error("Error: Invalid product data provided");

    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify({ "Error": "Invalid product data provided" })
    }
  }

  const client = new Client(dbConfig);

  try {
    await client.connect();

    await client.query(`begin`);

    // `select * from products inner join stocks on products.id = stocks.product_id where id = '${productId}';`

    // const product = await client.query(`select * from products inner join stocks on products.id = stocks.product_id where id = '${newProductId}';`)

    await client.query(`update products set title = '${title}', description = '${description}', imageurl = '${imageurl}', price = ${price} where id = '${id}';`);
    await client.query('commit');

    await client.query(`update stocks set count = ${count} where product_id = '${id}';`);

    await client.query('commit');

    const product = await client.query(`select * from products inner join stocks on products.id = stocks.product_id where id = '${id}';`)

    console.log('PUT request and updating product info in database fulfilled successfully');

    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(product.rows[0])
    }
  } catch (e) {
    await client.query('rollback');
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

export const main = middyfy(putProduct);
