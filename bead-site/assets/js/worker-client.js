// worker-client.js — talk to the optional Cloudflare Worker (edge enhancement).
// If no worker base is configured (or the call fails), the provided local
// fallback runs instead, so the site works fully offline.

/**
 * Configure the worker base URL (e.g. "https://bead.your-subdomain.workers.dev").
 * Leave empty to force local-only operation.
 * @param {string} url
 */
export function setWorkerBase(url) {
  window.BEAD_WORKER_BASE = url || '';
}

/**
 * Read the configured worker base URL.
 * @returns {string}
 */
export function getWorkerBase() {
  return window.BEAD_WORKER_BASE || '';
}

/**
 * POST to a worker endpoint with graceful degradation.
 * @param {string} path e.g. "/api/convert" or "/api/ai-proxy"
 * @param {Object} payload request body
 * @param {Function} [localFallback] (payload) => any  run when no worker / on error
 * @returns {Promise<any>} worker JSON response, or the fallback's return value
 */
export async function callWorker(path, payload, localFallback) {
  const base = getWorkerBase();
  if (!base) {
    if (localFallback) return localFallback(payload);
    return null;
  }
  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Worker 返回状态 ' + res.status);
    return await res.json();
  } catch (e) {
    if (localFallback) return localFallback(payload);
    throw e;
  }
}

/**
 * Call /api/convert on the worker (or run the local fallback).
 * @param {Object} payload { grid, op, format, size }
 * @param {Function} [localFallback]
 * @returns {Promise<any>}
 */
export function convertWithWorker(payload, localFallback) {
  return callWorker('/api/convert', payload, localFallback);
}

/**
 * Call /api/ai-proxy on the worker (or run the local fallback).
 * @param {Object} payload { prompt }
 * @param {Function} [localFallback]
 * @returns {Promise<any>}
 */
export function aiProxy(payload, localFallback) {
  return callWorker('/api/ai-proxy', payload, localFallback);
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.setWorkerBase = setWorkerBase;
BeadStudio.getWorkerBase = getWorkerBase;
BeadStudio.callWorker = callWorker;
BeadStudio.convertWithWorker = convertWithWorker;
BeadStudio.aiProxy = aiProxy;
