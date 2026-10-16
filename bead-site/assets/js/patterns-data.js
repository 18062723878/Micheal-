/**
 * patterns-data.js — 图纸数据、色板与解码引擎
 *
 * 色库说明（重要，不要退回旧写法）：
 *   本文件**不再自带色值**。所有颜色统一来自 bead-colors.js ——
 *   Artkal Mini（2.6mm）真实色卡 221 色的唯一真源。
 *
 *   历史包袱：改造前这里有一套 H/A/B/C/D/E/F/G/M 近似色板，
 *   色值抄的是 Tailwind 调色板，与白板页那套（抄 CSS 命名色）互相冲突，
 *   同一色号在两页显示成不同颜色。现已全部废弃，改用真实 Artkal 色号。
 *
 *   旧短码 → 真实色号的对应关系由 Lab 最近色计算得出，
 *   生成脚本见 tests/build-legacy-map.mjs，映射凭据 tests/.legacy-map.json。
 */

import { BEAD_COLORS, BY_CODE } from './bead-colors.js';

/* ---------- 图纸实际用到的标准色 ----------
   键名即真实 Artkal 色号，可从色卡直接购买。 */
export const C_MAP = {
  MA4: BY_CODE.get('MA4'),
  MA6: BY_CODE.get('MA6'),
  MA7: BY_CODE.get('MA7'),
  MA8: BY_CODE.get('MA8'),
  MA10: BY_CODE.get('MA10'),
  MA14: BY_CODE.get('MA14'),
  MA16: BY_CODE.get('MA16'),
  MA19: BY_CODE.get('MA19'),
  MA22: BY_CODE.get('MA22'),
  MB2: BY_CODE.get('MB2'),
  MB5: BY_CODE.get('MB5'),
  MB6: BY_CODE.get('MB6'),
  MB8: BY_CODE.get('MB8'),
  MB19: BY_CODE.get('MB19'),
  MB28: BY_CODE.get('MB28'),
  MC3: BY_CODE.get('MC3'),
  MC4: BY_CODE.get('MC4'),
  MC11: BY_CODE.get('MC11'),
  MC13: BY_CODE.get('MC13'),
  MC18: BY_CODE.get('MC18'),
  MD3: BY_CODE.get('MD3'),
  MD9: BY_CODE.get('MD9'),
  MD14: BY_CODE.get('MD14'),
  MD20: BY_CODE.get('MD20'),
  MD21: BY_CODE.get('MD21'),
  MD25: BY_CODE.get('MD25'),
  ME4: BY_CODE.get('ME4'),
  ME8: BY_CODE.get('ME8'),
  MF1: BY_CODE.get('MF1'),
  MF2: BY_CODE.get('MF2'),
  MF4: BY_CODE.get('MF4'),
  MF12: BY_CODE.get('MF12'),
  MF14: BY_CODE.get('MF14'),
  MF15: BY_CODE.get('MF15'),
  MF22: BY_CODE.get('MF22'),
  MG8: BY_CODE.get('MG8'),
  MG9: BY_CODE.get('MG9'),
  MG10: BY_CODE.get('MG10'),
  MG12: BY_CODE.get('MG12'),
  MG14: BY_CODE.get('MG14'),
  MG16: BY_CODE.get('MG16'),
  MH1: BY_CODE.get('MH1'),
  MH4: BY_CODE.get('MH4'),
  MH6: BY_CODE.get('MH6'),
  MH7: BY_CODE.get('MH7'),
  MH10: BY_CODE.get('MH10'),
  MM15: BY_CODE.get('MM15'),
};

/* ---------- 色板档位 ----------
   全部是真实 221 色的均衡子集（按系列等距抽样，保证各色系都有覆盖），
   不再使用任何虚构色号（如旧版的 X1~X88）。 */
function pickEvenly(list, n) {
  if (n >= list.length) return list.slice();
  const out = [];
  const step = list.length / n;
  for (let i = 0; i < n; i++) out.push(list[Math.floor(i * step)]);
  return out;
}

export const PALETTES = {
  standard72: pickEvenly(BEAD_COLORS, 72),
  classic88: pickEvenly(BEAD_COLORS, 88),
  advance144: pickEvenly(BEAD_COLORS, 144),
  full221: BEAD_COLORS
};


// =========================================================================
// 高容错快速图纸解析引擎 (RLE + Token 自动双重对齐校准)
// =========================================================================
function decodeGrid(rleStr, width, height, cmap) {
  const lines = rleStr.trim().split('|');
  const matrix = [];

  for (let y = 0; y < height; y++) {
    const rowStr = lines[y] || '';
    const tokens = rowStr.trim().split(/\s+/);
    const row = [];

    for (const t of tokens) {
      if (!t) continue;
      const m = t.match(/^(\d+)?([A-Za-z0-9_.]+)$/);
      if (m) {
        const count = m[1] ? parseInt(m[1], 10) : 1;
        const code = m[2];
        const val = (code === '.' || code === '_') ? null : (cmap[code] || null);
        for (let i = 0; i < count; i++) {
          if (row.length < width) row.push(val);
        }
      }
    }

    while (row.length < width) {
      row.push(null);
    }
    matrix.push(row);
  }
  return matrix;
}

// =========================================================================
// 精选 50 款 30x30 / 32x32 大画幅主流图纸
// =========================================================================
export const ALL_PATTERNS = [
  // -------------------------------------------------------------
  // 一、风景建筑板块 (Architecture - 10款)
  // -------------------------------------------------------------
  {
    id: 'mount-fuji-sakura',
    title: '富士山与飘落樱花',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。白雪山冠、朱红初升旭日与和风吹拂的粉樱花瓣。',
    matrix: decodeGrid(`
      32. | 14. 4MF4 14. | 13. 6MF4 13. | 12. 8MF4 12. | 12. 8MF4 12. |
      13. 6MF4 13. | 14. 4MF4 14. | 32. | 32. | 14. 4MH1 14. |
      13. 6MH1 13. | 12. 8MH1 12. | 11. 10MH1 11. | 10. 12MH1 10. | 9. 14MH1 9. |
      8. 16MH1 8. | 7. 4MH1 10MD3 4MH1 7. | 6. 3MH1 14MD3 3MH1 6. | 5. 2MH1 18MD3 2MH1 5. | 4. 24MD3 4. |
      3. 26MD3 3. | 2. 28MD3 2. | 1. 30MD3 1. | 32MD3 | 32MD3 |
      1. 30MD25 1. | 2. 28MD25 2. | 32MC11 | 32MC11 | 32MC3 | 32MC3 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'sea-torii-gate',
    title: '严岛水上鸟居',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。东方朱红神木大鸟居，傲然屹立于碧蓝海涛之中。',
    matrix: decodeGrid(`
      32. | 32. | 13. 6MF1 13. | 12. 8MF1 12. | 11. 10MF1 11. |
      11. 10MF1 11. | 12. 8MF1 12. | 13. 6MF1 13. | 3. 26MF4 3. | 2. 28MF15 2. |
      32. | 4. 24MF4 4. | 8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. |
      8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. |
      8. 3MF4 10. 3MF4 8. | 8. 3MF4 10. 3MF4 8. | 8. 3MH7 10. 3MH7 8. | 8. 3MH7 10. 3MH7 8. | 32MD25 |
      32MD3 | 32MD25 | 32MD3 | 32MC11 | 32MC3 | 32MC11 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'dutch-windmill',
    title: '欧式红顶风车',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。红顶石砌风车，十字风翼旋转于广阔草坪。',
    matrix: decodeGrid(`
      15. 2MH7 15. | 15. 2MH7 15. | 15. 2MH7 15. | 15. 2MH7 15. | 15. 2MH7 15. |
      15. 2MH7 15. | 15. 2MH7 15. | 15. 2MH7 15. | 15. 2MH7 15. | 3. 26MH7 3. |
      14. 4MA8 14. | 14. 4MF4 14. | 13. 6MF4 13. | 12. 8MF4 12. | 11. 10MG16 11. |
      11. 10MG16 11. | 10. 12MG16 10. | 10. 4MG16 4MH7 4MG16 10. | 10. 4MG16 4MH7 4MG16 10. | 9. 14MG16 9. |
      9. 14MG16 9. | 8. 16MG16 8. | 8. 16MG16 8. | 7. 5MG16 6MH7 7MG16 7. | 7. 5MG16 6MH7 7MG16 7. |
      6. 20MG16 6. | 32MB5 | 32MB2 | 32MB5 | 32MB2 | 32MB8 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'eiffel-tower',
    title: '巴黎埃菲尔铁塔',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。金属镂空骨架与浪漫夜景地标建筑。',
    matrix: decodeGrid(`
      15. 2MC18 15. | 15. 2MC18 15. | 15. 2MC18 15. | 14. 4MC18 14. | 14. 4MC18 14. |
      13. 6MC18 13. | 13. 6MC18 13. | 12. 8MC18 12. | 11. 10MC18 11. | 10. 12MM15 10. |
      12. 8MC18 12. | 12. 8MC18 12. | 11. 10MC18 11. | 11. 10MC18 11. | 10. 12MC18 10. |
      10. 12MC18 10. | 9. 14MC18 9. | 8. 16MM15 8. | 7. 18MC18 7. | 7. 18MC18 7. |
      6. 7MC18 6. 7MC18 6. | 5. 8MC18 6. 8MC18 5. | 4. 9MC18 6. 9MC18 4. | 3. 10MC18 6. 10MC18 3. | 2. 11MC18 6. 11MC18 2. |
      1. 12MC18 6. 12MC18 1. | 32MM15 | 32MB2 | 32MB8 | 32MB5 | 32MB2 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'chinese-pavilion',
    title: '中式古典飞檐凉亭',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。重檐歇山顶、雕梁画栋与朱红廊柱。',
    matrix: decodeGrid(`
      15. 2MA6 15. | 14. 4MA6 14. | 13. 6MA6 13. | 10. 12MG8 10. | 7. 18MG8 7. |
      4. 24MG8 4. | 2. 28MG14 2. | 5. 22MG8 5. | 11. 10MF4 11. | 11. 10MF4 11. |
      8. 16MG8 8. | 5. 22MG8 5. | 2. 28MG14 2. | 6. 20MF4 6. | 8. 2MF4 12. 2MF4 8. |
      8. 2MF4 12. 2MF4 8. | 8. 2MF4 12. 2MF4 8. | 8. 2MF4 12. 2MF4 8. | 8. 2MF4 12. 2MF4 8. | 8. 2MF4 12. 2MF4 8. |
      6. 20MM15 6. | 5. 22MM15 5. | 4. 24MC18 4. | 3. 26MH6 3. | 32MB5 |
      32MB2 | 32MB5 | 32MB8 | 32MD25 | 32MD3 | 32MC11 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'sunset-lighthouse',
    title: '海岸落日灯塔',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。礁石之上的黑白红相间灯塔，余晖与浪花相映。',
    matrix: decodeGrid(`
      22. 6MA8 4. | 20. 10MA8 2. | 20. 10MA8 2. | 21. 8MA8 3. | 13. 6MH7 13. |
      12. 8MA8 12. | 11. 10MH7 11. | 12. 8MF4 12. | 12. 8MF4 12. | 12. 8MH1 12. |
      12. 8MH1 12. | 11. 10MF4 11. | 11. 10MF4 11. | 11. 10MH1 11. | 11. 10MH1 11. |
      10. 12MF4 10. | 10. 12MF4 10. | 10. 12MH1 10. | 10. 12MH1 10. | 9. 14MF4 9. |
      9. 14MF4 9. | 8. 16MH1 8. | 6. 20MH6 6. | 4. 24MH6 4. | 2. 28MC18 2. |
      32MD3 | 32MD25 | 32MD3 | 32MC11 | 32MC3 | 32MC11 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'camping-tent',
    title: '星空露营帐篷',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。深邃夜空、篝火炊烟与亮黄色三角帐篷。',
    matrix: decodeGrid(`
      32. | 5. 1MA8 26. | 24. 1MA8 7. | 12. 1MA8 19. | 32. |
      18. 1MA8 13. | 7. 1MA8 24. | 15. 2MA14 15. | 14. 4MA14 14. | 14. 4MA14 14. |
      13. 6MA14 13. | 12. 8MA14 12. | 11. 10MA14 11. | 10. 12MA14 10. | 9. 14MA14 9. |
      8. 16MA14 8. | 7. 5MA14 8MH7 5MA14 7. | 6. 5MA14 10MH7 5MA14 6. | 5. 5MA14 12MH7 5MA14 5. | 4. 24MA14 4. |
      32MB8 | 32MB8 | 32MB2 | 32MB2 | 32MB5 |
      32MB5 | 22. 2MF4 8. | 21. 4MF2 7. | 20. 6MA14 6. | 21. 4MG8 7. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'kyoto-pagoda',
    title: '古都五重塔',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。经典多层宝塔造型，层层舒展的古风黑瓦。',
    matrix: decodeGrid(`
      15. 2MA6 15. | 15. 2MA6 15. | 15. 2MA6 15. | 13. 6MH7 13. | 10. 12MH7 10. |
      12. 8MG14 12. | 11. 10MH7 11. | 8. 16MH7 8. | 11. 10MG14 11. | 10. 12MH7 10. |
      7. 18MH7 7. | 10. 12MG14 10. | 9. 14MH7 9. | 5. 22MH7 5. | 9. 14MG14 9. |
      8. 16MH7 8. | 3. 26MH7 3. | 8. 16MG14 8. | 7. 18MH7 7. | 2. 28MH7 2. |
      7. 18MG14 7. | 6. 20MH7 6. | 1. 30MH7 1. | 6. 20MG14 6. | 5. 22MH6 5. |
      4. 24MH6 4. | 32MB5 | 32MB2 | 32MB8 | 32MB2 | 32MB5 | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'aurora-mountain',
    title: '极光雪原孤峰',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。梦幻绿色极光光带划过夜空，映照白雪皑皑的山脊。',
    matrix: decodeGrid(`
      32MD3 | 3. 26MB6 3. | 2. 28MB28 2. | 1. 30MB19 1. | 32MD3 |
      5. 22MB28 5. | 32MD3 | 15. 2MH1 15. | 14. 4MH1 14. | 13. 6MH1 13. |
      12. 8MH1 12. | 11. 10MH1 11. | 10. 6MH1 6MD3 10. | 9. 7MH1 7MD3 9. | 8. 8MH1 8MD3 8. |
      7. 9MH1 9MD3 7. | 6. 10MH1 10MD3 6. | 5. 11MH1 11MD3 5. | 4. 12MH1 12MD3 4. | 3. 13MH1 13MD3 3. |
      2. 14MH1 14MD3 2. | 1. 15MH1 15MD3 1. | 32MH1 | 32MH10 | 32MM15 |
      32MH1 | 32MH10 | 32MH1 | 32MM15 | 32MH1 | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'water-town-bridge',
    title: '江南水乡拱桥',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。青瓦白墙临水而居，圆拱石桥倒映于碧波之间。',
    matrix: decodeGrid(`
      32. | 32. | 2. 10MH7 20. | 1. 12MH7 19. | 3. 8MH1 21. |
      3. 8MH1 21. | 3. 8MH1 21. | 32. | 8. 16MM15 8. | 6. 20MM15 6. |
      4. 24MM15 4. | 3. 26MC18 3. | 2. 7MC18 12. 7MC18 2. | 1. 7MC18 16. 7MC18 1. | 1. 7MC18 16. 7MC18 1. |
      32MC11 | 32MC11 | 32MD25 | 32MD3 | 32MD25 | 32MD3 | 32MC11 |
      32MC3 | 32MC11 | 32MD25 | 32MD3 | 32MC11 | 32MC3 | 32MC11 | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },

  // -------------------------------------------------------------
  // 二、热门动漫与潮流 IP (Anime - 12款)
  // -------------------------------------------------------------
  {
    id: 'kuromi-standard',
    title: '库洛米标准大头',
    category: 'anime',
    tag: '潮流顶流',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。标志性暗夜恶魔双角、粉色骷髅徽标与灵动萌颜。',
    matrix: decodeGrid(`
      32. | 4. 4MH7 16. 4MH7 4. | 3. 6MH7 14. 6MH7 3. | 2. 7MD21 14. 7MD21 2. | 2. 7MD21 14. 7MD21 2. |
      3. 6MD14 14. 6MD14 3. | 4. 24MD14 4. | 3. 26MD14 3. | 2. 28MD14 2. | 2. 28MD14 2. |
      3. 10MD14 6ME4 10MD14 3. | 3. 8MD14 10ME4 8MD14 3. | 4. 8MD14 8ME4 8MD14 4. | 5. 7MD14 8ME4 7MD14 5. | 4. 24MH1 4. |
      3. 26MH1 3. | 3. 26MH1 3. | 4. 4MH1 2MH7 12MH1 2MH7 4MH1 4. | 4. 4MH1 2MH7 12MH1 2MH7 4MH1 4. | 5. 22MH1 5. |
      5. 2MH1 4ME4 10MH1 4ME4 2MH1 5. | 6. 20MH1 6. | 7. 8MH1 2MH7 8MH1 7. | 8. 16MH1 8. | 9. 14MH1 9. |
      10. 12MD21 10. | 8. 16MD21 8. | 9. 14MD21 9. | 11. 10MD21 11. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'chiikawa-standard',
    title: '吉伊卡哇治愈大哭',
    category: 'anime',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。治愈系软萌白熊，水汪汪大眼睛与粉嫩腮红。',
    matrix: decodeGrid(`
      32. | 32. | 10. 12MH7 10. | 8. 16MH7 8. | 7. 18MH1 7. |
      6. 20MH1 6. | 5. 22MH1 5. | 5. 22MH1 5. | 4. 24MH1 4. | 4. 24MH1 4. |
      4. 4MH1 2MH7 12MH1 2MH7 4MH1 4. | 4. 4MH1 2MH7 12MH1 2MH7 4MH1 4. | 4. 24MH1 4. | 4. 3MH1 4MF14 10MH1 4MF14 3MH1 4. | 5. 2MH1 4MF14 10MH1 4MF14 2MH1 5. |
      5. 10MH1 2MH7 10MH1 5. | 6. 9MH1 2MH7 9MH1 6. | 7. 18MH1 7. | 8. 16MH1 8. | 9. 14MH1 9. |
      8. 16MH1 8. | 7. 18MH1 7. | 7. 18MH1 7. | 8. 6MH1 4. 6MH1 8. | 9. 4MH1 6. 4MH1 9. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'cinnamoroll-standard',
    title: '大耳狗玉桂狗展耳',
    category: 'anime',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。如云朵般向两侧舒展的大耳朵与纯白身形。',
    matrix: decodeGrid(`
      32. | 32. | 32. | 1. 4MH1 22. 4MH1 1. | 1. 6MH1 18. 6MH1 1. |
      2. 6MH1 16. 6MH1 2. | 3. 26MH1 3. | 4. 24MH1 4. | 5. 22MH1 5. | 6. 20MH1 6. |
      6. 4MH1 2MC3 8MH1 2MC3 4MH1 6. | 6. 4MH1 2MC3 8MH1 2MC3 4MH1 6. | 6. 2MH1 3MF22 10MH1 3MF22 2MH1 6. | 7. 18MH1 7. | 8. 7MH1 2ME4 7MH1 8. |
      9. 14MH1 9. | 10. 12MH1 10. | 11. 10MH1 11. | 10. 12MH1 10. | 9. 14MH1 9. |
      10. 4MH1 4. 4MH1 10. | 11. 3MH1 4. 3MH1 11. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'my-melody-standard',
    title: '美乐蒂粉红兔耳',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。纯真粉红兜帽、黄色小花配饰与雪白脸庞。',
    matrix: decodeGrid(`
      32. | 6. 4MF14 12. 4MF14 6. | 5. 6MF14 10. 6MF14 5. | 5. 6MF14 10. 6MF14 5. | 5. 6MF14 10. 6MF14 5. |
      6. 5MF14 10. 5MF14 6. | 6. 20MF14 6. | 5. 22MF14 5. | 4. 24MF14 4. | 4. 24MF14 4. |
      4. 5MF14 4MA8 15MF14 4. | 4. 4MF14 6MA8 14MF14 4. | 5. 22MF14 5. | 5. 4MF14 14MH1 4MF14 5. | 6. 3MF14 14MH1 3MF14 6. |
      6. 3MF14 2MH1 2MH7 6MH1 2MH7 2MH1 3MF14 6. | 7. 2MF14 2MH1 2MH7 6MH1 2MH7 2MH1 2MF14 7. | 7. 2MF14 6MH1 2MA8 6MH1 2MF14 7. | 8. 2MF14 12MH1 2MF14 8. | 9. 14MF14 9. |
      10. 12MF14 10. | 10. 12MF14 10. | 9. 14MF14 9. | 8. 16MF14 8. | 10. 4MH1 4. 4MH1 10. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'pochacco-standard',
    title: '帕恰狗运动黑耳',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。黑色标志性大垂耳，身着红色运动小背心。',
    matrix: decodeGrid(`
      32. | 4. 5MH7 14. 5MH7 4. | 3. 7MH7 12. 7MH7 3. | 3. 7MH7 12. 7MH7 3. | 4. 6MH7 12. 6MH7 4. |
      5. 5MH7 12. 5MH7 5. | 8. 16MH1 8. | 7. 18MH1 7. | 6. 20MH1 6. | 6. 20MH1 6. |
      6. 4MH1 2MH7 8MH1 2MH7 4MH1 6. | 6. 4MH1 2MH7 8MH1 2MH7 4MH1 6. | 6. 9MH1 2MH7 9MH1 6. | 7. 18MH1 7. | 8. 16MH1 8. |
      9. 14MH1 9. | 10. 12MH1 10. | 10. 12MF4 10. | 9. 14MF4 9. | 8. 16MF4 8. |
      8. 16MF4 8. | 8. 2MH1 12MF4 2MH1 8. | 8. 2MH1 12MF4 2MH1 8. | 9. 14MH1 9. | 10. 4MH1 4. 4MH1 10. |
      11. 3MH1 4. 3MH1 11. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'pikachu-lightning',
    title: '皮卡丘经典大头',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。黑尖闪电大耳朵、红脸蛋腮红与明黄元气大头。',
    matrix: decodeGrid(`
      2. 4MH7 20. 4MH7 2. | 2. 5MH7 18. 5MH7 2. | 3. 5MA8 16. 5MA8 3. | 3. 6MA8 14. 6MA8 3. | 4. 6MA8 12. 6MA8 4. |
      5. 6MA8 10. 6MA8 5. | 6. 20MA8 6. | 6. 20MA8 6. | 5. 22MA8 5. | 5. 22MA8 5. |
      5. 3MA8 2MH7 12MA8 2MH7 3MA8 5. | 5. 3MA8 2MH7 12MA8 2MH7 3MA8 5. | 5. 22MA8 5. | 4. 2MA8 3MF4 14MA8 3MF4 2MA8 4. | 4. 2MA8 4MF4 12MA8 4MF4 2MA8 4. |
      5. 10MA8 2MH7 10MA8 5. | 6. 9MA8 2MF4 9MA8 6. | 7. 18MA8 7. | 8. 16MA8 8. | 9. 14MA8 9. |
      10. 12MA8 10. | 9. 14MA8 9. | 9. 14MA8 9. | 10. 4MA8 4. 4MA8 10. | 11. 3MA8 4. 3MA8 11. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'gengar-shadow',
    title: '耿鬼暗影坏笑',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。幽灵系宝可梦耿鬼，大红眼睛与白色尖牙狞笑。',
    matrix: decodeGrid(`
      32. | 4. 4MD21 16. 4MD21 4. | 4. 5MD21 14. 5MD21 4. | 5. 5MD21 12. 5MD21 5. | 6. 20MD21 6. |
      5. 22MD21 5. | 4. 24MD21 4. | 4. 24MD21 4. | 3. 26MD21 3. | 3. 4MD21 3MF4 12MD21 3MF4 4MD21 3. |
      3. 4MD21 4MF4 10MD21 4MF4 4MD21 3. | 3. 5MD21 2MH1 12MD21 2MH1 5MD21 3. | 3. 26MD21 3. | 4. 24MD21 4. | 4. 4MD21 16MH1 4MD21 4. |
      5. 3MD21 16MH1 3MD21 5. | 5. 3MD21 2MH1 2MH7 2MH1 2MH7 2MH1 2MH7 2MH1 3MD21 5. | 6. 20MD21 6. | 7. 18MD21 7. | 8. 16MD21 8. |
      7. 18MD21 7. | 6. 20MD21 6. | 7. 18MD21 7. | 9. 4MD21 6. 4MD21 9. | 10. 3MD21 6. 3MD21 10. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'miku-twintail',
    title: '初音未来葱绿双马尾',
    category: 'anime',
    tag: '虚拟歌姬',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。标志性青蓝双马尾发辫、黑色耳机发饰与灵动面容。',
    matrix: decodeGrid(`
      32. | 2. 4MC11 20. 4MC11 2. | 1. 6MC11 18. 6MC11 1. | 1. 6MC11 6MH7 4MC11 6MH7 1. 6MC11 1. | 2. 5MC11 4MH7 10MC11 4MH7 2. 5MC11 |
      3. 4MC11 3MH7 12MC11 3MH7 3. 4MC11 | 3. 4MC11 2MH7 14MC11 2MH7 3. 4MC11 | 4. 3MC11 2MH7 14MG9 2MH7 4. 3MC11 | 5. 2MC11 2MH7 14MG9 2MH7 5. 2MC11 | 6. 1MC11 2MH7 14MG9 2MH7 6. 1MC11 |
      8. 2MH7 2MG9 2MC11 4MG9 2MC11 2MG9 2MH7 8. | 8. 2MH7 2MG9 2MC11 4MG9 2MC11 2MG9 2MH7 8. | 9. 2MH7 10MG9 2MH7 9. | 10. 2MH7 2MG9 4MF14 2MG9 2MH7 10. | 11. 10MG9 11. |
      12. 8MG9 12. | 11. 10MC18 11. | 10. 12MC18 10. | 9. 14MC18 9. | 9. 2MC11 10MC18 2MC11 9. |
      9. 2MC11 10MC18 2MC11 9. | 10. 12MC18 10. | 11. 4MC18 2. 4MC18 11. | 11. 3MC18 4. 3MC18 11. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'luffy-strawhat',
    title: '草帽路飞经典大头',
    category: 'anime',
    tag: '航海王',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。标志性金色大草帽、红色缎带与开朗大笑脸。',
    matrix: decodeGrid(`
      32. | 32. | 10. 12MA6 10. | 8. 16MA6 8. | 7. 18MA6 7. |
      6. 20MA6 6. | 5. 22MF4 5. | 4. 24MF4 4. | 2. 28MA6 2. | 1. 30MA6 1. |
      32MA6 | 8. 16MH7 8. | 7. 18MH7 7. | 8. 4MH7 8MG9 4MH7 8. | 8. 3MH7 2MG9 2MH7 2MG9 2MH7 2MG9 3MH7 8. |
      8. 3MH7 2MG9 2MH7 2MG9 2MH7 2MG9 3MH7 8. | 9. 14MG9 9. | 9. 2MG9 10MH1 2MG9 9. | 10. 12MH1 10. | 11. 10MG9 11. |
      10. 12MF4 10. | 9. 14MF4 9. | 8. 16MF4 8. | 9. 14MG9 9. | 10. 12MG9 10. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'tanjiro-standard',
    title: '灶门炭治郎市松纹',
    category: 'anime',
    tag: '鬼灭之刃',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。深红刺猬发、额前火斑伤疤与黑绿相间方格羽织。',
    matrix: decodeGrid(`
      32. | 11. 10MF15 11. | 9. 14MF15 9. | 8. 16MF15 8. | 7. 18MF15 7. |
      7. 4MF15 4MF4 10MF15 7. | 7. 3MF15 3MF4 12MG9 7. | 8. 2MF15 14MG9 8. | 8. 2MF15 2MG9 2MH7 4MG9 2MH7 2MG9 8. | 8. 2MF15 2MG9 2MH7 4MG9 2MH7 2MG9 8. |
      9. 14MG9 9. | 10. 12MG9 10. | 10. 5MG9 2MH7 5MG9 10. | 11. 10MG9 11. | 10. 12MG9 10. |
      8. 4MB2 4MH7 4MB2 4MH7 8. | 8. 4MB2 4MH7 4MB2 4MH7 8. | 7. 5MH7 5MB2 5MH7 5MB2 7. | 7. 5MH7 5MB2 5MH7 5MB2 7. | 6. 6MB2 6MH7 6MB2 6MH7 6. |
      6. 6MB2 6MH7 6MB2 6MH7 6. | 7. 18MH6 7. | 8. 16MH6 8. | 9. 14MH6 9. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'nezuko-standard',
    title: '灶门祢豆子口衔绿竹',
    category: 'anime',
    tag: '鬼灭之刃',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。波浪长卷发、粉红麻叶纹与衔在口中的翠竹筒。',
    matrix: decodeGrid(`
      32. | 10. 12MH7 10. | 8. 16MH7 8. | 7. 18MH7 7. | 6. 20MH7 6. |
      6. 6MH7 8MG9 6MH7 6. | 6. 4MH7 12MG9 4MH7 6. | 6. 3MH7 2MG9 2ME4 4MG9 2ME4 2MG9 3MH7 6. | 6. 3MH7 2MG9 2ME4 4MG9 2ME4 2MG9 3MH7 6. | 7. 2MH7 14MG9 2MH7 7. |
      7. 2MH7 2MG9 8MB5 2MG9 2MH7 7. | 7. 2MH7 2MG9 8MB2 2MG9 2MH7 7. | 8. 16MG9 8. | 9. 14MG9 9. | 8. 16MF14 8. |
      7. 18MF14 7. | 7. 18MF14 7. | 6. 20MF14 6. | 6. 20MF14 6. | 6. 20MF14 6. |
      7. 18MF14 7. | 8. 16MF14 8. | 9. 14MF14 9. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'anya-forger',
    title: '阿尼亚优雅假笑',
    category: 'anime',
    tag: '间谍过家家',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。世界名画呵·优雅迷之微笑与标志性黑金发饰。',
    matrix: decodeGrid(`
      32. | 6. 4MH7 12. 4MH7 6. | 5. 6MA6 10. 6MA6 5. | 4. 8MF14 8. 8MF14 4. | 4. 24MF14 4. |
      4. 24MF14 4. | 5. 22MF14 5. | 6. 20MF14 6. | 7. 3MF14 12MG9 3MF14 7. | 7. 2MF14 14MG9 2MF14 7. |
      7. 2MF14 2MG9 2MB2 6MG9 2MB2 2MG9 2MF14 7. | 7. 2MF14 2MG9 2MB2 6MG9 2MB2 2MG9 2MF14 7. | 8. 2MF14 12MG9 2MF14 8. | 8. 2MF14 2MF22 8MG9 2MF22 2MF14 8. | 9. 2MF14 10MG9 2MF14 9. |
      10. 12MG9 10. | 11. 10MG9 11. | 10. 12MH6 10. | 9. 14MH6 9. | 8. 16MH6 8. |
      8. 16MH6 8. | 9. 14MH6 9. | 10. 12MH6 10. | 11. 10MH6 11. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },

  // -------------------------------------------------------------
  // 三、游戏像素神作 (Games - 10款)
  // -------------------------------------------------------------
  {
    id: 'black-myth-wukong',
    title: '黑神话悟空齐天大圣',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。头戴凤翅紫金冠、双翎高耸的齐天大圣威严面相。',
    matrix: decodeGrid(`
      8. 2MF4 12. 2MF4 8. | 9. 2MF4 10. 2MF4 9. | 10. 2MF4 8. 2MF4 10. | 11. 2MF4 6. 2MF4 11. | 12. 2MF4 4. 2MF4 12. |
      13. 6MF4 13. | 11. 10MA6 11. | 10. 12MA6 10. | 9. 14MA6 9. | 8. 16MA8 8. |
      8. 4MA8 8MG8 4MA8 8. | 8. 3MA8 10MG8 3MA8 8. | 9. 14MG10 9. | 9. 2MG10 2MG9 6MG10 2MG9 2MG10 9. | 9. 2MG10 2MA8 6MG10 2MA8 2MG10 9. |
      10. 12MG9 10. | 11. 10MG9 11. | 11. 4MG9 2MF4 4MG9 11. | 12. 8MG9 12. | 11. 10MG10 11. |
      10. 12MG10 10. | 8. 16MF4 8. | 7. 18MA6 7. | 6. 20MA6 6. | 6. 20MA6 6. |
      7. 18MA6 7. | 8. 16MG8 8. | 9. 14MG8 9. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'genshin-paimon',
    title: '原神派蒙应急食品',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。雪白蓬松短发、深蓝星空发饰与金色双眸。',
    matrix: decodeGrid(`
      32. | 32. | 11. 10MH1 11. | 9. 14MH1 9. | 8. 16MH1 8. |
      7. 4MD3 10MH1 4MD3 7. | 7. 4MD3 10MH1 4MD3 7. | 7. 18MH1 7. | 8. 16MH1 8. | 8. 3MH1 10MG9 3MH1 8. |
      8. 2MH1 2MG9 2MA8 4MG9 2MA8 2MG9 2MH1 8. | 8. 2MH1 2MG9 2MA8 4MG9 2MA8 2MG9 2MH1 8. | 9. 2MH1 10MG9 2MH1 9. | 9. 2MH1 2MF22 6MG9 2MF22 2MH1 9. | 10. 2MH1 8MG9 2MH1 10. |
      11. 10MH1 11. | 12. 8MH1 12. | 10. 12MD3 10. | 9. 14MD3 9. | 9. 3MD3 8MH1 3MD3 9. |
      9. 3MD3 8MH1 3MD3 9. | 10. 12MD3 10. | 11. 4MD3 2. 4MD3 11. | 11. 3MD3 4. 3MD3 11. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'genshin-raiden',
    title: '雷电将军鸣神雷痕',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。深紫长编发、雷之三重巴金簪与冷峻眼眸。',
    matrix: decodeGrid(`
      32. | 11. 10MD21 11. | 9. 14MD21 9. | 8. 16MD21 8. | 7. 4MA6 10MD21 4MA6 7. |
      7. 4MA6 10MD21 4MA6 7. | 7. 18MD21 7. | 8. 16MD21 8. | 8. 3MD21 10MG9 3MD21 8. | 8. 2MD21 2MG9 2MD14 4MG9 2MD14 2MG9 2MD21 8. |
      8. 2MD21 2MG9 2MD14 4MG9 2MD14 2MG9 2MD21 8. | 9. 2MD21 10MG9 2MD21 9. | 9. 14MG9 9. | 10. 12MG9 10. | 11. 10MG9 11. |
      12. 8MD14 12. | 10. 12MD14 10. | 9. 14MD14 9. | 8. 16MD14 8. | 8. 16MD21 8. |
      8. 16MD21 8. | 9. 14MD21 9. | 10. 12MD21 10. | 11. 10MD21 11. | 12. 8MD21 12. |
      13. 6MD21 13. | 14. 4MD21 14. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'zelda-master-sword',
    title: '塞尔达退魔大师之剑',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。直插于林中祭坛石座中的海拉鲁驱魔圣剑。',
    matrix: decodeGrid(`
      15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. |
      15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. | 15. 2MC3 15. |
      15. 2MC3 15. | 15. 2MC3 15. | 14. 4MA6 14. | 8. 16MA6 8. | 6. 20MA6 6. |
      10. 12MA6 10. | 14. 4MD25 14. | 14. 4MD25 14. | 14. 4MD25 14. | 13. 6MA6 13. |
      11. 10MC18 11. | 9. 14MC18 9. | 7. 18MC18 7. | 5. 22MM15 5. | 4. 24MM15 4. |
      3. 26MH6 3. | 2. 28MH6 2. | 32MB2 | 32MB5 | 32MB8 | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'zelda-triforce',
    title: '塞尔达三角神力',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。代表力量、智慧与勇气的金色三位一体圣三角。',
    matrix: decodeGrid(`
      32. | 15. 2MA6 15. | 14. 4MA6 14. | 13. 6MA6 13. | 12. 8MA8 12. |
      11. 10MA8 11. | 10. 12MA8 10. | 9. 14MA8 9. | 8. 16MA6 8. | 7. 18MA6 7. |
      6. 20MA6 6. | 5. 8MA6 6. 8MA6 5. | 4. 9MA8 6. 9MA8 4. | 3. 10MA8 6. 10MA8 3. | 2. 11MA8 6. 11MA8 2. |
      1. 12MA8 6. 12MA8 1. | 32MA6 | 32MA6 | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'mc-diamond-sword-hd',
    title: '我的世界附魔钻石剑',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。经典沙盒斜插角度，高对比附魔青蓝剑身。',
    matrix: decodeGrid(`
      28. 2MH7 2. | 26. 4MC11 2. | 24. 4MC11 2MC3 2. | 22. 4MC11 2MC3 4. | 20. 4MC11 2MC3 6. |
      18. 4MC11 2MC3 8. | 16. 4MC11 2MC3 10. | 14. 4MC11 2MC3 12. | 12. 4MC11 2MC3 14. | 10. 4MC11 2MC3 16. |
      8. 4MC11 2MC3 18. | 6. 4MC11 2MC3 20. | 4. 4MC11 2MC3 22. | 2. 4MC11 2MC3 24. | 4. 4MC11 24. |
      2. 2MH7 2MC11 2MH7 24. | 4. 4MC11 2MC3 22. | 6. 4MH7 2MC11 20. | 8. 4MG10 20. | 10. 4MG10 18. |
      12. 4MG10 16. | 14. 4MG10 14. | 16. 4MG10 12. | 18. 4MG10 10. | 20. 4MH7 8. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'mc-creeper-hd',
    title: '我的世界苦力怕面相',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。像素沙盒招牌标志，深浅绿相间的方块爬行者。',
    matrix: decodeGrid(`
      4. 24MB2 4. | 4. 24MB2 4. | 4. 24MB5 4. | 4. 24MB5 4. | 4. 24MB2 4. |
      4. 24MB2 4. | 4. 4MB5 6MH7 4MB2 6MH7 4MB5 4. | 4. 4MB5 6MH7 4MB2 6MH7 4MB5 4. | 4. 4MB2 6MH7 4MB5 6MH7 4MB2 4. | 4. 4MB2 6MH7 4MB5 6MH7 4MB2 4. |
      4. 24MB2 4. | 4. 24MB5 4. | 4. 8MB2 8MH7 8MB2 4. | 4. 8MB2 8MH7 8MB2 4. | 4. 6MB5 12MH7 6MB5 4. |
      4. 6MB5 12MH7 6MB5 4. | 4. 6MB2 12MH7 6MB2 4. | 4. 6MB2 4MH7 4MB5 4MH7 6MB2 4. | 4. 6MB5 4MH7 4MB2 4MH7 6MB5 4. | 4. 6MB5 4MH7 4MB2 4MH7 6MB5 4. |
      4. 24MB2 4. | 4. 24MB2 4. | 4. 24MB5 4. | 4. 24MB5 4. | 4. 24MB2 4. |
      4. 24MB2 4. | 4. 24MB5 4. | 4. 24MB5 4. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'super-mario-run',
    title: '超级马里奥跳跃',
    category: 'games',
    tag: '任天堂',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。红蓝工装、白手套与黄色扣子的经典大跳姿态。',
    matrix: decodeGrid(`
      32. | 11. 10MF4 11. | 10. 18MF4 4. | 10. 6MG8 4MG9 2MG8 2MG9 8. | 9. 2MG8 2MG9 2MG8 6MG9 2MG8 2MG9 9. |
      9. 2MG8 2MG9 4MG8 6MG9 2MG8 2MG9 9. | 9. 4MG8 8MG9 4MG8 7. | 11. 14MG9 7. | 9. 4MF4 2MD25 6MF4 11. | 8. 6MF4 2MD25 4MF4 2MD25 6MF4 4. |
      7. 8MF4 8MD25 8MF4 1. | 7. 4MG9 2MF4 2MD25 2MA8 4MD25 2MA8 2MD25 2MF4 4MG9 1. | 7. 6MG9 12MD25 6MG9 1. | 8. 4MG9 14MD25 4MG9 2. | 9. 18MD25 5. |
      10. 14MD25 8. | 10. 6MG8 6. 6MG8 4. | 9. 8MG8 4. 8MG8 3. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'kirby-flying',
    title: '星之卡比充气漂浮',
    category: 'games',
    tag: '任天堂',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。鼓起大腮帮粉红圆滚身形与红色小短靴。',
    matrix: decodeGrid(`
      32. | 32. | 10. 12MF14 10. | 8. 16MF14 8. | 7. 18MF14 7. |
      6. 20MF14 6. | 5. 22MF14 5. | 4. 24MF14 4. | 4. 24MF14 4. | 3. 26MF14 3. |
      3. 6MF14 2MH7 10MF14 2MH7 6MF14 3. | 3. 6MF14 2MD25 10MF14 2MD25 6MF14 3. | 3. 6MF14 2MH1 10MF14 2MH1 6MF14 3. | 3. 4MF14 4ME4 12MF14 4ME4 4MF14 3. | 3. 4MF14 4ME4 5MF14 2MF4 5MF14 4ME4 4MF14 3. |
      4. 24MF14 4. | 4. 24MF14 4. | 5. 22MF14 5. | 6. 20MF14 6. | 7. 18MF14 7. |
      8. 16MF14 8. | 6. 6MF4 8. 6MF4 6. | 5. 8MF4 6. 8MF4 5. | 5. 8MF4 6. 8MF4 5. | 6. 6MF4 8. 6MF4 6. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'stardew-blue-chicken-hd',
    title: '星露谷物语奇迹蓝鸡',
    category: 'games',
    tag: '星露谷',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。像素农场珍稀宝蓝羽毛母鸡与鲜红鸡冠。',
    matrix: decodeGrid(`
      32. | 32. | 14. 6MH7 12. | 12. 10MD25 10. | 11. 12MD25 9. |
      10. 4MF4 10MD25 8. | 10. 4MF4 2MH7 2MH1 8MD25 6. | 11. 3MF4 4MA8 8MD25 6. | 10. 14MD25 8. | 9. 16MD25 7. |
      8. 18MD25 6. | 7. 20MD25 5. | 6. 22MD25 4. | 6. 22MD25 4. | 6. 22MD25 4. |
      7. 20MD25 5. | 8. 18MD25 6. | 9. 16MD25 7. | 10. 14MD25 8. | 11. 12MD25 9. |
      12. 10MD25 10. | 13. 2MA8 4. 2MA8 11. | 13. 2MA8 4. 2MA8 11. | 12. 4MA8 2. 4MA8 10. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },

  // -------------------------------------------------------------
  // 四、治愈萌宠与动物 (Pets - 10款)
  // -------------------------------------------------------------
  {
    id: 'capybara-spa-hd',
    title: '卡皮巴拉温泉汤',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。松弛感水豚头顶小金橘，闭眼享受温热汤池。',
    matrix: decodeGrid(`
      32. | 15. 2MH10 15. | 14. 4MH10 14. | 15. 2MB2 15. | 14. 4MA14 14. |
      13. 6MA14 13. | 14. 4MA14 14. | 10. 12MG10 10. | 8. 16MG10 8. | 7. 18MG10 7. |
      7. 18MG10 7. | 6. 20MG10 6. | 6. 3MG10 2MH7 10MG10 2MH7 3MG10 6. | 6. 20MG10 6. | 7. 6MG10 4MH7 8MG10 7. |
      8. 16MG10 8. | 9. 14MG10 9. | 7. 18MG14 7. | 5. 22MG14 5. | 4. 24MG14 4. |
      4. 24MC11 4. | 3. 26MC11 3. | 3. 26MG8 3. | 3. 26MG8 3. | 4. 24MG8 4. |
      5. 22MG8 5. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'corgi-peach-butt',
    title: '柯基蜜桃臀摇尾',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。圆润对称的大爱心柯基屁屁，粉嫩肉垫与灵动小尾。',
    matrix: decodeGrid(`
      32. | 14. 4MA10 14. | 13. 6MA10 13. | 8. 6MA10 4. 6MA10 8. | 6. 9MA10 2. 9MA10 6. |
      5. 22MA10 5. | 4. 24MA10 4. | 3. 26MA10 3. | 3. 26MA10 3. | 2. 28MA10 2. |
      2. 28MA10 2. | 2. 28MA10 2. | 3. 10MA10 6MH1 10MA10 3. | 3. 8MA10 10MH1 8MA10 3. | 4. 6MA10 12MH1 6MA10 4. |
      5. 5MA10 12MH1 5MA10 5. | 6. 4MA10 12MH1 4MA10 6. | 7. 3MA10 12MH1 3MA10 7. | 8. 3MF22 10MH1 3MF22 8. | 8. 4MF22 8MH1 4MF22 8. |
      9. 14MH1 9. | 10. 12MH1 10. | 11. 10MH1 11. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'shiba-smile-hd',
    title: '柴犬大笑脸',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。赤柴标志白眉毛、直立尖耳与吐舌头开怀大笑。',
    matrix: decodeGrid(`
      32. | 4. 5MA10 14. 5MA10 4. | 3. 7MA10 12. 7MA10 3. | 3. 8MA10 10. 8MA10 3. | 4. 8MA10 8. 8MA10 4. |
      5. 22MA10 5. | 5. 22MA10 5. | 4. 24MA10 4. | 4. 24MA10 4. | 4. 3MA10 3MH1 10MA10 3MH1 3MA10 4. |
      4. 4MA10 2MH7 8MA10 2MH7 4MA10 4. | 4. 4MA10 2MH7 8MA10 2MH7 4MA10 4. | 4. 24MA10 4. | 4. 2MA10 6MH1 8MA10 6MH1 2MA10 4. | 4. 1MA10 8MH1 6MA10 8MH1 1MA10 4. |
      5. 10MH1 2MH7 10MH1 5. | 6. 9MH1 2MF14 9MH1 6. | 7. 8MH1 2MF14 8MH1 7. | 8. 16MH1 8. | 9. 14MH1 9. |
      10. 12MH1 10. | 10. 12MF4 10. | 11. 10MF4 11. | 11. 4MA8 2. 4MA8 11. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'british-shorthair-blue',
    title: '英短蓝猫圆脸',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。饱满发腮的包子脸英短蓝猫，金黄色铜钱大眼。',
    matrix: decodeGrid(`
      32. | 5. 5MM15 12. 5MM15 5. | 4. 7MM15 10. 7MM15 4. | 4. 8MM15 8. 8MM15 4. | 5. 22MM15 5. |
      5. 22MM15 5. | 4. 24MM15 4. | 3. 26MM15 3. | 3. 26MM15 3. | 2. 28MM15 2. |
      2. 4MM15 4MA8 12MM15 4MA8 4MM15 2. | 2. 4MM15 4MA8 12MM15 4MA8 4MM15 2. | 2. 5MM15 2MH7 14MM15 2MH7 5MM15 2. | 2. 28MM15 2. | 3. 26MM15 3. |
      4. 11MM15 2MF14 11MM15 4. | 4. 10MM15 4MH7 10MM15 4. | 5. 22MM15 5. | 6. 20MM15 6. | 7. 18MM15 7. |
      8. 16MM15 8. | 9. 14MM15 9. | 10. 12MM15 10. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'calico-cat-hd',
    title: '招财三花猫大头',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。黑橙白三色拼接的纯朴家猫，带来福运连连。',
    matrix: decodeGrid(`
      32. | 5. 5MH7 12. 5MA10 5. | 4. 7MH7 10. 7MA10 4. | 4. 8MH7 8. 8MA10 4. | 5. 8MH7 6MH1 8MA10 5. |
      5. 7MH7 8MH1 7MA10 5. | 4. 6MH7 12MH1 6MA10 4. | 3. 6MH7 14MH1 6MA10 3. | 3. 26MH1 3. | 2. 28MH1 2. |
      2. 4MH1 4MB2 12MH1 4MB2 4MH1 2. | 2. 4MH1 4MB2 12MH1 4MB2 4MH1 2. | 2. 5MH1 2MH7 14MH1 2MH7 5MH1 2. | 2. 28MH1 2. | 3. 26MH1 3. |
      4. 11MH1 2MF14 11MH1 4. | 4. 10MH1 4MH7 10MH1 4. | 5. 22MH1 5. | 6. 20MH1 6. | 7. 18MH1 7. |
      8. 16MH1 8. | 9. 14MH1 9. | 10. 12MH1 10. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'red-panda-cute',
    title: '小熊猫干脆面君',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。毛茸茸红棕面颊、雪白耳廓边与黑色眼斑。',
    matrix: decodeGrid(`
      32. | 3. 5MH1 16. 5MH1 3. | 2. 7MH1 14. 7MH1 2. | 2. 8MA14 12. 8MA14 2. | 3. 26MA14 3. |
      4. 24MA14 4. | 4. 24MA14 4. | 3. 26MA14 3. | 3. 4MA14 4MH1 10MA14 4MH1 4MA14 3. | 3. 3MA14 6MH7 8MA14 6MH7 3MA14 3. |
      3. 3MA14 6MH7 8MA14 6MH7 3MA14 3. | 3. 4MA14 4MH7 10MA14 4MH7 4MA14 3. | 4. 24MA14 4. | 4. 2MA14 6MH1 8MA14 6MH1 2MA14 4. | 5. 8MH1 6MA14 8MH1 5. |
      6. 9MH1 2MH7 9MH1 6. | 7. 18MH1 7. | 8. 16MH1 8. | 9. 14MH6 9. | 10. 12MH6 10. |
      11. 10MH6 11. | 11. 10MH6 11. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'giant-panda-bamboo',
    title: '大熊猫啃嫩竹',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。憨态可掬的黑白国宝大熊猫，怀抱翠绿鲜嫩竹叶。',
    matrix: decodeGrid(`
      32. | 5. 5MH7 12. 5MH7 5. | 4. 7MH7 10. 7MH7 4. | 4. 8MH7 8. 8MH7 4. | 5. 22MH1 5. |
      5. 22MH1 5. | 4. 24MH1 4. | 3. 26MH1 3. | 3. 4MH1 5MH7 8MH1 5MH7 4MH1 3. | 3. 3MH1 7MH7 6MH1 7MH7 3MH1 3. |
      3. 3MH1 7MH7 6MH1 7MH7 3MH1 3. | 4. 4MH1 5MH7 8MH1 5MH7 4MH1 4. | 4. 24MH1 4. | 5. 10MH1 2MH7 10MH1 5. | 6. 9MH1 2MH7 9MH1 6. |
      7. 18MH1 7. | 8. 16MH1 8. | 7. 18MH7 7. | 6. 20MH7 6. | 5. 22MH7 5. |
      5. 4MH7 14MH1 4MH7 5. | 6. 3MH7 4MB5 6MH1 4MB5 3MH7 6. | 7. 2MH7 6MB5 4MH1 6MB5 2MH7 7. | 8. 16MB5 8. | 9. 14MH7 9. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'knife-duck-warrior',
    title: '手握菜刀战神鸭',
    category: 'pets',
    tag: '网红搞笑',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。网络爆款反差萌：纯真小黄鸭手持反光精钢菜刀。',
    matrix: decodeGrid(`
      32. | 32. | 10. 10MA8 12. | 8. 14MA8 10. | 7. 16MA8 9. |
      6. 18MA8 8. | 6. 3MA8 2MH7 13MA8 8. | 6. 3MA8 2MH7 13MA8 8. | 4. 6MA14 10MA8 12. | 4. 7MA14 9MA8 12. |
      6. 16MA8 4. 2MH7 4. | 7. 16MA8 2. 4MM15 3. | 6. 18MA8 1. 4MM15 3. | 5. 20MA8 2. 4MM15 1. | 5. 20MA8 3. 4MM15 . |
      6. 20MA8 6. | 7. 18MA8 7. | 8. 16MA8 8. | 9. 14MA8 9. | 10. 12MA8 10. |
      11. 3MA14 4. 3MA14 11. | 10. 5MA14 2. 5MA14 10. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'baby-penguin-hd',
    title: '极地小企鹅宝宝',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。圆润呆萌的小企鹅，黑色背羽与雪白肚皮。',
    matrix: decodeGrid(`
      32. | 32. | 11. 10MH7 11. | 9. 14MH7 9. | 8. 16MH7 8. |
      7. 18MH7 7. | 7. 3MH7 3MH1 6MH7 3MH1 3MH7 7. | 6. 3MH7 4MH1 4MH7 4MH1 3MH7 6. | 6. 3MH7 2MH1 2MH7 4MH7 2MH7 2MH1 3MH7 6. | 6. 8MH1 2MA14 8MH1 6. |
      7. 6MH1 4MA14 6MH1 7. | 7. 18MH1 7. | 8. 16MH1 8. | 6. 2MH7 16MH1 2MH7 6. | 5. 3MH7 16MH1 3MH7 5. |
      5. 3MH7 16MH1 3MH7 5. | 5. 3MH7 16MH1 3MH7 5. | 6. 2MH7 16MH1 2MH7 6. | 7. 18MH1 7. | 8. 16MH1 8. |
      9. 14MH1 9. | 10. 4MA14 4. 4MA14 10. | 9. 6MA14 2. 6MA14 9. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'floating-sea-otter',
    title: '仰泳抱贝小水獭',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。水面仰泳的水獭宝宝，双手紧紧怀抱着小贝壳。',
    matrix: decodeGrid(`
      32. | 32. | 11. 10MG14 11. | 9. 14MG14 9. | 8. 16MG14 8. |
      7. 18MG14 7. | 7. 3MG14 2MH7 8MG16 2MH7 3MG14 7. | 7. 3MG14 2MH7 8MG16 2MH7 3MG14 7. | 7. 7MG16 2MH7 7MG16 7. | 8. 16MG16 8. |
      9. 14MG16 9. | 7. 18MG14 7. | 6. 20MG14 6. | 5. 6MG14 6MA8 6MG14 5. | 5. 5MG14 8MA8 5MG14 5. |
      5. 6MG14 6MA8 6MG14 5. | 6. 20MG14 6. | 7. 18MG14 7. | 8. 16MG14 8. | 9. 14MG14 9. |
      2. 28MC11 2. | 1. 30MD25 1. | 32MD3 | 32MD25 | 32MC11 |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },

  // -------------------------------------------------------------
  // 五、美食甜品与快乐水 (Food - 8款)
  // -------------------------------------------------------------
  {
    id: 'double-cheeseburger-hd',
    title: '双层芝士巨无霸牛肉堡',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。芝麻面包顶、多汁煎牛肉饼、融化车达芝士与新鲜生菜。',
    matrix: decodeGrid(`
      32. | 32. | 10. 12MA10 10. | 7. 18MA10 7. | 5. 22MA10 5. |
      4. 5MA10 2MH1 4MA10 2MH1 4MA10 2MH1 3MA10 4. | 3. 26MA10 3. | 3. 26MA10 3. | 2. 28MB5 2. | 1. 30MB5 1. |
      1. 30MF4 1. | 2. 28MF4 2. | 1. 30MA8 1. | 2. 28MA8 2. | 1. 30MG8 1. |
      1. 30MG8 1. | 2. 28MA8 2. | 1. 30MG8 1. | 2. 28MG8 2. | 3. 26MA10 3. |
      4. 24MA10 4. | 6. 20MA10 6. | 8. 16MA10 8. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'crispy-fries-hd',
    title: '麦香现炸金黄薯条',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。根根酥脆的粗切金黄薯条与经典大红包装纸盒。',
    matrix: decodeGrid(`
      32. | 8. 2MA8 4. 2MA8 4. 2MA8 10. | 8. 2MA8 4. 2MA8 4. 2MA8 10. | 7. 3MA8 3. 3MA8 3. 3MA8 10. | 7. 18MA8 7. |
      6. 20MA8 6. | 6. 20MA8 6. | 5. 22MA8 5. | 4. 24MF4 4. | 4. 24MF4 4. |
      4. 24MF4 4. | 4. 8MF4 8MA8 8MF4 4. | 5. 7MF4 8MA8 7MF4 5. | 5. 6MF4 10MA8 6MF4 5. | 5. 6MF4 10MA8 6MF4 5. |
      5. 6MF4 10MA8 6MF4 5. | 6. 20MF4 6. | 6. 20MF4 6. | 6. 20MF4 6. | 7. 18MF4 7. |
      7. 18MF4 7. | 8. 16MF4 8. | 8. 16MF4 8. | 9. 14MF4 9. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'pepperoni-pizza-slice',
    title: '意式拉丝萨拉米披萨',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。金黄烤焦饼边、热气腾腾拉丝芝士与香烤萨拉米香肠。',
    matrix: decodeGrid(`
      32. | 2. 28MG14 2. | 3. 26MG14 3. | 4. 24MA6 4. | 5. 22MA8 5. |
      6. 20MA8 6. | 7. 4MA8 4MF4 10MA8 7. | 8. 3MA8 4MF4 9MA8 8. | 9. 14MA8 9. | 10. 4MA8 4MF4 4MA8 10. |
      11. 3MA8 4MF4 3MA8 11. | 12. 8MA8 12. | 13. 6MA8 13. | 14. 4MA8 14. | 15. 2MA8 15. |
      32. | 32. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'boba-milk-tea-hd',
    title: '黑糖波霸珍珠奶茶',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。条纹吸管斜插，透明杯身透出颗颗浓郁Q弹黑糖珍珠。',
    matrix: decodeGrid(`
      32. | 18. 3MF4 11. | 17. 3MH1 12. | 16. 3MF4 13. | 15. 3MH1 14. |
      14. 3MF4 15. | 8. 16MM15 8. | 7. 18MH1 7. | 7. 18MG16 7. | 8. 16MG16 8. |
      8. 16MG16 8. | 8. 16MG16 8. | 9. 14MG16 9. | 9. 14MG16 9. | 9. 14MG16 9. |
      9. 2MG16 2MH7 3MG16 2MH7 2MG16 2MH7 1MG16 9. | 10. 12MG16 10. | 10. 2MH7 3MG16 2MH7 3MG16 2MH7 10. | 10. 12MG16 10. | 10. 3MG16 2MH7 2MG16 2MH7 3MG16 10. |
      11. 10MG16 11. | 11. 2MH7 2MG16 2MH7 2MG16 2MH7 11. | 12. 8MG16 12. | 13. 6MM15 13. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'strawberry-shortcake',
    title: '鲜红草莓奶油蛋糕',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。一颗鲜艳欲滴的大草莓，点缀在多层白奶油夹心蛋糕上。',
    matrix: decodeGrid(`
      32. | 15. 2MB5 15. | 14. 4MB5 14. | 14. 4MF4 14. | 13. 6MF4 13. |
      13. 6MF4 13. | 14. 4MF4 14. | 8. 16MH1 8. | 6. 20MH1 6. | 5. 22MH1 5. |
      4. 24MH1 4. | 4. 24MF22 4. | 4. 24MF14 4. | 4. 24MH1 4. | 4. 24MF4 4. |
      4. 24MH1 4. | 4. 24MF22 4. | 4. 24MG14 4. | 4. 24MG14 4. | 3. 26MH10 3. |
      2. 28MH10 2. | 32. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'sprinkle-donut-pink',
    title: '粉色糖霜彩针甜甜圈',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。诱人粉红草莓糖霜，撒满五彩糖针，中间中空圆环。',
    matrix: decodeGrid(`
      32. | 10. 12ME4 10. | 8. 16ME4 8. | 6. 20ME4 6. | 5. 2MA8 18ME4 2MC3 5. |
      4. 24ME4 4. | 3. 26ME4 3. | 3. 26ME4 3. | 2. 28ME4 2. | 2. 8ME4 12MH7 8ME4 2. |
      2. 7ME4 14MH7 7ME4 2. | 2. 7ME4 14MH7 7ME4 2. | 3. 7ME4 12MH7 7ME4 3. | 3. 26ME4 3. | 4. 24ME4 4. |
      5. 22MG14 5. | 6. 20MG14 6. | 8. 16MG14 8. | 10. 12MG14 10. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'ramen-egg-bowl',
    title: '日式豚骨叉烧拉面',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★★',
    desc: '32×32 标准画幅。浓郁汤底、溏心蛋、鸣门卷与大红瓷碗。',
    matrix: decodeGrid(`
      32. | 20. 8MG14 4. | 18. 10MG14 4. | 10. 12MH7 10. | 8. 16MA8 8. |
      6. 20MA8 6. | 5. 6MA8 4MH1 4MA8 4MF4 2MA8 7. | 4. 6MA8 4MA8 4MH1 4MF4 2MA8 8. | 3. 26MA8 3. | 2. 28MF4 2. |
      2. 28MF4 2. | 2. 4MF4 4MH1 12MF4 4MH1 4MF4 2. | 3. 26MF4 3. | 4. 24MF4 4. | 5. 22MF4 5. |
      6. 20MF4 6. | 7. 18MF4 7. | 9. 14MF4 9. | 11. 10MM15 11. | 11. 10MM15 11. |
      32. | 32. | 32. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'salmon-nigiri-sushi',
    title: '三文鱼手握寿司',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。肥美鲜橙色三文鱼刺身，包裹在温热白米饭上。',
    matrix: decodeGrid(`
      32. | 32. | 32. | 32. | 6. 20MA14 6. |
      4. 24MA14 4. | 3. 26MA14 3. | 2. 28MA14 2. | 2. 5MA14 2MH1 12MA14 2MH1 7MA14 2. | 2. 4MA14 2MH1 14MA14 2MH1 6MA14 2. |
      3. 26MA14 3. | 4. 24MA14 4. | 5. 22MH1 5. | 5. 22MH1 5. | 6. 20MH1 6. |
      6. 20MH1 6. | 7. 18MH1 7. | 8. 16MH1 8. | 32. | 32. |
      32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32. | 32.
    `, 32, 32, C_MAP)
  },

  /* ===== 追加精选图纸（第二批） ===== */
  {
    id: 'shiba-inu-portrait',
    title: '柴犬治愈头像',
    category: 'pets',
    tag: '🐾 治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。奶橘色柴犬头，白色口鼻与黑色圆眼，圆润治愈。',
    matrix: decodeGrid(`
      32. |
      7. 3MA10 13. 3MA10 6. |
      7. 3MA10 13. 3MA10 6. |
      7. 4MA10 11. 4MA10 6. |
      7. 4MA10 11. 4MA10 6. |
      6. 5MA10 11. 5MA10 5. |
      7. 5MA10 9. 5MA10 6. |
      6. 3MA10 3MF22 9. MA10 3MF22 2MA10 5. |
      6. 3MA10 3MF22 9. MA10 3MF22 2MA10 5. |
      6. 3MA10 3MF22 9. MA10 3MF22 2MA10 5. |
      6. 3MA10 3MF22 7MA10 1. 2MA10 3MF22 2MA10 5. |
      6. 2MA10 2MF22 3MA10 6MG9 3MA10 4MF22 MA10 5. |
      6. 2MA10 MF22 3MA10 8MG9 3MA10 3MF22 MA10 5. |
      6. MA10 MF22 3MA10 10MG9 3MA10 3MF22 5. |
      5. 6MA10 10MG9 4MA10 2MF22 MA10 4. |
      6. 5MA10 MH7 8MG9 MH7 7MA10 4. |
      6. 4MA10 MH1 2MH7 6MG9 MH1 2MH7 4MA10 6. |
      6. 3MA10 5MH7 4MG9 5MH7 3MA10 6. |
      6. 4MA10 3MH7 6MH1 3MH7 4MA10 6. |
      5. 6MA10 MH7 2MH1 4MH7 2MH1 MH7 6MA10 5. |
      6. 4MA10 4MH1 4MH7 4MH1 4MA10 6. |
      6. 4MA10 4MH1 4MH7 4MH1 4MA10 6. |
      6. 3MA10 4MH1 MH7 3MH1 MH7 5MH1 3MA10 6. |
      6. 3MA10 5MH1 2MH7 7MH1 3MA10 6. |
      7. 2MA10 6MH1 MH7 7MH1 2MA10 7. |
      8. MA10 14MH1 MA10 8. |
      9. MA10 12MH1 MA10 9. |
      10. 12MH1 10. |
      11. 10MH1 11. |
      13. 6MH1 13. |
      32. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'mister-penguin',
    title: '企鹅先生',
    category: 'pets',
    tag: '🐾 治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。黑白配色的小企鹅，橘色喙与脚蹼，站姿圆润。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      32. |
      32. |
      32. |
      32. |
      13. 6MH7 13. |
      12. 8MH7 12. |
      11. 10MH7 11. |
      10. 12MH7 10. |
      10. 2MH7 2MH1 4MH7 2MH1 2MH7 10. |
      9. 2MH7 4MH1 2MH7 4MH1 2MH7 9. |
      9. MH7 2MH1 2MH7 4MH1 2MH7 2MH1 MH7 9. |
      6. 4MH7 2MH1 2MH7 4MH1 2MH7 2MH1 4MH7 6. |
      6. 5MH7 10MH1 5MH7 6. |
      5. 6MH7 4MH1 2MA6 4MH1 6MH7 5. |
      5. 5MH7 4MH1 4MA6 4MH1 5MH7 5. |
      5. 5MH7 5MH1 2MA6 5MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      5. 5MH7 12MH1 5MH7 5. |
      6. 4MH7 12MH1 4MH7 6. |
      6. 5MH7 10MH1 5MH7 6. |
      9. 2MH7 10MH1 2MH7 9. |
      9. 6MA6 2MH1 6MA6 9. |
      9. 6MA6 2MH1 6MA6 9. |
      9. 6MA6 2MH7 6MA6 9. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'cat-paw-print',
    title: '猫爪印记',
    category: 'pets',
    tag: '🐾 治愈萌宠',
    difficulty: '★★☆☆☆',
    desc: '32×32 标准画幅。粉嫩猫爪印，四个趾垫与掌垫层次分明，适合做杯垫。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      32. |
      32. |
      32. |
      11. 2ME4 6. 2ME4 11. |
      10. ME4 2MF14 ME4 4. ME4 2MF14 ME4 10. |
      9. ME4 MF14 2MF22 MF14 ME4 2. ME4 MF14 2MF22 MF14 ME4 9. |
      9. ME4 MF14 2MF22 MF14 ME4 2. ME4 MF14 2MF22 MF14 ME4 9. |
      4. 2ME4 3. ME4 4MF14 ME4 2. ME4 4MF14 ME4 3. 2ME4 4. |
      3. ME4 2MF14 ME4 2. ME4 4MF14 ME4 2. ME4 4MF14 ME4 2. ME4 2MF14 ME4 3. |
      2. ME4 MF14 2MF22 MF14 ME4 2. ME4 2MF14 ME4 4. ME4 2MF14 ME4 2. ME4 MF14 2MF22 MF14 ME4 2. |
      2. ME4 MF14 2MF22 MF14 ME4 3. 2ME4 6. 2ME4 3. ME4 MF14 2MF22 MF14 ME4 2. |
      2. ME4 4MF14 ME4 16. ME4 4MF14 ME4 2. |
      2. ME4 4MF14 ME4 5. 6ME4 5. ME4 4MF14 ME4 2. |
      3. ME4 2MF14 ME4 4. 10ME4 4. ME4 2MF14 ME4 3. |
      4. 2ME4 4. 2ME4 8MF14 2ME4 4. 2ME4 4. |
      9. 2ME4 3MF14 4MA19 3MF14 2ME4 9. |
      9. 2ME4 2MF14 6MA19 2MF14 2ME4 9. |
      8. 2ME4 3MF14 6MA19 3MF14 2ME4 8. |
      8. 2ME4 3MF14 6MA19 3MF14 2ME4 8. |
      8. 2ME4 3MF14 6MA19 3MF14 2ME4 8. |
      9. 2ME4 3MF14 4MA19 3MF14 2ME4 9. |
      9. 2ME4 10MF14 2ME4 9. |
      10. 2ME4 8MF14 2ME4 10. |
      11. 10ME4 11. |
      13. 6ME4 13. |
      32. |
      32. |
      32. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'matcha-ice-cream',
    title: '抹茶冰淇淋',
    category: 'food',
    tag: '🍔 美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。双球抹茶冰淇淋配脆皮甜筒，顶上点缀红樱桃。',
    matrix: decodeGrid(`
      16. MB2 15. |
      15. MF4 MB2 15. |
      14. MF4 MF1 2MF4 14. |
      12. 2MB5 4MF4 4MB28 10. |
      11. 3MB5 4MF4 5MB28 9. |
      10. 5MB5 2MF4 MB5 4MB28 10. |
      10. 12MB5 10. |
      10. 12MB5 10. |
      10. 13MB5 9. |
      8. 2MB2 3MB28 11MB5 8. |
      7. 2MB2 5MB28 11MB5 7. |
      7. 2MB2 5MB28 12MB5 6. |
      6. 4MB2 3MB28 13MB5 6. |
      6. 6MB2 15MB5 5. |
      6. 7MB2 14MB5 5. |
      6. 7MB2 14MB5 5. |
      6. 8MB2 12MB5 6. |
      7. 7MB2 12MB5 6. |
      7. 8MB2 10MB5 7. |
      8. 8MB2 8MB5 8. |
      9. MG16 5MB2 2MG16 6MB5 9. |
      9. 13MG16 10. |
      10. MG16 10MG10 11. |
      11. MG16 8MG10 MG16 11. |
      11. MG16 7MG10 MG16 12. |
      12. MG16 6MG10 13. |
      13. MG16 4MG10 MG16 13. |
      13. MG16 3MG10 MG16 14. |
      14. MG16 2MG10 15. |
      15. 2MG16 15. |
      15. 2MG16 15. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'watermelon-popsicle',
    title: '西瓜冰棒',
    category: 'food',
    tag: '🍔 美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。绿皮红瓤的西瓜冰棒，点缀黑色瓜籽与木棒。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      7. 18MB2 7. |
      7. 18MB2 7. |
      7. MB2 16MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 MB28 3MA19 MH7 6MA19 MH7 3MA19 MB28 MB2 7. |
      7. MB2 MB28 3MA19 2MF14 9MA19 MB28 MB2 7. |
      7. MB2 MB28 2MA19 4MF14 8MA19 MB28 MB2 7. |
      7. MB2 MB28 2MA19 4MF14 MH7 7MA19 MB28 MB2 7. |
      7. MB2 MB28 2MA19 4MF14 MA19 MH7 6MA19 MB28 MB2 7. |
      7. MB2 MB28 3MA19 2MF14 9MA19 MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 MB28 2MA19 MH7 8MA19 MH7 2MA19 MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 MB28 14MA19 MB28 MB2 7. |
      7. MB2 2MB28 13MA19 MB28 MB2 7. |
      7. 2MB2 15MA19 MB2 7. |
      7. MB2 2MB28 13MA19 2MB28 MB2 6. |
      8. MB2 2MB28 11MA19 2MB28 MB2 7. |
      8. 2MB2 3MB28 7MA19 3MB28 2MB2 7. |
      9. 2MB2 11MB28 2MB2 8. |
      11. 3MB2 4MG10 4MB2 10. |
      14. 4MG16 14. |
      14. 4MG16 14. |
      14. 4MG16 14. |
      14. 4MG16 14. |
      14. 4MG16 14. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'hot-cocoa-marshmallow',
    title: '热可可棉花糖',
    category: 'food',
    tag: '🍔 美食甜品',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。蓝白马克杯热可可，浮着三颗棉花糖，冒着热气。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      32. |
      32. |
      12. MH10 19. |
      11. MH10 7. MH10 12. |
      12. MH10 7. MH10 11. |
      11. MH10 7. MH10 12. |
      15. MH10 4. MH10 11. |
      8. 15MH10 9. |
      6. MD25 3MH10 3MH1 2MG8 3MH1 MG8 3MH1 2MH10 8. |
      6. 2MH10 2MG8 3MH1 2MG8 3MH1 MG8 3MH1 MG8 2MH10 7. |
      6. MD25 3MG8 3MH1 2MG8 3MH1 MG8 3MH1 2MG8 8. |
      6. 2MD25 15MG8 MD25 1. MD25 6. |
      6. 5MD25 9MG8 9MD25 3. |
      6. 19MD25 1. 4MD25 2. |
      6. 18MH10 4. 2MD25 2. |
      6. 18MH10 4. 2MD25 2. |
      6. 18MD25 5. 2MD25 1. |
      6. 18MD25 4. 2MD25 2. |
      6. 18MD25 4. 2MD25 2. |
      6. 19MD25 1. 4MD25 2. |
      6. 23MD25 3. |
      6. 18MD25 1. MD25 6. |
      6. 18MD25 8. |
      6. 18MD25 8. |
      6. 18MD25 8. |
      6. 19MD25 7. |
      7. 3MD25 11MM15 3MD25 8. |
      8. 15MM15 9. |
      10. 11MM15 11.
    `, 32, 32, C_MAP)
  },
  {
    id: 'festival-lantern',
    title: '新春红灯笼',
    category: 'festival',
    tag: '🏮 节日庆典',
    difficulty: '★★★☆☆',
    desc: '32×32 标准画幅。金黄盖顶的中国红灯笼，配吊绳与流苏，年味十足。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      14. 3MA6 15. |
      14. 3MA6 15. |
      14. 3MA6 15. |
      14. 3MA6 15. |
      11. 9MA8 12. |
      11. 9MA8 12. |
      10. MF1 9MA8 MF4 MF1 10. |
      9. MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 MF4 9. |
      8. 2MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 2MF4 8. |
      7. 3MF4 2MF1 MF4 MF1 4MF4 MF1 2MF4 MF1 3MF4 7. |
      6. 3MF4 5MF1 4MF4 MF1 2MF4 MF1 4MF4 6. |
      6. 3MF4 5MF1 4MA8 MF1 2MF4 MF1 4MF4 6. |
      6. 3MF4 4MF1 2MA8 2MF4 2MA8 2MF4 MF1 4MF4 6. |
      6. 3MF4 4MF1 MA8 4MF4 MA8 2MF4 MF1 4MF4 6. |
      5. 4MF4 3MF1 2MA8 4MF4 2MA8 MF4 MF1 5MF4 5. |
      6. 4MF4 2MF1 MF4 MA8 4MF4 MA8 2MF4 MF1 4MF4 6. |
      6. 4MF4 MF1 2MF4 2MA8 2MF4 2MA8 2MF4 MF1 4MF4 6. |
      6. 4MF4 MF1 2MF4 MF1 4MA8 MF1 2MF4 MF1 4MF4 6. |
      6. 4MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 4MF4 6. |
      7. 3MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 3MF4 7. |
      8. 2MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 2MF4 8. |
      9. MF4 MF1 2MF4 MF1 4MF4 MF1 2MF4 MF1 MF4 9. |
      10. MF4 9MA8 2MF4 10. |
      11. 9MA8 12. |
      11. 9MA8 12. |
      14. 3MA6 15. |
      14. 3MA6 15. |
      14. 3MA6 15. |
      15. MA6 16.
    `, 32, 32, C_MAP)
  },
  {
    id: 'snowman-christmas',
    title: '圣诞雪人',
    category: 'festival',
    tag: '🏮 节日庆典',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。戴红帽围红围巾的雪人，配树枝手臂与纽扣。',
    matrix: decodeGrid(`
      32. |
      12. 7MH7 13. |
      12. 7MH7 13. |
      12. 7MH7 13. |
      12. 7MH7 13. |
      12. 7MH7 13. |
      10. 2MH7 7MF4 2MH7 11. |
      10. 2MH7 7MF4 2MH7 11. |
      10. 11MH7 11. |
      12. 8MH1 12. |
      11. 10MH1 11. |
      11. 10MH1 11. |
      10. 3MH1 2MH7 2MH1 2MH7 3MH1 10. |
      10. 3MH1 2MH7 2MH1 2MH7 3MH1 10. |
      10. 6MH1 4MA6 2MH1 10. |
      11. 5MH1 4MA6 MH1 11. |
      11. 10MF4 11. |
      11. 10MF4 11. |
      13. 6MH1 1. 3MF4 9. |
      4. 2MG14 5. 9MH1 3MF4 4. MG14 4. |
      5. 3MG14 2. 10MH1 3MF4 2. 2MG14 5. |
      7. 3MG14 10MH1 3MF4 2MG14 7. |
      9. 2MG14 5MH1 MH7 3MH1 MF4 2MG14 9. |
      9. 14MH1 9. |
      9. 14MH1 9. |
      8. 16MH1 8. |
      9. 7MH1 MH7 6MH1 9. |
      9. 14MH1 9. |
      9. 14MH1 9. |
      10. 12MH10 10. |
      9. 14MH10 9. |
      10. 12MH10 10.
    `, 32, 32, C_MAP)
  },
  {
    id: 'cherry-blossom-branch',
    title: '春日樱花枝',
    category: 'festival',
    tag: '🏮 节日庆典',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。斜出的樱树枝头缀满粉白花朵，适合做书签。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      25. ME8 6. |
      23. ME8 1. ME8 1. ME8 4. |
      24. ME8 ME4 ME8 5. |
      22. 2ME8 3ME4 2ME8 3. |
      24. ME8 ME4 ME8 5. |
      17. MF22 5. ME8 1. ME8 1. ME8 MG8 3. |
      15. MF22 1. MF22 1. MF22 5. ME8 3MG8 3. |
      13. MG8 2. MF22 ME4 MF22 6. MG8 3MB2 3. |
      13. MG8 2MF22 3ME4 2MF22 2. ME8 MG8 5MB2 2. |
      14. 2MG8 MF22 ME4 MF22 2. ME8 MG8 ME8 MG8 ME8 3MB2 3. |
      15. MF22 MG8 MF22 1. MF22 1. MG8 ME8 MA19 ME8 7. |
      16. MG8 MF22 2. 2ME8 3MA19 2ME8 5. |
      17. MG8 1. 3MG8 ME8 MA19 ME8 7. |
      18. 3MG8 ME8 1. ME8 1. ME8 6. |
      17. 3MG8 3. ME8 8. |
      16. 3MG8 13. |
      9. MF22 4. 4MG8 1. 3MB5 10. |
      7. MF22 1. MF22 1. MF22 1. 4MG8 1. 5MB5 9. |
      8. MF22 ME4 MF22 1. 4MG8 3. 3MB5 10. |
      6. 2MF22 3ME4 2MF22 7MG8 12. |
      8. MF22 ME4 MF22 3MG8 6. 3MG8 9. |
      7. MF22 1. MF22 MG8 MF22 3. ME8 16. |
      8. MG8 MF22 MG8 2. ME8 1. ME8 1. ME8 14. |
      4. 5MB5 MG8 4. ME8 MA19 ME8 15. |
      3. 7MB5 2. 2ME8 3MA19 2ME8 13. |
      4. 5MB5 5. ME8 MA19 ME8 15. |
      3. 4MG8 4. 5MB2 1. ME8 14. |
      3. 3MG8 4. 7MB2 15. |
      11. 5MB2 16.
    `, 32, 32, C_MAP)
  },
  {
    id: 'unicorn-fantasy',
    title: '梦幻独角兽',
    category: 'anime',
    tag: '🔥 热门动漫',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。白色独角兽配彩虹鬃毛与金色独角，少女心满满。',
    matrix: decodeGrid(`
      16. MA6 15. |
      14. 5MA8 13. |
      14. 5MA22 13. |
      15. 3MA8 14. |
      15. 3MA22 14. |
      15. 3MA8 14. |
      6. MF1 8. 3MA22 14. |
      4. 5MF1 6. 3MA8 14. |
      4. 5MF1 6. 3MA22 14. |
      4. 5MF1 2. 11MH1 10. |
      4. 2MF1 3MA6 1. 13MH1 9. |
      4. MF1 5MA6 12MH1 MF22 MH1 8. |
      4. MF1 5MA6 11MH1 3MF22 8. |
      5. 5MA6 12MH1 MF22 MH1 8. |
      5. 2MA6 4MB5 13MH1 8. |
      5. MA6 5MB5 13MH1 8. |
      6. 6MB5 13MH1 7. |
      6. 3MB5 2MC4 MB5 2MH7 11MH1 7. |
      6. 2MB5 3MC4 MH7 MH1 2MH7 11MH1 6. |
      7. 4MC4 4MH7 11MH1 6. |
      7. 4MC4 4MH7 11MH1 6. |
      7. 3MC4 2MD14 2MH7 12MH1 6. |
      7. MH1 MC4 5MD14 12MH1 6. |
      8. MC4 5MD14 11MH1 7. |
      8. MH1 3MD14 ME4 MD14 5MH1 4MF22 2MH1 7. |
      9. 2MF14 4ME4 3MH1 6MF22 8. |
      9. MD14 5ME4 3MH1 6MF22 8. |
      10. 5ME4 3MH1 6MF22 8. |
      10. 5ME4 4MH1 4MF22 9. |
      10. 5ME4 17. |
      10. 5ME4 17. |
      12. ME4 19.
    `, 32, 32, C_MAP)
  },
  {
    id: 'pixel-ghost',
    title: '像素小幽灵',
    category: 'anime',
    tag: '🔥 热门动漫',
    difficulty: '★★☆☆☆',
    desc: '32×32 标准画幅。圆滚滚的白色小幽灵，大眼睛与腮红，底部呈波浪形。',
    matrix: decodeGrid(`
      32. |
      32. |
      32. |
      32. |
      32. |
      32. |
      12. 8MH1 12. |
      10. 12MH1 10. |
      9. 14MH1 9. |
      8. 16MH1 8. |
      7. 18MH1 7. |
      7. 3MH1 4MH7 4MH1 4MH7 3MH1 7. |
      6. 6MH1 2MH7 6MH1 2MH7 4MH1 6. |
      6. 3MH1 MH7 2MH1 3MH7 2MH1 MH7 2MH1 3MH7 3MH1 6. |
      6. 3MH1 6MH7 2MH1 6MH7 3MH1 6. |
      6. 3MH1 6MH7 2MH1 6MH7 3MH1 6. |
      6. 4MH1 4MH7 4MH1 4MH7 4MH1 6. |
      6. 4MH1 4MH7 4MH1 4MH7 4MH1 6. |
      6. MH1 2MF22 14MH1 2MF22 MH1 6. |
      6. 4MF22 12MH1 MH10 3MF22 6. |
      6. 4MF22 11MH1 3MH10 2MF22 6. |
      6. MH1 2MF22 12MH1 3MH10 MF22 MH1 6. |
      6. 14MH1 5MH10 MH1 6. |
      6. 15MH1 3MH10 2MH1 6. |
      6. 15MH1 3MH10 2MH1 6. |
      6. 16MH1 MH10 3MH1 6. |
      7. 2MH1 2. 2MH1 2. 2MH1 2. 2MH1 2. 2MH1 7. |
      32. |
      32. |
      32. |
      32. |
      32.
    `, 32, 32, C_MAP)
  },
  {
    id: 'night-lighthouse',
    title: '夜晚灯塔',
    category: 'architecture',
    tag: '🏯 名胜古建',
    difficulty: '★★★★☆',
    desc: '32×32 标准画幅。深蓝夜空下的红白灯塔，海面倒影与星光点点。',
    matrix: decodeGrid(`
      32MD3 |
      32MD3 |
      17MD3 2MA16 13MD3 |
      27MD3 2MA16 3MD3 |
      3MD3 2MA16 22MD3 2MA22 3MD3 |
      14MD3 4MC18 10MD3 2MA22 2MD3 |
      14MD3 4MC18 10MD3 2MA22 2MD3 |
      8MD3 2MA16 4MD3 4MC18 10MD3 2MA22 2MD3 |
      11MD3 10MM15 7MD3 2MA22 2MD3 |
      4MD3 6MA4 MD3 2MM15 6MA4 2MM15 MD3 6MA4 2MA22 2MD3 |
      11MD3 2MM15 6MA4 2MM15 3MD3 5MA22 3MD3 |
      12MD3 8MH1 3MD3 2MA16 7MD3 |
      12MD3 8MH1 12MD3 |
      12MD3 8MH1 12MD3 |
      5MD3 2MA16 5MD3 8MF4 12MD3 |
      12MD3 8MF4 12MD3 |
      12MD3 8MH1 12MD3 |
      12MD3 8MH1 9MD3 2MA16 MD3 |
      12MD3 8MF4 12MD3 |
      12MD3 8MF4 12MD3 |
      12MD3 8MH1 12MD3 |
      12MD3 8MH1 12MD3 |
      12MD3 3MH1 3MM15 2MH1 12MD3 |
      12. 9MM15 11. |
      32MD25 |
      MC4 3MD25 MC4 3MD25 MC4 3MD25 MC4 3MD25 MC4 3MD25 MC4 3MD25 MC4 3MD25 MC4 3MD25 |
      32MD25 |
      32MD25 |
      2MD25 MC4 4MD25 MC4 4MD25 MC4 4MD25 MC4 4MD25 MC4 4MD25 MC4 4MD25 |
      32MD25 |
      12MD25 9MD3 11MD25 |
      10MD25 13MD3 9MD25
    `, 32, 32, C_MAP)
  },
];
