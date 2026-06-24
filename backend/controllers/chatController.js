const Chat = require("../models/Chat");

// STREAM RESPONSE (SSE)
exports.streamChat = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const { message } = req.query;

  // fake AI response (replace with OpenAI/Groq later)
  const aiText = `You said: ${message}. This is streamed response from AI backend.`;

  let i = 0;

  const interval = setInterval(() => {
    if (i >= aiText.length) {
      res.write("data: [DONE]\n\n");
      clearInterval(interval);
      return;
    }

    res.write(`data: ${aiText[i]}\n\n`);
    i++;
  }, 30);
};

// SAVE CHAT
exports.saveChat = async (req, res) => {
  try {
    const { userId, message, reply } = req.body;

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: reply });

    await chat.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CHAT HISTORY
exports.getChats = async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
};