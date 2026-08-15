import axios from "axios";

export const getApiOrigin = () => {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").trim();
  return raw.replace(/\/$/, "").replace(/\/api$/, "");
};

export const getApiBase = () => {
  return `${getApiOrigin()}/api`;
};

/* =========================
   BASE API INSTANCE
========================= */

const api = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
});

/* =========================
   AUTH INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("[API] token:", token);
    console.log("[API] headers before auth:", config.headers);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("[API] headers after auth:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE ERROR HANDLING
========================= */

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

    return Promise.reject(error);
  }
);

export default api;