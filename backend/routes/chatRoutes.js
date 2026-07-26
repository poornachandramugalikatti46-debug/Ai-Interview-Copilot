import express from "express";
import * as chatController from "../controllers/chatController.js";

const router = express.Router();

router.get("/stream", chatController.streamChat);
router.post("/save", chatController.saveChat);
router.get("/all", chatController.getChats);

export default router;