import TechnicalInterview from "../models/TechnicalInterview.js";
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
      company,
    } = req.body;

    console.log("=================================");
    console.log("🚀 START TECHNICAL INTERVIEW");
    console.log("=================================");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Role and difficulty are required",
      });
    }

    const roles = [
      "DSA",
      "Frontend",
      "Backend",
      "Full Stack",
      "React",
      "Node.js",
      "Python",
      "Java",
      "C++",
      "SQL",
    ];
    const difficulties = ["Easy", "Medium", "Hard"];
    const normalizeValue = (value, allowedValues) => {
      const normalizedValue = String(value).trim().toLowerCase();
      return allowedValues.find(
        (allowedValue) => allowedValue.toLowerCase() === normalizedValue
      ) || String(value).trim();
    };

    const normalizedRole = normalizeValue(role, roles);
    const normalizedDifficulty = normalizeValue(difficulty, difficulties);
    const normalizedTopic = topic ? String(topic).trim() : "";
    const normalizedLanguage = language
      ? String(language).trim()
      : "";
    const requested = Number(count) || 5;

    const baseFilter = {
      role: normalizedRole,
      ...(normalizedDifficulty.toLowerCase() !== "mixed" && {
        difficulty: normalizedDifficulty,
      }),
    };
    let filter = {
      ...baseFilter,
      isActive: true,
    };

    if (
      normalizedTopic &&
      !["mixed", "all", "any"].includes(normalizedTopic.toLowerCase())
    ) {
      filter.topic = normalizedTopic;
    }

    if (normalizedLanguage) {
      filter.language = normalizedLanguage;
    }

    console.log("BODY ROLE:", role);
    console.log("BODY DIFFICULTY:", difficulty);
    console.log("🔎 INITIAL FILTER:", filter);
    console.log("🔢 REQUESTED QUESTIONS:", requested);

    const available = await Question.countDocuments(filter);
    console.log("📚 MATCHING QUESTIONS:", available);

    const [totalQuestions, questionsForRole, questionsForDifficulty] =
      await Promise.all([
        Question.countDocuments({}),
        Question.countDocuments({ role: normalizedRole }),
        normalizedDifficulty.toLowerCase() === "mixed"
          ? 0
          : Question.countDocuments({ difficulty: normalizedDifficulty }),
      ]);
    console.log("📚 TOTAL QUESTIONS:", totalQuestions);
    console.log("📚 QUESTIONS FOR ROLE:", questionsForRole);
    console.log(
      "📚 QUESTIONS FOR DIFFICULTY:",
      questionsForDifficulty
    );

    if (available === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No questions available for the selected role, difficulty, language, and topic.",
        filter,
        diagnostics: {
          totalQuestions,
          questionsForRole,
          questionsForDifficulty,
        },
      });
    }

    const sampleSize = Math.min(
      Math.max(1, requested),
      available
    );

    console.log("🎯 SAMPLE SIZE:", sampleSize);

    const questions = await Question.aggregate([
      {
        $match: filter,
      },
      {
        $sample: {
          size: sampleSize,
        },
      },
    ]);

    console.log(
      "✅ QUESTIONS SELECTED:",
      questions.length
    );

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to select interview questions.",
      });
    }

    // -----------------------------
    // CREATE INTERVIEW
    // -----------------------------
    console.log("📝 Creating interview...");

    const interviewQuestions = questions.map((q, index) => ({
      questionId: index + 1,
      questionDbId: q._id,
      title: q.title || "",
      question: q.description || q.title || "",
      description: q.description || "",
      role: q.role || role,
      topic: q.topic || "",
      difficulty: q.difficulty || difficulty,
      language: q.language || [],
      examples: q.examples || [],
      constraints: q.constraints || [],
      starterCode: q.starterCode || {},
      testCases: q.testCases || [],
      solution: q.solution || {},
      userAnswer: "",
      submitted: false,
      score: 0,
    }));

    const interviewData = {
      user: req.user._id,
      role: normalizedRole,
      difficulty:
        normalizedDifficulty.toLowerCase() === "mixed"
          ? "Easy"
          : normalizedDifficulty,
      language: normalizedLanguage,
      topic: normalizedTopic || "Mixed",
      duration: Number(duration) || 30,
      totalQuestions: questions.length,
      maxScore: questions.length * 100,
      questions: interviewQuestions,
    };

    console.log(
      "📦 INTERVIEW DATA:",
      interviewData
    );

    const interview = await TechnicalInterview.create(
      interviewData
    );

    console.log(
      "🎉 INTERVIEW CREATED:",
      interview._id
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return res.status(201).json({
      success: true,
      message:
        "Technical interview started successfully",
      interviewId: interview._id,
      // IMPORTANT:
      // Return the questions stored inside
      // the actual interview document.
      questions: interview.questions,
      totalQuestions:
        interview.questions.length,
      duration:
        Number(duration) || 30,
      company:
        company || "Random",
      role: normalizedRole,
      difficulty: normalizedDifficulty,
      language: normalizedLanguage,
      topic: normalizedTopic || "Mixed",
    });
  } catch (err) {
    console.error("=================================");
    console.error("❌ START INTERVIEW ERROR");
    console.error("=================================");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("STACK:", err.stack);

    return res.status(500).json({
      success: false,
      message: err.message,
      error: err.name,
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
    const interview = await TechnicalInterview.findById(req.params.id);

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
    const { questionId, code } = req.body;

    const interview = await TechnicalInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    const index = interview.questions.findIndex(
      (q) =>
        q.questionId === Number(questionId) ||
        q.questionDbId?.toString() === questionId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this interview",
      });
    }

    interview.questions[index].userAnswer = code;
    interview.questions[index].submitted = false;

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
    const interview = await TechnicalInterview.findById(req.params.id);

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
    const interview = await TechnicalInterview.findById(req.params.id);

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
    const interview = await TechnicalInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
      });
    }

    let total = 0;

    interview.questions.forEach((q) => {
      total += q.score || 0;
    });

    interview.score = total;
    interview.percentage =
      interview.totalQuestions > 0
        ? (total / (interview.totalQuestions * 100)) * 100
        : 0;

    interview.completedAt = new Date();
    interview.completed = true;

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