// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Handler, S3Event } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';

// import schema from './schema';

const importFileParser: Handler = async (event: S3Event): Promise<InvokeAsyncResponse> => {
  console.log(`New object created. Event: ${event}`);
  return {
    Status: 202,
  };
};

export const main = middyfy(importFileParser);
