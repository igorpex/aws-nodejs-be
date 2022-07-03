import { middyfy } from '@libs/lambda';
import { Handler, S3Event } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import * as AWS from 'aws-sdk';
import csv from 'csv-parser';

import 'dotenv/config';

const importFileParser: Handler = async (event: S3Event): Promise<InvokeAsyncResponse> => {
  console.log('New object appeared in uploaded folder. Event.Records:', event.Records);
  try {
    const BUCKET = process.env.BUCKET;
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    console.log("Bucket:", BUCKET);
    const record = event.Records[0];
    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      .createReadStream();

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('error', (error) => reject('ERROR: ' + error))
        .on('end', async () => {

          const srcObj = record.s3.object.key;
          const destObj = record.s3.object.key.replace('uploaded/', 'parsed/');

          console.log(`Copying from ${BUCKET}/${srcObj} to ${BUCKET}/${destObj}...`);
          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${srcObj}`,
              Key: destObj,
            })
            .promise();

          console.log(`Deleting from ${BUCKET}/${srcObj} to ${BUCKET}/${destObj}...`);
          await s3
            .deleteObject({
              Bucket: BUCKET,
              Key: srcObj,
            })
            .promise();

          console.log(`New object parsed and moved to ${BUCKET}/${destObj}`);
          resolve(() => { });
        });
    });

    return {
      Status: 202,
    };
  } catch {
    return {
      Status: 500,
    };
  }

};

export const main = middyfy(importFileParser);
