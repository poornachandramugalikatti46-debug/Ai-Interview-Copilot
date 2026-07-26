import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.js";
import resumeRoutes from "./routes/resume.js";
import adminRoutes from "./routes/admin.js";
import settingsRoutes from "./routes/settings.js";
import analyticsRoutes from "./routes/analytics.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiReviewRoutes from "./routes/aiReviewRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

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
app.use("/api/judge", judgeRoutes);
app.use("/api/questions", questionRoutes);
app.use(
    "/api/judge",
    judgeRoutes
);
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
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use(notFound);
app.use(errorHandler);

const requestedPort = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

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
