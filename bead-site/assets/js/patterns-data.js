// 标准色板定义
export const C = {
  W:   { code: 'S01', name: '纯白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  K:   { code: 'S02', name: '纯黑', hex: '#18181B', r: 24, g: 24, b: 27 },
  R:   { code: 'S03', name: '正红', hex: '#DC2626', r: 220, g: 38, b: 38 },
  DR:  { code: 'S04', name: '暗红', hex: '#991B1B', r: 153, g: 27, b: 27 },
  P:   { code: 'S05', name: '芭比粉', hex: '#EC4899', r: 236, g: 72, b: 153 },
  LP:  { code: 'S06', name: '浅粉', hex: '#FBCFE8', r: 251, g: 207, b: 232 },
  B:   { code: 'S07', name: '天蓝', hex: '#38BDF8', r: 56, g: 189, b: 248 },
  DB:  { code: 'S08', name: '宝蓝', hex: '#2563EB', r: 37, g: 99, b: 235 },
  NB:  { code: 'S09', name: '藏青', hex: '#1E3A8A', r: 30, g: 58, b: 138 },
  G:   { code: 'S10', name: '草绿', hex: '#22C55E', r: 34, g: 197, b: 94 },
  DG:  { code: 'S11', name: '墨绿', hex: '#166534', r: 22, g: 101, b: 52 },
  Y:   { code: 'S13', name: '明黄', hex: '#FACC15', r: 250, g: 204, b: 21 },
  DY:  { code: 'S14', name: '金黄', hex: '#D97706', r: 217, g: 119, b: 6 },
  O:   { code: 'S15', name: '活力橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  V:   { code: 'S17', name: '香芋紫', hex: '#A855F7', r: 168, g: 85, b: 247 },
  DV:  { code: 'S18', name: '深紫', hex: '#6B21A8', r: 107, g: 33, b: 168 },
  S:   { code: 'S19', name: '暖肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  M:   { code: 'S20', name: '摩卡棕', hex: '#A16207', r: 161, g: 98, b: 7 },
  DM:  { code: 'S21', name: '浓缩咖啡', hex: '#451A03', r: 69, g: 26, b: 3 },
  GR:  { code: 'S22', name: '银灰', hex: '#E2E8F0', r: 226, g: 232, b: 240 },
  DG2: { code: 'S23', name: '质感深灰', hex: '#475569', r: 71, g: 85, b: 105 },
  C:   { code: 'S24', name: '薄荷青', hex: '#06B6D4', r: 6, g: 182, b: 212 }
};

function buildMatrix(rows, map) {
  return rows.map(r => r.split('').map(char => map[char] || null));
}

export const ALL_PATTERNS = [
  // 1. 潮流顶流 IP
  {
    id: 'kuromi-goth',
    title: '库洛米 (Kuromi 暗黑萌系)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★★',
    desc: '三丽鸥高人气顶流库洛米，经典黑色小恶魔头套与粉色骷髅标志。',
    matrix: buildMatrix([
      "....KK................KK....",
      "...KKKK..............KKKK...",
      "..KDVVDK............KDVVDK..",
      "..KDVVDK............KDVVDK..",
      "..KDVVDK............KDVVDK..",
      "...KKKKKKKKKKKKKKKKKKKKKK...",
      "..KKDVVVVVVVVVVVVVVVVVVDKK..",
      ".KKDVVVVVVVVVVVVVVVVVVVVDKK.",
      ".KDVVVVVVVVVVVVVVVVVVVVVVDK.",
      ".KDVVVVVVVVVPPPPVVVVVVVVVDK.",
      ".KDVVVVVVVVPPPPPPVVVVVVVVDK.",
      ".KDVVVVVVVVKPKKPKVVVVVVVVDK.",
      ".KDVVVVVVVVPPPPPPVVVVVVVVDK.",
      ".KDVVVVVVVVVPPPPVVVVVVVVVDK.",
      ".KDVVVVVVWWWWWWWWWWVVVVVVDK.",
      ".KDVVVWWWWWWWWWWWWWWWWVVVDK.",
      ".KKVWWWWWWWWWWWWWWWWWWWWVKK.",
      "..KWWWWKKWWWWWWWWKKWWWWWK...",
      "..KWWWWKKWWWWWWWWKKWWWWWK...",
      "..KWWWWWWWWWWWWWWWWWWWWWK...",
      "..KWWWWWWWWWWWWWWWWWWWWWK...",
      "..KWWWWWWWWPPPPWWWWWWWWWK...",
      "...KWWWWWWWWWWWWWWWWWWWK....",
      "....KKWWWWWWWWWWWWWWWKK.....",
      "......KKKKKKKKKKKKKKK......."
    ], {
      'K': C.K, 'V': C.V, 'DV': C.DV, 'P': C.P, 'W': C.W, 'LP': C.LP
    })
  },
  {
    id: 'chiikawa-happy',
    title: '吉伊卡哇 (Chiikawa 治愈大哭)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '全网爆火的小可爱吉伊卡哇，水汪汪大眼睛与粉嫩腮红。',
    matrix: buildMatrix([
      "......KKKKKKKKKKKK......",
      "....KKWWWWWWWWWWWWKK....",
      "...KWWWWWWWWWWWWWWWWK...",
      "..KWWKKWWWWWWWWWWKKWWK..",
      ".KWWWWKKWWWWWWWWKKWWWWK.",
      ".KWWWWWWWWWWWWWWWWWWWWK.",
      "KWWWWWWWWWWWWWWWWWWWWWWK",
      "KWWKKKWWWWWWWWWWWWKKKWWK",
      "KWKKKKKWWWWWWWWWWKKKKKWK",
      "KWKKKKKWWWWWWWWWWKKKKKWK",
      "KWWKKKWWWWKKKKWWWWKKKWWK",
      "KWWWWWWWWKKKKKKWWWWWWWWK",
      "KWLPPLPWWWWWWWWWWLPPLPWK",
      "KWLPPLPWWWWWWWWWWLPPLPWK",
      ".KWWWWWWWWWWWWWWWWWWWWK.",
      "..KWWWWWWWWWWWWWWWWWWK..",
      "...KKWWWWWWWWWWWWWWKK...",
      "....KWWWWWWWWWWWWWWK....",
      "...KWWWWWWWWWWWWWWWWK...",
      "...KKKKKKKKKKKKKKKKKK..."
    ], {
      'K': C.K, 'W': C.W, 'LP': C.LP, 'P': C.P
    })
  },
  {
    id: 'cinnamoroll',
    title: '大耳狗·玉桂狗 (Cinnamoroll)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '三丽鸥人气王大耳狗，天蓝色眼睛与如云朵般的大耳朵。',
    matrix: buildMatrix([
      "KK..........................KK",
      "KWWK......................KWWK",
      "KWWWK....................KWWWK",
      ".KWWWKK................KKWWWK.",
      "..KWWWWKKKKKKKKKKKKKKKKWWWWK..",
      "..KWWWWWWWWWWWWWWWWWWWWWWWWK..",
      "..KWWWWWWWWWWWWWWWWWWWWWWWWK..",
      "...KWWWWBBWWWWWWWWBBWWWWWWK...",
      "...KWWWWBBWWWWWWWWBBWWWWWWK...",
      "...KWLPWWWWWWWWWWWWWWLPWWK....",
      "...KWLPWWWWWWWWWWWWWWLPWWK....",
      "....KWWWWWWWWWWWWWWWWWWWWK....",
      ".....KKWWWWWWWWWWWWWWWWKK.....",
      ".......KKKKKKKKKKKKKKKK......."
    ], {
      'K': C.K, 'W': C.W, 'B': C.B, 'LP': C.LP, 'P': C.P
    })
  },

  // 2. 热门游戏 & 动漫大作
  {
    id: 'wukong-head',
    title: '黑神话：悟空 (Black Myth Wukong)',
    category: 'games',
    tag: '黑神话',
    difficulty: '★★★★★',
    desc: '国产 3A 现象级神作齐天大圣，凤翅紫金冠与威严神韵。',
    matrix: buildMatrix([
      "...........RRRRRRRR...........",
      ".........RRRRRRRRRRRR.........",
      ".......KKDYDYDYDYDYDYKK.......",
      "......KDYYYYYYYYYYYYYYDK......",
      ".....KDYYYYYKKKKYYYYYYYDK.....",
      "....KDYYYYKKDMDKKYYYYYYYDK....",
      "....KDYYYKKDMMDMKKYYYYYYDK....",
      "....KDYYKDMMMMMMDDKYYYYYDK....",
      ".....KKKDMMMMMMMMDKKKKKK......",
      ".....KSSMMMSSSSMMMSSK.........",
      "....KSSSKKSSKKSSKKSSSK........",
      "...KSSSSKKSSKKSSKKSSSSK.......",
      "...KSSSSSSSSSSSSSSSSSSK.......",
      "...KSSSSSSSDDDDSSSSSSSK.......",
      "....KSSSSSDRRRRDSSSSSK........",
      "....KMMSSSSDRRDSSSSMMK........",
      ".....KMMMMSSSSSSMMMMK.........",
      "......KKMMMMMMMMMMKK..........",
      "........KKKKKKKKKK............"
    ], {
      'R': C.R, 'D': C.DY, 'Y': C.Y, 'K': C.K, 'DM': C.DM, 'M': C.M, 'S': C.S
    })
  },
  {
    id: 'paimon-genshin',
    title: '派蒙 (原神 Genshin Impact)',
    category: 'games',
    tag: '原神IP',
    difficulty: '★★★★★',
    desc: '提瓦特最佳向导“应急食品”派蒙，经典星空发饰与金黄眼眸。',
    matrix: buildMatrix([
      ".........KKKKKKKKKKK..........",
      ".......KKWWWWWWWWWWWKK........",
      "......KWWWWWWWWWWWWWWWK.......",
      ".....KWWWWWWWWWWWWWWWWWK......",
      "....KWWWWKDBKKDBKWWWWWWWK.....",
      "...KWWWWWWWWWWWWWWWWWWWWWK....",
      "...KWWWSSSSSSSSSSSSSsWWWWK....",
      "..KWWSSKKSSSSSSSKKSSSSSWWK...",
      "..KWSSKYYKSSSKSSKYYKSSSSWK...",
      "..KWSSKYYKSSSKSSKYYKSSSSWK...",
      "..KWSSSSSSSSSSSSSSSSSSSWWK...",
      "..KWWSSSLPPSSSSSSLPSSSSWWK...",
      "...KWWSSSSSRRRRRSSSSSSWWK....",
      "....KWWWSSSSSSSSSSSSSWWWK.....",
      ".....KKWWWWWWWWWWWWWKKK......",
      "......KNBWWWWWWWWWWNBK........",
      ".....KNBWWWWWWWWWWWWNBK.......",
      ".....KKKKKKKKKKKKKKKKKK......."
    ], {
      'K': C.K, 'W': C.W, 'D': C.DB, 'B': C.B, 'S': C.S, 'Y': C.Y, 'LP': C.LP, 'R': C.R, 'NB': C.NB
    })
  },
  {
    id: 'mc-diamond-sword',
    title: '我的世界·钻石剑 (MC Sword)',
    category: 'games',
    tag: '经典游戏',
    difficulty: '★★★★☆',
    desc: '沙盒顶流《Minecraft》经典附魔钻石宝剑，像素硬核必备。',
    matrix: buildMatrix([
      "...............KC.",
      "..............KCBC",
      ".............KCBCK",
      "............KCBCK.",
      "...........KCBCK..",
      "..........KCBCK...",
      ".........KCBCK....",
      "........KCBCK.....",
      ".......KCBCK......",
      "......KCBCK.......",
      ".....KCBCK........",
      "K...KCBCK...K.....",
      "KCKKCBCKKKCK......",
      ".KCBCBCBCBCK......",
      "..KCBCKMKCK.......",
      "...KK.KMK.........",
      "......KMK.........",
      ".......KK........."
    ], {
      'K': C.K, 'C': C.C, 'B': C.B, 'M': C.M, 'W': C.W
    })
  },

  // 3. 世界杯足球巨星
  {
    id: 'messi-10',
    title: '球王梅西 (Messi 阿根廷10号)',
    category: 'football',
    tag: '世界杯球星',
    difficulty: '★★★★☆',
    desc: '蓝白阿根廷战袍，双手聆听欢呼的经典捧杯名场面。',
    matrix: buildMatrix([
      "......KKKKKK......",
      "....KKMMMMMMKK....",
      "...KMMMMMMMMMMK...",
      "..KMMMMMMMMMMMMK..",
      "..KSSSSSSSSSSSSK..",
      "..KSKKSKKSSKKSKK..",
      "..KSSSSSSSSSSSSK..",
      "..KSKMMSSSSMMKSK..",
      "..KSSMMMMMMMMSSK..",
      "...KSSSSSSSSSSK...",
      "....KMMMMMMMMK....",
      "...KBBWWBBWWBBK...",
      "..KKBBWWBBWWBBKK..",
      ".KSSBWWDBBDWWBSSK.",
      ".KSSBWDBKKBDWBSSK.",
      "..KKBBWDBBDWBBKK..",
      "....KWWWWWWWWK....",
      "....KDBBDBBDBK....",
      "....KDBB..BBDK....",
      "....KSSK..KSSK....",
      "....KKKK..KKKK...."
    ], {
      'K': C.K, 'W': C.W, 'B': C.B, 'D': C.DB, 'S': C.S, 'M': C.M, 'R': C.R
    })
  },
  {
    id: 'cr7-siu',
    title: 'C罗 (CR7 胜利狂欢)',
    category: 'football',
    tag: '世界杯球星',
    difficulty: '★★★★☆',
    desc: '葡萄牙标志性 7 号战袍，经典挥拳 SIU 庆祝动作。',
    matrix: buildMatrix([
      "......KKKKKK......",
      "....KKMMMMMMKK....",
      "...KMMMMMMMMMMK...",
      "..KSSSSSSSSSSSSK..",
      "..KSKKSKKSSKKSKK..",
      "..KSSSSSSSSSSSSK..",
      "..KSSSKKKKKKSSSK..",
      "...KSSSSSSSSSSK...",
      ".K..KMMMMMMMMK..K.",
      ".KSKKRRRRRRRRKKSK.",
      "KSSKRRRGGGRRRKSSK.",
      ".KSKRRGGWGGGRKSK..",
      "..KKRGGWWWGGRKK...",
      "...KRRRGGGRRRK....",
      "...KRRRRRRRRRK....",
      "...KGGGGGGGGGK....",
      "...KGGGK..KGGK....",
      "...KSSSK..KSSSK...",
      "...KRRRK..KRRRK...",
      "...KKKKK..KKKKK..."
    ], {
      'K': C.K, 'W': C.W, 'R': C.R, 'G': C.DG, 'S': C.S, 'M': C.M
    })
  },

  // 4. 治愈萌宠与动物
  {
    id: 'capybara-orange',
    title: '卡皮巴拉·顶橘子 (Capybara)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '全网超绝松弛感顶流卡皮巴拉，头顶一颗可爱小甜橘。',
    matrix: buildMatrix([
      ".......KK.........",
      "......KOOK........",
      "......KOOK........",
      ".......KK.........",
      "....KKMMMMKK......",
      "...KMMMMMMMMK.....",
      "..KMMMMMMMMMMK....",
      ".KMMKKMMMMKKMMK...",
      ".KMMKKMMMMKKMMK...",
      ".KMMMMMMMMMMMMK...",
      ".KMMMMKKKKMMMMK...",
      ".KMMMMMMMMMMMMK...",
      "..KMMMMMMMMMMK....",
      "..KMMMMMMMMMMK....",
      "..KMMMMMMMMMMK....",
      "..KKKKKKKKKKKK...."
    ], {
      'K': C.K, 'M': C.M, 'O': C.O, 'G': C.G, 'W': C.W
    })
  },
  {
    id: 'corgi-dog',
    title: '摇尾柯基 (Corgi Dog)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '治愈系大桃心柯基犬，圆滚滚的可爱小身躯。',
    matrix: buildMatrix([
      ".KK.....KK........",
      "KOOK...KOOK.......",
      "KOOOK.KOOOK.......",
      "KOOOOOOOOOOK......",
      "KOOKOKKOKOOK......",
      "KOOOOOOOOOOK......",
      ".KOOOWWOOOK.......",
      "..KOOPPOOK........",
      "...KKWWKK.........",
      "..KWWWWWWK........",
      ".KOOWWWWWOOK......",
      ".KOOOOOOOOOK......",
      ".KOOK..KOOK.......",
      "..KK....KK........"
    ], {
      'K': C.K, 'O': C.O, 'W': C.W, 'P': C.P
    })
  },

  // 5. 节日与美食
  {
    id: 'horse-2026',
    title: '2026 祥瑞金马 (马年特辑)',
    category: 'festival',
    tag: '2026特辑',
    difficulty: '★★★★★',
    desc: '2026马年吉祥物，昂首奔腾的祥瑞赤金小骏马。',
    matrix: buildMatrix([
      "......KKKK........",
      "....KKDYDYKK......",
      "...KDYYYDYDYK.....",
      "..KDYYYDYDYYK.....",
      ".KDYYKKDYDYYK.....",
      ".KDYYKKDYDYK......",
      ".KDYYYYYYDYK......",
      ".KDYYSSSSYYK......",
      "..KDYYYYYYKKKKKK..",
      "...KDYYYYYYYYYYDK.",
      "...KDYYDYDYYYYYDK.",
      "....KDYDYDYYYYYDK.",
      "....KDYDYDYYRRYDK.",
      "....KDYYYDYRWWYRDK",
      "....KDYYYDYRWWYRDK",
      "....KDYDYDYYRRYDK.",
      "....KDYKKDYKKYYDK.",
      "....KDYK.KDYK.KDK.",
      "....KDYK.KDYK.KDK.",
      "....KKKK.KKKK.KKK."
    ], {
      'K': C.K, 'Y': C.Y, 'D': C.DY, 'S': C.S, 'R': C.R, 'W': C.W
    })
  },
  {
    id: 'double-burger',
    title: '双层芝士巨无霸汉堡 (Burger)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '松软芝麻面包、香煎多汁肉饼、融化芝士与新鲜生菜。',
    matrix: buildMatrix([
      ".....OOOOOOOO.....",
      "...OOYOOYOOYOOO...",
      "..OOOOOOOOOOOOOO..",
      "..GGGGGGGGGGGGGG..",
      ".GG.GG.GG.GG.GG.G.",
      ".RRRRRRRRRRRRRRRR.",
      ".YYYYYYYYYYYYYYYY.",
      ".MMMMMMMMMMMMMMMM.",
      "..OOOOOOOOOOOOOO..",
      "....OOOOOOOOOO...."
    ], {
      'O': C.O, 'Y': C.Y, 'G': C.G, 'R': C.R, 'M': C.M
    })
  }
];
