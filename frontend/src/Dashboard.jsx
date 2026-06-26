import { useState } from "react";

import Chatbot from "./Chatbot";
import ResumeAnalyzer from "./ResumeAnalyzer";
import SettingsPage from "./pages/settings/SettingsPage";
import Analytics from "./pages/Analytics";

// Pages (FIXED IMPORT - default export)
import TechnicalInterview from "/src/pages/technical/TechnicalInterview.jsx";
import HRInterview from "./pages/hr/HRInterview";
import MockInterview from "./pages/mock/MockInterview";
import ResumeInterview from "./pages/resume/ResumeInterview";

export default function Dashboard({
  setLoggedIn,
  currentPage,
  setCurrentPage,
}) {
  const [openChat, setOpenChat] = useState(false);
  const [openResume, setOpenResume] = useState(false);

  /* =========================
     POPUP ROUTES
  ========================= */
  if (openChat) {
    return <Chatbot setOpenChat={setOpenChat} />;
  }

  if (openResume) {
    return <ResumeAnalyzer setOpenResume={setOpenResume} />;
  }

  /* =========================
     PAGE ROUTES
  ========================= */
  if (currentPage === "settings") {
    return <SettingsPage />;
  }

  if (currentPage === "analytics") {
    return <Analytics setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "technical") {
    return <TechnicalInterview setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "hr") {
    return <HRInterview setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "mock") {
    return <MockInterview setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "resumeInterview") {
    return <ResumeInterview setCurrentPage={setCurrentPage} />;
  }

  /* =========================
     DASHBOARD UI
  ========================= */
  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🤖 AI Copilot</h2>

        <button
          style={styles.activeBtn}
          onClick={() => setCurrentPage("dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          style={styles.menuBtn}
          onClick={() => setOpenChat(true)}
        >
          🎤 Chatbot
        </button>

        <button
          style={styles.menuBtn}
          onClick={() => setCurrentPage("analytics")}
        >
          📊 Analytics
        </button>

        <button
          style={styles.menuBtn}
          onClick={() => setOpenResume(true)}
        >
          📄 Resume Analyzer
        </button>

        <button
          style={styles.menuBtn}
          onClick={() => setCurrentPage("settings")}
        >
          ⚙ Settings
        </button>

        <button
          style={styles.logout}
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.heading}>Welcome Back 👋</h1>
            <p style={styles.subtitle}>
              AI Interview Copilot Dashboard
            </p>
          </div>

          <div style={styles.avatar}>P</div>
        </div>

        {/* HERO CARD */}
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>
            AI Interview Copilot
          </h1>

          <p style={styles.heroText}>
            Practice Technical, HR, Mock & Resume Interviews 🚀
          </p>

          {/* FEATURE GRID */}
          <div style={styles.featureGrid}>
            <div
              style={styles.featureCard}
              onClick={() => setCurrentPage("technical")}
            >
              <h3 style={styles.cardTitle}>
                🧠 Technical Interview
              </h3>
              <p style={styles.cardText}>
                DSA, Coding & System Design Questions
              </p>
            </div>

            <div
              style={styles.featureCard}
              onClick={() => setCurrentPage("hr")}
            >
              <h3 style={styles.cardTitle}>
                👔 HR Interview
              </h3>
              <p style={styles.cardText}>
                Communication & Behavioral Questions
              </p>
            </div>

            <div
              style={styles.featureCard}
              onClick={() => setCurrentPage("mock")}
            >
              <h3 style={styles.cardTitle}>
                🧩 Mock Interview
              </h3>
              <p style={styles.cardText}>
                Real Interview Simulation Experience
              </p>
            </div>

            <div
              style={styles.featureCard}
              onClick={() => setCurrentPage("resumeInterview")}
            >
              <h3 style={styles.cardTitle}>
                📄 Resume Interview
              </h3>
              <p style={styles.cardText}>
                AI Questions Based on Resume
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "260px",
    background: "#111827",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "bold",
  },

  menuBtn: {
    padding: "14px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#1f2937",
    color: "white",
    textAlign: "left",
    fontSize: "15px",
  },

  activeBtn: {
    padding: "14px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#7c3aed",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
  },

  logout: {
    marginTop: "auto",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "42px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "18px",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  heroCard: {
    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
    padding: "35px",
    borderRadius: "24px",
    marginTop: "20px",
  },

  heroTitle: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  heroText: {
    color: "#e2e8f0",
    fontSize: "18px",
    marginBottom: "30px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  featureCard: {
    background: "rgba(255,255,255,0.12)",
    padding: "25px",
    borderRadius: "18px",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    transition: "0.3s",
  },

  cardTitle: {
    marginBottom: "10px",
    fontSize: "22px",
  },

  cardText: {
    color: "#e2e8f0",
    fontSize: "15px",
    lineHeight: "24px",
  },
};