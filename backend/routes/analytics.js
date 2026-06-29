const express = require("express");
const router = express.Router();

const InterviewSession = require("../models/InterviewSession");
const trackEvent = require("../utils/trackEvent");
const { verifyUser } = require("../middleware/authMiddleware");

router.post("/track", async (req, res) => {
  try {
    const { userId, event, meta = {} } = req.body;

    if (!userId || !event) {
      return res.status(400).json({
        success: false,
        message: "userId and event are required",
      });
    }

    await trackEvent({ userId, event, meta });

    return res.json({
      success: true,
      message: "Event tracked",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   📅 WEEKLY ANALYTICS (REAL)
========================= */

router.get("/weekly-time", verifyUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const sessions = await InterviewSession.find({ userId });

    const weekly = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    sessions.forEach((s) => {
      const day = new Date(s.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      weekly[day] += (s.timeSpent || 0) / 60;
    });

    const result = Object.keys(weekly).map((d) => ({
      day: d,
      hours: Number(weekly[d].toFixed(2)),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   🧠 SKILL MAP (REAL ACCURACY)
========================= */

router.get("/skill-map", verifyUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const sessions = await InterviewSession.find({ userId });

    const map = {};

    sessions.forEach((session) => {
      session.answers.forEach((a) => {
        if (!map[a.topic]) {
          map[a.topic] = { correct: 0, wrong: 0 };
        }

        if (a.isCorrect) map[a.topic].correct++;
        else map[a.topic].wrong++;
      });
    });

    const result = Object.keys(map).map((topic) => {
      const t = map[topic];

      const accuracy =
        (t.correct / (t.correct + t.wrong)) * 100 || 0;

      return {
        topic,
        accuracy: Math.round(accuracy),
        status:
          accuracy > 70
            ? "mastered"
            : accuracy > 40
            ? "learning"
            : "weak",
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   😰 STRESS ANALYTICS (REAL)
========================= */

router.get("/stress", verifyUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const sessions = await InterviewSession.find({ userId });

    let total = 0;
    let stressPoints = 0;

    sessions.forEach((s) => {
      s.answers.forEach((a) => {
        total++;

        if (a.responseTime > 15) stressPoints++;
        if (a.hesitationCount > 2) stressPoints++;
        if (!a.isCorrect) stressPoints++;
      });
    });

    const score =
      total === 0
        ? 0
        : Math.max(0, Math.round(100 - (stressPoints / total) * 100));

    res.json({
      score,
      stressLevel:
        score > 70 ? "LOW" : score > 40 ? "MEDIUM" : "HIGH",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;