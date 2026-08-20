import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startTechnicalInterview } from "../../services/technicalInterviewApi";

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("JavaScript");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState(3);
  const [company, setCompany] = useState("Random");
  const [topic, setTopic] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!role || !difficulty || !language) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await startTechnicalInterview({
        role,
        difficulty,
        language,
        duration,
        count: questions,
        company,
        topic,
      });

      const data = res?.data || {};

      if (data.success === false) {
        setError(
          data.message ||
            "Unable to start the technical interview."
        );
        return;
      }

      const interviewQuestions = Array.isArray(
        data.questions
      )
        ? data.questions
        : [];

      if (interviewQuestions.length === 0) {
        setError(
          data.message ||
            "No interview questions were returned."
        );
        return;
      }

      const interviewId = data.interviewId || null;
      const interviewData = {
        interviewId,
        role,
        difficulty,
        language,
        duration,
        company,
        topic,
        questions: interviewQuestions,
      };

      sessionStorage.setItem(
        "technicalInterviewQuestions",
        JSON.stringify(interviewQuestions)
      );
      sessionStorage.setItem(
        "technicalInterviewConfig",
        JSON.stringify({
          interviewId,
          role,
          difficulty,
          language,
          duration,
          company,
          topic,
        })
      );

      navigate("/technical/interview", {
        state: interviewData,
      });
    } catch (err) {
      console.error(
        "START TECHNICAL INTERVIEW ERROR:",
        err.response?.data || err
      );
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
  className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
>
  ← Back
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
            Company
          </label>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option>Random</option>
            <option>Google</option>
            <option>Amazon</option>
            <option>Microsoft</option>
            <option>Adobe</option>
            <option>TCS</option>
            <option>Infosys</option>
            <option>Accenture</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Topic
          </label>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800"
          >
            <option>Mixed</option>
            <option>Arrays</option>
            <option>Strings</option>
            <option>Linked List</option>
            <option>Stack</option>
            <option>Queue</option>
            <option>Trees</option>
            <option>Graphs</option>
            <option>Dynamic Programming</option>
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
            Interview Rules
          </h2>

          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Timer starts immediately after the interview begins.</li>
            <li>You can run your code before submission.</li>
            <li>Hidden test cases are used for final evaluation.</li>
            <li>AI code review will be generated after submission.</li>
            <li>Do not refresh the page during the interview.</li>
          </ul>
        </div>

        <div className="mt-8 bg-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">
            Interview Summary
          </h2>

          <div className="space-y-2 text-slate-300">
            <p>Role : {role}</p>
            <p>Difficulty : {difficulty}</p>
            <p>Language : {language}</p>
            <p>Company : {company}</p>
            <p>Topic : {topic}</p>
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
          {loading ? "Loading questions..." : "🚀 Start Coding Interview"}
        </button>
      </motion.div>
    </div>
  );
}