import express from "express";

const router = express.Router();

import authController from "../controllers/auth.controller.js";

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

export default router;