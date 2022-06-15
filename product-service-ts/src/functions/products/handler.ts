import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from '../../productList';

import schema from './schema';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log(productList);
  return formatJSONResponse({ productList });
};

export const main = middyfy(products);
