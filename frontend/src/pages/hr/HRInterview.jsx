import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useLivePractice from "../../hooks/useLivePractice";
import ProgressBar from "./ProgressBar";
import Timer from "./Timer";
import QuestionCard from "./QuestionCard";
import AnswerBox from "./AnswerBox";
import VoiceRecorder from "./VoiceRecorder";

const API = "https://ai-interview-copilot-1-a7tr.onrender.com/api/hr";

export default function HRInterview() {
  useLivePractice("hr-interview");

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // interview metadata
  const [interviewId, setInterviewId] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState(15);

  // questions + answers
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const interviewFromState = location.state?.interview;
        const persistedInterview = localStorage.getItem("activeHRInterview");
        const interview = interviewFromState || (persistedInterview ? JSON.parse(persistedInterview) : null);

        if (interview) {
          const id = interview._id || interview.interviewId || interview.id || "";

          console.log("Interview object:", interview);
          console.log("Interview ID:", id);

          const activeInterview = {
            _id: id,
            role: interview.role || "",
            duration: interview.duration || 15,
            questions: interview.questions || [],
          };

          setInterviewId(id);
          setRole(activeInterview.role);
          setDuration(activeInterview.duration);
          setQuestions(activeInterview.questions);
          setAnswers(activeInterview.questions.map(() => ""));
          localStorage.setItem("activeHRInterview", JSON.stringify(activeInterview));
        } else {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API}/current`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const payload = res.data?.interview || res.data || {};
          const data = payload;
          setInterviewId(data._id || data.id || "");
          setRole(data.role || "");
          setDuration(data.duration || 15);
          const q = data.questions || [];
          setQuestions(q);
          setAnswers(q.map(() => ""));
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Unable to load interview");
        navigate("/hr/setup");
      }
    };

    loadInterview();
  }, [location, navigate]);

  // keep displayed answer in sync when currentIndex or answers change
  useEffect(() => {
    if (answers.length > 0) setAnswer(answers[currentIndex] || "");
  }, [currentIndex, answers]);

  // Save current answer to server
  const saveCurrentAnswer = async () => {
    try {
      setSaving(true);
      const updated = [...answers];
      updated[currentIndex] = answer;
      setAnswers(updated);

      const token = localStorage.getItem("token");
      const persistedInterview = localStorage.getItem("activeHRInterview");
      const pendingInterviewId = interviewId || (persistedInterview ? JSON.parse(persistedInterview)._id : "");

      console.log("========== SAVE HR ANSWER ==========");
      console.log("Interview ID:", pendingInterviewId);
      console.log("Current Index:", currentIndex);
      console.log("Answer:", answer);
      console.log("Current Question:", currentQuestion);

      if (!pendingInterviewId) {
        alert("Interview ID is missing");
        return false;
      }

      if (!currentQuestion) {
        alert("Current question is missing. Please restart the interview.");
        return false;
      }

      const questionId =
        currentQuestion.questionId ||
        currentQuestion._id ||
        currentQuestion.id ||
        null;

      if (!questionId) {
        console.error("Question ID is missing", currentQuestion);
        alert("Unable to save answer because the current question has no ID.");
        return false;
      }

      if (!answer || !answer.trim()) {
        alert("Please enter your answer before continuing.");
        return false;
      }

      await axios.post(
        `${API}/answer`,
        {
          interviewId: pendingInterviewId,
          questionIndex: currentIndex,
          questionId,
          question: currentQuestion.question || "",
          answer: answer.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAutoSaveStatus("Saved");
      setTimeout(() => setAutoSaveStatus(""), 2000);
      return true;
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);
      console.error("Save Answer Error:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const saved = await saveCurrentAnswer();
    if (!saved) return;
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrevious = async () => {
    const saved = await saveCurrentAnswer();
    if (!saved) return;
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSkip = async () => {
    const saved = await saveCurrentAnswer();
    if (!saved) return;
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleFinish = async () => {
    try {
      const saved = await saveCurrentAnswer();
      if (!saved) return;

      const token = localStorage.getItem("token");
      const persistedInterview = localStorage.getItem("activeHRInterview");
      const pendingInterviewId = interviewId || (persistedInterview ? JSON.parse(persistedInterview)._id : "");

      if (!pendingInterviewId) {
        alert("Interview ID is missing");
        return;
      }

      const res = await axios.post(
        `${API}/finish`,
        { interviewId: pendingInterviewId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/hr/result", {
        state: {
          report: res.data.interview || res.data,
          interviewId,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Unable to finish interview");
    }
  };

  // auto-save every 10s when interviewId exists
  useEffect(() => {
    if (!interviewId) return;
    const interval = setInterval(() => {
      if (answer.trim() !== "") saveCurrentAnswer();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, answer, currentIndex]);

  // keyboard shortcut: Ctrl+Enter -> next
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, answer]);

  // beforeunload warning
  useEffect(() => {
    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  const handleTimeUp = async () => {
    await saveCurrentAnswer();
    handleFinish();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold">Loading HR Interview...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">
          <div>
            <div className="mb-6">
  <button
    onClick={() => navigate("/hr/setup")}
    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
  >
    ← Back
  </button>
</div>
            <h1 className="text-3xl font-bold">AI HR Interview</h1>
            <p className="text-gray-400">Role : {role}</p>
          </div>

          <Timer duration={duration} onTimeUp={handleTimeUp} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6">
        <ProgressBar currentQuestion={currentIndex + 1} totalQuestions={questions.length} />

        {currentQuestion ? (
          <QuestionCard
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            question={currentQuestion.question}
            category={currentQuestion.category}
            difficulty={currentQuestion.difficulty}
          />
        ) : (
          <div className="text-center text-gray-400">No questions available.</div>
        )}

        <AnswerBox answer={answer} setAnswer={setAnswer} />

        <VoiceRecorder answer={answer} setAnswer={setAnswer} />

        {saving && <div className="mb-4 text-green-400 font-semibold">Saving answer...</div>}
        {autoSaveStatus && <div className="text-green-400 mt-2">✔ {autoSaveStatus}</div>}

        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={handleSkip}
            disabled={currentIndex === questions.length - 1}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Skip
          </button>

          {currentIndex === questions.length - 1 ? (
            <button onClick={() => setShowFinishModal(true)} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg">
              Finish Interview
            </button>
          ) : (
            <button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg">
              Next Question
            </button>
          )}
        </div>
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-slate-900 rounded-xl p-8 w-[420px]">
            <h2 className="text-2xl font-bold mb-4">Finish Interview?</h2>
            <p className="text-gray-400">Are you sure you want to submit your interview?</p>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowFinishModal(false)} className="bg-gray-700 px-5 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={handleFinish} className="bg-red-600 px-5 py-2 rounded-lg">
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}