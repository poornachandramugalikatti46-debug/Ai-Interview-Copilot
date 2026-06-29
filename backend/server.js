require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const app = express();

/* =========================
   SECURITY
========================= */
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];
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

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/technical", require("./routes/technical"));
app.use("/api/chat", require("./routes/chat"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 SaaS Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend healthy",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

/* =========================
   HTTP + SOCKET SERVER
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
/* =========================
   LIVE ANALYTICS ENGINE
========================= */

let liveAnalytics = {
  score: 65,
  stress: "MEDIUM",
};

let weekly = [
  { day: "Sun", hours: 2 },
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 1 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 6 },
];

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // send initial data
  socket.emit("live-update", liveAnalytics);
  socket.emit("weekly-update", weekly);

  const interval = setInterval(() => {
    /* =========================
       LIVE SCORE UPDATE
    ========================= */
    const change = Math.floor(Math.random() * 6 - 2);

    liveAnalytics.score = Math.max(
      0,
      Math.min(100, liveAnalytics.score + change)
    );

    liveAnalytics.stress =
      liveAnalytics.score > 75
        ? "LOW"
        : liveAnalytics.score > 40
        ? "MEDIUM"
        : "HIGH";

    /* =========================
       LIVE WEEKLY UPDATE
    ========================= */
    weekly = weekly.map((d) => ({
      ...d,
      hours: Math.max(
        0,
        Math.min(10, d.hours + (Math.random() * 2 - 1))
      ),
    }));

    socket.emit("live-update", liveAnalytics);
    socket.emit("weekly-update", weekly);
  }, 3000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("❌ User disconnected:", socket.id);
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

/* =========================
   DATABASE + SERVER START
========================= */
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("🔄 Connecting MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

start();