const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

/* =========================
   EXTRACT PDF TEXT
========================= */

async function extractPDFText(filePath) {
  try {
    const data = new Uint8Array(
      fs.readFileSync(filePath)
    );

    const pdf =
      await pdfjsLib.getDocument({
        data,
      }).promise;

    let text = "";

    for (
      let i = 1;
      i <= pdf.numPages;
      i++
    ) {
      const page =
        await pdf.getPage(i);

      const content =
        await page.getTextContent();

      const strings =
        content.items.map(
          (item) => item.str
        );

      text += strings.join(" ");
    }

    return text;
  } catch (error) {
    console.log(
      "PDF READ ERROR:",
      error.message
    );

    return "";
  }
}

/* =========================
   RESUME ANALYZER ROUTE
========================= */

router.post(
  "/analyze",
  upload.single("resume"),

  async (req, res) => {
    try {

      /* CHECK FILE */

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      /* EXTRACT TEXT */

      const resumeText =
        await extractPDFText(
          req.file.path
        );

      if (
        !resumeText ||
        resumeText.length < 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to read resume PDF",
        });
      }

      /* AI ANALYSIS */

      const completion =
        await groq.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",

              content: `
You are an advanced ATS Resume Analyzer AI.

Analyze the resume professionally.

Return:
1. ATS Score out of 100
2. Technical Skills
3. Missing Skills
4. Resume Strengths
5. Resume Weaknesses
6. Improvement Tips
7. Best Suitable Job Role
8. HR Impression
9. Interview Readiness
`,
            },

            {
              role: "user",
              content: resumeText,
            },
          ],

          temperature: 0.5,

          max_tokens: 1000,
        });

      const reply =
        completion.choices[0]?.message
          ?.content;

      /* RANDOM UI SCORES */

      const atsScore =
        Math.floor(
          Math.random() * 15
        ) + 80;

      const skillsScore =
        Math.floor(
          Math.random() * 15
        ) + 75;

      const formatScore =
        Math.floor(
          Math.random() * 15
        ) + 70;

      const keywordScore =
        Math.floor(
          Math.random() * 15
        ) + 78;

      const projectScore =
        Math.floor(
          Math.random() * 15
        ) + 82;

      /* DELETE FILE */

      fs.unlinkSync(req.file.path);

      /* RESPONSE */

      res.json({
        success: true,

        analysis: reply,

        atsScore,

        skillsScore,

        formatScore,

        keywordScore,

        projectScore,
      });

    } catch (error) {

      console.log(
        "RESUME ERROR:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Resume analysis failed",
      });
    }
  }
);

module.exports = router;