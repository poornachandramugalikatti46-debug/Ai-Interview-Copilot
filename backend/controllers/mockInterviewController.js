import MockInterview from "../models/MockInterview.js";
import { generateQuestions } from "../services/hrQuestionService.js";
import { extractResumeText } from "../services/resumeParser.js";

export const startInterview = async (req, res) => {
  try {
    const {
      role,
      difficulty = "Medium",
      experience,
      interviewType,
      questionLimit = 5,
    } = req.body;

    if (!role || !experience || !interviewType) {
      return res.status(400).json({
        success: false,
        message: "role, experience, and interviewType are required",
      });
    }

    const totalQuestions = Math.max(
      1,
      Math.min(20, Number(questionLimit) || 5)
    );

    const questions = generateQuestions({
      role,
      difficulty,
      experience,
      totalQuestions,
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No HR questions found for the selected criteria.",
      });
    }

    const questionTexts = questions.map((question) => {
      if (typeof question === "string") return question;
      return question.question || question.text || String(question.id || "");
    });

    const resumeName = req.file?.filename || "";
    const resumeText = req.file?.path
      ? await extractResumeText(req.file.path)
      : "";

    const interview = await MockInterview.create({
      userId: req.user?._id || null,
      role,
      experience,
      interviewType,
      resumeName,
      resumeText,
      questions: questionTexts,
      questionLimit: totalQuestions,
      difficulty,
      status: "started",
      currentQuestionNumber: 1,
      completed: false,
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions: questionTexts,
      questionLimit: totalQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "interviewId is required",
      });
    }

    const interview = await MockInterview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const index = Math.max(0, interview.currentQuestionNumber - 1);

    if (index >= interview.questions.length) {
      return res.status(404).json({
        success: false,
        message: "No more questions available",
      });
    }

    res.json({
      success: true,
      question: interview.questions[index],
      currentQuestionNumber: interview.currentQuestionNumber,
      totalQuestions: interview.questionLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const {
      interviewId,
      question,
      answer,
      feedback = "",
      score = 0,
      confidence = 0,
      fluency = 0,
      grammar = 0,
    } = req.body;

    if (!interviewId || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "interviewId, question, and answer are required",
      });
    }

    const interview = await MockInterview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const existingAnswer = interview.answers.find(
      (item) => item.question === question
    );

    if (existingAnswer) {
      existingAnswer.answer = answer;
      existingAnswer.feedback = feedback;
      existingAnswer.score = Number(score);
      existingAnswer.confidence = Number(confidence);
      existingAnswer.fluency = Number(fluency);
      existingAnswer.grammar = Number(grammar);
    } else {
      interview.answers.push({
        question,
        answer,
        feedback,
        score: Number(score),
        confidence: Number(confidence),
        fluency: Number(fluency),
        grammar: Number(grammar),
      });
    }

    interview.overallScore = interview.answers.reduce(
      (sum, item) => sum + Number(item.score || 0),
      0
    );

    if (interview.answers.length >= interview.questionLimit) {
      interview.status = "completed";
      interview.completed = true;
    }

    await interview.save();

    res.json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const interview = await MockInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    res.json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
