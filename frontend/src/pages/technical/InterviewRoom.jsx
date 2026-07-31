import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timer from "../../components/technical/Timer";
import ProblemPanel from "../../components/technical/ProblemPanel";
import CodeEditor from "../../components/technical/CodeEditor";
import TestCases from "../../components/technical/TestCases";
import api from "../../services/api";
import { runCode, submitCode } from "../../services/judgeApi";

export default function InterviewRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const storedInterviewState = useMemo(() => {
    if (typeof window === "undefined") return null;
    const saved = sessionStorage.getItem("interviewState");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const initialInterviewState = state || storedInterviewState;

  const [questions, setQuestions] = useState(initialInterviewState?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState(() =>
    (initialInterviewState?.questions || []).map(() => "")
  );
  const [questionEvaluations, setQuestionEvaluations] = useState(() =>
    (initialInterviewState?.questions || []).map(() => null)
  );
  const [questionImprovements, setQuestionImprovements] = useState(() =>
    (initialInterviewState?.questions || []).map(() => "")
  );
  const [evaluation, setEvaluation] = useState(null);
  const [improvedAnswer, setImprovedAnswer] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready to evaluate your answer.");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const starterCode = useMemo(() => {
    const language = initialInterviewState?.language || "JavaScript";
    return {
      JavaScript: `function twoSum(nums, target) {\n\n    // Write your code here\n\n}`,
      Python: `def two_sum(nums, target):\n\n    # Write your code here\n\n    pass`,
      Java: `class Solution {\n\n    public int[] twoSum(int[] nums, int target) {\n\n    }\n\n}`,
      "C++": `class Solution {\npublic:\n\n    vector<int> twoSum(vector<int>& nums, int target) {\n\n    }\n\n};`,
      C: `#include<stdio.h>\n\nint main(){\n\n    return 0;\n\n}`,
    }[language] || `function twoSum(nums, target) {\n\n    // Write your code here\n\n}`;
  }, [initialInterviewState?.language]);

  useEffect(() => {
    if (!questions.length) return;

    setCurrentQuestionIndex(0);
    setCode(starterCode);
    setQuestionAnswers(questions.map(() => starterCode));
    setQuestionEvaluations(questions.map(() => null));
    setQuestionImprovements(questions.map(() => ""));
    setEvaluation(null);
    setImprovedAnswer("");
    setStatusMessage("Ready to evaluate your answer.");
  }, [questions, starterCode]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionTitle = currentQuestion?.title || "Interview Question";
  const currentQuestionDescription =
    currentQuestion?.description || currentQuestion?.title || "No question available.";
  const questionText = currentQuestionDescription;

  const saveCurrentQuestionEntry = () => {
    setQuestionAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = code;
      return next;
    });
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    setQuestionAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = newValue;
      return next;
    });
  };

  const goToQuestion = (newIndex) => {
    const nextIndex = Math.min(Math.max(0, newIndex), questions.length - 1);
    const nextAnswers = [...questionAnswers];
    nextAnswers[currentQuestionIndex] = code;

    setQuestionAnswers(nextAnswers);
    setCurrentQuestionIndex(nextIndex);
    setCode(nextAnswers[nextIndex] || starterCode);
    setEvaluation(questionEvaluations[nextIndex] || null);
    setImprovedAnswer(questionImprovements[nextIndex] || "");
    setStatusMessage("Ready to evaluate your answer.");
  };
const handleRun = async () => {
  if (!currentQuestion) {
    setStatusMessage("No question selected.");
    return;
  }

  setIsRunning(true);

  try {
    const response = await runCode({
      question: {
        ...currentQuestion,
        execution: currentQuestion.execution || {},
        testCases: currentQuestion.testCases || [],
      },
      userCode: code,
      language: initialInterviewState?.language || "JavaScript",
    });

    if (response.success) {
      setEvaluation(response.result);
      setStatusMessage("Code executed successfully.");
    } else {
      setStatusMessage(response.message);
    }
  } catch (error) {
    console.error(error);
    setStatusMessage("Run failed.");
  } finally {
    setIsRunning(false);
  }
};

const handleSubmit = async () => {
  if (!currentQuestion) {
    setStatusMessage("No question selected.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await submitCode({
      question: {
        ...currentQuestion,
        execution: currentQuestion.execution || {},
        testCases: currentQuestion.testCases || [],
      },
      userCode: code,
      language: initialInterviewState?.language || "JavaScript",
    });

    if (response.success) {
      setEvaluation(response.result);
      setStatusMessage("Submission successful.");
    } else {
      setStatusMessage(response.message);
    }
  } catch (error) {
    console.error(error);
    setStatusMessage("Submission failed.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSaveSession = async () => {
    setIsSaving(true);
    setStatusMessage("Saving your session...");

    try {
      saveCurrentQuestionEntry();
      await api.post("/interview/sessions", {
        role: initialInterviewState?.role || "Developer",
        question_type: initialInterviewState?.role || "Technical",
        mode: "practice",
        experience: initialInterviewState?.difficulty || "Medium",
        company: "",
        num_questions: questions.length,
        avg_score: evaluation?.score || 0,
        questions: questions.map((question) =>
          typeof question === "string"
            ? question
            : question.question || question.description || question.title || ""
        ),
        answers: questionAnswers.reduce((acc, answer, index) => {
          if (answer) acc[index] = answer;
          return acc;
        }, {}),
        evaluations: questionEvaluations.reduce((acc, evalObj, index) => {
          if (evalObj) acc[index] = evalObj;
          return acc;
        }, {}),
        timeSpent: (initialInterviewState?.duration || 30) * 60,
      });

      setStatusMessage("Interview session saved.");
      navigate("/technical/report");
    } catch (error) {
      setStatusMessage(error.response?.data?.message || error.message || "Session save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (value) => {
    setCode(value);
    setEvaluation(null);
    setImprovedAnswer("");
    setStatusMessage("Starter code restored.");
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl text-center">
          <h1 className="text-2xl font-bold">No interview questions loaded</h1>
          <p className="text-slate-400 mt-3">Return to setup and start a fresh interview.</p>
          <button
            onClick={() => navigate("/technical/setup")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
          >
            Go back to setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 px-8 py-4">
        <div>
          <button
  onClick={() => navigate("/technical/setup")}
  className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
>
  ← Back
</button>
          <h1 className="text-2xl font-bold">Technical Interview</h1>
          <p className="text-slate-400 text-sm mt-1">
            {initialInterviewState?.role} • {initialInterviewState?.difficulty} • {initialInterviewState?.language}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Session"}
          </button>
          <Timer duration={initialInterviewState?.duration || 30} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-5">
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div>
              <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} / {questions.length}</p>
              <h2 className="text-lg font-semibold">{questionText}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                className="rounded-lg bg-slate-800 px-3 py-2"
              >
                Previous
              </button>
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                className="rounded-lg bg-slate-800 px-3 py-2"
              >
                Next
              </button>
            </div>
          </div>

          <ProblemPanel
            problem={{
              title: currentQuestionTitle,
              difficulty: initialInterviewState?.difficulty || "Medium",
              category: initialInterviewState?.role || "Technical",
              description: currentQuestionDescription,
              examples: currentQuestion?.examples || [],
              constraints: currentQuestion?.constraints || ["Explain your reasoning clearly.", "Mention a concrete example if possible."],
            }}
          />
        </div>

        <div className="col-span-7 flex flex-col gap-4">
          <CodeEditor
            language={initialInterviewState?.language || "JavaScript"}
            value={code}
            onChange={handleCodeChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          <TestCases
            evaluation={evaluation}
            improvedAnswer={improvedAnswer}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    </div>
  );
}