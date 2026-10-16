/**
 * bead-colors.js — Artkal Mini（2.6mm）标准色库 · 唯一真源
 *
 * 为什么单独抽一个模块：
 *   改造前站点里并存两套互不兼容的色板 —— patterns-data.js（创作页/图库用）
 *   与 palette.js（白板用）。两者同名色号指向完全不同的颜色，例如
 *   A10 在一处是「活力橙 #F97316」、在另一处是「酒红 #722F37」。
 *   根因是两套值都是手工近似（一套抄了 Tailwind 调色板，一套抄了 CSS 命名色），
 *   并非真实拼豆色。现在统一以本模块为准，两个消费者都从这里取色。
 *
 * 数据来源：
 *   公开的 Artkal Mini 色卡（beadchart.com / bitbead.app 两站数值一致）。
 *   色号体系为 MA / MB / MC / MD / ME / MF / MG / MH / MM 九个系列，共 221 色。
 *
 * 关于精度的说明（重要，不要当成 bug）：
 *   拼豆是实体塑料珠，官方并没有发布过「十六进制色值」。各网站列出的 hex
 *   都是扫描/拍照后的近似值，不同来源会有几个色阶的差异（例如同一颗
 *   S01 White，有的站写 #FFFFFF，有的写 #EAEEF3）。本模块采用
 *   beadchart.com 与 bitbead.app 相互印证的一套，保证站内自洽。
 *   若要更贴近实物，应拿实体色卡人工校色，而不是再换一个网站。
 */

/** 紧凑数据：每项「色号 名称 六位hex」，空格分隔，便于维护与校对。 */
const RAW = `
MA1 淡黄色 fff6d4 MA2 浅黄色 f6f9e5 MA3 亮黄色 fffbaa MA4 金黄色 ffdf58 MA5 深金黄 fecf4d
MA6 橙黄色 ffa80c MA7 橙色 ff8837 MA8 柔和橙 eac431 MA9 浅橙色 f1aa8f MA10 深橙色 ff8f42
MA11 浅杏色 ffe1a1 MA12 杏色 f4b39c MA13 浅黄橙 ffb100 MA14 红橙色 ff6510 MA15 柠檬黄 daf05c
MA16 亮柠檬 f9fbbe MA17 蛋黄色 ffd976 MA18 浅橙棕 ffca9a MA19 浅红橙 ec7a92 MA20 蜜黄色 e5be55
MA21 浅蜜黄 ffe596 MA22 黄绿色 f7e898 MA23 米黄色 f0cbb1 MA24 浅黄绿 f5fcd1 MA25 淡黄绿 f6d487
MA26 金色 ffcb4b
MB1 黄绿 d2e318 MB2 亮绿 79cd41 MB3 浅绿 82d7a1 MB4 春绿 65df4f MB5 鲜绿 5fc873
MB6 薄荷绿 49d1ae MB7 森林绿 009696 MB8 深绿 08774f MB9 暗绿 183823 MB10 柔和绿 83cfc3
MB11 军绿 5a6a27 MB12 深森林绿 045f45 MB13 淡绿 e2ffb3 MB14 青草绿 9dd12e MB15 深青绿 254b3c
MB16 浅青绿 d0fcad MB17 橄榄绿 8ca12a MB18 黄绿亮 d2d958 MB19 翡翠绿 49bca9 MB20 薄荷淡绿 e8fdec
MB21 深蓝绿 188b81 MB22 深青 0c5c5b MB23 橄榄棕 3d461b MB24 柔和黄绿 eafcb6 MB25 墨绿 538771
MB26 棕绿 8a7a40 MB27 淡灰绿 d2deb6 MB28 浅薄荷绿 9ff4c2 MB29 黄绿色 bbd747 MB30 淡黄绿 f5ffe6
MB31 浅草绿 bfe1c2 MB32 灰绿 9fba5c
MC1 淡白绿 d5e3de MC2 亮青 bbf1f4 MC3 浅青 73c0df MC4 天青 33b3e1 MC5 深天青 00a3ca
MC6 浅蓝 58a0d9 MC7 中蓝 0588cc MC8 深蓝 005f9e MC9 皇蓝 086fb9 MC10 天空蓝 52b4e0
MC11 松绿蓝 00a9b9 MC12 深夜蓝 1c375a MC13 浅蓝白 cee0f0 MC14 淡青绿 ebf5f4 MC15 青蓝 00aaad
MC16 深蓝紫 004c7d MC17 亮青蓝 5bd4f6 MC18 深灰蓝 36515c MC19 深青蓝 0f909d MC20 深海蓝 0084b7
MC21 淡蓝 ddecfa MC22 灰蓝 84bac2 MC23 浅蓝 cbdbdb MC24 空蓝 88bde2 MC25 浅青蓝 b3ece0
MC26 深青蓝 3e9ebf MC27 淡紫蓝 e9f0f3 MC28 灰紫蓝 c2cde3 MC29 深紫蓝 586b8f
MD1 浅紫 7292e2 MD2 紫罗兰 6e8ccc MD3 中紫 13419a MD4 深紫 1e3175 MD5 品红 b850b2
MD6 浅紫罗兰 ad92e9 MD7 葡萄紫 5f2d91 MD8 淡紫 d7cdf1 MD9 浅葡萄紫 bdb2e6 MD10 深葡萄 251b58
MD11 灰紫 a2bbe7 MD12 玫瑰紫 cf8bbe MD13 深品红 b80096 MD14 紫红 a137a7 MD15 深蓝紫 4a388a
MD16 淡紫白 dce8f6 MD17 淡蓝紫 aecef0 MD18 深紫罗兰 b38edb MD19 淡玫瑰紫 e8d2ea MD20 兰紫 b460c3
MD21 深兰紫 842a94 MD22 深紫蓝 4b5e9e MD23 浅紫白 d6d2e2 MD24 紫蓝 7776d1 MD25 深紫蓝 3837a8
MD26 淡紫粉 ddc8dd
ME1 浅肉色 fdd6c9 ME2 淡粉红 ffd8f4 ME3 浅粉紫 ffa0c3 ME4 粉红 f67aab ME5 亮粉红 da5b95
ME6 深粉红 ff4b78 ME7 暗粉红 9e156b ME8 浅粉 ffe1e6 ME9 兰粉 f378ca ME10 深兰粉 be316d
ME11 浅肤色 ffe8da ME12 淡肤色 ffa5c6 ME13 深品红 b53883 ME14 浅杏粉 ffddc7 ME15 浅粉肤 e5c6d0
ME16 淡米白 f9f2eb ME17 淡粉白 e7dce6 ME18 浅粉白 ffd3e6 ME19 淡粉 ffd5ec ME20 灰粉 f3dce8
ME21 棕粉 bd9ca3 ME22 灰棕粉 c578a5 ME23 深灰粉 a37a9b ME24 浅紫粉 f4e8ff
MF1 浅红 ff7f67 MF2 深红 ff5d46 MF3 砖红 e3564a MF4 亮红 c7270d MF5 正红 be0a27
MF6 深棕红 83411e MF7 暗棕红 730037 MF8 深红 ab0022 MF9 浅红 de7995 MF10 棕红 ab613c
MF11 深棕 5c2929 MF12 玫瑰红 f34461 MF13 番茄红 c64239 MF14 浅粉红 ffa5bb MF15 深绯红 bc0018
MF16 浅肉红 ffd7cb MF17 浅棕红 f19d8a MF18 棕红 dc7b45 MF19 深棕红 c74651 MF20 灰棕红 d8a89e
MF21 浅粉棕 eb9db9 MF22 淡粉棕 ffd4d4 MF23 珊瑚红 ea8474 MF24 玫瑰红 f7c1c5 MF25 砖红 fc5768
MG1 淡肤色 ffe7c8 MG2 浅肤色 ffd6c3 MG3 肤色 eeb694 MG4 深肤色 d9a58c MG5 棕金 f49630
MG6 深棕金 f19937 MG7 深棕 ac745b MG8 深棕色 694a42 MG9 浅棕 f7cc9d MG10 棕色 c7832f
MG11 浅棕金 d3c391 MG12 浅橙棕 e6b986 MG13 棕红 c67b4f MG14 深棕 8d6242 MG15 淡米黄 f6f7e2
MG16 浅肤米 f2e7d7 MG17 深棕灰 786562 MG18 浅肤米 fef5eb MG19 橙棕 f0ab47 MG20 深橙棕 ae6949
MG21 棕灰 bf8c6e
MH1 透明 ffffff MH2 极白 ffffff MH3 浅灰 9b9b9b MH4 中灰 6d6d6d MH5 深灰 4d4d4d
MH6 深深灰 3a3a3a MH7 黑色 000000 MH8 淡棕灰 fff0f1 MH9 淡灰紫 e3e6df MH10 浅灰 e2e0e7
MH11 灰色 bcb8b5 MH12 淡米白 f7f3e1 MH13 淡紫灰 eaddc8 MH14 灰绿 b8c8c5 MH15 淡灰绿 99abac
MH16 深灰 444236 MH17 淡灰 fafbf5 MH18 淡白 fefeee MH19 淡米灰 fbf2e4 MH20 中灰 9eaead
MH21 淡黄白 fdfff2 MH22 浅灰 edede7 MH23 灰绿 b4b8a7
MM1 灰绿 aebba8 MM2 深灰绿 729376 MM3 蓝灰绿 6a8890 MM4 淡棕灰 beb39d MM5 灰棕 b8b78c
MM6 深灰棕 b2ac93 MM7 灰棕 bc9f94 MM8 棕灰 968381 MM9 深棕 b39d88 MM10 紫灰 b796a3
MM11 深紫灰 b096b9 MM12 深棕灰 685951 MM13 棕色 c79582 MM14 深棕 ca694f MM15 深灰 929fa9
`;

/** 系列元数据：用于色板分组与筛选界面。 */
export const SERIES = [
  { key: 'MA', name: '黄橙系', desc: '黄、橙、杏、柠檬与蜜色' },
  { key: 'MB', name: '绿色系', desc: '草绿、薄荷、橄榄与墨绿' },
  { key: 'MC', name: '蓝色系', desc: '天青、湖蓝、藏蓝与灰蓝' },
  { key: 'MD', name: '紫色系', desc: '紫罗兰、葡萄紫与品红' },
  { key: 'ME', name: '粉色系', desc: '粉红、兰粉与浅肤色' },
  { key: 'MF', name: '红色系', desc: '正红、砖红、玫瑰红与珊瑚红' },
  { key: 'MG', name: '棕色系', desc: '肤色、棕色与棕金' },
  { key: 'MH', name: '灰色系', desc: '白、灰阶与黑' },
  { key: 'MM', name: '灰绿系', desc: '灰绿、卡其与灰棕' },
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** 解析紧凑数据为规范对象数组。 */
function build(raw) {
  const tokens = raw.trim().split(/\s+/);
  // 每 3 个 token 为一组：色号 / 名称 / hex
  if (tokens.length % 3 !== 0) {
    throw new Error(`bead-colors: 原始数据格式异常，token 数 ${tokens.length} 不是 3 的倍数`);
  }
  const list = [];
  const seen = new Set();
  for (let i = 0; i < tokens.length; i += 3) {
    const code = tokens[i];
    const name = tokens[i + 1];
    const hexRaw = tokens[i + 2];
    if (!/^[A-Z]{2}\d{1,2}$/.test(code)) {
      throw new Error(`bead-colors: 非法色号 "${code}"（第 ${i / 3 + 1} 项）`);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(hexRaw)) {
      throw new Error(`bead-colors: 非法色值 "${hexRaw}"（色号 ${code}）`);
    }
    if (seen.has(code)) {
      throw new Error(`bead-colors: 色号重复 "${code}"`);
    }
    seen.add(code);
    const hex = '#' + hexRaw.toUpperCase();
    const { r, g, b } = hexToRgb(hex);
    list.push({ code, name, hex, r, g, b, series: code.slice(0, 2) });
  }
  return list;
}

/** 全部 221 色（Artkal Mini）。 */
export const BEAD_COLORS = build(RAW);

/** 色号 → 颜色对象 */
export const BY_CODE = new Map(BEAD_COLORS.map((c) => [c.code, c]));

/** 按系列取色 */
export function bySeries(key) {
  return BEAD_COLORS.filter((c) => c.series === key);
}

/** 取某个色号的十六进制值，找不到时回退到中性灰，避免渲染崩掉 */
export function hexOf(code) {
  const c = BY_CODE.get(code);
  return c ? c.hex : '#CCCCCC';
}

export const TOTAL = BEAD_COLORS.length;
