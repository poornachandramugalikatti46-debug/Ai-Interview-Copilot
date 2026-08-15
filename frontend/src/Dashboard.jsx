import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Chatbot from "./components/Chatbot";
import ResumeAnalyzer from "./ResumeAnalyzer";
import SettingsPage from "./pages/settings/SettingsPage";
import Analytics from "./pages/Analytics";
import API from "./api/axios";

export default function Dashboard({
  setLoggedIn,
  currentPage,
  setCurrentPage,
}) {
  const [openChat, setOpenChat] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();

  /* =========================
     USER DATA FROM LOCALSTORAGE
  ========================= */

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [user, setUser] = useState(storedUser);

  const [profileForm, setProfileForm] = useState({
    fullname: storedUser.fullname || storedUser.name || "",
    gender: storedUser.gender || "",
    education: storedUser.education || "",
    location: storedUser.location || "",
    phone: storedUser.phone || "",
  });

  const userName =
    user.name ||
    user.fullname ||
    user.username ||
    user.fullName ||
    "User";

  const userEmail =
    user.email || "Not provided";

  const userGender =
    user.gender || "Not provided";

  const userEducation =
    user.education ||
    user.qualification ||
    "Not provided";

  const userLocation =
    user.location ||
    user.city ||
    "Not provided";

  const userPhone =
    user.phone ||
    user.contact ||
    user.mobile ||
    "Not provided";

  const userRole =
    storedUser.role ||
    storedUser.jobRole ||
    "AI Interview Copilot User";

  const userInitial =
    userName.charAt(0).toUpperCase();

  /* =========================
     PROFILE HANDLERS
  ========================= */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);

      console.log("📤 Sending profile update:", profileForm);

      const response = await API.put(
        "/auth/profile",
        profileForm
      );

      console.log("📥 PROFILE UPDATE:", response.data);

      if (response.data.success) {
        const updatedUser = response.data.user;

        // Update React state
        setUser(updatedUser);

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        // Close edit popup
        setShowEditProfile(false);

        alert("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error(
        "❌ PROFILE UPDATE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (openChat) {
    return (
      <Chatbot
        setCurrentPage={setCurrentPage}
        setOpenChat={setOpenChat}
      />
    );
  }

  if (openResume) {
    return <ResumeAnalyzer setOpenResume={setOpenResume} />;
  }

  /* =========================
     PAGE ROUTES
  ========================= */

  /* Dashboard renders only the main UI here.
     Route-based navigation for technical and mock
     is handled by React Router in App.jsx. */

  /* =========================
     DASHBOARD UI
  ========================= */

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🤖 AI Copilot</h2>

        {/* DASHBOARD */}
        <button
          style={styles.activeBtn}
          onClick={() => setCurrentPage("dashboard")}
        >
          🏠 Dashboard
        </button>

        {/* CHATBOT */}
        <button
          style={styles.menuBtn}
          onClick={() => {
            setOpenChat(false);
            setCurrentPage("chatbot");
          }}
        >
          🤖 Chatbot
        </button>

        {/* ANALYTICS */}
        <button
          style={styles.menuBtn}
          onClick={() => setCurrentPage("analytics")}
        >
          📊 Analytics
        </button>

        {/* RESUME ANALYZER */}
        <button
          style={styles.menuBtn}
          onClick={() => setOpenResume(true)}
        >
          📄 Resume Analyzer
        </button>

        {/* SETTINGS */}
        <button
          style={styles.menuBtn}
          onClick={() => setCurrentPage("settings")}
        >
          ⚙ Settings
        </button>

        {/* LOGOUT */}
        <button
          style={styles.logout}
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div style={styles.main}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.heading}>
              Welcome Back, {userName} 👋
            </h1>

            <p style={styles.subtitle}>
              AI Interview Copilot Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowProfile(true)}
            style={{
              ...styles.avatar,
              cursor: "pointer",
              border: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1d4ed8";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#2563eb";
              e.target.style.transform = "scale(1)";
            }}
          >
            {userInitial}
          </button>
        </div>

        {/* HERO CARD */}
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>
            AI Interview Copilot
          </h1>

          <p style={styles.heroText}>
            Practice Technical, HR, Mock & Resume Interviews 🚀
          </p>

          {/* FEATURE GRID */}
          <div style={styles.featureGrid}>

            {/* TECHNICAL */}
            <div
              style={styles.featureCard}
              onClick={() => navigate("/technical")}
            >
              <h3 style={styles.cardTitle}>
                🧠 Technical Interview
              </h3>

              <p style={styles.cardText}>
                DSA, Coding & System Design Questions
              </p>
            </div>
{/* HR Interview Card */}
<div
  onClick={() => navigate("/hr/setup")}
  className="cursor-pointer rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-6 shadow-lg hover:bg-white/20 hover:shadow-2xl transition-all duration-300"
>
  <h2 className="text-2xl font-bold">🎤 HR Interview</h2>

  <p className="mt-2 text-white/80">
    Practice AI-powered HR interviews with instant feedback,
    communication analysis, and scoring.
  </p>
</div>

            {/* MOCK */}
            <div
              style={styles.featureCard}
              onClick={() => navigate("/mock-interview")}
            >
              <h3 style={styles.cardTitle}>
                🧩 Mock Interview
              </h3>

              <p style={styles.cardText}>
                Real Interview Simulation Experience
              </p>
            </div>

            {/* RESUME */}
            <div
              style={styles.featureCard}
              onClick={() => navigate("/resume-interview")}
            >
              <h3 style={styles.cardTitle}>
                📄 Resume Interview
              </h3>

              <p style={styles.cardText}>
                AI Questions Based on Resume
              </p>
            </div>

          </div>
        </div>

        {/* PROFILE MODAL */}
        {showProfile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
            onClick={() => setShowProfile(false)}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#1e293b,#0f172a)",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "24px",
                padding: "40px",
                width: "90%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                ×
              </button>

              {/* Header */}
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "30px",
                  textAlign: "center",
                }}
              >
                Profile Information
              </h2>

              {/* Avatar */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "48px",
                  fontWeight: "bold",
                  margin: "0 auto 20px",
                }}
              >
                {userInitial}
              </div>

              {/* Name & Role */}
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                {userName}
              </h3>

              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  marginBottom: "30px",
                }}
              >
                {userRole}
              </p>

              {/* Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "16px",
                }}
              >
                {/* Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Name
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {userName}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>👤</span>
                </div>

                {/* Gender */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Gender
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {userGender}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>⚧️</span>
                </div>

                {/* Education */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Education
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {userEducation}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>🎓</span>
                </div>

                {/* Location */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Location
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {userLocation}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>📍</span>
                </div>

                {/* Contact */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Contact
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {userPhone}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>📞</span>
                </div>

                {/* Email */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(51,65,85,0.5)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Email
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {userEmail}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px" }}>✉️</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                style={{
                  width: "100%",
                  marginTop: "30px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s",
                  marginBottom: "12px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#6d28d9";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#7c3aed";
                }}
              >
                Close
              </button>

              {/* Edit Profile Button */}
              <button
                type="button"
                onClick={() => {
                  setProfileForm({
                    fullname: user.fullname || user.name || "",
                    gender: user.gender || "",
                    education: user.education || "",
                    location: user.location || "",
                    phone: user.phone || "",
                  });
                  setShowEditProfile(true);
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#2563eb";
                }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {showEditProfile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
            }}
            onClick={() => setShowEditProfile(false)}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#1e293b,#0f172a)",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "24px",
                padding: "40px",
                width: "90%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                ×
              </button>

              {/* Header */}
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                Edit Profile
              </h2>

              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  marginBottom: "30px",
                  fontSize: "14px",
                }}
              >
                Update your information
              </p>

              {/* FULL NAME */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullname"
                  value={profileForm.fullname}
                  onChange={handleProfileChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#334155",
                    border: "1px solid #475569",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* GENDER */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Gender
                </label>

                <select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#334155",
                    border: "1px solid #475569",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              {/* EDUCATION */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  value={profileForm.education}
                  onChange={handleProfileChange}
                  placeholder="Example: BCA, BTech"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#334155",
                    border: "1px solid #475569",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* LOCATION */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={profileForm.location}
                  onChange={handleProfileChange}
                  placeholder="Example: Bangalore, India"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#334155",
                    border: "1px solid #475569",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* CONTACT NUMBER */}
              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter contact number"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#334155",
                    border: "1px solid #475569",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* EMAIL (READ ONLY) */}
              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#64748b",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    cursor: "not-allowed",
                  }}
                />

                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  Email cannot be changed.
                </p>
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: "#475569",
                    color: "white",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#334155";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#475569";
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: savingProfile ? "#1e40af" : "#2563eb",
                    color: "white",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: savingProfile ? "not-allowed" : "pointer",
                    transition: "0.3s",
                    opacity: savingProfile ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!savingProfile) {
                      e.target.style.background = "#1d4ed8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!savingProfile) {
                      e.target.style.background = "#2563eb";
                    }
                  }}
                >
                  {savingProfile
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    fontFamily: "Arial",
  },

  /* SIDEBAR */
  sidebar: {
    width: "260px",
    background: "#111827",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "bold",
  },

  menuBtn: {
    padding: "14px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#1f2937",
    color: "white",
    textAlign: "left",
    fontSize: "15px",
  },

  activeBtn: {
    padding: "14px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#7c3aed",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
  },

  logout: {
    marginTop: "auto",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  /* MAIN */
  main: {
    flex: 1,
    padding: "30px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "42px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "18px",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  /* HERO */
  heroCard: {
    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
    padding: "35px",
    borderRadius: "24px",
    marginTop: "20px",
  },

  heroTitle: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  heroText: {
    color: "#e2e8f0",
    fontSize: "18px",
    marginBottom: "30px",
  },

  /* FEATURE GRID */
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  /* FEATURE CARD */
  featureCard: {
    background: "rgba(255,255,255,0.12)",
    padding: "25px",
    borderRadius: "18px",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    transition: "0.3s",
  },

  cardTitle: {
    marginBottom: "10px",
    fontSize: "22px",
  },

  cardText: {
    color: "#e2e8f0",
    fontSize: "15px",
    lineHeight: "24px",
  },
};