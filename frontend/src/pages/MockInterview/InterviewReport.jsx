import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaChartLine,
  FaMicrophone,
  FaSpellCheck,
  FaUserCheck,
  FaArrowLeft,
} from "react-icons/fa";

import { getReport } from "../../services/mockInterviewApi";

export default function InterviewReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await getReport(id);
      setReport(res.data.report);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex justify-center items-center text-white">
        Loading Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#050816] flex justify-center items-center text-white">
        Report Not Found
      </div>
    );
  }

  const totalAnswers = report.answers.length;

  const average = (field) => {
    if (!totalAnswers) return 0;

    return Math.round(
      report.answers.reduce(
        (sum, item) => sum + (item[field] || 0),
        0
      ) / totalAnswers
    );
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] rounded-3xl p-8 border border-gray-700"
        >

          <h1 className="text-4xl font-bold text-center mb-2">
            Interview Report
          </h1>

          <p className="text-center text-gray-400 mb-8">
            AI Performance Analysis
          </p>

          {/* Overall Score */}

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center mb-8">

            <h2 className="text-2xl mb-3">
              Overall Score
            </h2>

            <h1 className="text-6xl font-bold">
              {report.overallScore}/100
            </h1>

          </div>

          {/* Score Cards */}

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-[#1F2937] rounded-2xl p-6 text-center">

              <FaUserCheck
                size={40}
                className="mx-auto text-green-400 mb-4"
              />

              <h3 className="text-xl font-semibold">
                Confidence
              </h3>

              <p className="text-4xl mt-4">
                {average("confidence")}
              </p>

            </div>

            <div className="bg-[#1F2937] rounded-2xl p-6 text-center">

              <FaMicrophone
                size={40}
                className="mx-auto text-blue-400 mb-4"
              />

              <h3 className="text-xl font-semibold">
                Fluency
              </h3>

              <p className="text-4xl mt-4">
                {average("fluency")}
              </p>

            </div>

            <div className="bg-[#1F2937] rounded-2xl p-6 text-center">

              <FaSpellCheck
                size={40}
                className="mx-auto text-yellow-400 mb-4"
              />

              <h3 className="text-xl font-semibold">
                Grammar
              </h3>

              <p className="text-4xl mt-4">
                {average("grammar")}
              </p>

            </div>

          </div>

          {/* AI Feedback */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              AI Feedback
            </h2>

            {report.answers.map((item, index) => (

              <div
                key={index}
                className="bg-[#1F2937] rounded-xl p-5 mb-5"
              >

                <h3 className="font-bold text-lg mb-2">
                  Question {index + 1}
                </h3>

                <p className="text-purple-400 mb-2">
                  {item.question}
                </p>

                <p className="text-gray-300 mb-3">
                  {item.feedback}
                </p>

                <div className="text-green-400">
                  Suggestion:
                  {" "}
                  {item.improvement}
                </div>

              </div>

            ))}

          </div>

          {/* Buttons */}

          <div className="flex gap-5 mt-10">

            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
            >
              Download Report
            </button>

            <button
              onClick={() => navigate("/mock-interview")}
              className="bg-gray-700 hover:bg-gray-800 px-8 py-3 rounded-xl flex items-center gap-2"
            >
              <FaArrowLeft />
              Back
            </button>

          </div>

        </motion.div>

      </div>

    </div>
  );
}