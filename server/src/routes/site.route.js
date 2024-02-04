import express from "express";

const router = express.Router();

import siteController from "../controllers/site.controller.js";

router.get("/s3Url", siteController.getUploadUrl);
router.post("/search-blog", siteController.searchBlog);
router.post("/search-blog-count", siteController.searchBlogCount);

export default router;