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

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Technical interview routes are working",
  });
});

router.post("/start", protect, startInterview);

router.get("/sessions", protect, getInterviewSessions);
router.post("/sessions", protect, saveInterviewSession);

router.post("/evaluate", protect, evaluateInterviewAnswer);
router.post("/improve", protect, improveInterviewAnswer);

router.get("/:id", protect, getInterview);
router.put("/:id/save", protect, saveCode);
router.put("/:id/next", protect, nextQuestion);
router.put("/:id/previous", protect, previousQuestion);
router.put("/:id/finish", protect, finishInterview);

export default router;
