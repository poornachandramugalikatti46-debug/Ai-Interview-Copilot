import Question from "../models/Question.js";

/*
===========================================
GET ALL QUESTIONS
GET /api/questions
===========================================
*/

export const getQuestions = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      topic,
      language,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const query = {
      isActive: true,
    };

    if (role) query.role = role;

    if (difficulty) query.difficulty = difficulty;

    if (topic) query.topic = topic;

    if (language) query.language = language;

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const questions = await Question.find(query)
      .select("-solution")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      questions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
GET QUESTION BY ID
GET /api/questions/:id
===========================================
*/

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
GET RANDOM QUESTIONS
POST /api/questions/random
===========================================
*/

export const getRandomQuestions = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      language,
      topic,
      count = 5,
    } = req.body;

    const match = {
      isActive: true,
    };

    if (role) match.role = role;

    if (difficulty) match.difficulty = difficulty;

    if (language) {
      match.language = language;
    }

    if (topic) {
      match.topic = topic;
    }

    const questions = await Question.aggregate([
      {
        $match: match,
      },
      {
        $sample: {
          size: Number(count),
        },
      },
      {
        $project: {
          solution: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
GET TOPICS
GET /api/questions/topics
===========================================
*/

export const getTopics = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    const topics = await Question.distinct("topic", filter);

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
CREATE QUESTION (ADMIN)
POST /api/questions
===========================================
*/

export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
UPDATE QUESTION
PUT /api/questions/:id
===========================================
*/

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
DELETE QUESTION
DELETE /api/questions/:id
===========================================
*/

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};