const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    content: String,
    feedback: String,
    score: Number,
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Resume", resumeSchema);