import express from "express";
import {
  startInterview,
  getInterview,
  saveCode,
  nextQuestion,
  previousQuestion,
  finishInterview,
  saveInterviewSession,
  getInterviewSessions,
  evaluateInterviewAnswer,
  improveInterviewAnswer,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.get("/sessions", getInterviewSessions);
router.post("/sessions", saveInterviewSession);
router.post("/evaluate", evaluateInterviewAnswer);
router.post("/improve", improveInterviewAnswer);
router.get("/:id", protect, getInterview);
router.put("/:id/save", protect, saveCode);
router.put("/:id/next", protect, nextQuestion);
router.put("/:id/previous", protect, previousQuestion);
router.put("/:id/finish", protect, finishInterview);

export default router;
