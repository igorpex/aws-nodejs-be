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

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log("POST product request received.");
  console.log("Request body: ", event.body);

  const { title, description, price, imageurl, count } = event.body;

  console.log(
    `POST request data: {title: '${title}', description: '${description}', image: '${imageurl}', price: ${price}, count: ${count};`
  );

  if (!title || price != Number(price) || count != Number(count)) {
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

    const res = await client.query(`insert into products (title, description, imageurl , price) values ('${title}', '${description}', '${imageurl}', ${price}) returning id;`);

    const newProductId = res.rows[0].id;

    await client.query(`insert into stocks (product_id, count) values ('${newProductId}', ${count});`);

    await client.query('commit');

    const product = await client.query(`select * from products inner join stocks on products.id = stocks.product_id where id = '${newProductId}';`)

    console.log('POST request and add to database fulfilled successfully');

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

export const main = middyfy(postProduct);
