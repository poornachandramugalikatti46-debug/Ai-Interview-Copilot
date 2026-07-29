import MockInterview from "../models/MockInterview.js";
import { extractResumeText } from "../services/resumeParser.js";
import {
  generateInterviewQuestion,
  evaluateAnswer,
} from "../services/groqService.js";

// Start Interview

export const generateQuestion = async(req,res)=>{

try{

const {interviewId}=req.body;


const interview =
await MockInterview.findById(interviewId);


if(!interview){

return res.status(404).json({
message:"Interview not found"
});

}


// Stop condition

if(
interview.questions.length >= interview.questionLimit
){

return res.json({

success:true,

completed:true,

message:"Interview completed"

});

}



const question =
await generateInterviewQuestion({

role:interview.role,

experience:interview.experience,

interviewType:interview.interviewType,

resumeText:interview.resumeText,

questionNumber:
interview.questions.length+1,

conversation:
interview.conversation

});


// AI decides finish

if(question==="END_INTERVIEW"){

interview.completed=true;

await interview.save();


return res.json({

success:true,

completed:true

});

}


interview.questions.push(question);

interview.currentQuestion=question;


await interview.save();



res.json({

success:true,

question

});


}
catch(error){

console.log(error);

res.status(500).json({

message:"Question generation failed"

});

}

}


// Start Interview
export const startInterview = async (req, res) => {
  try {
    const { role, experience, type } = req.body;

    const interview = await MockInterview.create({
      role,
      experience,
      interviewType: type,
      questions: [],
      answers: [],
      conversation: [],
      completed: false,
      questionLimit: 5,
    });

    return res.status(201).json({
      success: true,
      interviewId: interview._id,
      question: interview.currentQuestion || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

// Submit Answer
export const submitAnswer = async (req, res) => {

  try {

    const { interviewId, question, answer } = req.body;

    const interview = await MockInterview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const aiResult =
await evaluateAnswer(
question,
answer
);

interview.answers.push({

question,

answer,

feedback: aiResult.feedback,

score: aiResult.score,

confidence: aiResult.confidence,

fluency: aiResult.fluency,

grammar: aiResult.grammar,

improvement: aiResult.improvement,

});

interview.conversation.push({

  role: "user",

  content: answer,

});

    await interview.save();

    res.json({
      success: true,
      message: "Answer submitted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
    });

  }
};

// Get Final Report
export const getReport = async (req, res) => {

  try {

    const interview = await MockInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const totalScore = interview.answers.reduce(
      (sum, item) => sum + item.score,
      0
    );

    const overallScore =
      interview.answers.length > 0
        ? Math.round(totalScore / interview.answers.length)
        : 0;

    interview.overallScore = overallScore;
    interview.status = "completed";

    await interview.save();

    res.json({
      success: true,
      report: interview,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });

  }
};