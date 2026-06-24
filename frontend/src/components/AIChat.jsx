import { useState, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaUser } from "react-icons/fa";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     SESSION ID (SAFE INIT)
  ========================= */
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("sessionId");

    if (!id) {
      id = "user-" + Date.now();
      localStorage.setItem("sessionId", id);
    }

    setSessionId(id);
  }, []);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message;

    // show user instantly
    setChat((prev) => [
      ...prev,
      { sender: "user", text: userText },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // 🔥 GUARANTEED SAFE SESSION
      const id = localStorage.getItem("sessionId");

      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          sessionId: id,   // ✅ ALWAYS SENT
          message: userText,
          mode: "HR"       // optional future feature
        }
      );

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.reply || "No response",
        },
      ]);
    } catch (error) {
      console.log(error);

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Backend Error (check server)",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* CHAT BOX */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 h-[600px] overflow-y-auto shadow-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Interview Coach 🚀
        </h1>

        {/* MESSAGES */}
        <div className="space-y-4">

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl flex gap-3 items-start ${
                  msg.sender === "user"
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <div className="mt-1">
                  {msg.sender === "user" ? (
                    <FaUser />
                  ) : (
                    <FaRobot />
                  )}
                </div>

                <p className="whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {/* LOADING */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white p-4 rounded-2xl">
                AI is typing...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="flex gap-4 mt-6">
        <input
          type="text"
          placeholder="Ask interview question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-400 px-8 rounded-2xl font-bold"
        >
          Send
        </button>
      </div>

    </div>
  );
}