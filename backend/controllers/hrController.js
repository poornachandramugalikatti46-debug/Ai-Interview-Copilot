const { v4: uuidv4 } = require("uuid");
const Interview = require("../models/Interview");

// ✅ FIXED SAFE IMPORT (prevents "askAI is not a function")
const aiService = require("../services/aiService");
const askAI = aiService.askAI;

/* =========================
   SAFE JSON PARSER
========================= */

const safeJSON = (text) => {
  try {
    if (!text || typeof text !== "string") return null;

    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    console.log("❌ JSON PARSE ERROR:", text);
    return null;
  }
};

/* =========================
   FALLBACK QUESTIONS
========================= */

const fallbackQuestions = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "Explain your strongest project.",
  "Tell me about a challenge you solved.",
  "What are your strengths and weaknesses?",
  "Where do you see yourself in 5 years?",
  "Why do you want this role?",
  "Tell me about your teamwork experience.",
  "How do you handle pressure?",
  "Describe a difficult bug you fixed.",
];

/* =========================
   DEFAULT ANALYSIS
========================= */

const defaultAnalysis = {
  communication: 5,
  confidence: 5,
  clarity: 5,
  technical: 5,
  strengths: [],
  weaknesses: [],
  improvements: [],
  hrThinking: "Basic HR evaluation",
  betterAnswer: "Use STAR method with examples",
};

/* =========================
   START INTERVIEW
========================= */

exports.startInterview = async (req, res) => {
  try {
    const interviewId = uuidv4();

    const prompt = `
You are a strict HR interviewer for a fresher software developer.

Rules:
- Ask ONLY ONE question
- Return ONLY valid JSON

{
  "reply": "question",
  "analysis": {
    "communication": 5,
    "confidence": 5,
    "clarity": 5,
    "technical": 5,
    "strengths": [],
    "weaknesses": [],
    "improvements": [],
    "hrThinking": "",
    "betterAnswer": ""
  }
}
`;

    const aiResponse = await askAI(prompt);

    console.log("🤖 START AI RESPONSE:", aiResponse);

    let parsed = safeJSON(aiResponse);

    if (!parsed?.reply) {
      parsed = {
        reply:
          fallbackQuestions[
            Math.floor(Math.random() * fallbackQuestions.length)
          ],
        analysis: defaultAnalysis,
      };
    }

    await Interview.create({
      interviewId,
      messages: [{ role: "hr", text: parsed.reply }],
      scores: {
        communication: 5,
        confidence: 5,
        clarity: 5,
        technical: 5,
      },
      overallScore: 5,
      strengths: [],
      weaknesses: [],
    });

    return res.json({
      success: true,
      interviewId,
      question: parsed.reply,
    });
  } catch (err) {
    console.log("🔥 START INTERVIEW ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   ANSWER QUESTION
========================= */

exports.answerQuestion = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Interview ID and answer required",
      });
    }

    const interview = await Interview.findOne({ interviewId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const lastQuestion =
      interview.messages?.at(-1)?.text || "";

    const prompt = `
You are a strict HR interviewer.

Previous Question:
${lastQuestion}

Candidate Answer:
${answer}

Return ONLY valid JSON:

{
  "reply": "next question",
  "analysis": {
    "communication": 0,
    "confidence": 0,
    "clarity": 0,
    "technical": 0,
    "strengths": [],
    "weaknesses": [],
    "improvements": [],
    "hrThinking": "",
    "betterAnswer": ""
  }
}
`;

    const aiResponse = await askAI(prompt);

    console.log("🤖 ANSWER AI RESPONSE:", aiResponse);

    let parsed = safeJSON(aiResponse);

    if (!parsed?.analysis) {
      parsed = {
        reply:
          fallbackQuestions[
            Math.floor(Math.random() * fallbackQuestions.length)
          ],
        analysis: defaultAnalysis,
      };
    }

    const a = parsed.analysis || defaultAnalysis;

    interview.messages.push({ role: "user", text: answer });
    interview.messages.push({ role: "hr", text: parsed.reply });

    interview.scores = {
      communication: a.communication || 5,
      confidence: a.confidence || 5,
      clarity: a.clarity || 5,
      technical: a.technical || 5,
    };

    interview.overallScore =
      (interview.scores.communication +
        interview.scores.confidence +
        interview.scores.clarity +
        interview.scores.technical) / 4;

    interview.strengths = a.strengths || [];
    interview.weaknesses = a.weaknesses || [];

    await interview.save();

    return res.json({
      success: true,
      nextQuestion: parsed.reply,
      analysis: a,
      overallScore: interview.overallScore,
    });
  } catch (err) {
    console.log("🔥 ANSWER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};