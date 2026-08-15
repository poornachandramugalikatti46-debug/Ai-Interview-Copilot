import mongoose from "mongoose";

const analyticsActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    feature: {
      type: String,
      required: true,
      enum: [
        "dashboard",
        "chatbot",
        "technical-interview",
        "hr-interview",
        "mock-interview",
        "resume-analyzer",
        "resume-interview",
      ],
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    // User's local date
    dateKey: {
      type: String,
      required: true,
      index: true,
    },

    // User's local hour
    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
  },
  {
    timestamps: true,
  }
);

analyticsActivitySchema.index({
  user: 1,
  dateKey: 1,
});

analyticsActivitySchema.index({
  user: 1,
  feature: 1,
});

export default mongoose.model(
  "AnalyticsActivity",
  analyticsActivitySchema
);