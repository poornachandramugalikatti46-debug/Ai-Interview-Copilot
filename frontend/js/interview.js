const API = window.location.origin;
const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("userEmail");
const invalidToken = !token || token.trim() === "" || token.trim().toLowerCase() === "undefined" || token.trim().toLowerCase() === "null";
if (invalidToken) {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function handleAuthResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return true;
  }
  return false;
}

let questions = [];
let currentQ = -1;
let answeredCount = 0;
let currentEval = null;
let recognition = null;
let isListening = false;

async function generateInterview() {
  const role = document.getElementById("job-role").value;
  const experience = document.getElementById("exp-level").value;
  const question_type = document.getElementById("q-type").value;
  const num_questions = parseInt(document.getElementById("q-count").value);

  const button = document.querySelector("#config-panel button");
  button.innerHTML = `<span class="spinner"></span> Generating...`;
  button.disabled = true;

  try {
    const res = await fetch(`${API}/api/interview/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ role, experience, question_type, num_questions, company: "" })
    });
    if (handleAuthResponse(res)) return;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Unable to generate questions.");

    questions = data.questions || [];
    answeredCount = 0;
    renderQuestions();
    document.getElementById("interview-area").style.display = "block";
    document.getElementById("config-panel").style.display = "none";
  } catch (e) {
    alert(`Error generating questions: ${e.message}`);
  }

  button.innerHTML = "Generate Interview";
  button.disabled = false;
}

function renderQuestions() {
  const list = document.getElementById("question-list");
  list.innerHTML = questions.map((q, i) => {
    const text = q?.question || q || "Untitled question";
    return `
      <div class="question-item" id="qitem-${i}" onclick="selectQuestion(${i})">
        <span class="q-num">${i + 1}</span>
        ${text.length > 60 ? text.slice(0, 60) + "..." : text}
      </div>
    `;
  }).join("");
  updateProgress();
}

function selectQuestion(i) {
  currentQ = i;
  document.querySelectorAll(".question-item").forEach((el, idx) => {
    el.classList.toggle("active", idx === i);
  });
  const text = questions[i]?.question || questions[i] || "Select a question";
  document.getElementById("current-question").textContent = `Q${i + 1}: ${text}`;
  document.getElementById("user-answer").value = "";
  document.getElementById("eval-result").style.display = "none";
  document.getElementById("improved-section").style.display = "none";
  currentEval = null;
}

async function submitAnswer() {
  if (currentQ < 0) return alert("Select a question first");
  const answer = document.getElementById("user-answer").value.trim();
  if (!answer) return alert("Please type or speak your answer");

  const btn = document.activeElement;
  btn.innerHTML = `<span class="spinner"></span> Evaluating...`;
  btn.disabled = true;

  try {
    const role = document.getElementById("job-role").value;
    const experience = document.getElementById("exp-level").value;
    const question_type = document.getElementById("q-type").value;

    const questionText = questions[currentQ]?.question || questions[currentQ] || "";
    const res = await fetch(`${API}/api/interview/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        question: questionText,
        answer,
        question_type,
        experience,
        role
      })
    });
    if (handleAuthResponse(res)) return;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Evaluation failed.");

    currentEval = data.evaluation || data;
    const score = currentEval.score || 0;
    const badge = document.getElementById("score-badge");
    badge.textContent = `${score}/10`;
    badge.className = `score-badge ${score >= 7 ? "score-high" : score >= 4 ? "score-mid" : "score-low"}`;

    document.getElementById("feedback-text").textContent = currentEval.feedback || "";
    document.getElementById("improvement-text").textContent = currentEval.improvement || "";
    document.getElementById("eval-result").style.display = "block";
    document.getElementById("improved-section").style.display = "none";

    const qitem = document.getElementById(`qitem-${currentQ}`);
    if (!qitem.dataset.answered) {
      qitem.dataset.answered = "1";
      answeredCount++;
      updateProgress();
    }
    qitem.style.borderColor = score >= 7 ? "var(--success)" : score >= 4 ? "var(--warning)" : "var(--danger)";
  } catch (e) {
    alert(`Error evaluating answer: ${e.message}`);
  }

  btn.innerHTML = "Evaluate Answer";
  btn.disabled = false;
}

async function improveAnswer() {
  if (currentQ < 0) return alert("Select a question first");
  const answer = document.getElementById("user-answer").value.trim();
  if (!answer) return alert("Please type your answer first");

  const btn = document.activeElement;
  btn.innerHTML = `<span class="spinner"></span>`;
  btn.disabled = true;

  try {
    const role = document.getElementById("job-role").value;
    const experience = document.getElementById("exp-level").value;

    const questionText = questions[currentQ]?.question || questions[currentQ] || "";
    const res = await fetch(`${API}/api/interview/improve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ question: questionText, answer, role, experience })
    });
    if (handleAuthResponse(res)) return;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Improve failed.");

    document.getElementById("improved-text").textContent = data.improved_answer || data.answer || "";
    document.getElementById("improved-section").style.display = "block";
  } catch (e) {
    alert(`Error improving answer: ${e.message}`);
  }

  btn.innerHTML = "✨ Improve Answer";
  btn.disabled = false;
}

async function saveAnswer() {
  if (!currentEval) return;
  const answer = document.getElementById("user-answer").value.trim();
  const role = document.getElementById("job-role").value;
  const experience = document.getElementById("exp-level").value;
  const question_type = document.getElementById("q-type").value;

  try {
    const res = await fetch(`${API}/api/interview/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        role,
        question_type,
        mode: "practice",
        experience,
        company: "",
        num_questions: questions.length,
        avg_score: currentEval.score || 0,
        questions: questions.map(q => q?.question || q),
        answers: { [currentQ]: answer },
        evaluations: { [currentQ]: currentEval }
      })
    });
    if (handleAuthResponse(res)) return;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Save failed.");
    alert("Answer saved! ✅");
  } catch (e) {
    alert(`Error saving: ${e.message}`);
  }
}

function updateProgress() {
  const total = questions.length;
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  document.getElementById("progress-label").textContent = `${answeredCount} / ${total} answered`;
  document.getElementById("progress-pct").textContent = `${pct}%`;
  document.getElementById("progress-bar").style.width = `${pct}%`;
}

function resetInterview() {
  questions = [];
  currentQ = -1;
  answeredCount = 0;
  document.getElementById("interview-area").style.display = "none";
  document.getElementById("config-panel").style.display = "block";
}

// ── Voice Input ──────────────────────────────────────────────────────────────

function toggleVoice() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    return alert("Speech recognition not supported in this browser. Use Chrome.");
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isListening = true;
    document.getElementById("voice-btn").textContent = "🔴 Stop Recording";
    document.getElementById("voice-status").textContent = "Listening...";
  };

  recognition.onresult = (e) => {
    let final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
    }
    if (final) {
      document.getElementById("user-answer").value += " " + final;
    }
  };

  recognition.onend = () => {
    isListening = false;
    document.getElementById("voice-btn").textContent = "🎙️ Voice Input";
    document.getElementById("voice-status").textContent = "";
  };

  recognition.start();
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
