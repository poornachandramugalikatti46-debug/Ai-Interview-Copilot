import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.js";
import resumeRoutes from "./routes/resume.js";
import adminRoutes from "./routes/admin.js";
import settingsRoutes from "./routes/settings.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import technicalInterviewRoutes from "./routes/technicalInterviewRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiReviewRoutes from "./routes/aiReviewRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import path from "path";
import resumeInterviewRoutes from "./routes/resumeInterviewRoutes.js";
import { setupAnalyticsSocket } from "./sockets/analyticsSocket.js";

const app = express();

const FRONTEND_ORIGINS = (
  process.env.FRONTEND_ORIGINS ||
  "https://ai-interview-copilot-new.vercel.app,http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (FRONTEND_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/technical-interview", technicalInterviewRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/questions", questionRoutes);
app.use(
    "/api/submissions",
    submissionRoutes
);
app.use(
    "/api/reports",
    reportRoutes
);
app.use(
    "/api/ai-review",
    aiReviewRoutes
);
app.use("/api/mock", mockInterviewRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static(path.join("uploads")));
app.use("/api/resume-interview", resumeInterviewRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;

if (!process.env.VERCEL) {
  const requestedPort = Number(process.env.PORT) || 5000;

  const startServer = (port) => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: FRONTEND_ORIGINS,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      },
      path: "/socket.io",
    });

    setupAnalyticsSocket(io);

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("⚡ Socket disconnected:", socket.id);
      });
    });

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        const nextPort = port + 1;
        console.warn(`Port ${port} is already in use. Trying ${nextPort} instead...`);
        startServer(nextPort);
        return;
      }
      console.error("Server error:", err);
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  };

  startServer(requestedPort);
}
