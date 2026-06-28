require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");

const app = express();

/* ================= SECURITY ================= */
app.use(helmet());

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "https://ai-interview-copilot-frontend-ccwr.onrender.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= LOGGING ================= */
app.use(morgan("dev"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Interview Copilot Backend Running",
  });
});

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/* ================= DATABASE + SERVER ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });