import jwt from "jsonwebtoken";
import AnalyticsActivity from "../models/AnalyticsActivity.js";
import AnalyticsScore from "../models/AnalyticsScore.js";

const ALLOWED_FEATURES = [
  "dashboard",
  "chatbot",
  "technical-interview",
  "hr-interview",
  "mock-interview",
  "resume-analyzer",
  "resume-interview",
];

const getDateKey = (date) => date.toLocaleDateString("en-CA");

const getDateDaysAgo = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const formatMinutes = (seconds) => Math.round(seconds / 60);

const buildAnalyticsPayload = async (userId) => {
  const thirtyDaysAgo = getDateDaysAgo(29);
  const activities = await AnalyticsActivity.find({
    user: userId,
    createdAt: { $gte: thirtyDaysAgo },
  })
    .sort({ createdAt: 1 })
    .lean();

  const today = new Date();
  const todayKey = getDateKey(today);

  const weekKeys = [];
  for (let i = 6; i >= 0; i--) {
    const date = getDateDaysAgo(i);
    weekKeys.push(getDateKey(date));
  }

  const monthKeys = [];
  for (let i = 29; i >= 0; i--) {
    const date = getDateDaysAgo(i);
    monthKeys.push(getDateKey(date));
  }

  let todaySeconds = 0;
  let weekSeconds = 0;
  let monthSeconds = 0;

  activities.forEach((activity) => {
    if (activity.dateKey === todayKey) todaySeconds += activity.durationSeconds;
    if (weekKeys.includes(activity.dateKey)) weekSeconds += activity.durationSeconds;
    if (monthKeys.includes(activity.dateKey)) monthSeconds += activity.durationSeconds;
  });

  const weekly = weekKeys.map((dateKey) => {
    const date = new Date(`${dateKey}T12:00:00`);
    const seconds = activities
      .filter((activity) => activity.dateKey === dateKey)
      .reduce((sum, activity) => sum + activity.durationSeconds, 0);

    return {
      date: dateKey,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: formatMinutes(seconds),
    };
  });

  const featureMap = {};
  activities.forEach((activity) => {
    if (!featureMap[activity.feature]) featureMap[activity.feature] = 0;
    featureMap[activity.feature] += activity.durationSeconds;
  });

  const featureUsage = Object.entries(featureMap)
    .map(([feature, seconds]) => ({
      feature,
      minutes: formatMinutes(seconds),
    }))
    .sort((a, b) => b.minutes - a.minutes);

  const heatmap = monthKeys.map((dateKey) => {
    const seconds = activities
      .filter((activity) => activity.dateKey === dateKey)
      .reduce((sum, activity) => sum + activity.durationSeconds, 0);

    return {
      date: dateKey,
      minutes: formatMinutes(seconds),
    };
  });

  const activeDays = new Set(
    activities
      .filter((activity) => activity.durationSeconds > 0)
      .map((activity) => activity.dateKey)
  );

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const key = getDateKey(getDateDaysAgo(i));
    if (activeDays.has(key)) streak += 1;
    else break;
  }

  const hourMap = {};
  activities.forEach((activity) => {
    if (hourMap[activity.hour] === undefined) hourMap[activity.hour] = 0;
    hourMap[activity.hour] += activity.durationSeconds;
  });

  let bestHour = null;
  let bestHourSeconds = 0;

  Object.entries(hourMap).forEach(([hour, seconds]) => {
    if (seconds > bestHourSeconds) {
      bestHourSeconds = seconds;
      bestHour = Number(hour);
    }
  });

  let bestPracticeTime = "7:00 PM - 9:00 PM";
  if (bestHour !== null) {
    const endHour = Math.min(bestHour + 2, 23);
    const formatHour = (hour) => {
      const suffix = hour >= 12 ? "PM" : "AM";
      const display = hour % 12 === 0 ? 12 : hour % 12;
      return `${display}:00 ${suffix}`;
    };
    bestPracticeTime = `${formatHour(bestHour)} - ${formatHour(endHour)}`;
  }

  const scores = await AnalyticsScore.find({
    user: userId,
    createdAt: { $gte: thirtyDaysAgo },
  })
    .sort({ createdAt: 1 })
    .lean();

  let readiness = 0;
  if (scores.length > 0) {
    readiness = Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length);
  }

  let readinessTrend = 0;
  if (scores.length >= 2) {
    const middle = Math.floor(scores.length / 2);
    const first = scores.slice(0, middle);
    const second = scores.slice(middle);
    const firstAverage = first.reduce((sum, item) => sum + item.score, 0) / first.length;
    const secondAverage = second.reduce((sum, item) => sum + item.score, 0) / second.length;
    readinessTrend = Math.round(secondAverage - firstAverage);
  }

  const totalWeeklyMinutes = weekly.reduce((sum, item) => sum + item.minutes, 0);
  const averageDailyMinutes = Math.round(totalWeeklyMinutes / 7);
  const predictedPracticeMinutes = Math.max(15, averageDailyMinutes);

  let predictedReadiness = readiness;
  if (readinessTrend > 0) {
    predictedReadiness += Math.min(readinessTrend, 5);
  }
  predictedReadiness = Math.min(100, predictedReadiness);

  return {
    todayMinutes: formatMinutes(todaySeconds),
    weekMinutes: formatMinutes(weekSeconds),
    monthMinutes: formatMinutes(monthSeconds),
    streak,
    readiness,
    readinessTrend,
    predictedPracticeMinutes,
    predictedReadiness,
    bestPracticeTime,
    weekly,
    heatmap,
    featureUsage,
  };
};

export const setupAnalyticsSocket = (io) => {
  io.on("connection", (socket) => {
    const token = socket.handshake?.auth?.token;

    try {
      if (!token) {
        socket.disconnect();
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT_SECRET missing for analytics socket");
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.id;

      socket.emit("analytics:connected", {
        success: true,
        userId: socket.userId,
      });

      socket.on("analytics:heartbeat", async (payload = {}) => {
        try {
          const { feature, durationSeconds } = payload;

          if (!feature || !ALLOWED_FEATURES.includes(feature)) {
            return;
          }

          const safeDuration = Math.min(Math.max(Number(durationSeconds) || 10, 1), 120);

          await AnalyticsActivity.create({
            user: socket.userId,
            feature,
            durationSeconds: safeDuration,
            dateKey: getDateKey(new Date()),
            hour: new Date().getHours(),
          });

          const updated = await buildAnalyticsPayload(socket.userId);
          socket.emit("analytics:update", updated);
        } catch (error) {
          console.error("Live analytics heartbeat error:", error);
        }
      });

      socket.on("analytics:score", async (payload = {}) => {
        try {
          const { feature, score } = payload;
          if (!feature || score === undefined) return;

          const numericScore = Math.max(0, Math.min(100, Number(score) || 0));

          await AnalyticsScore.create({
            user: socket.userId,
            feature,
            score: numericScore,
          });

          const updated = await buildAnalyticsPayload(socket.userId);
          socket.emit("analytics:update", updated);
        } catch (error) {
          console.error("Live analytics score error:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("Analytics socket disconnected:", socket.id);
      });
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      socket.disconnect();
    }
  });
};
