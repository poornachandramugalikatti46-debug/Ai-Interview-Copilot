import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Generate Interview Question
export const generateInterviewQuestion = async ({
  role,
  experience,
  interviewType,
  resumeText,
  difficulty,
  questionNumber,
  conversation = [],
}) => {

try {

const previousQuestions =
conversation
.filter(item=>item.role==="assistant")
.map(item=>item.content)
.join("\n");


const prompt = `

You are an AI interviewer.

Role:
${role}

Experience:
${experience}

Interview Type:
${interviewType}

Question Number:
${questionNumber}

Previous Questions:
${previousQuestions}


Rules:

1. Generate questions based on candidate role.

2. Analyze previous answers.

3. If answer is weak:
Ask follow-up question.

4. If answer is strong:
Increase difficulty.

5. Never repeat questions.

6. Interview should have minimum 5 questions.

7. After enough evaluation, return:
END_INTERVIEW

8. Return only one question.


`;


if(!groq){

return fallbackQuestion(questionNumber);

}


const response =
await groq.chat.completions.create({

model:"llama-3.3-70b-versatile",

messages:[
{
role:"user",
content:prompt
}
],

temperature:0.9,

max_completion_tokens:200

});


return response
.choices[0]
.message
.content
.trim();


}
catch(error){

console.log(error);

return fallbackQuestion(questionNumber);

}

};
function fallbackQuestion(number){

const questions=[

"Tell me about yourself.",

"Explain your recent project.",

"What technical challenges did you face?",

"Explain your strongest programming skill.",

"How do you debug your code?",

"Why should we hire you?"

];


return questions[number-1] || "Do you have any questions?";

}
// Evaluate Candidate Answer
export const evaluateAnswer = async (question, answer) => {
  try {
    const prompt = `
You are a Senior Software Engineer evaluating a candidate's interview response.

Question:
${question}

Candidate Answer:
${answer}

Instructions:
- Score the answer from 0 to 100.
- Provide confidence, fluency, and grammar scores from 0 to 100.
- Return ONLY valid JSON with the following keys:
  {"score": number, "confidence": number, "fluency": number, "grammar": number, "feedback": string, "improvement": string}
`;

    if (!groq) {
      return {
        score: 80,
        confidence: 80,
        fluency: 80,
        grammar: 80,
        feedback: "Good answer.",
        improvement: "Keep practicing.",
      };
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_completion_tokens: 400,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(error);

    return {
      score: 80,
      confidence: 80,
      fluency: 80,
      grammar: 80,
      feedback: "Good answer.",
      improvement: "Keep practicing.",
    };
  }
};