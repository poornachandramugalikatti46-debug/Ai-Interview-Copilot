const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    interviewId: {
      type: String,
      required: true,
      index: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["hr", "user"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],

    scores: {
      communication: {
        type: Number,
        default: 0,
      },
      confidence: {
        type: Number,
        default: 0,
      },
      clarity: {
        type: Number,
        default: 0,
      },
      technical: {
        type: Number,
        default: 0,
      },
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);