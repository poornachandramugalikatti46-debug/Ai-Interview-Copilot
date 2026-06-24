import React, { useState } from "react";

export default function SecuritySettings() {

  const [twoFA, setTwoFA] =
    useState(true);

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        🔐 Sign In & Security
      </h1>

      <div style={styles.grid}>

        <div style={styles.card}>
          <h3>Email Address</h3>

          <input
            type="email"
            value="poorna@gmail.com"
            style={styles.input}
          />
        </div>

        <div style={styles.card}>
          <h3>Phone Number</h3>

          <input
            type="text"
            value="+91 9876543210"
            style={styles.input}
          />
        </div>

        <div style={styles.card}>
          <h3>Change Password</h3>

          <input
            type="password"
            placeholder="New Password"
            style={styles.input}
          />

          <button style={styles.button}>
            Update Password
          </button>
        </div>

        <div style={styles.card}>
          <h3>Two Factor Authentication</h3>

          <div
            onClick={() =>
              setTwoFA(!twoFA)
            }

            style={{
              ...styles.toggle,

              background:
                twoFA
                  ? "#22c55e"
                  : "#ef4444",
            }}
          >

            {twoFA
              ? "Enabled"
              : "Disabled"}

          </div>
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

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    marginTop: "14px",
    background:
      "rgba(255,255,255,0.06)",
    color: "white",
  },

  button: {
    marginTop: "16px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    color: "white",
    cursor: "pointer",
  },

  toggle: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "14px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "bold",
  },

};