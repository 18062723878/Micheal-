// exporter.js — export bead grids to PNG / CSV / PDF.
import { PALETTE } from './palette.js';
import { renderGrid } from './convert.js';

let _jspdf = null;

/**
 * Lazily load jsPDF from CDN. Resolves with the jsPDF namespace, or rejects.
 * @returns {Promise<Object>}
 */
function loadJsPdf() {
  if (_jspdf) return Promise.resolve(_jspdf);
  if (window.jspdf) {
    _jspdf = window.jspdf;
    return Promise.resolve(_jspdf);
  }
  return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    .then(() => {
      if (!window.jspdf) throw new Error('jsPDF failed to initialize');
      _jspdf = window.jspdf;
      return _jspdf;
    });
}

/**
 * Load an external script by URL.
 * @param {string} src
 * @returns {Promise<void>}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('无法加载脚本: ' + src));
    document.head.appendChild(s);
  });
}

/**
 * Trigger a browser download for a Blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 1000);
}

/**
 * Build an offscreen canvas containing the rendered grid (used by exporters).
 */
function buildCanvas(grid, cell, opts) {
  const c = document.createElement('canvas');
  renderGrid(c, grid, cell, opts);
  return c;
}

/**
 * Export the grid as a PNG image.
 * @param {string[][]} grid
 * @param {Object} [opts] { cell=20, labels=false, filename='bead-pattern.png' }
 */
export function exportPNG(grid, opts = {}) {
  const { cell = 20, labels = false, filename = 'bead-pattern.png' } = opts;
  const canvas = buildCanvas(grid, cell, { labels });
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, filename);
  }, 'image/png');
}

/**
 * Export the grid as a CSV of color ids (empty cells become blank).
 * @param {string[][]} grid
 * @param {Object} [opts] { filename='bead-pattern.csv' }
 */
export function exportCSV(grid, opts = {}) {
  const { filename = 'bead-pattern.csv' } = opts;
  const lines = grid.map((row) =>
    row.map((cell) => (cell == null ? '' : cell)).join(',')
  );
  // Prepend BOM for Excel-friendly UTF-8.
  const csv = '﻿' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename);
}

/**
 * Export the grid as a PDF. Falls back to PNG on failure.
 * @param {string[][]} grid
 * @param {Object} [opts] { cell=14, labels=true, filename='bead-pattern.pdf' }
 */
export async function exportPDF(grid, opts = {}) {
  const { cell = 14, labels = true, filename = 'bead-pattern.pdf' } = opts;
  try {
    const mod = await loadJsPdf();
    const canvas = buildCanvas(grid, cell, { labels });
    const img = canvas.toDataURL('image/png');
    const { jsPDF } = mod;
    const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
    const doc = new jsPDF({
      orientation,
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    doc.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
    doc.save(filename);
  } catch (e) {
    console.warn('PDF 导出失败，已降级为 PNG。', e);
    exportPNG(grid, { cell, labels, filename: filename.replace(/\.pdf$/i, '.png') });
  }
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.exportPNG = exportPNG;
BeadStudio.exportCSV = exportCSV;
BeadStudio.exportPDF = exportPDF;
BeadStudio.downloadBlob = downloadBlob;
