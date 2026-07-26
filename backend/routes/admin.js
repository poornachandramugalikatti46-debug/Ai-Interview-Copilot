import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   ADMIN STATS
========================= */

router.get(
  "/stats",
  auth,
  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const recentUsers =
        await User.find()
          .sort({ createdAt: -1 })
          .limit(10);

      res.json({
        success: true,

        stats: {
          totalUsers,
          totalChats: 820,
          revenue: 24000,
          aiRequests: 92000,
        },

        recentUsers,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: "Admin fetch failed",
      });

    }
  }
);

/* =========================
   DELETE USER
========================= */

router.delete(
  "/delete-user/:id",
  auth,
  async (req, res) => {

    try {

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message: "User deleted",
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: "Delete failed",
      });

    }
  }
);

export default router;