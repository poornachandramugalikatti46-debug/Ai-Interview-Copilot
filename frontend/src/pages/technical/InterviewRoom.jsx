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
  saveTechnicalCode,
  nextTechnicalQuestion,
  previousTechnicalQuestion,
  finishTechnicalInterview,
} from "../../services/technicalInterviewApi";

export default function InterviewRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ========================================
  // RESTORE INTERVIEW
  // ========================================

  const storedState = useMemo(() => {
    try {
      const saved = sessionStorage.getItem(
        "technicalInterviewState"
      );

      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error(
        "Session storage error:",
        error
      );

      return null;
    }
  }, []);

  const initialState = state || storedState;

  // ========================================
  // INTERVIEW INFORMATION
  // ========================================

  const [interviewId] = useState(
    initialState?.interviewId || null
  );

  const [questions] = useState(
    initialState?.questions || []
  );

  const [role] = useState(
    initialState?.role || "Frontend"
  );

  const [difficulty] = useState(
    initialState?.difficulty || "Easy"
  );

  const [language] = useState(
    initialState?.language || "JavaScript"
  );

  const [duration] = useState(
    initialState?.duration || 30
  );

  const [company] = useState(
    initialState?.company || "Random"
  );

  const [topic] = useState(
    initialState?.topic || "Mixed"
  );

  // ========================================
  // CURRENT QUESTION
  // ========================================

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(
    initialState?.currentQuestionIndex || 0
  );

  // ========================================
  // ANSWERS FOR EVERY QUESTION
  // ========================================

  const [
    questionAnswers,
    setQuestionAnswers,
  ] = useState(() =>
    initialState?.answers ||
    (initialState?.questions || []).map(
      (question) =>
        question.starterCode ||
        question.starter_code ||
        ""
    )
  );

  // ========================================
  // EVALUATION FOR EVERY QUESTION
  // ========================================

  const [
    questionEvaluations,
    setQuestionEvaluations,
  ] = useState(() =>
    initialState?.evaluations ||
    (initialState?.questions || []).map(
      () => null
    )
  );

  const [evaluation, setEvaluation] =
    useState(null);

  const [aiReview, setAIReview] =
    useState(null);

  // ========================================
  // UI STATES
  // ========================================

  const [isRunning, setIsRunning] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isMoving, setIsMoving] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState(
      "Write your solution and submit it."
    );

  // ========================================
  // DEFAULT STARTER CODE
  // ========================================

  const defaultStarterCode = useMemo(() => {
    const starters = {
      JavaScript: `function solution() {\n\n  // Write your code here\n\n}`,

      Python: `def solution():\n\n    # Write your code here\n    pass`,

      Java: `class Solution {\n\n    public void solution() {\n\n    }\n\n}`,

      "C++": `class Solution {\npublic:\n\n    void solution() {\n\n    }\n\n};`,

      C: `#include <stdio.h>\n\nint main() {\n\n    return 0;\n\n}`,
    };

    return (
      starters[language] ||
      starters.JavaScript
    );
  }, [language]);

  // ========================================
  // CURRENT QUESTION OBJECT
  // ========================================

  const currentQuestion =
    questions[currentQuestionIndex];

  // ========================================
  // CURRENT CODE
  // ========================================

  const currentCode =
    questionAnswers[
      currentQuestionIndex
    ] != null
      ? questionAnswers[currentQuestionIndex]
      : currentQuestion?.starterCode ||
        currentQuestion?.starter_code ||
        defaultStarterCode;

  // ========================================
  // INITIALIZE MISSING ANSWERS
  // ========================================

  useEffect(() => {
    if (!questions.length) return;

    setQuestionAnswers(
      (previousAnswers) => {
        const updated = [...previousAnswers];

        questions.forEach(
          (question, index) => {
            if (updated[index] == null) {
              updated[index] =
                question.starterCode ||
                question.starter_code ||
                defaultStarterCode;
            }
          }
        );

        return updated;
      }
    );
  }, [
    questions,
    defaultStarterCode,
  ]);

  // ========================================
  // UPDATE CURRENT QUESTION UI
  // ========================================

  useEffect(() => {
    setEvaluation(
      questionEvaluations[
        currentQuestionIndex
      ] || null
    );

    setAIReview(null);

    setStatusMessage(
      `Question ${
        currentQuestionIndex + 1
      } loaded.`
    );
  }, [currentQuestionIndex]);

  // ========================================
  // SAVE TO SESSION STORAGE
  // ========================================

  useEffect(() => {
    if (!questions.length) return;

    const savedState = {
      interviewId,
      role,
      difficulty,
      language,
      duration,
      company,
      topic,
      questions,
      answers: questionAnswers,
      evaluations:
        questionEvaluations,
      currentQuestionIndex,
    };

    sessionStorage.setItem(
      "technicalInterviewState",
      JSON.stringify(savedState)
    );
  }, [
    interviewId,
    role,
    difficulty,
    language,
    duration,
    company,
    topic,
    questions,
    questionAnswers,
    questionEvaluations,
    currentQuestionIndex,
  ]);

  // ========================================
  // CODE CHANGE
  // ========================================

  const handleCodeChange = (
    newValue
  ) => {
    const nextCode = newValue ?? "";

    setQuestionAnswers(
      (previousAnswers) => {
        const updated = [
          ...previousAnswers,
        ];

        updated[currentQuestionIndex] =
          nextCode;

        return updated;
      }
    );

    setQuestionEvaluations(
      (previousEvaluations) => {
        const updated = [
          ...previousEvaluations,
        ];

        updated[currentQuestionIndex] = null;

        return updated;
      }
    );

    setEvaluation(null);
    setAIReview(null);
    setStatusMessage(
      "Code changed. Submit again to update evaluation."
    );
  };

  // ========================================
  // RUN CODE
  // ========================================

  const handleRun = async () => {
    if (!currentQuestion) {
      setStatusMessage(
        "No question selected."
      );

      return;
    }

    const code =
      typeof currentCode === "string"
        ? currentCode
        : "";

    if (!code.trim()) {
      setStatusMessage(
        "Please write code before running."
      );

      return;
    }

    setIsRunning(true);

    setStatusMessage(
      "Running your code..."
    );

    try {
      const response =
        await runCode({
          question: {
            ...currentQuestion,

            execution:
              currentQuestion.execution ||
              {},

            testCases:
              currentQuestion.testCases ||
              [],
          },

          userCode: code,

          language,
        });

      if (!response.success) {
        setStatusMessage(
          response.message ||
            "Code execution failed."
        );

        return;
      }

      setEvaluation(
        response.result
      );

      setStatusMessage(
        `Run complete — ${
          response.result.passed
        }/${response.result.total} tests passed.`
      );
    } catch (error) {
      console.error(
        "RUN ERROR:",
        error
      );

      setStatusMessage(
        error.response?.data
          ?.message ||
          "Code execution failed."
      );
    } finally {
      setIsRunning(false);
    }
  };

  // ========================================
  // SUBMIT CODE
  // ========================================

  const handleSubmit = async () => {
    if (!currentQuestion) {
      setStatusMessage(
        "No question selected."
      );

      return;
    }

    const code =
      typeof currentCode === "string"
        ? currentCode
        : "";

    if (!code.trim()) {
      setStatusMessage(
        "Please write code before submitting."
      );

      return;
    }

    setIsSubmitting(true);

    setStatusMessage(
      "Submitting your solution..."
    );

    try {
      // ------------------------------------
      // SUBMIT TO JUDGE
      // ------------------------------------

      const response =
        await submitCode({
          question: {
            ...currentQuestion,

            execution:
              currentQuestion.execution ||
              {},

            testCases:
              currentQuestion.testCases ||
              [],
          },

          userCode: code,

          language,
        });

      if (!response.success) {
        setStatusMessage(
          response.message ||
            "Submission failed."
        );

        return;
      }

      // ------------------------------------
      // STORE EVALUATION
      // ------------------------------------

      const updatedEvaluations = [
        ...questionEvaluations,
      ];

      updatedEvaluations[
        currentQuestionIndex
      ] = {
        score:
          response.result.score || 0,

        passed:
          response.result.passed || 0,

        total:
          response.result.total || 0,

        results:
          response.result.results || [],
      };

      setQuestionEvaluations(
        updatedEvaluations
      );

      setEvaluation(
        updatedEvaluations[
          currentQuestionIndex
        ]
      );

      // ------------------------------------
      // SAVE CODE TO DATABASE
      // ------------------------------------

      if (interviewId) {
        try {
          await saveTechnicalCode(
            interviewId,
            {
              questionId:
                currentQuestion.questionId ||
                currentQuestion.questionDbId ||
                currentQuestion._id,

              code: currentCode,
            }
          );
        } catch (error) {
          console.error(
            "SAVE CODE ERROR:",
            error
          );
        }
      }

      // ------------------------------------
      // AI REVIEW
      // ------------------------------------

      try {
        const reviewResponse =
          await getAIReview({
            sourceCode:
              currentCode,

            language,

            problemId:
              currentQuestion.questionDbId ||
              currentQuestion._id ||
              currentQuestion.id,
          });

        if (
          reviewResponse.success
        ) {
          setAIReview(
            reviewResponse.review
          );
        }
      } catch (error) {
        console.error(
          "AI REVIEW ERROR:",
          error
        );
      }

      setStatusMessage(
        `Question ${
          currentQuestionIndex + 1
        } submitted successfully.`
      );
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      setStatusMessage(
        error.response?.data
          ?.message ||
          "Submission failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // NEXT QUESTION
  // ========================================

  const handleNextQuestion =
    async () => {
      if (
        currentQuestionIndex >=
        questions.length - 1
      ) {
        return;
      }

      // Must submit first
      if (
        !questionEvaluations[
          currentQuestionIndex
        ]
      ) {
        setStatusMessage(
          "Submit the current question first."
        );

        return;
      }

      setIsMoving(true);

      try {
        let nextIndex =
          currentQuestionIndex + 1;

        // Update backend
        if (interviewId) {
          const response =
            await nextTechnicalQuestion(
              interviewId
            );

          if (
            typeof response.data
              ?.currentQuestion ===
            "number"
          ) {
            nextIndex =
              response.data
                .currentQuestion;
          }
        }

        setCurrentQuestionIndex(
          nextIndex
        );

        setEvaluation(
          questionEvaluations[
            nextIndex
          ] || null
        );

        setAIReview(null);

        setStatusMessage(
          `Question ${
            nextIndex + 1
          } loaded.`
        );
      } catch (error) {
        console.error(
          "NEXT ERROR:",
          error
        );

        setStatusMessage(
          error.response?.data
            ?.message ||
            "Unable to load next question."
        );
      } finally {
        setIsMoving(false);
      }
    };

  // ========================================
  // PREVIOUS QUESTION
  // ========================================

  const handlePreviousQuestion =
    async () => {
      if (
        currentQuestionIndex <= 0
      ) {
        return;
      }

      setIsMoving(true);

      try {
        let previousIndex =
          currentQuestionIndex - 1;

        if (interviewId) {
          const response =
            await previousTechnicalQuestion(
              interviewId
            );

          if (
            typeof response.data
              ?.currentQuestion ===
            "number"
          ) {
            previousIndex =
              response.data
                .currentQuestion;
          }
        }

        setCurrentQuestionIndex(
          previousIndex
        );

        setEvaluation(
          questionEvaluations[
            previousIndex
          ] || null
        );

        setAIReview(null);

        setStatusMessage(
          `Question ${
            previousIndex + 1
          } loaded.`
        );
      } catch (error) {
        console.error(
          "PREVIOUS ERROR:",
          error
        );

        setStatusMessage(
          "Unable to load previous question."
        );
      } finally {
        setIsMoving(false);
      }
    };

  // ========================================
  // FINISH INTERVIEW
  // ========================================

  const handleFinishInterview =
    async () => {
      if (
        !questionEvaluations[
          currentQuestionIndex
        ]
      ) {
        setStatusMessage(
          "Submit the final question first."
        );

        return;
      }

      setIsMoving(true);

      try {
        if (interviewId) {
          await finishTechnicalInterview(
            interviewId
          );
        }

        sessionStorage.removeItem(
          "technicalInterviewState"
        );

        navigate(
          "/technical/report",
          {
            state: {
              interviewId,
            },
          }
        );
      } catch (error) {
        console.error(
          "FINISH ERROR:",
          error
        );

        setStatusMessage(
          error.response?.data
            ?.message ||
            "Unable to finish interview."
        );
      } finally {
        setIsMoving(false);
      }
    };

  // ========================================
  // RESET CODE
  // ========================================

  const handleReset = () => {
    const starter =
      currentQuestion?.starterCode ||
      currentQuestion?.starter_code ||
      defaultStarterCode;

    setQuestionAnswers(
      (previousAnswers) => {
        const updated = [
          ...previousAnswers,
        ];

        updated[currentQuestionIndex] =
          starter;

        return updated;
      }
    );

    setEvaluation(null);

    setAIReview(null);

    setStatusMessage(
      "Starter code restored."
    );
  };

  // ========================================
  // PROGRESS
  // ========================================

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // ========================================
  // NO QUESTIONS
  // ========================================

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold">No interview questions loaded</h1>
          <p className="text-slate-400 mt-3">
            Please return to setup and start a new interview.
          </p>
          <button
            onClick={() => navigate("/technical/setup")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
          >
            Back setup
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-8 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate("/technical/setup")}
              className="mb-4 rounded-xl bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
            >
              Back
            </button>
            <h1 className="text-4xl font-bold">{company} Technical Interview</h1>
            <p className="text-slate-400 mt-2">Role: {role}</p>
            <p className="text-slate-400">Difficulty: {difficulty}</p>
            <p className="text-slate-400">Language: {language}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-sm text-slate-400">Time Left</p>
            <div className="text-2xl font-bold">
              <Timer duration={duration} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-400">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          {questions.map((_, index) => {
            const submitted = questionEvaluations[index] != null;
            return (
              <div
                key={index}
                className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 border-blue-500"
                    : submitted
                    ? "bg-green-600 border-green-500"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-5">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1}</p>
            <h2 className="text-2xl font-semibold mt-2">
              {currentQuestion?.title || "Interview Question"}
            </h2>
            <div className="mt-5">
              <ProblemPanel
                problem={{
                  title: currentQuestion?.title || "Interview Question",
                  difficulty: currentQuestion?.difficulty || difficulty,
                  category: currentQuestion?.topic || topic,
                  description:
                    currentQuestion?.description ||
                    currentQuestion?.question ||
                    "No question description.",
                  examples: currentQuestion?.examples || [],
                  constraints: currentQuestion?.constraints || [],
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <CodeEditor
              language={language}
              value={currentCode}
              defaultCode={
                currentQuestion?.starterCode ||
                currentQuestion?.starter_code ||
                defaultStarterCode
              }
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
            <div className="rounded-2xl bg-slate-800 p-4">
              <pre className="whitespace-pre-wrap text-green-300">
                {evaluation?.results?.length
                  ? evaluation.results
                      .map((result, index) =>
                        `Test ${index + 1}: ${
                          result.passed ? "Passed" : "Failed"
                        }\nExpected: ${result.expected}\nActual: ${result.actual}\n\n`
                      )
                      .join("")
                  : statusMessage}
              </pre>
            </div>
          </div>
          {aiReview && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <h2 className="text-xl font-bold mb-3">?? AI Code Review</h2>
              <p className="text-slate-300">
                {aiReview.summary || aiReview.feedback || "AI review completed."}
              </p>
            </div>
          )}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isMoving}
                className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ? Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={!questionEvaluations[currentQuestionIndex] || isMoving || isSubmitting}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isMoving ? "Loading..." : "Next Question ?"}
                </button>
              ) : (
                <button
                  onClick={handleFinishInterview}
                  disabled={!questionEvaluations[currentQuestionIndex] || isMoving || isSubmitting}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isMoving ? "Finishing..." : "Finish Interview ?"}
                </button>
              )}
            </div>
            <p className="text-center text-sm text-slate-400 mt-4">
              {questionEvaluations[currentQuestionIndex]
                ? "? Answer submitted. You can continue."
                : "Submit your code to unlock the next question."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
