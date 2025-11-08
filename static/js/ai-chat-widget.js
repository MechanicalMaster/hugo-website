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
    <div style="background:${headerBg};color:${headerText};padding:20px 16px;border-bottom:1px solid ${headerBorder};display:flex;justify-content:flex-end;align-items:center;gap:12px;">
      <button id="ai-chat-edit" style="background:none;border:none;color:${headerText};cursor:pointer;padding:8px;opacity:0.7;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button id="ai-chat-history" style="background:none;border:none;color:${headerText};cursor:pointer;padding:8px;opacity:0.7;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>
      <button id="ai-chat-close" style="background:none;border:none;color:${headerText};cursor:pointer;padding:8px;opacity:0.7;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:24px 16px;background:${messagesBg};"></div>
    <div style="padding:12px 16px;text-align:center;color:${theme === 'dark' ? '#999' : '#666'};font-size:0.75rem;font-family:system-ui,-apple-system,sans-serif;border-top:1px solid ${headerBorder};">
      AI support can make mistakes
    </div>
    <form id="ai-chat-form" style="display:flex;gap:8px;padding:16px;background:${headerBg};">
      <div style="flex:1;position:relative;">
        <input id="ai-chat-input" type="text" placeholder="Ask a support question..." style="width:100%;padding:12px 16px;border-radius:24px;border:1px solid ${inputBorder};font-size:0.95rem;background:${inputBg};color:${inputText};outline:none;transition:border 0.2s;font-family:system-ui,-apple-system,sans-serif;padding-right:48px;">
        <button type="submit" id="ai-chat-send-btn" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;border:none;background:${theme === 'dark' ? '#444' : '#e5e5e5'};color:${inputText};cursor:pointer;transition:background 0.2s;display:flex;align-items:center;justify-content:center;padding:0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
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
      #ai-chat-bubble-tooltip {
        font-size: 0.95rem !important;
        padding: 6px 10px !important;
        bottom: 54px !important;
      }
    }

    /* Hover effects */
    #ai-chat-send-btn:hover {
      background: ${theme === 'dark' ? '#555' : '#d0d0d0'} !important;
    }
    #ai-chat-send-btn:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
    #ai-chat-input:focus {
      border: 1px solid ${theme === 'dark' ? '#666' : '#999'} !important;
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
  let history = [];

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    const isUser = role === 'user';
    const textColor = theme === 'dark' ? '#ececec' : '#202020';

    msg.style.marginBottom = '16px';
    msg.style.display = 'flex';
    msg.style.justifyContent = isUser ? 'flex-end' : 'flex-start';

    const bubbleBg = theme === 'dark'
      ? (isUser ? '#2f2f2f' : '#2f2f2f')
      : (isUser ? '#f0f0f0' : '#f7f7f8');

    msg.innerHTML = `
      <div style="
        max-width:85%;
        padding:12px 16px;
        border-radius:18px;
        background:${bubbleBg};
        color:${textColor};
        font-size:0.95rem;
        line-height:1.5;
        word-break:break-word;
        font-family:system-ui,-apple-system,sans-serif;
      ">
        ${text}
      </div>
    `;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }


  // Create typing indicator
  function createTypingIndicator() {
    const msg = document.createElement('div');
    const bgColor = theme === 'dark' ? '#2f2f2f' : '#f7f7f8';
    const textColor = theme === 'dark' ? '#ececec' : '#202020';

    msg.className = 'typing-indicator';
    msg.style.marginBottom = '16px';
    msg.style.display = 'flex';
    msg.style.justifyContent = 'flex-start';

    msg.innerHTML = `
      <div style="
        max-width:85%;
        padding:12px 16px;
        border-radius:18px;
        background:${bgColor};
        font-family:system-ui,-apple-system,sans-serif;
      ">
        <div class="typing-dots" style="display:flex;gap:4px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite 0.2s;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:${textColor};opacity:0.6;animation:typingDot 1.4s infinite 0.4s;"></span>
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

  // Add functionality to edit and history buttons
  const editBtn = chatWindow.querySelector('#ai-chat-edit');
  const historyBtn = chatWindow.querySelector('#ai-chat-history');

  editBtn.onclick = () => {
    // Clear current conversation
    messagesDiv.innerHTML = '';
    history = [];
    input.focus();
  };

  historyBtn.onclick = () => {
    // This could be extended to show conversation history
    // For now, we'll just scroll to top
    messagesDiv.scrollTop = 0;
  };
})();
