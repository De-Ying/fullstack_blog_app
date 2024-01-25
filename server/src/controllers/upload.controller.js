import { connectToAWS } from "../../src/lib/awsConnection.js";
import { nanoid } from "nanoid";

const generateUploadUrl = async () => {
  const s3 = connectToAWS();
  const date = new Date();
  const imageName = `${nanoid}-${date.getTime()}.jpeg`;

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: 'fullstack-blog-app-tutorial',
      Key: imageName,
      Expires: 1000,
      ContentType: "image/jpeg"
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating upload URL:', error);
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
