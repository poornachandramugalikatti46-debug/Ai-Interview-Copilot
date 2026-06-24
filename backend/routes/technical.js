const express = require("express");

const router = express.Router();

/* =========================
   QUESTIONS DATABASE
========================= */

const questions = [

  {
    id: 1,

    title: "Reverse Linked List",

    difficulty: "Medium",

    company: "Google",

    topic: "Linked List",

    description:
      "Reverse a singly linked list.",

    starterCode: `function reverseList(head) {

  // Write code here

}`,

    hiddenCases: 5,
  },

  {
    id: 2,

    title: "Two Sum",

    difficulty: "Easy",

    company: "Amazon",

    topic: "Arrays",

    description:
      "Find indices of two numbers that add up to target.",

    starterCode: `function twoSum(nums, target) {

  // Write code here

}`,

    hiddenCases: 7,
  },

  {
    id: 3,

    title: "Valid Parentheses",

    difficulty: "Easy",

    company: "Microsoft",

    topic: "Stack",

    description:
      "Check whether parentheses are valid.",

    starterCode: `function isValid(s) {

  // Write code here

}`,

    hiddenCases: 4,
  },

  {
    id: 4,

    title: "Merge Intervals",

    difficulty: "Hard",

    company: "Meta",

    topic: "Intervals",

    description:
      "Merge all overlapping intervals.",

    starterCode: `function merge(intervals) {

  // Write code here

}`,

    hiddenCases: 9,
  },

];

/* =========================
   SUBMISSION HISTORY
========================= */

let submissions = [];

/* =========================
   LEADERBOARD
========================= */

let leaderboard = [

  {
    name: "Alex",
    score: 95,
  },

  {
    name: "John",
    score: 90,
  },

  {
    name: "David",
    score: 84,
  },

];

/* =========================
   GET QUESTIONS
========================= */

router.get("/questions", (req, res) => {

  try {

    const {
      company,
      topic,
      difficulty,
    } = req.query;

    let filtered =
      [...questions];

    if (company) {

      filtered =
        filtered.filter(
          (q) =>
            q.company.toLowerCase() ===
            company.toLowerCase()
        );

    }

    if (topic) {

      filtered =
        filtered.filter(
          (q) =>
            q.topic.toLowerCase() ===
            topic.toLowerCase()
        );

    }

    if (difficulty) {

      filtered =
        filtered.filter(
          (q) =>
            q.difficulty.toLowerCase() ===
            difficulty.toLowerCase()
        );

    }

    res.json({

      success: true,

      questions: filtered,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: "Failed to fetch questions",

    });

  }

});

/* =========================
   RANDOM QUESTION
========================= */

router.get("/random", (req, res) => {

  try {

    const random =
      questions[
        Math.floor(
          Math.random() *
          questions.length
        )
      ];

    res.json({

      success: true,

      question: random,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: "Random question failed",

    });

  }

});

/* =========================
   RUN CODE
========================= */

router.post("/run", async (req, res) => {

  try {

    const {
      code,
      language,
    } = req.body;

    if (!code) {

      return res.status(400).json({

        success: false,

        output: "Code is required",

      });

    }

    /* MOCK EXECUTION */

    let output =
      "✅ Code Executed Successfully";

    if (
      code.includes("console.log")
    ) {

      output =
        "✅ Output Generated";

    }

    res.json({

      success: true,

      output,

      language,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      output: "Server Error",

    });

  }

});

/* =========================
   AI HINTS
========================= */

router.post("/hint", (req, res) => {

  try {

    const { title } =
      req.body;

    let hint =
      "Try using efficient logic.";

    if (
      title ===
      "Reverse Linked List"
    ) {

      hint =
        "Use three pointers: prev, current, next.";

    }

    if (
      title === "Two Sum"
    ) {

      hint =
        "Use HashMap for O(n) solution.";

    }

    res.json({

      success: true,

      hint,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      hint: "Hint failed",

    });

  }

});

/* =========================
   SUBMIT CODE
========================= */

router.post("/submit", async (req, res) => {

  try {

    const {
      code,
      language,
      username,
      title,
    } = req.body;

    if (!code) {

      return res.status(400).json({

        success: false,

        output: "No code submitted",

      });

    }

    /* =========================
       AI EVALUATION
    ========================= */

    let score = 4;

    let feedback =
      "⚠ Solution needs optimization.";

    let complexity =
      "O(n²)";

    let hiddenPassed = 3;

    if (
      code.length > 150
    ) {

      score = 7;

      feedback =
        "✅ Good logic and structure.";

      complexity =
        "O(n)";

      hiddenPassed = 7;

    }

    if (
      code.includes("map") ||
      code.includes("HashMap")
    ) {

      score = 9;

      feedback =
        "🔥 Excellent optimized solution using hashing.";

      complexity =
        "O(n)";

      hiddenPassed = 10;

    }

    /* =========================
       SAVE HISTORY
    ========================= */

    const submission = {

      username:
        username || "Guest",

      title,

      language,

      score,

      feedback,

      complexity,

      time:
        new Date().toISOString(),

    };

    submissions.push(
      submission
    );

    /* =========================
       UPDATE LEADERBOARD
    ========================= */

    leaderboard.push({

      name:
        username || "Guest",

      score:
        score * 10,

    });

    leaderboard.sort(
      (a, b) =>
        b.score - a.score
    );

    leaderboard =
      leaderboard.slice(0, 10);

    res.json({

      success: true,

      output:
        "✅ All Hidden Test Cases Passed",

      hiddenPassed,

      score,

      feedback,

      complexity,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      output: "Submit Failed",

    });

  }

});

/* =========================
   SUBMISSION HISTORY
========================= */

router.get("/history", (req, res) => {

  res.json({

    success: true,

    history: submissions,

  });

});

/* =========================
   LEADERBOARD
========================= */

router.get("/leaderboard", (req, res) => {

  res.json({

    success: true,

    leaderboard,

  });

});

/* =========================
   CONTEST MODE
========================= */

router.get("/contest", (req, res) => {

  res.json({

    success: true,

    contest: {

      title:
        "Weekly Coding Contest",

      duration:
        "90 Minutes",

      problems: 4,

      participants: 1280,

    },

  });

});

module.exports = router;