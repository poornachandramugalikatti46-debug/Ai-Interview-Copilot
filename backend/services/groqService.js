import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "allam-2-7b";

let groq = null;
if (GROQ_API_KEY) {
  groq = new Groq({ apiKey: GROQ_API_KEY });
  console.log("✅ Groq AI initialized successfully");
} else {
  console.warn("⚠️ GROQ_API_KEY is not set. Groq AI disabled.");
}

const cleanQuestion = (text) => {
  if (!text) return "";
  let question = text.trim();
  question = question.replace(/^['"]|['"]$/g, "");
  question = question.replace(/^Question\s*\d*\s*:\s*/i, "");
  question = question.replace(/^Q\d+\s*:\s*/i, "");
  const lines = question.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    const questionLine = lines.find((line) => line.includes("?") && !line.toLowerCase().includes("since this is"));
    if (questionLine) question = questionLine;
  }
  return question.trim();
};

export const generateInterviewQuestion = async ({
  role,
  experience,
  interviewType,
  resumeText,
  previousQuestion,
  previousAnswer,
  difficulty,
  questionNumber,
  conversation,
}) => {
  try {
    if (!groq) {
      const fallbackQuestions = {
        "Frontend Developer": [
          "Your resume mentions frontend development. How would you design a React component that fetches data from an API and handles loading, success, and error states?",
          "Suppose your React application becomes slow when rendering a large list. How would you investigate and improve its performance?",
          "How would you debug a React application where a component is continuously re-rendering?",
          "How would you design authentication and protected routes in a React application?",
          "Imagine your frontend API suddenly starts returning 500 errors in production. How would you debug the issue?",
        ],
        "Backend Developer": [
          "How would you design a REST API for a user management system?",
          "How would you implement authentication and authorization in a backend application?",
          "Suppose an API becomes slow when the database contains millions of records. How would you investigate and improve it?",
          "How would you handle validation and error handling in a production backend API?",
          "How would you design a backend service that can handle a large number of concurrent requests?",
        ],
        "Full Stack Developer": [
          "How would you design the communication between a React frontend and a Node.js backend?",
          "How would you implement authentication across a React frontend and backend API?",
          "Suppose a page is loading slowly because it depends on multiple APIs. How would you improve the user experience?",
          "How would you design a database structure for a full-stack application?",
          "How would you debug a problem where data is saved correctly in the backend but not displayed in the frontend?",
        ],
      };

      const questions = fallbackQuestions[role] || fallbackQuestions["Frontend Developer"];
      const index = Math.min(Math.max((questionNumber || 1) - 1, 0), questions.length - 1);
      return questions[index];
    }

    const askedQuestions = Array.isArray(conversation) ? conversation.filter((item) => item.role === "assistant").map((item) => item.content).filter(Boolean) : [];
    const safeResume = resumeText && resumeText.trim() ? resumeText.slice(0, 18000) : "No resume uploaded.";

    let interviewTypeInstruction = "";
    if (interviewType === "Technical") interviewTypeInstruction = `Focus strongly on technical knowledge, implementation, debugging, architecture, problem solving and technologies related to the selected role and resume.`;
    else if (interviewType === "HR") interviewTypeInstruction = `Focus on the candidate's projects, experience, teamwork, communication, challenges, ownership, decision making and professional situations. Use the resume when possible.`;
    else if (interviewType === "Behavioral") interviewTypeInstruction = `Focus on real-world situations, problem solving, teamwork, conflict handling, leadership, failure, learning and decision making.`;

    const prompt = `You are a senior interviewer conducting a REAL job interview.\n\nRole:\n${role}\n\nExperience:\n${experience}\n\nInterview Type:\n${interviewType}\n\nQuestion Number:\n${questionNumber}\n\nCurrent Difficulty:\n${difficulty || "Medium"}\n\nCANDIDATE RESUME:\n${safeResume}\n\nPREVIOUS QUESTION:\n${previousQuestion || "None"}\n\nPREVIOUS ANSWER:\n${previousAnswer || "None"}\n\nQUESTIONS ALREADY ASKED:\n${JSON.stringify(askedQuestions, null, 2)}\n\nFULL CONVERSATION:\n${JSON.stringify(conversation || [], null, 2)}\n\nINTERVIEW TYPE INSTRUCTION:\n${interviewTypeInstruction}\n\nReturn exactly one interview question that ends with a question mark.`;

    const response = await groq.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a senior interviewer. Ask exactly one personalized interview question and return only that question." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_completion_tokens: 250,
    });

    let question = response?.choices?.[0]?.message?.content?.trim();
    question = cleanQuestion(question);
    if (!question) throw new Error("Groq returned empty interview question.");
    return question;
  } catch (error) {
    console.error("❌ AI question generation error:", error);
    throw error;
  }
};

export const evaluateAnswer = async (question, answer) => {
  try {
    if (!groq) {
      return {
        score: 70,
        confidence: 70,
        fluency: 70,
        grammar: 70,
        feedback: "Answer received. Add more technical details and examples.",
        improvement: "Explain your approach, reasoning and result more clearly.",
      };
    }

    const prompt = `You are an expert technical interviewer.\nEvaluate the candidate's answer.\nQuestion:\n${question}\n\nCandidate Answer:\n${answer}\n\nReturn ONLY valid JSON with numeric scores between 0 and 100 and fields: score, confidence, fluency, grammar, feedback, improvement.`;

    const response = await groq.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,
      messages: [
        { role: "system", content: "You are an expert interviewer evaluating a candidate answer. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_completion_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq returned empty evaluation.");
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Answer evaluation error:", error);
    return {
      score: 70,
      confidence: 70,
      fluency: 70,
      grammar: 70,
      feedback: "Unable to generate detailed AI feedback.",
      improvement: "Try explaining your technical approach with more detail.",
    };
  }
};

export const evaluateResumeInterview = async ({
  resumeText,
  questions,
  answers,
}) => {
  const fallbackResult = () => {
    const scoreBase = Math.min(95, Math.max(65, 68 + (Array.isArray(answers) ? answers.length * 4 : 0)));
    const communication = Math.min(100, Math.max(60, scoreBase + 6));
    const technical = Math.min(100, Math.max(60, scoreBase + 10));
    const relevance = Math.min(100, Math.max(60, scoreBase + 12));
    const confidence = Math.min(100, Math.max(58, scoreBase + 2));
    const resumeAccuracy = Math.min(100, Math.max(62, scoreBase + 14));
    const overallScore = Math.round((communication + technical + relevance + confidence + resumeAccuracy) / 5);

    return {
      communication,
      technical,
      relevance,
      confidence,
      resumeAccuracy,
      overallScore,
      strengths: [
        "Strong use of the resume content in the interview.",
        "Answers are relevant to the role and project work.",
        "The candidate demonstrates practical project exposure.",
      ],
      areasToImprove: [
        "Add more structured examples for technical decisions.",
        "Improve confidence while describing complex concepts.",
        "Use clearer explanations of impact and results.",
      ],
      finalFeedback: "The candidate showed a solid foundation in the resume topics and answered with relevant project-based examples. To improve further, focus on more concise, structured explanations and stronger evidence of technical decision-making.",
    };
  };

  try {
    if (!groq) {
      return fallbackResult();
    }

    const interviewData = (Array.isArray(questions) ? questions : []).map((question, index) => ({
      question: String(question || "").trim(),
      answer: String((Array.isArray(answers) ? answers[index] : "") || "").trim(),
    }));

    const prompt = `
You are an expert technical and HR interview evaluator.

Evaluate the candidate based ONLY on:
1. Their uploaded resume
2. Interview questions
3. Their actual answers

Do NOT invent information.

========================
RESUME
========================
${resumeText || "No resume text provided."}

========================
INTERVIEW
========================
${JSON.stringify(interviewData, null, 2)}

========================
SCORING
========================

Give scores from 0 to 100:

Communication:
Evaluate clarity, sentence structure, vocabulary and ability to communicate ideas.

Technical:
Evaluate technical knowledge demonstrated in the answers.

Relevance:
Evaluate whether answers directly address the questions.

Confidence:
Evaluate confidence based on answer quality, completeness and certainty. Do not assume actual body language unless it is provided.

Resume Accuracy:
Compare claims in answers with the uploaded resume. Penalize unsupported or contradictory claims.

Overall:
Give an overall score based on the complete interview.

========================
IMPORTANT
========================

Return ONLY valid JSON.

Use exactly this structure:
{
  "communication": 0,
  "technical": 0,
  "relevance": 0,
  "confidence": 0,
  "resumeAccuracy": 0,
  "overallScore": 0,
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "areasToImprove": [
    "improvement 1",
    "improvement 2",
    "improvement 3"
  ],
  "finalFeedback": "Detailed personalized feedback for the candidate."
}

All scores must be integers between 0 and 100.
`;

    const response = await groq.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You are a strict professional interview evaluator. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response?.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned);

    const scoreFields = [
      "communication",
      "technical",
      "relevance",
      "confidence",
      "resumeAccuracy",
      "overallScore",
    ];

    for (const field of scoreFields) {
      result[field] = Math.max(0, Math.min(100, Number(result[field]) || 0));
    }

    return {
      communication: result.communication,
      technical: result.technical,
      relevance: result.relevance,
      confidence: result.confidence,
      resumeAccuracy: result.resumeAccuracy,
      overallScore: result.overallScore,
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 3) : [],
      areasToImprove: Array.isArray(result.areasToImprove) ? result.areasToImprove.slice(0, 3) : [],
      finalFeedback: result.finalFeedback || "The candidate showed steady performance. Continue building clearer examples and stronger confidence in explanations.",
    };
  } catch (error) {
    console.error("❌ FINAL AI EVALUATION ERROR:", error);
    return fallbackResult();
  }
};
