import React, { useState } from "react";

import {
  FaUserCog,
  FaLock,
  FaShieldAlt,
  FaBell,
  FaQuestionCircle,
  FaRocket,
  FaCrown,
  FaRobot,
} from "react-icons/fa";

import { motion } from "framer-motion";

import AccountPreferences from "./AccountPreferences";
import SecuritySettings from "./SecuritySettings";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import HelpFeedback from "./HelpFeedback";
import AppUpdates from "./AppUpdates";

export default function SettingsPage() {

  const [activeTab, setActiveTab] =
    useState("account");

  const menuItems = [

    {
      id: "account",
      label: "Account Preferences",
      icon: <FaUserCog />,
    },

    {
      id: "security",
      label: "Sign In & Security",
      icon: <FaLock />,
    },

    {
      id: "privacy",
      label: "Data Privacy",
      icon: <FaShieldAlt />,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
    },

    {
      id: "help",
      label: "Help & Feedback",
      icon: <FaQuestionCircle />,
    },

    {
      id: "updates",
      label: "App Updates",
      icon: <FaRocket />,
    },
  ];

  /* =========================
     CONTENT
  ========================= */

  const renderContent = () => {

    switch (activeTab) {

      case "account":
        return <AccountPreferences />;

      case "security":
        return <SecuritySettings />;

      case "privacy":
        return <PrivacySettings />;

      case "notifications":
        return <NotificationSettings />;

      case "help":
        return <HelpFeedback />;

      case "updates":
        return <AppUpdates />;

      default:
        return <AccountPreferences />;
    }
  };

  return (

    <div style={styles.page}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        {/* LOGO */}

        <div style={styles.logoBox}>

          <div style={styles.logo}>
            ⚙️ 
          </div>

          <div>

            <h2 style={styles.appName}>
              Settings
            </h2>

          </div>

        </div>

        {/* PROFILE CARD */}

        <motion.div
          whileHover={{
            scale: 1.02,
          }}

          style={styles.profileCard}
        >

          <div style={styles.avatar}>
            P
          </div>

          <h3>
            Poornachandra
          </h3>

          <p style={styles.role}>
            Frontend Developer
          </p>

          <div style={styles.proBadge}>

            <FaCrown />

            <span>
              Premium User
            </span>

          </div>

        </motion.div>

        {/* MENU */}

        <div style={styles.menu}>

          {menuItems.map((item) => (

            <motion.div
              key={item.id}

              whileHover={{
                scale: 1.03,
                x: 5,
              }}

              whileTap={{
                scale: 0.98,
              }}

              onClick={() =>
                setActiveTab(item.id)
              }

              style={{
                ...styles.menuItem,

                background:
                  activeTab === item.id
                    ? "linear-gradient(135deg,#3b82f6,#8b5cf6)"
                    : "transparent",

                boxShadow:
                  activeTab === item.id
                    ? "0 0 20px rgba(59,130,246,0.4)"
                    : "none",
              }}
            >

              <span style={styles.menuIcon}>
                {item.icon}
              </span>

              {item.label}

            </motion.div>

          ))}

        </div>

        {/* AI CARD */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}

          style={styles.aiCard}
        >

          <FaRobot size={28} />

          <h3>
            AI Assistant
          </h3>

          <p>
            Smart personalized settings
            powered by AI
          </p>

          <button style={styles.aiButton}>
            Open AI Assistant
          </button>

        </motion.div>

      </div>

      {/* RIGHT CONTENT */}

      <div style={styles.content}>

        {renderContent()}

      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {

  page: {
    display: "flex",

    minHeight: "100vh",

    background:
      "linear-gradient(to bottom right,#020617,#0f172a,#111827)",

    color: "white",

    fontFamily:
      "'Inter', sans-serif",
  },

  /* SIDEBAR */

  sidebar: {
    width: "340px",

    padding: "25px",

    background:
      "rgba(15,23,42,0.8)",

    borderRight:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter:
      "blur(20px)",

    overflowY: "auto",
  },

  /* LOGO */

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "25px",
  },

  logo: {
    width: "55px",
    height: "55px",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "24px",
  },

  appName: {
    margin: 0,
    fontSize: "22px",
  },

  version: {
    margin: 0,
    opacity: 0.7,
    fontSize: "13px",
  },

  /* PROFILE */

  profileCard: {
    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "22px",

    padding: "25px",

    textAlign: "center",

    marginBottom: "28px",

    backdropFilter:
      "blur(18px)",
  },

  avatar: {
    width: "85px",
    height: "85px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#06b6d4,#3b82f6)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    margin: "0 auto 15px",

    fontSize: "32px",

    fontWeight: "bold",
  },

  role: {
    opacity: 0.7,
    marginBottom: "15px",
  },

  proBadge: {
    display: "inline-flex",

    alignItems: "center",

    gap: "8px",

    padding: "8px 14px",

    borderRadius: "999px",

    background:
      "rgba(251,191,36,0.15)",

    color: "#facc15",

    fontSize: "14px",
  },

  /* MENU */

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  menuItem: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    padding: "16px",

    borderRadius: "16px",

    cursor: "pointer",

    transition: "0.3s",

    fontWeight: "500",
  },

  menuIcon: {
    fontSize: "18px",
  },

  /* AI CARD */

  aiCard: {
    marginTop: "30px",

    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",

    padding: "25px",

    borderRadius: "22px",

    textAlign: "center",
  },

  aiButton: {
    marginTop: "15px",

    padding: "12px 18px",

    border: "none",

    borderRadius: "12px",

    background: "white",

    color: "#111827",

    fontWeight: "bold",

    cursor: "pointer",
  },

  /* RIGHT CONTENT */

  content: {
    flex: 1,

    padding: "35px",

    overflowY: "auto",
  },

};