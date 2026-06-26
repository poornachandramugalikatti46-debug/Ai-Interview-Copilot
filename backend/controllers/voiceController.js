const { askAI } = require("../services/aiService");

exports.voiceInterview = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "No text provided" });
    }

    const prompt = `
You are a strict HR interviewer.

Candidate said:
${text}

Ask ONE short follow-up HR question.
Return ONLY the question.
`;

    const aiReply = await askAI(prompt);

    return res.json({
      reply: aiReply,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};