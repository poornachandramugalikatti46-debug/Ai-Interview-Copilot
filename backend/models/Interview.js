const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
  },
  score: Number,
  status: String, // pass/fail
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);