import express from "express";

import {
  startInterview,
  getCurrentInterview,
  getQuestion,
  submitAnswer,
  finishInterview,
  getResult,
  getHistory,
} from "../controllers/hrController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ HR Routes Loaded");

/**
 * ===============================
 * HR Interview Routes
 * Base URL: /api/hr
 * ===============================
 */

/**
 * Health Check
 * GET /api/hr/test
 */
router.get("/test", (req, res) => {
  res.json({ success: true, message: "HR API Working" });
});

/**
 * Start Interview
 * POST /api/hr/start
 */
router.post("/start", protect, startInterview);

/**
 * Get Current Active Interview
 * GET /api/hr/current
 */
router.get("/current", protect, getCurrentInterview);

/**
 * Get Single Question
 * GET /api/hr/question/:id
 */
router.get("/question/:id", protect, getQuestion);

/**
 * Submit Answer
 * POST /api/hr/answer
 */
router.post("/answer", protect, submitAnswer);

/**
 * Submit Answer
 * POST /api/hr/submit-answer
 */
router.post("/submit-answer", protect, submitAnswer);

/**
 * Finish Interview
 * POST /api/hr/finish
 */
router.post("/finish", protect, finishInterview);

/**
 * Get Interview Result
 * GET /api/hr/result/:id
 */
router.get("/result/:id", protect, getResult);

/**
 * Get User Interview History
 * GET /api/hr/history
 */
router.get("/history", protect, getHistory);

export default router;