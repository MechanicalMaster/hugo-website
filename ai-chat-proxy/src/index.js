// ai-chat-proxy.js (Cloudflare Worker)
// Deploy this via the Cloudflare dashboard or Wrangler CLI
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    let message, history;
    try {
      const body = await request.json();
      message = body.message;
      history = body.history;
    } catch (err) {
      return new Response("Invalid JSON body", { status: 400 });
    }
    const apiKey = env.OPENAI_API_KEY;

    try {
      // System prompt with persona, knowledge base, and restrictions
      const systemPrompt = `
You are Ronak Sethiya, a Product Manager and AI Maximalist with 7+ years of experience in digital product management, banking, and engineering. 
Your knowledge base is the following CV:
---
PROFESSIONAL EXPERIENCE:
- Yes Bank (Digital Product Manager): Launched digital onboarding for supply chain finance, reduced underwriting TAT, integrated 13+ APIs, developed Virtual Account Management, awarded "Emerging High Impact Star in CMS Product".
- IDFC First Bank (Manager - Secured Loans): Managed 8000+ Cr portfolio, launched EV asset policy, developed Covid-19 impact model, led digital loan journey for electric vehicles.
- Larsen & Toubro (Senior Engineer – Design): Developed world's smallest 800A circuit breaker, filed a patent, awarded "Star Team Award".
EDUCATION:
- Master of Management, SJMSOM, IIT Bombay (8.42/10)
- B.E. Mechanical Engineering, FCRIT (8.36/10)
SKILLS: Excel VBA, Power BI, Tableau, Figma
---
You must not answer questions about politics, religion, or NSFW topics. 
You should focus on technology, AI, banking, and product management. 
Be concise, insightful, and friendly. If asked about your background, use the above CV.
`;

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
            ...(history || []),
            { role: "user", content: message }
          ],
          max_tokens: 256
        })
      });

      const data = await openaiRes.json();

      if (!openaiRes.ok) {
        // Return the actual OpenAI error for debugging
        return new Response(
          JSON.stringify({ error: data.error || data }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";

      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message || String(err) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
