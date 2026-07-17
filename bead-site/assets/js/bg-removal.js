// bg-removal.js — lazy-load @imgly/background-removal (WASM) and strip background.
// Degrades gracefully: any failure rejects so callers can skip background removal.

let _removeFn = null;
let _loading = null;

/**
 * Lazily import the background-removal module from CDN.
 * @returns {Promise<Function>} the removeBackground function
 */
function getRemover() {
  if (_removeFn) return Promise.resolve(_removeFn);
  if (_loading) return _loading;
  _loading = import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/dist/index.mjs')
    .then((mod) => {
      if (typeof mod.removeBackground !== 'function') {
        throw new Error('背景抠除模块未导出 removeBackground');
      }
      _removeFn = mod.removeBackground;
      return _removeFn;
    })
    .catch((err) => {
      _loading = null; // allow retry
      throw err;
    });
  return _loading;
}

/**
 * Remove the background of an image/canvas, returning a canvas with alpha.
 * @param {HTMLImageElement|HTMLCanvasElement} image
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function removeBackground(image) {
  const fn = await getRemover();
  // The library accepts Blob/Image/Canvas/URL and returns a Blob (PNG with alpha).
  const input = image instanceof HTMLCanvasElement ? await canvasToBlob(image) : image;
  const outBlob = await fn(input);
  const bmp = await createImageBitmap(outBlob);
  const canvas = document.createElement('canvas');
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bmp, 0, 0);
  return canvas;
}

/**
 * Convert a canvas to a PNG Blob.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.removeBackground = removeBackground;
