import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: false,
      default: "",
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
    hesitationCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },
    role: {
      type: String,
      default: "",
    },
    questionType: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    numQuestions: {
      type: Number,
      default: 0,
    },
    avg_score: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [String],
      default: [],
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    evaluations: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
