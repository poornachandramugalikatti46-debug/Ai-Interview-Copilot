const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

/* EMAIL UTIL */
const sendWelcomeEmail = require("../utils/sendEmail");
const sendResetEmail = require("../utils/sendResetEmail");

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, role, experience, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields ❌",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      role,
      experience,
      password: hashedPassword,
    });

    // send welcome email (do not block response)
    sendWelcomeEmail(user.email, user.fullname).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Registration Successful ✅",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password ❌",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful ✅",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
});

/* =========================
   FORGOT PASSWORD (FIXED)
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required ❌",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    // 1. generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. hash token (store in DB)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. save to DB
    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // 4. frontend reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // 5. send email
    await sendResetEmail(user.email, user.fullname, resetLink);

    return res.json({
      success: true,
      message: "Reset email sent ✅",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Forgot Password Failed ❌",
    });
  }
});

/* =========================
   RESET PASSWORD (FIXED + SAFE)
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password required ❌",
      });
    }

    // hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token expired or invalid ❌",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful ✅",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Reset Password Failed ❌",
    });
  }
});

/* =========================
   CHANGE PASSWORD DIRECTLY
========================= */

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill all fields ❌",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully ✅",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });

  }
});
module.exports = router;