// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import 'dotenv/config';

// const SQS_ARN = process.env.SQS_ARN;
const SQS_ARN = 'arn:aws:sqs:eu-west-1:140107164220:import-service-ts-queue';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 2,
        arn: SQS_ARN,
      },
    },
  ],
};
