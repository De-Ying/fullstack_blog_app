import express from "express";

const router = express.Router();

import uploadController from "../controllers/upload.controller.js";

router.get("/s3Url", uploadController.getUploadUrl);


export default router;