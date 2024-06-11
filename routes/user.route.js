import express from "express";
const router = express.Router();
import { getUserId, updateUserName } from "../controllers/user.controller.js";

router.get("/username/:username", getUserId);
router.put("/updateUserName/:id", updateUserName);

export default router;
