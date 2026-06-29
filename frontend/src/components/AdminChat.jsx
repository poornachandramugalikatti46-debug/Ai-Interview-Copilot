import { useState } from "react";
import axios from "axios";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/ai",
        { message: input }
      );

      const aiMsg = {
        role: "ai",
        text: res.data.reply
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Server error ❌" }
      ]);
    }

    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-xl">

      {/* HEADER */}
      <div className="p-3 border-b border-white/10 font-bold">
        AI Interview Copilot Chat
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-500"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-2 flex gap-2 border-t border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-black/40 rounded outline-none text-white"
          placeholder="Ask interview question..."
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}