const express = require("express");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const router = express.Router();

/* =========================
   STORE OTP TEMP
========================= */

let storedOtp = "";
let storedEmail = "";

/* =========================
   SEND OTP
========================= */

router.post("/send-otp", async (req, res) => {

  try {

    const { email } = req.body;

    /* CHECK EMAIL */
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    /* GENERATE OTP */
    storedOtp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    storedEmail = email;

    console.log("📧 EMAIL:", email);
    console.log("🔐 OTP:", storedOtp);

    /* EMAIL TRANSPORT */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* SEND MAIL */
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>AI Interview Copilot</h2>
          <p>Your OTP Code is:</p>
          <h1>${storedOtp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP EMAIL SENT");

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully ✅",
    });

  } catch (error) {

    console.log("❌ OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed To Send OTP ❌",
      error: error.message,
    });
  }
});

/* =========================
   VERIFY OTP
========================= */

router.post("/verify-otp", (req, res) => {

  try {

    const { email, otp } = req.body;

    /* CHECK EMPTY */
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    /* VERIFY */
    if (email === storedEmail && otp === storedOtp) {

      console.log("✅ OTP VERIFIED");

      return res.status(200).json({
        success: true,
        message: "OTP Verified Successfully ✅",
      });
    }

    console.log("❌ INVALID OTP");

    res.status(400).json({
      success: false,
      message: "Invalid OTP ❌",
    });

  } catch (error) {

    console.log("❌ VERIFY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
});

/* =========================
   EXPORT
========================= */

module.exports = router;