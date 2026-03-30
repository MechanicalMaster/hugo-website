var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var index_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://ronaksethiya.com",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
    if (request.url.includes("/health") && request.method === "GET") {
      return healthCheck(env);
    }
    if (request.url.includes("/admin/analytics") && request.method === "GET") {
      return await getAnalytics(env, request);
    }
    if (request.url.includes("/feedback")) {
      return await handleFeedback(env, request);
    }
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://ronaksethiya.com"
          }
        }
      );
    }
    return await handleChat(env, request);
  }
};

// ============================================================
// KNOWLEDGE BASE — split by section for intent-based retrieval
// ============================================================

const KB_PROFILE = `
Ronak Sethiya is a Technical Product Manager and Domain Expert in Fintech/Digital Banking with a unique "Full-Stack" background combining Mechanical Engineering rigor with MBA strategic acumen from IIT Bombay (SJMSOM). He has 58+ months of experience spanning Platform Product Management, Credit Risk Strategy, and AI/LLM Prototyping. His core differentiator is bridging business goals and technical execution — he defines product roadmaps for large-scale banking systems (1M+ daily transactions) and also builds AI agents (RAG/Multi-modal) and automates complex data workflows with Python, SQL, and VBA.
`;

const KB_FINTECH = `
FINTECH PRODUCT MANAGEMENT (Yes Bank & IDFC First Bank):

Yes Bank — Digital Product Manager, TBG (Jan 2023–Present):
- Platform PM for UPI Collections and Virtual Accounts, scaled to 1M+ daily transactions with 600+ active partners
- Orchestrated multi-rail infrastructure (QR, UPI Intent, Mandates) and integrated 13+ external APIs (CIBIL, GST, ITR, NeSL, Banking) to automate underwriting
- Led end-to-end digitization of Supply Chain Finance dealer journey, reducing Underwriting TAT from 6 days to 2 days
- Implemented NeSL-based E-signing/Stamping to eliminate operational overhead
- Ideated migration strategies for RBI circulars on penal charges; migrated internal trade CA accounts to "Bank as PA" model
- Part of blockchain-based deep tier invoice financing under RBI Sandbox
- Awarded "Emerging High Impact Star in CMS Product" for 2022-23

IDFC First Bank — Manager, Secured Loans (Oct 2020–Dec 2022):
- Managed ₹8000+ Cr secured loan portfolio, achieving lowest-ever NPA since inception
- Built "Loss on Sale" models and "Early Delinquency Tracking" dashboards using SQL and Tableau
- Segmentation Analysis created an "Affluence-based grid" that increased STP for high-value assets from 5% to 45%
- Led Cross-Functional Teams to launch EV framework (onboarding 10+ OEMs) and led UAT
`;

const KB_AI = `
AI, LLM & TECHNICAL COMPETENCIES:

Applied AI & Prototyping:
- Built and deployed a RAG Chatbot for querying complex knowledge bases (product docs, API specs), validated for reliable, low-latency responses — applicable to automated customer support and fraud detection
- Engineered a Multi-modal AI Agent (Ava) with persistent memory and low-latency inference, exploring Conversational Commerce, Voice-based Payments, and Multi-modal KYC use cases
- Built "AI Biz" — an Android app embedding a fully local Gemma-3 1B model via MediaPipe for on-device merchant payment intelligence (zero cloud dependency, complete privacy)
- Built a YouTube Analyzer tool for AI-powered video summarization using LLMs

Frameworks & Tools: LangChain, LangGraph, AutoGen, Crew AI, Langfuse (observability), Langsmith (metrics)
Languages: Python (Advanced), Excel VBA (Expert), SQL
Data Viz: Power BI, Tableau
AI/ML Context: FICO scoring models, Surrogate data underwriting, Statistical scorecards
`;

const KB_ENGINEERING = `
ENGINEERING & HARDWARE PM (Larsen & Toubro, Jul 2015–Jul 2018):
- Hardware PM for the world's smallest 800A circuit breaker (projected ₹10 Cr market size)
- Patent holder: "Novel Rotary Operating Mechanism"
- Used DOE and HALT to increase product MTTF from 4,000 to 20,000 operations
- Reduced testing time by 80%
`;

const KB_EDUCATION = `
EDUCATION & LEADERSHIP:
- MBA: Master of Management, SJMSOM, IIT Bombay (2020), CGPA 8.42/10. Class Representative.
- B.E. Mechanical Engineering, FCRIT, Mumbai University (2015), CGPA 8.36/10.
- E-Club at IIT Bombay: managed 10+ startups, facilitated live projects and internships.
`;

const KB_PROJECTS = `
PORTFOLIO — Case studies at ronaksethiya.com/projects/:

1. Supply Chain Finance Lead Management (ronaksethiya.com/projects/supply-chain-finance-lead-management/)
   AI-powered lead management system for YES BANK's SCF division. 60% faster lead processing, 3x improved conversion, built from scratch.

2. Early Warning Signal Dashboard (ronaksethiya.com/projects/early-warning-signal-dashboard/)
   Real-time credit risk monitoring dashboard. Automated stop-supply workflows and FLDG invocations. 60% reduction in monitoring time. Live at early-warning-signal.vercel.app.

3. AI Biz: On-Device Intelligence (ronaksethiya.com/projects/AI-biz/)
   Android app with fully local Gemma-3 1B model via MediaPipe. Zero-latency, privacy-first merchant payment insights. GitHub: github.com/MechanicalMaster/LocalAIModel

4. Ava: Conversational AI Agent (ronaksethiya.com/projects/ava-ai-agent/)
   Modular AI agent with Telegram integration, character cards, natural language reminders, LangGraph workflow, and Langfuse observability.

5. AI-Powered Journal (ronaksethiya.com/projects/ai-powered-journal/)
   Journaling web app leveraging AI for personal reflection with OCR capabilities.

6. YouTube Analyzer (ronaksethiya.com/projects/youtube-analyzer/)
   AI-powered video summarization tool using LLMs, Next.js, and Supabase.

7. AI Chat Widget (ronaksethiya.com/projects/ai-chat/)
   This very chatbot — built with Cloudflare Workers, Groq/Llama, Langfuse tracing, and prompt engineering.

8. Mock API on AWS (ronaksethiya.com/projects/mock-api-aws-part-1/)
   Multi-service mock API on AWS Free Tier with Docker, FastAPI, CloudWatch logging, and auth.
`;

const KB_CONTACT = `
CONTACT & PRESENCE:
- Email: ronakss.rj@gmail.com | job@ronaksethiya.com
- Phone: +91-8454881721
- Website: ronaksethiya.com
- LinkedIn: linkedin.com/in/ronaksethiya/
- GitHub: github.com/MechanicalMaster
`;

// Map intent categories to relevant KB sections
function getRelevantKB(intent) {
  const sections = {
    "ai_skills":    [KB_PROFILE, KB_AI, KB_PROJECTS],
    "projects":     [KB_PROFILE, KB_PROJECTS, KB_AI],
    "experience":   [KB_PROFILE, KB_FINTECH, KB_ENGINEERING],
    "technical":    [KB_AI, KB_FINTECH, KB_PROJECTS],
    "achievements": [KB_PROFILE, KB_FINTECH, KB_AI, KB_ENGINEERING],
    "education":    [KB_EDUCATION, KB_PROFILE],
    "leadership":   [KB_PROFILE, KB_FINTECH, KB_EDUCATION],
    "general":      [KB_PROFILE, KB_FINTECH, KB_AI, KB_PROJECTS, KB_EDUCATION, KB_CONTACT],
  };
  const selected = sections[intent.category] || sections["general"];
  // Always append contact for recruiters
  if (intent.isRecruiter && !selected.includes(KB_CONTACT)) {
    selected.push(KB_CONTACT);
  }
  return selected.join("\n");
}
__name(getRelevantKB, "getRelevantKB");

async function handleChat(env, request) {
  const startTime = Date.now();
  let traceId = null;
  try {
    const body = await request.json();
    const message = body.message;
    const history = body.history || [];
    const userIp = request.headers.get("CF-Connecting-IP") || "unknown";

    if (!message || typeof message !== "string" || message.length > 1000) {
      return errorResponse("Invalid or too long message", 400);
    }

    if (!Array.isArray(history) || history.length > 20) {
      return errorResponse("Invalid or too long history", 400);
    }

    const rateLimitResult = await checkRateLimit(env, userIp);
    if (!rateLimitResult.allowed) {
      return errorResponse(
        `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
        429,
        { "Retry-After": rateLimitResult.retryAfter.toString() }
      );
    }

    traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const userId = hashIp(userIp);
    console.log(`[${traceId}] Query: ${message}`);

    const intentStartTime = Date.now();
    const intent = detectIntent(message, history);
    const intentLatency = Date.now() - intentStartTime;
    const intentSpanId = `span-intent-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    console.log(`[${traceId}] Intent: ${intent.category}, Recruiter: ${intent.isRecruiter}`);

    const systemPrompt = buildSystemPrompt(intent);
    const maxTokens = getMaxTokens(message, intent);
    const trimmedHistory = history.slice(-10);

    const groqStartTime = Date.now();
    const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...trimmedHistory,
          { role: "user", content: message }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    const groqLatency = Date.now() - groqStartTime;
    const data = await groqRes.json();

    if (!groqRes.ok) {
      const errorMessage = data.error?.message || "Groq API error";
      console.log(`[${traceId}] Groq error: ${errorMessage}`);
      if (groqRes.status === 429) {
        return errorResponse(
          "I'm getting too many requests right now. Please wait a moment and try again.",
          429,
          { "Retry-After": "60" }
        );
      }
      return errorResponse("I'm having trouble processing your request. Please try again.", 500);
    }

    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    const usage = data.usage || {};
    const totalLatency = Date.now() - startTime;

    console.log(`[${traceId}] Response generated (${groqLatency}ms, ${usage.total_tokens || 0} tokens)`);

    const langfuseEvents = [
      {
        id: crypto.randomUUID(),
        type: "trace-create",
        timestamp: new Date(startTime).toISOString(),
        body: {
          id: traceId,
          name: "ronak-chatbot-conversation",
          userId,
          metadata: {
            userIp: userIp.substring(0, 10) + "...",
            messageLength: message.length,
            historyLength: history.length,
            totalLatencyMs: totalLatency,
            groqLatencyMs: groqLatency,
            intentLatencyMs: intentLatency,
            totalTokens: usage.total_tokens || 0,
            promptTokens: usage.prompt_tokens || 0,
            completionTokens: usage.completion_tokens || 0,
            intentCategory: intent.category,
            isRecruiter: intent.isRecruiter,
            knowledgeSource: "intent_scoped_kb"
          },
          input: {
            message,
            historyCount: history.length
          },
          output: {
            reply: aiReply,
            metadata: {
              intent: intent.category,
              latencyMs: totalLatency,
              tokens: usage.total_tokens || 0
            }
          }
        }
      },
      {
        id: crypto.randomUUID(),
        type: "span-create",
        timestamp: new Date(intentStartTime).toISOString(),
        body: {
          id: intentSpanId,
          traceId,
          name: "intent-detection",
          startTime: new Date(intentStartTime).toISOString(),
          endTime: new Date(intentStartTime + intentLatency).toISOString(),
          input: {
            message,
            historyLength: history.length
          },
          output: {
            category: intent.category,
            isRecruiter: intent.isRecruiter
          },
          metadata: {
            latencyMs: intentLatency
          }
        }
      },
      {
        id: crypto.randomUUID(),
        type: "generation-create",
        timestamp: new Date(groqStartTime).toISOString(),
        body: {
          id: generationId,
          traceId,
          name: "groq-llm-generation",
          startTime: new Date(groqStartTime).toISOString(),
          endTime: new Date(groqStartTime + groqLatency).toISOString(),
          model: "llama-3.3-70b-versatile",
          modelParameters: {
            temperature: 0.7,
            maxTokens
          },
          prompt: [
            { role: "system", content: systemPrompt.substring(0, 300) + "..." },
            ...trimmedHistory.slice(-4).map((h) => ({ role: h.role, content: h.content.substring(0, 100) + "..." })),
            { role: "user", content: message }
          ],
          completion: aiReply,
          usage: {
            promptTokens: usage.prompt_tokens || 0,
            completionTokens: usage.completion_tokens || 0,
            totalTokens: usage.total_tokens || 0
          },
          metadata: {
            latencyMs: groqLatency,
            finishReason: data.choices?.[0]?.finish_reason || "stop",
            intentCategory: intent.category,
            provider: "groq"
          }
        }
      }
    ];

    await sendToLangfuseIngestion(env, { batch: langfuseEvents });
    await incrementRateLimit(env, userIp);

    return new Response(
      JSON.stringify({
        reply: aiReply,
        traceId,
        metadata: {
          intent: intent.category,
          latencyMs: totalLatency,
          tokens: usage.total_tokens || 0
        }
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://ronaksethiya.com",
          "Access-Control-Allow-Credentials": "true"
        }
      }
    );
  } catch (error) {
    console.error(`[${traceId}] Error:`, error);
    return errorResponse("Server error: " + error.message, 500);
  }
}
__name(handleChat, "handleChat");

// ============================================================
// Token limits — generous enough for real answers
// ============================================================
function getMaxTokens(message, intent) {
  // Short greetings / yes-no questions
  if (message.length < 30) return 250;
  // Technical & AI deep-dives get more room
  if (intent.category === "technical" || intent.category === "ai_skills") return 500;
  // Projects need space for storytelling
  if (intent.category === "projects") return 500;
  // Recruiter conversations should be thorough
  if (intent.isRecruiter) return 500;
  // Default
  return 400;
}
__name(getMaxTokens, "getMaxTokens");

async function sendToLangfuseIngestion(env, data) {
  try {
    const authString = btoa(`${env.LANGFUSE_PUBLIC_KEY}:${env.LANGFUSE_SECRET_KEY}`);
    console.log(`Sending ${data.batch?.length || 0} events to Langfuse`);

    const response = await fetch(`${env.LANGFUSE_HOST}/api/public/ingestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`Langfuse ingestion failed: ${response.status}`);
      console.error(`Response: ${responseText}`);
      return false;
    }

    console.log(`Langfuse ingestion success: ${response.status}`);

    try {
      const result = JSON.parse(responseText);
      console.log(`Langfuse accepted: ${result.successes || 0} events, ${result.errors || 0} errors`);
    } catch (e) {
      console.log(`Response text: ${responseText}`);
    }

    return true;
  } catch (error) {
    console.error(`Langfuse ingestion exception: ${error.message}`);
    return false;
  }
}
__name(sendToLangfuseIngestion, "sendToLangfuseIngestion");

async function checkRateLimit(env, userIp) {
  const key = `ratelimit:${hashIp(userIp)}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 20;

  try {
    const data = await env.RATE_LIMIT_KV.get(key, "json");
    if (!data) return { allowed: true };

    const recentRequests = data.timestamps.filter((ts) => now - ts < windowMs);

    if (recentRequests.length >= maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check error:", error);
    return { allowed: true };
  }
}
__name(checkRateLimit, "checkRateLimit");

async function incrementRateLimit(env, userIp) {
  const key = `ratelimit:${hashIp(userIp)}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;

  try {
    let data = await env.RATE_LIMIT_KV.get(key, "json");
    if (!data) data = { timestamps: [] };

    data.timestamps = data.timestamps.filter((ts) => now - ts < windowMs);
    data.timestamps.push(now);

    await env.RATE_LIMIT_KV.put(key, JSON.stringify(data), {
      expirationTtl: 2 * 60 * 60
    });
  } catch (error) {
    console.error("Rate limit increment error:", error);
  }
}
__name(incrementRateLimit, "incrementRateLimit");

async function handleFeedback(env, request) {
  try {
    const body = await request.json();
    const { traceId, score, comment, category } = body;

    if (!traceId || typeof score !== "number") {
      return errorResponse("Invalid feedback data", 400);
    }

    const feedbackId = `feedback-${Date.now()}`;
    const feedbackData = {
      id: feedbackId,
      traceId,
      score,
      comment: comment || "",
      category: category || "general",
      timestamp: new Date().toISOString()
    };

    await env.FEEDBACK_KV.put(
      feedbackId,
      JSON.stringify(feedbackData),
      { expirationTtl: 90 * 24 * 60 * 60 }
    );

    await sendToLangfuseIngestion(env, {
      batch: [
        {
          id: crypto.randomUUID(),
          type: "score-create",
          timestamp: new Date().toISOString(),
          body: {
            traceId,
            name: category || "user-feedback",
            value: score,
            comment: comment || ""
          }
        }
      ]
    });

    console.log(`Feedback recorded: ${feedbackId}`);

    return new Response(
      JSON.stringify({ status: "Feedback recorded", feedbackId }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://ronaksethiya.com"
        }
      }
    );
  } catch (error) {
    console.error("Feedback error:", error);
    return errorResponse("Invalid feedback submission", 400);
  }
}
__name(handleFeedback, "handleFeedback");

async function getAnalytics(env, request) {
  try {
    const url = new URL(request.url);
    const adminKey = url.searchParams.get("key");

    if (adminKey !== env.ADMIN_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    const feedbackList = await env.FEEDBACK_KV.list({ limit: 100 });
    const feedbacks = await Promise.all(
      feedbackList.keys.map(async (key) => {
        const data = await env.FEEDBACK_KV.get(key.name, "json");
        return data;
      })
    );

    const validFeedbacks = feedbacks.filter((f) => f !== null);

    const stats = {
      totalFeedback: validFeedbacks.length,
      averageScore: validFeedbacks.length > 0
        ? validFeedbacks.reduce((sum, f) => sum + f.score, 0) / validFeedbacks.length
        : 0,
      categoryBreakdown: {},
      recentFeedback: validFeedbacks.slice(-10).reverse()
    };

    validFeedbacks.forEach((f) => {
      stats.categoryBreakdown[f.category] = (stats.categoryBreakdown[f.category] || 0) + 1;
    });

    return new Response(JSON.stringify(stats, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://ronaksethiya.com"
      }
    });
  } catch (error) {
    return errorResponse("Analytics error: " + error.message, 500);
  }
}
__name(getAnalytics, "getAnalytics");

function hashIp(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash = hash & hash;
  }
  return `user-${Math.abs(hash)}`;
}
__name(hashIp, "hashIp");

function errorResponse(message, status = 500, extraHeaders = {}) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://ronaksethiya.com",
        ...extraHeaders
      }
    }
  );
}
__name(errorResponse, "errorResponse");

function healthCheck(env) {
  const checks = {
    worker: "ok",
    groq_key: env.GROQ_API_KEY ? "ok" : "missing",
    langfuse_keys: env.LANGFUSE_PUBLIC_KEY && env.LANGFUSE_SECRET_KEY ? "ok" : "missing",
    rate_limit_kv: env.RATE_LIMIT_KV ? "ok" : "missing",
    feedback_kv: env.FEEDBACK_KV ? "ok" : "missing",
    knowledge_source: "intent_scoped_kb"
  };

  return new Response(JSON.stringify(checks, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://ronaksethiya.com"
    }
  });
}
__name(healthCheck, "healthCheck");

function detectIntent(message, history) {
  const lowerMessage = message.toLowerCase();

  const isRecruiter = history.some(
    (msg) => msg.content && (
      msg.content.toLowerCase().includes("recruit") ||
      msg.content.toLowerCase().includes("hiring") ||
      msg.content.toLowerCase().includes("position") ||
      msg.content.toLowerCase().includes("interview") ||
      msg.content.toLowerCase().includes("job opening") ||
      msg.content.toLowerCase().includes("candidate") ||
      msg.content.toLowerCase().includes("resume") ||
      msg.content.toLowerCase().includes("cv")
    )
  ) || lowerMessage.includes("recruit") || lowerMessage.includes("hiring") || lowerMessage.includes("candidate");

  let category = "general";

  if (lowerMessage.match(/\b(ai|artificial intelligence|llm|machine learning|ml|langchain|agent|rag|gpt|chatbot|gemma|langraph|langgraph)\b/)) {
    category = "ai_skills";
  } else if (lowerMessage.match(/\b(project|portfolio|case study|built|developed|implemented|demo|github|app)\b/)) {
    category = "projects";
  } else if (lowerMessage.match(/\b(experience|role|responsibility|job|career|company|yes bank|idfc|l&t|larsen)\b/)) {
    category = "experience";
  } else if (lowerMessage.match(/\b(technical|skill|technology|tool|api|system|python|sql|stack|code|programming)\b/)) {
    category = "technical";
  } else if (lowerMessage.match(/\b(achievement|award|success|accomplishment|impact|result|metric)\b/)) {
    category = "achievements";
  } else if (lowerMessage.match(/\b(education|degree|study|iit|college|mba|university|bombay|fcrit)\b/)) {
    category = "education";
  } else if (lowerMessage.match(/\b(team|manage|leadership|lead|mentor|collaborate|stakeholder)\b/)) {
    category = "leadership";
  }

  return { category, isRecruiter };
}
__name(detectIntent, "detectIntent");

function buildSystemPrompt(intent) {
  const relevantKB = getRelevantKB(intent);

  const recruiterEmphasis = intent.isRecruiter
    ? `\n\nIMPORTANT — RECRUITER DETECTED: This person is likely evaluating Ronak for a role. Lead with impact and results. Emphasize the AI-powered Lead Management System, blockchain project, 1M+ daily transactions platform scale, and hands-on AI prototyping. Connect experiences to the value Ronak brings to an AI-driven product team. Include links to relevant case studies.`
    : "";

  const categoryGuidance = {
    "ai_skills":    "\n\nDIRECTION: Go deep on AI work. Reference specific frameworks, architectures, and real implementations. Link to relevant project pages.",
    "projects":     "\n\nDIRECTION: Tell the story of each project — the problem, what Ronak did, and the measurable outcome. Always include the project link from the portfolio.",
    "technical":    "\n\nDIRECTION: Be specific about tools, languages, and systems. Show technical depth but keep it accessible.",
    "achievements": "\n\nDIRECTION: Lead with numbers and business impact. Every achievement should have a metric attached.",
    "leadership":   "\n\nDIRECTION: Give concrete examples of leading teams, aligning stakeholders, and driving cross-functional execution.",
    "education":    "\n\nDIRECTION: Highlight IIT Bombay MBA, engineering foundation, and how education connects to current work.",
    "experience":   "\n\nDIRECTION: Walk through the career arc — engineering roots at L&T, credit risk strategy at IDFC, to platform PM and AI at Yes Bank. Show progression.",
  };

  const basePrompt = `You are Ronak Sethiya's AI — a conversational assistant on his portfolio website. You speak as Ronak in first person ("I built...", "At Yes Bank, I...").

VOICE & TONE:
- Warm, confident, and conversational — like a smart colleague explaining their work over coffee
- NOT robotic, NOT salesy, NOT generic-corporate
- Use first person naturally: "I led...", "What excited me about this was...", "The tricky part was..."
- Show genuine enthusiasm for the work without being over-the-top
- Be direct. Open with the answer, then add context

RESPONSE FORMAT:
- Your output is rendered as HTML inside a chat widget. You may use basic inline HTML for formatting.
- Use <b>bold</b> for key metrics, company names, and project names
- Use <br><br> for paragraph breaks (NOT markdown newlines)
- For lists, use simple <br> separated lines with "→" as bullets, e.g.: <br>→ Built RAG chatbot<br>→ Deployed multi-modal agent
- When referencing a project, include a clickable link: <a href="https://ronaksethiya.com/projects/slug/" style="color:#6b8ef7;">Project Name</a>
- NEVER use markdown syntax (no **, no ##, no - bullets). Only use HTML.
- Keep responses 3-6 sentences for simple questions, longer (with structure) for deep-dive questions
- End with a natural follow-up prompt when appropriate: "Want me to walk you through the technical architecture?" or "I can share more about the AI side of this — interested?"

KNOWLEDGE BASE:
${relevantKB}
${recruiterEmphasis}${categoryGuidance[intent.category] || ""}

BOUNDARIES:
- Only discuss topics covered in the knowledge base
- For off-topic questions, redirect warmly: "That's a great question! My expertise is really in fintech and AI product management though — want to hear about a project I'm excited about?"
- If you don't have specific details, say so honestly and pivot to what you do know
- Never fabricate metrics, dates, or project details not in the knowledge base`;

  return basePrompt;
}
__name(buildSystemPrompt, "buildSystemPrompt");

export {
  index_default as default
};
