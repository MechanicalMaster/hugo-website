/**
 * AI Chat Widget for Hugo PaperMod theme
 * Responsive, modern, and matches PaperMod's minimalist style.
 * Now includes pre-made prompt cards, improved UX, and animated callout for the chat bubble.
 * Requires: Cloudflare Worker endpoint at /api/chat
 */
(function () {
  // Pre-made prompt cards
  const promptCards = [
    "Show me your latest project",
    "What are your skills?",
    "Tell me about your banking experience"
  ];

  // Create chat bubble button with custom SVG
  const bubble = document.createElement('div');
  bubble.id = 'ai-chat-bubble';
  // Detect theme (light/dark) using prefers-color-scheme and PaperMod class
  function getTheme() {
    if (document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  let theme = getTheme();

  function setBubbleGradient() {
    if (theme === 'dark') {
      bubble.style.background = 'linear-gradient(135deg, #222 60%, #333 100%)';
    } else {
      bubble.style.background = 'linear-gradient(135deg, #fff 60%, #ededed 100%)';
    }
  }
  setBubbleGradient();

  // Listen for theme changes (PaperMod or OS)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    theme = getTheme();
    setBubbleGradient();
    updateSVGColors();
  });
  const observer = new MutationObserver(() => {
    const newTheme = getTheme();
    if (newTheme !== theme) {
      theme = newTheme;
      setBubbleGradient();
      updateSVGColors();
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // SVG with animatable dots
  bubble.innerHTML = `
    <svg id="ai-bubble-svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle id="bubble-bg" cx="18" cy="18" r="18"/>
      <path id="bubble-path" d="M12 15a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2a6 6 0 0 1-6 6h-1.5l-3.5 3v-3a6 6 0 0 1-1-3v-2z"/>
      <circle class="bubble-dot" cx="16" cy="18" r="1"/>
      <circle class="bubble-dot" cx="18" cy="18" r="1"/>
      <circle class="bubble-dot" cx="20" cy="18" r="1"/>
    </svg>
  `;
  function updateSVGColors() {
    const svg = bubble.querySelector('#ai-bubble-svg');
    if (!svg) return;
    svg.querySelector('#bubble-bg').setAttribute('fill', theme === 'dark' ? '#222' : '#fff');
    svg.querySelector('#bubble-path').setAttribute('fill', theme === 'dark' ? '#fff' : '#222');
    svg.querySelectorAll('.bubble-dot').forEach(dot => {
      dot.setAttribute('fill', theme === 'dark' ? '#222' : '#444');
    });
  }
  updateSVGColors();

  bubble.style.position = 'fixed';
  bubble.style.bottom = '24px';
  bubble.style.right = '24px';
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  // background set by setBubbleGradient()
  bubble.style.border = 'none';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '9999';
  bubble.style.boxShadow = '0 2px 12px rgba(34,34,34,0.18)';
  bubble.style.transition = 'transform 0.1s, box-shadow 0.2s, background 0.3s';

  // Add pulse animation and tooltip for first-time users
  const hasInteracted = localStorage.getItem('aiChatBubbleInteracted');
  if (!hasInteracted) {
    bubble.classList.add('ai-chat-bubble-pulse');
    // Animated tooltip phrases
    const tooltipPhrases = [
      "Ask me about my projects!",
      "Got a question?",
      "Let’s chat!",
      "Try a prompt below!"
    ];
    let tooltipIndex = 0;
    const tooltip = document.createElement('div');
    tooltip.id = 'ai-chat-bubble-tooltip';
    tooltip.innerText = tooltipPhrases[0];
    tooltip.style.position = 'absolute';
    tooltip.style.bottom = '64px';
    tooltip.style.right = '0';
    tooltip.style.background = '#222';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '7px 16px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontSize = '1rem';
    tooltip.style.fontWeight = '500';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.zIndex = '10000';
    tooltip.style.opacity = '0.96';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transition = 'opacity 0.3s';
    bubble.appendChild(tooltip);

    // Cycle phrases every 5s with fade
    let tooltipInterval = setInterval(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        tooltipIndex = (tooltipIndex + 1) % tooltipPhrases.length;
        tooltip.innerText = tooltipPhrases[tooltipIndex];
        tooltip.style.opacity = '0.96';
      }, 300);
    }, 5000);

    // Remove tooltip and animation after interaction
    bubble.addEventListener('click', () => {
      clearInterval(tooltipInterval);
      tooltip.remove();
    }, { once: true });
  }
  bubble.onmouseover = () => {
    bubble.style.transform = 'scale(1.08)';
    bubble.style.boxShadow = '0 4px 24px 0 rgba(34,34,34,0.28)';
    // Optionally shift SVG color
    const svg = bubble.querySelector('#ai-bubble-svg');
    if (svg) svg.querySelector('#bubble-bg').setAttribute('fill', theme === 'dark' ? '#333' : '#ededed');
  };
  bubble.onmouseout = () => {
    bubble.style.transform = 'scale(1)';
    bubble.style.boxShadow = '0 2px 12px rgba(34,34,34,0.18)';
    updateSVGColors();
  };
  document.body.appendChild(bubble);

  // Add pulse and dot animation CSS
  const styleEnh = document.createElement('style');
  styleEnh.innerHTML = `
    .ai-chat-bubble-pulse {
      animation: ai-bubble-pulse 1.6s infinite;
    }
    @keyframes ai-bubble-pulse {
      0% { box-shadow: 0 0 0 0 rgba(34,34,34,0.18); }
      70% { box-shadow: 0 0 0 12px rgba(34,34,34,0.01); }
      100% { box-shadow: 0 0 0 0 rgba(34,34,34,0.18); }
    }
    /* Animated dots in SVG */
    .bubble-dot {
      transform-origin: center;
      animation: bubble-dot-bounce 1.2s infinite;
    }
    .bubble-dot:nth-child(3) { animation-delay: 0s; }
    .bubble-dot:nth-child(4) { animation-delay: 0.2s; }
    .bubble-dot:nth-child(5) { animation-delay: 0.4s; }
    @keyframes bubble-dot-bounce {
      0%, 100% { transform: scale(1); }
      30% { transform: scale(1.2); }
      60% { transform: scale(0.9); }
    }
    /* Light/dark mode adaptive bubble */
    @media (prefers-color-scheme: dark) {
      #ai-chat-bubble {
        background: linear-gradient(135deg, #222 60%, #333 100%) !important;
      }
    }
    @media (prefers-color-scheme: light) {
      #ai-chat-bubble {
        background: linear-gradient(135deg, #fff 60%, #ededed 100%) !important;
      }
    }
  `;
  document.head.appendChild(styleEnh);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'ai-chat-window';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '90px';
  chatWindow.style.right = '24px';
  chatWindow.style.width = '420px';
  chatWindow.style.maxWidth = '95vw';
  chatWindow.style.height = '600px';
  chatWindow.style.maxHeight = '85vh';
  chatWindow.style.background = theme === 'dark' ? '#212121' : '#fff';
  chatWindow.style.border = theme === 'dark' ? '1px solid #404040' : '1px solid #d9d9d9';
  chatWindow.style.borderRadius = '12px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.zIndex = '10000';
  chatWindow.style.boxShadow = '0 8px 40px rgba(0,0,0,0.12)';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.transition = 'width 0.2s, height 0.2s, background 0.3s, border 0.3s';
  document.body.appendChild(chatWindow);

  // Chat window content with prompt cards
  const headerBg = theme === 'dark' ? '#212121' : '#fff';
  const headerBorder = theme === 'dark' ? '#404040' : '#e5e5e5';
  const headerText = theme === 'dark' ? '#ececec' : '#202020';
  const promptBg = theme === 'dark' ? '#2f2f2f' : '#f4f4f4';
  const promptText = theme === 'dark' ? '#ececec' : '#202020';
  const messagesBg = theme === 'dark' ? '#212121' : '#fff';
  const inputBg = theme === 'dark' ? '#2f2f2f' : '#fff';
  const inputBorder = theme === 'dark' ? '#404040' : '#d9d9d9';
  const inputText = theme === 'dark' ? '#ececec' : '#202020';

  chatWindow.innerHTML = `
    <div style="background:${headerBg};color:${headerText};padding:14px 16px;border-bottom:1px solid ${headerBorder};display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:1rem;font-weight:600;">ChatGPT-style Chat</span>
      <button id="ai-chat-close" style="background:none;border:none;color:${headerText};font-size:1.4rem;cursor:pointer;line-height:1;opacity:0.7;transition:opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
    </div>
    <div id="ai-chat-prompts" style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;justify-content:flex-start;border-bottom:1px solid ${headerBorder};">
      ${promptCards.map(card => `
        <button class="ai-chat-prompt-card" style="
          background:${promptBg};
          color:${promptText};
          border:1px solid ${inputBorder};
          border-radius:6px;
          padding:8px 12px;
          font-size:0.875rem;
          cursor:pointer;
          transition:all 0.2s;
          font-family:system-ui,-apple-system,sans-serif;
        ">${card}</button>
      `).join('')}
    </div>
    <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:0;background:${messagesBg};"></div>
    <form id="ai-chat-form" style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid ${headerBorder};background:${headerBg};">
      <input id="ai-chat-input" type="text" placeholder="Send a message..." style="flex:1;padding:10px 14px;border-radius:6px;border:1px solid ${inputBorder};font-size:0.95rem;background:${inputBg};color:${inputText};outline:none;transition:border 0.2s;font-family:system-ui,-apple-system,sans-serif;">
      <button type="submit" id="ai-chat-send-btn" style="padding:0 16px;height:40px;border-radius:6px;border:none;background:#10a37f;color:#fff;font-size:0.9rem;font-weight:500;cursor:pointer;transition:background 0.2s;display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="transform:rotate(90deg);">
          <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"/>
        </svg>
      </button>
    </form>
  `;

  // Responsive adjustments and hover effects
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 600px) {
      #ai-chat-window {
        width: 98vw !important;
        height: 70vh !important;
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
      #ai-chat-send-btn {
        padding: 0 12px !important;
      }
      #ai-chat-prompts {
        gap: 6px !important;
        padding: 12px !important;
      }
      .ai-chat-prompt-card {
        font-size: 0.875rem !important;
        padding: 8px 12px !important;
      }
      #ai-chat-bubble-tooltip {
        font-size: 0.95rem !important;
        padding: 6px 10px !important;
        bottom: 54px !important;
      }
    }

    /* ChatGPT-style hover effects */
    #ai-chat-send-btn:hover {
      background: #0d8a6a !important;
    }
    #ai-chat-send-btn:disabled {
      background: #d0d0d0 !important;
      cursor: not-allowed !important;
    }
    #ai-chat-input:focus {
      border: 1px solid #10a37f !important;
      box-shadow: 0 0 0 1px #10a37f !important;
    }
    .ai-chat-prompt-card:hover {
      background: ${theme === 'dark' ? '#3f3f3f' : '#ececec'} !important;
      border-color: ${theme === 'dark' ? '#565656' : '#c0c0c0'} !important;
    }

    /* Smooth message animations */
    #ai-chat-messages > div {
      animation: fadeInMessage 0.3s ease-in;
    }
    @keyframes fadeInMessage {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Custom scrollbar */
    #ai-chat-messages::-webkit-scrollbar {
      width: 8px;
    }
    #ai-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #ai-chat-messages::-webkit-scrollbar-thumb {
      background: ${theme === 'dark' ? '#404040' : '#d0d0d0'};
      border-radius: 4px;
    }
    #ai-chat-messages::-webkit-scrollbar-thumb:hover {
      background: ${theme === 'dark' ? '#565656' : '#b0b0b0'};
    }
  `;
  document.head.appendChild(style);

  // Show/hide chat window
  bubble.onclick = () => {
    chatWindow.style.display = 'flex';
    bubble.style.display = 'none';
    // Remove pulse and tooltip after first interaction
    if (bubble.classList.contains('ai-chat-bubble-pulse')) {
      bubble.classList.remove('ai-chat-bubble-pulse');
      const tooltip = document.getElementById('ai-chat-bubble-tooltip');
      if (tooltip) tooltip.remove();
      localStorage.setItem('aiChatBubbleInteracted', '1');
    }
  };
  chatWindow.querySelector('#ai-chat-close').onclick = () => {
    chatWindow.style.display = 'none';
    bubble.style.display = 'flex';
  };

  // Chat logic
  const messagesDiv = chatWindow.querySelector('#ai-chat-messages');
  const form = chatWindow.querySelector('#ai-chat-form');
  const input = chatWindow.querySelector('#ai-chat-input');
  const promptsDiv = chatWindow.querySelector('#ai-chat-prompts');
  let history = [];
  let promptsVisible = true;

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    const isUser = role === 'user';
    const bgColor = theme === 'dark'
      ? (isUser ? '#212121' : '#2f2f2f')
      : (isUser ? '#fff' : '#f7f7f8');
    const textColor = theme === 'dark' ? '#ececec' : '#202020';

    msg.style.padding = '16px 20px';
    msg.style.background = bgColor;
    msg.style.borderBottom = theme === 'dark' ? '1px solid #404040' : '1px solid #ececec';

    msg.innerHTML = `
      <div style="max-width:700px;margin:0 auto;display:flex;gap:16px;align-items:flex-start;">
        <div style="
          width:30px;
          height:30px;
          border-radius:4px;
          background:${isUser ? '#5436da' : '#10a37f'};
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.875rem;
          font-weight:600;
          flex-shrink:0;
          font-family:system-ui,-apple-system,sans-serif;
        ">
          ${isUser ? 'U' : 'AI'}
        </div>
        <div style="
          flex:1;
          color:${textColor};
          font-size:0.95rem;
          line-height:1.6;
          word-break:break-word;
          font-family:system-ui,-apple-system,sans-serif;
          padding-top:4px;
        ">
          ${text}
        </div>
      </div>
    `;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Handle prompt card click
  promptsDiv.querySelectorAll('.ai-chat-prompt-card').forEach(btn => {
    btn.onclick = () => {
      input.value = btn.textContent;
      form.dispatchEvent(new Event('submit'));
    };
  });

  // Hide prompt cards after first message, but allow toggling
  function hidePrompts() {
    if (promptsVisible) {
      promptsDiv.style.display = 'none';
      promptsVisible = false;
    }
  }

  function showPrompts() {
    promptsDiv.style.display = 'flex';
    promptsVisible = true;
  }

  // Create typing indicator
  function createTypingIndicator() {
    const msg = document.createElement('div');
    const bgColor = theme === 'dark' ? '#2f2f2f' : '#f7f7f8';
    const textColor = theme === 'dark' ? '#ececec' : '#202020';

    msg.className = 'typing-indicator';
    msg.style.padding = '16px 20px';
    msg.style.background = bgColor;
    msg.style.borderBottom = theme === 'dark' ? '1px solid #404040' : '1px solid #ececec';

    msg.innerHTML = `
      <div style="max-width:700px;margin:0 auto;display:flex;gap:16px;align-items:flex-start;">
        <div style="
          width:30px;
          height:30px;
          border-radius:4px;
          background:#10a37f;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.875rem;
          font-weight:600;
          flex-shrink:0;
          font-family:system-ui,-apple-system,sans-serif;
        ">
          AI
        </div>
        <div style="
          flex:1;
          color:${textColor};
          font-size:0.95rem;
          line-height:1.6;
          padding-top:8px;
          font-family:system-ui,-apple-system,sans-serif;
        ">
          <div class="typing-dots" style="display:flex;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite;"></span>
            <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite 0.2s;"></span>
            <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite 0.4s;"></span>
          </div>
        </div>
      </div>
    `;
    return msg;
  }

  // Add typing animation CSS
  const typingStyle = document.createElement('style');
  typingStyle.innerHTML = `
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
  `;
  document.head.appendChild(typingStyle);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    appendMessage('user', userMsg);
    history.push({ role: 'user', content: userMsg });
    input.value = '';

    const typingIndicator = createTypingIndicator();
    messagesDiv.appendChild(typingIndicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    hidePrompts();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });
      const data = await res.json();
      typingIndicator.remove();
      if (data.reply) {
        appendMessage('ai', data.reply);
        history.push({ role: 'assistant', content: data.reply });
      } else if (data.error) {
        appendMessage('ai', "Error: " + (typeof data.error === "string" ? data.error : JSON.stringify(data.error)));
      } else {
        appendMessage('ai', 'Sorry, there was an unknown error.');
      }
    } catch (err) {
      typingIndicator.remove();
      appendMessage('ai', 'Sorry, there was an error.');
    }
  };
})();
