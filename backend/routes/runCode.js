import express from "express";
import { runCode } from "../services/judge0.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code, language_id, input } = req.body;

    const result = await runCode(code, language_id, input);

    res.json({
      output: result.stdout,
      error: result.stderr,
      status: result.status.description,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;