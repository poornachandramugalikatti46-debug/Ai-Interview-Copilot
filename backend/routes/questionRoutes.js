import express from "express";

import {
  getQuestions,
  getQuestionById,
  getRandomQuestions,
  getTopics,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

// Interview APIs
router.post("/random", getRandomQuestions);

router.get("/topics", getTopics);

// CRUD
router.get("/", getQuestions);

router.get("/:id", getQuestionById);

router.post("/", createQuestion);

router.put("/:id", updateQuestion);

router.delete("/:id", deleteQuestion);

export default router;