import aws from 'aws-sdk';
import awsConfig from '../config/awsConfig.js';

const connectToAWS = () => {
  const s3 = new aws.S3(awsConfig);
  return s3;
}

export { connectToAWS };