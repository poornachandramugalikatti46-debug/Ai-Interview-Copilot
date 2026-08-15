import api from "./api";

const API = "/technical-interview";

// ========================================
// START TECHNICAL INTERVIEW
// ========================================

export const startTechnicalInterview = (data) => {
  return api.post(`${API}/start`, data);
};

// ========================================
// GET INTERVIEW
// ========================================

export const getTechnicalInterview = (interviewId) => {
  return api.get(`${API}/${interviewId}`);
};

// ========================================
// SAVE CURRENT QUESTION CODE
// ========================================

export const saveTechnicalCode = (
  interviewId,
  data
) => {
  return api.put(
    `${API}/${interviewId}/save`,
    data
  );
};

// ========================================
// NEXT QUESTION
// ========================================

export const nextTechnicalQuestion = (
  interviewId
) => {
  return api.put(
    `${API}/${interviewId}/next`
  );
};

// ========================================
// PREVIOUS QUESTION
// ========================================

export const previousTechnicalQuestion = (
  interviewId
) => {
  return api.put(
    `${API}/${interviewId}/previous`
  );
};

// ========================================
// FINISH INTERVIEW
// ========================================

export const finishTechnicalInterview = (
  interviewId
) => {
  return api.put(
    `${API}/${interviewId}/finish`
  );
};

// ========================================
// SAVE INTERVIEW SESSION
// ========================================

export const saveTechnicalSession = (
  data
) => {
  return api.post(
    `${API}/sessions`,
    data
  );
};
