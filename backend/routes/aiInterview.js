import express from "express";
import { askAI } from "../services/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, question, language } = req.body;

  const reply = await askAI({
    code,
    question,
    language,
  });

  res.json({ reply });
});

export default router;