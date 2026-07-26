import AnalyticsEvent from "../models/AnalyticsEvent.js";

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

export default trackEvent;