import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

export default function Chatbot({ setCurrentPage }) {
  const [message, setMessage] = useState("");

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("all-chats");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeChatId, setActiveChatId] = useState(() =>
    Date.now().toString()
  );

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const chatEndRef = useRef(null);

  const activeChat =
    chats[activeChatId] || { title: "New Chat", messages: [] };

  const activeMessages = activeChat.messages || [];

  /* =========================
     TRACK EVENT (ENTERPRISE)
  ========================= */
  const trackEvent = async (event, meta = {}) => {
    try {
      await api.post("/analytics/track", {
        userId: activeChatId,
        event,
        meta,
      });
    } catch (err) {
      console.log(err);
    }
  };

  /* AUTO SCROLL */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  /* SAVE LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("all-chats", JSON.stringify(chats));
  }, [chats]);

  /* NEW CHAT */
  const newChat = () => {
    const id = Date.now().toString();

    setChats((prev) => ({
      ...prev,
      [id]: { title: "New Chat", messages: [] },
    }));

    setActiveChatId(id);

    /* ✅ TRACK */
    trackEvent("chat_created", { chatId: id });
  };

  const switchChat = (id) => setActiveChatId(id);

  /* RENAME */
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const saveTitle = (id) => {
    setChats((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        title: editText.trim() || "Untitled Chat",
      },
    }));
    setEditingId(null);
  };

  /* DELETE */
  const deleteChat = (id) => {
    setChats((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    /* ✅ TRACK */
    trackEvent("chat_deleted", { chatId: id });

    if (activeChatId === id) {
      const remaining = Object.keys(chats).filter((c) => c !== id);

      if (remaining.length > 0) {
        setActiveChatId(remaining[0]);
      } else {
        const newId = Date.now().toString();
        setChats({
          [newId]: { title: "New Chat", messages: [] },
        });
        setActiveChatId(newId);
      }
    }
  };

  /* SEND MESSAGE */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const chatId = activeChatId;

    const userMsg = {
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setChats((prev) => {
      const chat = prev[chatId] || { title: "New Chat", messages: [] };

      return {
        ...prev,
        [chatId]: {
          ...chat,
          messages: [...chat.messages, userMsg],
        },
      };
    });

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    /* ✅ TRACK USER MESSAGE */
    trackEvent("message_sent", { text: currentMessage });

    try {
      const res = await api.post("/chat", {
        message: currentMessage,
        userId: chatId,
      });

      const aiMsg = {
        sender: "AI",
        text: res.data.reply,
        time: new Date().toLocaleTimeString(),
      };

      setChats((prev) => {
        const chat = prev[chatId];

        return {
          ...prev,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, aiMsg],
          },
        };
      });

      /* ✅ TRACK AI RESPONSE */
      trackEvent("ai_response", { reply: res.data.reply });

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* UI */
  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🤖 Chatbot</div>

        <button style={styles.newChatBtn} onClick={newChat}>
          + New Chat
        </button>

        <div style={styles.chatList}>
          {Object.entries(chats).map(([id, chat]) => (
            <div
              key={id}
              style={{
                ...styles.chatItem,
                background: id === activeChatId ? "#1e293b" : "transparent",
              }}
              onClick={() => switchChat(id)}
            >
              <div style={styles.chatRow}>
                <span style={styles.chatTitle}>💬 {chat.title}</span>

                <div style={styles.actions}>
                  <button onClick={() => startEdit(id, chat.title)}>✏️</button>
                  <button onClick={() => deleteChat(id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.container}>
        <div style={styles.header}>
          <button
            onClick={() => setCurrentPage("dashboard")}
            style={styles.backBtn}
          >
            ← Back
          </button>

          AI Interview Assistant
        </div>

        <div style={styles.chatArea}>
          {activeMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "You" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  ...styles.messageBox,
                  background: msg.sender === "You" ? "#2563eb" : "#111827",
                }}
              >
                <b>{msg.sender}</b>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}

          {loading && <p style={{ color: "#94a3b8" }}>🤖 AI typing...</p>}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
            placeholder="Ask anything..."
          />

          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES (UNCHANGED) */
const styles = {
  wrapper: { display: "flex", height: "100vh", background: "#020617" },
  sidebar: { width: 260, padding: 15, background: "#0f172a" },
  logo: { color: "white", fontSize: 22, fontWeight: "bold" },
  newChatBtn: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    marginTop: 10,
  },
  chatList: { marginTop: 10 },
  chatItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    color: "white",
    cursor: "pointer",
  },
  chatRow: { display: "flex", justifyContent: "space-between" },
  chatTitle: { fontSize: 14 },
  actions: { display: "flex", gap: 6 },
  container: { flex: 1, display: "flex", flexDirection: "column" },
  header: {
    padding: 15,
    color: "white",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
  },
  chatArea: { flex: 1, padding: 20, overflowY: "auto" },
  messageBox: {
    padding: 12,
    borderRadius: 10,
    color: "white",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    padding: 15,
    borderTop: "1px solid #1e293b",
  },
  input: {
    flex: 1,
    padding: 12,
    background: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
  button: {
    marginLeft: 10,
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};