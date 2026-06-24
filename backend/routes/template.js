const router = require("express").Router();
const auth = require("../middleware/auth");
const Template = require("../models/Template");

/* =========================
   CREATE TEMPLATE (ADMIN / RECRUITER)
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { title, role, questions } = req.body;

    const template = await Template.create({
      title,
      role,
      questions,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      template,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET ALL TEMPLATES
========================= */
router.get("/", auth, async (req, res) => {
  const templates = await Template.find();
  res.json({ success: true, templates });
});

module.exports = router;