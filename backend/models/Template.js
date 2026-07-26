import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  title: String,
  role: String, // frontend/backend/fullstack

  questions: [String],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Template", templateSchema);