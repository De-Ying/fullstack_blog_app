import express from "express";
import { verifyJWT } from "../middleware/verify.js";

const router = express.Router();

import blogController from "../controllers/blog.controller.js";

router.get('/latest-blog', blogController.getLatestBlog);
router.get('/trending-blog', blogController.getTrendingBlog);
router.post("/create-blog", verifyJWT, blogController.createBlog);

export default router;

