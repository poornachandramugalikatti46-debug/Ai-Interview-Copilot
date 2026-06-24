const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  atsScore: {
    type: Number,
    default: 0,
  },

  interviewScore: {
    type: Number,
    default: 0,
  },

  resumeStrength: {
    type: Number,
    default: 0,
  },

  jobReadiness: {
    type: Number,
    default: 0,
  },

  skills: {
    react: Number,
    node: Number,
    communication: Number,
    dsa: Number,
  },

  feedback: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);