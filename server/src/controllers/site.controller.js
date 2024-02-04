import { connectToAWS } from "../../src/lib/awsConnection.js";
import { BUCKET_NAME } from "../config/awsConfig.js";
import crypto from "crypto";
import { promisify } from "util";
import Blog from "../models/blog.model.js";

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

  async searchBlog(req, res) {
    try {
      const { tag, query, page } = req.body;

      if (!page || page < 1) {
        return res.status(400).json({ error: "Invalid page number" });
      }

      const maxLimit = 2;
      const skipCount = (page - 1) * maxLimit;

      let findQuery = { draft: false };

      if (tag) {
        findQuery.tags = tag;
      } else if (query) {
        findQuery.title = new RegExp(query, "i");
      }

      const blogs = await Blog.find(findQuery)
        .populate(
          "author",
          "personal_info.profile_img personal_info.username personal_info.fullname -_id"
        )
        .sort({ publishedAt: -1 })
        .select("blog_id title desc banner activity tags publishedAt -_id")
        .skip(skipCount)
        .limit(maxLimit);

      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async searchBlogCount(req, res) {
    try {
      const { tag, query } = req.body;

      let findQuery = { draft: false };

      if (tag) {
        findQuery.tags = tag;
      } else if (query) {
        findQuery.title = new RegExp(query, "i");
      }

      const count = await Blog.countDocuments(findQuery);

      return res.status(200).json({ totalDocs: count });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
