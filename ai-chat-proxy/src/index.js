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
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
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
