import { useState } from "react";
import axios from "axios";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Auth({ setLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetBox, setShowResetBox] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    role: "candidate",
    experience: "",
    password: "",
    newPassword: "",
  });

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= REGISTER ================= */
  const register = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullname: form.fullname,
          email: form.email,
          role: form.role,
          experience: form.experience,
          password: form.password,
        }
      );

      alert("Registration Successful ✅");
      setIsLogin(true);

    } catch (err) {
      console.log(err);
      setError("Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN (FIXED) ================= */
  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      const user = res.data.user;

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ SAVE FULL USER
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ IMPORTANT FIX: SAVE USERNAME FOR CHATBOT
      localStorage.setItem("username", user.fullname);

      alert("Login Successful 🚀");

      setLoggedIn(true);

    } catch (err) {
      console.log(err);
      setError("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN (FIXED) ================= */
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      localStorage.setItem("googleUser", JSON.stringify(user));

      // ✅ IMPORTANT FIX
      localStorage.setItem(
        "username",
        user.displayName || "User"
      );

      alert("Google Login Successful ✅");

      setLoggedIn(true);

    } catch (error) {
      console.log(error);
      setError("Google Login Failed ❌");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    if (!form.email || !form.newPassword) {
      alert("Enter Email and New Password ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: form.email,
          newPassword: form.newPassword,
        }
      );

      alert(res.data.message || "Password Changed Successfully ✅");

      setShowResetBox(false);
      setForm({ ...form, newPassword: "" });

    } catch (error) {
      console.log(error);
      alert("Password Reset Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>🚀 AI Interview Copilot</h1>
        <p style={styles.subtitle}>Smart AI Interview Preparation</p>

        {/* TOGGLE */}
        {!showResetBox && (
          <div style={styles.toggle}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                ...styles.toggleBtn,
                background: isLogin ? "#7c3aed" : "transparent",
              }}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              style={{
                ...styles.toggleBtn,
                background: !isLogin ? "#7c3aed" : "transparent",
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && <div style={styles.error}>{error}</div>}

        {/* RESET BOX */}
        {showResetBox ? (
          <>
            <input
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="newPassword"
              placeholder="Enter New Password"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              style={styles.input}
            />

            <button onClick={resetPassword} style={styles.mainBtn}>
              {loading ? "Please Wait..." : "Change Password"}
            </button>

            <p
              style={styles.backText}
              onClick={() => setShowResetBox(false)}
            >
              ← Back To Login
            </p>
          </>
        ) : (
          <>
            {/* REGISTER */}
            {!isLogin && (
              <>
                <input
                  name="fullname"
                  placeholder="Full Name"
                  value={form.fullname}
                  onChange={handleChange}
                  style={styles.input}
                />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>

                <input
                  name="experience"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={handleChange}
                  style={styles.input}
                />
              </>
            )}

            {/* EMAIL */}
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />

            {/* BUTTON */}
            <button
              onClick={isLogin ? login : register}
              style={styles.mainBtn}
            >
              {loading ? "Please Wait..." : isLogin ? "Login" : "Create Account"}
            </button>

            {/* GOOGLE */}
            <button onClick={googleLogin} style={styles.googleBtn}>
              Continue with Google
            </button>

            {/* FORGOT */}
            <p
              style={styles.forgot}
              onClick={() => setShowResetBox(true)}
            >
              Forgot Password?
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },

  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "20px",
    background: "#111827",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  title: {
    color: "white",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
  },

  toggle: {
    display: "flex",
  },

  toggleBtn: {
    flex: 1,
    padding: "10px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0b1220",
    color: "white",
  },

  mainBtn: {
    padding: "12px",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  googleBtn: {
    padding: "12px",
    background: "white",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  forgot: {
    color: "#38bdf8",
    textAlign: "center",
    cursor: "pointer",
  },

  backText: {
    color: "#38bdf8",
    textAlign: "center",
    cursor: "pointer",
  },

  error: {
    background: "#7f1d1d",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
  },
};