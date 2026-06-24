export default function MockInterview({
  setCurrentPage,
}) {
  return (
    <div
      style={{
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <button
        onClick={() => setCurrentPage("dashboard")}
      >
        Back
      </button>

      <h1>
        🧩 Mock Interview Working
      </h1>
    </div>
  );
}