import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/mock",
  headers: {
    Accept: "application/json",
  },
});

// ============================================
// START INTERVIEW
// POST /api/mock/start
// ============================================

export const startInterview = (formData) => {
  return API.post("/start", formData);
};


// ============================================
// GET NEXT QUESTION
// POST /api/mock/question
// ============================================

export const getQuestion = (interviewId) => {
  return API.post("/question", {
    interviewId,
  });
};


// ============================================
// SUBMIT ANSWER
// POST /api/mock/answer
// ============================================

export const submitAnswer = (data) => {
  return API.post("/answer", data);
};


// ============================================
// FINAL REPORT
// GET /api/mock/report/:id
// ============================================

export const getReport = (interviewId) => {
  return API.get(`/report/${interviewId}`);
};