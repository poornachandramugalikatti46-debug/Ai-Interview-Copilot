import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
export const getApiOrigin = () => {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").trim();
  return raw.replace(/\/$/, "").replace(/\/api$/, "");
};

export const getApiBase = () => {
  return `${getApiOrigin()}/api`;
};

/* =========================
   BASE API INSTANCE

const api = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
);

/* =========================
   RESPONSE ERROR HANDLING

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    console.error(
      "[API ERROR]",
      status,
      url,
      error.response?.data
    );

    // IMPORTANT:
    // Never redirect to login for login/register errors themselves.
    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/send-otp") ||
      url.includes("/auth/forgot-password");

    if (status === 401 && !isAuthRequest) {
      console.warn(
        "Unauthorized - redirecting to login"
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

  return config;
});

export default API;