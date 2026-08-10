import axios from "axios";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API}/api/hr`,
});

// Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Start Interview
 */
export const startInterview = async (data) => {
  const res = await api.post("/start", data);
  return res.data;
};

/**
 * Get Question
 */
export const getQuestion = async (id) => {
  const res = await api.get(`/question/${id}`);
  return res.data;
};

/**
 * Submit Answer
 */
export const submitAnswer = async (data) => {
  const res = await api.post("/submit-answer", data);
  return res.data;
};

/**
 * Finish Interview
 */
export const finishInterview = async (interviewId) => {
  const res = await api.post("/finish", {
    interviewId,
  });

  return res.data;
};

/**
 * Interview Result
 */
export const getResult = async (id) => {
  const res = await api.get(`/result/${id}`);
  return res.data;
};

/**
 * Interview History
 */
export const getHistory = async () => {
  const res = await api.get("/history");
  return res.data;
};

export default {
  startInterview,
  getQuestion,
  submitAnswer,
  finishInterview,
  getResult,
  getHistory,
};