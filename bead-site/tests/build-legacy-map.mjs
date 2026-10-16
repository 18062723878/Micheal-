/**
 * 计算「旧色号 → 真实 Artkal 色号」映射。
 *
 * 原则：以 Lab 色彩空间距离为准，为每个旧色号挑选最接近的真实拼豆色。
 * 这样图纸的视觉观感最大程度不变，同时色号变成真实可购买的标准色号。
 * 若两个旧色号命中同一个真实色，后者退而取次近的未占用色，保证一一对应。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { BEAD_COLORS } from '../assets/js/bead-colors.js';

// lab.js 在模块顶层往 window 上挂东西，Node 环境需要先补一个垫片
globalThis.window = globalThis;
const { srgbToLab, labDistance } = await import('../assets/js/lab.js');

const src = readFileSync('assets/js/patterns-data.js', 'utf8');

/* ---------- 1. 解析旧色板 ---------- */
const legacy = new Map(); // code -> {name, hex, r, g, b}
for (const m of src.matchAll(/const ([A-Z])_PALETTE = \[([\s\S]*?)\n\];/g)) {
  for (const e of m[2].matchAll(
    /\{\s*code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*hex:\s*'(#[0-9A-Fa-f]{6})',\s*r:\s*(\d+),\s*g:\s*(\d+),\s*b:\s*(\d+)\s*\}/g
  )) {
    legacy.set(e[1], { name: e[2], hex: e[3].toUpperCase(), r: +e[4], g: +e[5], b: +e[6] });
  }
}

/* ---------- 2. 取 C_MAP 覆盖的色号（即图纸可能用到的全集） ---------- */
const cmapBlock = src.match(/export const C_MAP = \{([\s\S]*?)\n\};/);
const cmapKeys = [...(cmapBlock ? cmapBlock[1] : '').matchAll(/([A-Z]+\d+):/g)].map((m) => m[1]);

const codes = [...new Set(cmapKeys)];
console.log('C_MAP 中的旧色号数:', codes.length);

/* ---------- 3. 逐个找最近的真实色 ---------- */
const realLab = BEAD_COLORS.map((c) => ({ c, lab: srgbToLab([c.r, c.g, c.b]) }));

const dist = labDistance;

/* 距离矩阵：每个旧码对所有真实色的 Lab 距离 */
const matrix = new Map();
const allPairs = [];
for (const code of codes) {
  const L = legacy.get(code);
  if (!L) continue;
  const lab = srgbToLab([L.r, L.g, L.b]);
  const arr = realLab.map((r) => ({ c: r.c, d: dist(lab, r.lab) })).sort((a, b) => a.d - b.d);
  matrix.set(code, arr);
  for (const it of arr) allPairs.push({ code, c: it.c, d: it.d });
}
allPairs.sort((a, b) => a.d - b.d);

/* 全局最近优先贪心：反复挑当前最小的未占用配对。
   相比「逐个旧码各自找最近」，这样能避免先到者抢走后、后到者被迫用远色
   —— 旧写法里「正绿」就因此被配到了 ΔE 28.5 的黄绿。 */
const taken = new Set();
const map = new Map();
const assignD = new Map();
for (const p of allPairs) {
  if (map.has(p.code) || taken.has(p.c.code)) continue;
  map.set(p.code, p.c);
  assignD.set(p.code, p.d);
  taken.add(p.c.code);
  if (map.size === matrix.size) break;
}

const rows = [];
for (const code of codes) {
  const L = legacy.get(code);
  const pick = map.get(code);
  if (!L || !pick) continue;
  const best = matrix.get(code)[0];
  const chosen = assignD.get(code);
  rows.push({
    旧: code,
    旧名: L.name,
    旧hex: L.hex,
    新: pick.code,
    新名: pick.name,
    新hex: pick.hex,
    色差: +chosen.toFixed(1),
    最优: +best.d.toFixed(1),
    改用: best.c.code !== pick.code ? '避让' : '',
  });
}

/* ---------- 4. 输出 ---------- */
console.log('\n旧码 → 真实色号 映射：');
console.log('旧码  旧名称    旧色值     →  新码   新名称      新色值    采用ΔE  最优ΔE  备注');
for (const r of rows.sort((a, b) => (a.旧 < b.旧 ? -1 : 1))) {
  console.log(
    '  ' + r.旧.padEnd(5) + r.旧名.padEnd(9) + r.旧hex + ' → ' + r.新.padEnd(6) + r.新名.padEnd(11) + r.新hex +
    String(r.色差).padStart(8) + String(r.最优).padStart(8) + '  ' + r.改用
  );
}

const dup = rows.filter((r) => r.改用);
const worst = rows.slice().sort((a, b) => b.色差 - a.色差)[0];
console.log('\n避让重复的条目:', dup.length);
console.log('最大色差 ΔE:', worst.色差, '（', worst.旧, worst.旧名, '→', worst.新, worst.新名, '）');

// 统计需重写 RLE 的 token
const tokenSets = new Set();
const MARK = 'decodeGrid(';
const BT = String.fromCharCode(96);
let i = 0;
while (true) {
  const s = src.indexOf(MARK, i);
  if (s === -1) break;
  const o = src.indexOf(BT, s);
  const c = src.indexOf(BT, o + 1);
  const g = src.slice(o + 1, c);
  for (const t of g.split(/[\s|]+/)) {
    const m = t.match(/^\d*([A-Z]+\d+)$/);
    if (m) tokenSets.add(m[1]);
  }
  i = c + 1;
}
console.log('图纸 RLE 中用到的色号数:', tokenSets.size, '（全部需替换）');

// 导出映射供下一步使用
const out = {};
for (const [k, v] of map) out[k] = { code: v.code, name: v.name, hex: v.hex };
writeFileSync('tests/.legacy-map.json', JSON.stringify(out, null, 2));
console.log('\n映射已写入 tests/.legacy-map.json');
