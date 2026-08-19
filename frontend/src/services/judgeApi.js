
import axios from "axios";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://ai-interview-copilot-1-a7tr.onrender.com").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Run Code
// ===============================
export const runCode = async ({
  question,
  userCode,
  language,
}) => {
  try {
    const res = await api.post("/api/judge/run", {
      question,
      userCode,
      language,
    });

    return res.data;
  } catch (err) {
    console.error("Run Code Error:", err);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Unable to run code.",
    };
  }
};

// ===============================
// Submit Code
// ===============================
export const submitCode = async ({
  question,
  userCode,
  language,
}) => {
  try {
    const res = await api.post("/api/judge/submit", {
      question,
      userCode,
      language,
    });

    return res.data;
  } catch (err) {
    console.error("Submit Code Error:", err);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Unable to submit code.",
    };
  }
};

// ===============================
// AI Review
// ===============================
export const getAIReview = async ({
  sourceCode,
  language,
  problemId,
}) => {
  try {
    const res = await api.post("/api/ai-review/review", {
      sourceCode,
      language,
      problemId,
    });

    return res.data;
  } catch (err) {
    console.error("AI Review Error:", err);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Unable to generate AI review.",
    };
  }
};

export default api;