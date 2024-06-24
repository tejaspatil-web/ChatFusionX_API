import express from "express";
const router = express.Router();
import { getAiResponse } from "../controllers/ai.contoller.js";

router.get("/getAiResponse", getAiResponse);

export default router;
