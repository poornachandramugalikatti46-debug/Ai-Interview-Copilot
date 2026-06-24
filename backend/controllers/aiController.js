const axios = require("axios");

exports.streamAI = async (req, res) => {
  try {
    const userMessage = req.query.message;

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // SSE HEADERS (STREAMING)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Call Groq / OpenAI
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI interview assistant. Give short and clear answers.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    // STREAM LIKE CHATGPT
    let i = 0;

    const interval = setInterval(() => {
      if (i >= text.length) {
        res.write("data: [DONE]\n\n");
        clearInterval(interval);
        res.end();
        return;
      }

      res.write(`data: ${text[i]}\n\n`);
      i++;
    }, 20);
  } catch (err) {
    console.error("AI Error:", err.message);

    res.status(500).json({
      success: false,
      message: "AI request failed",
    });
  }
};