import express from "express";
import Question from "../models/Question.js";

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
router.post("/questions", async (req, res) => {
  try {
    const { role, experience, question_type, num_questions = 3, company = "" } = req.body;

    const filter = { isActive: true };

    if (role) filter.role = role;
    if (experience) filter.difficulty = experience;
    if (question_type) filter.role = question_type;
    if (company) filter.topic = company;

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: Number(num_questions) || 3 } },
      { $project: { solution: 0 } },
    ]);

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No interview questions found",
      });
    }

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id", protect, getInterview);

router.put("/:id/save", protect, saveCode);

router.put("/:id/next", protect, nextQuestion);

router.put("/:id/previous", protect, previousQuestion);

router.put("/:id/finish", protect, finishInterview);

export default router;