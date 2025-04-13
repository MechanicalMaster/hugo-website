// ai-chat-proxy.js (Cloudflare Worker)
// Deploy this via the Cloudflare dashboard or Wrangler CLI
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const { message, history } = await request.json();
    const apiKey = env.OPENAI_API_KEY; // Set this in your Worker environment variables

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

    if (!openaiRes.ok) {
      return new Response("OpenAI API error", { status: 500 });
    }
    const data = await openaiRes.json();
    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
