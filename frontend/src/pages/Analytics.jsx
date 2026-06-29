import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { motion } from "framer-motion";

export default function WeeklyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD INITIAL DATA
  ========================= */
  useEffect(() => {
    fetchInitial();

    // REAL-TIME SOCKET
    socket.on("weekly-update", (liveData) => {
      setData(liveData || []);
      setLoading(false);
    });

    return () => socket.off("weekly-update");
  }, []);

  const fetchInitial = async () => {
    try {
      const res = await api.get("/analytics/weekly-time");

      const map = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };

      (res.data || []).forEach((d) => {
        if (map[d.day] !== undefined) {
          map[d.day] = d.hours;
        }
      });

      setData([
        { day: "Sun", hours: map.Sun },
        { day: "Mon", hours: map.Mon },
        { day: "Tue", hours: map.Tue },
        { day: "Wed", hours: map.Wed },
        { day: "Thu", hours: map.Thu },
        { day: "Fri", hours: map.Fri },
        { day: "Sat", hours: map.Sat },
      ]);

      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  /* =========================
     LOADING UI
  ========================= */
  if (loading) {
    return (
      <div style={styles.loader}>
        <motion.div
          style={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading Weekly Analytics...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1>📊 Weekly Practice Analytics</h1>
        <p>Real-time SaaS dashboard (WebSocket + Animation)</p>
      </motion.div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.card}
      >

        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                color: "white",
              }}
            />

            {/* REAL CLEAN BAR ANIMATION */}
            <Bar dataKey="hours" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#6366f1"
                  style={{
                    filter:
                      "drop-shadow(0px 6px 14px rgba(99,102,241,0.6))",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </motion.div>
    </div>
  );
}

/* =========================
   ULTRA SAAS STYLES
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "radial-gradient(circle at top, #0b1220, #020617)",
    color: "white",
    fontFamily: "Segoe UI",
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  loader: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220",
    color: "white",
  },

  spinner: {
    width: "45px",
    height: "45px",
    border: "4px solid #333",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
  },
};