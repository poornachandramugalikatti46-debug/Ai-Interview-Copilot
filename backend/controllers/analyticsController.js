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

const SCORE_FEATURES = [
  "technical-interview",
  "hr-interview",
  "mock-interview",
  "resume-interview",
];

const getDateKey = (date) => {
  return date.toLocaleDateString("en-CA");
};

const formatMinutes = (seconds) => {
  return Math.round(seconds / 60);
};

const getDateDaysAgo = (daysAgo) => {
  const date = new Date();

  date.setDate(
    date.getDate() - daysAgo
  );

  return date;
};

/*
==================================================
TRACK ACTIVITY
POST /api/analytics/track
==================================================
*/

export const trackActivity = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      feature,
      durationSeconds,
      dateKey,
      hour,
    } = req.body;

    if (!ALLOWED_FEATURES.includes(feature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analytics feature",
      });
    }

    const duration = Number(
      durationSeconds
    );

    if (
      Number.isNaN(duration) ||
      duration <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration",
      });
    }

    // Prevent accidental huge values
    const safeDuration = Math.min(
      Math.floor(duration),
      120
    );

    const safeHour =
      Number.isInteger(Number(hour))
        ? Number(hour)
        : new Date().getHours();

    const safeDateKey =
      typeof dateKey === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateKey)
        ? dateKey
        : getDateKey(new Date());

    const activity =
      await AnalyticsActivity.create({
        user: userId,
        feature,
        durationSeconds: safeDuration,
        dateKey: safeDateKey,
        hour: Math.max(
          0,
          Math.min(23, safeHour)
        ),
      });

    return res.status(201).json({
      success: true,
      message: "Activity tracked successfully",
      activityId: activity._id,
    });
  } catch (error) {
    console.error(
      "TRACK ACTIVITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to track activity",
    });
  }
};

/*
==================================================
SAVE INTERVIEW SCORE
POST /api/analytics/score
==================================================
*/

export const saveAnalyticsScore = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      feature,
      score,
    } = req.body;

    if (!SCORE_FEATURES.includes(feature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid score feature",
      });
    }

    const numericScore = Number(score);

    if (
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Score must be between 0 and 100",
      });
    }

    const savedScore =
      await AnalyticsScore.create({
        user: userId,
        feature,
        score: Math.round(numericScore),
      });

    return res.status(201).json({
      success: true,
      message: "Interview score saved",
      score: savedScore,
    });
  } catch (error) {
    console.error(
      "SAVE ANALYTICS SCORE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save score",
    });
  }
};

/*
==================================================
GET ANALYTICS DASHBOARD
GET /api/analytics/dashboard
==================================================
*/

export const getAnalyticsDashboard = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    /*
    ----------------------------------------------
    Last 30 days activity
    ----------------------------------------------
    */

    const thirtyDaysAgo =
      getDateDaysAgo(29);

    const activities =
      await AnalyticsActivity.find({
        user: userId,
        createdAt: {
          $gte: thirtyDaysAgo,
        },
      })
        .sort({
          createdAt: 1,
        })
        .lean();

    /*
    ----------------------------------------------
    Date keys
    ----------------------------------------------
    */

    const today = new Date();

    const todayKey =
      getDateKey(today);

    const weekKeys = [];

    for (let i = 6; i >= 0; i--) {
      const date =
        getDateDaysAgo(i);

      weekKeys.push(
        getDateKey(date)
      );
    }

    const monthKeys = [];

    for (let i = 29; i >= 0; i--) {
      const date =
        getDateDaysAgo(i);

      monthKeys.push(
        getDateKey(date)
      );
    }

    /*
    ----------------------------------------------
    Today / week / month seconds
    ----------------------------------------------
    */

    let todaySeconds = 0;
    let weekSeconds = 0;
    let monthSeconds = 0;

    activities.forEach(
      (activity) => {
        if (
          activity.dateKey ===
          todayKey
        ) {
          todaySeconds +=
            activity.durationSeconds;
        }

        if (
          weekKeys.includes(
            activity.dateKey
          )
        ) {
          weekSeconds +=
            activity.durationSeconds;
        }

        if (
          monthKeys.includes(
            activity.dateKey
          )
        ) {
          monthSeconds +=
            activity.durationSeconds;
        }
      }
    );

    /*
    ----------------------------------------------
    Weekly chart
    ----------------------------------------------
    */

    const weekly = weekKeys.map(
      (dateKey) => {
        const date =
          new Date(
            `${dateKey}T12:00:00`
          );

        const seconds =
          activities
            .filter(
              (activity) =>
                activity.dateKey ===
                dateKey
            )
            .reduce(
              (sum, activity) =>
                sum +
                activity.durationSeconds,
              0
            );

        return {
          date: dateKey,

          day: date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          ),

          minutes:
            formatMinutes(seconds),
        };
      }
    );

    /*
    ----------------------------------------------
    Feature usage
    ----------------------------------------------
    */

    const featureMap = {};

    activities.forEach(
      (activity) => {
        if (
          !featureMap[
            activity.feature
          ]
        ) {
          featureMap[
            activity.feature
          ] = 0;
        }

        featureMap[
          activity.feature
        ] +=
          activity.durationSeconds;
      }
    );

    const featureUsage =
      Object.entries(featureMap)
        .map(
          ([feature, seconds]) => ({
            feature,

            minutes:
              formatMinutes(
                seconds
              ),
          })
        )
        .sort(
          (a, b) =>
            b.minutes -
            a.minutes
        );

    /*
    ----------------------------------------------
    30 day heatmap
    ----------------------------------------------
    */

    const heatmap =
      monthKeys.map(
        (dateKey) => {
          const seconds =
            activities
              .filter(
                (activity) =>
                  activity.dateKey ===
                  dateKey
              )
              .reduce(
                (
                  sum,
                  activity
                ) =>
                  sum +
                  activity.durationSeconds,
                0
              );

          return {
            date: dateKey,

            minutes:
              formatMinutes(
                seconds
              ),
          };
        }
      );

    /*
    ----------------------------------------------
    Practice streak
    ----------------------------------------------
    */

    const activeDays =
      new Set(
        activities
          .filter(
            (activity) =>
              activity.durationSeconds >
              0
          )
          .map(
            (activity) =>
              activity.dateKey
          )
      );

    let streak = 0;

    for (
      let i = 0;
      i < 30;
      i++
    ) {
      const date =
        getDateDaysAgo(i);

      const key =
        getDateKey(date);

      if (
        activeDays.has(key)
      ) {
        streak++;
      } else {
        break;
      }
    }

    /*
    ----------------------------------------------
    Best practice hour
    ----------------------------------------------
    */

    const hourMap = {};

    activities.forEach(
      (activity) => {
        if (
          hourMap[activity.hour] ===
          undefined
        ) {
          hourMap[activity.hour] = 0;
        }

        hourMap[
          activity.hour
        ] +=
          activity.durationSeconds;
      }
    );

    let bestHour = null;
    let bestHourSeconds = 0;

    Object.entries(hourMap).forEach(
      ([hour, seconds]) => {
        if (
          seconds >
          bestHourSeconds
        ) {
          bestHourSeconds =
            seconds;

          bestHour =
            Number(hour);
        }
      }
    );

    let bestPracticeTime =
      "7:00 PM - 9:00 PM";

    if (
      bestHour !== null
    ) {
      const endHour =
        Math.min(
          bestHour + 2,
          23
        );

      const formatHour =
        (hour) => {
          const suffix =
            hour >= 12
              ? "PM"
              : "AM";

          const display =
            hour % 12 === 0
              ? 12
              : hour % 12;

          return `${display}:00 ${suffix}`;
        };

      bestPracticeTime =
        `${formatHour(
          bestHour
        )} - ${formatHour(
          endHour
        )}`;
    }

    /*
    ----------------------------------------------
    Scores
    ----------------------------------------------
    */

    const scores =
      await AnalyticsScore.find({
        user: userId,
        createdAt: {
          $gte: thirtyDaysAgo,
        },
      })
        .sort({
          createdAt: 1,
        })
        .lean();

    /*
    ----------------------------------------------
    Overall readiness
    ----------------------------------------------
    */

    let readiness = 0;

    if (scores.length > 0) {
      readiness =
        scores.reduce(
          (sum, item) =>
            sum + item.score,
          0
        ) /
        scores.length;
    }

    readiness =
      Math.round(readiness);

    /*
    ----------------------------------------------
    Readiness by skill
    ----------------------------------------------
    */

    const categoryMap = {};

    scores.forEach(
      (item) => {
        if (
          !categoryMap[
            item.feature
          ]
        ) {
          categoryMap[
            item.feature
          ] = [];
        }

        categoryMap[
          item.feature
        ].push(item.score);
      }
    );

    const readinessBreakdown =
      Object.entries(
        categoryMap
      ).map(
        ([feature, values]) => ({
          feature,

          score: Math.round(
            values.reduce(
              (a, b) =>
                a + b,
              0
            ) /
              values.length
          ),
        })
      );

    /*
    ----------------------------------------------
    Readiness trend
    ----------------------------------------------
    */

    let readinessTrend = 0;

    if (scores.length >= 2) {
      const middle =
        Math.floor(
          scores.length / 2
        );

      const first =
        scores.slice(
          0,
          middle
        );

      const second =
        scores.slice(
          middle
        );

      const firstAverage =
        first.reduce(
          (sum, item) =>
            sum + item.score,
          0
        ) / first.length;

      const secondAverage =
        second.reduce(
          (sum, item) =>
            sum + item.score,
          0
        ) / second.length;

      readinessTrend =
        Math.round(
          secondAverage -
            firstAverage
        );
    }

    /*
    ----------------------------------------------
    Tomorrow practice prediction
    ----------------------------------------------
    */

    const totalWeeklyMinutes =
      weekly.reduce(
        (sum, item) =>
          sum + item.minutes,
        0
      );

    const averageDailyMinutes =
      Math.round(
        totalWeeklyMinutes /
          7
      );

    const predictedPracticeMinutes =
      Math.max(
        15,
        averageDailyMinutes
      );

    /*
    ----------------------------------------------
    Predicted readiness
    ----------------------------------------------
    */

    let predictedReadiness =
      readiness;

    if (
      readinessTrend > 0
    ) {
      predictedReadiness +=
        Math.min(
          readinessTrend,
          5
        );
    }

    predictedReadiness =
      Math.min(
        100,
        predictedReadiness
      );

    /*
    ----------------------------------------------
    AI insight
    ----------------------------------------------
    */

    let insight =
      "Start practicing regularly to build your interview readiness.";

    if (
      readiness >= 85
    ) {
      insight =
        "Excellent preparation. Maintain your consistency and focus on your weakest interview area.";
    } else if (
      readiness >= 70
    ) {
      insight =
        "You're making strong progress. Consistent daily practice can push your readiness even higher.";
    } else if (
      weekSeconds > 0
    ) {
      insight =
        "You're building momentum. Try maintaining a daily practice session to improve your interview readiness.";
    }

    /*
    ----------------------------------------------
    Response
    ----------------------------------------------
    */

    return res.json({
      success: true,

      analytics: {
        todayMinutes:
          formatMinutes(
            todaySeconds
          ),

        weekMinutes:
          formatMinutes(
            weekSeconds
          ),

        monthMinutes:
          formatMinutes(
            monthSeconds
          ),

        streak,

        readiness,

        readinessTrend,

        predictedPracticeMinutes,

        predictedReadiness,

        bestPracticeTime,

        insight,

        weekly,

        heatmap,

        featureUsage,

        readinessBreakdown,
      },
    });
  } catch (error) {
    console.error(
      "GET ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load analytics dashboard",
    });
  }
};