// ==========================================
// 官方标准色库定义 (A/B/C/D/E/F/G/H/M/X 体系)
// ==========================================

const H_PALETTE = [
  { code: 'H1', name: '纯白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { code: 'H2', name: '浅银灰', hex: '#E5E7EB', r: 229, g: 231, b: 235 },
  { code: 'H3', name: '质感灰', hex: '#9CA3AF', r: 156, g: 163, b: 175 },
  { code: 'H4', name: '深灰', hex: '#4B5563', r: 75, g: 85, b: 99 },
  { code: 'H5', name: '碳深灰', hex: '#374151', r: 55, g: 65, b: 81 },
  { code: 'H6', name: '暗黑灰', hex: '#1F2937', r: 31, g: 41, b: 55 },
  { code: 'H7', name: '纯黑', hex: '#111827', r: 17, g: 24, b: 39 }
];

const A_PALETTE = [
  { code: 'A1', name: '象牙白', hex: '#FEF9C3', r: 254, g: 249, b: 195 },
  { code: 'A2', name: '奶黄', hex: '#FEF08A', r: 254, g: 240, b: 138 },
  { code: 'A3', name: '柠檬黄', hex: '#FDE047', r: 253, g: 224, b: 71 },
  { code: 'A4', name: '明黄', hex: '#FACC15', r: 250, g: 204, b: 21 },
  { code: 'A5', name: '正黄', hex: '#EAB308', r: 234, g: 179, b: 8 },
  { code: 'A6', name: '暗黄', hex: '#CA8A04', r: 202, g: 138, b: 4 },
  { code: 'A7', name: '浅肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { code: 'A8', name: '蜜桃肤', hex: '#FDBA74', r: 253, g: 186, b: 116 },
  { code: 'A9', name: '浅橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  { code: 'A10', name: '活力橙', hex: '#F97316', r: 249, g: 115, b: 22 },
  { code: 'A11', name: '深橙', hex: '#EA580C', r: 234, g: 88, b: 12 },
  { code: 'A20', name: '金黄', hex: '#F59E0B', r: 245, g: 158, b: 11 }
];

const B_PALETTE = [
  { code: 'B2', name: '薄荷嫩绿', hex: '#BBF7D0', r: 187, g: 247, b: 208 },
  { code: 'B4', name: '草绿', hex: '#4ADE80', r: 74, g: 222, b: 128 },
  { code: 'B6', name: '正绿', hex: '#16A34A', r: 22, g: 163, b: 74 },
  { code: 'B8', name: '墨绿', hex: '#166534', r: 22, g: 101, b: 52 },
  { code: 'B28', name: '水绿', hex: '#2DD4BF', r: 45, g: 212, b: 191 },
  { code: 'B29', name: '孔雀绿', hex: '#14B8A6', r: 20, g: 184, b: 166 }
];

const C_PALETTE = [
  { code: 'C2', name: '浅天蓝', hex: '#BAE6FD', r: 186, g: 230, b: 253 },
  { code: 'C3', name: '天蓝', hex: '#7DD3FC', r: 125, g: 211, b: 252 },
  { code: 'C4', name: '亮天蓝', hex: '#38BDF8', r: 56, g: 189, b: 248 },
  { code: 'C15', name: '宝蓝', hex: '#2563EB', r: 37, g: 99, b: 235 },
  { code: 'C18', name: '藏青', hex: '#1E3A8A', r: 30, g: 58, b: 138 },
  { code: 'C24', name: '青蓝', hex: '#06B6D4', r: 6, g: 182, b: 212 }
];

const D_PALETTE = [
  { code: 'D4', name: '香芋紫', hex: '#C4B5FD', r: 196, g: 181, b: 253 },
  { code: 'D14', name: '荧光紫', hex: '#E879F9', r: 232, g: 121, b: 249 },
  { code: 'D24', name: '经典紫', hex: '#A855F7', r: 168, g: 85, b: 247 },
  { code: 'D26', name: '星空深紫', hex: '#7E22CE', r: 126, g: 34, b: 206 }
];

const E_PALETTE = [
  { code: 'E2', name: '极浅粉', hex: '#FFE4E6', r: 255, g: 228, b: 230 },
  { code: 'E3', name: '嫩粉', hex: '#FECDD3', r: 254, g: 205, b: 211 },
  { code: 'E4', name: '少女粉', hex: '#FDA4AF', r: 253, g: 164, b: 175 },
  { code: 'E5', name: '珊瑚粉', hex: '#FB7185', r: 251, g: 113, b: 133 },
  { code: 'E14', name: '芭比粉', hex: '#F472B6', r: 244, g: 114, b: 177 },
  { code: 'E7', name: '玫红', hex: '#E11D48', r: 225, g: 29, b: 72 }
];

const F_PALETTE = [
  { code: 'F5', name: '鲜红', hex: '#F87171', r: 248, g: 113, b: 113 },
  { code: 'F6', name: '朱红', hex: '#EF4444', r: 239, g: 68, b: 68 },
  { code: 'F7', name: '中国红', hex: '#DC2626', r: 220, g: 38, b: 38 },
  { code: 'F8', name: '深红', hex: '#B91C1C', r: 185, g: 28, b: 28 },
  { code: 'F15', name: '活力橙', hex: '#FB923C', r: 251, g: 146, b: 60 }
];

const G_PALETTE = [
  { code: 'G5', name: '焦糖灰', hex: '#78716C', r: 120, g: 113, b: 108 },
  { code: 'G12', name: '奶茶色', hex: '#E8DCCF', r: 232, g: 220, b: 207 },
  { code: 'G16', name: '经典棕', hex: '#7D5638', r: 125, g: 86, b: 56 },
  { code: 'G17', name: '浓缩咖啡', hex: '#5D3B1F', r: 93, g: 59, b: 31 },
  { code: 'G19', name: '摩卡棕', hex: '#A16207', r: 161, g: 98, b: 7 }
];

const M_PALETTE = [
  { code: 'M14', name: '荧光黄', hex: '#FEF9C3', r: 254, g: 249, b: 195 },
  { code: 'M15', name: '夜光金', hex: '#FEF08A', r: 254, g: 240, b: 138 }
];

const FULL_221_PALETTE = [
  ...A_PALETTE, ...B_PALETTE, ...C_PALETTE, ...D_PALETTE,
  ...E_PALETTE, ...F_PALETTE, ...G_PALETTE, ...H_PALETTE, ...M_PALETTE
];

const X88_PALETTE = Array.from({ length: 88 }, (_, i) => {
  const code = `X${i + 1}`;
  const ref = FULL_221_PALETTE[i % FULL_221_PALETTE.length];
  return { code, name: `${code} ${ref.name}`, hex: ref.hex, r: ref.r, g: ref.g, b: ref.b };
});

const STD_72_PALETTE = [
  H_PALETTE[0], H_PALETTE[1], H_PALETTE[2], H_PALETTE[3], H_PALETTE[6],
  A_PALETTE[2], A_PALETTE[3], A_PALETTE[6], A_PALETTE[7], A_PALETTE[9], A_PALETTE[11],
  B_PALETTE[0], B_PALETTE[1], B_PALETTE[2], B_PALETTE[3], B_PALETTE[4],
  C_PALETTE[0], C_PALETTE[1], C_PALETTE[2], C_PALETTE[3], C_PALETTE[4], C_PALETTE[5],
  D_PALETTE[0], D_PALETTE[1], D_PALETTE[2], D_PALETTE[3],
  E_PALETTE[1], E_PALETTE[2], E_PALETTE[4], E_PALETTE[5],
  F_PALETTE[0], F_PALETTE[2], F_PALETTE[3], F_PALETTE[4],
  G_PALETTE[0], G_PALETTE[1], G_PALETTE[2], G_PALETTE[3], G_PALETTE[4]
];

export const PALETTES = {
  standard72: STD_72_PALETTE,
  classic88: X88_PALETTE,
  advance144: FULL_221_PALETTE.slice(0, 144),
  full221: FULL_221_PALETTE
};

export const C_MAP = {
  H1: H_PALETTE[0], H2: H_PALETTE[1], H3: H_PALETTE[2], H4: H_PALETTE[3], H5: H_PALETTE[4], H7: H_PALETTE[6],
  A1: A_PALETTE[0], A2: A_PALETTE[1], A3: A_PALETTE[2], A4: A_PALETTE[3], A7: A_PALETTE[6], A8: A_PALETTE[7], A9: A_PALETTE[8], A10: A_PALETTE[9], A20: A_PALETTE[11],
  B2: B_PALETTE[0], B4: B_PALETTE[1], B6: B_PALETTE[2], B8: B_PALETTE[3], B28: B_PALETTE[4], B29: B_PALETTE[5],
  C2: C_PALETTE[0], C3: C_PALETTE[1], C4: C_PALETTE[2], C15: C_PALETTE[3], C18: C_PALETTE[4], C24: C_PALETTE[5],
  D4: D_PALETTE[0], D14: D_PALETTE[1], D24: D_PALETTE[2], D26: D_PALETTE[3],
  E2: E_PALETTE[0], E3: E_PALETTE[1], E4: E_PALETTE[2], E5: E_PALETTE[3], E14: E_PALETTE[4], E7: E_PALETTE[5],
  F5: F_PALETTE[0], F6: F_PALETTE[1], F7: F_PALETTE[2], F8: F_PALETTE[3], F15: F_PALETTE[4],
  G5: G_PALETTE[0], G12: G_PALETTE[1], G16: G_PALETTE[2], G17: G_PALETTE[3], G19: G_PALETTE[4]
};

function buildMatrix(rows, cmap) {
  return rows.map(r => {
    const tokens = r.trim().split(/\s+/);
    return tokens.map(t => (t === '.' || !t) ? null : (cmap[t] || null));
  });
}

// 辅助生成对称 32×32 纯净矩阵
function gen32(renderFunc) {
  const res = [];
  for (let y = 0; y < 32; y++) {
    const row = [];
    for (let x = 0; x < 32; x++) {
      const v = renderFunc(x, y);
      row.push(v ? v : '.');
    }
    res.push(row.join(' '));
  }
  return res;
}

// ==========================================
// 32×32 热门大画幅图纸库
// ==========================================
export const ALL_PATTERNS = [
  // 1. 富士山与盛放樱花 (32x32)
  {
    id: 'mount-fuji',
    title: '富士山与盛放樱花 (Mount Fuji & Sakura)',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '白雪皑皑的富士山峰、初升旭日与飘落的樱花花瓣。',
    matrix: buildMatrix(gen32((x, y) => {
      // 太阳
      if ((x - 16)**2 + (y - 9)**2 <= 28) return 'F7';
      // 富士山主体
      if (y >= 13) {
        const w = (y - 13) * 1.1;
        if (x >= 16 - 3 - w && x <= 16 + 3 + w) {
          if (y <= 18) return 'H1';
          if (y === 19 && (x % 3 === 0 || x % 5 === 0)) return 'H1';
          return (x + y) % 2 === 0 ? 'C18' : 'C15';
        }
      }
      // 海浪湖景
      if (y >= 28) return (x + y) % 2 === 0 ? 'C3' : 'C24';
      // 樱花瓣
      if ((x===4&&y===5)||(x===5&&y===6)||(x===25&&y===8)||(x===27&&y===10)||(x===8&&y===12)||(x===24&&y===18)) return 'E4';
      return null;
    }), C_MAP)
  },

  // 2. 严岛水上鸟居 (32x32)
  {
    id: 'torii-shrine',
    title: '严岛水上鸟居 (Sea Torii Gate)',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★★',
    desc: '东方美学神木朱红大鸟居，静立于蔚蓝海浪波光之上。',
    matrix: buildMatrix(gen32((x, y) => {
      // 旭日背景
      if ((x - 16)**2 + (y - 12)**2 <= 36) return 'F5';
      // 鸟居上横梁
      if (y === 7 && x >= 3 && x <= 28) return 'F7';
      if (y === 8 && x >= 2 && x <= 29) return 'F8';
      if (y === 11 && x >= 5 && x <= 26) return 'F7';
      // 两根主立柱
      if (y >= 8 && y <= 26) {
        if ((x >= 8 && x <= 10) || (x >= 21 && x <= 23)) {
          if (y >= 24) return 'H7'; // 柱底基座
          return 'F7';
        }
      }
      // 海面与波浪
      if (y >= 26) return (x % 4 === 0) ? 'H1' : (y % 2 === 0 ? 'C15' : 'C18');
      return null;
    }), C_MAP)
  },

  // 3. 欧式红顶风车 (32x32)
  {
    id: 'windmill-scenery',
    title: '欧式红顶风车 (Windmill & Tulip)',
    category: 'architecture',
    tag: '风景建筑',
    difficulty: '★★★★☆',
    desc: '古典欧式小镇风车，四叶缓缓旋转，底座伴有郁金香花田。',
    matrix: buildMatrix(gen32((x, y) => {
      // 风车扇叶中心 (16, 11)
      if (x === 16 && y >= 3 && y <= 19) return 'H7';
      if (y === 11 && x >= 8 && x <= 24) return 'H7';
      if ((x === 16 || x === 15) && (y === 11 || y === 10)) return 'A4';
      // 塔身
      if (y >= 12 && y <= 26) {
        const w = (y - 12) * 0.35;
        if (x >= 16 - 3 - w && x <= 16 + 3 + w) {
          if (y <= 14) return 'F7'; // 尖红顶
          if (x === 16 && (y === 17 || y === 22)) return 'H7'; // 小窗户
          return 'G12'; // 石砖墙
        }
      }
      // 郁金香花田草地
      if (y >= 27) return (x % 3 === 0) ? 'F7' : ((x % 3 === 1) ? 'A4' : 'B4');
      return null;
    }), C_MAP)
  },

  // 4. 库洛米恶魔魔女 (32x32)
  {
    id: 'kuromi-witch',
    title: '库洛米恶魔魔女 (Kuromi Winged)',
    category: 'cartoon',
    tag: '热门卡通',
    difficulty: '★★★★★',
    desc: '三丽鸥顶流库洛米，经典黑色小恶魔角、粉骷髅与恶魔小翼。',
    matrix: buildMatrix(gen32((x, y) => {
      // 恶魔耳朵
      if ((y <= 9) && ((x >= 4 && x <= 8) || (x >= 23 && x <= 27))) {
        if ((x >= 5 && x <= 7) && (y >= 3 && y <= 7)) return 'D26';
        return 'H7';
      }
      // 帽子主体与头部轮廓
      if (y >= 8 && y <= 24 && x >= 6 && x <= 25) {
        // 粉色小骷髅 (16, 12)
        if (y >= 10 && y <= 13 && x >= 14 && x <= 17) {
          if ((x === 15 || x === 16) && y === 12) return 'H7';
          return 'E14';
        }
        // 白脸区域
        if (y >= 14 && y <= 22 && x >= 9 && x <= 22) {
          // 眼睛
          if (y >= 16 && y <= 18 && (x === 12 || x === 19)) return 'H7';
          // 腮红
          if (y === 19 && (x === 10 || x === 21)) return 'E14';
          // 小鼻子嘴巴
          if (y === 20 && x === 16) return 'E14';
          return 'H1';
        }
        return 'D24';
      }
      // 小身子
      if (y >= 25 && y <= 28 && x >= 11 && x <= 20) return 'H7';
      return null;
    }), C_MAP)
  },

  // 5. 吉伊卡哇星空祈愿 (32x32)
  {
    id: 'chiikawa-stars',
    title: '吉伊卡哇星空夜 (Chiikawa & Stars)',
    category: 'cartoon',
    tag: '热门卡通',
    difficulty: '★★★★☆',
    desc: '全网超人气萌物吉伊卡哇，抱着闪耀星星的治愈瞬间。',
    matrix: buildMatrix(gen32((x, y) => {
      // 小耳朵
      if (y >= 6 && y <= 9 && ((x >= 9 && x <= 12) || (x >= 19 && x <= 22))) return 'H7';
      // 圆滚滚脑袋
      if ((x - 16)**2 + (y - 16)**2 <= 64) {
        // 眼睛
        if ((y === 14 || y === 15) && (x === 12 || x === 20)) return 'H7';
        // 眼睛高光
        if (y === 14 && (x === 13 || x === 21)) return 'H1';
        // 呆萌小八字眉
        if (y === 12 && (x === 12 || x === 20)) return 'H7';
        // 粉嫩小腮红
        if (y === 17 && (x === 10 || x === 11 || x === 21 || x === 22)) return 'E4';
        // 倒三角鼻子嘴巴
        if (y === 18 && (x === 15 || x === 16 || x === 17)) return 'H7';
        return 'H1';
      }
      // 怀中抱着的闪耀金星 (16, 25)
      if (y >= 23 && y <= 27 && x >= 13 && x <= 19) return 'A4';
      return null;
    }), C_MAP)
  },

  // 6. 大耳狗云朵天使 (32x32)
  {
    id: 'cinnamoroll-cloud',
    title: '大耳狗云朵天使 (Cinnamoroll)',
    category: 'cartoon',
    tag: '热门卡通',
    difficulty: '★★★★☆',
    desc: '三丽鸥人气王大耳狗，天蓝大眼睛与软绵绵云朵大耳朵。',
    matrix: buildMatrix(gen32((x, y) => {
      // 左右飞扬的超长大耳朵
      if (y >= 11 && y <= 16) {
        if ((x >= 2 && x <= 8) || (x >= 23 && x <= 29)) return 'H1';
      }
      // 脑袋主体
      if ((x - 16)**2 + (y - 14)**2 <= 42) {
        // 澄澈蓝眼睛
        if ((y === 13 || y === 14) && (x === 12 || x === 20)) return 'C3';
        // 腮红
        if (y === 15 && (x === 10 || x === 22)) return 'E3';
        // 嘴巴
        if (y === 16 && x === 16) return 'E14';
        return 'H1';
      }
      // 云朵下半身
      if (y >= 19 && y <= 24 && x >= 10 && x <= 22) return 'H1';
      return null;
    }), C_MAP)
  },

  // 7. 黑神话悟空紫金冠 (32x32)
  {
    id: 'wukong-legend',
    title: '黑神话：悟空 (Black Myth Wukong)',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '齐天大圣霸气登场，头戴凤翅紫金冠，身着锁子黄金甲。',
    matrix: buildMatrix(gen32((x, y) => {
      // 凤翅双翎 (羽毛向上延伸)
      if (y <= 10) {
        if (x === 11 - Math.floor(y * 0.7) || x === 20 + Math.floor(y * 0.7)) return 'F7';
      }
      // 紫金紧箍与金冠
      if (y >= 9 && y <= 13 && x >= 10 && x <= 21) {
        if (x >= 14 && x <= 17 && y === 10) return 'F7'; // 宝珠
        return 'A20';
      }
      // 威严猴面
      if (y >= 14 && y <= 21 && x >= 11 && x <= 20) {
        // 金睛
        if (y === 16 && (x === 13 || x === 18)) return 'A4';
        // 脸谱心形红色纹路
        if ((x === 12 || x === 19) && y >= 15 && y <= 18) return 'F8';
        return 'A7';
      }
      // 黄金甲肩铠与胸甲
      if (y >= 22 && y <= 29 && x >= 8 && x <= 23) {
        if ((x >= 14 && x <= 17) && (y >= 23 && y <= 26)) return 'F7'; // 胸前宝甲
        return (x + y) % 2 === 0 ? 'A20' : 'G19';
      }
      return null;
    }), C_MAP)
  },

  // 8. 塞尔达大师之剑 (32x32)
  {
    id: 'master-sword',
    title: '塞尔达传说·退魔大师剑 (Master Sword)',
    category: 'games',
    tag: '游戏神作',
    difficulty: '★★★★★',
    desc: '海拉鲁大陆神话圣剑，直插于古树神坛基座之中。',
    matrix: buildMatrix(gen32((x, y) => {
      // 剑身 (中央发光刃)
      if (x >= 15 && x <= 16 && y >= 4 && y <= 18) return 'C3';
      if ((x === 14 || x === 17) && y >= 5 && y <= 17) return 'H1';
      // 翼形金色护手 (y=19~21)
      if (y === 19 && x >= 11 && x <= 20) return 'A20';
      if (y === 20 && (x === 10 || x === 21)) return 'A20';
      // 剑柄与剑首
      if (x >= 15 && x <= 16 && y >= 20 && y <= 24) return 'C15';
      if (x >= 14 && x <= 17 && y === 24) return 'A20';
      // 石质神坛基座 (y=25~30)
      if (y >= 25 && y <= 30) {
        const w = (y - 25) * 1.5;
        if (x >= 16 - 3 - w && x <= 16 + 3 + w) return (x % 2 === 0 ? 'H3' : 'H4');
      }
      return null;
    }), C_MAP)
  },

  // 9. 卡皮巴拉温泉汤 (32x32)
  {
    id: 'capybara-spa',
    title: '卡皮巴拉温泉汤 (Capybara Onsen)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '全网超绝松弛感水豚，头顶金橘惬意泡温泉，热气袅袅。',
    matrix: buildMatrix(gen32((x, y) => {
      // 水汽热气
      if ((y <= 6) && (x === 13 || x === 18 || x === 15)) return 'H2';
      // 头顶小金橘与绿叶
      if (y === 7 && x === 16) return 'B6';
      if (y >= 8 && y <= 10 && x >= 14 && x <= 17) return 'A10';
      // 水豚大方脑袋
      if (y >= 11 && y <= 21 && x >= 10 && x <= 21) {
        // 小闭眼享受神情
        if (y === 15 && (x === 12 || x === 13 || x === 18 || x === 19)) return 'H7';
        // 圆鼻孔
        if (y === 18 && (x === 15 || x === 16)) return 'H7';
        return 'G19';
      }
      // 温泉木桶与水波 (y=22~29)
      if (y >= 22) {
        if (y <= 24 && x >= 6 && x <= 25) return (x % 3 === 0 ? 'H1' : 'C24'); // 温泉水
        if (x >= 5 && x <= 26) return (x % 2 === 0 ? 'G16' : 'G17'); // 木桶板
      }
      return null;
    }), C_MAP)
  },

  // 10. 招财三花猫金币 (32x32)
  {
    id: 'fortune-cat',
    title: '招财三花猫 (Fortune Calico Cat)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '日本招财三花猫，左手高举招福，胸前怀抱大金币。',
    matrix: buildMatrix(gen32((x, y) => {
      // 猫耳 (左耳黑花，右耳橙花)
      if (y >= 6 && y <= 9) {
        if (x >= 9 && x <= 12) return 'H7';
        if (x >= 19 && x <= 22) return 'A9';
      }
      // 脑袋主体
      if ((x - 16)**2 + (y - 15)**2 <= 48) {
        // 眼睛
        if (y === 14 && (x === 12 || x === 20)) return 'H7';
        // 红色蝴蝶结项圈
        if (y === 19 && x >= 12 && x <= 20) return 'F7';
        return 'H1';
      }
      // 举起的招财左手
      if (x >= 7 && x <= 9 && y >= 11 && y <= 15) return 'H1';
      // 怀抱的金币 (y=20~26, x=13~18)
      if (y >= 20 && y <= 26 && x >= 13 && x <= 18) return 'A4';
      // 身体下半部分
      if (y >= 22 && y <= 29 && x >= 9 && x <= 22) return 'H1';
      return null;
    }), C_MAP)
  }
];
