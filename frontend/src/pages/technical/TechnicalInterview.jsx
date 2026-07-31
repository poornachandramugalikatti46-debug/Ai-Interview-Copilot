import { motion } from "framer-motion";
import { Code2, Brain, Trophy, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TechnicalInterview({setCurrentPage}) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code2 size={32} />,
      title: "Coding Problems",
      description: "Solve real interview coding questions.",
    },
    {
      icon: <Brain size={32} />,
      title: "AI Code Review",
      description: "Get AI feedback on your code quality and logic.",
    },
    {
      icon: <Trophy size={32} />,
      title: "Interview Score",
      description: "Receive detailed performance reports and scores.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <button
  onClick={() => {
    setCurrentPage("dashboard");
    navigate("/");
  }}
  className="bg-gray-600 text-white px-4 py-2 rounded"
>
  ← Back
</button>

        <h1 className="text-5xl font-extrabold mt-6">
          Technical Coding Interview
        </h1>

        <p className="mt-5 text-lg text-slate-400 max-w-3xl mx-auto">
          Practice real coding interviews with AI. Solve problems, run your
          code, submit solutions, receive AI reviews, complexity analysis,
          interview scores, and a complete performance report.
        </p>

        <button
          onClick={() => navigate("/technical/setup")}
          className="mt-10 inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          <PlayCircle size={22} />
          Start Technical Interview
        </button>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="text-blue-400">{item.icon}</div>

              <h2 className="text-2xl font-bold mt-4">{item.title}</h2>

              <p className="text-slate-400 mt-3">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Interview Flow */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">Interview Flow</h2>

          <div className="grid md:grid-cols-6 gap-4 text-center">
            <div className="bg-slate-800 rounded-xl p-4">
              Interview Setup
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              Coding Problem
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              Code Editor
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              Run &amp; Submit
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              AI Review
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              Final Report
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}