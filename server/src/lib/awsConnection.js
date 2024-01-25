import aws from 'aws-sdk';
import awsConfig from '../config/awsConfig.js';

function createS3Connection() {
  const s3 = new aws.S3(awsConfig);
  return s3;
}

export { createS3Connection };