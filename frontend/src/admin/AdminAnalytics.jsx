export default function AdminAnalytics() {
  return (
    <div
      style={{
        background: "#111827",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
        marginTop: "20px",
      }}
    >
      <h2>📊 Analytics Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            background: "#1f2937",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h3>Total Users</h3>
          <h1>1,240</h1>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "220px",
            background: "#1f2937",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h3>AI Interviews</h3>
          <h1>3,420</h1>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "220px",
            background: "#1f2937",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h3>Resume Uploads</h3>
          <h1>860</h1>
        </div>
      </div>
    </div>
  );
}