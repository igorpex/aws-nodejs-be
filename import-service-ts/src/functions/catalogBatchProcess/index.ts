// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import 'dotenv/config';
// const SQS_ARN = 'arn:aws:sqs:eu-west-1:140107164220:catalogItemsQueue';
export default {
  // const SQS_ARN = process.env.SQS_ARN;
  // console.log('####catalogBatchProcess - SQS_ARN:', SQS_ARN);
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 2,
        arn: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
    },
  ],
};
