import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },

    expectedOutput: {
      type: String,
      required: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ExampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "Python",
        "Java",
        "C++",
      ],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    company: {
      type: String,
      default: "General",
    },

    topic: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "Python",
    },

    description: {
      type: String,
      required: true,
    },

    examples: [ExampleSchema],

    constraints: [String],

    hint: {
      type: String,
      default: "",
    },

    starterCode: {
      type: String,
      default: "",
    },

    solution: {
      type: String,
      default: "",
    },

    testCases: [TestCaseSchema],

    timeComplexity: {
      type: String,
      default: "",
    },

    spaceComplexity: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      default: 10,
    },

    estimatedTime: {
      type: Number,
      default: 15,
    },

    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Question", QuestionSchema);