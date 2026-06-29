import React, {
  useEffect,
  useState,
} from "react";

import {
  FaUser,
  FaMoon,
  FaLaptopCode,
  FaCrown,
  FaGlobe,
  FaSave,
} from "react-icons/fa";

import { motion } from "framer-motion";

export default function AccountPreferences() {

  /* =========================
     STATES
  ========================= */

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [education, setEducation] =
    useState("");

  const [language, setLanguage] =
    useState("English");

  const [theme, setTheme] =
    useState("Dark");

  const [role, setRole] =
    useState("Frontend");

  const [level, setLevel] =
    useState("Advanced");

  /* =========================
     FETCH SETTINGS
  ========================= */

  useEffect(() => {

    fetch(
      "http://localhost:5001/api/settings"
    )

      .then((res) => res.json())

      .then((data) => {

        const s =
          data.settings.account;

        setName(s.name);

        setLocation(s.location);

        setEducation(s.education);

        setLanguage(s.language);

        setTheme(s.theme);

        setRole(s.role);

        setLevel(s.skillLevel);

        setLoading(false);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

  /* =========================
     SAVE
  ========================= */

  const saveChanges = () => {

    alert(
      "✅ Settings Saved Successfully"
    );

  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div style={styles.loading}>
        Loading...
      </div>

    );
  }

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            👤 Account Preferences
          </h1>

          <p style={styles.subtitle}>
            Personalize your AI
            interview experience.
          </p>

        </div>

      </div>

      {/* PROFILE CARD */}

      <motion.div
        whileHover={{
          scale: 1.01,
        }}

        style={styles.profileCard}
      >

        <div style={styles.avatar}>

          {name.charAt(0)}

        </div>

        <div>

          <h2>
            {name}
          </h2>

          <p style={styles.roleText}>
            {role} Developer
          </p>

          <div style={styles.badge}>

            <FaCrown />

            Premium User

          </div>

        </div>

      </motion.div>

      {/* GRID */}

      <div style={styles.grid}>

        {/* PROFILE */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.card}
        >

          <div style={styles.cardHeader}>

            <FaUser />

            <h3>
              Profile Information
            </h3>

          </div>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="text"
            value={education}
            onChange={(e) =>
              setEducation(
                e.target.value
              )
            }
            style={styles.input}
          />

        </motion.div>

        {/* LANGUAGE */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.card}
        >

          <div style={styles.cardHeader}>

            <FaGlobe />

            <h3>
              Language
            </h3>

          </div>

          <select
            value={language}

            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }

            style={styles.select}
          >

            <option>
              English
            </option>

            <option>
              Hindi
            </option>

            <option>
              Kannada
            </option>

          </select>

        </motion.div>

        {/* THEME */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.card}
        >

          <div style={styles.cardHeader}>

            <FaMoon />

            <h3>
              Theme
            </h3>

          </div>

          <div style={styles.themeGrid}>

            {[
              "Light",
              "Dark",
              "System",
            ].map((item) => (

              <div
                key={item}

                onClick={() =>
                  setTheme(item)
                }

                style={{
                  ...styles.themeCard,

                  border:
                    theme === item
                      ? "2px solid #3b82f6"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >

                {item}

              </div>

            ))}

          </div>

        </motion.div>

        {/* ROLE */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.card}
        >

          <div style={styles.cardHeader}>

            <FaLaptopCode />

            <h3>
              Interview Role
            </h3>

          </div>

          <div style={styles.roleGrid}>

            {[
              "Frontend",
              "Backend",
              "Full Stack",
              "HR",
            ].map((item) => (

              <div
                key={item}

                onClick={() =>
                  setRole(item)
                }

                style={{
                  ...styles.roleCard,

                  background:
                    role === item
                      ? "linear-gradient(135deg,#3b82f6,#8b5cf6)"
                      : "rgba(255,255,255,0.05)",
                }}
              >

                {item}

              </div>

            ))}

          </div>

        </motion.div>

        {/* SKILL */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.card}
        >

          <h3>
            ⚡ Skill Level
          </h3>

          <div style={styles.levelContainer}>

            {[
              "Beginner",
              "Intermediate",
              "Advanced",
            ].map((item) => (

              <div
                key={item}

                onClick={() =>
                  setLevel(item)
                }

                style={{
                  ...styles.levelChip,

                  background:
                    level === item
                      ? "linear-gradient(135deg,#3b82f6,#8b5cf6)"
                      : "rgba(255,255,255,0.06)",
                }}
              >

                {item}

              </div>

            ))}

          </div>

        </motion.div>

        {/* PRO */}

        <motion.div
          whileHover={{
            y: -4,
          }}

          style={styles.proCard}
        >

          <h2>
            🚀 Upgrade To Pro
          </h2>

          <p>
            Unlock premium AI
            interviews and analytics.
          </p>

          <button style={styles.proButton}>
            Upgrade Now
          </button>

        </motion.div>

      </div>

      {/* SAVE */}

      <button
        onClick={saveChanges}
        style={styles.saveButton}
      >

        <FaSave />

        Save Changes

      </button>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {

  page: {
    color: "white",
    padding: "20px",
  },

  loading: {
    color: "white",
    padding: "30px",
    fontSize: "22px",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "38px",
    fontWeight: "bold",

    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",

    WebkitBackgroundClip: "text",

    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    opacity: 0.7,
    marginTop: "10px",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "25px",
    borderRadius: "24px",
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    marginBottom: "30px",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#06b6d4,#3b82f6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    fontWeight: "bold",
  },

  roleText: {
    opacity: 0.7,
    marginTop: "6px",
  },

  badge: {
    marginTop: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background:
      "rgba(251,191,36,0.15)",
    color: "#facc15",
    padding: "8px 14px",
    borderRadius: "999px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "24px",
  },

  card: {
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    fontSize: "18px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "white",
    outline: "none",
  },

  select: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.04)",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  themeGrid: {
    display: "flex",
    gap: "12px",
  },

  themeCard: {
    flex: 1,
    padding: "18px",
    textAlign: "center",
    borderRadius: "16px",
    cursor: "pointer",
    background:
      "rgba(255,255,255,0.05)",
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,1fr)",
    gap: "12px",
  },

  roleCard: {
    padding: "16px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "600",
  },

  levelContainer: {
    display: "flex",
    gap: "16px",
    marginTop: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  levelChip: {
    minWidth: "140px",
    padding: "14px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "600",
  },

  proCard: {
    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    padding: "28px",
    borderRadius: "24px",
  },

  proButton: {
    marginTop: "18px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "14px",
    background: "white",
    color: "#111827",
    fontWeight: "bold",
    cursor: "pointer",
  },

  saveButton: {
    marginTop: "35px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 24px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },

};