// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import 'dotenv/config';
const BUCKET = process.env.BUCKET;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/',
          },
        ],
        existing: true,
      },
    },
  ],
};
