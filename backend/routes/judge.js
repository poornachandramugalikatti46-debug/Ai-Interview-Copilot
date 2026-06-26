const express = require("express");
const router = express.Router();

const problems = require("../data/problems");

/* =========================
   RUN CODE API
========================= */
router.post("/run", (req, res) => {
  const { code, language, input } = req.body;

  if (language !== "javascript") {
    return res.json({ output: "Only JavaScript supported for now 🚀" });
  }

  try {
    // Extract function name
    const fnMatch = code.match(/function\s+([a-zA-Z0-9_]+)/);
    const fnName = fnMatch ? fnMatch[1] : "solution";

    // Safe input parsing
    let args = [];
    try {
      args = input ? JSON.parse(input) : [];
    } catch (e) {
      return res.json({ output: "Invalid Input Format (must be JSON)" });
    }

    const result = runJS(code, fnName, args);

    if (result.success) {
      return res.json({
        output: JSON.stringify(result.output),
      });
    }

    return res.json({
      output: result.error || "Execution Error",
    });
  } catch (err) {
    return res.json({
      output: "Runtime Error",
    });
  }
});

/* =========================
   SUBMIT CODE API
========================= */
router.post("/submit", (req, res) => {
  const { code, language, problemId } = req.body;

  if (language !== "javascript") {
    return res.json({ error: "Only JavaScript supported" });
  }

  const problem = problems.find((p) => p.id === problemId);

  if (!problem) {
    return res.json({ error: "Problem not found" });
  }

  const fnMatch = code.match(/function\s+([a-zA-Z0-9_]+)/);
  const fnName = fnMatch ? fnMatch[1] : "solution";

  const testcases =
    problem.hiddenTestcases || problem.testcases || [];

  if (!testcases.length) {
    return res.json({ error: "No test cases found" });
  }

  let passed = 0;

  for (let test of testcases) {
    try {
      const result = runJS(code, fnName, [
        test.input,
        test.target,
      ]);

      const isCorrect =
        result.success &&
        JSON.stringify(result.output) ===
          JSON.stringify(test.output);

      if (isCorrect) passed++;
    } catch (err) {
      // ignore single testcase crash
    }
  }

  const total = testcases.length;

  const score = Math.round((passed / total) * 10);

  return res.json({
    passed,
    total,
    score,
    time: Math.floor(Math.random() * 250),
    feedback:
      score === 10
        ? "Perfect Solution 🚀"
        : score >= 7
        ? "Good, optimize edge cases"
        : "Needs improvement in logic & complexity",
  });
});

module.exports = router;