import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleReset = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
          newPassword: password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {

      setMessage(
        err.response?.data?.message
      );

    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          🔐 Change Password
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={handleReset}
          style={styles.button}
        >
          Update Password
        </button>

        <p style={styles.message}>
          {message}
        </p>

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to bottom right,#020617,#111827)",
  },

  card: {
    width: "350px",
    background: "#111827",
    padding: "30px",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    color: "white",
    textAlign: "center",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
  },

  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  message: {
    color: "#22c55e",
    textAlign: "center",
  },
};