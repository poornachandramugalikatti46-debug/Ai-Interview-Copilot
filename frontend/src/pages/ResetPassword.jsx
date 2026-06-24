import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          email,
          password,
        }
      );

      setMessage(res.data.message);

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {

      setMessage(
        err.response?.data?.message ||
        "Reset failed ❌"
      );

    }
  };

  return (
    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h1 style={styles.title}>
          Change Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
          required
        />

        <button
          type="submit"
          style={styles.button}
        >
          Update Password
        </button>

        <p>{message}</p>

      </form>

    </div>
  );
}

const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
  },

  form: {
    width: "350px",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    color: "white",
    textAlign: "center",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#10b981",
    color: "white",
    cursor: "pointer",
  },
};