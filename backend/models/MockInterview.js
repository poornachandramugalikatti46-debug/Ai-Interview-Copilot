import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      required: true,
    },

    resumeName: {
      type: String,
      default: "",
    },

    resumeText: {
    type: String,
    default: "",
    },

    currentQuestion: {
      type: String,
      default: "",
    },

    questions: [
      {
        type: String,
      },
    ],

    answers: [
  {
    question: String,
    answer: String,
    feedback: String,
    score: Number,
    confidence: Number,
    fluency: Number,
    grammar: Number,
    improvement: String,
  },
],
conversation: [
  {
    role: String,
    content: String,
  },
],

    overallScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "started",
    },

    questionLimit: {
      type: Number,
      default: 20,
    },

    currentQuestionNumber: {
      type: Number,
      default: 1,
    },
    
    minimumQuestions: {
      type: Number,
      default: 5,
    },
    
    difficulty: {
      type: String,
      default: "Medium",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MockInterview", mockInterviewSchema);