import express from "express";
import upload from "../middleware/uploadResume.js";

import {
  startInterview,
  generateQuestion,
  submitAnswer,
  getReport,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

// Start Mock Interview
// POST /api/mock/start
router.post(
  "/start",
  upload.single("resume"),
  startInterview
);

// Generate Question
// POST /api/mock/question
router.post(
  "/question",
  generateQuestion
);

// Submit Answer
// POST /api/mock/answer
router.post(
  "/answer",
  submitAnswer
);

// Get Interview Report
// GET /api/mock/report/:id
router.get(
  "/report/:id",
  getReport
);

export default router;