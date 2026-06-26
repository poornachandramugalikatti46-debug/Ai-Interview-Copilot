const { Resend } = require("resend");

/* =========================
   SAFE RESEND SETUP
========================= */

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY missing — reset email disabled");
}

/* =========================
   RESET PASSWORD EMAIL
========================= */

const sendResetEmail = async (userEmail, userName, resetLink) => {
  try {
    console.log("📩 Sending Reset Password Email...");
    console.log("TO:", userEmail);

    // Skip if resend not configured
    if (!resend) {
      console.log("⚠️ Skipping reset email (no RESEND_API_KEY)");
      console.log("Reset Link:", resetLink);
      return;
    }

    const response = await resend.emails.send({
      from: "AI Interview Copilot <onboarding@resend.dev>",
      to: userEmail,
      subject: "🔐 Reset Your Password - AI Interview Copilot",
      html: `
        <div style="font-family:Arial;background:#020617;padding:30px;color:white">

          <div style="max-width:600px;margin:auto;background:#0f172a;padding:30px;border-radius:16px">

            <h1 style="text-align:center;color:#38bdf8">
              🔐 Password Reset Request
            </h1>

            <h2 style="text-align:center">
              Hello ${userName} 👋
            </h2>

            <p style="text-align:center;color:#cbd5e1;font-size:16px">
              We received a request to reset your password.
            </p>

            <p style="text-align:center;color:#94a3b8">
              Click the button below to reset your password. This link will expire in 15 minutes.
            </p>

            <div style="text-align:center;margin-top:30px">
              <a href="${resetLink}"
                style="padding:14px 28px;background:#ef4444;color:white;
                text-decoration:none;border-radius:10px;font-weight:bold">
                Reset Password
              </a>
            </div>

            <p style="text-align:center;margin-top:30px;color:#64748b;font-size:12px">
              If you did not request this, you can ignore this email.
            </p>

            <p style="text-align:center;color:#475569;font-size:12px">
              © 2026 AI Interview Copilot
            </p>

          </div>

        </div>
      `,
    });

    console.log("✅ Reset email sent successfully");
    return response;

  } catch (error) {
    console.log("❌ Reset Email Error:", error.message);

    // IMPORTANT: do not crash backend
    return null;
  }
};

module.exports = sendResetEmail;