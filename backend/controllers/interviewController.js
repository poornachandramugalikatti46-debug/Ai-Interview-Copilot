import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";
import Question from "../models/Question.js";

/*
==========================
START INTERVIEW
==========================
*/

export const startInterview = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      language,
      topic,
      count,
      duration,
    } = req.body;

    console.log('--- startInterview debug ---');
    console.log('req.body:', req.body);
    const filter = {
      role,
      difficulty,
      isActive: true,
    };

    // Treat generic selections like 'Mixed', 'All', or 'Any' as no topic filter
    if (topic && !["mixed", "all", "any"].includes(String(topic).toLowerCase())) {
      filter.topic = topic;
    }

    if (language) filter.language = language;

    console.log('filter:', filter, 'count:', count);

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: Number(count) } },
    ]);

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty,
      language,
      topic,
      duration,
      totalQuestions: questions.length,
      maxScore: questions.length * 100,
      questions: questions.map((q) => q._id),
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
==========================
GET INTERVIEW
==========================
*/

export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("questions")
      .populate("answers.question");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.json({
      success: true,
      interview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
==========================
SAVE CODE
==========================
*/

export const saveCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    const index = interview.answers.findIndex(
      (a) => a.question.toString() === questionId
    );

    if (index === -1) {
      interview.answers.push({
        question: questionId,
        language,
        code,
      });
    } else {
      interview.answers[index].code = code;
    }

    await interview.save();

    res.json({
      success: true,
      message: "Code saved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
==========================
NEXT QUESTION
==========================
*/

export const nextQuestion = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    if (interview.currentQuestion < interview.totalQuestions - 1) {
      interview.currentQuestion++;
    }

    await interview.save();

    res.json({
      success: true,
      currentQuestion: interview.currentQuestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
==========================
PREVIOUS QUESTION
==========================
*/

export const previousQuestion = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    if (interview.currentQuestion > 0) {
      interview.currentQuestion--;
    }

    await interview.save();

    res.json({
      success: true,
      currentQuestion: interview.currentQuestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
==========================
FINISH INTERVIEW
==========================
*/

export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    let total = 0;

    interview.answers.forEach((a) => {
      total += a.score;
    });

    interview.totalScore = total;
    interview.percentage =
      interview.maxScore > 0
        ? (total / interview.maxScore) * 100
        : 0;

    interview.completedAt = new Date();
    interview.status = "Completed";

    await interview.save();

    res.json({
      success: true,
      interview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const saveInterviewSession = async (req, res) => {
  try {
    const payload = {
      userId: req.user?._id || null,
      role: req.body.role || "",
      questionType: req.body.question_type || "",
      mode: req.body.mode || "practice",
      experience: req.body.experience || "",
      company: req.body.company || "",
      numQuestions: req.body.num_questions || req.body.questions?.length || 0,
      avg_score: req.body.avg_score || 0,
      questions: req.body.questions || [],
      answers: req.body.answers || {},
      evaluations: req.body.evaluations || {},
      timeSpent: req.body.timeSpent || 0,
    };

    const session = await InterviewSession.create(payload);

    res.status(201).json({
      success: true,
      session,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getInterviewSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user?._id || null,
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  try {
    const { question, answer, role, experience } = req.body;

    const score = Math.min(10, Math.max(2, Math.floor((answer?.length || 0) / 20) + 3));
    const feedback = `Your response was received for ${role || "the interview"}. ${question ? "You addressed the prompt with a structured answer." : "Please provide a more detailed answer."}`;

    res.json({
      success: true,
      evaluation: {
        score,
        feedback,
        role,
        experience,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const improveInterviewAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const improvedAnswer = [
      `For the prompt: ${question || "the interview question"}`,
      "",
      "Suggested structure:",
      "1. Restate the problem briefly.",
      "2. Explain your approach clearly.",
      "3. Mention complexity and edge cases.",
      "",
      answer ? `Your draft: ${answer}` : "Add your draft answer to receive a stronger revision.",
    ].join("\n");

    res.json({
      success: true,
      improved_answer: improvedAnswer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};