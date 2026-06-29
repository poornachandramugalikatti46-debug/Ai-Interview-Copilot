const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String, // "user" or "assistant"
  content: String,
  time: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  userId: String,

  title: {
    type: String,
    default: "New Chat"
  },

  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model("ChatSession", chatSessionSchema);