import { useEffect } from "react";
import { getAnalyticsSocket } from "../services/analyticsSocket";

const useLivePractice = (feature) => {
  useEffect(() => {
    const sendHeartbeat = () => {
      const socket = getAnalyticsSocket();

      if (!socket || !socket.connected) {
        return;
      }

      socket.emit("analytics:heartbeat", {
        feature,
        durationSeconds: 10,
      });
    };

    const interval = setInterval(sendHeartbeat, 10000);

    sendHeartbeat();

    return () => {
      clearInterval(interval);
    };
  }, [feature]);
};

export default useLivePractice;
