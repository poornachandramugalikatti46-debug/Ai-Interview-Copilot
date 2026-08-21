import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },

    expectedOutput: {
      type: String,
      required: true,
      trim: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    points: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    javascript: {
      type: String,
      default: "",
    },

    python: {
      type: String,
      default: "",
    },

    java: {
      type: String,
      default: "",
    },

    cpp: {
      type: String,
      default: "",
    },

    c: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const solutionSchema = new mongoose.Schema(
  {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    c: String,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "DSA",
        "Frontend",
        "Backend",
        "Full Stack",
        "React",
        "Node.js",
        "Python",
        "Java",
        "C++",
        "SQL",
      ],
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },

    language: [
      {
        type: String,
        enum: ["JavaScript", "Python", "Java", "C++", "C", "SQL"],
      },
    ],

    description: {
      type: String,
      required: true,
    },

    examples: [exampleSchema],

    constraints: [
      {
        type: String,
      },
    ],

    hint: {
      type: String,
      default: "",
    },

    starterCode: starterCodeSchema,

    solution: solutionSchema,

    testCases: {
      type: [testCaseSchema],
      validate: [
        {
          validator: function (value) {
            return value.length > 0;
          },
          message: "At least one test case is required.",
        },
      ],
    },

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
      default: 100,
      min: 0,
    },

    estimatedTime: {
      type: Number,
      default: 30,
    },

    companies: [
      {
        type: String,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    successfulSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search
questionSchema.index({ role: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ companies: 1 });

export default mongoose.model("Question", questionSchema);