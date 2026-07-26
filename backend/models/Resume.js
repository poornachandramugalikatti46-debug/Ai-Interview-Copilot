import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    content: String,
    feedback: String,
    score: Number,
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.model("Resume", resumeSchema);