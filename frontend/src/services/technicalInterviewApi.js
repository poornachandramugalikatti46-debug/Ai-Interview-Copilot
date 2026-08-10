import api from "./api";

export const startTechnicalInterview = (data) =>
  api.post("/technical-interview/start", data);

export const saveTechnicalSession = (data) =>
  api.post("/technical-interview/sessions", data);

export const getTechnicalInterview = (id) =>
  api.get(`/technical-interview/${id}`);

export const finishTechnicalInterview = (id) =>
  api.put(`/technical-interview/${id}/finish`);
