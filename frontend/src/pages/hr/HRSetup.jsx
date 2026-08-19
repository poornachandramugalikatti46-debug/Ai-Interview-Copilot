import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://ai-interview-copilot-1-a7tr.onrender.com/api/hr";

export default function HRSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    role: "Frontend Developer",
    experience: "Fresher",
    difficulty: "Easy",
    totalQuestions: 5,
    duration: 15,
  });

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Python Developer",
    "Java Developer",
    "React Developer",
    "Node.js Developer",
    "Software Engineer",
    "Data Analyst",
    "DevOps Engineer",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "totalQuestions" || e.target.name === "duration"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const startInterview = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        role: form.role,
        experience: form.experience,
        difficulty: form.difficulty,
        totalQuestions: form.totalQuestions,
      };

      const res = await axios.post(`${API}/start`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const interview = {
        _id: res.data.interviewId,
        role: form.role,
        duration: form.duration,
        questions: res.data.questions,
        experience: form.experience,
        difficulty: form.difficulty,
        totalQuestions: form.totalQuestions,
      };

      localStorage.setItem("activeHRInterview", JSON.stringify(interview));

      navigate("/hr/interview", {
        state: {
          interview,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-8">

      <div className="w-full max-w-3xl bg-slate-900 rounded-3xl shadow-xl p-10">
      <div className="mb-6">
  <button
    onClick={() => navigate("/dashboard")}
    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
  >
    ← Back 
  </button>
</div>
        <h1 className="text-4xl font-bold text-center mb-3">
          HR Interview Setup
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Configure your interview before starting.
        </p>

        {/* Role */}

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Job Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-slate-800 rounded-lg p-3 outline-none"
          >
            {roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>

        </div>

        {/* Experience */}

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Experience
          </label>

          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full bg-slate-800 rounded-lg p-3"
          >
            <option>Fresher</option>
            <option>0-1 Years</option>
            <option>1-3 Years</option>
            <option>3-5 Years</option>
            <option>5+ Years</option>
          </select>

        </div>

        {/* Difficulty */}

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Difficulty
          </label>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full bg-slate-800 rounded-lg p-3"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

        </div>

        {/* Questions */}

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Number of Questions
          </label>

          <select
            name="totalQuestions"
            value={form.totalQuestions}
            onChange={handleChange}
            className="w-full bg-slate-800 rounded-lg p-3"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

        </div>

        {/* Duration */}

        <div className="mb-8">

          <label className="block mb-2 font-semibold">
            Interview Duration (Minutes)
          </label>

          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full bg-slate-800 rounded-lg p-3"
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>

        </div>

        {/* Summary */}

        <div className="bg-slate-800 rounded-xl p-5 mb-8">

          <h3 className="font-bold text-lg mb-3">
            Interview Summary
          </h3>

          <div className="space-y-2 text-gray-300">

            <p>Role : {form.role}</p>

            <p>Experience : {form.experience}</p>

            <p>Difficulty : {form.difficulty}</p>

            <p>Questions : {form.totalQuestions}</p>

            <p>Duration : {form.duration} Minutes</p>

          </div>

        </div>

        {/* Button */}

        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl py-4 text-lg font-bold"
        >
          {loading
            ? "Starting Interview..."
            : "Start HR Interview"}
        </button>

      </div>

    </div>
  );
}