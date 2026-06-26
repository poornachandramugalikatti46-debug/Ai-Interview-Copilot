import { useEffect, useRef, useState } from "react";
import axios from "axios";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function HRInterviewAI() {
  /* =========================
     STATES
  ========================= */

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [listening, setListening] = useState(false);

  const [loading, setLoading] = useState(false);

  const [started, setStarted] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const [persona, setPersona] = useState("google");

  const [progress, setProgress] = useState(0);

  const [interviewEnded, setInterviewEnded] = useState(false);

  const [interviewId, setInterviewId] = useState(null);

  const recognitionRef = useRef(null);

  const chatEndRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================
     SPEECH RECOGNITION
  ========================= */

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      handleSend(text);
    };

    recognitionRef.current = recognition;
  }, []);

  /* =========================
     AI SPEAK
  ========================= */

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speech.pitch = 0.9;

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  /* =========================
     START INTERVIEW
  ========================= */

  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/hr/start",
        {
          persona,
        }
      );

      setInterviewId(res.data.interviewId);

      const aiMessage = {
        role: "ai",
        text: res.data.question,
      };

      setMessages([aiMessage]);

      speak(res.data.question);

      setStarted(true);

      setProgress(10);

      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  };

  /* =========================
     START LISTENING
  ========================= */

  const startListening = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.start();
  };

  /* =========================
     SEND ANSWER
  ========================= */

  const handleSend = async (
    voiceText = null
  ) => {
    const finalText = voiceText || input;

    if (!finalText.trim()) return;

    const userMsg = {
      role: "user",
      text: finalText,
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/hr/answer",
        {
          interviewId,
          answer: finalText,
          persona,
        }
      );

      const aiMessage = {
        role: "ai",
        text: res.data.nextQuestion,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      speak(res.data.nextQuestion);

      setAnalysis(res.data.analysis);

      setProgress((prev) =>
        Math.min(prev + 10, 100)
      );

      if (res.data.completed) {
        setInterviewEnded(true);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <h1>
          🎤 AI HR Interview Coach
        </h1>

        <select
          value={persona}
          onChange={(e) =>
            setPersona(e.target.value)
          }
          style={styles.select}
        >
          <option value="google">
            Google HR
          </option>

          <option value="amazon">
            Amazon HR
          </option>

          <option value="startup">
            Startup HR
          </option>

          <option value="strict">
            Strict HR
          </option>
        </select>
      </div>

      {/* PROGRESS */}

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
          }}
        />
      </div>

      {/* START */}

      {!started ? (
        <button
          onClick={startInterview}
          style={styles.startBtn}
        >
          Start Interview
        </button>
      ) : (
        <div style={styles.main}>
          {/* CHAT */}

          <div>
            <div style={styles.chatBox}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={
                    m.role === "ai"
                      ? styles.aiMsg
                      : styles.userMsg
                  }
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <div style={styles.thinking}>
                  HR is thinking...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* CONTROLS */}

            {!interviewEnded && (
              <div style={styles.controls}>
                <button
                  onClick={startListening}
                  style={styles.micBtn}
                >
                  🎤{" "}
                  {listening
                    ? "Listening..."
                    : "Speak"}
                </button>

                <input
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleSend()
                  }
                  style={styles.input}
                  placeholder="Type answer..."
                />

                <button
                  onClick={() =>
                    handleSend()
                  }
                  style={styles.sendBtn}
                >
                  Send
                </button>
              </div>
            )}
          </div>

          {/* ANALYSIS PANEL */}

          <div style={styles.panel}>
            <h2>📊 Live Analysis</h2>

            {analysis ? (
              <>
                <div style={styles.score}>
                  Communication:
                  {analysis.communication}/10
                </div>

                <div style={styles.score}>
                  Confidence:
                  {analysis.confidence}/10
                </div>

                <div style={styles.score}>
                  Clarity:
                  {analysis.clarity}/10
                </div>

                <div style={styles.score}>
                  Professionalism:
                  {
                    analysis.professionalism
                  }
                  /10
                </div>

                <hr />

                <h3>✅ Strengths</h3>

                <ul>
                  {analysis.strengths?.map(
                    (s, i) => (
                      <li key={i}>{s}</li>
                    )
                  )}
                </ul>

                <h3>❌ Improvements</h3>

                <ul>
                  {analysis.improvements?.map(
                    (s, i) => (
                      <li key={i}>{s}</li>
                    )
                  )}
                </ul>

                <h3>
                  💡 Better Professional
                  Answer
                </h3>

                <div style={styles.answerBox}>
                  {
                    analysis.betterAnswer
                  }
                </div>

                <h3>🧠 HR Thinking</h3>

                <div style={styles.hrBox}>
                  {analysis.hrThinking}
                </div>
              </>
            ) : (
              <p>No analysis yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  select: {
    padding: 10,
    borderRadius: 10,
  },

  progressBar: {
    height: 10,
    background: "#1e293b",
    borderRadius: 10,
    marginTop: 20,
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: 10,
  },

  startBtn: {
    marginTop: 100,
    padding: 20,
    fontSize: 20,
    background: "#2563eb",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
  },

  main: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
  },

  chatBox: {
    background: "#111827",
    height: "70vh",
    overflowY: "auto",
    padding: 20,
    borderRadius: 20,
  },

  aiMsg: {
    background: "#2563eb",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "75%",
  },

  userMsg: {
    background: "#374151",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    marginLeft: "auto",
    maxWidth: "75%",
  },

  controls: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },

  micBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },

  sendBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none",
  },

  panel: {
    background: "#111827",
    padding: 20,
    borderRadius: 20,
    overflowY: "auto",
    height: "70vh",
  },

  score: {
    marginBottom: 10,
    padding: 10,
    background: "#1e293b",
    borderRadius: 10,
  },

  answerBox: {
    background: "#1e293b",
    padding: 15,
    borderRadius: 10,
    lineHeight: 1.6,
  },

  hrBox: {
    background: "#3f3f46",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  thinking: {
    opacity: 0.7,
    marginTop: 10,
  },
};

