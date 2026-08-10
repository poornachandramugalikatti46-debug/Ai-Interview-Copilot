import mongoose from "mongoose";

/**
 * AI Review Schema
 */
const aiReviewSchema = new mongoose.Schema(
  {
    communication: {
      type: Number,
      default: 0,
    },
    grammar: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    overall: {
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
    feedback: {
      type: String,
      default: "",
    },
    betterAnswer: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/**
 * Interview Question Schema
 */
const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    aiReview: {
      type: aiReviewSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

/**
 * HR Interview Schema
 */
const hrInterviewSchema = new mongoose.Schema(
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

    experience: {
      type: String,
      default: "Fresher",
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    questions: {
      type: [questionSchema],
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
      default: 0, // seconds
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Calculate Duration Before Saving
 */
hrInterviewSchema.pre("save", function (next) {
  if (this.completed && !this.completedAt) {
    this.completedAt = new Date();

    this.duration = Math.floor(
      (this.completedAt.getTime() - this.startedAt.getTime()) / 1000
    );
  }

  next();
});

/**
 * Virtual: Average Communication Score
 */
hrInterviewSchema.virtual("averageCommunication").get(function () {
  if (!this.questions.length) return 0;

  const total = this.questions.reduce(
    (sum, q) => sum + (q.aiReview.communication || 0),
    0
  );

  return Math.round(total / this.questions.length);
});

/**
 * Virtual: Average Grammar Score
 */
hrInterviewSchema.virtual("averageGrammar").get(function () {
  if (!this.questions.length) return 0;

  const total = this.questions.reduce(
    (sum, q) => sum + (q.aiReview.grammar || 0),
    0
  );

  return Math.round(total / this.questions.length);
});

/**
 * Virtual: Average Confidence Score
 */
hrInterviewSchema.virtual("averageConfidence").get(function () {
  if (!this.questions.length) return 0;

  const total = this.questions.reduce(
    (sum, q) => sum + (q.aiReview.confidence || 0),
    0
  );

  return Math.round(total / this.questions.length);
});

/**
 * Virtual: Average Relevance Score
 */
hrInterviewSchema.virtual("averageRelevance").get(function () {
  if (!this.questions.length) return 0;

  const total = this.questions.reduce(
    (sum, q) => sum + (q.aiReview.relevance || 0),
    0
  );

  return Math.round(total / this.questions.length);
});

hrInterviewSchema.set("toJSON", {
  virtuals: true,
});

hrInterviewSchema.set("toObject", {
  virtuals: true,
});

const InterviewModel = mongoose.models.Interview || mongoose.model("Interview", hrInterviewSchema);

export default InterviewModel;