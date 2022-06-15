import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from '../../productList';

import schema from './schema';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters }) => {

  const product = productList.find(element => element['id'] === pathParameters['productId']);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json;charset=UTF-8",
  }

  if (product) {
    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(product)
    }

  } else {
    return {
      headers: headers,
      statusCode: 404,
      body: JSON.stringify({ "Error": "Product not found" })
    }
  }
};

export const main = middyfy(products);
