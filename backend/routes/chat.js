const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");
const Chat = require("../models/Chat");

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "allam-2-7b";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   CHAT AI ROUTE
========================= */

router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        reply: "Message and userId required ❌",
      });
    }

    console.log("📩 USER:", message);

    /* =========================
       FIND OR CREATE CHAT
    ========================= */

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({
        userId,
        messages: [],
      });
    }

    /* =========================
       SAVE USER MESSAGE
    ========================= */

    chat.messages.push({
      role: "user",
      content: message,
    });

    /* =========================
       CHAT HISTORY
    ========================= */

    const history = chat.messages
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    /* =========================
       PREMIUM SYSTEM PROMPT
    ========================= */
  
const systemPrompt = {
  role: "system",
  content: `
You are an AI Interview Copilot.

Answer the user's actual question directly and specifically.

CRITICAL RULES:
- Do not start with generic filler like "Sure", "Thank you", "Here is", or "Please provide the question".
- Do not ask a follow-up before answering.
- Do not repeat the user's question word-for-word.
- Answer directly and clearly.
- Use Markdown headings, short paragraphs, and bullets when helpful.
- Use a short code block only if the answer benefits from an example.
- Keep the response practical, professional, and easy to understand.
- If the question is "what is X", explain the definition, key points, and a simple example.
- If the question is coding or interview-related, give a correct, specific answer instead of a template.
`,
};




    /* =========================
       AI REQUEST
    ========================= */

    const completion = await groq.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,

      temperature: 0.2,

      max_tokens: 700,

      messages: [systemPrompt, ...history],
    });

    /* =========================
       AI RESPONSE
    ========================= */

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "No AI response";

    console.log("🤖 AI:", reply);

    /* =========================
       SAVE AI MESSAGE
    ========================= */

    chat.messages.push({
      role: "assistant",
      content: reply,
    });

    await chat.save();

    /* =========================
       FINAL RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {

    console.log("🔥 GROQ ERROR:", error);

    return res.status(500).json({
      success: false,
      reply: "AI Server Error ❌",
    });
  }
});

module.exports = router;