import mongoose from "mongoose";

const analyticsScoreSchema = new mongoose.Schema(
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
        "technical-interview",
        "hr-interview",
        "mock-interview",
        "resume-interview",
      ],
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

analyticsScoreSchema.index({
  user: 1,
  createdAt: -1,
});

export default mongoose.model(
  "AnalyticsScore",
  analyticsScoreSchema
);