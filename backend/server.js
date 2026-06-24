require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */

// Secure HTTP headers
app.use(helmet());

/* =========================
   RATE LIMITING
========================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/* =========================
   BODY PARSING
========================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================
   CORS (SAFE CONFIG)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* =========================
   LOGGING
========================= */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================
   REQUEST LOGGER
========================= */

app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

/* =========================
   TIMEOUT HANDLER
========================= */

app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    return res.status(408).json({
      success: false,
      message: "Request Timeout",
    });
  });
  next();
});

/* =========================
   ROUTES IMPORT
========================= */

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const resumeRoutes = require("./routes/resume");
const adminRoutes = require("./routes/admin");
const settingsRoutes = require("./routes/settings");
const otpRoutes = require("./routes/otpRoutes");
const analyticsRoutes = require("./routes/analytics");
const technicalRoutes =require("./routes/technical");
/* =========================
   ROUTES USE
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/technical",technicalRoutes);
/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Copilot Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Connecting MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    /* =========================
       GRACEFUL SHUTDOWN
    ========================= */

    const shutdown = async () => {
      console.log("🛑 Shutting down...");

      server.close(async () => {
        await mongoose.connection.close();
        console.log("🔌 DB disconnected");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();