import express from "express";
const router = express.Router();
import {
  getUserId,
  getChatHistory,
  updateUserName,
  deleteChat,
} from "../controllers/chat.controller.js";

router.get("/username/:username", getUserId);
router.get("/getChatHistory/userId/:id", getChatHistory);
router.put("/updateUserName/:id", updateUserName);
router.delete("/deleteChat/chatId/:chatId/userId/:userId", deleteChat);

export default router;
