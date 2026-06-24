const API = window.location.origin;
const token = localStorage.getItem("token");
const invalidToken = !token || token.trim() === "" || token.trim().toLowerCase() === "undefined" || token.trim().toLowerCase() === "null";
if (invalidToken) {
  localStorage.removeItem("token");
  window.location.href = 'index.html';
}

function handleAuthResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = 'index.html';
    return true;
  }
  return false;
}

let history = [];

// Detect emotion/sentiment from user input
function detectEmotion(text) {
  const lowerText = text.toLowerCase();
  
  const negativeKeywords = ['sad', 'angry', 'frustrated', 'confused', 'stuck', 'difficult', 'can\'t', 'cannot', 'help', 'struggling', 'lost', 'nervous', 'anxious', 'worried', 'disappointed'];
  const positiveKeywords = ['happy', 'great', 'excellent', 'good', 'amazing', 'love', 'thanks', 'thank you', 'appreciate', 'wonderful', 'confident'];
  
  let emotion = 'neutral';
  if (negativeKeywords.some(word => lowerText.includes(word))) emotion = 'negative';
  else if (positiveKeywords.some(word => lowerText.includes(word))) emotion = 'positive';
  
  return emotion;
}

function addBubble(text, role) {
  const msgContainer = document.getElementById('messages');
  const el = document.createElement('div');
  el.className = 'msg ' + role;
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + role;
  bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  if (role === 'user') {
    el.innerHTML = '<span class="avatar">👤</span>';
  } else {
    el.innerHTML = '<span class="avatar">🤖</span>';
  }
  
  el.appendChild(bubble);
  msgContainer.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth' });
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  if (!input) return;
  
  const text = input.value.trim();
  if (!text) return;

  // Detect user emotion
  const emotion = detectEmotion(text);

  addBubble(text, 'user');
  history.push({ role: 'user', content: text });
  input.value = '';

  addBubble('⏳ Thinking...', 'ai');

  try {
    const res = await fetch(`${API}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        message: text,        // ✅ FIXED: "message" (string) not "messages" (array)
        user_id: "default"    // ✅ FIXED: added user_id
      })
    });
    if (handleAuthResponse(res)) return;

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || 'Chat error');

    let reply = data.reply;
    
    // Add emotion-based suggestions
    if (emotion === 'negative') {
      reply += '\n\n💡 **Quick Tips:**\n- Take a deep breath - you\'re doing great!\n- Break the problem into smaller steps\n- Don\'t hesitate to ask for help\n- Practice makes perfect!';
    }

    const bubbles = document.querySelectorAll('.bubble.ai');
    bubbles[bubbles.length - 1].innerHTML = reply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    history.push({ role: 'assistant', content: reply });

    if (history.length > 30) history = history.slice(-30);
  } catch (e) {
    const bubbles = document.querySelectorAll('.bubble.ai');
    bubbles[bubbles.length - 1].textContent = '❌ Error: ' + e.message;
  }
}

function handleKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('userInput');
  if (input) {
    input.addEventListener('keydown', handleKey);
  }
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
});