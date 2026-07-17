// editor.js — interactive whiteboard bead editor (used by "从白板开始").
// Pure client-side: works without any worker. Optionally calls /api/convert
// on export via worker-client, degrading to local export when unavailable.

import { PALETTE, ARTKAL_55 } from './palette.js';
import { renderGrid } from './convert.js';
import { exportPNG, exportCSV, exportPDF } from './exporter.js';
import { convertWithWorker } from './worker-client.js';

const TOOLS = ['pen', 'eraser', 'eyedropper', 'bucket'];
const TOOL_LABELS = {
  pen: '画笔',
  eraser: '橡皮',
  eyedropper: '吸管',
  bucket: '油漆桶'
};
const SIZES = [16, 29, 48];
const MAX_CANVAS_PX = 480;

/**
 * Whiteboard bead editor.
 * Builds its own DOM inside `root` and manages all interactions.
 */
export class WhiteboardEditor {
  /**
   * @param {HTMLElement} root container element
   * @param {Object} [opts] { size=29 }
   */
  constructor(root, opts = {}) {
    this.root = root;
    this.size = opts.size || 29;
    this.grid = this._emptyGrid(this.size);
    this.selected = 'A01';
    this.tool = 'pen';
    this.showGrid = true;
    this.undoStack = [];
    this._painting = false;
    this._build();
    this._render();
    this._renderMaterials();
  }

  /** Create a size×size grid filled with null (empty). */
  _emptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(null));
  }

  /** Compute pixel size of each cell so the canvas fits MAX_CANVAS_PX. */
  _cell() {
    return Math.max(6, Math.floor(MAX_CANVAS_PX / this.size));
  }

  /** Build the editor DOM. */
  _build() {
    this.root.innerHTML = `
      <div class="wb">
        <aside class="wb-palette" aria-label="调色板"></aside>
        <div class="wb-main">
          <div class="wb-toolbar">
            <div class="wb-tools"></div>
            <div class="wb-actions">
              <label class="wb-check"><input type="checkbox" class="wb-grid-toggle" checked> 网格</label>
              <button type="button" class="wb-btn wb-mirror-h" title="水平镜像">⇄ 水平</button>
              <button type="button" class="wb-btn wb-mirror-v" title="垂直镜像">⇅ 垂直</button>
              <button type="button" class="wb-btn wb-undo" title="撤销">↶ 撤销</button>
              <button type="button" class="wb-btn wb-clear" title="清空">清空</button>
              <select class="wb-size" aria-label="网格尺寸">
                ${SIZES.map((s) => `<option value="${s}" ${s === this.size ? 'selected' : ''}>${s}×${s}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="wb-canvas-wrap"><canvas class="wb-canvas"></canvas></div>
        </div>
        <aside class="wb-side">
          <h3>材料清单</h3>
          <div class="wb-materials"></div>
          <h3>导出</h3>
          <div class="wb-export">
            <button type="button" class="wb-btn wb-exp-png">PNG</button>
            <button type="button" class="wb-btn wb-exp-csv">CSV</button>
            <button type="button" class="wb-btn wb-exp-pdf">PDF</button>
          </div>
          <p class="wb-hint">提示：开启网格对齐更轻松；导出优先走边缘 Worker，失败自动本地生成。</p>
        </aside>
      </div>`;

    this.canvas = this.root.querySelector('.wb-canvas');
    this.paletteEl = this.root.querySelector('.wb-palette');
    this.toolsEl = this.root.querySelector('.wb-tools');
    this.materialsEl = this.root.querySelector('.wb-materials');

    this._buildPalette();
    this._buildTools();
    this._bind();
  }

  /** Render the Artkal 55 palette as clickable swatches. */
  _buildPalette() {
    this.paletteEl.innerHTML = '';
    ARTKAL_55.forEach((c) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'wb-swatch' + (c.id === this.selected ? ' is-selected' : '');
      sw.style.background = c.hex;
      sw.title = `${c.id} ${c.name}`;
      sw.dataset.id = c.id;
      sw.addEventListener('click', () => this._selectColor(c.id));
      this.paletteEl.appendChild(sw);
    });
  }

  /** Render the toolbar tool buttons. */
  _buildTools() {
    this.toolsEl.innerHTML = '';
    TOOLS.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wb-btn wb-tool' + (t === this.tool ? ' is-active' : '');
      b.dataset.tool = t;
      b.textContent = TOOL_LABELS[t];
      b.addEventListener('click', () => this._selectTool(t));
      this.toolsEl.appendChild(b);
    });
  }

  _selectColor(id) {
    this.selected = id;
    this.root.querySelectorAll('.wb-swatch').forEach((el) => {
      el.classList.toggle('is-selected', el.dataset.id === id);
    });
  }

  _selectTool(t) {
    this.tool = t;
    this.root.querySelectorAll('.wb-tool').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.tool === t);
    });
  }

  /** Wire canvas pointer events and toolbar actions. */
  _bind() {
    const getCell = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX - rect.left) / rect.width) * this.size);
      const y = Math.floor(((e.clientY - rect.top) / rect.height) * this.size);
      return { x, y };
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.canvas.setPointerCapture(e.pointerId);
      this._painting = true;
      const { x, y } = getCell(e);
      this._applyTool(x, y);
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!this._painting) return;
      const { x, y } = getCell(e);
      if (this.tool === 'pen' || this.tool === 'eraser') this._applyTool(x, y);
    });
    this.canvas.addEventListener('pointerup', () => {
      this._painting = false;
    });
    this.canvas.addEventListener('pointerleave', () => {
      this._painting = false;
    });

    this.root.querySelector('.wb-grid-toggle').addEventListener('change', (e) => {
      this.showGrid = e.target.checked;
      this._render();
    });
    this.root.querySelector('.wb-clear').addEventListener('click', () => {
      this._snapshot();
      this.grid = this._emptyGrid(this.size);
      this._render();
      this._renderMaterials();
    });
    this.root.querySelector('.wb-undo').addEventListener('click', () => this._undo());
    this.root.querySelector('.wb-mirror-h').addEventListener('click', () => this._mirror('h'));
    this.root.querySelector('.wb-mirror-v').addEventListener('click', () => this._mirror('v'));
    this.root.querySelector('.wb-size').addEventListener('change', (e) => {
      const ns = parseInt(e.target.value, 10);
      if (ns !== this.size) {
        this.size = ns;
        this.grid = this._emptyGrid(ns);
        this._render();
        this._renderMaterials();
      }
    });
    this.root.querySelector('.wb-exp-png').addEventListener('click', () => this.exportAs('png'));
    this.root.querySelector('.wb-exp-csv').addEventListener('click', () => this.exportAs('csv'));
    this.root.querySelector('.wb-exp-pdf').addEventListener('click', () => this.exportAs('pdf'));
  }

  /** Apply the active tool at (x, y). */
  _applyTool(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return;
    if (this.tool === 'eyedropper') {
      const id = this.grid[y][x];
      if (id) this._selectColor(id);
      return;
    }
    if (this.tool === 'bucket') {
      this._snapshot();
      this._floodFill(x, y, this.selected);
      this._render();
      this._renderMaterials();
      return;
    }
    const value = this.tool === 'eraser' ? null : this.selected;
    if (this.grid[y][x] !== value) {
      this._snapshot();
      this.grid[y][x] = value;
      this._render();
      this._renderMaterials();
    }
  }

  /** Flood fill from (x, y) with `value`, bounded by the current color. */
  _floodFill(x, y, value) {
    const target = this.grid[y][x];
    if (target === value) return;
    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= this.size || cy >= this.size) continue;
      if (this.grid[cy][cx] !== target) continue;
      this.grid[cy][cx] = value;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  /** Mirror the grid horizontally or vertically. */
  _mirror(axis) {
    this._snapshot();
    const g = this.grid;
    const n = this.size;
    const out = this._emptyGrid(n);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const sx = axis === 'h' ? n - 1 - x : x;
        const sy = axis === 'v' ? n - 1 - y : y;
        out[y][x] = g[sy][sx];
      }
    }
    this.grid = out;
    this._render();
    this._renderMaterials();
  }

  /** Push a shallow snapshot of the grid for undo. */
  _snapshot() {
    this.undoStack.push(this.grid.map((row) => row.slice()));
    if (this.undoStack.length > 50) this.undoStack.shift();
  }

  _undo() {
    const prev = this.undoStack.pop();
    if (prev) {
      this.grid = prev;
      this._render();
      this._renderMaterials();
    }
  }

  /** Redraw the canvas from the grid. */
  _render() {
    const cell = this._cell();
    renderGrid(this.canvas, this.grid, cell, {
      labels: false,
      stroke: this.showGrid ? '#cfd8e3' : 'transparent',
      pad: 0
    });
  }

  /** Recompute and render the material (color usage) list. */
  _renderMaterials() {
    const counts = {};
    this.grid.forEach((row) => row.forEach((id) => { if (id) counts[id] = (counts[id] || 0) + 1; }));
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      this.materialsEl.innerHTML = '<p class="wb-empty">暂无用色，开始创作吧！</p>';
      return;
    }
    this.materialsEl.innerHTML = entries
      .map(([id, n]) => {
        const c = PALETTE[id];
        return `<div class="wb-mat"><span class="wb-mat-sw" style="background:${c.hex}"></span><span class="wb-mat-id">${id}</span><span class="wb-mat-name">${c.name}</span><span class="wb-mat-n">×${n}</span></div>`;
      })
      .join('');
  }

  /** Export the current grid via worker (with local fallback). */
  exportAs(format) {
    const payload = { op: 'export', grid: this.grid, format, size: this.size };
    return convertWithWorker(payload, () => this._localExport(format));
  }

  _localExport(format) {
    const opts = { cell: 18, labels: false, filename: `whiteboard-${this.size}x${this.size}.${format}` };
    if (format === 'png') exportPNG(this.grid, opts);
    else if (format === 'csv') exportCSV(this.grid, { filename: opts.filename });
    else if (format === 'pdf') exportPDF(this.grid, opts);
  }
}

/**
 * Convenience: mount a whiteboard editor into a root element.
 * @param {HTMLElement} root
 * @param {Object} [opts]
 * @returns {WhiteboardEditor}
 */
export function mountWhiteboard(root, opts = {}) {
  return new WhiteboardEditor(root, opts);
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.WhiteboardEditor = WhiteboardEditor;
BeadStudio.mountWhiteboard = mountWhiteboard;
