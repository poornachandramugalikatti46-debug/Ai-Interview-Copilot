import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { ArrowLeft } from "lucide-react";

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("JavaScript");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/interview/questions", {
        role,
        experience: difficulty,
        question_type: role,
        num_questions: questions,
        company: "",
      });

      const generatedQuestions = response.data?.questions || [];

      if (!generatedQuestions.length) {
        throw new Error("No interview questions were returned.");
      }

      const interviewState = {
        role,
        difficulty,
        language,
        duration,
        questions: generatedQuestions,
        questionCount: questions,
      };

      sessionStorage.setItem("interviewState", JSON.stringify(interviewState));

      navigate("/technical/interview", {
        state: interviewState,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to start the interview right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-slate-900 rounded-3xl p-10 border border-slate-800"
      >
        <button
  onClick={() => navigate("/technical")}
  className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
>
  <ArrowLeft size={18} />
  Back
</button>
        <h1 className="text-4xl font-bold text-center">
          Interview Setup
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Configure your coding interview before starting.
        </p>

        <div className="mt-8">
          <label className="block mb-2 font-semibold">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full Stack</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Mixed</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Programming Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
            <option>C</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Interview Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Number of Questions
          </label>

          <select
            value={questions}
            onChange={(e) => setQuestions(Number(e.target.value))}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
          </select>
        </div>

        <div className="mt-8 bg-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">
            Interview Summary
          </h2>

          <div className="space-y-2 text-slate-300">
            <p>Role : {role}</p>
            <p>Difficulty : {difficulty}</p>
            <p>Language : {language}</p>
            <p>Duration : {duration} Minutes</p>
            <p>Questions : {questions}</p>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-lg font-bold disabled:opacity-60"
        >
          {loading ? "Loading questions..." : "Start Interview"}
        </button>
      </motion.div>
    </div>
  );
}