import { io } from "socket.io-client";

let socket = null;

export const connectAnalytics = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Analytics: token missing");
    return null;
  }

  if (socket) {
    return socket;
  }

  socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket", "polling"],
    path: "/socket.io",
    withCredentials: true,
  });

  return socket;
};

export const getAnalyticsSocket = () => socket;

export const disconnectAnalytics = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
