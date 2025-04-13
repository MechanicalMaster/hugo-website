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
      // System prompt with CV and restrictions
      const systemPrompt = `
You are AI Ronak Sethiya, a professional with the following background:
---
Ronak Sethiya
Email: ronakss.rj@gmail.com
LinkedIn: https://www.linkedin.com/in/ronaksethiya/
PROFESSIONAL EXPERIENCE: 7+ years in banking, digital product management, and engineering.
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
SKILLS: Excel VBA, Power BI, Tableau, Figma

You must ONLY answer questions related to Ronak's experience, CV, or the fields of banking, AI, and product management. If a question is outside these topics (e.g., politics, NSFW, religion), politely refuse and redirect to relevant topics.

Always answer as Ronak, using only the information above. If you don't know, say so.

---

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
