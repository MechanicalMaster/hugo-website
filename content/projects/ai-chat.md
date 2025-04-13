---
title: "AI Chat: Interactive AI Chatbot for Personal Website"
date: 2025-04-13
description: "A custom AI-powered chat widget built with Cloudflare Workers, OpenAI, and prompt engineering, seamlessly integrated into my Personal Website."
tags: ["AI", "Chatbot", "Cloudflare Workers", "OpenAI", "Prompt Engineering", "JavaScript", "Product Management"]
---

## AI Chat: Bringing Conversational AI to My Website

**Overview:**  
I designed and implemented a fully custom AI chat widget for my personal website, blending modern UI/UX with advanced AI capabilities. The key highlight is that responses are constructed to suit my professional experience and expertise.

---

### Implementation Highlights

- **Frontend Widget:**  
  - Built a responsive, minimalist chat bubble and window using vanilla JavaScript and CSS, styled to match the PaperMod Hugo theme.
  - Added animated callouts and tooltips to increase user engagement.
  - Included pre-made prompt cards (e.g., "Show me your latest project") for instant user interaction, with a mobile-first, accessible design.

- **Serverless Backend (Cloudflare Workers):**  
  - Developed a secure API proxy using Cloudflare Workers to handle chat requests and protect the OpenAI API key.
  - Integrated with OpenAI's GPT-3.5-turbo model for real-time, context-aware responses.

- **Prompt Engineering & Knowledge Base:**  
  - Crafted a system prompt that injects my CV and professional experience, ensuring the AI answers only about banking, AI, and product management.
  - Explicitly restricts the AI from discussing politics, NSFW, or unrelated topics, maintaining a professional tone.
  - The AI responds as "AI Ronak," referencing my actual achievements, skills, and project history.

---

### Key Features of the Code

- **System Prompt:**
  - Designed for natural, interview-like responses with storytelling (e.g., “One of my favorite challenges…”).
  - Restricts answers to my CV and domains (banking, AI, product management).
  - Handles follow-ups with context awareness (“As we discussed…”).
  - Redirects off-topic questions gracefully.
  - Includes specific guidance for common queries (e.g., team management, AI integration).

- **Security and Validation:**
  - Restricts to POST requests.
  - Validates message (string, <1000 chars) and history (array, <10 items).
  - Prevents JSON parsing errors with try/catch.

- **Performance:**
  - Dynamic `max_tokens` (100 for short queries, 256 for longer ones) for concise responses.
  - Handles OpenAI rate limits (429) with user-friendly errors.

- **Simultaneous Users:**
  - Stateless design ensures no response mixing, as each request is isolated.

---

### Key Technologies

- **Cloudflare Workers:** Serverless compute for scalable, low-latency API integration.
- **OpenAI API:** Advanced LLM for natural, context-driven conversations.

---

### Why This Matters

This project is more than a chatbot—it's a demonstration of:
- **End-to-end product thinking:** From UX to backend security and AI alignment.
- **Prompt engineering:** Controlling LLM output for domain-specific, recruiter-relevant answers.
- **Modern web skills:** Serverless, static site integration, and real-time interactivity.

**Try it live on my homepage or explore the [GitHub repo](https://github.com/MechanicalMaster/hugo-website) for implementation details!**

---

**Sample Prompt Engineering (Worker code):**
```js
const systemPrompt = `
You are AI Ronak Sethiya, a professional with the following background:
[...CV details...]
You must ONLY answer questions related to Ronak's experience, CV, or the fields of banking, AI, and product management. If a question is outside these topics (e.g., politics, NSFW, religion), politely refuse and redirect to relevant topics.
Always answer as Ronak, using only the information above. If you don't know, say so.
`;
