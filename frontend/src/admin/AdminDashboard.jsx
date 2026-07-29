import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

export default function AdminDashboard() {

  const [page, setPage] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats(res.data.stats || {});
      setUsers(res.data.recentUsers || []);
    } catch (e) {
      console.log(e.message);
    }
  };

  const removeUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((p) => p.filter((u) => u._id !== id));
      showToast("User removed");
    } catch (e) {
      console.log(e.message);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const filtered = users.filter(u =>
    u.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const chart = [
    { d: "Mon", v: 20 },
    { d: "Tue", v: 40 },
    { d: "Wed", v: 55 },
    { d: "Thu", v: 70 },
    { d: "Fri", v: 90 },
    { d: "Sat", v: 120 },
    { d: "Sun", v: 150 },
  ];

  if (!stats) {
    return (
      <div style={styles.loading}>
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div style={{
      ...styles.app,
      background: dark ? "#070b14" : "#f4f6fb",
      color: dark ? "white" : "#111"
    }}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>⚡ AI ADMIN</div>

        <button onClick={() => setPage("dashboard")} style={btn(page==="dashboard")}>
          📊 Dashboard
        </button>

        <button onClick={() => setPage("users")} style={btn(page==="users")}>
          👥 Users
        </button>

        <button onClick={() => setPage("analytics")} style={btn(page==="analytics")}>
          📈 Analytics
        </button>

        <button onClick={() => setDark(!dark)} style={styles.switch}>
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={() => (window.location.href = "/login")}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {toast && <div style={styles.toast}>{toast}</div>}

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1 style={styles.title}>Dashboard Overview</h1>

            <div style={styles.grid}>
              <Card title="Users" value={stats.totalUsers} />
              <Card title="Chats" value={stats.totalChats} />
              <Card title="Revenue" value={`₹${stats.revenue}`} />
              <Card title="AI Requests" value={stats.aiRequests} />
            </div>

            <div style={styles.chartBox}>
              <h3>Weekly Growth</h3>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chart}>
                  <XAxis dataKey="d" />
                  <Tooltip />
                  <Area dataKey="v" stroke="#6366f1" fill="#6366f1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* USERS */}
        {page === "users" && (
          <>
            <h1 style={styles.title}>Users</h1>

            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />

            <div style={styles.list}>
              {filtered.map(u => (
                <div key={u._id} style={styles.userCard}>
                  <div>
                    <b>{u.fullname}</b>
                    <p style={{ opacity: 0.6 }}>{u.email}</p>
                  </div>

                  <button onClick={() => removeUser(u._id)} style={styles.delete}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ANALYTICS */}
        {page === "analytics" && (
          <>
            <h1 style={styles.title}>Analytics</h1>

            <div style={styles.box}>
              🚀 Growth: +48%<br />
              🤖 Interviews: 8,900<br />
              📄 Resumes: 1,500<br />
              ⚡ ATS Avg: 89%
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ================= UI ================= */

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const btn = (active) => ({
  ...styles.btn,
  background: active ? "#6366f1" : "transparent",
  color: active ? "white" : "#aaa",
});

const styles = {

  app: { display: "flex", minHeight: "100vh", fontFamily: "Inter" },

  sidebar: {
    width: 240,
    padding: 20,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  logo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

  btn: {
    padding: 12,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left",
    background: "transparent",
  },

  switch: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#8b5cf6",
    color: "white",
  },

  logout: {
    marginTop: "auto",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#ef4444",
    color: "white",
  },

  main: { flex: 1, padding: 25 },

  title: { fontSize: 28, marginBottom: 20 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 15,
  },

  card: {
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
  },

  chartBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
  },

  search: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    marginBottom: 15,
  },

  list: { display: "flex", flexDirection: "column", gap: 10 },

  userCard: {
    display: "flex",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
  },

  delete: {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },

  box: {
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    lineHeight: 2,
  },

  toast: {
    background: "#22c55e",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  loading: {
    padding: 40,
  }
};