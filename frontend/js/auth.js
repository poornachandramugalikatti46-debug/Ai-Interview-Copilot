const API = window.location.origin;

function switchTab(tab) {
  document.getElementById("login-form").style.display = tab === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = tab === "register" ? "block" : "none";
  document.getElementById("tab-login").classList.toggle("active", tab === "login");
  document.getElementById("tab-register").classList.toggle("active", tab === "register");
  clearAlert();
}

function showAlert(msg, type = "error") {
  document.getElementById("alert-box").innerHTML =
    `<div class="alert alert-${type}">${msg}</div>`;
}

function clearAlert() {
  document.getElementById("alert-box").innerHTML = "";
}

function redirectByRole(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("admin") || r.includes("analyst") || r.includes("manager")) {
    window.location.href = "analytics.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-pass").value;
  if (!email || !password) return showAlert("Fill in all fields");

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return showAlert(data.detail || data.message || data.error || "Login failed.");

    // FIX: backend returns "token" not "access_token"
    const token = data.token || data.access_token;
    if (!token) return showAlert("Login failed. No token returned.");

    localStorage.setItem("token", token);
    localStorage.setItem("userName", data.user?.name || "");
    localStorage.setItem("userEmail", data.user?.email || "");
    localStorage.setItem("userRole", data.user?.role || "");
    redirectByRole(data.user?.role);
  } catch (e) {
    showAlert("Server error. Make sure backend is running.");
  }
}

async function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value;
  const role = document.getElementById("reg-role").value;
  const experience = document.getElementById("reg-exp").value || "0";
  if (!name || !email || !password) return showAlert("Fill in all fields");

  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, experience })
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data.detail || data.message || data.error || "Registration failed.";
      if (/email already registered/i.test(message)) {
        showAlert("Email already registered. Please log in instead.");
        switchTab("login");
        return;
      }
      return showAlert(message);
    }

    // FIX: backend returns "token" not "access_token"
    const token = data.token || data.access_token;
    if (!token) return showAlert("Registration failed. No token returned.");

    localStorage.setItem("token", token);
    localStorage.setItem("userName", data.user?.name || "");
    localStorage.setItem("userEmail", data.user?.email || "");
    localStorage.setItem("userRole", data.user?.role || "");
    redirectByRole(data.user?.role);
  } catch (e) {
    showAlert("Server error.");
  }
}

// Redirect if already logged in
if (localStorage.getItem("token") && window.location.pathname.includes("index")) {
  redirectByRole(localStorage.getItem("userRole"));
}