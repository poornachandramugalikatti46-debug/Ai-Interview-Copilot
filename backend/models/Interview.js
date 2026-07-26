import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },

    runtime: {
      type: String,
      default: "",
    },

    memory: {
      type: String,
      default: "",
    },

    passed: {
      type: Boolean,
      default: false,
    },

    passedTestCases: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    aiReview: {
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      feedback: String,
    },

    submittedAt: Date,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    answers: [answerSchema],

    currentQuestion: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Started",
        "Completed",
        "Expired",
      ],
      default: "Started",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,

    totalScore: {
      type: Number,
      default: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);