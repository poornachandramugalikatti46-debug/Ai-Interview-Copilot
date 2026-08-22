import { useEffect, useRef } from "react";
import axios from "axios";

const API_URL =
  "http://localhost:5000/api/analytics";

const getLocalDateKey = () => {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const useAnalyticsTracker = (
  feature
) => {
  const startTime =
    useRef(Date.now());

  const sentTime =
    useRef(0);

  useEffect(() => {
    startTime.current =
      Date.now();

    sentTime.current = 0;

    const sendActivity =
      async () => {
        const elapsedSeconds =
          Math.floor(
            (Date.now() -
              startTime.current) /
              1000
          );

        const newSeconds =
          elapsedSeconds -
          sentTime.current;

        if (
          newSeconds <= 0
        ) {
          return;
        }

        // Send at most 60 seconds per request
        const secondsToSend =
          Math.min(
            newSeconds,
            60
          );

        try {
          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {
            return;
          }

          await axios.post(
            `${API_URL}/track`,
            {
              feature,

              durationSeconds:
                secondsToSend,

              dateKey:
                getLocalDateKey(),

              hour:
                new Date().getHours(),
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          sentTime.current +=
            secondsToSend;
        } catch (error) {
          console.error(
            "Activity tracking failed:",
            error
          );
        }
      };

    const interval =
      setInterval(
        sendActivity,
        30000
      );

    const handleVisibility =
      () => {
        if (
          document.hidden
        ) {
          sendActivity();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      sendActivity();

      clearInterval(
        interval
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [feature]);
};

export default useAnalyticsTracker;