const problems = require("../data/problems");
const { executeCode } = require("../services/judgeService");
/* =========================
   RUN CODE (NO TEST CHECK)
========================= */
exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const output = await executeCode(code, language, "");

    res.json({ output });
  } catch (err) {
    res.status(500).json({ output: "Execution Error" });
  }
};

/* =========================
   SUBMIT CODE (FULL JUDGE)
========================= */
exports.submitCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    const problem = problems.find((p) => p.id === problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    let passed = 0;

    for (let t of problem.testcases) {
      const result = await executeCode(code, language, t.input);

      if (result.trim() === t.output.trim()) {
        passed++;
      }
    }

    const total = problem.testcases.length;

    const score = Math.round((passed / total) * 10);

    res.json({
      passed,
      total,
      score,
      time: Math.floor(Math.random() * 200), // mock runtime
      feedback:
        score === 10
          ? "Excellent solution 🚀"
          : score >= 7
          ? "Good, but can optimize"
          : "Needs improvement in logic",
    });
  } catch (err) {
    res.status(500).json({ message: "Submit error" });
  }
};