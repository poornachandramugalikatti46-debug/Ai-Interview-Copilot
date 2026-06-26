const { Resend } = require("resend");

/* =========================
   RESEND INIT (SAFE)
========================= */

const apiKey = process.env.RESEND_API_KEY;

let resend = null;

if (apiKey) {
  resend = new Resend(apiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY missing — email system disabled");
}

/* =========================
   SEND WELCOME EMAIL
========================= */

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log("📩 Welcome Email Triggered");
    console.log("TO:", userEmail);

    // SAFE EXIT IF NO RESEND
    if (!resend) {
      console.log("⚠️ Skipping email (Resend not configured)");
      return null;
    }

    if (!userEmail || !userName) {
      console.log("⚠️ Missing email or username");
      return null;
    }

    const response = await resend.emails.send({
      from: "AI Interview Copilot <onboarding@resend.dev>",
      to: userEmail,
      subject: "🚀 Welcome to AI Interview Copilot",
      html: `
        <div style="font-family:Arial,sans-serif;background:#020617;padding:30px;color:white">

          <div style="max-width:600px;margin:auto;background:#0f172a;padding:30px;border-radius:16px">

            <h1 style="text-align:center;color:#38bdf8">
              🚀 AI Interview Copilot
            </h1>

            <h2 style="text-align:center;margin-top:20px">
              Welcome ${userName} 👋
            </h2>

            <p style="text-align:center;color:#cbd5e1;font-size:16px">
              Your account is successfully created 🎉
            </p>

            <p style="text-align:center;color:#94a3b8;font-size:14px;line-height:1.6">
              Practice AI mock interviews, improve resume, and prepare for placements with smart AI assistance.
            </p>

            <div style="text-align:center;margin-top:30px">
              <a href="http://localhost:5173"
                style="padding:14px 28px;background:linear-gradient(90deg,#06b6d4,#3b82f6);
                color:white;text-decoration:none;border-radius:10px;font-weight:bold">
                Start Practicing
              </a>
            </div>

            <p style="text-align:center;margin-top:30px;color:#64748b;font-size:12px">
              © 2026 AI Interview Copilot. All rights reserved.
            </p>

          </div>

        </div>
      `,
    });

    console.log("✅ Welcome email sent");
    return response;

  } catch (error) {
    console.log("❌ Welcome Email Error:", error.message);
    return null; // NEVER crash backend
  }
};

module.exports = sendWelcomeEmail;