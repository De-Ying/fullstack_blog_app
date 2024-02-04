import { connectToAWS } from "../../src/lib/awsConnection.js";
import { BUCKET_NAME } from "../config/awsConfig.js";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

const generateUploadUrl = async () => {
  const s3 = connectToAWS();

  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  try {
    const paranms = {
      Bucket: BUCKET_NAME,
      Key: imageName,
      Expires: 60,
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", paranms);
    return uploadUrl;
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw error;
  }
};

export default {
  async getUploadUrl(req, res) {
    try {
      const url = await generateUploadUrl();
      res.status(200).json({ uploadURL: url });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  },  
};
