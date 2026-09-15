/**
 * bead-viewer.js — 拼豆图纸展示引擎（对齐 pixel-beads 图纸观感）
 *
 * 能力：
 *  - 三种拼豆样式：方珠 / 圆珠 / 中空圆珠
 *  - 网格间距：无 / 小 / 大
 *  - 网格线、色号编号、行列标尺开关
 *  - 适合屏幕（自适应格子尺寸）与自由缩放
 *  - 颜色边沿高亮：点击某色 → 该色所有豆子边沿描边高亮，其余淡出
 *  - 拼装打卡标记
 *
 * 无外部依赖，浏览器原生 ESM。
 */

export const BEAD_STYLES = {
  square: '方珠',
  round: '圆珠',
  hollow: '中空圆珠',
};

export const GAP_RATIO = {
  none: 0,
  small: 0.1,
  large: 0.24,
};

const RULER_FACTOR = 1.5; // 标尺占用的格子倍数

/* ------------------------------------------------------------------ *
 * 主题取色
 * ------------------------------------------------------------------ */
export function readTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    isDark,
    canvasBg: isDark ? '#0f172a' : '#ffffff',
    grid: isDark ? 'rgba(148,163,184,0.22)' : 'rgba(15,23,42,0.10)',
    gridStrong: isDark ? 'rgba(148,163,184,0.45)' : 'rgba(15,23,42,0.2)',
    rulerText: isDark ? '#94a3b8' : '#64748b',
    accent: isDark ? '#6d95ff' : '#0052ff',
    check: '#10b981',
  };
}

/* ------------------------------------------------------------------ *
 * 色号统计
 * ------------------------------------------------------------------ */
export function computeStats(matrix) {
  const map = new Map();
  for (const row of matrix) {
    for (const bead of row) {
      if (!bead) continue;
      const hit = map.get(bead.code);
      if (hit) hit.count += 1;
      else map.set(bead.code, { ...bead, count: 1 });
    }
  }
  const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
  const total = list.reduce((acc, cur) => acc + cur.count, 0);
  return { list, total, colors: list.length };
}

export function beadColor(bead) {
  if (!bead) return '#000000';
  return bead.hex || `rgb(${bead.r},${bead.g},${bead.b})`;
}

function luminance(bead) {
  if (!bead) return 0;
  const r = bead.r ?? 128;
  const g = bead.g ?? 128;
  const b = bead.b ?? 128;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/* ------------------------------------------------------------------ *
 * 形状路径
 * ------------------------------------------------------------------ */
function tracePath(ctx, style, x, y, size) {
  const half = size / 2;
  if (style === 'square') {
    const r = Math.max(0, Math.min(size * 0.16, 3));
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, r);
      return;
    }
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    return;
  }
  ctx.beginPath();
  ctx.arc(x + half, y + half, half, 0, Math.PI * 2);
}

/* ------------------------------------------------------------------ *
 * 主体渲染
 * ------------------------------------------------------------------ */
export function renderPattern(ctx, matrix, options = {}) {
  const {
    cellSize = 24,
    beadStyle = 'round',
    gap = 'small',
    showGrid = false,
    showCode = false,
    showRuler = true,
    highlightCode = null,
    dimOthers = true,
    checked = new Set(),
    excluded = new Set(),
    theme = readTheme(),
  } = options;

  const rows = matrix.length;
  const cols = rows ? matrix[0].length : 0;
  const gapRatio = GAP_RATIO[gap] ?? GAP_RATIO.small;
  const margin = showRuler ? Math.round(cellSize * RULER_FACTOR) : Math.round(cellSize * 0.25);

  const width = cols * cellSize + margin * 2;
  const height = rows * cellSize + margin * 2;

  ctx.canvas.width = Math.max(1, width);
  ctx.canvas.height = Math.max(1, height);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, width, height);

  const originX = margin;
  const originY = margin;

  /* --- 网格底纹 --- */
  if (showGrid) {
    ctx.save();
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      const px = Math.round(originX + x * cellSize) + 0.5;
      ctx.moveTo(px, originY);
      ctx.lineTo(px, originY + rows * cellSize);
    }
    for (let y = 0; y <= rows; y++) {
      const py = Math.round(originY + y * cellSize) + 0.5;
      ctx.moveTo(originX, py);
      ctx.lineTo(originX + cols * cellSize, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* --- 行列标尺 --- */
  if (showRuler && cellSize >= 9) {
    ctx.save();
    ctx.fillStyle = theme.rulerText;
    ctx.font = `500 ${Math.max(8, Math.round(cellSize * 0.42))}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let x = 0; x < cols; x++) {
      ctx.fillText(String(x + 1), originX + x * cellSize + cellSize / 2, originY - margin / 2);
    }
    ctx.textAlign = 'center';
    for (let y = 0; y < rows; y++) {
      ctx.fillText(String(y + 1), originX - margin / 2, originY + y * cellSize + cellSize / 2);
    }
    ctx.restore();
  }

  /* --- 豆子 --- */
  const beadSize = Math.max(1, cellSize * (1 - gapRatio));
  const inset = (cellSize - beadSize) / 2;
  const outlined = [];

  for (let y = 0; y < rows; y++) {
    const row = matrix[y];
    for (let x = 0; x < cols; x++) {
      const bead = row[x];
      if (!bead) continue;

      const bx = originX + x * cellSize + inset;
      const by = originY + y * cellSize + inset;
      const isMatch = !highlightCode || bead.code === highlightCode;

      ctx.save();
      if (!isMatch && dimOthers) ctx.globalAlpha = 0.14;
      if (excluded.has(bead.code)) ctx.globalAlpha = 0.2;

      tracePath(ctx, beadStyle, bx, by, beadSize);
      ctx.fillStyle = beadColor(bead);
      ctx.fill();

      if (beadStyle !== 'hollow') {
        ctx.lineWidth = Math.max(1, cellSize * 0.045);
        ctx.strokeStyle = 'rgba(15,23,42,0.18)';
        ctx.stroke();
      }

      if (beadStyle === 'hollow') {
        // 中空圆珠：外圈描边 + 中心孔洞
        ctx.lineWidth = Math.max(1, beadSize * 0.16);
        ctx.strokeStyle = beadColor(bead);
        ctx.beginPath();
        ctx.arc(bx + beadSize / 2, by + beadSize / 2, beadSize / 2 - cellSize * 0.05, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bx + beadSize / 2, by + beadSize / 2, beadSize * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = theme.canvasBg;
        ctx.fill();

        ctx.lineWidth = Math.max(1, cellSize * 0.04);
        ctx.strokeStyle = 'rgba(15,23,42,0.22)';
        ctx.beginPath();
        ctx.arc(bx + beadSize / 2, by + beadSize / 2, beadSize * 0.26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      if (isMatch && highlightCode) outlined.push([bx, by]);
    }
  }

  /* --- 色号编号 --- */
  if (showCode && cellSize >= 17) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.max(8, Math.round(cellSize * 0.34))}px "JetBrains Mono", ui-monospace, monospace`;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const bead = matrix[y][x];
        if (!bead) continue;
        const isMatch = !highlightCode || bead.code === highlightCode;
        ctx.globalAlpha = isMatch ? 1 : 0.12;
        ctx.fillStyle = luminance(bead) > 148 ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.9)';
        ctx.fillText(bead.code, originX + x * cellSize + cellSize / 2, originY + y * cellSize + cellSize / 2);
      }
    }
    ctx.restore();
  }

  /* --- 打卡标记 --- */
  if (checked.size) {
    ctx.save();
    ctx.strokeStyle = theme.check;
    ctx.lineWidth = Math.max(2, cellSize * 0.13);
    ctx.lineCap = 'round';
    for (const key of checked) {
      const [x, y] = key.split(',').map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (!matrix[y] || !matrix[y][x]) continue;
      const cx = originX + x * cellSize;
      const cy = originY + y * cellSize;
      const p = cellSize * 0.26;
      ctx.beginPath();
      ctx.moveTo(cx + p, cy + p);
      ctx.lineTo(cx + cellSize - p, cy + cellSize - p);
      ctx.moveTo(cx + cellSize - p, cy + p);
      ctx.lineTo(cx + p, cy + cellSize - p);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* --- 高亮描边（最后绘制，保证盖在一切之上） --- */
  if (highlightCode && outlined.length) {
    ctx.save();
    ctx.lineWidth = Math.max(2, cellSize * 0.16);
    ctx.strokeStyle = theme.accent;
    ctx.shadowColor = theme.isDark ? 'rgba(109,149,255,0.85)' : 'rgba(0,82,255,0.55)';
    ctx.shadowBlur = Math.max(4, cellSize * 0.3);

    // 先铺一层白色内衬，让描边在深色豆子上也清晰
    ctx.strokeStyle = theme.accent;
    for (const [bx, by] of outlined) {
      tracePath(ctx, beadStyle, bx, by, beadSize + cellSize * 0.16);
      ctx.stroke();
    }
    ctx.restore();
  }

  return { width, height, rows, cols, margin, cellSize };
}

/* ------------------------------------------------------------------ *
 * 交互式查看器
 * ------------------------------------------------------------------ */
export class BeadViewer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.matrix = [];
    this.options = {
      cellSize: 22,
      fit: false,
      beadStyle: 'round',
      gap: 'small',
      showGrid: true,
      showCode: false,
      showRuler: true,
      highlightCode: null,
      dimOthers: true,
      checked: new Set(),
      excluded: new Set(),
      maxCell: 44,
      minCell: 3,
      onChange: null,
      ...options,
    };
    this._layout = { margin: 0, cellSize: 22, originX: 0, originY: 0 };
  }

  get rows() {
    return this.matrix.length;
  }

  get cols() {
    return this.matrix.length ? this.matrix[0].length : 0;
  }

  setMatrix(matrix) {
    this.matrix = matrix || [];
    return this.render();
  }

  setOptions(patch = {}) {
    Object.assign(this.options, patch);
    return this.render();
  }

  resolveCellSize() {
    const {
      fit,
      cellSize,
      maxCell,
      minCell,
      showRuler,
      zoom = 1,
      fitHeightEl = null,
      maxFitHeight = 0,
    } = this.options;
    let base;
    if (fit) {
      const host = this.canvas.parentElement;
      const hostWidth = host ? host.clientWidth : 0;
      const availW = Math.max(160, hostWidth - 44);
      const colUnits = this.cols + (showRuler ? RULER_FACTOR * 2 : 0.5);
      let sizeW = availW / Math.max(1, colUnits);

      // 高度预算：优先用容器实测高度，否则用调用方给定的上限
      // （避免渲染尺寸远大于显示尺寸而被 CSS 强行缩放，导致网格线出现条纹）
      let availH = 0;
      if (fitHeightEl && fitHeightEl.clientHeight > 0) availH = fitHeightEl.clientHeight;
      else if (maxFitHeight > 0) availH = maxFitHeight;

      let sizeH = Infinity;
      if (availH > 0) {
        const rowUnits = this.rows + (showRuler ? RULER_FACTOR * 2 : 0.5);
        sizeH = (availH - 40) / Math.max(1, rowUnits);
      }

      base = Math.max(minCell, Math.min(Math.floor(Math.min(sizeW, sizeH)), maxCell));
    } else {
      base = cellSize;
    }
    if (zoom === 1) return base;
    return Math.max(1, Math.min(240, Math.round(base * zoom)));
  }

  render() {
    if (!this.rows) {
      const ctx = this.ctx;
      ctx.canvas.width = 1;
      ctx.canvas.height = 1;
      return null;
    }
    const cell = this.resolveCellSize();
    this._layout.cellSize = cell;

    const result = renderPattern(this.ctx, this.matrix, {
      ...this.options,
      cellSize: cell,
      theme: readTheme(),
    });

    this._layout.margin = result.margin;
    this._layout.originX = result.margin;
    this._layout.originY = result.margin;
    this._layout.beadSize = Math.max(1, cell * (1 - (GAP_RATIO[this.options.gap] ?? 0)));
    this._layout.inset = (cell - this._layout.beadSize) / 2;

    if (typeof this.options.onChange === 'function') this.options.onChange(result);
    return result;
  }

  /** 将鼠标/触摸坐标映射为格子坐标 */
  hitTest(clientX, clientY) {
    if (!this.rows) return null;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;

    const { originX, originY, cellSize } = this._layout;
    const gx = Math.floor((cx - originX) / cellSize);
    const gy = Math.floor((cy - originY) / cellSize);
    if (gx < 0 || gy < 0 || gx >= this.cols || gy >= this.rows) return null;

    const bead = this.matrix[gy][gx];
    if (!bead) return null;
    return { x: gx, y: gy, bead };
  }

  toDataURL(type = 'image/png') {
    return this.canvas.toDataURL(type);
  }

  renderInto(targetCanvas, override = {}) {
    const ctx = targetCanvas.getContext('2d');
    const cell = override.cellSize || this.options.cellSize;
    return renderPattern(ctx, this.matrix, {
      ...this.options,
      ...override,
      cellSize: cell,
      theme: readTheme(),
    });
  }
}

/* ------------------------------------------------------------------ *
 * 图例（色卡）构建
 * ------------------------------------------------------------------ */
export function buildLegend(container, statsList, { activeCode = null, onClick } = {}) {  if (!container) return;
  container.innerHTML = '';
  statsList.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `bead-legend-item${activeCode === item.code ? ' is-active' : ''}`;
    btn.dataset.code = item.code;
    btn.title = `${item.code} ${item.name || ''} · ${item.count} 颗`;
    btn.innerHTML = `
      <span class="bead-legend-swatch" style="background:${beadColor(item)}"></span>
      <span>${item.code}</span>
      <span class="bead-legend-count">${item.count}</span>
    `;
    if (typeof onClick === 'function') {
      btn.addEventListener('click', () => onClick(item.code));
    }
    container.appendChild(btn);
  });
}

/* ------------------------------------------------------------------ *
 * 缩略图自适应工具
 * ------------------------------------------------------------------ */

/**
 * 依据容器实际渲染尺寸反推缩略图格子大小，
 * 让图纸完整显示且尽量填满容器（避免「外框大、图小」）。
 */
export function fitCellToBox(box, cols, rows, padding = 16, maxCell = 28) {
  if (!box) return 8;
  const rect = box.getBoundingClientRect();
  const availW = Math.max(24, rect.width - padding);
  const availH = Math.max(24, rect.height - padding);
  const cell = Math.floor(
    Math.min(availW / Math.max(1, cols), availH / Math.max(1, rows))
  );
  return Math.max(2, Math.min(maxCell, cell));
}

/**
 * 让预览外框贴合图纸自身的宽高比（做上下限收敛，避免极端长条卡片）。
 */
export function aspectForMatrix(cols, rows, min = 0.78, max = 1.28) {
  const ratio = cols / Math.max(1, rows);
  return Math.min(max, Math.max(min, ratio));
}
