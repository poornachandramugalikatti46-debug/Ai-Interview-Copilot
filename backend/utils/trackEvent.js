const AnalyticsEvent = require("../models/AnalyticsEvent");

const trackEvent = async ({
  userId,
  event,
  sessionId,
  meta = {},
}) => {
  try {
    await AnalyticsEvent.create({
      userId,
      event,
      sessionId,
      meta,
    });
  } catch (err) {
    console.log("Analytics error:", err);
  }
};

module.exports = trackEvent;