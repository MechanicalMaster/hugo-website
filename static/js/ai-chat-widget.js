/**
 * Simple AI Chat Widget for Hugo static site
 * Requires: Cloudflare Worker endpoint at /api/chat
 */
(function () {
  // Create chat bubble button
  const bubble = document.createElement('div');
  bubble.id = 'ai-chat-bubble';
  bubble.innerHTML = '💬';
  bubble.style.position = 'fixed';
  bubble.style.bottom = '24px';
  bubble.style.right = '24px';
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  bubble.style.background = '#222';
  bubble.style.color = '#fff';
  bubble.style.borderRadius = '50%';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.fontSize = '2rem';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '9999';
  bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  document.body.appendChild(bubble);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'ai-chat-window';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '90px';
  chatWindow.style.right = '24px';
  chatWindow.style.width = '320px';
  chatWindow.style.maxWidth = '90vw';
  chatWindow.style.height = '400px';
  chatWindow.style.background = '#fff';
  chatWindow.style.border = '1px solid #ccc';
  chatWindow.style.borderRadius = '12px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.zIndex = '10000';
  chatWindow.style.boxShadow = '0 2px 16px rgba(0,0,0,0.25)';
  document.body.appendChild(chatWindow);

  // Chat window content
  chatWindow.innerHTML = `
    <div style="background:#222;color:#fff;padding:12px 16px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;">
      <span>Chat with AI Ronak</span>
      <button id="ai-chat-close" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">×</button>
    </div>
    <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:12px;background:#f9f9f9;"></div>
    <form id="ai-chat-form" style="display:flex;padding:8px;border-top:1px solid #eee;">
      <input id="ai-chat-input" type="text" placeholder="Type your message..." style="flex:1;padding:8px;border-radius:6px;border:1px solid #ccc;font-size:1rem;">
      <button type="submit" style="margin-left:8px;padding:8px 12px;border-radius:6px;border:none;background:#222;color:#fff;cursor:pointer;">Send</button>
    </form>
  `;

  // Show/hide chat window
  bubble.onclick = () => {
    chatWindow.style.display = 'flex';
    bubble.style.display = 'none';
  };
  chatWindow.querySelector('#ai-chat-close').onclick = () => {
    chatWindow.style.display = 'none';
    bubble.style.display = 'flex';
  };

  // Chat logic
  const messagesDiv = chatWindow.querySelector('#ai-chat-messages');
  const form = chatWindow.querySelector('#ai-chat-form');
  const input = chatWindow.querySelector('#ai-chat-input');
  let history = [];

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.style.margin = '8px 0';
    msg.style.textAlign = role === 'user' ? 'right' : 'left';
    msg.innerHTML = `<span style="display:inline-block;padding:8px 12px;border-radius:8px;background:${role === 'user' ? '#d1e7dd' : '#eee'};max-width:80%;word-break:break-word;">${text}</span>`;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    appendMessage('user', userMsg);
    history.push({ role: 'user', content: userMsg });
    input.value = '';
    appendMessage('ai', '...');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });
      const data = await res.json();
      messagesDiv.lastChild.remove(); // remove '...'
      if (data.reply) {
        appendMessage('ai', data.reply);
        history.push({ role: 'assistant', content: data.reply });
      } else if (data.error) {
        appendMessage('ai', "Error: " + (typeof data.error === "string" ? data.error : JSON.stringify(data.error)));
      } else {
        appendMessage('ai', 'Sorry, there was an unknown error.');
      }
    } catch (err) {
      messagesDiv.lastChild.remove();
      appendMessage('ai', 'Sorry, there was an error.');
    }
  };
})();
