import express from "express";
import { verifyJWT } from "../middleware/verify.js";

const router = express.Router();

import blogController from "../controllers/blog.controller.js";

router.post('/latest-blog', blogController.latestBlog);
router.post('/all-latest-blog-count', blogController.allLatestBlogCount);
router.get('/trending-blog', blogController.getTrendingBlog);
router.post('/filter-blog', blogController.filterBlog);
router.post('/filter-blog-count', blogController.filterBlogCount);
router.post("/search-blog", blogController.searchBlog);
router.post("/search-blog-count", blogController.searchBlogCount);
router.post("/create-blog", verifyJWT, blogController.createBlog);
router.post("/get-blog", blogController.getBlog);

export default router;

