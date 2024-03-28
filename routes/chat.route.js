import express from "express";
const router = express.Router();
import { getUserId, getChatHistory } from "../controllers/chat.controller.js";

router.get("/username/:username", getUserId);
router.get("/getChatHistory", getChatHistory);

export default router;
