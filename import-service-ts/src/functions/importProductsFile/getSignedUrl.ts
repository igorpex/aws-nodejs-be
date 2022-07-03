import * as AWS from 'aws-sdk';
import 'dotenv/config';

const s3 = new AWS.S3({ region: 'eu-west-1' });
const BUCKET = process.env.BUCKET
// const BUCKET = 'node-in-aws-catalog2';
const catalogPath = `uploaded/catalog.csv`;
const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
};

export const getSignedUrl = async () => {
    s3.getSignedUrl('putObject', params, (error, url) => {
        console.log("url from function: ", url);
        return url
    });
}