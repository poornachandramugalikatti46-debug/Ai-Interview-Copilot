import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const resumeInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      default: "Fresher",
      trim: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    questions: [
      {
        type: String,
      },
    ],

    answers: [answerSchema],

    currentQuestion: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    communication: {
      type: Number,
      default: 0,
    },

    technical: {
      type: Number,
      default: 0,
    },

    relevance: {
      type: Number,
      default: 0,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    resumeAccuracy: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    areasToImprove: {
      type: [String],
      default: [],
    },

    finalFeedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },
  },
  {
    timestamps: true,
  }
);

const ResumeInterview = mongoose.model(
  "ResumeInterview",
  resumeInterviewSchema
);

export default ResumeInterview;