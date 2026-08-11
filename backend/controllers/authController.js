import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// REGISTER
// ===============================
export const registerUser = async (req, res) => {
  try {
    console.log("========== REGISTER ==========");
    console.log("BODY:", req.body);

    const {
      fullname,
      email,
      password,
      role,
      experience,
    } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullname || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // IMPORTANT:
    // Do NOT bcrypt.hash here.
    // User schema pre-save middleware will hash it.
    const user = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      password,
      role: role || "user",
      experience: experience || "fresher",
    });

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("❌ JWT_SECRET missing");
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ REGISTER SUCCESS:", user.email);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const loginUser = async (req, res) => {
  try {
    console.log("========== LOGIN ==========");
    console.log("LOGIN BODY:", req.body);

    const {
      email,
      password,
    } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Searching user:", normalizedEmail);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      console.log("❌ USER NOT FOUND:", normalizedEmail);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ USER FOUND:", user.email);
    console.log("Password hash exists:", !!user.password);

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ PASSWORD DOES NOT MATCH");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("❌ JWT_SECRET missing");
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    user.lastLogin = new Date();
    await user.save();

    console.log("✅ LOGIN SUCCESS:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ===============================
// CURRENT USER
// ===============================
export const getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      experience,
      role,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullname) {
      user.fullname = fullname.trim();
    }

    if (experience) {
      user.experience = experience;
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// CHANGE PASSWORD
// ===============================
export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // IMPORTANT:
    // Just assign the password.
    // User schema pre-save will hash it.
    user.password = newPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
