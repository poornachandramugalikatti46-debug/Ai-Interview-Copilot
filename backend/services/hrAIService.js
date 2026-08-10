import Groq from "groq-sdk";


let groq = null;



function getGroqClient(){


    if(!groq){

        const apiKey =
        process.env.GROQ_API_KEY;


        if(!apiKey){

            console.warn(
              "GROQ_API_KEY missing"
            );

            return null;

        }


        groq =
        new Groq({
            apiKey
        });

    }


    return groq;

}






function cleanJSON(text){

    return text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();

}








/**
 * AI HR Answer Evaluation
 */


export async function evaluateAnswer({

question,

answer,

role,

experience

}){


try{


const client =
getGroqClient();



if(!client){

throw new Error(
"GROQ API KEY missing"
);

}







const prompt = `


You are a professional HR interviewer.


Analyze the candidate answer.


Role:
${role}


Experience:
${experience}



Interview Question:

${question}



Candidate Answer:

${answer}



Return ONLY JSON.

Do not add markdown.

Use this exact format:



{

"communication":15,

"grammar":15,

"confidence":15,

"relevance":15,

"professionalism":15,


"strengths":[
"strength 1"
],


"weaknesses":[
"weakness 1"
],


"feedback":
"detailed feedback",


"betterAnswer":
"improved answer example",


"hiringRecommendation":
"Strong Hire"

}



Rules:


Each score must be between 0 and 20.


communication:
How clearly candidate communicates.


grammar:
English correctness.


confidence:
Confidence shown in answer.


relevance:
How well answer matches question.


professionalism:
Corporate attitude.


Hiring recommendation options:

Strong Hire

Hire

Maybe

Reject


`;







const completion =
await client.chat.completions.create({


model:
"llama-3.3-70b-versatile",


temperature:
0.2,


messages:[

{

role:"system",

content:
"You are an AI HR evaluation system."

},


{

role:"user",

content:prompt

}


]


});








let response =
completion
.choices[0]
.message
.content;



response =
cleanJSON(response);





const result =
JSON.parse(response);







return {


communication:
Number(result.communication) || 0,


grammar:
Number(result.grammar) || 0,


confidence:
Number(result.confidence) || 0,


relevance:
Number(result.relevance) || 0,


professionalism:
Number(result.professionalism) || 0,



strengths:
result.strengths || [],



weaknesses:
result.weaknesses || [],



feedback:
result.feedback || "",



betterAnswer:
result.betterAnswer || "",



hiringRecommendation:
result.hiringRecommendation || "Maybe"


};



}
catch(err){


console.error(
"HR AI ERROR:",
err.message
);





// fallback

return {


communication:10,

grammar:10,

confidence:10,

relevance:10,

professionalism:10,



strengths:[

"Candidate attempted the answer"

],



weaknesses:[

"Need more detailed explanation"

],



feedback:

"AI evaluation failed. Please try again.",



betterAnswer:

"Use STAR method with clear examples.",



hiringRecommendation:

"Maybe"



};


}



}