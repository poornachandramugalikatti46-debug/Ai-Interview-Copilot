import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const EMPTY_ANALYTICS = {
  todayMinutes: 0,
  weekMinutes: 0,
  monthMinutes: 0,
  streak: 0,
  readiness: 0,
  readinessTrend: 0,
  predictedPracticeMinutes: 0,
  predictedReadiness: 0,
  bestPracticeTime: "--",
  weekly: [],
  featureUsage: [],
  heatmap: [],
};

const Analytics = ({ setCurrentPage }) => {
  const [analytics, setAnalytics] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Analytics API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();

    const interval = setInterval(loadAnalytics, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading your interview analytics...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* =========================================
          HEADER
      ========================================= */}

      <div style={styles.header}>

        <div>
          <div style={styles.smallLabel}>
            AI INTERVIEW COPILOT
          </div>

          <h1 style={styles.title}>
            📊 My Interview Progress
          </h1>

          <p style={styles.subtitle}>
            Track your preparation, performance
            and AI-powered predictions
          </p>
        </div>

        <button
          onClick={() => setCurrentPage("dashboard")}
          style={styles.backButton}
        >
          ← Back
        </button>

      </div>

      {/* =========================================
          TOP STAT CARDS
      ========================================= */}

      <div style={styles.statsGrid}>

        <StatCard
          icon="⏱️"
          title="Today"
          value={`${analytics.todayMinutes} min`}
          subtitle="Practice time"
          badge="+18%"
        />

        <StatCard
          icon="📅"
          title="This Week"
          value={formatTime(
            analytics.weekMinutes
          )}
          subtitle="Total practice"
          badge="+23%"
        />

        <StatCard
          icon="🎯"
          title="Readiness"
          value={`${analytics.readiness}/100`}
          subtitle="Interview readiness"
          badge={`↑ ${analytics.readinessTrend}%`}
        />

        <StatCard
          icon="🔥"
          title="Practice Streak"
          value={`${analytics.streak} days`}
          subtitle="Keep the momentum"
          badge="ACTIVE"
        />

      </div>

      {/* =========================================
          MAIN CHART SECTION
      ========================================= */}

      <div style={styles.twoColumns}>

        {/* WEEKLY PRACTICE */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                📈 Practice Time
              </h2>

              <p style={styles.cardSubtitle}>
                Your activity during the last 7 days
              </p>
            </div>

            <div style={styles.chartBadge}>
              This Week
            </div>

          </div>

          <div style={styles.chartContainer}>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={analytics.weekly}
                margin={{
                  top: 20,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  stroke="#263149"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  unit="m"
                />

                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `${value} minutes`,
                    "Practice",
                  ]}
                />

                <Bar
                  dataKey="minutes"
                  radius={[
                    8,
                    8,
                    2,
                    2,
                  ]}
                  fill="#06b6d4"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* READINESS */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                🧠 Interview Readiness
              </h2>

              <p style={styles.cardSubtitle}>
                Your overall preparation level
              </p>
            </div>

            <div style={styles.readyBadge}>
              +{analytics.readinessTrend}%
            </div>

          </div>

          <div style={styles.readinessWrapper}>

            <div
              style={{
                ...styles.readinessCircle,
                background: `conic-gradient(
                  #06b6d4 ${analytics.readiness}%,
                  #1e293b ${analytics.readiness}%
                )`,
              }}
            >

              <div style={styles.readinessInner}>

                <div style={styles.readinessNumber}>
                  {analytics.readiness}
                </div>

                <div style={styles.readinessOutOf}>
                  / 100
                </div>

                <div style={styles.readinessLabel}>
                  READY
                </div>

              </div>

            </div>

          </div>

          <div style={styles.readinessMessage}>
            <span>🚀</span>

            <div>
              <strong>
                You're making strong progress!
              </strong>

              <p>
                Keep practicing consistently to
                reach the 85+ readiness level.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================
          FEATURE USAGE
      ========================================= */}

      <div style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <h2 style={styles.cardTitle}>
              ⏱️ Where You Spend Your Time
            </h2>

            <p style={styles.cardSubtitle}>
              See which AI Interview Copilot
              features you use the most
            </p>
          </div>

          <div style={styles.totalTime}>
            {formatTime(
              analytics.weekMinutes
            )}
          </div>

        </div>

        <div style={styles.featureList}>

          {analytics.featureUsage.map(
            (item, index) => {

              const maxMinutes = Math.max(
                ...analytics.featureUsage.map(
                  (x) => x.minutes
                )
              );

              const percentage =
                (item.minutes / maxMinutes) *
                100;

              return (
                <div
                  key={item.feature}
                  style={styles.featureRow}
                >

                  <div style={styles.featureInfo}>

                    <div style={styles.featureIcon}>
                      {getFeatureIcon(
                        item.feature
                      )}
                    </div>

                    <div>
                      <div style={styles.featureName}>
                        {getFeatureName(
                          item.feature
                        )}
                      </div>

                      <div
                        style={styles.featurePercentage}
                      >
                        {Math.round(
                          (item.minutes /
                            analytics.weekMinutes) *
                            100
                        )}
                        % of weekly time
                      </div>
                    </div>

                  </div>

                  <div style={styles.featureProgress}>

                    <div
                      style={{
                        ...styles.featureProgressFill,
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <div style={styles.featureMinutes}>
                    {formatTime(item.minutes)}
                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =========================================
          30 DAY ACTIVITY
      ========================================= */}

      <div style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <h2 style={styles.cardTitle}>
              📅 Practice Activity
            </h2>

            <p style={styles.cardSubtitle}>
              Your consistency during the last
              30 days
            </p>
          </div>

          <div style={styles.activityLegend}>
            <span>Less</span>

            <div
              style={{
                ...styles.legendBox,
                opacity: 0.15,
              }}
            />

            <div
              style={{
                ...styles.legendBox,
                opacity: 0.4,
              }}
            />

            <div
              style={{
                ...styles.legendBox,
                opacity: 0.7,
              }}
            />

            <div
              style={{
                ...styles.legendBox,
                opacity: 1,
              }}
            />

            <span>More</span>
          </div>

        </div>

        <div style={styles.heatmap}>

          {(analytics.heatmap || []).map((entry, index) => {
            const heatMinutes =
              typeof entry === "number"
                ? entry
                : Number(entry?.minutes ?? 0);

            const opacity = Number.isFinite(heatMinutes)
              ? Math.min(1, Math.max(0.1, 0.25 + heatMinutes / 100))
              : 0;

            return (
              <div
                key={index}
                style={{
                  ...styles.heatCell,
                  opacity,
                }}
                title={`${heatMinutes} minutes`}
              />
            );
          })}

        </div>

        <div style={styles.activityBottom}>
          <span>
            30 days ago
          </span>

          <span>
            Today
          </span>
        </div>

      </div>

      {/* =========================================
          AI PREDICTION
      ========================================= */}

      <div style={styles.aiCard}>

        <div style={styles.aiHeader}>

          <div style={styles.aiRobot}>
            🤖
          </div>

          <div>
            <h2 style={styles.aiTitle}>
              AI Practice Prediction
            </h2>

            <p style={styles.aiSubtitle}>
              Based on your recent preparation
              behavior
            </p>
          </div>

          <div style={styles.aiPowered}>
            AI POWERED
          </div>

        </div>

        <div style={styles.predictionGrid}>

          <PredictionCard
            icon="🕖"
            title="Best Practice Time"
            value={
              analytics.bestPracticeTime
            }
            description="When you're most active"
          />

          <PredictionCard
            icon="⏱️"
            title="Tomorrow's Practice"
            value={`${analytics.predictedPracticeMinutes} min`}
            description="Expected practice time"
          />

          <PredictionCard
            icon="🎯"
            title="Predicted Readiness"
            value={`${analytics.predictedReadiness}/100`}
            description="Next readiness estimate"
          />

        </div>

        {/* AI INSIGHT */}

        <div style={styles.aiInsight}>

          <div style={styles.insightIcon}>
            💡
          </div>

          <div>

            <div style={styles.insightTitle}>
              AI Insight
            </div>

            <div style={styles.insightText}>
              You are most consistent when
              practicing in the evening. A
              40–45 minute session tomorrow
              could help maintain your current
              momentum.
            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          PERFORMANCE BREAKDOWN
      ========================================= */}

      <div style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <h2 style={styles.cardTitle}>
              🎯 Skill Performance
            </h2>

            <p style={styles.cardSubtitle}>
              Areas you should focus on
            </p>
          </div>

        </div>

        <div style={styles.skillsGrid}>

          <Skill
            icon="💻"
            name="Technical"
            score={82}
          />

          <Skill
            icon="🗣️"
            name="Communication"
            score={79}
          />

          <Skill
            icon="🤝"
            name="HR Interview"
            score={74}
          />

          <Skill
            icon="📄"
            name="Resume"
            score={81}
          />

        </div>

      </div>

    </div>
  );
};


/* =========================================
   STAT CARD
========================================= */

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  badge,
}) => {
  return (
    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>

        <div style={styles.statTop}>

          <span style={styles.statTitle}>
            {title}
          </span>

          <span style={styles.statBadge}>
            {badge}
          </span>

        </div>

        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statSubtitle}>
          {subtitle}
        </div>

      </div>

    </div>
  );
};


/* =========================================
   PREDICTION CARD
========================================= */

const PredictionCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div style={styles.predictionCard}>

      <div style={styles.predictionIcon}>
        {icon}
      </div>

      <div>

        <div style={styles.predictionTitle}>
          {title}
        </div>

        <div style={styles.predictionValue}>
          {value}
        </div>

        <div style={styles.predictionDescription}>
          {description}
        </div>

      </div>

    </div>
  );
};


/* =========================================
   SKILL
========================================= */

const Skill = ({
  icon,
  name,
  score,
}) => {
  return (
    <div style={styles.skillCard}>

      <div style={styles.skillTop}>

        <div style={styles.skillName}>
          <span>
            {icon}
          </span>

          {name}
        </div>

        <strong>
          {score}
        </strong>

      </div>

      <div style={styles.skillProgress}>

        <div
          style={{
            ...styles.skillProgressFill,
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  );
};


/* =========================================
   HELPERS
========================================= */

const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};


const getFeatureName = (feature) => {
  const names = {
    "technical-interview":
      "Technical Interview",

    chatbot:
      "AI Chatbot",

    "mock-interview":
      "Mock Interview",

    "hr-interview":
      "HR Interview",

    "resume-analyzer":
      "Resume Analyzer",

    "resume-interview":
      "Resume Interview",
  };

  return names[feature] || feature;
};


const getFeatureIcon = (feature) => {
  const icons = {
    "technical-interview": "💻",
    chatbot: "🤖",
    "mock-interview": "🎤",
    "hr-interview": "🤝",
    "resume-analyzer": "📄",
    "resume-interview": "📋",
  };

  return icons[feature] || "⚡";
};


/* =========================================
   STYLES
========================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #050816 0%, #0b1120 50%, #080d1c 100%)",
    color: "#ffffff",
    padding: "35px 5%",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    gap: "20px",
  },

  smallLabel: {
    color: "#06b6d4",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },

  backButton: {
    border: "1px solid #334155",
    background: "#111827",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  statCard: {
    background:
      "linear-gradient(145deg, #111827, #0f172a)",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)",
  },

  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#172033",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "26px",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  statTitle: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
  },

  statBadge: {
    fontSize: "10px",
    color: "#22c55e",
    background: "rgba(34,197,94,0.1)",
    padding: "4px 7px",
    borderRadius: "6px",
    fontWeight: "700",
  },

  statValue: {
    fontSize: "27px",
    fontWeight: "800",
    marginTop: "5px",
  },

  statSubtitle: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "3px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.5fr) minmax(320px, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background:
      "linear-gradient(145deg, #111827, #0f172a)",
    border: "1px solid #1e293b",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.12)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },

  cardSubtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  chartBadge: {
    background: "rgba(6,182,212,0.1)",
    color: "#22d3ee",
    border: "1px solid rgba(6,182,212,0.2)",
    borderRadius: "8px",
    padding: "7px 11px",
    fontSize: "11px",
    fontWeight: "600",
  },

  chartContainer: {
    width: "100%",
    height: "320px",
    marginTop: "20px",
  },

  readyBadge: {
    color: "#22c55e",
    background: "rgba(34,197,94,0.1)",
    padding: "7px 11px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },

  readinessWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "28px 0",
  },

  readinessCircle: {
    width: "190px",
    height: "190px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    boxSizing: "border-box",
  },

  readinessInner: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  readinessNumber: {
    fontSize: "48px",
    fontWeight: "900",
  },

  readinessOutOf: {
    color: "#64748b",
    fontSize: "13px",
    marginTop: "-7px",
  },

  readinessLabel: {
    color: "#22d3ee",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginTop: "7px",
  },

  readinessMessage: {
    display: "flex",
    gap: "12px",
    background: "rgba(6,182,212,0.06)",
    border: "1px solid rgba(6,182,212,0.12)",
    borderRadius: "12px",
    padding: "14px",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  totalTime: {
    color: "#22d3ee",
    fontWeight: "700",
  },

  featureList: {
    marginTop: "28px",
  },

  featureRow: {
    display: "grid",
    gridTemplateColumns:
      "220px minmax(100px, 1fr) 70px",
    gap: "18px",
    alignItems: "center",
    marginBottom: "20px",
  },

  featureInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  featureIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#172033",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },

  featureName: {
    fontSize: "13px",
    fontWeight: "600",
  },

  featurePercentage: {
    color: "#64748b",
    fontSize: "10px",
    marginTop: "3px",
  },

  featureProgress: {
    height: "9px",
    background: "#1e293b",
    borderRadius: "20px",
    overflow: "hidden",
  },

  featureProgressFill: {
    height: "100%",
    borderRadius: "20px",
    background:
      "linear-gradient(90deg, #06b6d4, #8b5cf6)",
  },

  featureMinutes: {
    textAlign: "right",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
  },

  activityLegend: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "10px",
  },

  legendBox: {
    width: "12px",
    height: "12px",
    background: "#06b6d4",
    borderRadius: "3px",
  },

  heatmap: {
    display: "grid",
    gridTemplateColumns:
      "repeat(15, minmax(15px, 1fr))",
    gap: "7px",
    marginTop: "25px",
    maxWidth: "700px",
  },

  heatCell: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: "4px",
    background:
      "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    transition:
      "transform 0.2s ease",
  },

  activityBottom: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "700px",
    color: "#475569",
    fontSize: "10px",
    marginTop: "10px",
  },

  aiCard: {
    background:
      "linear-gradient(135deg, #0f172a, #111c35, #15133b)",
    border: "1px solid #29365c",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "20px",
    boxShadow:
      "0 15px 45px rgba(59,130,246,0.08)",
  },

  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  aiRobot: {
    width: "55px",
    height: "55px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
  },

  aiTitle: {
    margin: 0,
    fontSize: "22px",
  },

  aiSubtitle: {
    color: "#94a3b8",
    margin: "5px 0 0",
    fontSize: "13px",
  },

  aiPowered: {
    marginLeft: "auto",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,0.3)",
    background: "rgba(167,139,250,0.08)",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  predictionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "25px",
  },

  predictionCard: {
    display: "flex",
    gap: "13px",
    alignItems: "center",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "15px",
    padding: "18px",
  },

  predictionIcon: {
    fontSize: "25px",
  },

  predictionTitle: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  predictionValue: {
    fontSize: "18px",
    fontWeight: "800",
    marginTop: "4px",
  },

  predictionDescription: {
    color: "#475569",
    fontSize: "10px",
    marginTop: "3px",
  },

  aiInsight: {
    display: "flex",
    gap: "14px",
    marginTop: "18px",
    padding: "18px",
    borderRadius: "14px",
    background:
      "rgba(6,182,212,0.06)",
    border:
      "1px solid rgba(6,182,212,0.1)",
  },

  insightIcon: {
    fontSize: "22px",
  },

  insightTitle: {
    color: "#22d3ee",
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "5px",
  },

  insightText: {
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  skillsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px",
    marginTop: "22px",
  },

  skillCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    padding: "17px",
  },

  skillTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  skillName: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
  },

  skillProgress: {
    height: "7px",
    background: "#1e293b",
    borderRadius: "20px",
    overflow: "hidden",
  },

  skillProgressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #06b6d4, #8b5cf6)",
    borderRadius: "20px",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#070b18",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
  },

  loadingSpinner: {
    width: "35px",
    height: "35px",
    border:
      "3px solid #1e293b",
    borderTop:
      "3px solid #06b6d4",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite",
  },
};

export default Analytics;