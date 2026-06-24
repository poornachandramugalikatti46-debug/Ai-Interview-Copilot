const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionId: String,
    title: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSession", sessionSchema);