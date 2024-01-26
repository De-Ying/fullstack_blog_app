import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const awsConfig = {
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  signatureVersion: "v4"
};

