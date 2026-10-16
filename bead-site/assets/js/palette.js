// palette.js — 全站色库的统一出口
//
// 历史包袱（2026-10 修复）：
//   本文件原来自带一套 55 色的 ARTKAL_55，色值抄的是 CSS 命名色
//   （Purple #800080、DodgerBlue #1E90FF、HotPink #FF69B4…），
//   与创作页那套（抄 Tailwind 调色板）互相冲突 —— 同一个色号
//   例如 A10，在创作页是「活力橙 #F97316」、在白板页却是「酒红 #722F37」。
//   这既不是真实拼豆色，也让两页对不上。
//
// 现在：统一改为引用 bead-colors.js（Artkal Mini 真实色卡 221 色，唯一真源）。
//
// 为什么保留 PALETTE / PALETTE_LAB 这两个旧名字：
//   color.js、convert.js、exporter.js 三个模块按这两个名字取值，
//   它们用的都是「按色号查表」的用法，改内容不改接口即可平滑过渡。

import { BEAD_COLORS } from './bead-colors.js';
import { srgbToLab } from './lab.js';

/** 全部真实拼豆色（Artkal Mini 221 色）。新代码请直接用这个。 */
export const ARTKAL_COLORS = BEAD_COLORS;

/**
 * @deprecated 名字沿用旧的，但内容已经是完整的 221 色真实色库。
 * 新代码请改用 ARTKAL_COLORS。
 */
export const ARTKAL_55 = BEAD_COLORS;

/** 色号 -> 颜色对象，O(1) 查表。 */
export const PALETTE = BEAD_COLORS.reduce((acc, c) => {
  acc[c.code] = c;
  return acc;
}, /** @type {Object} */ ({}));

/** 色号 -> [L, a, b]，模块加载时预计算一次。 */
export const PALETTE_LAB = BEAD_COLORS.reduce((acc, c) => {
  acc[c.code] = srgbToLab([c.r, c.g, c.b]);
  return acc;
}, /** @type {Object} */ ({}));

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.ARTKAL_COLORS = ARTKAL_COLORS;
BeadStudio.ARTKAL_55 = ARTKAL_55;
BeadStudio.PALETTE = PALETTE;
BeadStudio.PALETTE_LAB = PALETTE_LAB;
