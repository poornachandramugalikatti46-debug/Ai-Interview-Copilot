import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
    },

    questionDbId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: false,
    },

    title: {
      type: String,
      default: "",
    },

    question: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      default: "Easy",
    },

    language: {
      type: [String],
      default: [],
    },

    examples: {
      type: Array,
      default: [],
    },

    constraints: {
      type: [String],
      default: [],
    },

    starterCode: {
      type: Object,
      default: {},
    },

    testCases: {
      type: Array,
      default: [],
    },

    solution: {
      type: Object,
      default: {},
    },

    userAnswer: {
      type: String,
      default: "",
    },

    submitted: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const technicalInterviewSchema = new mongoose.Schema(
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
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    questions: {
      type: [technicalQuestionSchema],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

technicalInterviewSchema.pre("save", function () {
  if (this.completed && !this.completedAt) {
    this.completedAt = new Date();

    if (this.startedAt) {
      this.duration = Math.floor(
        (this.completedAt.getTime() - this.startedAt.getTime()) / 1000
      );
    }
  }
});

export default mongoose.models.TechnicalInterview ||
  mongoose.model("TechnicalInterview", technicalInterviewSchema);
