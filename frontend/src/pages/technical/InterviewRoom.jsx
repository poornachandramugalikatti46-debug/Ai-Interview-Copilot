import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timer from "../../components/technical/Timer";
import ProblemPanel from "../../components/technical/ProblemPanel";
import CodeEditor from "../../components/technical/CodeEditor";
import TestCases from "../../components/technical/TestCases";
import {
  runCode,
  submitCode,
  getAIReview,
} from "../../services/judgeApi";
import {
  saveTechnicalSession,
  finishTechnicalInterview,
} from "../../services/technicalInterviewApi";

export default function InterviewRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const storedInterviewState = useMemo(() => {
    if (typeof window === "undefined") return null;
    const saved = sessionStorage.getItem("technicalInterviewState");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const initialInterviewState = state || storedInterviewState;

  const [questions, setQuestions] = useState(initialInterviewState?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    initialInterviewState?.currentQuestionIndex || 0
  );
  const [language, setLanguage] = useState(initialInterviewState?.language || "JavaScript");
  const [role, setRole] = useState(initialInterviewState?.role || "Frontend");
  const [difficulty, setDifficulty] = useState(initialInterviewState?.difficulty || "Easy");
  const [duration, setDuration] = useState(initialInterviewState?.duration || 30);
  const [company, setCompany] = useState(initialInterviewState?.company || "Random");
  const [topic, setTopic] = useState(initialInterviewState?.topic || "Mixed");
  const [interviewId, setInterviewId] = useState(initialInterviewState?.interviewId || null);

  const [code, setCode] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState(() =>
    (initialInterviewState?.questions || []).map(() => "")
  );
  const [questionEvaluations, setQuestionEvaluations] = useState(() =>
    (initialInterviewState?.questions || []).map(() => null)
  );
  const [evaluation, setEvaluation] = useState(null);
  const [aiReview, setAIReview] = useState(initialInterviewState?.aiReview || null);
  const [statusMessage, setStatusMessage] = useState("Ready to evaluate your answer.");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const defaultStarterCode = useMemo(() => {
    return {
      JavaScript: `function twoSum(nums, target) {\n\n    // Write your code here\n\n}`,
      Python: `def two_sum(nums, target):\n\n    # Write your code here\n\n    pass`,
      Java: `class Solution {\n\n    public int[] twoSum(int[] nums, int target) {\n\n    }\n\n}`,
      "C++": `class Solution {\npublic:\n\n    vector<int> twoSum(vector<int>& nums, int target) {\n\n    }\n\n};`,
      C: `#include<stdio.h>\n\nint main(){\n\n    return 0;\n\n}`,
    }[language] || `function twoSum(nums, target) {\n\n    // Write your code here\n\n}`;
  }, [language]);

  useEffect(() => {
    if (!questions.length) {
      return;
    }

    const initialCodes = questions.map(
      (question) => question.starterCode || question.starter_code || defaultStarterCode
    );

    setQuestionAnswers(initialCodes);
    setQuestionEvaluations(questions.map(() => null));
    setCode(initialCodes[currentQuestionIndex] || defaultStarterCode);
    setEvaluation(null);
    setAIReview(initialInterviewState?.aiReview || null);
    setStatusMessage("Ready to evaluate your answer.");
  }, [questions, currentQuestionIndex, defaultStarterCode, initialInterviewState?.aiReview]);

  useEffect(() => {
    const timer = setInterval(() => {
      const draftState = {
        interviewId,
        role,
        difficulty,
        language,
        duration,
        company,
        topic,
        questions,
        answers: questionAnswers,
        evaluations: questionEvaluations,
        currentQuestionIndex,
        aiReview,
      };

      sessionStorage.setItem("technicalInterviewState", JSON.stringify(draftState));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 1000);
    }, 10000);

    return () => clearInterval(timer);
  }, [questions, questionAnswers, questionEvaluations, currentQuestionIndex, interviewId, role, difficulty, language, duration, company, topic, aiReview]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionTitle = currentQuestion?.title || "Interview Question";
  const currentQuestionDescription =
    currentQuestion?.description || currentQuestion?.title || "No question available.";

  const getCurrentAnswers = () => {
    const nextAnswers = [...questionAnswers];
    nextAnswers[currentQuestionIndex] = code;
    return nextAnswers;
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    setQuestionAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = newValue;
      return next;
    });
  };

  const canAdvance = questionEvaluations[currentQuestionIndex] != null;

  const goToQuestion = (newIndex) => {
    const nextIndex = Math.min(Math.max(0, newIndex), questions.length - 1);
    if (nextIndex > currentQuestionIndex && !canAdvance) {
      return;
    }

    const nextAnswers = getCurrentAnswers();
    const nextQuestion = questions[nextIndex];

    setQuestionAnswers(nextAnswers);
    setCurrentQuestionIndex(nextIndex);
    setCode(
      nextAnswers[nextIndex] ||
        nextQuestion?.starterCode ||
        nextQuestion?.starter_code ||
        defaultStarterCode
    );
    setEvaluation(questionEvaluations[nextIndex] || null);
    setAIReview(null);
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
        language,
      });

      if (response.success) {
        setEvaluation(response.result);
        setStatusMessage(
          `Run complete — ${response.result.passed}/${response.result.total} passed.`
        );
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
        language,
      });

      if (!response.success) {
        setStatusMessage(response.message);
        return;
      }

      const updatedEvaluations = [...questionEvaluations];
      updatedEvaluations[currentQuestionIndex] = {
        score: response.result.score,
        passed: response.result.passed,
        total: response.result.total,
        results: response.result.results,
      };

      setQuestionEvaluations(updatedEvaluations);
      setEvaluation(updatedEvaluations[currentQuestionIndex]);
      setStatusMessage(
        `Submit complete — ${response.result.passed}/${response.result.total} passed.`
      );

      const reviewResponse = await getAIReview({
        sourceCode: code,
        language,
        problemId: currentQuestion._id || currentQuestion.id,
      });

      if (reviewResponse.success) {
        setAIReview(reviewResponse.review);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setStatusMessage("Saving draft...");

    try {
      const answers = getCurrentAnswers();
      await saveTechnicalSession({
        role,
        difficulty,
        language,
        duration,
        company,
        topic,
        questions: questions.map((question) =>
          question.title || question.description || question.question || ""
        ),
        answers,
        evaluations: questionEvaluations,
        score: evaluation?.score || 0,
      });

      setStatusMessage("Draft saved successfully.");
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 1500);
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || error.message || "Draft save failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishInterview = async () => {
    setIsSaving(true);
    setStatusMessage("Finishing interview...");

    try {
      if (interviewId) {
        await finishTechnicalInterview(interviewId);
      }

      const answers = getCurrentAnswers();
      await saveTechnicalSession({
        role,
        difficulty,
        language,
        duration,
        company,
        topic,
        questions: questions.map((question) =>
          question.title || question.description || question.question || ""
        ),
        answers,
        evaluations: questionEvaluations,
        score: evaluation?.score || 0,
      });

      navigate("/technical/report");
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || error.message || "Finish interview failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const progressPercent = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  const isQuestionUnlocked = (index) =>
    index <= currentQuestionIndex || questionEvaluations[index] != null;

  const handleReset = (value) => {
    setCode(value);
    setEvaluation(null);
    setAIReview(null);
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
      <div className="border-b border-slate-800 px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate("/technical/setup")}
              className="mb-4 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
            >
              ← Back to Setup
            </button>
            <h1 className="text-4xl font-bold">{company} Technical Interview</h1>
            <p className="text-slate-400 mt-2">Difficulty : {difficulty}</p>
            <p className="text-slate-400">Language : {language}</p>
            <p className="text-slate-400">Question : {currentQuestionIndex + 1} / {questions.length}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <p className="text-sm text-slate-400">Time Left</p>
              <div className="text-2xl font-bold text-white">
                <Timer duration={duration} />
              </div>
            </div>
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="rounded-2xl bg-blue-600 px-5 py-4 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : draftSaved ? "Draft Saved" : "Save Draft"}
            </button>
            <button
              onClick={handleFinishInterview}
              disabled={isSaving}
              className="rounded-2xl bg-green-600 px-5 py-4 text-white hover:bg-green-700 disabled:opacity-60"
            >
              Finish Interview
            </button>
          </div>
        </div>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => isQuestionUnlocked(index) && goToQuestion(index)}
              disabled={!isQuestionUnlocked(index)}
              className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                index === currentQuestionIndex
                  ? "border-blue-500 bg-blue-500 text-white"
                  : isQuestionUnlocked(index)
                  ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-700 bg-slate-900 text-slate-500 cursor-not-allowed"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1}</p>
                <h2 className="text-2xl font-semibold">{currentQuestionTitle}</h2>
              </div>
              <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                {currentQuestion?.difficulty || difficulty}
              </div>
            </div>
            <ProblemPanel
              problem={{
                title: currentQuestionTitle,
                difficulty: currentQuestion?.difficulty || difficulty,
                category: currentQuestion?.role || role,
                description: currentQuestionDescription,
                examples: currentQuestion?.examples || [],
                constraints:
                  currentQuestion?.constraints || [
                    "Explain your reasoning clearly.",
                    "Mention a concrete example if possible.",
                  ],
              }}
            />
          </div>
        </div>
        <div className="col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <CodeEditor
              language={language}
              value={code}
              defaultCode={currentQuestion?.starterCode || currentQuestion?.starter_code}
              onChange={handleCodeChange}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <h2 className="text-xl font-bold mb-4">Console</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Output</p>
                <pre className="mt-2 whitespace-pre-wrap text-green-300">
                  {evaluation?.results?.length
                    ? evaluation.results
                        .map(
                          (result, index) =>
                            `Test ${index + 1}: ${result.passed ? "Passed" : "Failed"}\nExpected: ${result.expected}\nActual: ${result.actual}\n\n`
                        )
                        .join("")
                    : statusMessage}
                </pre>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3">
                    <p className="text-sm text-slate-400">Execution Time</p>
                    <p className="text-lg font-semibold">
                      {evaluation?.results?.[0]?.runtime ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 p-3">
                    <p className="text-sm text-slate-400">Memory</p>
                    <p className="text-lg font-semibold">
                      {evaluation?.results?.[0]?.memory ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 p-3">
                    <p className="text-sm text-slate-400">Passed Tests</p>
                    <p className="text-lg font-semibold">
                      {evaluation?.passed ?? 0}/{evaluation?.total ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TestCases
            evaluation={evaluation}
            improvedAnswer={aiReview?.summary || ""}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    </div>
  );
}
