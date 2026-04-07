---
title: "RAG Chatbot: Building a PM Interview Knowledge Engine"
date: 2026-04-08
description: "How I built a dual-mode AI chatbot with a full RAG pipeline using Cloudflare Vectorize, Workers AI, and Groq — turning my PM interview experiences into a searchable, conversational knowledge base."
tags: ["AI", "RAG", "Cloudflare Workers", "Vectorize", "Product Management", "Prompt Engineering", "LLM"]
---

## From Static Prompts to Retrieval-Augmented Generation

*My portfolio already had an AI chatbot — a prompt-engineered assistant that could talk about my work. But I wanted something sharper: a second mode that answers PM interview questions grounded in my actual experience, not general knowledge. This is how I built a full RAG pipeline using Cloudflare's AI stack.*

---

### The Problem: Generic Answers to Specific Questions

The original chatbot was effective for portfolio conversations — "Tell me about your projects" or "What's your tech stack?" — but it struggled with deeper PM interview questions. Ask it "How did you handle a scaling challenge?" and it would give a reasonable but *generic* answer, drawing loosely from its baked-in knowledge base.

I needed answers that cited specific metrics, timelines, and outcomes from my real experiences. Not "I believe in data-driven decision making" but "Our settlement table hit 45 crore rows, so I audited 30+ queries and implemented date-based partitioning with a 10-minute downtime window."

---

### The Solution: A Dual-Mode Architecture

Rather than replacing the existing chatbot, I built a **toggleable dual-mode system**:

* **Chat Mode** — The original prompt-based assistant. Warm, conversational, great for general portfolio questions.
* **PM Expert Mode** — A RAG-powered engine that retrieves relevant experiences from a vector database and answers *only* from those. Factual, structured, interview-ready.

The difference in answers is stark — by design.

---

### How It Works Under the Hood

The RAG pipeline runs entirely on Cloudflare's edge infrastructure:

1. **Knowledge Base → Vectors:** I distilled 25 PM experience "atoms" — each a self-contained story (scaling challenges, stakeholder conflicts, process redesigns, vendor negotiations). These are embedded using **Workers AI** (`bge-base-en-v1.5`, 768 dimensions) and stored in **Cloudflare Vectorize**.

2. **Query → Retrieval:** When a user asks a question in PM Expert mode, their query is embedded in real-time and matched against the vector index. The top 5 most relevant experiences are retrieved, filtered by a similarity threshold to avoid noise.

3. **Context → Generation:** Retrieved experiences are injected into a carefully engineered system prompt, and **Groq's Llama 3.3 70B** generates the response — grounded exclusively in the retrieved context.

4. **Full Observability:** Both modes have complete **Langfuse tracing** — embedding latency, vector search scores, LLM generation metrics — so I can compare performance across thousands of conversations.

---

### The PM Thinking Behind It

Several decisions here were driven by product instinct, not just engineering:

* **Preserving Both Modes:** Users visiting my portfolio want different things. A recruiter browsing casually benefits from Chat mode. Someone preparing for a PM interview discussion benefits from PM Expert. Forcing one mode would underserve half the audience.
* **Prompt Engineering for Tone:** The hardest part wasn't the RAG pipeline — it was making the LLM sound like *me* in an interview, not a document retrieval system. The prompt explicitly bans generic conclusions like "This taught me the importance of..." and instructs the model to lead with the most impressive metric first.
* **Edge-First Architecture:** The entire pipeline — embedding, vector search, and routing — runs on Cloudflare's edge. No cold starts, no external vector DB, no separate embedding service. Latency stays under 2 seconds.

---

### Try It Yourself

Open the chat widget on any page of this website. Toggle to **PM Expert** mode and try:

* *"How did you handle a database scaling challenge?"*
* *"Tell me about a stakeholder conflict you resolved"*
* *"Are you a good PM?"*

Then switch to **Chat** mode and ask the same questions. The difference is the point.

---

### Technical Stack

* **Cloudflare Vectorize** — Vector storage and similarity search
* **Cloudflare Workers AI** — Embedding generation (bge-base-en-v1.5)
* **Groq + Llama 3.3 70B** — LLM inference
* **Langfuse** — Observability and tracing
* **Cloudflare Pages Functions** — API proxy layer
