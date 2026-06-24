import React, { useState } from "react";

export default function HelpFeedback() {

  const [rating, setRating] =
    useState(4);

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        💬 Help & Feedback
      </h1>

      <div style={styles.grid}>

        {/* FAQ */}

        <div style={styles.card}>

          <h3>
            ❓ FAQ Section
          </h3>

          <p style={styles.text}>
            Find answers for common
            interview and account issues.
          </p>

          <button style={styles.button}>
            Open FAQ
          </button>

        </div>

        {/* CONTACT */}

        <div style={styles.card}>

          <h3>
            📞 Contact Support
          </h3>

          <p style={styles.text}>
            Need help? Contact our
            support team instantly.
          </p>

          <button style={styles.button}>
            Contact Now
          </button>

        </div>

        {/* REPORT BUG */}

        <div style={styles.card}>

          <h3>
            🐞 Report Bug
          </h3>

          <textarea
            placeholder="Describe the issue..."
            style={styles.textarea}
          />

          <button style={styles.redButton}>
            Submit Bug
          </button>

        </div>

        {/* FEEDBACK */}

        <div style={styles.card}>

          <h3>
            ✨ Send Feedback
          </h3>

          <textarea
            placeholder="Write your feedback..."
            style={styles.textarea}
          />

          <button style={styles.button}>
            Send Feedback
          </button>

        </div>

        {/* RATING */}

        <div style={styles.card}>

          <h3>
            ⭐ Rate Experience
          </h3>

          <div style={styles.ratingRow}>

            {[1,2,3,4,5].map((item) => (

              <div
                key={item}

                onClick={() =>
                  setRating(item)
                }

                style={{
                  ...styles.star,

                  background:
                    rating >= item
                      ? "#facc15"
                      : "rgba(255,255,255,0.08)",

                  color:
                    rating >= item
                      ? "#111827"
                      : "white",
                }}
              >

                ★

              </div>

            ))}

          </div>

        </div>

        {/* AI SUPPORT */}

        <div style={styles.aiCard}>

          <h2>
            🤖 AI Support Bot
          </h2>

          <p>
            Chat with our AI assistant
            for instant troubleshooting
            and interview guidance.
          </p>

          <button style={styles.aiButton}>
            Start AI Chat
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    color: "white",
    padding: "20px",
  },

  title: {
    fontSize: "34px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "24px",
  },

  card: {
    background:
      "rgba(255,255,255,0.05)",

    padding: "24px",

    borderRadius: "22px",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  aiCard: {
    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",

    padding: "28px",

    borderRadius: "24px",
  },

  text: {
    opacity: 0.7,
    marginTop: "10px",
    lineHeight: "1.6",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",

    marginTop: "16px",

    padding: "14px",

    borderRadius: "14px",

    border: "none",

    resize: "none",

    background:
      "rgba(255,255,255,0.06)",

    color: "white",
  },

  button: {
    marginTop: "18px",

    padding: "14px 20px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#06b6d4,#3b82f6)",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",
  },

  redButton: {
    marginTop: "18px",

    padding: "14px 20px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",
  },

  ratingRow: {
    display: "flex",
    gap: "14px",
    marginTop: "20px",
  },

  star: {
    width: "55px",
    height: "55px",

    borderRadius: "16px",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    cursor: "pointer",

    fontSize: "24px",

    fontWeight: "bold",
  },

  aiButton: {
    marginTop: "20px",

    padding: "14px 22px",

    border: "none",

    borderRadius: "14px",

    background: "white",

    color: "#111827",

    fontWeight: "bold",

    cursor: "pointer",
  },

};