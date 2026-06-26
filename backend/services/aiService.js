const Groq = require("groq-sdk");

// Create Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   ASK AI (ROBUST VERSION)
========================= */

const askAI = async (prompt, retryCount = 2) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      console.log("⚠️ Empty AI response");
      return "";
    }

    return content;
  } catch (err) {
    console.log("🔥 GROQ ERROR:", err.message);

    // 🔁 SIMPLE RETRY MECHANISM
    if (retryCount > 0) {
      console.log("🔁 Retrying AI call... Remaining:", retryCount);
      return askAI(prompt, retryCount - 1);
    }

    return "";
  }
};

module.exports = {
  askAI,
};