/*
====================================================
AI REVIEW SERVICE

Analyzes:
- Code quality
- Time complexity
- Space complexity
- Bugs
- Improvements
====================================================
*/

import OpenAI from "openai";

let client = null;

if (process.env.OPENAI_API_KEY) {
    client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export const generateAIReview = async ({
    code,
    language,
    question,
}) => {
    try {
        if (!client) {
            return fallbackReview();
        }

        const prompt = `
You are a senior software engineer conducting a technical interview review.

Analyze this solution:

Question:
${question}

Programming Language:
${language}

Candidate Code:
${code}

Provide JSON response:
{
 "summary":"",
 "timeComplexity":"",
 "spaceComplexity":"",
 "codeQuality":"",
 "bugs":[],
 "strengths":[],
 "improvements":[]
}
`;

        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert coding interviewer.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
        });

        const result = response.choices[0].message.content;
        return JSON.parse(result);
    } catch (error) {
        console.error("AI Review Error:", error);
        return fallbackReview();
    }
};

function fallbackReview() {
    return {
        summary: "AI review unavailable",
        timeComplexity: "Not analyzed",
        spaceComplexity: "Not analyzed",
        codeQuality: "Unknown",
        bugs: [],
        strengths: [],
        improvements: ["Practice more coding problems"],
    };
}
