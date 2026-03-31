/**
 * AI Chat Widget
 * Premium blue-purple gradient theme matching the site's design system.
 * Requires: Cloudflare Worker endpoint at /api/chat
 */
(function () {
  // Pre-made prompt cards
  const promptCards = [
    "Show me your latest project",
    "What are your skills?",
    "Tell me about your banking experience"
  ];

  // Site theme tokens
  const T = {
    light: {
      bg: '#ffffff',
      surface: '#F7F8FC',
      fg: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0',
      card: '#f8fafc',
      cardBorder: '#e2e8f0',
      inputBg: '#F7F8FC',
      inputBorder: '#e2e8f0',
      botBubble: '#F7F8FC',
      botText: '#1A1A1A',
      shadow: 'rgba(79,110,243,0.10)',
      shadowHeavy: 'rgba(79,110,243,0.18)',
      scrollThumb: '#cbd5e1',
      scrollThumbHover: '#94a3b8',
      chipBg: '#ffffff',
      chipBorder: '#e2e8f0',
      chipHover: '#f0f4ff',
      disclaimerText: '#94a3b8',
    },
    dark: {
      bg: '#0a0f1e',
      surface: '#0f172a',
      fg: '#e2e8f0',
      muted: '#94a3b8',
      border: '#1e293b',
      card: '#0f172a',
      cardBorder: '#1e293b',
      inputBg: '#0f172a',
      inputBorder: '#1e293b',
      botBubble: '#0f172a',
      botText: '#e2e8f0',
      shadow: 'rgba(79,110,243,0.15)',
      shadowHeavy: 'rgba(79,110,243,0.25)',
      scrollThumb: '#1e293b',
      scrollThumbHover: '#334155',
      chipBg: '#0f172a',
      chipBorder: '#1e293b',
      chipHover: '#1a2680',
      disclaimerText: '#64748b',
    },
  };
  const GRADIENT = 'linear-gradient(135deg, #4f6ef3 0%, #8b5cf6 100%)';
  const GRADIENT_HOVER = 'linear-gradient(135deg, #3b55e8 0%, #7c3aed 100%)';

  // Create chat bubble button with custom SVG
  const bubble = document.createElement('div');
  bubble.id = 'ai-chat-bubble';

  function getTheme() {
    if (document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  let theme = getTheme();
  function t() { return T[theme]; }

  function setBubbleGradient() {
    bubble.style.background = GRADIENT;
  }
  setBubbleGradient();

  // Listen for theme changes
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
      <circle id="bubble-bg" cx="18" cy="18" r="18" fill="transparent"/>
      <path id="bubble-path" d="M12 15a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2a6 6 0 0 1-6 6h-1.5l-3.5 3v-3a6 6 0 0 1-1-3v-2z" fill="#ffffff"/>
      <circle class="bubble-dot" cx="16" cy="18" r="1" fill="rgba(79,110,243,0.7)"/>
      <circle class="bubble-dot" cx="18" cy="18" r="1" fill="rgba(79,110,243,0.7)"/>
      <circle class="bubble-dot" cx="20" cy="18" r="1" fill="rgba(79,110,243,0.7)"/>
    </svg>
  `;
  function updateSVGColors() {
    const svg = bubble.querySelector('#ai-bubble-svg');
    if (!svg) return;
    svg.querySelector('#bubble-bg').setAttribute('fill', 'transparent');
    svg.querySelector('#bubble-path').setAttribute('fill', '#ffffff');
    svg.querySelectorAll('.bubble-dot').forEach(dot => {
      dot.setAttribute('fill', 'rgba(79,110,243,0.7)');
    });
  }
  updateSVGColors();

  bubble.style.position = 'fixed';
  bubble.style.bottom = '24px';
  bubble.style.right = '24px';
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  bubble.style.borderRadius = '16px';
  bubble.style.border = 'none';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '9999';
  bubble.style.boxShadow = '0 4px 24px rgba(79,110,243,0.25), 0 2px 8px rgba(139,92,246,0.15)';
  bubble.style.transition = 'transform 0.2s ease, box-shadow 0.3s ease';

  // Add pulse animation and tooltip for first-time users
  const hasInteracted = localStorage.getItem('aiChatBubbleInteracted');
  if (!hasInteracted) {
    bubble.classList.add('ai-chat-bubble-pulse');
    const tooltipPhrases = [
      "Ask me about my projects!",
      "Got a question?",
      "Let's chat!",
      "Try a prompt below!"
    ];
    let tooltipIndex = 0;
    const tooltip = document.createElement('div');
    tooltip.id = 'ai-chat-bubble-tooltip';
    tooltip.innerText = tooltipPhrases[0];
    tooltip.style.position = 'absolute';
    tooltip.style.bottom = '64px';
    tooltip.style.right = '0';
    tooltip.style.background = GRADIENT;
    tooltip.style.color = '#fff';
    tooltip.style.padding = '8px 16px';
    tooltip.style.borderRadius = '12px';
    tooltip.style.fontSize = '0.875rem';
    tooltip.style.fontWeight = '500';
    tooltip.style.boxShadow = '0 4px 16px rgba(79,110,243,0.25)';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.zIndex = '10000';
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transition = 'opacity 0.3s ease';
    tooltip.style.fontFamily = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
    bubble.appendChild(tooltip);

    let tooltipInterval = setInterval(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        tooltipIndex = (tooltipIndex + 1) % tooltipPhrases.length;
        tooltip.innerText = tooltipPhrases[tooltipIndex];
        tooltip.style.opacity = '1';
      }, 300);
    }, 5000);

    bubble.addEventListener('click', () => {
      clearInterval(tooltipInterval);
      tooltip.remove();
    }, { once: true });
  }
  bubble.onmouseover = () => {
    bubble.style.transform = 'scale(1.08)';
    bubble.style.boxShadow = '0 8px 32px rgba(79,110,243,0.35), 0 4px 12px rgba(139,92,246,0.2)';
  };
  bubble.onmouseout = () => {
    bubble.style.transform = 'scale(1)';
    bubble.style.boxShadow = '0 4px 24px rgba(79,110,243,0.25), 0 2px 8px rgba(139,92,246,0.15)';
  };
  document.body.appendChild(bubble);

  // Add pulse and dot animation CSS
  const styleEnh = document.createElement('style');
  styleEnh.innerHTML = `
    .ai-chat-bubble-pulse {
      animation: ai-bubble-pulse 2s infinite;
    }
    @keyframes ai-bubble-pulse {
      0% { box-shadow: 0 4px 24px rgba(79,110,243,0.25); }
      50% { box-shadow: 0 4px 24px rgba(79,110,243,0.25), 0 0 0 10px rgba(79,110,243,0.08); }
      100% { box-shadow: 0 4px 24px rgba(79,110,243,0.25), 0 0 0 0 rgba(79,110,243,0); }
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
    #ai-chat-bubble {
      border-radius: 16px !important;
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
  chatWindow.style.background = t().bg;
  chatWindow.style.border = 'none';
  chatWindow.style.borderRadius = '16px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.zIndex = '10000';
  chatWindow.style.boxShadow = `0 24px 80px ${t().shadow}, 0 8px 32px rgba(0,0,0,0.08)`;
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.transition = 'width 0.2s, height 0.2s, background 0.3s';
  document.body.appendChild(chatWindow);

  chatWindow.innerHTML = `
    <div id="ai-chat-header" style="
      background:${GRADIENT};
      color:#ffffff;
      padding:20px 20px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    ">
      <div style="display:flex;flex-direction:column;gap:3px;">
        <span style="font-size:0.95rem;font-weight:600;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-0.01em;">Ask my AI about what I've built</span>
        <span style="font-size:0.7rem;font-weight:400;opacity:0.75;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Trained on my product work and case studies</span>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        <button id="ai-chat-edit" style="background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;padding:6px;border-radius:8px;transition:background 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button id="ai-chat-close" style="background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;padding:6px;border-radius:8px;transition:background 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:20px;background:${t().bg};"></div>
    <div style="padding:8px 16px;text-align:center;color:${t().disclaimerText};font-size:0.7rem;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      AI can make mistakes
    </div>
    <form id="ai-chat-form" style="display:flex;gap:8px;padding:12px 16px 16px;background:${t().bg};">
      <div style="flex:1;position:relative;">
        <input id="ai-chat-input" type="text" placeholder="Ask about my work..." style="
          width:100%;
          padding:12px 48px 12px 16px;
          border-radius:14px;
          border:1px solid ${t().border};
          font-size:0.9rem;
          background:${t().inputBg};
          color:${t().fg};
          outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          line-height:1.5;
        ">
        <button type="submit" id="ai-chat-send-btn" style="
          position:absolute;
          right:6px;
          top:50%;
          transform:translateY(-50%);
          width:34px;
          height:34px;
          border-radius:10px;
          border:none;
          background:${GRADIENT};
          color:#ffffff;
          cursor:pointer;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0;
          box-shadow:0 2px 8px rgba(79,110,243,0.3);
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
        border-radius: 16px !important;
      }
      #ai-chat-bubble {
        width: 48px !important;
        height: 48px !important;
        right: 12px !important;
        bottom: 12px !important;
      }
      #ai-chat-bubble-tooltip {
        font-size: 0.85rem !important;
        padding: 6px 12px !important;
        bottom: 54px !important;
      }
    }

    /* Send button hover */
    #ai-chat-send-btn:hover {
      transform: translateY(-50%) scale(1.06) !important;
      box-shadow: 0 4px 14px rgba(79,110,243,0.4) !important;
    }
    #ai-chat-send-btn:active {
      transform: translateY(-50%) scale(0.96) !important;
    }
    #ai-chat-send-btn:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }

    /* Input focus */
    #ai-chat-input:focus {
      border-color: #6b8ef7 !important;
      box-shadow: 0 0 0 3px rgba(79,110,243,0.1) !important;
    }
    #ai-chat-input::placeholder {
      color: #94a3b8;
    }

    /* Smooth message animations */
    #ai-chat-messages > div {
      animation: fadeInMessage 0.35s ease-out;
    }
    @keyframes fadeInMessage {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Prompt chip hover */
    .suggested-question-bubble {
      transition: all 0.2s ease !important;
    }
    .suggested-question-bubble:active {
      transform: scale(0.97) !important;
    }

    /* Custom scrollbar */
    #ai-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    #ai-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #ai-chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    #ai-chat-messages::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    .dark #ai-chat-messages::-webkit-scrollbar-thumb {
      background: #1e293b;
    }
    .dark #ai-chat-messages::-webkit-scrollbar-thumb:hover {
      background: #334155;
    }

    /* Feedback buttons */
    .ai-fb-btn {
      transition: all 0.2s ease !important;
    }
    .ai-fb-btn:active:not(:disabled) {
      transform: scale(0.9);
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
  let sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2);

  // Suggested questions
  const suggestedQuestions = [
    "Show me your latest project",
    "What are your skills?",
    "Tell me about your Product Management experience"
  ];

  // Add suggested questions to the chat window
  function showSuggestedQuestions() {
    const container = document.createElement('div');
    container.id = 'ai-suggested-questions';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    container.style.marginBottom = '16px';

    suggestedQuestions.forEach(question => {
      const chip = document.createElement('div');
      chip.className = 'suggested-question-bubble';
      chip.style.padding = '12px 16px';
      chip.style.borderRadius = '14px';
      chip.style.background = t().chipBg;
      chip.style.color = t().fg;
      chip.style.fontSize = '0.875rem';
      chip.style.cursor = 'pointer';
      chip.style.fontFamily = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
      chip.style.border = `1px solid ${t().chipBorder}`;
      chip.style.lineHeight = '1.5';
      chip.style.boxShadow = `0 1px 4px ${t().shadow}`;
      chip.textContent = question;

      chip.onmouseover = () => {
        chip.style.background = t().chipHover;
        chip.style.borderColor = '#6b8ef7';
        chip.style.boxShadow = `0 2px 10px ${t().shadowHeavy}`;
      };
      chip.onmouseout = () => {
        chip.style.background = t().chipBg;
        chip.style.borderColor = t().chipBorder;
        chip.style.boxShadow = `0 1px 4px ${t().shadow}`;
      };
      chip.onclick = () => {
        input.value = question;
        form.dispatchEvent(new Event('submit'));
        const suggestedContainer = document.getElementById('ai-suggested-questions');
        if (suggestedContainer) {
          suggestedContainer.remove();
        }
      };

      container.appendChild(chip);
    });

    messagesDiv.appendChild(container);
  }

  // Show suggested questions on load
  showSuggestedQuestions();

  function appendMessage(role, text, traceId) {
    const msg = document.createElement('div');
    const isUser = role === 'user';

    msg.style.marginBottom = '12px';
    msg.style.display = 'flex';
    msg.style.justifyContent = isUser ? 'flex-end' : 'flex-start';

    if (isUser) {
      msg.innerHTML = `
        <div style="
          max-width:82%;
          padding:12px 18px;
          border-radius:16px 16px 4px 16px;
          background:${GRADIENT};
          color:#ffffff;
          font-size:0.9rem;
          line-height:1.6;
          word-break:break-word;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          box-shadow:0 2px 10px rgba(79,110,243,0.2);
        ">
          ${text}
        </div>
      `;
    } else {
      const bubbleId = 'fb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      msg.innerHTML = `
        <div style="max-width:82%;">
          <div style="
            padding:12px 18px;
            border-radius:16px 16px 16px 4px;
            background:${t().botBubble};
            color:${t().botText};
            font-size:0.9rem;
            line-height:1.6;
            word-break:break-word;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            border:1px solid ${t().border};
          ">
            ${text}
          </div>
          ${traceId ? `
          <div id="${bubbleId}" style="display:flex;align-items:center;gap:2px;margin-top:4px;padding-left:4px;">
            <button class="ai-fb-btn" data-trace="${traceId}" data-score="1" style="
              background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:6px;
              color:${t().muted};font-size:14px;line-height:1;transition:all 0.2s ease;display:flex;align-items:center;
            " onmouseover="this.style.background='${t().chipHover}';this.style.color='#34d399'" onmouseout="if(!this.dataset.selected){this.style.background='none';this.style.color='${t().muted}'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
            </button>
            <button class="ai-fb-btn" data-trace="${traceId}" data-score="0" style="
              background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:6px;
              color:${t().muted};font-size:14px;line-height:1;transition:all 0.2s ease;display:flex;align-items:center;
            " onmouseover="this.style.background='${t().chipHover}';this.style.color='#f87171'" onmouseout="if(!this.dataset.selected){this.style.background='none';this.style.color='${t().muted}'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
            </button>
          </div>
          ` : ''}
        </div>
      `;

      // Attach feedback handlers
      if (traceId) {
        const container = msg.querySelector('#' + bubbleId);
        container.querySelectorAll('.ai-fb-btn').forEach(btn => {
          btn.onclick = async () => {
            const score = parseInt(btn.dataset.score);
            // Mark selected, disable both
            container.querySelectorAll('.ai-fb-btn').forEach(b => {
              b.disabled = true;
              b.style.cursor = 'default';
              b.onmouseover = null;
              b.onmouseout = null;
              if (b === btn) {
                b.dataset.selected = '1';
                b.style.color = score === 1 ? '#34d399' : '#f87171';
                b.style.background = score === 1 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)';
              } else {
                b.style.opacity = '0.3';
                b.style.color = t().muted;
              }
            });
            // Send feedback
            try {
              await fetch('/api/chat/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  traceId: btn.dataset.trace,
                  score,
                  category: 'inline-thumbs'
                })
              });
            } catch (e) { /* silent */ }
          };
        });
      }
    }
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }


  // Create typing indicator
  function createTypingIndicator() {
    const msg = document.createElement('div');

    msg.className = 'typing-indicator';
    msg.style.marginBottom = '12px';
    msg.style.display = 'flex';
    msg.style.justifyContent = 'flex-start';

    msg.innerHTML = `
      <div style="
        max-width:82%;
        padding:14px 18px;
        border-radius:16px 16px 16px 4px;
        background:${t().botBubble};
        border:1px solid ${t().border};
        font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      ">
        <div class="typing-dots" style="display:flex;gap:5px;align-items:center;">
          <span style="width:7px;height:7px;border-radius:50%;background:#6b8ef7;opacity:0.7;animation:typingDot 1.4s infinite;"></span>
          <span style="width:7px;height:7px;border-radius:50%;background:#8b5cf6;opacity:0.7;animation:typingDot 1.4s infinite 0.2s;"></span>
          <span style="width:7px;height:7px;border-radius:50%;background:#a78bfa;opacity:0.7;animation:typingDot 1.4s infinite 0.4s;"></span>
        </div>
      </div>
    `;
    return msg;
  }

  // Add typing animation CSS
  const typingStyle = document.createElement('style');
  typingStyle.innerHTML = `
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
  `;
  document.head.appendChild(typingStyle);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;

    // Remove suggested questions when user sends a message
    const suggestedContainer = document.getElementById('ai-suggested-questions');
    if (suggestedContainer) {
      suggestedContainer.remove();
    }

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
        body: JSON.stringify({ message: userMsg, history: history.slice(-20), sessionId })
      });
      const data = await res.json();
      typingIndicator.remove();
      if (data.reply) {
        appendMessage('ai', data.reply, data.traceId || null);
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

  editBtn.onclick = () => {
    // Clear current conversation
    messagesDiv.innerHTML = '';
    history = [];
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2);
    // Show suggested questions again
    showSuggestedQuestions();
    input.focus();
  };

  // Handle clicks on "Chat with my AI" button from homepage
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target) {
      const href = target.getAttribute('href');
      const text = target.textContent.trim();

      if ((href && href.includes('#open-chat')) || text === 'Chat with my AI') {
        e.preventDefault();
        chatWindow.style.display = 'flex';
        bubble.style.display = 'none';
        if (bubble.classList.contains('ai-chat-bubble-pulse')) {
          bubble.classList.remove('ai-chat-bubble-pulse');
          const tooltip = document.getElementById('ai-chat-bubble-tooltip');
          if (tooltip) tooltip.remove();
          localStorage.setItem('aiChatBubbleInteracted', '1');
        }
      }
    }
  });
})();
