// 校验 bead-colors.js 数据完整性
import { BEAD_COLORS, SERIES, BY_CODE, TOTAL, bySeries } from '../assets/js/bead-colors.js';

let fail = 0;
const ok = (name, cond, detail) => {
  console.log((cond ? '  ✓ ' : '  ✗ ') + name + (cond ? '' : ' — ' + JSON.stringify(detail)));
  if (!cond) fail++;
};

console.log('\n=== bead-colors.js 校验 ===');
ok('总色数 = 221', TOTAL === 221, { TOTAL });

const expect = { MA: 26, MB: 32, MC: 29, MD: 26, ME: 24, MF: 25, MG: 21, MH: 23, MM: 15 };
for (const [k, n] of Object.entries(expect)) {
  const got = bySeries(k).length;
  ok(`系列 ${k} = ${n} 色`, got === n, { got });
}

ok('色号无重复', BY_CODE.size === TOTAL, { map: BY_CODE.size, total: TOTAL });
ok('每个色号格式合法(两字母+数字)', BEAD_COLORS.every((c) => /^[A-Z]{2}\d{1,2}$/.test(c.code)));
ok('每个 hex 格式合法', BEAD_COLORS.every((c) => /^#[0-9A-F]{6}$/.test(c.hex)));
ok('hex 与 rgb 完全自洽', BEAD_COLORS.every((c) => {
  const R = parseInt(c.hex.slice(1, 3), 16);
  const G = parseInt(c.hex.slice(3, 5), 16);
  const B = parseInt(c.hex.slice(5, 7), 16);
  return R === c.r && G === c.g && B === c.b;
}));
ok('每个色号都有名称', BEAD_COLORS.every((c) => c.name && c.name.length > 0));
ok('series 字段与色号前缀一致', BEAD_COLORS.every((c) => c.code.startsWith(c.series)));
ok('SERIES 元数据覆盖全部 9 个系列', SERIES.length === 9 && SERIES.every((s) => BY_CODE.has(s.key + '1')));

console.log('\n各系列抽样:');
for (const s of SERIES) {
  const list = bySeries(s.key);
  console.log('  ' + s.key, '|', s.name, '|', list[0].code, list[0].name, list[0].hex, '...', list[list.length - 1].code, list[list.length - 1].name, list[list.length - 1].hex);
}

console.log(`\n结果：${fail === 0 ? '全部通过' : fail + ' 项失败'}`);
process.exit(fail ? 1 : 0);
