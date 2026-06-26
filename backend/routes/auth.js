const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // SIMPLE DEMO AUTH
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const token = jwt.sign(
      { email },
      "secret",
      { expiresIn: "7d" }
    );

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
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ACCEPT ANY LOGIN
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const token = jwt.sign(
      { email },
      "secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful 🚀",
      token,
      user: {
        email,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;