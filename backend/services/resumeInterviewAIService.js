import Groq from "groq-sdk";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};

const fallbackQuestions = [
  "Please introduce yourself and briefly explain your background.",
  "Can you explain your most important project mentioned in your resume?",
  "What technologies did you use in your project?",
  "What was the biggest challenge you faced while developing your project?",
  "How did you solve that challenge?",
  "Why are you interested in this role?",
  "What are your strengths as a developer?",
  "Where do you see yourself in the next three years?",
];

export const generateResumeQuestions = async ({
  role,
  experience,
  resumeText,
}) => {
  try {
    const groq = getGroqClient();

    // If Groq is not configured, use fallback questions.
    if (!groq) {
      console.log("⚠️ GROQ_API_KEY not found. Using fallback questions.");
      return fallbackQuestions;
    }

    const prompt = `
You are an expert technical and HR interviewer.

Create 8 interview questions based on the candidate's resume.

Candidate role:
${role}

Experience:
${experience}

Resume:
${resumeText || "No resume text provided."}

Requirements:
- Ask questions specifically related to the resume.
- Include project questions.
- Include technical questions.
- Include behavioral questions.
- Include experience questions.
- Return ONLY a valid JSON array of strings.

Example:
[
  "Tell me about yourself.",
  "Explain your main project.",
  "Why did you choose React?"
]
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert interviewer. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const content =
      completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return fallbackQuestions;
    }

    let cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions) || questions.length === 0) {
      return fallbackQuestions;
    }

    return questions.slice(0, 8);
  } catch (error) {
    console.error(
      "⚠️ AI question generation failed:",
      error.message
    );

    // IMPORTANT:
    // Don't return 500 just because AI failed.
    return fallbackQuestions;
  }
};

export const evaluateResumeAnswer = async ({
  question,
  answer,
}) => {
  try {
    const groq = getGroqClient();

    if (!groq) {
      return {
        score: 10,
        feedback: "Good attempt. Try to provide more specific details and examples.",
      };
    }

    const prompt = `
Evaluate this interview answer.

Question:
${question}

Candidate Answer:
${answer}

Give a score from 0 to 20.

Return ONLY JSON:

{
  "score": 15,
  "feedback": "Your answer is relevant but could include a specific example."
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an interview evaluator. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content =
      completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        score: 10,
        feedback: "Good attempt.",
      };
    }

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return {
      score: Math.min(20, Math.max(0, Number(result.score) || 10)),
      feedback: result.feedback || "Good attempt.",
    };
  } catch (error) {
    console.error(
      "⚠️ Answer evaluation failed:",
      error.message
    );

    return {
      score: 10,
      feedback: "Good attempt. Try to make your answer more specific.",
    };
  }
};