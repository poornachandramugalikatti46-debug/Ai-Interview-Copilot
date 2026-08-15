import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaRobot,
} from "react-icons/fa";

import {
  submitResumeAnswer,
  generateResumeInterviewReport,
} from "../../services/resumeInterviewApi";

const ResumeInterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get interview from location state
  const interview = location.state?.interview;
  const interviewId = interview?.id || id;

  const questions = interview?.questions || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(interview?.status || "started");

  const question = questions[currentQuestion];

  const handleSubmit = async () => {
    try {
      if (!interviewId) {
        alert("Interview ID is missing. Please restart the interview.");
        return;
      }

      if (!answer.trim()) {
        alert("Please enter your answer.");
        return;
      }

      if (!question) {
        alert("Question not found.");
        return;
      }

      setLoading(true);

      console.log("Submitting:", {
        interviewId,
        question,
        answer,
      });

      const response = await submitResumeAnswer({
        interviewId,
        question,
        answer,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to submit answer");
      }

      setAnswer("");
      setFeedback(response.evaluation);

      if (response.status === "completed") {
        setStatus("completed");

        try {
          const reportResponse = await generateResumeInterviewReport(interviewId);
          console.log("✅ AI REPORT GENERATED:", reportResponse);

          navigate(`/resume-interview/${interviewId}/report`, {
            state: {
              report: reportResponse.report || reportResponse.data || {},
            },
          });
        } catch (reportError) {
          console.error("AI REPORT ERROR:", reportError);
          navigate(`/resume-interview/${interviewId}/report`);
        }

        return;
      }

      setCurrentQuestion(response.currentQuestion);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "SUBMIT ANSWER ERROR:",
        error.response?.data || error.message || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit answer"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Interview data not found</p>
          <button
            onClick={() => navigate("/resume-interview")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No questions loaded</p>
          <button
            onClick={() => navigate("/resume-interview")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const questionNumber = currentQuestion + 1;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/resume-interview")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft />
          Exit Interview
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <FaRobot />
              AI RESUME INTERVIEW
            </div>

            <h1 className="text-3xl font-bold mt-2">Interview Room</h1>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl">
            Question <span className="font-bold">{questionNumber}</span> / {totalQuestions}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-3xl p-7 mb-7">
          <div className="flex items-center gap-3 text-purple-300 text-sm font-semibold mb-4">
            <FaRobot />
            AI INTERVIEWER
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed">
            {question}
          </h2>
        </div>

        {/* Answer Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 mb-7">
          <label className="text-xl font-bold">Your Answer</label>

          <p className="text-gray-400 text-sm mt-2 mb-4">
            Explain your answer clearly. Include technical details where relevant.
          </p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSubmit();
              }
            }}
            placeholder="Type your answer here..."
            rows={9}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white outline-none resize-none focus:border-purple-500 transition"
            disabled={loading}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-500 text-sm">Ctrl + Enter to submit</span>

            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-7 py-4 rounded-xl font-bold flex items-center gap-3 transition"
            >
              <FaPaperPlane />
              {loading
                ? "AI Evaluating..."
                : questionNumber === totalQuestions
                ? "Finish Interview"
                : "Submit Answer"}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <h2 className="text-2xl font-bold mb-6">📊 AI Feedback</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-semibold">Score</p>
                <p className="text-4xl font-bold text-green-400 mt-2">
                  {feedback.score}/20
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-semibold">Feedback</p>
                <p className="text-white mt-2">{feedback.feedback}</p>
              </div>
            </div>

            {status !== "completed" && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-3">Ready for the next question?</p>
                <button
                  onClick={() => setFeedback(null)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        )}

        {status === "completed" && !feedback && (
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/20 rounded-3xl p-7 text-center">
            <h2 className="text-3xl font-bold mb-4">✅ Interview Completed!</h2>
            <p className="text-gray-300 mb-6">
              Generating your final report...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeInterviewRoom;
