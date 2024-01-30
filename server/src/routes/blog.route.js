import express from "express";
import { verifyJWT } from "../middleware/verify.js";

const router = express.Router();

import blogController from "../controllers/blog.controller.js";

router.post("/create-blog", verifyJWT, blogController.store);

export default router;

