const axios = require("axios");

/* =========================
   REAL COMPILER (NO API KEY)
   Piston API
========================= */
exports.executeCode = async (code, language, input = "") => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language:
          language === "cpp"
            ? "c++"
            : language === "javascript"
            ? "javascript"
            : language,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
        stdin: input,
      }
    );

    return response.data.run.stdout || "No Output";
  } catch (err) {
    return "Execution Failed";
  }
};