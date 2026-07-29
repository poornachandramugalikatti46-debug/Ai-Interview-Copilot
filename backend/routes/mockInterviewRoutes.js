import express from "express";
import upload from "../middleware/uploadResume.js";
import {
  startInterview,
  generateQuestion,
  submitAnswer,
  getReport,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

router.post("/start", upload.single("resume"), startInterview);

router.post("/question", generateQuestion);

router.post("/answer", submitAnswer);

router.get("/report/:id", getReport);

export default router;