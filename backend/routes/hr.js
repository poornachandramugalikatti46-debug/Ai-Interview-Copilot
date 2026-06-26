const express = require("express");
const Groq = require("groq-sdk");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/* =========================
   GROQ AI
========================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   MEMORY STORE (upgrade later to DB)
========================= */

const interviews = {};

/* =========================
   CONFIG
========================= */

const MAX_HISTORY = 12; // prevents token overload
const MAX_STEPS = 15;

/* =========================
   HR PERSONALITIES
========================= */

const hrStyles = {
  google: `
Friendly but analytical HR.
Focus: problem solving, clarity, growth mindset.
`,

  amazon: `
Leadership principle interviewer.
Focus: ownership, bias for action, pressure handling.
Asks deep follow-ups aggressively.
`,

  startup: `
Fast-paced founder-style interviewer.
Focus: execution, speed, real-world building.
`,

  strict: `
Cold HR.
Tests confidence, pressure handling, emotional stability.
`,
};

/* =========================
   START QUESTIONS
========================= */

const startQuestions = {
  google: "Tell me about yourself.",
  amazon: "Tell me about a time you handled pressure.",
  startup: "Why are you building projects?",
  strict: "Why should we hire you?",
};

/* =========================
   SAFE JSON PARSER
========================= */

function safeParse(raw) {
  try {
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
}

/* =========================
   TRIM MEMORY (IMPORTANT)
========================= */

function trimHistory(history) {
  if (history.length > MAX_HISTORY) {
    return history.slice(-MAX_HISTORY);
  }
  return history;
}

/* =========================
   START INTERVIEW
========================= */

router.post("/start", async (req, res) => {
  try {
    const { persona = "google" } = req.body;

    const interviewId = uuidv4();

    const question =
      startQuestions[persona] || startQuestions.google;

    interviews[interviewId] = {
      persona,
      history: [
        {
          role: "assistant",
          content: question,
        },
      ],
      step: 1,
      scoreHistory: [],
    };

    res.json({
      success: true,
      interviewId,
      question,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
});

/* =========================
   ANSWER (CORE ENGINE)
========================= */

router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    const interview = interviews[interviewId];

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    /* =========================
       STOP CONDITION
    ========================= */

    if (interview.step >= MAX_STEPS) {
      return res.json({
        success: true,
        completed: true,
        message: "Interview completed",
      });
    }

    /* =========================
       SAVE USER ANSWER
    ========================= */

    interview.history.push({
      role: "user",
      content: answer,
    });

    interview.history = trimHistory(interview.history);

    /* =========================
       SYSTEM PROMPT (REALISTIC HR)
    ========================= */

    const systemPrompt = `
You are a REAL HUMAN HR interviewer.

Behavior rules:
- Ask ONLY ONE question
- Never sound robotic
- Be natural like real interviewer
- Adapt based on candidate answer
- Sometimes pressure candidate
- Sometimes appreciate candidate
- Avoid repetition
- Focus on realism not perfection

Interview Style:
${hrStyles[interview.persona]}

You must respond ONLY in VALID JSON:

{
  "reply": "next HR question (one sentence only)",

  "analysis": {
    "communication": 1-10,
    "confidence": 1-10,
    "clarity": 1-10,
    "professionalism": 1-10,

    "strengths": ["..."],
    "improvements": ["..."],

    "hrThinking": "short HR thought",
    "betterAnswer": "improved version of candidate answer"
  }
}
`;

    /* =========================
       AI CALL (GROQ)
    ========================= */

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...interview.history,
      ],

      temperature: 0.8,
      max_tokens: 700,
    });

    const raw = completion.choices[0].message.content;

    console.log("RAW AI:", raw);

    /* =========================
       PARSE RESPONSE
    ========================= */

    let parsed = safeParse(raw);

    /* =========================
       FALLBACK (CRITICAL)
    ========================= */

    if (!parsed || !parsed.reply) {
      parsed = {
        reply:
          "Can you explain that with a real-world example?",

        analysis: {
          communication: 7,
          confidence: 7,
          clarity: 6,
          professionalism: 7,
          strengths: ["Attempted response"],
          improvements: ["Need more clarity"],
          hrThinking:
            "Candidate gave unclear structured answer.",
          betterAnswer:
            "Use STAR method (Situation, Task, Action, Result).",
        },
      };
    }

    /* =========================
       SAVE AI RESPONSE
    ========================= */

    interview.history.push({
      role: "assistant",
      content: parsed.reply,
    });

    interview.history = trimHistory(interview.history);

    /* =========================
       UPDATE SCORE TRACKING
    ========================= */

    interview.scoreHistory.push(parsed.analysis);

    interview.step++;

    /* =========================
       FINAL SCORE (optional aggregation)
    ========================= */

    const avgScore = () => {
      const scores = interview.scoreHistory;
      if (!scores.length) return null;

      const keys = [
        "communication",
        "confidence",
        "clarity",
        "professionalism",
      ];

      const avg = {};

      keys.forEach((k) => {
        avg[k] =
          scores.reduce((a, b) => a + (b[k] || 0), 0) /
          scores.length;
      });

      return avg;
    };

    res.json({
      success: true,

      completed: interview.step >= MAX_STEPS,

      nextQuestion: parsed.reply,

      analysis: parsed.analysis,

      averageScore: avgScore(),
    });
  } catch (error) {
    console.log("HR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI failed",
    });
  }
});

module.exports = router;