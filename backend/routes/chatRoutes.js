const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/stream", chatController.streamChat);
router.post("/save", chatController.saveChat);
router.get("/all", chatController.getChats);

module.exports = router;