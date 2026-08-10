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
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        feedback: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },

        confidence: {
          type: Number,
          default: 0,
        },

        fluency: {
          type: Number,
          default: 0,
        },

        grammar: {
          type: Number,
          default: 0,
        },

        improvement: {
          type: String,
          default: "",
        },
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["started", "in-progress", "completed"],
      default: "started",
    },

    questionLimit: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },

    currentQuestionNumber: {
      type: Number,
      default: 1,
    },

    conversation: [
      {
        role: {
          type: String,
        },

        content: {
          type: String,
        },
      },
    ],

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
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
