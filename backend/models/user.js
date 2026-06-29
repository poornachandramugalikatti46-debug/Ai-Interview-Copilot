const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================= */

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    experience: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },

    /* =========================
       AI MEMORY SYSTEM 🧠
    ========================= */

    memory: {
      strengths: [String],
      weaknesses: [String],
      interests: [String],
      preferredTopics: [String],

      interviewStyle: {
        type: String,
        enum: ["strict", "friendly", "mixed"],
        default: "friendly",
      },

      notes: {
        type: String,
        default: "",
      },
    },

    /* =========================
       INTERVIEW TRACKING 📊
    ========================= */

    interviews: [
      {
        topic: String,
        score: Number,
        feedback: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* =========================
       SECURITY 🔐
    ========================= */

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpire: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);