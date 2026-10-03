/**
 * whiteboard-core.js — 白板绘画核心逻辑（纯函数，无 DOM 依赖）
 *
 * 设计原则：
 *  - 所有可测逻辑（滤镜数学、Lab 匹配、填充、对称、历史栈、图片转网格）都放这里，
 *    既让 whiteboard.html 保持「页面内联脚本 + 引入共享模块」的现有结构，
 *    又能让 Node 回归测试直接 import 本文件做断言。
 *  - 滤镜采用**逐像素数学变换**（brightness / contrast / saturate），
 *    不再依赖离屏 canvas 的 ctx.filter —— 后者在部分浏览器上不生效，
 *    且无法在 Node 中测试，是「调亮度/对比度后色号不更新」的根因。
 */

import { srgbToLab, labDistance } from './lab.js';

/* ------------------------------------------------------------------ *
 * 调色板 Lab 索引
 * ------------------------------------------------------------------ */

/**
 * 为任意色板（Artkal 55 / Perler / 马卡龙 …）预计算 Lab 索引。
 * 语义与 color.js 的 PALETTE_LAB 一致，但支持多色板。
 *
 * 注意：palette.js 的 ARTKAL_55 用的是 `id` 字段，而白板内部一律以 `code`
 * 作为色号主键（页面上的 PALETTES 已经做过这层映射）。这里统一再兜一次底，
 * 让本模块可以直接吃 ARTKAL_55 或页面里的 PALETTES.xxx，两种形状都能用。
 *
 * @param {Array<{id?:string, code?:string, name?:string, hex?:string, r:number, g:number, b:number}>} palette
 * @returns {Array<{bead:Object, lab:number[]}>}
 */
export function buildPaletteIndex(palette) {
  return palette.map((raw) => {
    const bead = raw.code ? raw : { ...raw, code: raw.id };
    return { bead, lab: srgbToLab([bead.r, bead.g, bead.b]) };
  });
}

/**
 * 在给定 Lab 索引中找出最接近的色号。
 * 复用 lab.js 的 srgbToLab/labDistance，与「上传转图纸」走同一套色彩科学，
 * 避免白板画出来的色号和转图导出的色号不一致。
 *
 * @param {number} r @param {number} g @param {number} b
 * @param {Array<{bead:Object, lab:number[]}>} index
 * @returns {Object|null} 命中的 bead 对象
 */
export function matchNearest(r, g, b, index) {
  if (!index || !index.length) return null;
  const lab = srgbToLab([r, g, b]);
  let best = null;
  let bestD = Infinity;
  for (const entry of index) {
    const d = labDistance(lab, entry.lab);
    if (d < bestD) {
      bestD = d;
      best = entry.bead;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ *
 * 画面滤镜（纯数学，跨浏览器一致）
 * ------------------------------------------------------------------ */

const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * 对单个像素应用亮度 / 对比度 / 饱和度变换。
 *
 * 与 CSS filter 语义一致：
 *  - brightness(%)  v *= 1 + p/100
 *  - contrast(%)    v = (v - 127.5) * (1 + p/100) + 127.5
 *  - saturate(%)    按 Rec.709 亮度做灰度插值
 *
 * @param {{r:number,g:number,b:number}} rgb
 * @param {{brightness?:number, contrast?:number, saturation?:number}} adj 均为 -100..100
 * @returns {{r:number,g:number,b:number}}
 */
export function adjustPixel(rgb, adj = {}) {
  const bF = 1 + (adj.brightness || 0) / 100;
  const cF = 1 + (adj.contrast || 0) / 100;
  const sF = 1 + (adj.saturation || 0) / 100;

  let r = rgb.r * bF;
  let g = rgb.g * bF;
  let b = rgb.b * bF;

  r = (r - 127.5) * cF + 127.5;
  g = (g - 127.5) * cF + 127.5;
  b = (b - 127.5) * cF + 127.5;

  if (sF !== 1) {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + (r - lum) * sF;
    g = lum + (g - lum) * sF;
    b = lum + (b - lum) * sF;
  }

  return {
    r: Math.round(clamp255(r)),
    g: Math.round(clamp255(g)),
    b: Math.round(clamp255(b)),
  };
}

/**
 * 判断一组滤镜参数是否为空（为 0）。
 * @param {{brightness?:number, contrast?:number, saturation?:number}} adj
 */
export function isNeutralAdjust(adj = {}) {
  return !adj.brightness && !adj.contrast && !adj.saturation;
}

/**
 * 把「用户绘制的原始网格」按滤镜重映射成「实际色号网格」。
 *
 * 这是白板色号与滤镜联动的唯一入口：无论从哪个控件改亮度/对比度/饱和度，
 * 都必须走这里重算，从而保证画布上的色号与右侧图纸、用量清单三者始终一致。
 *
 * 【重要】即使 adj 全为 0 也必须逐格重新匹配色号 ——
 * 因为「换色板」（Artkal → Perler / 马卡龙 …）同样需要把已有像素
 * 重新落到新色板的真实色号上。若在此处对空滤镜短路返回原色，
 * 换色板后画布上会残留旧色板的 code。
 *
 * @param {Array<Array<Object|null>>} baseGrid 用户绘制层（存 bead 对象）
 * @param {{brightness?:number, contrast?:number, saturation?:number}} adj
 * @param {Array<{bead:Object, lab:number[]}>} index 当前色板 Lab 索引
 * @returns {Array<Array<Object|null>>} 重映射后的网格
 */
export function remapGrid(baseGrid, adj, index) {
  const rows = baseGrid.length;
  if (!rows) return [];
  const cols = baseGrid[0].length;

  const out = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const bead = baseGrid[y][x];
      if (!bead) {
        row.push(null);
        continue;
      }
      const adjRGB = adjustPixel({ r: bead.r, g: bead.g, b: bead.b }, adj);
      // 必须始终走一次匹配：即使用户没调滤镜，也可能刚把色板从 Artkal 换成
      // Perler/马卡龙 —— 此时每一格都要重新落到新色板的真实色号上，
      // 绝不能因为「滤镜为 0」就沿用旧色板的 code。
      row.push(matchNearest(adjRGB.r, adjRGB.g, adjRGB.b, index) || bead);
    }
    out.push(row);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 网格构造 / 工具
 * ------------------------------------------------------------------ */

/**
 * 创建一个 N×N 的空网格。
 * @param {number} size
 * @returns {Array<Array<null>>}
 */
export function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

/**
 * 统计网格内各色号用量。
 * @param {Array<Array<Object|null>>} grid
 * @returns {{list:Array<Object>, total:number, colors:number}}
 */
export function computeStats(grid) {
  const map = new Map();
  let total = 0;
  for (const row of grid) {
    for (const bead of row) {
      if (!bead) continue;
      total++;
      const hit = map.get(bead.code);
      if (hit) hit.count += 1;
      else map.set(bead.code, { ...bead, count: 1 });
    }
  }
  const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
  return { list, total, colors: list.length };
}

/**
 * 洪水填充（4 邻域）。直接修改传入的 grid。
 *
 * 判定「同色」用的是色号 code 而非对象引用 —— 因为滤镜重映射后
 * 同一视觉颜色可能是不同的 bead 对象实例。
 *
 * @param {Array<Array<Object|null>>} grid
 * @param {number} sx @param {number} sy 起点
 * @param {Object|null} fillBead 填充色（null 表示擦除为空白）
 * @param {{size:number}} bounds
 * @returns {number} 实际填充的格子数
 */
export function floodFill(grid, sx, sy, fillBead, bounds) {
  const size = bounds.size;
  const target = grid[sy][sx];
  const targetCode = target ? target.code : null;
  const fillCode = fillBead ? fillBead.code : null;
  if (targetCode === fillCode) return 0;

  let filled = 0;
  const stack = [[sx, sy]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= size || y < 0 || y >= size) continue;
    const cur = grid[y][x];
    const curCode = cur ? cur.code : null;
    if (curCode !== targetCode) continue;
    grid[y][x] = fillBead;
    filled++;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return filled;
}

/**
 * 矩形区域内的格子坐标（左上 → 右下，含端点，自动纠正反向拖动）。
 * @returns {Array<[number, number]>}
 */
export function rectCells(x0, y0, x1, y1) {
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  const cells = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) cells.push([x, y]);
  }
  return cells;
}

/**
 * 对称映射：返回该格子在对侧应当同步绘制的坐标（去掉自身）。
 *
 * mode: 'none' | 'vertical'（左右镜像）| 'horizontal'（上下镜像）| 'quad'（四向）
 *
 * @param {number} x @param {number} y
 * @param {number} size 网格边长
 * @param {string} mode
 * @returns {Array<[number, number]>}
 */
export function mirrorTargets(x, y, size, mode) {
  if (mode === 'none' || !mode) return [];
  const mx = size - 1 - x;
  const my = size - 1 - y;
  const out = [];
  const push = (tx, ty) => {
    if (tx === x && ty === y) return;
    if (tx < 0 || tx >= size || ty < 0 || ty >= size) return;
    if (out.some(([px, py]) => px === tx && py === ty)) return;
    out.push([tx, ty]);
  };
  if (mode === 'vertical') push(mx, y);
  else if (mode === 'horizontal') push(x, my);
  else if (mode === 'quad') {
    push(mx, y);
    push(x, my);
    push(mx, my);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 撤销 / 重做（双栈）
 * ------------------------------------------------------------------ */

export function createHistory(limit = 40) {
  return { undo: [], redo: [], limit };
}

/**
 * 记录一次可撤销的快照。新操作会清空重做栈（标准编辑器行为）。
 * @param {{undo:Array,redo:Array,limit:number}} history
 * @param {string} snapshot JSON 序列化的网格
 */
export function pushHistory(history, snapshot) {
  history.undo.push(snapshot);
  if (history.undo.length > history.limit) history.undo.shift();
  history.redo.length = 0;
}

export function canUndo(h) {
  return h.undo.length > 0;
}

export function canRedo(h) {
  return h.redo.length > 0;
}

/**
 * 撤销：把当前状态压入 redo 栈并返回上一份快照。
 * @returns {string|null}
 */
export function undo(history, currentSnapshot) {
  if (!canUndo(history)) return null;
  history.redo.push(currentSnapshot);
  return history.undo.pop();
}

/**
 * 重做：把当前状态压回 undo 栈并返回下一份快照。
 * @returns {string|null}
 */
export function redo(history, currentSnapshot) {
  if (!canRedo(history)) return null;
  history.undo.push(currentSnapshot);
  return history.redo.pop();
}

/* ------------------------------------------------------------------ *
 * 图片导入 → 像素网格
 * ------------------------------------------------------------------ */

/**
 * 把 RGBA 像素数据按「均色缩放」映射为指定尺寸的色号网格。
 *
 * 做法：先把源像素按目标行列数做 box 采样（等价于高质量缩放），
 * 再对每个采样点做 Lab 最近色匹配 —— 与上传转图纸同一套色彩逻辑。
 *
 * @param {{data:Uint8ClampedArray|Uint8Array, width:number, height:number}} src
 * @param {number} targetCols
 * @param {number} targetRows
 * @param {Array<{bead:Object, lab:number[]}>} index
 * @param {{threshold?:number}} [opts] threshold: 0-100，低于该透明度的像素视为空
 * @returns {Array<Array<Object|null>>}
 */
export function pixelsToBeadGrid(src, targetCols, targetRows, index, opts = {}) {
  const { threshold = 12 } = opts;
  const { data, width: sw, height: sh } = src;
  const grid = [];
  const alphaCut = (threshold / 100) * 255;

  for (let ty = 0; ty < targetRows; ty++) {
    const row = [];
    // 源图对应的纵向区间
    const y0 = Math.floor((ty * sh) / targetRows);
    const y1 = Math.max(y0 + 1, Math.floor(((ty + 1) * sh) / targetRows));
    for (let tx = 0; tx < targetCols; tx++) {
      const x0 = Math.floor((tx * sw) / targetCols);
      const x1 = Math.max(x0 + 1, Math.floor(((tx + 1) * sw) / targetCols));

      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      let opaque = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * sw + x) * 4;
          const a = data[i + 3];
          if (a === undefined || a > alphaCut) opaque++;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
      }
      if (!n || !opaque) {
        row.push(null);
        continue;
      }
      const matched = matchNearest(Math.round(r / n), Math.round(g / n), Math.round(b / n), index);
      row.push(matched || null);
    }
    grid.push(row);
  }
  return grid;
}

/* ------------------------------------------------------------------ *
 * 色板搜索（按色号 / 名称 / 颜色）
 * ------------------------------------------------------------------ */

/**
 * 在色板中按色号或名称做不区分大小写的包含匹配。
 * 同时兼容 `code`（页面色板）与 `id`（palette.js 原始色板）两种字段。
 * @param {Array<Object>} palette
 * @param {string} query
 * @returns {Array<Object>}
 */
export function filterPalette(palette, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return palette.slice();
  return palette.filter((c) => {
    const code = String(c.code || c.id || '').toLowerCase();
    const name = String(c.name || '').toLowerCase();
    return code.includes(q) || name.includes(q);
  });
}

/**
 * 按色相把色板排序成「颜色家族」，方便按色系浏览。
 * @param {Array<Object>} palette
 * @returns {Array<Object>}
 */
export function sortByHue(palette) {
  return palette.slice().sort((a, b) => hueOf(a) - hueOf(b));
}

function hueOf(c) {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}
