import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaRocket,
  FaCheckCircle,
  FaFilePdf,
} from "react-icons/fa";

import {
  uploadResume,
  startResumeInterview,
} from "../../services/resumeInterviewApi";

const ResumeInterviewSetup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("Fresher");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      console.log(
        "🔍 Uploading resume:",
        file.name
      );

      if (file.type !== "application/pdf") {
        alert("Please upload a PDF resume.");
        return;
      }

      setExtracting(true);
      setResumeFile(file);
      setResumeText("");

      const response =
        await uploadResume(file);

      console.log(
        "✅ RESUME RESPONSE:",
        response
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to extract resume"
        );
      }

      const extractedText =
        response.resumeText || "";

      if (!extractedText.trim()) {
        throw new Error(
          response.message ||
            "No text found in resume"
        );
      }

      setResumeText(
        extractedText
      );

      console.log(
        "✅ RESUME TEXT EXTRACTED"
      );

      console.log(
        response.resumeText
      );
    } catch (error) {
      console.error(
        "❌ RESUME UPLOAD ERROR:",
        error.response?.data ||
          error.message
      );

      setResumeFile(null);
      setResumeText("");

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to extract resume"
      );
    } finally {
      setExtracting(false);
    }
  };

  const handleStart = async () => {
    try {
      if (!resumeText.trim()) {
        setError(
          "Please upload your resume first."
        );
        return;
      }

      if (!role) {
        setError("Please select a role.");
        return;
      }

      setLoading(true);

      console.log(
        "🚀 Starting resume interview"
      );

      console.log({
        role,
        experience,
        resumeTextLength:
          resumeText.length,
      });

      const response =
        await startResumeInterview({
          role,
          experience,
          resumeText,
        });

      console.log(
        "START INTERVIEW:",
        response
      );

      if (!response.success) {
        throw new Error(
          response.message
        );
      }

      navigate(
        `/resume-interview/${response.interview.id}`,
        {
          state: {
            interview: response.interview,
          },
        }
      );
    } catch (error) {
      console.error(
        "❌ START INTERVIEW ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to start interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
            <FaRocket />
            AI Resume Interview
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            Practice With Your Resume
          </h1>

          <p className="text-gray-400 mt-4 text-lg max-w-3xl">
            Upload your PDF resume. AI will extract the text and generate personalized
            interview questions based on your projects, skills, and experience.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Interview Setup</h2>

            {/* Resume Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Upload Resume (PDF)
              </label>
              <label className="w-full bg-slate-800 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-lg px-4 py-6 cursor-pointer transition flex flex-col items-center justify-center">
                <FaFilePdf className="text-red-400 text-3xl mb-2" />
                <p className="text-sm font-semibold">Choose PDF file</p>
                <p className="text-xs text-gray-400 mt-1">
                  {extracting ? "Extracting text..." : "Max 5 MB"}
                </p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeUpload}
                  disabled={extracting}
                  className="hidden"
                />
              </label>

              {extracting && (
                <div className="mt-4 bg-slate-800 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-semibold">
                    🔄 Extracting resume text...
                  </p>
                </div>
              )}

              {resumeFile && resumeText && (
                <div className="mt-4 bg-slate-800 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-semibold">
                    ✅ Resume uploaded successfully
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    File: {resumeFile.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    Characters extracted:{" "}
                    {resumeText.length}
                  </p>
                </div>
              )}
            </div>

            {/* Role Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Full Stack Developer"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Fresher">Fresher</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={loading || !resumeText.trim() || extracting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition"
            >
              <FaRocket />
              {loading
                ? "AI is generating questions..."
                : "Start Resume Interview"}
            </button>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>

            <div className="space-y-5">
              <Feature
                title="Upload Resume"
                text="Upload your PDF resume (max 5 MB)"
              />

              <Feature
                title="Extract Text"
                text="We automatically extract text from your resume"
              />

              <Feature
                title="Generate Questions"
                text="AI generates questions based on your resume and role"
              />

              <Feature
                title="Answer Questions"
                text="Answer interview questions specific to your experience"
              />

              <Feature
                title="Get Feedback"
                text="Receive AI-generated scoring and improvement suggestions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, text }) => {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <FaCheckCircle className="text-green-400" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{text}</p>
      </div>
    </div>
  );
};

export default ResumeInterviewSetup;
