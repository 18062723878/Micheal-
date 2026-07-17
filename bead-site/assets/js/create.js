// create.js — orchestrates the "创作" page: AI panel, upload pipeline,
// board-width control, palette, stats, exports, similar-image flow and the
// whiteboard editor. Loaded as a module by create.html.

import { setupUpload } from './upload.js';
import { imageToBeads, renderGrid, renderPreview } from './convert.js';
import { exportPNG, exportCSV, exportPDF } from './exporter.js';
import { PALETTE } from './palette.js';
import { initAi } from './ai.js';
import { mountWhiteboard } from './editor.js';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function cellFor(maxCell, w, maxTotal) {
  return Math.max(4, Math.min(maxCell, Math.floor(maxTotal / w)));
}

function renderStats(grid, statsEl) {
  if (!statsEl) return;
  const counts = {};
  grid.forEach((row) => row.forEach((id) => { if (id) counts[id] = (counts[id] || 0) + 1; }));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    statsEl.innerHTML = '<p class="empty">暂无用色</p>';
    return;
  }
  statsEl.innerHTML = entries
    .map(([id, n]) => {
      const c = PALETTE[id];
      return `<div class="stat-row"><span class="stat-sw" style="background:${c.hex}"></span><span class="stat-id">${id}</span><span class="stat-name">${c.name}</span><span class="stat-n">×${n}</span></div>`;
    })
    .join('');
}

/**
 * Convert an image to beads and paint both a grid canvas and a preview canvas.
 * @returns {Promise<{grid:string[][], preview:Uint8ClampedArray, w:number, h:number}>}
 */
async function convertToCanvases(image, width, opts) {
  const { boardCanvas, previewCanvas, statsEl, labels = false, statusEl } = opts;
  if (statusEl) statusEl.textContent = '正在转换为拼豆…';
  const { grid, preview, width: w, height: h } = await imageToBeads(image, width, {
    onProgress: (p) => { if (statusEl && p < 1) statusEl.textContent = `转换中 ${Math.round(p * 100)}%`; }
  });

  const bcell = cellFor(18, w, 640);
  boardCanvas.width = w * bcell;
  boardCanvas.height = h * bcell;
  renderGrid(boardCanvas, grid, bcell, { labels });

  if (previewCanvas) {
    const pcell = cellFor(14, w, 520);
    previewCanvas.width = w * pcell;
    previewCanvas.height = h * pcell;
    renderPreview(previewCanvas, preview, pcell);
  }

  renderStats(grid, statsEl);
  if (statusEl) statusEl.textContent = `完成：${w}×${h} 网格`;
  return { grid, preview, w, h };
}

function doExport(format, grid, prefix, labels) {
  if (!grid) { alert('请先生成拼豆图纸'); return; }
  if (format === 'png') exportPNG(grid, { cell: 20, labels: !!labels, filename: `${prefix}.png` });
  else if (format === 'csv') exportCSV(grid, { filename: `${prefix}.csv` });
  else if (format === 'pdf') exportPDF(grid, { cell: 14, labels: !!labels, filename: `${prefix}.pdf` });
}

/* ------------------------------------------------------------------ */
/* Main upload pipeline                                               */
/* ------------------------------------------------------------------ */

const mainState = { image: null, grid: null };

function initMain() {
  const uploadInput = document.getElementById('upload-input');
  const bgToggle = document.getElementById('bg-toggle');
  const statusEl = document.getElementById('convert-status');
  const boardWidth = document.getElementById('board-width');
  const boardWidthVal = document.getElementById('board-width-val');
  const labelsToggle = document.getElementById('labels-toggle');
  const convertBtn = document.getElementById('convert-btn');
  const boardCanvas = document.getElementById('board-canvas');
  const previewCanvas = document.getElementById('preview-canvas');
  const statsEl = document.getElementById('stats');
  const exportPng = document.getElementById('export-png');
  const exportPdf = document.getElementById('export-pdf');
  const exportCsv = document.getElementById('export-csv');
  if (!uploadInput || !boardCanvas) return;

  const convertMain = () => {
    if (!mainState.image) { if (statusEl) statusEl.textContent = '请先上传图片'; return; }
    const width = parseInt(boardWidth.value, 10) || 29;
    convertToCanvases(mainState.image, width, {
      boardCanvas, previewCanvas, statsEl, labels: labelsToggle.checked, statusEl
    }).then((r) => { mainState.grid = r.grid; });
  };

  setupUpload(uploadInput, {
    bgToggle,
    onImage: (img) => { mainState.image = img; convertMain(); },
    onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
    onError: (m) => { if (statusEl) statusEl.textContent = m; }
  });

  if (boardWidthVal) {
    boardWidthVal.textContent = boardWidth.value;
    boardWidth.addEventListener('input', () => { boardWidthVal.textContent = boardWidth.value; });
    boardWidth.addEventListener('change', convertMain);
  }
  convertBtn?.addEventListener('click', convertMain);
  labelsToggle?.addEventListener('change', convertMain);

  exportPng?.addEventListener('click', () => doExport('png', mainState.grid, 'bead-pattern', labelsToggle.checked));
  exportPdf?.addEventListener('click', () => doExport('pdf', mainState.grid, 'bead-pattern', labelsToggle.checked));
  exportCsv?.addEventListener('click', () => doExport('csv', mainState.grid, 'bead-pattern', false));
}

/* ------------------------------------------------------------------ */
/* Similar-image flow                                                  */
/* ------------------------------------------------------------------ */

const similarState = { image: null, grid: null };

function initSimilar() {
  const uploadInput = document.getElementById('similar-input');
  const similarWidth = document.getElementById('similar-width');
  const similarWidthVal = document.getElementById('similar-width-val');
  const convertBtn = document.getElementById('similar-convert');
  const boardCanvas = document.getElementById('similar-canvas');
  const statsEl = document.getElementById('similar-stats');
  const statusEl = document.getElementById('similar-status');
  const expPng = document.getElementById('similar-export-png');
  const expCsv = document.getElementById('similar-export-csv');
  const expPdf = document.getElementById('similar-export-pdf');
  if (!uploadInput || !boardCanvas) return;

  const convertSimilar = () => {
    if (!similarState.image) { if (statusEl) statusEl.textContent = '请先上传风格图'; return; }
    const width = parseInt(similarWidth.value, 10) || 29;
    convertToCanvases(similarState.image, width, {
      boardCanvas, statsEl, labels: false, statusEl
    }).then((r) => { similarState.grid = r.grid; });
  };

  setupUpload(uploadInput, {
    onImage: (img) => { similarState.image = img; convertSimilar(); },
    onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
    onError: (m) => { if (statusEl) statusEl.textContent = m; }
  });

  if (similarWidthVal) {
    similarWidthVal.textContent = similarWidth.value;
    similarWidth.addEventListener('input', () => { similarWidthVal.textContent = similarWidth.value; });
    similarWidth.addEventListener('change', convertSimilar);
  }
  convertBtn?.addEventListener('click', convertSimilar);

  expPng?.addEventListener('click', () => doExport('png', similarState.grid, 'similar-pattern', false));
  expCsv?.addEventListener('click', () => doExport('csv', similarState.grid, 'similar-pattern', false));
  expPdf?.addEventListener('click', () => doExport('pdf', similarState.grid, 'similar-pattern', false));
}

/* ------------------------------------------------------------------ */
/* Whiteboard                                                         */
/* ------------------------------------------------------------------ */

function initWhiteboard() {
  const btn = document.getElementById('whiteboard-btn');
  const root = document.getElementById('whiteboard-root');
  if (!btn || !root) return;
  let editor = null;
  btn.addEventListener('click', () => {
    root.classList.toggle('is-open');
    if (root.classList.contains('is-open') && !editor) {
      editor = mountWhiteboard(root, { size: 29 });
    }
  });
}

/* ------------------------------------------------------------------ */
/* Bootstrap                                                          */
/* ------------------------------------------------------------------ */

function init() {
  initMain();
  initSimilar();
  initWhiteboard();
  initAi({
    onResult: (img) => {
      // "再拼豆": send the AI result into the main pipeline.
      mainState.image = img;
      const statusEl = document.getElementById('convert-status');
      if (statusEl) statusEl.textContent = 'AI 图片已送入拼豆流程';
      const width = parseInt(document.getElementById('board-width')?.value || '29', 10);
      const boardCanvas = document.getElementById('board-canvas');
      const previewCanvas = document.getElementById('preview-canvas');
      const statsEl = document.getElementById('stats');
      const labelsToggle = document.getElementById('labels-toggle');
      if (boardCanvas) {
        convertToCanvases(img, width, {
          boardCanvas, previewCanvas, statsEl, labels: labelsToggle?.checked, statusEl
        }).then((r) => { mainState.grid = r.grid; });
      }
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.initCreate = init;
