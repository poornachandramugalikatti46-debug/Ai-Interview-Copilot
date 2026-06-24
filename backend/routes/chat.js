const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");

/* =========================
   SEND MESSAGE TO AI
========================= */
router.post("/message", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // 1. Save user message
    await Chat.create({
      sessionId,
      sender: "user",
      text: message,
    });

    // 2. Get last messages (memory)
    const history = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    const formatted = history.map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    // 3. Call AI
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a strict technical interviewer. Ask questions and evaluate answers like a real interviewer.",
          },
          ...formatted,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    // 4. Save AI response
    await Chat.create({
      sessionId,
      sender: "assistant",
      text: aiText,
    });

    res.json({ reply: aiText });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

/* =========================
   GET CHAT HISTORY
========================= */
router.get("/:sessionId", async (req, res) => {
  const chats = await Chat.find({
    sessionId: req.params.sessionId,
  }).sort({ createdAt: 1 });

  res.json(chats);
});

module.exports = router;