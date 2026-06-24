export default function ResumeFeatureCards({
  score,
  skillsScore,
  keywordScore,
  projectScore,
}) {

  const hiringChance =
    score >= 85
      ? "95%"
      : score >= 75
      ? "82%"
      : score >= 65
      ? "70%"
      : "55%";

  return (

    <div style={styles.grid}>

      {/* RESUME SCAN */}

      <div style={styles.card}>

        <div style={styles.iconBox}>
          📄
        </div>

        <div>

          <h3 style={styles.title}>
            Resume Scan
          </h3>

          <p style={styles.desc}>
            AI scanned your resume successfully
          </p>

        </div>

      </div>

      {/* ATS SCORE */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(34,197,94,0.15)",
          }}
        >
          📊
        </div>

        <div>

          <h3 style={styles.title}>
            ATS Score
          </h3>

          <p style={styles.desc}>
            {score}% ATS Match Score
          </p>

        </div>

      </div>

      {/* AI SUGGESTIONS */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(168,85,247,0.15)",
          }}
        >
          🚀
        </div>

        <div>

          <h3 style={styles.title}>
            AI Suggestions
          </h3>

          <p style={styles.desc}>
            Smart improvement recommendations
          </p>

        </div>

      </div>

      {/* HIRING CHANCE */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(249,115,22,0.15)",
          }}
        >
          💼
        </div>

        <div>

          <h3 style={styles.title}>
            Hiring Chance
          </h3>

          <p style={styles.desc}>
            {hiringChance} recruiter selection chance
          </p>

        </div>

      </div>

      {/* SKILLS */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(6,182,212,0.15)",
          }}
        >
          🧠
        </div>

        <div>

          <h3 style={styles.title}>
            Skills Match
          </h3>

          <p style={styles.desc}>
            {skillsScore}% skill relevance
          </p>

        </div>

      </div>

      {/* KEYWORDS */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(236,72,153,0.15)",
          }}
        >
          🔍
        </div>

        <div>

          <h3 style={styles.title}>
            Keywords
          </h3>

          <p style={styles.desc}>
            {keywordScore}% ATS keyword optimization
          </p>

        </div>

      </div>

      {/* PROJECTS */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(234,179,8,0.15)",
          }}
        >
          🛠
        </div>

        <div>

          <h3 style={styles.title}>
            Projects
          </h3>

          <p style={styles.desc}>
            {projectScore}% project quality
          </p>

        </div>

      </div>

      {/* AI LEVEL */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(59,130,246,0.15)",
          }}
        >
          🤖
        </div>

        <div>

          <h3 style={styles.title}>
            AI Resume Level
          </h3>

          <p style={styles.desc}>
            Advanced Professional Resume
          </p>

        </div>

      </div>

    </div>
  );
}

const styles = {

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap: "20px",

    marginTop: "25px",
  },

  card: {

    background:
      "linear-gradient(135deg,#111827,#1e293b)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "22px",

    padding: "22px",

    display: "flex",

    alignItems: "center",

    gap: "18px",

    transition: "0.3s",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.35)",
  },

  iconBox: {

    width: "65px",

    height: "65px",

    borderRadius: "18px",

    background:
      "rgba(59,130,246,0.15)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "28px",
  },

  title: {

    color: "white",

    fontSize: "18px",

    marginBottom: "6px",
  },

  desc: {

    color: "#94a3b8",

    fontSize: "14px",

    lineHeight: "1.5",
  },
};