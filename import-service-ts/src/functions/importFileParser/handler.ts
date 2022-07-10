import { middyfy } from '@libs/lambda';
import { Handler, S3Event } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';

import 'dotenv/config';

const importFileParser: Handler = async (event: S3Event): Promise<InvokeAsyncResponse> => {
  console.log('New object appeared in uploaded folder. Event.Records:', event.Records);
  try {
    const BUCKET = process.env.BUCKET;
    const SQS_URL = process.env.SQS_URL;
    const SQS_NAME = process.env.SQS_NAME;
    const s3 = new S3({ region: 'eu-west-1' });
    console.log("Bucket:", BUCKET);
    const record = event.Records[0];
    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      .createReadStream();

    const sqs = new SQS();
    console.log('####SQS_URL:', SQS_URL);

    // const sendToQueue = async (message: string) => {
    //   const SQS_Params = {
    //     MessageBody: message,
    //     QueueUrl: SQS_URL,
    //   };
    //   try {
    //     const result = await sqs.sendMessage(SQS_Params).promise();
    //     console.log("SQS Message send successfully....", result);
    //     return result;
    //   } catch (error) {
    //     console.error("Error in SQS send message: ", error.stack);
    //     return error;
    //   }
    // };

    // sqs.getQueueUrl({ QueueName: SQS_URL }, (res) => console.log('received URL:', res));

    var params = {
      QueueName: SQS_NAME
    };
    // sqs.getQueueUrl(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log('received URL:', data);           // successful response
    // });

    // Get QueueUrl (alternative way, as 'QueueUrl' in ref  "SQS_URL: { 'Fn::GetAtt': ['SQSQueue', 'QueueUrl'] }" officially unsupported by AWS" )
    let sqsUrlData = await sqs.getQueueUrl(params).promise();
    let SQS_URL1 = sqsUrlData.QueueUrl;
    console.log('SQS_URL1', SQS_URL1);

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
          // sendToQueue(JSON.stringify(data));
          sqs.sendMessage({
            MessageBody: JSON.stringify(data),
            QueueUrl: SQS_URL,
          }, () => console.log("SQS Message send successfully...."))
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

          console.log(`Deleting from ${BUCKET}/${srcObj}...`);
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
