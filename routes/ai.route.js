import express from "express";
const router = express.Router();
import { getAiResponse } from "../controllers/ai.contoller.js";

router.post("/getAiResponse", getAiResponse);

export default router;
