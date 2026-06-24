import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("User");

  const chatEndRef = useRef(null);

  /* ================= USER ================= */
  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/ai/stream?message=${encodeURIComponent(userText)}`
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");

            if (data === "[DONE]") {
              setLoading(false);
              break;
            }

            aiText += data;

            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = {
                role: "ai",
                text: aiText,
              };
              return copy;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Server error" },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">⚡ AI Chatbot</div>

        <button onClick={() => setMessages([])}>
          + New Chat
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          👋 Hello, {username} — How can I help you today?
        </div>

        {/* CHAT */}
        <div className="chatBox">

          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="empty">
              <h1>Ask anything</h1>
              <p>Coding • Interviews • Explanations • AI Help</p>
            </div>
          )}

          {/* MESSAGES */}
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className={`bubble ${m.role}`}>
                {m.text}
              </div>
            </div>
          ))}

          {/* TYPING */}
          {loading && (
            <div className="row ai">
              <div className="bubble ai typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="inputBox">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      {/* STYLE */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: ui-sans-serif;
        }

        .page {
          display: flex;
          height: 100vh;
          background: #0b0f19;
          color: white;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          background: #0f172a;
          padding: 20px;
          border-right: 1px solid #1e293b;
        }

        .logo {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #60a5fa;
        }

        .sidebar button {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: #1e293b;
          color: white;
          border: none;
          cursor: pointer;
        }

        /* MAIN */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
          padding: 16px 20px;
          border-bottom: 1px solid #1e293b;
          background: #0f172a;
          font-size: 15px;
          color: #e2e8f0;
        }

        /* CHAT */
        .chatBox {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* EMPTY */
        .empty {
          text-align: center;
          margin-top: 120px;
          opacity: 0.7;
        }

        .empty h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .empty p {
          color: #94a3b8;
        }

        /* ROW */
        .row {
          display: flex;
        }

        .row.user {
          justify-content: flex-end;
        }

        .row.ai {
          justify-content: flex-start;
        }

        /* BUBBLE */
        .bubble {
          max-width: 70%;
          padding: 14px;
          border-radius: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .bubble.user {
          background: #2563eb;
        }

        .bubble.ai {
          background: #111827;
          border: 1px solid #1f2937;
        }

        /* INPUT */
        .inputBox {
          display: flex;
          padding: 15px;
          border-top: 1px solid #1e293b;
          background: #0f172a;
        }

        input {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #0b1220;
          color: white;
        }

        button {
          margin-left: 10px;
          padding: 14px 18px;
          background: #2563eb;
          border: none;
          color: white;
          border-radius: 10px;
        }

        button:disabled {
          opacity: 0.5;
        }

        /* TYPING */
        .typing {
          display: flex;
          gap: 5px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: blink 1.2s infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}