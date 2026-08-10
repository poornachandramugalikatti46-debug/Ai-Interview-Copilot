import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaUserGraduate,
  FaClipboardList,
  FaFileUpload,
  FaPlay,
} from "react-icons/fa";

import { startInterview } from "../../services/mockInterviewApi";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Python Developer",
  "Java Developer",
  "MERN Stack Developer",
];

const experiences = [
  "Fresher",
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];

const interviewTypes = ["HR", "Technical", "Behavioral"];

const difficulties = ["Easy", "Medium", "Hard"];

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  const [resume, setResume] = useState(null);

  // User chooses number of questions
  const [questionCount, setQuestionCount] = useState(5);

  const [starting, setStarting] = useState(false);

  // ============================================
  // START INTERVIEW
  // ============================================

  const handleStart = async () => {
    if (!role || !experience || !type) {
      alert("Please fill all required fields.");
      return;
    }

    if (!questionCount || questionCount < 1 || questionCount > 20) {
      alert("Please select between 1 and 20 questions.");
      return;
    }

    try {
      setStarting(true);

      const formData = new FormData();

      // IMPORTANT:
      // These names MUST match backend controller.

      formData.append("role", role);
      formData.append("experience", experience);
      formData.append("interviewType", type);
      formData.append("difficulty", difficulty);
      formData.append("questionLimit", String(questionCount));

      if (resume) {
        formData.append("resume", resume);
      }

      console.log("Starting Mock Interview...");

      const response = await startInterview(formData);

      const data = response.data;

      if (!data?.success) throw new Error(data?.message || "Failed to start interview");
      if (!data?.interviewId) throw new Error("Interview ID was not returned from backend.");

      // ========================================
      // SAVE INTERVIEW INFORMATION
      // ========================================

      localStorage.setItem(
        "mockInterview",
        JSON.stringify({
          interviewId: data.interviewId,
          role,
          experience,
          type,
          interviewType: type,
          difficulty,
          // Keep both names for compatibility
          questionCount,
          questionLimit: questionCount,
          totalQuestions: questionCount,
          resumeName: resume ? resume.name : "",
          firstQuestion: "",
        })
      );

      // ========================================
      // GO TO INTERVIEW ROOM
      // ========================================

      navigate("/mock-interview/room");
    } catch (error) {
      console.error("Failed to start interview:", error);
      console.error("Backend response:", error?.response?.data);
      alert(error?.response?.data?.message || error.message || "Failed to start interview. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] rounded-3xl shadow-xl border border-gray-700 p-8"
        >
          <h1 className="text-4xl font-bold text-center mb-2">Interview Setup</h1>
          <p className="text-gray-400 text-center mb-10">Configure your mock interview before starting.</p>

          {/* ROLE */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaBriefcase /> Select Role
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4">
              <option value="">Choose Role</option>
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* EXPERIENCE */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaUserGraduate /> Years of Experience
            </label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4">
              <option value="">Select Experience</option>
              {experiences.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* INTERVIEW TYPE */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaClipboardList /> Interview Type
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4">
              <option value="">Select Interview Type</option>
              {interviewTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* DIFFICULTY */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaClipboardList /> Difficulty
            </label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4">
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* RESUME */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaFileUpload /> Resume Upload (Optional)
            </label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] || null)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3" />
            {resume && <p className="text-green-400 mt-3">Selected: {resume.name}</p>}
          </div>

          {/* QUESTION COUNT */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaClipboardList /> Number of Questions
            </label>
            <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
            <p className="text-gray-400 text-sm mt-2">You can choose how many questions you want in this interview.</p>
          </div>

          {/* START BUTTON */}
          <button type="button" onClick={handleStart} disabled={starting} className={`w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition ${starting ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"}`}>
            <FaPlay size={18} />
            {starting ? "Starting Interview..." : `Start ${questionCount}-Question Interview`}
          </button>

        </motion.div>
      </div>
    </div>
  );
}
