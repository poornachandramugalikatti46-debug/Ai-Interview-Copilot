import express from "express";
import { runCode } from "../services/judge0.js";

const router = express.Router();

const testcases = [
  { input: "2 7 11 15\n9", output: "0 1" },
  { input: "3 2 4\n6", output: "1 2" },
];

router.post("/", async (req, res) => {
  const { code, language_id } = req.body;

  let passed = 0;

  for (let t of testcases) {
    const result = await runCode(code, language_id, t.input);

    const output = (result.stdout || "").trim();

    if (output === t.output) {
      passed++;
    }
  }

  const score = Math.round((passed / testcases.length) * 10);

  res.json({
    score,
    passed,
    total: testcases.length,
  });
});

export default router;