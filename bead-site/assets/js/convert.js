// convert.js — image -> bead grid conversion and canvas rendering.
import { srgbToLab, nearestColorId } from './color.js';
import { PALETTE } from './palette.js';

/**
 * Convert an image into a bead grid.
 * The image is downscaled (high-quality) to `boardWidth` columns, then every
 * pixel is matched to the nearest Artkal color in Lab space. Large images are
 * processed in row chunks to keep memory peaks low.
 *
 * @param {HTMLImageElement|ImageBitmap|HTMLCanvasElement} image
 * @param {number} boardWidth target grid width in beads
 * @param {Object} [opts] { maxHeight=80, onProgress }
 * @returns {Promise<{grid:string[][], preview:Uint8ClampedArray, width:number, height:number}>}
 */
export async function imageToBeads(image, boardWidth, opts = {}) {
  const { maxHeight = 80, onProgress } = opts;
  const natW = image.naturalWidth || image.width;
  const natH = image.naturalHeight || image.height;
  if (!natW || !natH) throw new Error('图片尺寸无效');

  const scale = boardWidth / natW;
  let height = Math.max(1, Math.round(natH * scale));
  if (height > maxHeight) height = maxHeight;
  const width = Math.max(1, Math.round(boardWidth));

  // Draw scaled to an offscreen canvas (high-quality smoothing approximates LANCZOS).
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data; // RGBA

  const grid = [];
  const preview = new Uint8ClampedArray(width * height * 3);

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const rgb = [data[i], data[i + 1], data[i + 2]];
      const id = nearestColorId(rgb);
      row.push(id);
      const c = PALETTE[id];
      const p = (y * width + x) * 3;
      preview[p] = c.r;
      preview[p + 1] = c.g;
      preview[p + 2] = c.b;
    }
    grid.push(row);
    if (onProgress && y % Math.max(1, Math.floor(height / 10)) === 0) {
      onProgress(y / height);
    }
  }
  if (onProgress) onProgress(1);

  return { grid, preview, width, height };
}

/**
 * Pick a readable label color (black/white) for a given bead color.
 * @param {{r:number,g:number,b:number}} c
 * @returns {string}
 */
function pickTextColor(c) {
  if (!c) return '#000';
  const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  return lum > 150 ? '#222222' : '#ffffff';
}

/**
 * Render a bead grid to a canvas with light gray strokes.
 * @param {HTMLCanvasElement} canvas
 * @param {string[][]} grid 2D array of color ids (or null for empty)
 * @param {number} cell pixel size of each bead cell
 * @param {Object} [opts] { labels=false, stroke='#cfd8e3', pad=1 }
 */
export function renderGrid(canvas, grid, cell, opts = {}) {
  const { labels = false, stroke = '#cfd8e3', pad = 1 } = opts;
  const h = grid.length;
  const w = grid[0] ? grid[0].length : 0;
  canvas.width = w * cell;
  canvas.height = h * cell;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const id = grid[y][x];
      const c = id ? PALETTE[id] : null;
      ctx.fillStyle = c ? c.hex : '#ffffff';
      ctx.fillRect(x * cell + pad, y * cell + pad, cell - pad * 2, cell - pad * 2);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(x * cell + pad, y * cell + pad, cell - pad * 2, cell - pad * 2);
      if (labels && cell >= 14 && id) {
        ctx.fillStyle = pickTextColor(c);
        ctx.font = `${Math.floor(cell * 0.34)}px ui-sans-serif, sans-serif`;
        ctx.fillText(id, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }
}

/**
 * Render a pixelated preview (averaged colors) to a canvas.
 * The canvas is resized to width*cell × height*cell based on the preview array.
 * @param {HTMLCanvasElement} canvas
 * @param {Uint8ClampedArray} preview flattened RGB (length = w*h*3)
 * @param {number} cell pixel size of each preview pixel
 */
export function renderPreview(canvas, preview, cell) {
  const w = Math.floor(canvas.width / cell);
  const h = Math.floor(canvas.height / cell);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 3;
      ctx.fillStyle = `rgb(${preview[p]},${preview[p + 1]},${preview[p + 2]})`;
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.imageToBeads = imageToBeads;
BeadStudio.renderGrid = renderGrid;
BeadStudio.renderPreview = renderPreview;
