export default function ResumeManager() {

  return (
    <div style={styles.page}>

      <h1>📄 Resume Manager</h1>

      <div style={styles.card}>

        <p>✅ Resume Uploaded</p>

        <p>ATS Score: 88%</p>

        <button style={styles.button}>
          Upload New Resume
        </button>

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "40px",
  },

  card: {
    background: "#111827",
    padding: "25px",
    borderRadius: "20px",
    maxWidth: "500px",
  },

  button: {
    marginTop: "15px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#06b6d4",
    color: "white",
    cursor: "pointer",
  },
};