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

  // Chat window content with prompt cards
  chatWindow.innerHTML = `
    <div style="background:#222;color:#fff;padding:16px 20px;border-radius:18px 18px 0 0;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:1.15rem;font-weight:600;">Chat with AI Ronak</span>
      <button id="ai-chat-close" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1;">×</button>
    </div>
    <div id="ai-chat-prompts" style="display:flex;flex-wrap:wrap;gap:8px;padding:12px 12px 0 12px;justify-content:flex-start;">
      ${promptCards.map(card => `
        <button class="ai-chat-prompt-card" style="
          background:#ededed;
          color:#222;
          border:none;
          border-radius:16px;
          padding:8px 16px;
          font-size:0.98rem;
          cursor:pointer;
          margin-bottom:4px;
          transition:background 0.2s;
          box-shadow:0 1px 4px rgba(0,0,0,0.04);
          flex:0 1 auto;
          max-width:90%;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        ">${card}</button>
      `).join('')}
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
      #ai-chat-prompts {
        gap: 6px !important;
        padding: 8px 6px 0 6px !important;
      }
      .ai-chat-prompt-card {
        font-size: 0.93rem !important;
        padding: 7px 10px !important;
        max-width: 98vw !important;
      }
      #ai-chat-bubble-tooltip {
        font-size: 0.95rem !important;
        padding: 6px 10px !important;
        bottom: 54px !important;
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
    .ai-chat-prompt-card:active, .ai-chat-prompt-card:hover {
      background: #d1e7dd !important;
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

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    appendMessage('user', userMsg);
    history.push({ role: 'user', content: userMsg });
    input.value = '';
    appendMessage('ai', '...');
    hidePrompts();
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
