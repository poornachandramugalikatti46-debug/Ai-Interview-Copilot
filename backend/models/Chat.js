const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: String,
  title: {
    type: String,
    default: "New Chat"
  },
  messages: [
    {
      role: String, // "user" | "assistant"
      content: String,
      time: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);