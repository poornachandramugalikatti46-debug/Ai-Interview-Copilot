import axios from "axios";

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

export const runCode = async (code, language_id, input) => {
  const options = {
    method: "POST",
    url: `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    data: {
      source_code: code,
      language_id,
      stdin: input,
    },
  };

  const response = await axios.request(options);
  return response.data;
};