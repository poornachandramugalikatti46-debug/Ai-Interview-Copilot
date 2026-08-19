import { useEffect, useState } from "react";
import { connectAnalytics, disconnectAnalytics, getAnalyticsSocket } from "../services/analyticsSocket";

const useLiveAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectAnalytics();
    if (!socket) {
      return;
    }

    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleUpdate = (payload) => {
      setAnalytics(payload);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("analytics:update", handleUpdate);

    const refresh = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://ai-interview-copilot-1-a7tr.onrender.com/api/analytics/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error("Live analytics refresh failed:", error);
      }
    };

    setConnected(socket.connected);
    refresh();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("analytics:update", handleUpdate);
      disconnectAnalytics();
    };
  }, []);

  return { analytics, connected };
};

export default useLiveAnalytics;
