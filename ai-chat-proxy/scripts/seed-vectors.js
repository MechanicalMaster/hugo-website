#!/usr/bin/env node

/**
 * Seed Vectors Script
 * 
 * Seeds the PM knowledge base into Cloudflare Vectorize.
 * This script is used via the Worker's /admin/seed endpoint.
 * 
 * Usage (after deploying the Worker):
 *   curl -X POST "https://ai-chat-proxy.<your-subdomain>.workers.dev/admin/seed?key=YOUR_ADMIN_KEY"
 * 
 * Or during local dev (with --remote flag for Vectorize):
 *   npx wrangler dev --remote
 *   curl -X POST "http://localhost:8787/admin/seed?key=YOUR_ADMIN_KEY"
 * 
 * What this does:
 * 1. Reads all 25 PM knowledge atoms (embedded in the Worker code)
 * 2. Generates embeddings using Workers AI (@cf/baai/bge-base-en-v1.5)
 * 3. Upserts vectors with metadata into the "pm-knowledge-index" Vectorize index
 * 
 * Prerequisites:
 * 1. Create the Vectorize index:
 *    npx wrangler vectorize create pm-knowledge-index --preset "@cf/baai/bge-base-en-v1.5"
 * 
 * 2. Set the ADMIN_KEY secret:
 *    npx wrangler secret put ADMIN_KEY
 * 
 * Notes:
 * - The knowledge base is embedded directly in src/index.js (no file system in Workers)
 * - Embeddings use bge-base-en-v1.5 (768 dimensions, cosine similarity)
 * - Each atom is embedded as: "{title}: {summary}. {content}"
 * - Metadata stored: title, summary, content, tags, use_cases
 * - Vectors are upserted (safe to re-run — updates existing vectors)
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           PM Knowledge Base — Vector Seeding Guide          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Step 1: Create the Vectorize index (one-time)               ║
║  $ npx wrangler vectorize create pm-knowledge-index \\        ║
║      --preset "@cf/baai/bge-base-en-v1.5"                    ║
║                                                              ║
║  Step 2: Deploy the Worker                                   ║
║  $ npx wrangler deploy                                       ║
║                                                              ║
║  Step 3: Seed the knowledge base                             ║
║  $ curl -X POST \\                                            ║
║      "https://ai-chat-proxy.YOUR.workers.dev/admin/seed\\     ║
║       ?key=YOUR_ADMIN_KEY"                                   ║
║                                                              ║
║  Step 4: Verify                                              ║
║  $ curl "https://ai-chat-proxy.YOUR.workers.dev/health"      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
