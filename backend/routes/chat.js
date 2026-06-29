const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");
const Chat = require("../models/Chat");

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
You are ChatGPT Pro style AI assistant.

RULES:

- Give short answers.
- Keep responses clean and modern.
- Avoid long paragraphs.
- Use headings.
- Use bullet points.
- Make answers easy to scan.
- Use simple English.
- Mobile friendly formatting.
- Premium SaaS UI style.
- Explain like ChatGPT.
- Keep definition only 1-2 lines.
- Add small example if needed.
- Avoid textbook style.
- No unnecessary details.
- Add spacing between sections.
- Make responses visually attractive.

RESPONSE FORMAT:

# Topic Name

Short simple explanation.

Example:

Python is a simple programming language.

Example Code:

print("Hello")

Features:
• Easy
• Fast
• Powerful

Uses:
• Web Development
• AI
• Automation

IMPORTANT:
- Never generate huge paragraphs.
- Keep answers concise.
- Easy readability is highest priority.
`,
};




    /* =========================
       AI REQUEST
    ========================= */

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

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