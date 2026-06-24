const express = require("express");

const router = express.Router();

/* =========================
   SETTINGS DATA
========================= */

let settingsData = {

  notifications: {

    pushNotifications: true,

    emailNotifications: true,

    interviewReminders: false,

    practiceReminders: true,

    systemUpdates: true,

    soundVibration: false,

  },

  updates: {

    autoUpdate: true,

    betaFeatures: false,

    currentVersion: "2.1.0",

  },

};

/* =========================
   GET SETTINGS
========================= */

router.get("/", (req, res) => {

  res.json(settingsData);

});

/* =========================
   SAVE SETTINGS
========================= */

router.post("/", (req, res) => {

  settingsData = {

    ...settingsData,

    ...req.body,

  };

  res.json({

    success: true,

    message:
      "Settings Saved Successfully ✅",

    settingsData,

  });

});

module.exports = router;