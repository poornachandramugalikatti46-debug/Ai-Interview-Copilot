
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

/* =========================
   QUESTION DATA
========================= */
const QUESTION = {
  id: 1,

  title: "Two Sum",

  difficulty: "Easy",

  company: "Amazon",

  topic: "Array",

  description:
    "Given an array of integers nums and an integer target, return indices of two numbers such that they add up to target.",

  example:
    "Input: [2,7,11,15], target = 9 → Output: [0,1]",

  constraints: [
    "2 ≤ nums.length ≤ 10^4",
    "Only one valid answer exists",
  ],

  hints: [
    "Start with brute force approach",
    "Think about hashing for optimization",
    "Goal is O(n) solution",
  ],

  starterCode: {
    javascript:
      "function twoSum(nums, target) {\n\n}",

    python:
      "def twoSum(nums, target):\n    pass",
  },

  testcases: [
    {
      input: "[2,7,11,15],9",
      output: "[0,1]",
    },

    {
      input: "[3,2,4],6",
      output: "[1,2]",
    },
  ],
};

/* =========================
   MAIN COMPONENT
========================= */
export default function TechnicalInterview() {
  const q = QUESTION;

  /* =========================
     CORE STATE
  ========================= */

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] = useState(
    q.starterCode.javascript
  );

  const [output, setOutput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     INTERVIEW FLOW
  ========================= */

  const [activeTab, setActiveTab] =
    useState("problem");

  const [hintStep, setHintStep] =
    useState(0);

  const [score, setScore] =
    useState(null);

  const [feedback, setFeedback] =
    useState("");

  /* =========================
     AI CHAT
  ========================= */

  const [messages, setMessages] =
    useState([
      {
        role: "AI",
        text: "Explain your approach.",
      },
    ]);

  const [userMessage, setUserMessage] =
    useState("");

  /* =========================
     CUSTOM INPUT
  ========================= */

  const [customInput, setCustomInput] =
    useState("");

  /* =========================
     TIMER
  ========================= */

  const [time, setTime] =
    useState(1800);

  const [solvedCount, setSolvedCount] =
    useState(1);

  /* =========================
     TIMER ENGINE
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) =>
        t > 0 ? t - 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     FORMAT TIME
  ========================= */

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(
      t % 60
    ).padStart(2, "0")}`;

  /* =========================
     RESET CODE
  ========================= */

  useEffect(() => {
    setCode(q.starterCode[language]);
  }, [language]);

  /* =========================
     AI HINT
  ========================= */

  const handleHint = () => {
    if (hintStep < q.hints.length) {
      setHintStep((prev) => prev + 1);
    }
  };

  /* =========================
     RUN CODE
  ========================= */

  const runCode = async () => {
    setLoading(true);

    setOutput("");

    setTimeout(() => {
      setOutput(`
Code Executed Successfully

Input:
${customInput || "No Custom Input"}

Output:
[0,1]

Runtime: 1ms
Memory: 42MB
      `);

      setLoading(false);
    }, 1200);
  };

  /* =========================
     SUBMIT CODE
  ========================= */

  const submitCode = async () => {
    setLoading(true);

    setTimeout(() => {
      setScore(9);

      setFeedback(`
Excellent Solution ✅

Time Complexity: O(n)
Space Complexity: O(n)

AI Feedback:
Good use of hashmap.
Try improving variable naming.
      `);

      setOutput(`
Accepted ✅

Passed: 2/2 Testcases
Runtime: 1ms
Memory: 41MB
      `);

      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          text:
            "Why did you choose hashmap for this problem?",
        },
      ]);

      setSolvedCount((p) => p + 1);

      setActiveTab("result");

      setLoading(false);
    }, 1500);
  };

  /* =========================
     SEND AI MESSAGE
  ========================= */

  const sendMessage = () => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "You",
        text: userMessage,
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          text:
            "Good explanation. Can you optimize space complexity?",
        },
      ]);
    }, 1000);

    setUserMessage("");
  };

  /* =========================
     UI
  ========================= */

  return (
    <div style={styles.page}>
      {/* =========================
          TOP BAR
      ========================= */}

      <div style={styles.topBar}>
        <h2>
          🚀 Technical Interview System
        </h2>

        <div style={styles.meta}>
          <span>
            📊 Solved: {solvedCount}
          </span>

          <span>
            ⏱ {formatTime(time)}
          </span>

          <span>
            🔥 {q.difficulty}
          </span>
        </div>
      </div>

      {/* =========================
          TAGS
      ========================= */}

      <div style={styles.tags}>
        <span style={styles.company}>
          🏢 {q.company}
        </span>

        <span style={styles.topic}>
          📚 {q.topic}
        </span>

        <button
          onClick={handleHint}
          style={styles.hintBtn}
        >
          🧠 AI Hint (
          {hintStep}/{q.hints.length})
        </button>
      </div>

      {/* =========================
          MAIN GRID
      ========================= */}

      <div style={styles.grid}>
        {/* =========================
            LEFT PANEL
        ========================= */}

        <div style={styles.left}>
          {/* TABS */}

          <div style={styles.tabs}>
            {[
              "problem",
              "testcases",
              "result",
            ].map((t) => (
              <button
                key={t}
                onClick={() =>
                  setActiveTab(t)
                }
                style={
                  activeTab === t
                    ? styles.activeTab
                    : styles.tab
                }
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* =========================
              PROBLEM TAB
          ========================= */}

          {activeTab === "problem" && (
            <div>
              <h2>{q.title}</h2>

              <p style={styles.description}>
                {q.description}
              </p>

              <pre style={styles.box}>
                {q.example}
              </pre>

              <h3>Constraints</h3>

              <ul>
                {q.constraints.map(
                  (c, i) => (
                    <li key={i}>
                      {c}
                    </li>
                  )
                )}
              </ul>

              {/* AI HINTS */}

              {q.hints
                .slice(0, hintStep)
                .map((h, i) => (
                  <div
                    key={i}
                    style={styles.hint}
                  >
                    💡 {h}
                  </div>
                ))}
            </div>
          )}

          {/* =========================
              TESTCASES TAB
          ========================= */}

          {activeTab ===
            "testcases" && (
            <div>
              {q.testcases.map(
                (t, i) => (
                  <div
                    key={i}
                    style={styles.caseBox}
                  >
                    <b>Input:</b>{" "}
                    {t.input}

                    <br />

                    <b>Output:</b>{" "}
                    {t.output}
                  </div>
                )
              )}
            </div>
          )}

          {/* =========================
              RESULT TAB
          ========================= */}

          {activeTab === "result" && (
            <div style={styles.resultBox}>
              <h2>
                Score: {score}/10
              </h2>

              <pre>
                {feedback}
              </pre>

              <pre>{output}</pre>
            </div>
          )}
        </div>

        {/* =========================
            RIGHT PANEL
        ========================= */}

        <div style={styles.right}>
          {/* LANGUAGE */}

          <div style={styles.editorTop}>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="javascript">
                JavaScript
              </option>

              <option value="python">
                Python
              </option>
            </select>
          </div>

          {/* =========================
              CUSTOM INPUT
          ========================= */}

          <textarea
            placeholder="Custom Input"
            value={customInput}
            onChange={(e) =>
              setCustomInput(
                e.target.value
              )
            }
            style={styles.input}
          />

          {/* =========================
              MONACO EDITOR
          ========================= */}

          <Editor
            height="400px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(v) =>
              setCode(v || "")
            }
          />

          {/* =========================
              BUTTONS
          ========================= */}

          <div style={styles.btnRow}>
            <button
              onClick={runCode}
              style={styles.run}
            >
              {loading
                ? "Running..."
                : "▶ Run"}
            </button>

            <button
              onClick={submitCode}
              style={styles.submit}
            >
              🚀 Submit
            </button>
          </div>

          {/* =========================
              OUTPUT
          ========================= */}

          <pre style={styles.output}>
            {output ||
              "Run code to see output"}
          </pre>

          {/* =========================
              AI INTERVIEW CHAT
          ========================= */}

          <div style={styles.aiBox}>
            <h3>
              🤖 AI Interviewer
            </h3>

            <div style={styles.chatArea}>
              {messages.map(
                (m, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    <b>
                      {m.role}:
                    </b>{" "}
                    {m.text}
                  </div>
                )
              )}
            </div>

            <div style={styles.chatInputRow}>
              <input
                value={userMessage}
                onChange={(e) =>
                  setUserMessage(
                    e.target.value
                  )
                }
                placeholder="Explain your approach..."
                style={styles.chatInput}
              />

              <button
                onClick={sendMessage}
                style={styles.sendBtn}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    background: "#0b1220",
    color: "white",
    minHeight: "100vh",
    padding: 20,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  meta: {
    display: "flex",
    gap: 15,
    alignItems: "center",
  },

  tags: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  company: {
    background: "#ea580c",
    padding: "5px 10px",
    borderRadius: 5,
  },

  topic: {
    background: "#2563eb",
    padding: "5px 10px",
    borderRadius: 5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "40% 60%",
    gap: 12,
  },

  left: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    height: "90vh",
    overflowY: "auto",
  },

  right: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  tab: {
    background: "#1e293b",
    padding: 10,
    border: "none",
    color: "white",
    borderRadius: 5,
    cursor: "pointer",
  },

  activeTab: {
    background: "#2563eb",
    padding: 10,
    border: "none",
    color: "white",
    borderRadius: 5,
    cursor: "pointer",
  },

  description: {
    marginTop: 10,
    lineHeight: 1.6,
  },

  box: {
    background: "#1e293b",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },

  hint: {
    background: "#065f46",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },

  caseBox: {
    background: "#0b1220",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },

  resultBox: {
    background: "#0b1220",
    padding: 15,
    borderRadius: 6,
  },

  editorTop: {
    marginBottom: 10,
  },

  select: {
    padding: 10,
    background: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: 5,
  },

  input: {
    width: "100%",
    minHeight: 70,
    background: "#0b1220",
    color: "white",
    border: "1px solid #374151",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },

  btnRow: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  run: {
    background: "#2563eb",
    padding: "10px 20px",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },

  submit: {
    background: "#7c3aed",
    padding: "10px 20px",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },

  output: {
    background: "black",
    padding: 12,
    marginTop: 10,
    minHeight: 100,
    borderRadius: 6,
    overflowX: "auto",
  },

  hintBtn: {
    background: "#10b981",
    padding: "8px 12px",
    border: "none",
    color: "white",
    borderRadius: 5,
    cursor: "pointer",
  },

  aiBox: {
    background: "#0b1220",
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
  },

  chatArea: {
    maxHeight: 180,
    overflowY: "auto",
    marginTop: 10,
    marginBottom: 10,
  },

  chatInputRow: {
    display: "flex",
    gap: 10,
  },

  chatInput: {
    flex: 1,
    padding: 10,
    background: "#111827",
    color: "white",
    border: "1px solid #374151",
    borderRadius: 5,
  },

  sendBtn: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "10px 16px",
    borderRadius: 5,
    cursor: "pointer",
  },
};

