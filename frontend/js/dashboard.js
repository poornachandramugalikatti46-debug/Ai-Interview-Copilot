const API = window.location.origin;
const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("userEmail");
const userName = localStorage.getItem("userName");
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

// ── TOAST NOTIFICATION (was missing!) ────────────────────────────
function toast(msg, type = 'ok') {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    t.style.cssText = `
      position:fixed;bottom:28px;right:28px;z-index:9999;
      padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;
      box-shadow:0 4px 24px rgba(0,0,0,0.25);transition:opacity 0.3s;
      pointer-events:none;opacity:0;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = type === 'ok' ? '#00c97e' : '#ff4757';
  t.style.color = '#fff';
  t.style.opacity = '1';
  clearTimeout(t._hide);
  t._hide = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// ── CENTRAL API HELPER (was missing!) ────────────────────────  
async function api(path, options = {}) {
  const res = await fetch(`${API}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    throw new Error("Session expired. Please log in again.");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || `Request failed (${res.status})`);
  return data;
}

let chatHistory = [];
let currentUser = null;

// ── PAGE NAVIGATION ───────────────────────────────────────────
function showPage(pageId, el) {
  document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
  const page = document.getElementById('page-' + pageId);
  if (page) page.style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

// Load profile & stats on page load
window.onload = async () => {
  document.title = `Dashboard — ${userName || ''} — AI Interview Copilot`;
  document.getElementById("welcome-msg").textContent = `Welcome back, ${userName}! 👋`;

  try {
    document.querySelectorAll('.navbar nav a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href')?.includes('dashboard')));
  } catch (e) {}

  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (handleAuthResponse(res)) return;
    const user = await res.json();
    if (res.ok) {
      currentUser = user.user;
      document.getElementById("user-role").textContent =
        `${currentUser.role || "Developer"} · ${currentUser.experience || "0"} yrs experience`;
      document.getElementById("stat-level").textContent =
        parseInt(currentUser.experience) > 0 ? "Experienced" : "Fresher";
    }
  } catch (e) {}

  loadAnalytics();
};

async function loadAnalytics() {
  try {
    const headers = { "Authorization": `Bearer ${token}` };
    const [summaryRes, sessionsRes] = await Promise.all([
      fetch(`${API}/api/analytics/summary`, { headers }),
      fetch(`${API}/api/interview/sessions`, { headers })
    ]);
    if (handleAuthResponse(summaryRes) || handleAuthResponse(sessionsRes)) return;

    const summary = await summaryRes.json();
    const sessionsData = await sessionsRes.json();

    document.getElementById("stat-total").textContent = summary.total || 0;
    document.getElementById("stat-avg").textContent = summary.avg_score || 0;
    if (!currentUser) document.getElementById("stat-level").textContent = "—";

    const container = document.getElementById("recent-answers");
    const sessions = sessionsData.sessions || [];
    if (sessions.length === 0) {
      container.innerHTML = `<p class="text-muted">No answers yet. Start practicing!</p>`;
      return;
    }
    container.innerHTML = sessions.slice(-5).map(s => `
      <div style="padding:0.8rem;border-bottom:1px solid var(--border)">
        <div style="font-size:0.85rem;color:var(--muted)">${s.questions?.[0] || "Recent session"}</div>
        <div class="flex gap-2 items-center mt-1">
          <span class="score-badge ${s.avg_score >= 7 ? 'score-high' : s.avg_score >= 4 ? 'score-mid' : 'score-low'}">
            ${s.avg_score || 0}/10
          </span>
          <span style="font-size:0.85rem;color:var(--muted)">Saved on ${new Date(s.created_at).toLocaleDateString()}</span>
        </div>
      </div>`).join("");
  } catch (e) {
    document.getElementById("recent-answers").innerHTML = `<p class="text-muted">Unable to load analytics.</p>`;
  }
}

async function uploadResume() {
  const file = document.getElementById("resume-file").files[0];
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", file);

  const container = document.getElementById("resume-questions");
  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const uploadRes = await fetch(`${API}/api/resume/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.detail || uploadData.message || "Unable to upload resume.");

    const questionRes = await fetch(`${API}/api/resume/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ resume_text: uploadData.text })
    });
    const questionData = await questionRes.json();
    if (!questionRes.ok) throw new Error(questionData.detail || questionData.message || "Unable to generate questions.");

    container.innerHTML = `<div class="section-title mt-2">Generated Questions:</div>` +
      questionData.questions.map((q, i) => `
        <div class="question-item mt-1">
          <span class="q-num">${i + 1}</span> ${q.question || q}
        </div>`).join("");
  } catch (e) {
    container.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`;
  }
}

function openChat() {
  document.getElementById("chat-modal").style.display = "block";
  if (document.getElementById("chat-box").children.length === 0) {
    addChatMsg("ai", "Hi! I'm your AI Interview Coach 🤖 Ask me anything about interviews, technical concepts, or career tips!");
  }
}

function closeChat() { document.getElementById("chat-modal").style.display = "none"; }

function addChatMsg(role, text) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function sendChat() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  addChatMsg("user", msg);
  chatHistory.push({ role: "user", content: msg });
  addChatMsg("ai", "⏳ Thinking...");
  try {
    const res = await fetch(`${API}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ message: msg, user_id: userEmail })
    });
    if (handleAuthResponse(res)) return;
    const data = await res.json();
    document.getElementById("chat-box").lastChild.textContent = data.reply;
    chatHistory.push({ role: "assistant", content: data.reply });
  } catch (e) {
    document.getElementById("chat-box").lastChild.textContent = "Error connecting to AI.";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ── RESUME TOOLS ──────────────────────────────────────────────

function showTool(name) {
  document.getElementById('toolsHome').style.display = name === 'home' ? 'grid' : 'none';
  ['ats', 'keywords', 'builder'].forEach(t => {
    const el = document.getElementById(`tool-${t}`);
    if (el) el.style.display = t === name ? 'block' : 'none';
  });
}

// ── ATS Score ─────────────────────────────────────────────────

async function extractPdfForAts(e) {
  const file = e.target.files[0];
  if (!file) return;
  const fd = new FormData();
  fd.append('file', file);
  try {
    // FIX: was missing /api prefix and used wrong auth.token
    const res = await fetch(`${API}/api/resume/extract-text`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: fd
    });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    document.getElementById('atsResumeTxt').value = data.text;
    toast('PDF extracted ✅', 'ok');
  } catch (e) {
    toast('PDF extraction failed: ' + e.message, 'err');
  }
}

async function runAtsCheck() {
  const resumeText = document.getElementById('atsResumeTxt').value.trim();
  const jd = document.getElementById('atsJdTxt').value.trim();
  if (!resumeText) { toast('Paste your resume text', 'err'); return; }
  if (!jd) { toast('Paste the job description', 'err'); return; }
  const btn = document.getElementById('atsBtn');
  btn.innerHTML = '<span class="spinner"></span> Analyzing...';
  btn.disabled = true;
  try {
    // FIX: api() helper now defined above
    const data = await api('/resume/ats-score', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText, job_description: jd })
    });
    showAtsResults(data);
    toast('ATS analysis complete ✅', 'ok');
  } catch (e) {
    toast('ATS check failed: ' + e.message, 'err');
  } finally {
    btn.innerHTML = '🔍 Check ATS Score';
    btn.disabled = false;
  }
}

function showAtsResults(data) {
  document.getElementById('atsResults').style.display = 'block';
  document.getElementById('atsResults').scrollIntoView({ behavior: 'smooth' });

  const score = data.ats_score || 0;
  const circumference = 2 * Math.PI * 18;
  const offset = (score / 100) * circumference;
  const circle = document.getElementById('atsRingCircle');
  const scoreColor = score >= 70 ? '#00f5a0' : score >= 50 ? '#ffa502' : '#ff4757';
  circle.setAttribute('stroke', scoreColor);
  setTimeout(() => circle.setAttribute('stroke-dasharray', `${offset} ${circumference}`), 100);
  document.getElementById('atsScoreNum').textContent = score;
  document.getElementById('atsScoreNum').style.color = scoreColor;

  const verdictEl = document.getElementById('atsVerdict');
  verdictEl.textContent = data.verdict;
  verdictEl.className = 'ats-verdict ' + (
    data.verdict?.includes('Strong') ? 'verdict-strong' :
    data.verdict?.includes('Good') ? 'verdict-good' :
    data.verdict?.includes('Needs') ? 'verdict-needs' : 'verdict-poor'
  );

  setTimeout(() => {
    [['barKw', data.keyword_match_percent], ['barFmt', data.format_score],
     ['barExp', data.experience_match], ['barSkill', data.skills_match]
    ].forEach(([id, val]) => {
      document.getElementById(id).style.width = (val || 0) + '%';
      document.getElementById(id + 'Val').textContent = (val || 0) + '%';
    });
  }, 200);

  document.getElementById('atsMatched').innerHTML =
    (data.matched_keywords || []).map(k => `<span class="kw-tag kw-present">${k}</span>`).join('');
  document.getElementById('atsMissing').innerHTML =
    (data.missing_keywords || []).map(k => `<span class="kw-tag kw-missing">${k}</span>`).join('');
  document.getElementById('atsSuggestions').innerHTML =
    (data.suggestions || []).map(s => `
      <div style="background:var(--bg2);border-radius:var(--r);padding:12px 16px;margin-bottom:8px;
                  border-left:3px solid var(--accent2);font-size:14px;color:var(--text2)">
        💡 ${s}
      </div>`).join('');
}

// ── Keyword Gap ───────────────────────────────────────────────

async function runKeywordGap() {
  const resumeText = document.getElementById('kwResumeTxt').value.trim();
  const jd = document.getElementById('kwJdTxt').value.trim();
  if (!resumeText || !jd) { toast('Fill in both fields', 'err'); return; }
  const btn = document.getElementById('kwBtn');
  btn.innerHTML = '<span class="spinner"></span> Analyzing...';
  btn.disabled = true;
  try {
    const data = await api('/resume/keyword-gap', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText, job_description: jd })
    });
    showKeywordResults(data);
    toast('Analysis complete ✅', 'ok');
  } catch (e) {
    toast('Analysis failed: ' + e.message, 'err');
  } finally {
    btn.innerHTML = '🔍 Analyze Keyword Gap';
    btn.disabled = false;
  }
}

function showKeywordResults(data) {
  document.getElementById('kwResults').style.display = 'block';
  document.getElementById('kwResults').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('kwGapScore').textContent = data.gap_score || 0;
  document.getElementById('kwMatchCount').textContent = data.matched_count || 0;
  document.getElementById('kwTotalCount').textContent = data.total_jd_keywords || 0;

  document.getElementById('kwCritical').innerHTML =
    (data.critical_missing || []).map(k => `
      <div class="gap-item">
        <div class="gap-item-kw">${k.keyword}
          <span style="font-size:11px;background:rgba(255,71,87,.15);color:var(--danger);
                       padding:2px 8px;border-radius:100px;font-weight:600">${k.importance}</span>
        </div>
        <div class="gap-item-ctx">${k.context}</div>
      </div>`).join('') || '<p style="color:var(--muted);font-size:14px">No critical gaps! 🎉</p>';

  document.getElementById('kwNiceToHave').innerHTML =
    (data.nice_to_have_missing || []).map(k => `
      <div class="gap-item medium">
        <div class="gap-item-kw">${k.keyword}</div>
        <div class="gap-item-ctx">${k.context}</div>
      </div>`).join('') || '<p style="color:var(--muted);font-size:14px">No medium gaps!</p>';

  document.getElementById('kwPresent').innerHTML =
    (data.present_keywords || []).map(k => `<span class="kw-tag kw-present">${k}</span>`).join('');
  document.getElementById('kwTopRec').textContent = data.top_recommendation || '';
}

// ── AI Resume Builder ─────────────────────────────────────────

function switchBuilderTab(el, sectionId) {
  document.querySelectorAll('.btab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.builder-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(sectionId).classList.add('active');
}

async function generateAiResume() {
  const name = document.getElementById('bName').value.trim();
  const role = document.getElementById('bRole').value.trim();
  if (!name || !role) { toast('Fill in name and role', 'err'); return; }

  const payload = {
    name, role,
    experience:   document.getElementById('bExp').value,
    skills:       document.getElementById('bSkills').value,
    work_history: document.getElementById('bWorkHistory').value,
    education:    document.getElementById('bEducation').value,
    projects:     document.getElementById('bProjects').value,
    achievements: document.getElementById('bAchievements').value,
    target_job:   document.getElementById('bTargetJob').value,
  };

  const btn = document.querySelector('#bEdu .btn-primary');
  btn.innerHTML = '<span class="spinner"></span> Generating...';
  btn.disabled = true;

  try {
    const data = await api('/resume/build-resume', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    window._builtResume = { ...payload, ...data };
    renderResumePreview(window._builtResume, payload.name, payload.target_job || payload.role);
    switchBuilderTab(document.querySelectorAll('.btab')[3], 'bPreview');
    toast('Resume generated! 🎉', 'ok');
  } catch (e) {
    toast('Failed: ' + e.message, 'err');
  } finally {
    btn.innerHTML = '✨ Generate AI Resume';
    btn.disabled = false;
  }
}

function renderResumePreview(data, name, role) {
  const skills = (data.skills || []).map(s => `<span class="rp-skill">${s}</span>`).join('');
  const exp = (data.experience || []).map(e => `
    <div class="rp-job">
      <div class="rp-job-header">
        <div><div class="rp-job-title">${e.role}</div><div class="rp-job-company">${e.company}</div></div>
        <div class="rp-job-dur">${e.duration}</div>
      </div>
      <ul>${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
    </div>`).join('');
  const edu = (data.education || []).map(e => `
    <div style="margin-bottom:8px">
      <div style="font-weight:700;font-size:14px">${e.degree}</div>
      <div style="font-size:13px;color:#555">${e.institution} • ${e.year}</div>
    </div>`).join('');
  const proj = (data.projects || []).map(p => `
    <div class="rp-proj">
      <div class="rp-proj-name">${p.name}</div>
      <div class="rp-proj-tech">${p.technologies}</div>
      <div class="rp-proj-desc">${p.description}</div>
    </div>`).join('');
  const certs = data.certifications?.length
    ? `<div class="rp-section"><h3>Certifications</h3>
        ${data.certifications.map(c => `<div style="font-size:13px;color:#444;margin-bottom:4px">• ${c}</div>`).join('')}
       </div>` : '';

  document.getElementById('resumePreviewWrap').innerHTML = `
    <div class="resume-preview" id="resumePreview">
      <div class="rp-name">${name}</div>
      <div class="rp-role">${role}</div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:20px"/>
      ${data.summary ? `<div class="rp-section"><h3>Professional Summary</h3><div class="rp-summary">${data.summary}</div></div>` : ''}
      ${skills ? `<div class="rp-section"><h3>Skills</h3><div class="rp-skills">${skills}</div></div>` : ''}
      ${exp ? `<div class="rp-section"><h3>Work Experience</h3>${exp}</div>` : ''}
      ${proj ? `<div class="rp-section"><h3>Projects</h3>${proj}</div>` : ''}
      ${edu ? `<div class="rp-section"><h3>Education</h3>${edu}</div>` : ''}
      ${certs}
    </div>`;
}

// ── PDF Export ────────────────────────────────────────────────

function exportToPdf() {
  const el = document.getElementById('resumePreview');
  if (!el) { toast('Generate a resume first!', 'err'); return; }
  const btn = document.getElementById('exportBtn');
  btn.innerHTML = '<span class="spinner"></span> Exporting...';
  btn.disabled = true;

  const style = `<style>
    body{font-family:'DM Sans',Arial,sans-serif;margin:40px;color:#111;line-height:1.6}
    .rp-name{font-size:26px;font-weight:800;margin-bottom:4px}
    .rp-role{font-size:15px;color:#555;margin-bottom:16px}
    .rp-section{margin-bottom:20px}
    .rp-section h3{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;
      color:#333;border-bottom:2px solid #00c97e;padding-bottom:4px;margin-bottom:12px}
    .rp-skills{display:flex;flex-wrap:wrap;gap:6px}
    .rp-skill{background:#f0fdf4;color:#059669;padding:3px 10px;border-radius:100px;
      font-size:12px;border:1px solid #a7f3d0}
    .rp-job{margin-bottom:14px}
    .rp-job-title{font-weight:700;font-size:14px}
    .rp-job-company{color:#555;font-size:13px}
    .rp-job-dur{font-size:12px;color:#888}
    ul{padding-left:18px} li{font-size:13px;color:#444;margin-bottom:3px}
    .rp-proj-name{font-weight:700;font-size:14px}
    .rp-proj-tech{font-size:12px;color:#059669;margin-bottom:4px}
    .rp-proj-desc{font-size:13px;color:#444}
  </style>`;

  const win = window.open('', '_blank');
  if (!win) { toast('Allow popups to export PDF', 'err'); btn.innerHTML = '📄 Export as PDF'; btn.disabled = false; return; }
  win.document.write(`<!DOCTYPE html><html><head><title>Resume - ${el.querySelector('.rp-name')?.textContent || 'Resume'}</title>${style}</head><body>${el.innerHTML}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    btn.innerHTML = '📄 Export as PDF';
    btn.disabled = false;
  }, 600);
}