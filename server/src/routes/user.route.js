import express from "express";

const router = express.Router();

import userController from "../controllers/user.controller.js";

router.post("/search-user", userController.searchUser);
router.post("/get-profile", userController.getProfile);

export default router;