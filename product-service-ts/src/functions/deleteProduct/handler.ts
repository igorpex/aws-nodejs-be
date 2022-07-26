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

const deleteProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters }) => {
  const { productId } = pathParameters;
  console.log("DELETE product request received.");
  // console.log("Request body: ", event.body);

  // const { id } = event.body;

  console.log(
    `DELETE request data: {id: '${productId}'`
  );

  if (!productId || productId != String(productId)) {
    console.error("Error: Invalid productId");
    // TODO add uuid check
    // TODO add product exist before delete
    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify({ "Error": "Invalid productId" })
    }
  }

  const client = new Client(dbConfig);

  try {
    await client.connect();

    await client.query(`begin`);

    await client.query(`delete from stocks where product_id = '${productId}'`);
    // const deletedProductId = res.rows[0].id;
    await client.query('commit');
    console.log(`product deleted from stocks table, id: ${productId}`);

    await client.query(`delete from products where id = '${productId}'`);
    await client.query('commit');

    console.log('product deleted from products table');

    return {
      headers: headers,
      statusCode: 204,
      body: JSON.stringify({ deleted: productId })
    }
  } catch (e) {
    await client.query('rollback');
    console.error('Error during deleting product', e);
    return {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify({ "Error": "Error during database request" })
    }
  } finally {
    client.end();
  }
};

export const main = middyfy(deleteProduct);
