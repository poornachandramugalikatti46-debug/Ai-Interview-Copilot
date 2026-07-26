import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    codingScore: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    speed: {
      type: Number,
      default: 0,
    },

    runtimeAverage: {
      type: String,
      default: "",
    },

    memoryAverage: {
      type: String,
      default: "",
    },

    strengths: [String],

    weaknesses: [String],

    recommendation: {
      type: String,
      enum: [
        "Strong Hire",
        "Hire",
        "Borderline",
        "No Hire",
      ],
      default: "Borderline",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", ReportSchema);