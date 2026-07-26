const path = require("path");
const nodemailer = require("nodemailer");
const { Resend } = require("resend");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendWelcomeEmail = async (to, fullname) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    console.log("📧 Sending welcome email to:", to);

    if (resend) {
      const response = await resend.emails.send({
        from: "AI Interview Copilot <onboarding@resend.dev>",
        to,
        subject: "🎉 Welcome to AI Interview Copilot",
        html: `
      <div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:#f4f7fc;padding:30px;">
        <div style="background:#2563eb;padding:25px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;">🤖 AI Interview Copilot</h1>
          <p style="color:#e5e7eb;margin-top:10px;">Your AI-Powered Placement Preparation Platform</p>
        </div>
        <div style="background:#ffffff;padding:30px;border-radius:0 0 12px 12px;">
          <h2 style="color:#111827;">Hello ${fullname}, 👋</h2>
          <p style="font-size:16px;color:#374151;">Welcome to <b>AI Interview Copilot</b>! 🎉</p>
          <p style="font-size:15px;color:#4b5563;">Your account has been created successfully.</p>
          <h3 style="color:#2563eb;">You can now:</h3>
          <ul style="font-size:15px;line-height:30px;color:#374151;">
            <li>✅ Practice AI Mock Interviews</li>
            <li>✅ Analyze your Resume</li>
            <li>✅ Improve your ATS Score</li>
            <li>✅ Track your Interview Performance</li>
            <li>✅ Practice HR & Technical Interviews</li>
          </ul>
          <div style="text-align:center;margin-top:35px;">
            <a href="http://localhost:5173" style="background:#2563eb;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">🚀 Start Your Interview</a>
          </div>
          <hr style="margin:35px 0;">
          <p style="font-size:15px;color:#374151;">We wish you the very best in your placement journey.</p>
          <p style="font-size:15px;color:#374151;">Happy Learning! 🎉</p>
          <br>
          <p style="font-size:15px;color:#111827;">Regards,<br><b>AI Interview Copilot Team</b></p>
        </div>
      </div>
      `,
      });

      console.log("✅ Welcome email sent via Resend");
      return response;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER and EMAIL_PASS must be configured in the backend .env file");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"AI Interview Copilot" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🎉 Welcome to AI Interview Copilot",
      html: `
      <div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:#f4f7fc;padding:30px;">
        <div style="background:#2563eb;padding:25px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;">🤖 AI Interview Copilot</h1>
          <p style="color:#e5e7eb;margin-top:10px;">Your AI-Powered Placement Preparation Platform</p>
        </div>
        <div style="background:#ffffff;padding:30px;border-radius:0 0 12px 12px;">
          <h2 style="color:#111827;">Hello ${fullname}, 👋</h2>
          <p style="font-size:16px;color:#374151;">Welcome to <b>AI Interview Copilot</b>! 🎉</p>
          <p style="font-size:15px;color:#4b5563;">Your account has been created successfully.</p>
          <h3 style="color:#2563eb;">You can now:</h3>
          <ul style="font-size:15px;line-height:30px;color:#374151;">
            <li>✅ Practice AI Mock Interviews</li>
            <li>✅ Analyze your Resume</li>
            <li>✅ Improve your ATS Score</li>
            <li>✅ Track your Interview Performance</li>
            <li>✅ Practice HR & Technical Interviews</li>
          </ul>
          <div style="text-align:center;margin-top:35px;">
            <a href="http://localhost:5173" style="background:#2563eb;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">🚀 Start Your Interview</a>
          </div>
          <hr style="margin:35px 0;">
          <p style="font-size:15px;color:#374151;">We wish you the very best in your placement journey.</p>
          <p style="font-size:15px;color:#374151;">Happy Learning! 🎉</p>
          <br>
          <p style="font-size:15px;color:#111827;">Regards,<br><b>AI Interview Copilot Team</b></p>
        </div>
      </div>
      `,
    });

    console.log("✅ Welcome email sent via Gmail");
    console.log(info.response);
    return info;
  } catch (error) {
    console.log("❌ EMAIL ERROR");
    console.log(error.message || error);
    throw error;
  }
};

module.exports = sendWelcomeEmail;