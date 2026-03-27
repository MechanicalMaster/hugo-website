---
title: "AI Biz: On-Device Intelligence for Merchant Payments"
date: 2026-03-27
description: "A fintech Android application that embeds fully local AI to help merchants manage daily payments, ensuring complete privacy, zero latency, and offline reliability."
tags: ["AI", "Android", "Kotlin", "MediaPipe", "Gemma 3", "Product Management", "Fintech"]
---

## AI Biz: Taming Dashboard Complexity with Edge AI

*As a Product Manager with a technical background, I built AI Biz to demonstrate my ability to conceive, design, and implement privacy-first, edge-AI features from end-to-end. This project showcases how product thinking can be combined with local LLM capabilities to solve real-world merchant problems securely.*

---

### The Problem: Dashboard Complexity and Information Friction

For quick-service merchants, managing daily UPI collections, tracking settlements, and generating QRs often involves navigating through complex, multi-layered dashboards. Finding simple answers to questions like "How much did I collect today?" creates unnecessary friction in fast-paced retail environments, where time is critical.

---

### My Solution: On-Device AI-Powered Insights

AI Biz is an Android application designed to tackle this problem head-on by embedding an AI Assistant directly into the bottom navigation bar (the "Insights" tab). It leverages Artificial Intelligence—specifically an entirely local Large Language Model (LLM)—to provide merchants with immediate answers. This allows merchants to:

* **Save Time:** Bypass complex UI navigation by simply asking natural language questions.
* **Maintain Utmost Privacy:** Ensure highly sensitive financial data never leaves the smartphone.
* **Operate Anywhere:** Get zero-latency answers even in areas with precarious network connectivity, avoiding cloud round-trips.

---

### How It Works: A User's Journey

The application offers a seamless, secure user experience:

1. **Model Import:** Upon first accessing the Insights tab, users undergo a one-time setup where the 300MB Gemma-3 model file (`gemma3-1B-it-int4.task`) is asynchronously copied to internal storage. A clear loading state mitigates the friction of this hardware constraint.
2. **Natural Language Query:** A merchant taps the microphone or types a question, such as "Navigate to settlements" or "Show me today's transactions."
3. **Local Processing:** The request is processed entirely on the phone using the MediaPipe LLM Inference API. 
4. **Instant Action:** The app instantly fulfills the request by routing the user to the correct screen or fetching the relevant local database mocks, displaying the answer immediately.

---

### Under the Hood: The Technology Stack

This application is built using a modern, robust mobile technology stack:

* **Frontend:**
  * **Kotlin & Jetpack Compose:** For a fast, declarative, and dynamic native Android UI.
  * **Material Design 3:** For accessible, responsive components like `NavigationBar`, `Scaffold`, and `MessageBubble`.
* **AI & Inference:**
  * **MediaPipe LLM Inference API:** Google's framework for running sophisticated LLMs directly on edge devices.
  * **Gemma-3 1B int4:** A highly optimized, 1-billion parameter model quantized to 4-bit integers to fit within mobile RAM and storage constraints.
* **Device Integration:**
  * **Android SpeechRecognizer:** For seamless voice-to-text input, allowing hands-free operation.
  * **TextToSpeech (TTS):** To vocalize the AI's responses for improved accessibility.

---

### Key AI Capabilities: The Semantic Routing Engine

The core AI functionality revolves around treating the LLM not just as a chatbot, but as an invisible semantic routing engine:

1. **Context-Tight Inference:** Due to mobile memory limits, we intentionally do not feed the entire chat history back to the model. We process single-turn intent extraction to keep inference fast.
2. **Function Calling & Prompt Engineering:** 
   * The system prompt is ruthlessly concise. The AI is strictly instructed to extract user intent and return a clean JSON payload mapping to specific app tools (e.g., `{"type":"tool_call", "name":"getCollections", "arguments":{"dateRange":"today"}}`).
   * By enforcing the rule *"Output ONLY a single JSON object, no explanation,"* we drastically reduced formatting errors and hallucinations.
3. **Deterministic Execution:** Instead of a secondary LLM pass for natural language generation, the app parses the returned JSON and drives the UI deterministically using local data. This guarantees 100% accurate financial numbers and vastly accelerates the user experience.

---

### Product Thinking in Action

Several design and architectural decisions were guided by product strategy and a relentless focus on the merchant experience:

* **Uncompromising Privacy-First Design:** Choosing edge-deployment over cloud APIs was a deliberate product decision. Financial data is profoundly sensitive; zero data transmission inherently builds profound user trust.
* **Cost Efficiency at Scale:** Running inference natively on consumer hardware zeroes out the high variable costs associated with cloud LLM infrastructure per query, keeping the product highly scalable.
* **Mitigating Hardware Constraints:** We offset the heavy compute/storage requirements by designing asynchronous import states and using deterministic UI mapping to keep UX snappy despite mobile processing limitations.
* **Solving the "Real" Problem:** We recognized that merchants don't want to chat with an AI; they want fast answers. Constraining the model into a strict semantic router directly served this implicit user need.

---

### Outcome: Shipping Edge AI Features End-to-End

This AI Biz project serves as a tangible demonstration of my ability to:

* **Identify a User Need:** Recognize the pain point of finding information in complex merchant dashboards and conceptualize an AI-driven, hands-free solution.
* **Make Pragmatic Technical Trade-offs:** Choose a quantized 1B local model over a massive cloud LLM to prioritize privacy, offline reliability, and cost-efficiency over generalized chat capabilities.
* **Design a User-Friendly Product:** Translate the solution into an intuitive "Insights" interface, masking the complexity of local model loading behind clean UX.
* **Architect and Implement Mobile AI:** Utilize modern Android native technologies (Kotlin, Compose) alongside cutting-edge edge inference tools (MediaPipe) to build a robust application.
* **Iterate via Prompt Engineering:** Successfully refine rigid system prompts to force the LLM into a structured JSON output engine, effectively bridging the gap between unpredictable AI and deterministic software requirements.
* **Think and Act Like a Product Owner:** Manage the development lifecycle from UI/UX design matching strict Figma specs to ensuring the final product strategically addresses core business constraints.

As a Product Manager with a hands-on technical approach, this project highlights my capacity to define what to build, deeply understand how edge AI features are implemented, and navigate the unique technical constraints of bringing massive models to mobile devices. 

---

### See it in Action

Explore the project firsthand:

* **GitHub Repository:** [https://github.com/MechanicalMaster/LocalAIModel.git](https://github.com/MechanicalMaster/LocalAIModel.git)
