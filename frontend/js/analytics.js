const API = window.location.origin;
const token = localStorage.getItem("token");
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

let scoreChart = null;

window.onload = async () => {
  // personalize title and nav
  const userName = localStorage.getItem('userName') || '';
  document.title = `Analytics — ${userName} — AI Interview Copilot`;
  try {
    document.querySelectorAll('.navbar nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href')?.includes('analytics')));
    const bc = document.getElementById('page-breadcrumb');
    if (bc) bc.textContent = `Home › Analytics`;
  } catch (e) {}

  try {
    const headers = { "Authorization": `Bearer ${token}` };
    const [summaryRes, sessionsRes] = await Promise.all([
      fetch(`${API}/api/analytics/summary`, { headers }),
      fetch(`${API}/api/interview/sessions`, { headers })
    ]);
    if (handleAuthResponse(summaryRes) || handleAuthResponse(sessionsRes)) return;

    const summary = await summaryRes.json();
    const sessionsData = await sessionsRes.json();
    const sessions = sessionsData.sessions || [];

    document.getElementById("a-total").textContent = summary.total || 0;
    document.getElementById("a-avg").textContent = summary.avg_score || 0;
    document.getElementById("a-best").textContent = summary.best_score || "—";

    const labels = sessions.map((s, i) => `Session ${i + 1}`);
    const scores = sessions.map(s => s.avg_score || 0);

    const ctx = document.getElementById("score-chart").getContext("2d");
    if (scoreChart) scoreChart.destroy();
    scoreChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Score (out of 10)",
          data: scores,
          borderColor: "#6C63FF",
          backgroundColor: "rgba(108,99,255,0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#6C63FF",
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#e0e0ff" } } },
        scales: {
          x: { ticks: { color: "#8888aa" }, grid: { color: "#2a2a4a" } },
          y: { min: 0, max: 10, ticks: { color: "#8888aa" }, grid: { color: "#2a2a4a" } }
        }
      }
    });

    const table = document.getElementById("history-table");
    if (!sessions.length) {
      table.innerHTML = `<p class="text-muted">No answers saved yet. Practice and save answers!</p>`;
      return;
    }
    table.innerHTML = sessions.slice(-8).map(h => `
      <div style="padding:1rem 0;border-bottom:1px solid var(--border)">
        <div style="font-size:0.9rem;font-weight:600;margin-bottom:0.4rem">${h.questions?.[0] || "Recent session"}</div>
        <div class="flex gap-2 items-center flex-wrap">
          <span class="score-badge ${h.avg_score >= 7 ? 'score-high' : h.avg_score >= 4 ? 'score-mid' : 'score-low'}">
            ${h.avg_score || 0}/10
          </span>
          <span class="text-muted" style="font-size:0.85rem">${new Date(h.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join("");
  } catch (e) {
    document.getElementById("history-table").innerHTML = `<p class="text-muted">Error loading analytics.</p>`;
  }
};

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
