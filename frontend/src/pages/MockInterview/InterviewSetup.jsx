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

const interviewTypes = [
  "HR",
  "Technical",
  "Behavioral",
];

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [type, setType] = useState("");
  const [resume, setResume] = useState(null);

  const handleStart = async () => {
  if (!role || !experience || !type) {
    alert("Please fill all required fields.");
    return;
  }

  const formData = new FormData();

  formData.append("role", role);
  formData.append("experience", experience);
  formData.append("type", type);

  if (resume) {
    formData.append("resume", resume);
  }

  localStorage.setItem(
    "mockInterview",
    JSON.stringify({
      role,
      experience,
      type,
    })
  );

  navigate("/mock-interview/room");
};
  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] rounded-3xl shadow-xl border border-gray-700 p-8"
        >

          <h1 className="text-4xl font-bold text-center mb-2">
            Interview Setup
          </h1>

          <p className="text-gray-400 text-center mb-10">
            Configure your mock interview before starting.
          </p>

          {/* Role */}

          <div className="mb-8">

            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaBriefcase />
              Select Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4"
            >
              <option value="">Choose Role</option>

              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}

            </select>

          </div>

          {/* Experience */}

          <div className="mb-8">

            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaUserGraduate />
              Years of Experience
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4"
            >
              <option value="">Select Experience</option>

              {experiences.map((item) => (
                <option key={item}>{item}</option>
              ))}

            </select>

          </div>

          {/* Interview Type */}

          <div className="mb-8">

            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaClipboardList />
              Interview Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4"
            >
              <option value="">Select Interview Type</option>

              {interviewTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}

            </select>

          </div>

          {/* Resume */}

          <div className="mb-10">

            <label className="flex items-center gap-2 text-lg mb-3 font-semibold">
              <FaFileUpload />
              Resume Upload (Optional)
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3"
            />

            {resume && (
              <p className="text-green-400 mt-3">
                Selected: {resume.name}
              </p>
            )}

          </div>

          {/* Button */}

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-3 hover:scale-[1.02] transition"
          >
            <FaPlay />
            Start Interview
          </button>

        </motion.div>

      </div>

    </div>
  );
}