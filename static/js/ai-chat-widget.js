/**
 * AI Chat Widget for Hugo PaperMod theme
 * Responsive, modern, and matches PaperMod's minimalist style.
 * Requires: Cloudflare Worker endpoint at /api/chat
 */
(function () {
  // Create chat bubble button with custom SVG
  const bubble = document.createElement('div');
  bubble.id = 'ai-chat-bubble';
  bubble.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#222"/>
      <path d="M12 15a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2a6 6 0 0 1-6 6h-1.5l-3.5 3v-3a6 6 0 0 1-1-3v-2z" fill="#fff"/>
      <circle cx="16" cy="18" r="1" fill="#222"/>
      <circle cx="18" cy="18" r="1" fill="#222"/>
      <circle cx="20" cy="18" r="1" fill="#222"/>
    </svg>
  `;
  bubble.style.position = 'fixed';
  bubble.style.bottom = '24px';
  bubble.style.right = '24px';
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  bubble.style.background = 'transparent';
  bubble.style.border = 'none';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '9999';
  bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
  bubble.style.transition = 'transform 0.1s';
  bubble.onmouseover = () => bubble.style.transform = 'scale(1.08)';
  bubble.onmouseout = () => bubble.style.transform = 'scale(1)';
  document.body.appendChild(bubble);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'ai-chat-window';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '90px';
  chatWindow.style.right = '24px';
  chatWindow.style.width = '340px';
  chatWindow.style.maxWidth = '95vw';
  chatWindow.style.height = '420px';
  chatWindow.style.background = '#fff';
  chatWindow.style.border = 'none';
  chatWindow.style.borderRadius = '18px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.zIndex = '10000';
  chatWindow.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.transition = 'width 0.2s, height 0.2s';
  document.body.appendChild(chatWindow);

  // Chat window content
  chatWindow.innerHTML = `
    <div style="background:#222;color:#fff;padding:16px 20px;border-radius:18px 18px 0 0;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:1.15rem;font-weight:600;">Chat with AI Ronak</span>
      <button id="ai-chat-close" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1;">×</button>
    </div>
    <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:16px 12px 12px 12px;background:#fafafa;"></div>
    <form id="ai-chat-form" style="display:flex;gap:8px;padding:12px 12px 16px 12px;border-top:1px solid #eee;background:#fff;">
      <input id="ai-chat-input" type="text" placeholder="Type your message..." style="flex:1;padding:12px 14px;border-radius:10px;border:1.5px solid #e0e0e0;font-size:1rem;background:#f6f6f6;outline:none;transition:border 0.2s;">
      <button type="submit" style="padding:0 22px;height:44px;border-radius:10px;border:none;background:#222;color:#fff;font-size:1rem;font-weight:500;cursor:pointer;transition:background 0.2s;">Send</button>
    </form>
  `;

  // Responsive adjustments
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 600px) {
      #ai-chat-window {
        width: 98vw !important;
        height: 60vh !important;
        right: 1vw !important;
        bottom: 80px !important;
        border-radius: 12px !important;
      }
      #ai-chat-bubble {
        width: 48px !important;
        height: 48px !important;
        right: 12px !important;
        bottom: 12px !important;
      }
      #ai-chat-window form button {
        font-size: 0.95rem !important;
        height: 38px !important;
        padding: 0 12px !important;
      }
      #ai-chat-window form input {
        font-size: 0.95rem !important;
        padding: 10px 10px !important;
      }
    }
    #ai-chat-window form button:active {
      background: #444 !important;
    }
    #ai-chat-window form button:hover {
      background: #444 !important;
    }
    #ai-chat-window form input:focus {
      border: 1.5px solid #222 !important;
    }
  `;
  document.head.appendChild(style);

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
    msg.style.margin = '10px 0';
    msg.style.textAlign = role === 'user' ? 'right' : 'left';
    msg.innerHTML = `<span style="
      display:inline-block;
      padding:10px 16px;
      border-radius:16px;
      background:${role === 'user' ? '#222' : '#ededed'};
      color:${role === 'user' ? '#fff' : '#222'};
      font-size:1rem;
      max-width:85vw;
      word-break:break-word;
      box-shadow:0 1px 4px rgba(0,0,0,0.04);
      ">
      ${text}
    </span>`;
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
