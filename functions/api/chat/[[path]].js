/**
 * Cloudflare Pages Function — Proxy for AI Chat API
 * Catches all /api/chat/* routes (including /api/chat, /api/chat/rag, /api/chat/feedback)
 * and proxies them to the Cloudflare Worker.
 */

const WORKER_BASE = "https://ai-chat-proxy.ronakss-rj.workers.dev";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Map /api/chat/* paths to the worker
  // /api/chat       → worker /
  // /api/chat/rag   → worker /rag
  // /api/chat/feedback → worker /feedback
  let workerPath = url.pathname.replace("/api/chat", "") || "/";

  const workerUrl = `${WORKER_BASE}${workerPath}${url.search}`;

  // Forward the request with original method, headers, and body
  const proxyRequest = new Request(workerUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
  });

  const response = await fetch(proxyRequest);

  // Clone response and add CORS headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return newResponse;
}
