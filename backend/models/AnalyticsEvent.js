const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      default: null,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
