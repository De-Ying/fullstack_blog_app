import dotenv from "dotenv";

dotenv.config();

const awsConfig = {
  region: "ap-southeast-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export default awsConfig;
