// home.js — 图纸数据解码工具（供灵感图库等模块复用）。
// 历史上的首页渲染逻辑已由 index.html 内联脚本 + bead-viewer.js 接管。

/** Decode an example object ({colors, rows}) into a 2D array of color ids. */
export function decodeGrid(ex) {
  return ex.rows.map((row) =>
    row.split('').map((ch) => ex.colors[parseInt(ch, 36)])
  );
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.decodeGrid = decodeGrid;
