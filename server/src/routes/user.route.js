import express from "express";

const router = express.Router();

import userController from "../controllers/user.controller.js";

router.post("/search-user", userController.searchUser);

export default router;