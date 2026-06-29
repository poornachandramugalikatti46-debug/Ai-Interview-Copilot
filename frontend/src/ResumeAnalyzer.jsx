import { useState } from "react";
import axios from "axios";

export default function ResumeAnalyzer({ setOpenResume }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("resume");

  /* =========================
     ANALYZE RESUME
  ========================= */

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload resume PDF ❌");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5001/api/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data.analysis);
      setScore(res.data.score || 85);
    } catch (error) {
      console.log(error);
      alert("Resume analysis failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <h1 style={styles.logo}>🚀 AI Copilot</h1>

        {/* ✅ BACK TO DASHBOARD BUTTON (FIXED) */}
        <button
  onClick={() => setOpenResume(false)}
  style={{
    position: "absolute",
    top: "90px",
    left: "10px",
    padding: "8px 16px",
    fontSize: "11px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#94a3b8",
    color: "white",
    zIndex: 1000,
  }}
>
  ⬅ Back
</button>
        <button
          style={{
            ...styles.menuBtn,
            background:
              activeTab === "resume"
                ? "linear-gradient(90deg,#7c3aed,#06b6d4)"
                : "#111827",
          }}
          onClick={() => setActiveTab("resume")}
        >
          📄 Resume Analyzer
        </button>

        <button
          style={{
            ...styles.menuBtn,
            background:
              activeTab === "ats"
                ? "linear-gradient(90deg,#0ea5e9,#06b6d4)"
                : "#111827",
          }}
          onClick={() => setActiveTab("ats")}
        >
          📊 ATS Tracking
        </button>

        <button
          style={{
            ...styles.menuBtn,
            background:
              activeTab === "suggestions"
                ? "linear-gradient(90deg,#ec4899,#8b5cf6)"
                : "#111827",
          }}
          onClick={() => setActiveTab("suggestions")}
        >
          🤖 AI Suggestions
        </button>

        <button
          style={{
            ...styles.menuBtn,
            background:
              activeTab === "hiring"
                ? "linear-gradient(90deg,#f97316,#ef4444)"
                : "#111827",
          }}
          onClick={() => setActiveTab("hiring")}
        >
          💼 Hiring Insights
        </button>

        <button
          style={{
            ...styles.menuBtn,
            background:
              activeTab === "strength"
                ? "linear-gradient(90deg,#22c55e,#14b8a6)"
                : "#111827",
          }}
          onClick={() => setActiveTab("strength")}
        >
          🔥 Resume Strength
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>

        <h1 style={styles.title}>AI Resume Analyzer</h1>

        <p style={styles.subtitle}>
          Real-time ATS resume analysis with AI feedback 🚀
        </p>

        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <div style={styles.card}>
            <h2>Upload Your Resume</h2>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <p style={styles.file}>✅ {file.name}</p>
            )}

            <button
              style={styles.analyzeBtn}
              onClick={handleUpload}
            >
              {loading ? "Analyzing..." : "🚀 Analyze Resume"}
            </button>
          </div>
        )}

        {/* ATS TAB */}
        {activeTab === "ats" && (
          <div style={styles.card}>
            <h2>📊 ATS Score</h2>

            <div style={styles.scoreCircle}>
              {score}%
            </div>
          </div>
        )}

        {/* AI SUGGESTIONS */}
        {activeTab === "suggestions" && (
          <div style={styles.card}>
            <h2>🤖 AI Suggestions</h2>
            <ul style={styles.list}>
              <li>Add more technical skills</li>
              <li>Improve ATS keywords</li>
              <li>Add strong projects</li>
              <li>Use action words</li>
              <li>Keep resume clean</li>
            </ul>
          </div>
        )}

        {/* HIRING */}
        {activeTab === "hiring" && (
          <div style={styles.card}>
            <h2>💼 Hiring Insights</h2>

            <div style={styles.grid}>
              <div style={styles.infoBox}>
                <h3>Hiring Chance</h3>
                <p>87%</p>
              </div>

              <div style={styles.infoBox}>
                <h3>Interview Rate</h3>
                <p>76%</p>
              </div>

              <div style={styles.infoBox}>
                <h3>Recruiter Score</h3>
                <p>91%</p>
              </div>
            </div>
          </div>
        )}

        {/* STRENGTH */}
        {activeTab === "strength" && (
          <div style={styles.card}>
            <h2>🔥 Resume Strength</h2>

            <div style={styles.grid}>
              <div style={styles.infoBox}>Communication <h3>92%</h3></div>
              <div style={styles.infoBox}>Technical Skills <h3>88%</h3></div>
              <div style={styles.infoBox}>Projects <h3>81%</h3></div>
              <div style={styles.infoBox}>Leadership <h3>74%</h3></div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div style={styles.result}>
            <h2>🤖 AI Analysis</h2>
            <p>{result}</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "280px",
    background: "#0f172a",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  logo: {
    fontSize: "32px",
    marginBottom: "20px",
  },

  menuBtn: {
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
  },

  main: {
    flex: 1,
    padding: "40px",
  },

  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px",
  },

  card: {
    background: "#111827",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  analyzeBtn: {
    marginTop: "10px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#7c3aed",
    color: "white",
    cursor: "pointer",
  },

  file: {
    color: "#06b6d4",
    marginTop: "10px",
  },

  result: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "15px",
  },

  scoreCircle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "#06b6d4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    margin: "20px auto",
  },

  list: {
    lineHeight: "2",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  infoBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
  },
};