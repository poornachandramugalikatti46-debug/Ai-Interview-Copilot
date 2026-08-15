import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
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
      enum: ["user", "admin", "student", "hr"],
      default: "user",
    },

    experience: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },

    gender: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

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

userSchema.index({ email: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

export default mongoose.model("User", userSchema);
