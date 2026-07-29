import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/mock",
});

// Start Interview
export const startInterview = (formData) =>
  API.post("/start", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get AI Question
export const getQuestion = (interviewId) =>
  API.post("/question", { interviewId });

// Submit User Answer
export const submitAnswer = (data) =>
  API.post("/answer", data);

// Get Final Report
export const getReport = (interviewId) =>
  API.get(`/report/${interviewId}`);