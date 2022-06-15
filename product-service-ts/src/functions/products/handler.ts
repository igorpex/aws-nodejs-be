import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from '../../productList';

import schema from './schema';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json;charset=UTF-8",
  }
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(productList)
  }
};

export const main = middyfy(products);
