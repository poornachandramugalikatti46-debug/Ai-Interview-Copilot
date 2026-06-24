const express = require("express");
const router = express.Router();

let data = [];

/* GET DATA */
router.get("/history/:userId", (req, res) => {
  res.json(data);
});

/* GENERATE DATA (NO AI - SIMPLE TEST FIRST) */
router.post("/generate", (req, res) => {
  const newData = {
    userId: req.body.userId,
    atsScore: 80,
    interviewScore: 75,
    resumeStrength: 70,
    jobReadiness: 85,
    feedback: "Improve communication skills",
    createdAt: new Date(),
  };

  data.push(newData);

  res.json(newData);
});

module.exports = router;