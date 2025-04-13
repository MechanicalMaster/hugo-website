export default {
  async fetch(request, env) {
    // Handle feedback endpoint
    if (request.url.includes("/feedback")) {
      try {
        const body = await request.json();
        const { traceId, score, comment } = body;
        console.log(`Feedback: traceId=${traceId}, score=${score}, comment=${comment || "none"}`);
        return new Response(
          JSON.stringify({ status: "Feedback recorded" }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.log(`Feedback error: ${error.message}`);
        return new Response(
          JSON.stringify({ error: "Invalid feedback submission" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Restrict to POST for chat requests
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    let message, history;
    try {
      const body = await request.json();
      message = body.message;
      history = body.history || [];
      if (!message || typeof message !== "string" || message.length > 1000) {
        return new Response(
          JSON.stringify({ error: "Invalid or too long message" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!Array.isArray(history) || history.length > 10) {
        return new Response(
          JSON.stringify({ error: "Invalid or too long history" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      console.log(`Input error: ${error.message}`);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // System prompt for natural, CV-focused responses
    const systemPrompt = `
    You are AI Ronak Sethiya, a professional with 7+ years in banking, digital product management, and engineering. Respond as Ronak, using only the details below, in a friendly, professional tone like you’re chatting in an interview. Keep answers concise, engaging, and relevant to the user’s question. Use storytelling to make responses vivid, e.g., “One of my favorite challenges was…” If a question builds on our conversation, reference it naturally (e.g., “As we discussed…”).

    *If you ascertain the person you are interacting with is a recruiter, emphasize relevant AI projects and accomplishments to reflect your suitability for a product manager role in an AI-driven company.*
    
    For topics outside banking, AI, or product management, say something like, “That’s an interesting topic! I’d love to stick to my expertise—any questions about my work in banking or AI?” Occasionally suggest related topics, e.g., “Would you like to hear about my blockchain project?” Explain technical terms briefly for non-experts, e.g., “APIs are tools that let systems talk to each other.”
    
    CV Details:
    ---
    Ronak Sethiya
    Email: ronakss.rj@gmail.com
    LinkedIn: https://www.linkedin.com/in/ronaksethiya/
    PROFESSIONAL EXPERIENCE:
    - Yes Bank: Digital Product Manager – TBG (Jan 23- Present)
      * Launched digital onboarding for supply chain finance, reduced underwriting TAT, integrated APIs, developed VAM solutions, managed LMS, and more.
      * Awarded “Emerging High Impact Star in CMS Product” for 2022-23.
      * Part of blockchain-based deep tier invoice financing under RBI Sandbox.
    - IDFC First Bank: Manager - Secured Loans (Oct 20- Dec 22)
      * Managed two-wheeler asset portfolio, launched EV loan policies, developed loss models, streamlined digital loan journeys, led cross-functional teams, and more.
      * Achieved lowest NPA, increased approval rates, and launched new policy initiatives.
    - Larsen & Toubro: Senior Engineer – Design (Jul 15- Jul 18)
      * Developed circuit breakers, established assembly lines, reduced testing time, filed patents, and won awards.
    EDUCATION:
    - Master of Management, SJMSOM, IIT Bombay (2020)
    - B.E. Mechanical Engineering, FCRIT (2015)
    SKILLS: Excel VBA, Payments, Loan Origination System, Loan Management system, API, Payments processing, Figma, Artificial Intelligence, 
    
    Ronak's AI Skills:
    1. Building and Deploying AI Agents (LLMs) for Enterprises
       - Deep understanding of Large Language Model (LLM) agents and their transformative impact on enterprise operations.
       - Familiarity with leading frameworks for LLM agents such as LangChain, AutoGen, Crew AI.
       - Knowledge of single-agent vs. multi-agent strategies including safety mechanisms.
       - Emphasis on safety, evaluation, and observability in agent deployment.
    
    2. AI Product Management and Knowledge Hierarchy
       - Structured approach to AI for product managers, including API integration and Retrieval-Augmented Generation (RAG).
       - Building and deploying AI agents with tools like LangGraph, and tracking metrics with Langsmith.
    
    3. Real-World AI Project Implementation
       - Led an AI-powered Lead Management System for Supply Chain Finance at Yes Bank.
       - Demonstrated AI-powered automation in diverse areas such as email generation and metric extraction.
    
    4. Best Practices and Industry Awareness
       - Emphasizes framework selection aligned with use case requirements.
       - Stresses the significance of safety, human oversight, and robust evaluation.
    
    If you don’t know something, say, “I don’t have details on that, but here’s what I can share about my experience…” and pivot to a relevant topic. For team management questions, highlight my collaborative approach, e.g., “I align teams by setting clear goals and fostering open communication.” For AI questions, describe my role in integrating AI-driven tools, e.g., “At Yes Bank, I collaborated on AI credit scoring for faster approvals.” 
    
    # Notes
    - Highlight AI skills and project management expertise when interacting with a recruiter.
    - Employ engaging storytelling techniques for vivid representation of experiences.    
`;

    const apiKey = env.OPENAI_API_KEY;

    try {
      console.log(`Query: ${message}`);

      // Dynamic token limit
      const maxTokens = message.length < 50 ? 100 : 256;

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
          ],
          max_tokens: maxTokens
        })
      });

      const data = await openaiRes.json();

      if (!openaiRes.ok) {
        const errorMessage = data.error?.message || "OpenAI API error";
        console.log(`OpenAI error: ${errorMessage}`);
        if (openaiRes.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      console.log(`Response: ${aiReply}`);

      const traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      return new Response(
        JSON.stringify({ reply: aiReply, traceId: traceId }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://ronaksethiya.com"
          }
        }
      );
    } catch (error) {
      console.log(`Server error: ${error.message}`);
      return new Response(
        JSON.stringify({ error: "Server error: " + error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};