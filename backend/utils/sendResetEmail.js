const path = require("path");
const { Resend } = require("resend");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/* =========================
   RESEND CONFIG
========================= */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/* =========================
   SEND RESET PASSWORD EMAIL
========================= */

const sendResetEmail = async (
  userEmail,
  userName,
  resetLink
) => {
  try {
    if (!userEmail) {
      throw new Error("Recipient email is required");
    }

    if (!resetLink) {
      throw new Error("Reset link is required");
    }

    if (!resend) {
      throw new Error("RESEND_API_KEY is not configured in backend/.env");
    }

    console.log("📩 Sending reset password email to:", userEmail);

    const response = await resend.emails.send({
      from: "AI Interview Copilot <onboarding@resend.dev>",
      to: userEmail,
      subject: "🔐 Reset your AI Interview Copilot password",
      html: `
        <div style="background:#f3f4f6;padding:40px;font-family:Arial,sans-serif;">
          <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;">
            <div style="background:#2563eb;padding:30px;text-align:center;color:white;">
              <h1 style="margin:0;font-size:32px;">Reset Your Password</h1>
              <p style="margin-top:10px;font-size:16px;">AI Interview Copilot</p>
            </div>
            <div style="padding:30px;color:#111827;">
              <h2 style="margin-top:0;font-size:24px;">Hello ${userName || "User"},</h2>
              <p style="font-size:16px;line-height:1.8;color:#4b5563;">
                We received a request to reset your password. Click the button below to choose a new one.
              </p>
              <div style="text-align:center;margin:30px 0;">
                <a href="${resetLink}" style="display:inline-block;padding:16px 30px;background:#2563eb;color:white;text-decoration:none;border-radius:12px;font-weight:600;">Reset Password</a>
              </div>
              <p style="font-size:15px;line-height:1.8;color:#6b7280;">
                If the button does not work, copy and paste this link into your browser:
                <br /><a href="${resetLink}" style="color:#2563eb;word-break:break-all;">${resetLink}</a>
              </p>
              <p style="font-size:15px;line-height:1.8;color:#6b7280;">
                This link will expire in 15 minutes.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#4b5563;">
                If you did not request a password reset, please ignore this email.
              </p>
              <p style="margin-top:30px;font-size:15px;color:#4b5563;">Thanks,<br><strong>AI Interview Copilot Team</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ RESET PASSWORD EMAIL SENT");
    console.log(response);

    return response;
  } catch (error) {
    console.log("❌ RESET EMAIL ERROR:");
    console.log(error.message || error);
    throw error;
  }
};

/* =========================
   EXPORT
========================= */

module.exports = sendResetEmail;
