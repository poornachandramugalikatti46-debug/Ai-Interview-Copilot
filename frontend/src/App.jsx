import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

/* AUTH */
import Auth from "./Auth";

/* MAIN PAGES */
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/AdminDashboard";
import Analytics from "./pages/Analytics";
import Chatbot from "./components/Chatbot";

/* INTERVIEW PAGES */
import TechnicalInterview from "./pages/technical/TechnicalHome";
import TechnicalInterviewSetup from "./pages/technical/InterviewSetup";
import TechnicalInterviewRoom from "./pages/technical/InterviewRoom";
import InterviewReportTechnical from "./pages/technical/InterviewReport";
import ResumeInterviewSetup from "./pages/resume/ResumeInterviewSetup";
import ResumeInterviewRoom from "./pages/resume/ResumeInterviewRoom";
import ResumeInterviewReport from "./pages/resume/ResumeInterviewReport";
/* MOCK INTERVIEW PAGES */
import MockInterview from "./pages/mock/MockInterview";
import MockInterviewHome from "./pages/mock/MockInterviewHome";
import MockInterviewSetup from "./pages/mock/InterviewSetup";
import MockInterviewRoom from "./pages/mock/InterviewRoom";
import InterviewReportMock from "./pages/mock/InterviewReport";

/* HR INTERVIEW PAGES */

import HRSetup from "./pages/hr/HRSetup";
import HRInterview from "./pages/hr/HRInterview";
import HRResult from "./pages/hr/HRResult";
import HRHistory from "./pages/hr/HRHistory";

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
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    const googleUser = localStorage.getItem("googleUser");
    return Boolean(token || googleUser);
  });

  const [adminMode, setAdminMode] = useState(false);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [darkMode, setDarkMode] = useState(true);

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

      /* CHATBOT PAGE */

      case "chatbot":
        return (
          <Chatbot
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

  if (location.pathname.startsWith("/technical")) {
    return (
      <Routes>
        <Route path="/technical" element={<TechnicalInterview setCurrentPage={setCurrentPage} navigate={navigate} />} />
        <Route path="/technical/setup" element={<TechnicalInterviewSetup />} />
        <Route path="/technical/interview" element={<TechnicalInterviewRoom />} />
        <Route path="/technical/report" element={<InterviewReportTechnical />} />
      </Routes>
    );
  }

  if (location.pathname.startsWith("/mock-interview")) {
    return (
      <Routes>
        <Route path="/mock-interview" element={<MockInterviewHome />} />
        <Route path="/mock-interview/setup" element={<MockInterviewSetup />}/>
        <Route path="/mock-interview/room" element={<MockInterviewRoom />} />
        <Route path="/mock-interview/report/:id" element={<InterviewReportMock />} />
      </Routes>
    );
  }

  if (location.pathname.startsWith("/hr")) {
    return (
      <Routes>  
      <Route path="/hr/setup" element={<HRSetup />} />
      <Route path="/hr/interview" element={<HRInterview />} />
      <Route path="/hr/result" element={<HRResult />} />
      <Route path="/hr/history" element={<HRHistory />} />
      <Route path="/hr/result/:id" element={<HRResult />} />
    </Routes>
    );
  }

  if (location.pathname.startsWith("/resume-interview")) {
    return (
      <Routes>
        <Route path="/resume-interview" element={<ResumeInterviewSetup />} />
        <Route path="/resume-interview/:interviewId" element={<ResumeInterviewRoom />} />
        <Route path="/resume-interview/:interviewId/report" element={<ResumeInterviewReport />} />
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

        <div style={styles.topActions} />
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

  chatbotBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#06b6d4",
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
