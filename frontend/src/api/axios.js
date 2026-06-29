import axios from "axios";

/* =========================
   BASE API INSTANCE
========================= */

const baseUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`.replace(/\/$/, "") + "/api";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

/* =========================
   AUTH INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE ERROR HANDLING (OPTIONAL BUT USEFUL)
========================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirect to login");
      // optional: logout logic here
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;