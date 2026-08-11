import Interview from "../models/Interview.js";
import { generateQuestions } from "../services/hrQuestionService.js";
import { evaluateAnswer } from "../services/hrAIService.js";

function buildReport(interview) {
  const questions = interview.questions || [];
  const answeredQuestions = questions.filter(
    (q) => q.answer?.trim() && q.aiReview
  );
  const count = answeredQuestions.length;

  const averageField = (field) => {
    if (count === 0) return 0;
    return Math.round(
      answeredQuestions.reduce(
        (total, q) => total + Number(q.aiReview?.[field] || 0),
        0
      ) / count
    );
  };

  const strengths = answeredQuestions.flatMap((q) => q.aiReview?.strengths || []);
  const weaknesses = answeredQuestions.flatMap((q) => q.aiReview?.weaknesses || []);

  const feedback = answeredQuestions
    .map((q, index) => {
      if (!q.aiReview?.feedback) return "";
      return `Question ${index + 1}: ${q.aiReview.feedback}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const betterAnswer = answeredQuestions
    .map((q, index) => {
      if (!q.aiReview?.betterAnswer) return "";
      return `Question ${index + 1}: ${q.aiReview.betterAnswer}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const score = Math.round(
    averageField("communication") +
      averageField("grammar") +
      averageField("confidence") +
      averageField("relevance") +
      averageField("professionalism")
  );

  const recommendations = answeredQuestions
    .map((q) => q.aiReview?.hiringRecommendation)
    .filter(Boolean);

  const recommendationCounts = recommendations.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});

  const hiringRecommendation =
    Object.entries(recommendationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    (count > 0 ? "Maybe" : "Pending");

  return {
    score,
    communication: averageField("communication"),
    grammar: averageField("grammar"),
    confidence: averageField("confidence"),
    relevance: averageField("relevance"),
    professionalism: averageField("professionalism"),
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
    feedback,
    betterAnswer,
    hiringRecommendation,
    questions,
    totalQuestions: questions.length,
    answeredQuestions: count,
  };
}

export const startInterview = async (req, res) => {
  try {
    console.log("HR Start Interview body:", req.body);

    const { role, difficulty, experience, count, totalQuestions } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: "role and experience are required",
      });
    }

    const normalizedDifficulty = (() => {
      if (!difficulty) return "Medium";
      const value = String(difficulty).toLowerCase();
      if (value === "easy") return "Easy";
      if (value === "medium") return "Medium";
      if (value === "hard") return "Hard";
      return "Medium";
    })();

    const questionCount = Number(totalQuestions ?? count) || 5;
    console.log("HR Start Interview normalizedDifficulty:", normalizedDifficulty, "questionCount:", questionCount);

    let questions = generateQuestions({
      role,
      difficulty: normalizedDifficulty,
      experience,
      totalQuestions: questionCount,
    });

    console.log("Generated question count:", questions.length);

    questions = questions.slice(0, questionCount);

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No questions found for the selected criteria",
      });
    }

    const formattedQuestions = questions.map((q, index) => ({
      questionId: q.id != null ? q.id : index + 1,
      question: q.question || q.text || `Question ${index + 1}`,
      category: q.category || "HR",
      difficulty: q.difficulty || normalizedDifficulty,
      answer: "",
      aiReview: {},
    }));

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty: normalizedDifficulty,
      experience,
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
      currentQuestion: 0,
      completed: false,
      score: 0,
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions: formattedQuestions,
      totalQuestions: formattedQuestions.length,
    });
  } catch (error) {
    console.error("HR startInterview error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ user: req.user._id, completed: false });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "No active interview found",
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

export const getQuestion = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const question = interview.questions[interview.currentQuestion];

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      question,
      currentQuestion: interview.currentQuestion,
      totalQuestions: interview.totalQuestions,
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
    console.log("HR Submit Answer body:", req.body);
    const { interviewId, questionId, questionIndex, answer, feedback } = req.body;

    if (!interviewId || !answer || (questionId == null && questionIndex == null)) {
      return res.status(400).json({
        success: false,
        message: "interviewId, questionId or questionIndex, and answer are required",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    let index = -1;
    const parsedIndex = Number(questionIndex);
    if (!Number.isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < interview.questions.length) {
      index = parsedIndex;
    }

    if (index === -1 && questionId != null) {
      index = interview.questions.findIndex((q) => String(q.questionId) === String(questionId));
    }

    console.log("Resolved questionIndexToUpdate:", index);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found in interview",
      });
    }

    const currentQuestion = interview.questions[index];
    currentQuestion.answer = String(answer).trim();
    if (feedback !== undefined) currentQuestion.feedback = feedback;

    console.log("Evaluating answer with Groq for question:", currentQuestion.question);

    const aiReview = await evaluateAnswer({
      question: currentQuestion.question,
      answer: String(answer).trim(),
      role: interview.role,
      experience: interview.experience,
    });

    console.log("AI review result:", aiReview);

    const safeReview = {
      communication: Number.isFinite(Number(aiReview.communication)) ? Number(aiReview.communication) : 0,
      grammar: Number.isFinite(Number(aiReview.grammar)) ? Number(aiReview.grammar) : 0,
      confidence: Number.isFinite(Number(aiReview.confidence)) ? Number(aiReview.confidence) : 0,
      relevance: Number.isFinite(Number(aiReview.relevance)) ? Number(aiReview.relevance) : 0,
      professionalism: Number.isFinite(Number(aiReview.professionalism)) ? Number(aiReview.professionalism) : 0,
      strengths: Array.isArray(aiReview.strengths) ? aiReview.strengths : [],
      weaknesses: Array.isArray(aiReview.weaknesses) ? aiReview.weaknesses : [],
      feedback: aiReview.feedback || "",
      betterAnswer: aiReview.betterAnswer || "",
      hiringRecommendation: aiReview.hiringRecommendation || "Maybe",
    };

    currentQuestion.aiReview = {
      ...safeReview,
      overall: Math.round(
        (safeReview.communication +
          safeReview.grammar +
          safeReview.confidence +
          safeReview.relevance +
          safeReview.professionalism) /
          5
      ),
    };

    interview.markModified("questions");
    interview.currentQuestion = Math.min(index + 1, interview.questions.length - 1);

    const report = buildReport(interview);
    interview.score = report.score;

    await interview.save();

    res.json({
      success: true,
      interview,
      report,
    });
  } catch (error) {
    console.error("HR submitAnswer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "interviewId is required",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.completed = true;
    interview.completedAt = new Date();

    const report = buildReport(interview);
    interview.score = report.score;

    await interview.save();

    res.json({
      success: true,
      interview,
      report,
    });
  } catch (error) {
    console.error("HR finishInterview error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResult = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const report = buildReport(interview);

    res.json({
      success: true,
      interview,
      report,
    });
  } catch (error) {
    console.error("HR getResult error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
