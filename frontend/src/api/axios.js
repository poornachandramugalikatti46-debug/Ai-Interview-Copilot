import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://ai-interview-copilot-1-a7tr.onrender.com"
).replace(/\/$/, "");

export const getApiOrigin = () => {
  const raw = (
    import.meta.env.VITE_API_URL || "https://ai-interview-copilot-1-a7tr.onrender.com"
  ).trim();

  return raw.replace(/\/$/, "").replace(/\/api$/, "");
};

export const getApiBase = () => {
  return `${getApiOrigin()}/api`;
};

const API = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
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

    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/send-otp") ||
      url.includes("/auth/forgot-password");

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;
