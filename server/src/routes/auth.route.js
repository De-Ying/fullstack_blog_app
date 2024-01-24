import express from "express";

const router = express.Router();

import authController from "../controllers/auth.controller.js";

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google-auth", authController.googleAuth);

export default router;