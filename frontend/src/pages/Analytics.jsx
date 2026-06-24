import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Analytics({ setCurrentPage }) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = "demo-user-1";

  /* ✅ FETCH ANALYTICS */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching analytics...");

      const res = await axios.get(
        `http://localhost:5000/api/analytics/history/${userId}`
      );

      const result = res.data || [];

      setHistory(result);

      if (result.length > 0) {
        setData(result[result.length - 1]);
      } else {
        setData(null);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load analytics (check backend)");
    } finally {
      setLoading(false);
    }
  };

  /* ⚡ GENERATE AI ANALYTICS */
  const generateAI = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Generating AI analytics...");

      await axios.post("http://localhost:5000/api/analytics/generate", {
        userId,
        resumeText: "sample resume text",
      });

      await fetchData(); // refresh after generation
    } catch (err) {
      console.log(err);
      setError("AI generation failed (check backend API)");
    } finally {
      setLoading(false);
    }
  };

  /* 🔄 AUTO REFRESH */
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // safer refresh

    return () => clearInterval(interval);
  }, []);

  /* 📊 BAR CHART DATA */
  const barData = data
    ? [
        { name: "ATS", value: data.atsScore || 0 },
        { name: "Interview", value: data.interviewScore || 0 },
        { name: "Resume", value: data.resumeStrength || 0 },
        { name: "Job Ready", value: data.jobReadiness || 0 },
      ]
    : [];

  return (
    <div style={styles.page}>
      <h1>📊 AI Real-Time Analytics Dashboard</h1>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={generateAI} style={styles.btn}>
          ⚡ Generate AI Analytics
        </button>

        <button onClick={fetchData} style={styles.btn2}>
          🔄 Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LOADING */}
      {loading && <p>Loading analytics...</p>}

      {/* CARDS */}
      {data && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>ATS Score</h3>
            <h1>{data.atsScore}%</h1>
          </div>

          <div style={styles.card}>
            <h3>Interview Score</h3>
            <h1>{data.interviewScore}%</h1>
          </div>

          <div style={styles.card}>
            <h3>Resume Strength</h3>
            <h1>{data.resumeStrength}%</h1>
          </div>

          <div style={styles.card}>
            <h3>Job Readiness</h3>
            <h1>{data.jobReadiness}%</h1>
          </div>
        </div>
      )}

      {/* 📈 LINE CHART */}
      <div style={styles.chartBox}>
        <h2>📈 Live Performance Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString()
              }
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="interviewScore"
              stroke="#7c3aed"
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 BAR CHART */}
      {data && (
        <div style={styles.chartBox}>
          <h2>📊 Score Comparison</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🤖 FEEDBACK */}
      {data && (
        <div style={styles.feedback}>
          <h2>🤖 AI Feedback</h2>
          <p>{data.feedback || "No feedback available"}</p>
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => setCurrentPage("dashboard")}
        style={styles.back}
      >
        ⬅ Back
      </button>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    padding: "30px",
    background: "#020617",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Arial",
  },

  btn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#7c3aed",
    color: "white",
    cursor: "pointer",
  },

  btn2: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#0ea5e9",
    color: "white",
    cursor: "pointer",
  },

  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "15px",
  },

  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },

  chartBox: {
    marginTop: "30px",
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },

  feedback: {
    marginTop: "20px",
    padding: "20px",
    background: "#111827",
    borderRadius: "12px",
  },

  back: {
    marginTop: "20px",
    padding: "10px 15px",
    background: "#ef4444",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },
};