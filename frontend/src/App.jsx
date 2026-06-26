import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

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

/* PASSWORD */
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  /* ================= CHECK LOGIN ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
    }
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();

    setLoggedIn(false);
    setAdminMode(false);

    navigate("/");
  };

  /* ================= AUTH ROUTES ================= */
  if (!loggedIn) {
    return (
      <Routes>
        <Route
          path="/"
          element={<Auth setLoggedIn={setLoggedIn} />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* FIX 404 */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    );
  }

  /* ================= MAIN APP ================= */
  return (
    <div
      style={{
        ...styles.app,
        background: darkMode
          ? "linear-gradient(to bottom right,#020617,#0f172a,#111827)"
          : "#f1f5f9",
        color: darkMode ? "white" : "#0f172a",
      }}
    >
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.brand}>
          🚀 AI Interview Copilot
        </div>

        <div style={styles.topActions}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.themeBtn}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>

          <button
            onClick={() => setAdminMode(!adminMode)}
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

          <button
            onClick={() => navigate("/dashboard")}
            style={styles.dashboardBtn}
          >
            🏠 Dashboard
          </button>

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
        <Routes>
          {/* DEFAULT */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              adminMode
                ? <AdminDashboard />
                : <Dashboard />
            }
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* INTERVIEWS */}
          <Route
            path="/technical"
            element={<TechnicalInterview />}
          />

          <Route
            path="/hr"
            element={<HRInterview />}
          />

          <Route
            path="/mock"
            element={<MockInterview />}
          />

          <Route
            path="/resume"
            element={<ResumeInterview />}
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={<SettingsPage />}
          />

          <Route
            path="/account"
            element={<AccountPreferences />}
          />

          <Route
            path="/security"
            element={<SecuritySettings />}
          />

          <Route
            path="/privacy"
            element={<PrivacySettings />}
          />

          <Route
            path="/notifications"
            element={<NotificationSettings />}
          />

          <Route
            path="/help"
            element={<HelpFeedback />}
          />

          <Route
            path="/updates"
            element={<AppUpdates />}
          />

          {/* FIX 404 */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

/* ================= STYLES ================= */

const styles = {
  app: {
    minHeight: "100vh",
    fontFamily: "Arial",
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
    background: "rgba(2,6,23,0.75)",
    backdropFilter: "blur(14px)",
    zIndex: 999,
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
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  adminBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  dashboardBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  logoutBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  pageContainer: {
    paddingTop: "90px",
    minHeight: "100vh",
  },
};