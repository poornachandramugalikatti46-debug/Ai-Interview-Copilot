const { Resend } = require("resend");

/* =========================
   RESEND CONFIG
========================= */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =========================
   SEND WELCOME EMAIL
========================= */

const sendWelcomeEmail = async (
  userEmail,
  userName
) => {
  try {
    console.log("📩 Sending Welcome Email...");

    const response =
      await resend.emails.send({

        from:
          "AI Interview Copilot <onboarding@resend.dev>",

        to: userEmail,

        subject:
          "🚀 Welcome to AI Interview Copilot",

        html: `

        <div style="
          background:#020617;
          padding:40px;
          font-family:Arial,sans-serif;
          color:white;
        ">

          <div style="
            max-width:600px;
            margin:auto;
            background:#0f172a;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #1e293b;
          ">

            <!-- TOP -->

            <div style="
              background:linear-gradient(90deg,#7c3aed,#06b6d4);
              padding:35px;
              text-align:center;
            ">

              <h1 style="
                margin:0;
                font-size:34px;
                color:white;
              ">
                🚀 AI Interview Copilot
              </h1>

              <p style="
                margin-top:10px;
                color:#e0f2fe;
                font-size:16px;
              ">
                Smart AI Interview Preparation Platform
              </p>

            </div>

            <!-- BODY -->

            <div style="padding:40px;">

              <h2 style="
                color:#38bdf8;
                margin-bottom:20px;
                text-align:center;
              ">
                Welcome ${userName} 👋
              </h2>

              <p style="
                font-size:17px;
                line-height:1.8;
                color:#cbd5e1;
              ">
                Your account has been created successfully ✅
              </p>

              <p style="
                font-size:17px;
                line-height:1.8;
                color:#cbd5e1;
              ">
                You can now access powerful AI tools to improve your placement preparation and interview skills.
              </p>

              <!-- FEATURES -->

              <div style="
                margin-top:30px;
                background:#111827;
                border-radius:16px;
                padding:25px;
              ">

                <h3 style="
                  color:#06b6d4;
                  margin-bottom:20px;
                ">
                  ✨ Features Included
                </h3>

                <p>✅ AI Mock Interviews</p>

                <p>✅ Resume Analysis</p>

                <p>✅ Placement Preparation</p>

                <p>✅ Technical Interview Questions</p>

                <p>✅ HR Interview Practice</p>

                <p>✅ Performance Tracking</p>

              </div>

              <!-- BUTTON -->

              <div style="
                text-align:center;
                margin-top:35px;
              ">

                <a
                  href="http://localhost:5173"
                  style="
                    background:linear-gradient(90deg,#7c3aed,#06b6d4);
                    color:white;
                    text-decoration:none;
                    padding:16px 35px;
                    border-radius:12px;
                    font-size:18px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  Open AI Interview Copilot
                </a>

              </div>

              <!-- FOOTER -->

              <p style="
                margin-top:40px;
                color:#94a3b8;
                text-align:center;
                font-size:14px;
                line-height:1.7;
              ">

                Thank you for joining AI Interview Copilot ❤️
                <br />
                Keep learning. Keep growing. 🚀

              </p>

            </div>

          </div>

        </div>

        `,
      });

    console.log(
      "✅ WELCOME EMAIL SENT"
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

module.exports = sendWelcomeEmail;