import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function Auth({ setLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API}/login`, {
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful 🚀");

      setLoggedIn(true);

    } catch (err) {
      console.log(
        "LOGIN ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API}/register`, {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("Registered Successfully 🎉");

      // switch to login
      setMode("login");

      // auto fill email
      setForm({
        fullname: "",
        email: form.email,
        password: "",
      });

    } catch (err) {
      console.log(
        "REGISTER ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message || "Register failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {

    if (!form.email || !form.password) {
      alert("Email & Password required");
      return;
    }

    if (mode === "register" && !form.fullname) {
      alert("Full Name required");
      return;
    }

    if (mode === "login") {
      login();
    } else {
      register();
    }
  };

  return (
    <div className="container">

      {/* BACKGROUND */}
      <div className="bg"></div>

      {/* CARD */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* LOGO */}
        <motion.div
          className="logo"
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 20px #2563eb",
              "0 0 45px #38bdf8",
              "0 0 20px #2563eb",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          🤖
        </motion.div>

        <h1>AI Interview Copilot</h1>

        <p>
          Practice smarter. Crack interviews faster.
        </p>

        {/* TOGGLE */}
        <div className="toggle">

          <button
            className={
              mode === "login" ? "active" : ""
            }
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={
              mode === "register" ? "active" : ""
            }
            onClick={() => setMode("register")}
          >
            Register
          </button>

        </div>

        {/* FORM */}
        <AnimatePresence mode="wait">

          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >

            {mode === "register" && (
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={form.fullname}
                onChange={handleChange}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />

              <span
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </span>

            </div>

            <button
              className="btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>

          </motion.div>

        </AnimatePresence>

      </motion.div>

      {/* STYLE */}
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          overflow:hidden;
          font-family:Arial;
        }

        .container{
          width:100%;
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          position:relative;
          overflow:hidden;
          background:
          radial-gradient(circle at top,
          #0f172a,
          #020617);
        }

        .bg{
          position:absolute;
          width:200%;
          height:200%;
          background-image:
          radial-gradient(#ffffff11 1px, transparent 1px);
          background-size:30px 30px;
          animation:move 25s linear infinite;
        }

        @keyframes move{
          from{
            transform:translateY(0px);
          }

          to{
            transform:translateY(-200px);
          }
        }

        .card{
          width:400px;
          padding:35px;
          border-radius:24px;
          background:rgba(255,255,255,0.06);
          backdrop-filter:blur(25px);
          border:1px solid rgba(255,255,255,0.08);
          color:white;
          text-align:center;
          z-index:10;

          box-shadow:
          0 10px 40px rgba(0,0,0,0.5);
        }

        .logo{
          width:90px;
          height:90px;
          margin:auto;
          margin-bottom:18px;

          border-radius:24px;

          background:
          linear-gradient(
            135deg,
            #2563eb,
            #38bdf8
          );

          display:flex;
          align-items:center;
          justify-content:center;

          font-size:40px;
        }

        h1{
          font-size:30px;
          margin-bottom:10px;
        }

        p{
          color:#94a3b8;
          margin-bottom:25px;
          font-size:14px;
        }

        .toggle{
          display:flex;
          background:#0f172a;
          border-radius:14px;
          overflow:hidden;
          margin-bottom:20px;
        }

        .toggle button{
          flex:1;
          padding:13px;
          border:none;
          background:transparent;
          color:#94a3b8;
          cursor:pointer;
          font-size:15px;
          transition:0.3s;
        }

        .toggle .active{
          background:#2563eb;
          color:white;
          font-weight:bold;
        }

        input{
          width:100%;
          padding:14px;
          margin-bottom:14px;

          border:none;
          border-radius:14px;

          background:#0b1220;

          color:white;

          outline:none;

          font-size:14px;

          border:1px solid #1e293b;
        }

        input:focus{
          border-color:#2563eb;
        }

        .password-box{
          position:relative;
        }

        .password-box span{
          position:absolute;
          right:14px;
          top:40%;
          transform:translateY(-50%);
          cursor:pointer;
        }

        .btn{
          width:100%;
          padding:14px;

          border:none;
          border-radius:14px;

          background:
          linear-gradient(
            135deg,
            #2563eb,
            #38bdf8
          );

          color:white;

          font-size:15px;
          font-weight:bold;

          cursor:pointer;

          transition:0.3s;
        }

        .btn:hover{
          transform:translateY(-2px);
          opacity:0.95;
        }

        .btn:disabled{
          opacity:0.7;
          cursor:not-allowed;
        }

      `}</style>
    </div>
  );
}