const router = require("express").Router();
const auth = require("../middleware/auth");

const Interview = require("../models/Interview");

/* =========================
   BASIC USAGE DASHBOARD
========================= */
router.get("/stats", auth, async (req, res) => {
  try {
    const totalSessions = await Interview.countDocuments();
    const passed = await Interview.countDocuments({ status: "pass" });
    const failed = await Interview.countDocuments({ status: "fail" });

    res.json({
      success: true,
      data: {
        totalSessions,
        passed,
        failed,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;