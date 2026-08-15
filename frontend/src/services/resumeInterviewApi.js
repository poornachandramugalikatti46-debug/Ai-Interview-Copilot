import axios from "axios";

const API = "http://localhost:5000/api/resume-interview";

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();

    formData.append("resume", file);

    console.log(
      "Uploading resume:",
      file.name
    );

    const response = await axios.post(
      `${API}/upload`,
      formData
    );

    const payload = response.data || {};
    const normalized = {
      success: payload.success ?? true,
      message: payload.message || "Resume uploaded successfully",
      fileName: payload.data?.fileName || file.name,
      resumeText: payload.data?.resumeText || "",
      textLength: payload.data?.textLength || 0,
    };

    console.log(
      "RESUME UPLOAD RESPONSE:",
      normalized
    );

    return normalized;
  } catch (error) {
    console.error(
      "RESUME UPLOAD ERROR:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export const startResumeInterview = async ({
  role,
  experience,
  resumeText,
}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API}/start`,
      {
        role,
        experience,
        resumeText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "START RESUME INTERVIEW ERROR:",
      error.response?.data || error
    );

    throw error;
  }
};

export const submitResumeAnswer = async ({
  interviewId,
  question,
  answer,
}) => {
  try {
    console.log("SUBMIT ANSWER DATA:", {
      interviewId,
      question,
      answer,
    });

    if (!interviewId) {
      throw new Error("Interview ID is missing");
    }

    if (!question) {
      throw new Error("Question is missing");
    }

    if (!answer || !answer.trim()) {
      throw new Error("Answer is required");
    }

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/resume-interview/answer",
      {
        interviewId,
        question,
        answer: answer.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

    console.log("ANSWER SUBMITTED:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "SUBMIT RESUME ANSWER ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const generateResumeInterviewReport = async (interviewId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API}/generate-report`,
      { interviewId },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "GENERATE RESUME REPORT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getResumeInterview = async (
  interviewId
) => {
  const response = await axios.get(
    `${API}/${interviewId}`
  );

  return response.data;
};