import fs from "fs";
import os from "os";
import path from "path";

import ResumeInterview from "../models/ResumeInterview.js";

import {
  extractPdfText,
} from "../services/pdfTextExtractor.js";

import {
  extractTextWithOCR,
} from "../services/ocrService.js";

import {
  generateResumeQuestions,
  evaluateResumeAnswer,
} from "../services/resumeInterviewAIService.js";

import {
  evaluateResumeInterview,
} from "../services/groqService.js";

export const uploadResume = async (req, res) => {
  let tempFilePath = null;

  try {
    console.log("================================");
    console.log("📄 RESUME UPLOAD");
    console.log("================================");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    console.log("📁 File:", req.file.originalname);
    console.log("📦 Size:", req.file.size, "bytes");
    console.log("📄 Type:", req.file.mimetype);

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes are supported.",
      });
    }

    let resumeText = "";

    try {
      console.log("🔍 Trying normal PDF text extraction...");
      resumeText = await extractPdfText(req.file.buffer);
      console.log("📝 Extracted text length:", resumeText.length);
    } catch (error) {
      console.log("⚠️ Normal PDF extraction failed:", error.message);
    }

    if (!resumeText.trim() || resumeText.length < 50) {
      console.log("⚠️ PDF has little or no text. Starting OCR...");

      tempFilePath = path.join(
        os.tmpdir(),
        `resume-${Date.now()}.pdf`
      );

      fs.writeFileSync(tempFilePath, req.file.buffer);
      console.log("💾 Temporary PDF:", tempFilePath);

      const ocrResult = await extractTextWithOCR(tempFilePath);

      if (ocrResult?.success && ocrResult.text) {
        resumeText = ocrResult.text.trim();
        console.log("✅ OCR successful");
        console.log("📝 OCR text length:", resumeText.length);
      }
    }

    if (!resumeText.trim() || resumeText.length < 50) {
      return res.status(422).json({
        success: false,
        message:
          "Unable to read text from this PDF. Please upload a text-based PDF or a scanned PDF that can be OCR-processed.",
      });
    }

    resumeText = resumeText
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log("✅ FINAL RESUME TEXT LENGTH:", resumeText.length);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      data: {
        fileName: req.file.originalname,
        resumeText,
        textLength: resumeText.length,
      },
    });
  } catch (error) {
    console.error("❌ RESUME PROCESSING ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process resume",
    });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("🗑️ Temporary PDF deleted");
      } catch (error) {
        console.log("⚠️ Could not delete temp file:", error.message);
      }
    }
  }
};

export const startResumeInterview = async (req, res) => {
  try {
    console.log("================================");
    console.log("START RESUME INTERVIEW");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("================================");

    const {
      role,
      experience,
      resumeText,
    } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const questions = await generateResumeQuestions({
      role,
      experience,
      resumeText,
    });

    const userId =
      req.user?._id ||
      req.user?.id ||
      null;

    const interviewData = {
      role,
      experience: experience || "Fresher",
      resumeText: resumeText || "",
      questions,
      answers: [],
      currentQuestion: 0,
      totalScore: 0,
      status: "started",
    };

    // Only add user when authentication provides it.
    if (userId) {
      interviewData.user = userId;
    }

    const interview = await ResumeInterview.create(
      interviewData
    );

    return res.status(201).json({
      success: true,
      message: "Resume interview started successfully",
      interview: {
        id: interview._id,
        role: interview.role,
        experience: interview.experience,
        questions: interview.questions,
        currentQuestion: interview.currentQuestion,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error("❌ START RESUME INTERVIEW ERROR");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to start resume interview",
    });
  }
};

export const submitResumeAnswer = async (req, res) => {
  try {
    console.log("================================");
    console.log("ANSWER REQUEST BODY:", req.body);
    console.log("================================");

    const { interviewId, question, answer } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const interview = await ResumeInterview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const evaluation = await evaluateResumeAnswer({
      question,
      answer,
    });

    interview.answers.push({
      question,
      answer,
      feedback: evaluation.feedback,
      score: evaluation.score,
    });

    interview.totalScore = interview.answers.reduce(
      (sum, item) => sum + Number(item.score || 0),
      0
    );

    interview.currentQuestion += 1;

    if (interview.currentQuestion >= interview.questions.length) {
      interview.status = "completed";
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      evaluation,
      currentQuestion: interview.currentQuestion,
      totalScore: interview.totalScore,
      status: interview.status,
    });
  } catch (error) {
    console.error("❌ SUBMIT RESUME ANSWER ERROR:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit answer",
    });
  }
};

export const generateResumeInterviewReport = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    const interview = await ResumeInterview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const questions = (interview.questions || []).map((item) => {
      if (typeof item === "string") return item;
      return item?.question || item?.text || "";
    }).filter(Boolean);

    const answers = (interview.answers || []).map((item) => {
      if (typeof item === "string") return item;
      return item?.answer || item?.text || "";
    }).filter(Boolean);

    const report = await evaluateResumeInterview({
      resumeText: interview.resumeText || "",
      questions,
      answers,
    });

    interview.communication = report.communication;
    interview.technical = report.technical;
    interview.relevance = report.relevance;
    interview.confidence = report.confidence;
    interview.resumeAccuracy = report.resumeAccuracy;
    interview.overallScore = report.overallScore;
    interview.strengths = report.strengths;
    interview.areasToImprove = report.areasToImprove;
    interview.finalFeedback = report.finalFeedback;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "AI interview report generated successfully",
      report,
    });
  } catch (error) {
    console.error("❌ REPORT GENERATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI report",
    });
  }
};

export const getResumeInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview =
      await ResumeInterview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("❌ GET RESUME INTERVIEW ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
