import express from "express";
const router = express.Router();
import { getChatHistory, deleteChat } from "../controllers/chat.controller.js";

router.get("/getChatHistory/userId/:id", getChatHistory);
router.delete("/deleteChat/chatId/:chatId/userId/:userId", deleteChat);

export default router;
