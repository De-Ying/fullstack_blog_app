import express from "express";

const router = express.Router();

import siteController from "../controllers/site.controller.js";

router.get("/s3Url", siteController.getUploadUrl);

export default router;