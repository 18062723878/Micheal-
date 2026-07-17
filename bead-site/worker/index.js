// worker/index.js — Cloudflare Worker (edge enhancement).
// The site is fully functional without this worker. When deployed and the
// frontend's BEAD_WORKER_BASE points here, two endpoints become available:
//   POST /api/convert  — receives a bead grid / board info and acknowledges
//                         edge-side processing (client still renders & exports).
//   POST /api/ai-proxy — forwards a prompt to an OpenAI-compatible images API
//                         using the secret API_KEY, returning the image.

/**
 * @typedef {Object} Env
 * @property {string} [API_KEY]
 * @property {string} [API_BASE]
 * @property {string} [MODEL]
 */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function handleConvert(request) {
  try {
    const body = await request.json();
    const grid = body.grid;
    const h = Array.isArray(grid) ? grid.length : 0;
    const w = h && Array.isArray(grid[0]) ? grid[0].length : 0;
    // Edge enhancement hook: you could re-render/server-store here. The client
    // remains the source of truth for rendering & export.
    return json({
      ok: true,
      width: w,
      height: h,
      op: body.op || 'export',
      size: body.size || null,
      note: 'processed-at-edge'
    });
  } catch (e) {
    return json({ ok: false, error: String(e && e.message ? e.message : e) }, 400);
  }
}

async function handleAiProxy(request, env) {
  if (!env.API_KEY) {
    // Frontend detects this and shows the "configure API key" tutorial link.
    return json({ error: 'NO_KEY' }, 200);
  }
  try {
    const body = await request.json();
    const prompt = (body.prompt || '').toString().slice(0, 1000);
    const apiBase = env.API_BASE || 'https://api.openai.com/v1/images/generations';
    const model = env.MODEL || 'dall-e-2';
    const upstreamRes = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '512x512',
        model,
        response_format: 'b64_json'
      })
    });
    if (!upstreamRes.ok) {
      return json({ error: 'UPSTREAM_' + upstreamRes.status }, upstreamRes.status);
    }
    const data = await upstreamRes.json();
    const b64 = data && data.data && data.data[0] && data.data[0].b64_json;
    if (!b64) return json({ error: 'EMPTY_RESPONSE' }, 502);
    return json({ image: 'data:image/png;base64,' + b64 });
  } catch (e) {
    return json({ error: String(e && e.message ? e.message : e) }, 500);
  }
}

export default {
  /** @param {Request} request @param {Env} env */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    if (request.method === 'POST' && url.pathname === '/api/convert') {
      return handleConvert(request);
    }
    if (request.method === 'POST' && url.pathname === '/api/ai-proxy') {
      return handleAiProxy(request, env);
    }
    return new Response('Not Found', { status: 404 });
  }
};
