import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function TechnicalInterview({
  setCurrentPage,
}) {

  const questions = [
    {
      title: "Reverse Linked List",
      difficulty: "Medium",
      company: "Google",
      description:
        "Reverse a singly linked list.",

      example:
        "Input:\n1 -> 2 -> 3 -> 4\n\nOutput:\n4 -> 3 -> 2 -> 1",

      constraints: [
        "1 ≤ Nodes ≤ 5000",
        "Expected Time Complexity: O(n)",
        "Expected Space Complexity: O(1)",
      ],

      starterCode: {
        javascript:
          "function reverseList(head) {\n\n}",

        python:
          "def reverseList(head):\n\n    pass",
      },
    },

    {
      title: "Two Sum",
      difficulty: "Easy",
      company: "Amazon",

      description:
        "Find indices of two numbers that add to target.",

      example:
        "Input:\nnums = [2,7,11,15]\ntarget = 9\n\nOutput:\n[0,1]",

      constraints: [
        "2 ≤ nums.length ≤ 10^4",
      ],

      starterCode: {
        javascript:
          "function twoSum(nums, target) {\n\n}",

        python:
          "def twoSum(nums, target):\n\n    pass",
      },
    },
  ];

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const currentQuestion =
    questions[questionIndex];

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState(
      currentQuestion.starterCode
        .javascript
    );

  const [output, setOutput] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("problem");

  const [timeLeft, setTimeLeft] =
    useState(2700);

  /* TIMER */

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 0) {

          clearInterval(timer);

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  /* CHANGE CODE */

  useEffect(() => {

    setCode(
      currentQuestion.starterCode[
        language
      ]
    );

  }, [language, questionIndex]);

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  /* RUN CODE */

  const runCode = async () => {

    try {

      setLoading(true);

      const res =
        await axios.post(
          "http://localhost:5001/api/technical/run",
          {
            code,
            language,
          }
        );

      setOutput(res.data.output);

      setLoading(false);

    } catch {

      setLoading(false);

      setOutput(
        "❌ Backend Server Error"
      );
    }
  };

  /* SUBMIT */

  const submitCode = async () => {

    try {

      setLoading(true);

      const res =
        await axios.post(
          "http://localhost:5001/api/technical/submit",
          {
            code,
            language,
          }
        );

      setOutput(res.data.output);

      setFeedback(
        res.data.feedback
      );

      setScore(res.data.score);

      setLoading(false);

    } catch {

      setLoading(false);

      setOutput(
        "❌ Submit Failed"
      );
    }
  };

  /* NEXT QUESTION */

  const nextQuestion = () => {

    const next =
      (questionIndex + 1) %
      questions.length;

    setQuestionIndex(next);

    setOutput("");

    setFeedback("");

    setScore(null);
  };

  return (

    <div style={styles.container}>

      {/* TOPBAR */}

      <div style={styles.topbar}>

        <button
          style={styles.backBtn}
          onClick={() =>
            setCurrentPage(
              "dashboard"
            )
          }
        >
          ← Dashboard
        </button>

        <h1>
          💻 Technical Interview
        </h1>

        <div style={styles.timer}>
          ⏱ {minutes}:
          {seconds < 10
            ? "0" + seconds
            : seconds}
        </div>

      </div>

      {/* MAIN GRID */}

      <div style={styles.grid}>

        {/* LEFT PANEL */}

        <div
          style={styles.problemPanel}
        >

          <div style={styles.tabs}>

            <button
              style={
                activeTab === "problem"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() =>
                setActiveTab(
                  "problem"
                )
              }
            >
              Problem
            </button>

            <button
              style={
                activeTab ===
                "submissions"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() =>
                setActiveTab(
                  "submissions"
                )
              }
            >
              Submissions
            </button>

          </div>

          {/* PROBLEM TAB */}

          {activeTab ===
            "problem" && (

            <>

              <h1>
                {
                  currentQuestion.title
                }
              </h1>

              <div
                style={styles.badges}
              >

                <span
                  style={styles.medium}
                >
                  {
                    currentQuestion.difficulty
                  }
                </span>

                <span
                  style={styles.company}
                >
                  {
                    currentQuestion.company
                  }
                </span>

              </div>

              <h3>
                Description
              </h3>

              <p style={styles.desc}>
                {
                  currentQuestion.description
                }
              </p>

              <h3>
                Example
              </h3>

              <div
                style={styles.example}
              >
                {
                  currentQuestion.example
                }
              </div>

              <h3>
                Constraints
              </h3>

              <ul>

                {currentQuestion.constraints.map(
                  (
                    item,
                    index
                  ) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

              <div
                style={styles.testBox}
              >

                <h3>
                  🧪 Test Cases
                </h3>

                <p>
                  ✅ Public Test Case 1
                </p>

                <p>
                  ✅ Public Test Case 2
                </p>

                <p>
                  ⚠ Hidden Test Cases
                </p>

              </div>

            </>

          )}

          {/* SUBMISSION TAB */}

          {activeTab ===
            "submissions" && (

            <div
              style={
                styles.submissionBox
              }
            >

              <h2>
                🚀 Latest Submission
              </h2>

              <p>
                Status:
                {score
                  ? " Accepted"
                  : " Pending"}
              </p>

              <p>
                Score:
                {score || 0}/10
              </p>

            </div>

          )}

        </div>

        {/* RIGHT PANEL */}

        <div
          style={styles.editorPanel}
        >

          <div
            style={
              styles.editorHeader
            }
          >

            <select
              style={styles.select}
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
            >

              <option value="javascript">
                JavaScript
              </option>

              <option value="python">
                Python
              </option>

            </select>

            <div style={styles.stats}>
              ⚡ Runtime: 120ms
            </div>

          </div>

          {/* MONACO EDITOR */}

          <Editor
            height="500px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) =>
              setCode(value)
            }
          />

          {/* BUTTONS */}

          <div
            style={styles.buttonRow}
          >

            <button
              style={styles.runBtn}
              onClick={runCode}
            >
              {loading
                ? "Running..."
                : "▶ Run"}
            </button>

            <button
              style={
                styles.submitBtn
              }
              onClick={submitCode}
            >
              🚀 Submit
            </button>

            <button
              style={styles.nextBtn}
              onClick={nextQuestion}
            >
              ➡ Next
            </button>

          </div>

          {/* OUTPUT */}

          <div
            style={styles.outputBox}
          >

            <h3>
              Console Output
            </h3>

            <p>{output}</p>

          </div>

          {/* AI FEEDBACK */}

          {feedback && (

            <div
              style={
                styles.feedbackBox
              }
            >

              <h3>
                🤖 AI Review
              </h3>

              <p>{feedback}</p>

              <h2>
                Score: {score}/10
              </h2>

              <p>
                ⚡ Time Complexity:
                O(n)
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default TechnicalInterview;

/* =========================
   STYLES
========================= */

const styles = {

  container: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "20px",
    fontFamily: "Arial",
  },

  topbar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  backBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    cursor: "pointer",
  },

  timer: {
    background: "#dc2626",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "38% 62%",
    gap: "20px",
  },

  problemPanel: {
    background: "#111827",
    padding: "25px",
    borderRadius: "20px",
    height: "85vh",
    overflowY: "auto",
  },

  editorPanel: {
    background: "#111827",
    padding: "20px",
    borderRadius: "20px",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
  },

  activeTab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
  },

  badges: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "20px",
  },

  medium: {
    background: "#eab308",
    color: "black",
    padding: "8px 15px",
    borderRadius: "20px",
  },

  company: {
    background: "#2563eb",
    padding: "8px 15px",
    borderRadius: "20px",
  },

  desc: {
    color: "#cbd5e1",
    lineHeight: "28px",
  },

  example: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    whiteSpace: "pre-line",
  },

  testBox: {
    marginTop: "20px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  },

  submissionBox: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  },

  editorHeader: {
    marginBottom: "10px",
    display: "flex",
    justifyContent:
      "space-between",
  },

  select: {
    padding: "10px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    border: "none",
  },

  stats: {
    color: "#94a3b8",
  },

  buttonRow: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },

  runBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  submitBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#7c3aed",
    color: "white",
    cursor: "pointer",
  },

  nextBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
  },

  outputBox: {
    marginTop: "20px",
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
  },

  feedbackBox: {
    marginTop: "20px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },

};