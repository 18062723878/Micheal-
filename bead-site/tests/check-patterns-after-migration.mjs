// 迁移后校验：图纸能否正确解码、色号是否都是真实 Artkal 色号
globalThis.window = globalThis;
const { ALL_PATTERNS, C_MAP, PALETTES } = await import('../assets/js/patterns-data.js');
const { BY_CODE } = await import('../assets/js/bead-colors.js');

let fail = 0;
const ok = (n, c, d) => { console.log((c ? '  ✓ ' : '  ✗ ') + n + (c ? '' : ' — ' + JSON.stringify(d))); if (!c) fail++; };

console.log('\n=== 迁移后校验 ===');

ok('图纸总数 = 62', ALL_PATTERNS.length === 62, { n: ALL_PATTERNS.length });
ok('C_MAP 条目 = 47', Object.keys(C_MAP).length === 47, { n: Object.keys(C_MAP).length });

// 每个 C_MAP 值都必须是真实色号
const badKey = Object.entries(C_MAP).filter(([k, v]) => !v || v.code !== k || !BY_CODE.has(k));
ok('C_MAP 键与真实色号一一对应', badKey.length === 0, badKey.slice(0, 5).map(([k]) => k));

// 色板档位
for (const [k, n] of [['standard72', 72], ['classic88', 88], ['advance144', 144], ['full221', 221]]) {
  ok(`色板 ${k} = ${n} 色`, PALETTES[k].length === n, { got: PALETTES[k].length });
}
ok('色板里的色号全部真实', ['standard72', 'classic88', 'advance144', 'full221']
  .every((k) => PALETTES[k].every((c) => BY_CODE.has(c.code))));

// 图纸解码
let cellCount = 0;
const codesInPatterns = new Set();
const badCell = [];
const emptyShapes = [];

for (const p of ALL_PATTERNS) {
  const rows = p.matrix.length;
  const cols = rows ? p.matrix[0].length : 0;
  if (!rows || !cols) { emptyShapes.push(p.id); continue; }
  let ragged = false;
  for (const row of p.matrix) {
    if (row.length !== cols) { ragged = true; break; }
    for (const cell of row) {
      cellCount++;
      if (cell === null || cell === undefined) continue;   // 空格子
      if (!cell.code) { if (badCell.length < 5) badCell.push({ id: p.id, cell }); continue; }
      codesInPatterns.add(cell.code);
      if (!BY_CODE.has(cell.code)) badCell.push({ id: p.id, code: cell.code });
    }
  }
  if (ragged) badCell.push({ id: p.id, issue: '行宽不一致' });
}

ok('无空图纸', emptyShapes.length === 0, emptyShapes);
ok('图纸单元格无异常/未知色号', badCell.length === 0, badCell.slice(0, 5));
ok('图纸用到的色号全部是真实 Artkal 色号', [...codesInPatterns].every((c) => BY_CODE.has(c)));

console.log('\n统计:');
console.log('  解码单元格总数:', cellCount);
console.log('  图纸中出现的色号数:', codesInPatterns.size);
console.log('  示例:', [...codesInPatterns].sort().slice(0, 12).join(' '));

// 抽查一个图纸的首行色号
const sample = ALL_PATTERNS.find((p) => p.id === 'mount-fuji-sakura');
if (sample) {
  const codes = new Set();
  sample.matrix.flat().forEach((c) => c && c.code && codes.add(c.code));
  console.log('  抽查 mount-fuji-sakura 用色:', [...codes].join(' '));
}

console.log(`\n结果：${fail === 0 ? '全部通过' : fail + ' 项失败'}`);
process.exit(fail ? 1 : 0);
