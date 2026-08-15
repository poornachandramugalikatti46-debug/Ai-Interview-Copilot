import axios from "axios";

/* =========================
   BASE API INSTANCE
========================= */

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .replace(/\/$/, "");

const baseUrl = apiOrigin.endsWith("/api") ? apiOrigin : `${apiOrigin}/api`;

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