import express from "express";
const router = express.Router();
import { getUserId, getChatHistory,updateUserName } from "../controllers/chat.controller.js";

router.get("/username/:username", getUserId);
router.get("/getChatHistory", getChatHistory);
router.put("/updateUserName/:id", updateUserName);

export default router;
