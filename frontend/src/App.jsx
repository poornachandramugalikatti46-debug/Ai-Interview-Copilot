import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

/* AUTH */
import Auth from "./Auth";

/* MAIN PAGES */
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/AdminDashboard";
import Analytics from "./pages/Analytics";

/* INTERVIEW PAGES */
import TechnicalInterview from "./pages/technical/TechnicalInterview";
import HRInterview from "./pages/hr/HRInterview";
import MockInterview from "./pages/mock/MockInterview";
import ResumeInterview from "./pages/resume/ResumeInterview";

/* SETTINGS */
import SettingsPage from "./pages/settings/SettingsPage";
import AccountPreferences from "./pages/settings/AccountPreferences";
import SecuritySettings from "./pages/settings/SecuritySettings";
import PrivacySettings from "./pages/settings/PrivacySettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import HelpFeedback from "./pages/settings/HelpFeedback";
import AppUpdates from "./pages/settings/AppUpdates";

/* PASSWORD PAGES */
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  const [adminMode, setAdminMode] = useState(false);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [darkMode, setDarkMode] = useState(true);

  /* =========================
     CHECK LOGIN
  ========================= */

  useEffect(() => {

    const token = localStorage.getItem("token");

    const googleUser =
      localStorage.getItem("googleUser");

    if (token || googleUser) {
      setLoggedIn(true);
    }

  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.clear();

    setLoggedIn(false);

    setAdminMode(false);

    setCurrentPage("dashboard");

    navigate("/");
  };

  /* =========================
     PAGE ROUTER
  ========================= */

  const renderPage = () => {

    /* ADMIN */

    if (adminMode) {
      return <AdminDashboard />;
    }

    /* INTERVIEW PAGES */

    if (currentPage === "technical") {
      return (
        <TechnicalInterview
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "hr") {
      return (
        <HRInterview
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "mock") {
      return (
        <MockInterview
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "resumeInterview") {
      return (
        <ResumeInterview
          setCurrentPage={setCurrentPage}
        />
      );
    }

    /* NORMAL PAGES */

    switch (currentPage) {

      case "dashboard":
        return (
          <Dashboard
            setLoggedIn={setLoggedIn}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );

      case "analytics":
        return (
          <Analytics
            setCurrentPage={setCurrentPage}
          />
        );

      case "settings":
        return (
          <SettingsPage
            setCurrentPage={setCurrentPage}
          />
        );

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
        return (
          <Dashboard
            setLoggedIn={setLoggedIn}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  /* =========================
     AUTH ROUTES
  ========================= */

  if (!loggedIn) {

    return (
      <Routes>

        <Route
          path="/"
          element={
            <Auth setLoggedIn={setLoggedIn} />
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>
    );
  }

  /* =========================
     MAIN APP UI
  ========================= */

  return (

    <div
      style={{
        ...styles.app,

        background: darkMode
          ? "linear-gradient(to bottom right,#020617,#0f172a,#111827)"
          : "#f1f5f9",

        color: darkMode
          ? "white"
          : "#0f172a",
      }}
    >

      {/* TOP BAR */}

      <div style={styles.topBar}>

        <div style={styles.brand}>
          🚀 AI Interview Copilot
        </div>

        <div style={styles.topActions}>

          {/* THEME */}

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={styles.themeBtn}
          >
            {darkMode
              ? "🌞 Light"
              : "🌙 Dark"}
          </button>

          {/* ADMIN */}

          <button
            onClick={() =>
              setAdminMode(!adminMode)
            }
            style={{
              ...styles.adminBtn,

              background: adminMode
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "linear-gradient(135deg,#7c3aed,#3b82f6)",
            }}
          >
            {adminMode
              ? "⬅ Exit Admin"
              : "⚙ Admin"}
          </button>

          {/* SETTINGS */}

          <button
            onClick={() =>
              setCurrentPage("settings")
            }
            style={styles.settingsBtn}
          >
            ⚙ Settings
          </button>

          {/* DASHBOARD */}

          <button
            onClick={() =>
              setCurrentPage("dashboard")
            }
            style={styles.dashboardBtn}
          >
            🏠 Dashboard
          </button>

          {/* LOGOUT */}

          <button
            onClick={logout}
            style={styles.logoutBtn}
          >
            🚪 Logout
          </button>

        </div>
      </div>

      {/* PAGE CONTENT */}

      <div style={styles.pageContainer}>
        {renderPage()}
      </div>

    </div>
  );
}

export default App;

/* =========================
   STYLES
========================= */

const styles = {

  app: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    transition: "0.3s",
  },

  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "75px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    zIndex: 999,
    background: "rgba(2,6,23,0.75)",
    backdropFilter: "blur(14px)",
  },

  brand: {
    fontSize: "22px",
    fontWeight: "bold",
  },

  topActions: {
    display: "flex",
    gap: "10px",
  },

  themeBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  adminBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  settingsBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#10b981",
    color: "white",
    cursor: "pointer",
  },

  dashboardBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  pageContainer: {
    paddingTop: "90px",
    minHeight: "100vh",
  },

};