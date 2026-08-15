import express from "express";

import {
  trackActivity,
  saveAnalyticsScore,
  getAnalyticsDashboard,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  getAnalyticsDashboard
);

router.post(
  "/track",
  authMiddleware,
  trackActivity
);

router.post(
  "/score",
  authMiddleware,
  saveAnalyticsScore
);

export default router;