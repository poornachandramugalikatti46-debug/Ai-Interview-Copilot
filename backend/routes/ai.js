import express from "express";
import Groq from "groq-sdk";
import Chat from "../models/Chat.js";

const router = express.Router();

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const systemPrompt = `
You are ChatGPT, a helpful AI assistant.

Rules:
- Give clear, correct answers
- Be natural and human-like
- Do not add extra formatting
`;

router.post("/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await Chat.create({
      sessionId,
      sender: "user",
      text: message,
    });

    const history = await Chat.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(20);

    const messages = [
      { role: "system", content: systemPrompt },

      ...history.map((h) => ({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text,
      })),

      { role: "user", content: message },
    ];

    if (!groq) {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable because GROQ_API_KEY is not configured",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.4,
      max_tokens: 800,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No response";

    await Chat.create({
      sessionId,
      sender: "ai",
      text: reply,
    });

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/history/:sessionId", async (req, res) => {
  try {
    const chats = await Chat.find({
      sessionId: req.params.sessionId,
    }).sort({ createdAt: 1 });

    res.json({ chats });
  } catch (err) {
    res.status(500).json({ error: "History error" });
  }
});

export default router;