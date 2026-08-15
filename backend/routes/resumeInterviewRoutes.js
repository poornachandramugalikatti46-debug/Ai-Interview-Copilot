import express from "express";

import uploadResume from "../middleware/uploadResume.js";

import {
  uploadResume as uploadResumeController,
  startResumeInterview,
  submitResumeAnswer,
  generateResumeInterviewReport,
  getResumeInterview,
} from "../controllers/resumeInterviewController.js";

const router = express.Router();

router.post(
  "/upload",
  uploadResume.single("resume"),
  uploadResumeController
);

router.post(
  "/start",
  startResumeInterview
);

router.post(
  "/answer",
  submitResumeAnswer
);

router.post(
  "/generate-report",
  generateResumeInterviewReport
);

router.get(
  "/:id",
  getResumeInterview
);

export default router;