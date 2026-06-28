const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
  try {

    console.log("REGISTER ROUTE HIT");

    const { fullname, email, password } = req.body;

    /* VALIDATION */

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* CREATE TOKEN */

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    /* RESPONSE */

    res.status(201).json({
      success: true,
      message: "Registered successfully 🚀",
      token,
      user: {
        fullname,
        email,
      },
    });

  } catch (err) {

    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {

    console.log("LOGIN ROUTE HIT");

    const { email, password } = req.body;

    /* VALIDATION */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    /* CREATE TOKEN */

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    /* RESPONSE */

    res.status(200).json({
      success: true,
      message: "Login successful 🚀",
      token,
      user: {
        email,
      },
    });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
});

/* ================= TEST ROUTE ================= */

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working ✅",
  });
});

module.exports = router;