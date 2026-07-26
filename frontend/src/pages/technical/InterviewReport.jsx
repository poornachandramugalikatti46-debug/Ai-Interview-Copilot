import { Trophy, Clock, Code2, Brain, RotateCcw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InterviewReport() {
  const navigate = useNavigate();

  const report = {
    score: 91,
    accuracy: "90%",
    questionsSolved: "3 / 3",
    timeTaken: "26 min",
    language: "JavaScript",

    strengths: [
      "Strong problem solving",
      "Clean code structure",
      "Efficient algorithm",
    ],

    weaknesses: [
      "Need better code comments",
      "Can improve edge case handling",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center mb-10">

          <Trophy className="mx-auto text-yellow-400" size={60} />

          <h1 className="text-5xl font-bold mt-4">
            Interview Completed
          </h1>

          <p className="text-slate-400 mt-2">
            Congratulations! Here is your performance report.
          </p>

        </div>

        {/* Score */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col items-center">

            <div className="w-36 h-36 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold">
              {report.score}
            </div>

            <h2 className="text-3xl font-bold mt-5">
              Overall Score
            </h2>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-5 mt-8">

          <div className="bg-slate-900 rounded-xl p-5">

            <Code2 className="text-blue-400 mb-3"/>

            <p className="text-slate-400">
              Questions
            </p>

            <h3 className="text-2xl font-bold">
              {report.questionsSolved}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5">

            <Clock className="text-green-400 mb-3"/>

            <p className="text-slate-400">
              Time Taken
            </p>

            <h3 className="text-2xl font-bold">
              {report.timeTaken}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5">

            <Brain className="text-purple-400 mb-3"/>

            <p className="text-slate-400">
              Accuracy
            </p>

            <h3 className="text-2xl font-bold">
              {report.accuracy}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5">

            <Code2 className="text-orange-400 mb-3"/>

            <p className="text-slate-400">
              Language
            </p>

            <h3 className="text-2xl font-bold">
              {report.language}
            </h3>

          </div>

        </div>

        {/* Strengths */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-slate-900 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-green-400 mb-5">
              Strengths
            </h2>

            <ul className="space-y-3">

              {report.strengths.map((item,index)=>(
                <li key={index}>
                  ✅ {item}
                </li>
              ))}

            </ul>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-red-400 mb-5">
              Improvements
            </h2>

            <ul className="space-y-3">

              {report.weaknesses.map((item,index)=>(
                <li key={index}>
                  ⚠️ {item}
                </li>
              ))}

            </ul>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex justify-center gap-5 mt-10">

          <button
            onClick={() => navigate("/technical/setup")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
          >
            <RotateCcw size={20}/>
            Retry Interview
          </button>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
          >
            <Download size={20}/>
            Download Report
          </button>

        </div>

      </div>

    </div>
  );
}