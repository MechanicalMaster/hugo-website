/**
 * AI Chat Widget for Hugo PaperMod theme
 * Responsive, modern, and matches PaperMod's minimalist style.
 * Character card and pre-built bubbles included.
 * Requires: Cloudflare Worker endpoint at /api/chat
 */
(function () {
  // Character card info
  const avatarUrl = "/images/ai-agents-cover.jpg"; // You can change this to your preferred avatar
  const name = "Ronak Sethiya";
  const subtitle = "Product Manager | AI Maximalist";
  const description = "7+ years in digital product management, banking, and engineering. Ask me about technology, AI, banking, or product management!";

  // Pre-built bubbles
  const prebuiltBubbles = [
    "Show me your latest project",
    "Share your CV highlights",
    "How can I contact you?"
  ];

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
  chatWindow.style.height = '480px';
  chatWindow.style.background = '#fff';
  chatWindow.style.border = 'none';
  chatWindow.style.borderRadius = '18px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.zIndex = '10000';
  chatWindow.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.transition = 'width 0.2s, height 0.2s';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.justifyContent = 'flex-start';
  document.body.appendChild(chatWindow);

  // Chat window content (with flexbox layout for all sections)
  chatWindow.innerHTML = `
    <div style="background:#222;color:#fff;padding:16px 20px;border-radius:18px 18px 0 0;display:flex;justify-content:space-between;align-items:center;flex:0 0 auto;">
      <span style="font-size:1.15rem;font-weight:600;">Chat with AI Ronak</span>
      <button id="ai-chat-close" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1;">×</button>
    </div>
    <div id="ai-chat-character" style="display:flex;align-items:center;gap:16px;padding:16px 20px 8px 20px;background:#fff;flex:0 0 auto;">
      <img src="${avatarUrl}" alt="Ronak Sethiya" style="width:48px;height:48px;border-radius:50%;border:2px solid #222;object-fit:cover;">
      <div>
        <div style="font-weight:600;font-size:1.05rem;color:#222;">${name}</div>
        <div style="font-size:0.98rem;color:#444;">${subtitle}</div>
        <div style="font-size:0.92rem;color:#666;margin-top:2px;">${description}</div>
      </div>
    </div>
    <div id="ai-chat-bubbles" style="display:flex;gap:8px;flex-wrap:wrap;padding:0 20px 8px 20px;flex:0 0 auto;">
      ${prebuiltBubbles.map(text => `<button class="ai-prebuilt-bubble" style="background:#f6f6f6;color:#222;border:none;border-radius:16px;padding:7px 16px;font-size:0.98rem;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.04);transition:background 0.2s;">${text}</button>`).join('')}
    </div>
    <div id="ai-chat-messages" style="flex:1 1 auto;overflow-y:auto;padding:16px 12px 12px 12px;background:#fafafa;min-height:0;"></div>
    <form id="ai-chat-form" style="display:flex;gap:8px;padding:12px 12px 16px 12px;border-top:1px solid #eee;background:#fff;flex:0 0 auto;">
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
        height: 65vh !important;
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
      #ai-chat-character img {
        width: 32px !important;
        height: 32px !important;
      }
      #ai-chat-character {
        gap: 8px !important;
        padding: 8px 6px 4px 6px !important;
      }
      #ai-chat-bubbles {
        padding: 0 6px 4px 6px !important;
      }
      #ai-chat-character div {
        font-size: 0.92rem !important;
      }
      .ai-prebuilt-bubble {
        font-size: 0.92rem !important;
        padding: 6px 10px !important;
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
    .ai-prebuilt-bubble:active, .ai-prebuilt-bubble:hover {
      background: #e0e0e0 !important;
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

  // Pre-built bubble click logic
  chatWindow.querySelectorAll('.ai-prebuilt-bubble').forEach(btn => {
    btn.onclick = () => {
      input.value = btn.textContent;
      form.dispatchEvent(new Event('submit'));
    };
  });

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
