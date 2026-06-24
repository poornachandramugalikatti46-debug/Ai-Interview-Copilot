const { Resend } = require("resend");

/* =========================
   RESEND CONFIG
========================= */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =========================
   WELCOME EMAIL
========================= */

const sendWelcomeEmail = async (
  userEmail,
  userName
) => {

  try {

    console.log(
      "📩 Sending Welcome Email..."
    );

    console.log(
      "TO:",
      userEmail
    );

    /* CHECK API KEY */

    if (
      !process.env.RESEND_API_KEY
    ) {

      throw new Error(
        "❌ RESEND_API_KEY Missing"
      );

    }

    /* SEND EMAIL */

    const response =
      await resend.emails.send({

        from:
          "AI Interview Copilot <onboarding@resend.dev>",

        to:
          userEmail,

        subject:
          "🎉 Welcome to AI Interview Copilot",

        html: `

        <div style="
          background:#020617;
          padding:40px 20px;
          font-family:Arial,sans-serif;
        ">

          <div style="
            max-width:650px;
            margin:auto;
            background:#0f172a;
            border-radius:24px;
            overflow:hidden;
            border:1px solid rgba(255,255,255,0.08);
          ">

            <!-- HEADER -->

            <div style="
              background:linear-gradient(90deg,#7c3aed,#06b6d4);
              padding:40px 20px;
              text-align:center;
            ">

              <h1 style="
                color:white;
                margin:0;
                font-size:34px;
              ">
                🚀 AI Interview Copilot
              </h1>

              <p style="
                color:white;
                margin-top:12px;
                font-size:17px;
              ">
                Smart AI Interview Preparation Platform
              </p>

            </div>

            <!-- CONTENT -->

            <div style="
              padding:40px;
              color:white;
            ">

              <h2 style="
                color:#06b6d4;
                margin-bottom:20px;
                font-size:28px;
              ">
                Welcome ${userName} 👋
              </h2>

              <p style="
                font-size:17px;
                line-height:30px;
                color:#e2e8f0;
              ">
                Your account has been created successfully 🎉
              </p>

              <p style="
                font-size:16px;
                line-height:28px;
                color:#cbd5e1;
              ">
                Welcome to <strong>AI Interview Copilot</strong>,
                your smart platform for interview preparation,
                resume analysis, placement preparation,
                and AI-powered mock interviews.
              </p>

              <!-- FEATURE BOX -->

              <div style="
                margin-top:30px;
                background:#111827;
                border-radius:16px;
                padding:25px;
              ">

                <h3 style="
                  color:#38bdf8;
                  margin-top:0;
                ">
                  🚀 Features You Can Use
                </h3>

                <p>✅ AI Mock Interviews</p>

                <p>✅ Resume ATS Analysis</p>

                <p>✅ Placement Preparation</p>

                <p>✅ Technical Interview Questions</p>

                <p>✅ HR Interview Practice</p>

                <p>✅ Career Guidance</p>

              </div>

              <!-- START BUTTON -->

              <div style="
                text-align:center;
                margin-top:40px;
              ">

                <a href="http://localhost:5173"
                  style="
                    background:linear-gradient(90deg,#06b6d4,#3b82f6);
                    color:white;
                    text-decoration:none;
                    padding:16px 32px;
                    border-radius:12px;
                    font-size:18px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  🚀 Start Preparing
                </a>

              </div>

              <!-- MESSAGE -->

              <p style="
                margin-top:40px;
                color:#94a3b8;
                line-height:28px;
                font-size:15px;
              ">
                We are excited to help you crack your dream job
                and improve your interview skills with AI 🚀
              </p>

            </div>

            <!-- FOOTER -->

            <div style="
              background:#020617;
              padding:20px;
              text-align:center;
            ">

              <p style="
                color:#64748b;
                margin:0;
                font-size:13px;
              ">
                © 2026 AI Interview Copilot ❤️
              </p>

            </div>

          </div>

        </div>

        `,
      });

    console.log(
      "✅ WELCOME EMAIL SENT SUCCESSFULLY"
    );

    console.log(response);

    return response;

  } catch (error) {

    console.log(
      "❌ EMAIL ERROR:"
    );

    console.log(
      error.message || error
    );

    throw error;

  }
};

/* =========================
   EXPORT
========================= */

module.exports =
  sendWelcomeEmail;