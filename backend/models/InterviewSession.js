const mongoose = require("mongoose");

const InterviewSessionSchema = new mongoose.Schema(
  {
    userId: String,

    timeSpent: Number, // in seconds

    answers: [
      {
        topic: String,
        isCorrect: Boolean,
        responseTime: Number,
        hesitationCount: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InterviewSession",
  InterviewSessionSchema
);