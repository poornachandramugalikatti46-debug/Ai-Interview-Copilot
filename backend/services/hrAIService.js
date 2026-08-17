import Groq from "groq-sdk";

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "allam-2-7b";

let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    groq = new Groq({ apiKey });
  }

  return groq;
}

function cleanJSON(text) {
  if (typeof text !== "string") return String(text || "");
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function clampScore(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(20, Math.round(parsed)));
}

function fallbackEvaluation() {
  return {
    communication: 14,
    grammar: 14,
    confidence: 14,
    relevance: 14,
    professionalism: 14,
    strengths: ["Answer was understood and relevant."],
    weaknesses: ["Could add more detail or examples."],
    feedback: "The answer was acceptable, but please add more concrete examples and stronger structure.",
    betterAnswer: "Provide a clear opening statement, describe your approach step-by-step, and include a specific result or lesson.",
    hiringRecommendation: "Maybe",
    score: 70,
  };
}

function extractGroqResponse(completion) {
  const choice = completion?.choices?.[0];
  if (!choice) return null;
  if (choice?.message?.content !== undefined) return choice.message.content;
  if (choice?.text !== undefined) return choice.text;
  return completion?.output_text;
}

/**
 * AI HR Answer Evaluation
 */
export async function evaluateAnswer({ question, answer, role, experience }) {
  let client;
  try {
    client = getGroqClient();
  } catch (error) {
    console.warn("Groq client unavailable, using fallback evaluation:", error.message);
    return fallbackEvaluation();
  }

  const prompt = `You are a professional HR interviewer evaluating a candidate's answer.

Candidate Role: ${role}
Experience: ${experience}

Interview Question:
${question}

Candidate Answer:
${answer}

Please evaluate the answer and return ONLY valid JSON.

Use this exact structure:
{
  "communication": 0,
  "grammar": 0,
  "confidence": 0,
  "relevance": 0,
  "professionalism": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": "",
  "betterAnswer": "",
  "hiringRecommendation": ""
}

Rules:
- Scores must be integers between 0 and 20.
- Do not return markdown or extra text.
- Do not use identical scores unless the answer genuinely deserves it.
- Base scores on the actual candidate answer.
- Short or off-topic answers should have lower relevance and confidence.
- Grammar should reflect actual language quality.
- Professionalism should reflect workplace tone.
- Hiring recommendation must be one of: "Strong Hire", "Hire", "Maybe", "Reject".
`;

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,
      temperature: 0.3,
      max_completion_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an AI HR evaluation system. Return JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  } catch (error) {
    console.error("Groq API evaluation error:", error);
    return fallbackEvaluation();
  }

  const rawResponse = extractGroqResponse(completion);
  if (!rawResponse) {
    console.error("Empty Groq response", JSON.stringify(completion, null, 2));
    return fallbackEvaluation();
  }

  let parsed;
  if (typeof rawResponse === "object") {
    parsed = rawResponse;
  } else {
    const response = cleanJSON(rawResponse);
    try {
      parsed = JSON.parse(response);
    } catch (error) {
      console.error("Invalid Groq JSON:", response);
      console.error("Groq completion object:", JSON.stringify(completion, null, 2));
      return fallbackEvaluation();
    }
  }

  const evaluation = {
    communication: clampScore(parsed.communication),
    grammar: clampScore(parsed.grammar),
    confidence: clampScore(parsed.confidence),
    relevance: clampScore(parsed.relevance),
    professionalism: clampScore(parsed.professionalism),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    feedback: parsed.feedback || "",
    betterAnswer: parsed.betterAnswer || parsed.betterAnswer || "",
    hiringRecommendation: parsed.hiringRecommendation || parsed.recommendation || "Maybe",
  };

  evaluation.score =
    evaluation.communication +
    evaluation.grammar +
    evaluation.confidence +
    evaluation.relevance +
    evaluation.professionalism;

  return evaluation;
}
