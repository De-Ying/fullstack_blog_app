import express from "express";

const router = express.Router();

import uploadController from "../controllers/upload.controller.js";

router.get("/get-upload-url", uploadController.getUploadUrl);


export default router;