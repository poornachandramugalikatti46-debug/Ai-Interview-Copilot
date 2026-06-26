const express = require("express");
const router = express.Router();

const { voiceInterview } = require("../controllers/voiceController");

router.post("/talk", voiceInterview);

module.exports = router;