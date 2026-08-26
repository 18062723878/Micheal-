// Artkal 标准 50 色号映射字典
export const C = {
  _: null, // 透明背景
  W: { code: 'S01', name: '纯白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  K: { code: 'S02', name: '纯黑', hex: '#18181B', r: 24, g: 24, b: 27 },
  R: { code: 'S03', name: '正红', hex: '#DC2626', r: 220, g: 38, b: 38 },
  DR: { code: 'S04', name: '暗红', hex: '#991B1B', r: 153, g: 27, b: 27 },
  P: { code: 'S05', name: '芭比粉', hex: '#EC4899', r: 236, g: 72, b: 153 },
  LP: { code: 'S06', name: '浅粉', hex: '#FBCFE8', r: 251, g: 207, b: 232 },
  LB: { code: 'S07', name: '天蓝', hex: '#38BDF8', r: 56, g: 189, b: 248 },
  B: { code: 'S08', name: '宝蓝', hex: '#2563EB', r: 37, g: 99, b: 235 },
  DB: { code: 'S09', name: '藏青', hex: '#1E3A8A', r: 30, g: 58, b: 138 },
  G: { code: 'S10', name: '草绿', hex: '#4ADE80', r: 74, g: 222, b: 128 },
  DG: { code: 'S11', name: '墨绿', hex: '#166534', r: 22, g: 101, b: 52 },
  LG: { code: 'S12', name: '嫩绿', hex: '#BBF7D0', r: 187, g: 247, b: 208 },
  Y: { code: 'S13', name: '明黄', hex: '#FACC15', r: 250, g: 204, b: 21 },
  DY: { code: 'S14', name: '金黄', hex: '#D97706', r: 217, g: 119, b: 6 },
  O: { code: 'S15', name: '活力橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  DO: { code: 'S16', name: '深橙', hex: '#EA580C', r: 234, g: 88, b: 12 },
  PU: { code: 'S17', name: '香芋紫', hex: '#C084FC', r: 192, g: 132, b: 252 },
  DPU: { code: 'S18', name: '深紫', hex: '#7E22CE', r: 126, g: 34, b: 206 },
  SK: { code: 'S19', name: '暖肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  BR: { code: 'S21', name: '摩卡棕', hex: '#A16207', r: 161, g: 98, b: 7 },
  DBR: { code: 'S22', name: '浓缩咖啡', hex: '#451A03', r: 69, g: 26, b: 3 },
  GR: { code: 'S24', name: '质感灰', hex: '#94A3B8', r: 148, g: 163, b: 184 },
  DGR: { code: 'S25', name: '碳深灰', hex: '#475569', r: 71, g: 85, b: 105 },
  CR: { code: 'S29', name: '奶黄', hex: '#FEF08A', r: 254, g: 240, b: 138 }
};

// 像素字符转换辅助函数
function parseArt(str, mapping = {}) {
  const map = {
    '.': C._,
    '_': C._,
    'W': C.W,
    'K': C.K,
    'R': C.R,
    'D': C.DR,
    'P': C.P,
    'p': C.LP,
    'B': C.B,
    'b': C.LB,
    'd': C.DB,
    'G': C.G,
    'g': C.LG,
    'M': C.DG,
    'Y': C.Y,
    'y': C.DY,
    'O': C.O,
    'o': C.DO,
    'V': C.PU,
    'v': C.DPU,
    'S': C.SK,
    'N': C.BR,
    'n': C.DBR,
    'H': C.GR,
    'h': C.DGR,
    'C': C.CR,
    ...mapping
  };

  const lines = str.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  return lines.map(line => line.split('').map(char => map[char] || C._));
}

// 50+ 精选手工高精度图纸数据库
export const ALL_PATTERNS = [
  // ================= 1. 热门动漫角色 =================
  {
    id: 'shinchan',
    title: '蜡笔小新 (Shin-chan)',
    category: 'anime',
    tag: '经典动漫',
    difficulty: '★★★★☆',
    desc: '标志性粗眉大眼、红衣黄短裤与圆滚滚大头。',
    matrix: parseArt(`
      ....KKKKKKKK....
      ..KKKKKKKKKKKK..
      .KKKKKKKKKKKKKK.
      .KKKKSSSSSSSSSKK
      KKKKSSSSSSSSSSSK
      KKKKKKKSSKKKSSSK
      .KKKKKKSSKKKSSSK
      ..KKKSSSSSSSSSSK
      ...KSSpSSSSPSSSK
      ...KSSSSSSSSSSSK
      ....KSSSRRRSSSK.
      ...KKRRRRRRRRKK.
      ..KRRRRRRRRRRRRK
      ..KRRRRRRRRRRRRK
      ...KYYYYYYYYYYK.
      ...KYYKYYYYKYYK.
      ....KK......KK..
    `)
  },
  {
    id: 'hellokitty',
    title: '凯蒂猫 (Hello Kitty)',
    category: 'anime',
    tag: '经典卡通',
    difficulty: '★★★☆☆',
    desc: '可爱的蝴蝶结白猫咪，经典三根胡须与黄鼻子。',
    matrix: parseArt(`
      .KK..........KK.
      KWWK.RRRRR..KWWK
      KWWWKRRRRRRKWWWK
      KWWWRRDDDDRRWWWK
      KWWWRRDDDDRRWWWK
      KWWWWKRRRRKWWWWK
      KWWWWWWWWWWWWWWK
      KWWKWWWWWWWWKWWK
      KKWKKWWWWWWKKWKK
      KWWWWWWWYWWWWWWK
      KKWKKWWWWWWKKWKK
      .KWWWWWWWWWWWWK.
      ..KKWWWWWWWWKK..
      ....KKKKKKKK....
    `)
  },
  {
    id: 'spongebob',
    title: '海绵宝宝 (SpongeBob)',
    category: 'anime',
    tag: '热门动漫',
    difficulty: '★★★★☆',
    desc: '大眼睛与红领带，拼豆界的顶流 IP。',
    matrix: parseArt(`
      ..KKKKKKKKKKKK..
      .KYYYYyYYYYyYYK.
      KYYKKKYYKKKYYYYK
      KYKbKKKYKbKYYYYK
      KYyKdKKYKdKYYyYK
      KYKKKKYYKKKKYYYK
      KYYyYYYYYYYYYYYK
      KYyKKKKKKKKKKyYK
      KYKWWKWWKWWKWKYK
      .KWWWWWWWWWWWWK.
      .KWWWRRWWWRRWWK.
      .KNNNRRRRRRNNNK.
      .KNNNNNNNNNNNNK.
      ..KKKKKKKKKKKK..
    `)
  },
  {
    id: 'meituan-mouse',
    title: '奶酪老鼠 (Meme Mouse)',
    category: 'anime',
    tag: '全网爆款',
    difficulty: '★★★☆☆',
    desc: '粉耳朵大眼睛，抱黄色奶酪块的经典小鼠。',
    matrix: parseArt(`
      .PPP........PPP.
      PLPPKKKKKKKKPLPP
      PLPKHHHHHHHHPLPK
      .PPKHHHHHHHHHKPP
      .KHHhKhhKhhHHHK.
      .KHHhWhhWhhHHHK.
      .KHHHhHHhHHHHHK.
      .KHHHHPPPHHHHHK.
      .KHHHHHKKHHHHHK.
      ..KHHHHHHHHHHHK.
      ..KHHHHHYYYYYHK.
      ..KHHHHHYyYYYHK.
      ..KHHppHYYYyYHK.
      ...KKKKKYYYYYKK.
    `)
  },
  {
    id: 'pikachu',
    title: '皮卡丘 (Pikachu)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★☆',
    desc: '黑尖长耳朵、红脸颊与闪电腮红。',
    matrix: parseArt(`
      KK............KK
      KYYK........KYYK
      KYYYK......KYYYK
      KYYYYK....KYYYYK
      .KYYYYKKKYYYYK..
      .KYYYYYYYYYYYK..
      .KYKYYYYYYKYYK..
      .KYWKKYYKWKYYK..
      .KYYKKYYKKYYYK..
      KRYYYYYYYYYYYRK.
      KRRYYYYKKYYYRRYK
      .KRYYYYKKYYYRKYK
      ..KYYYYYYYYYYK..
      ...KKKKKKKKKK...
    `)
  },
  {
    id: 'kuromi',
    title: '库洛米 (Kuromi)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★☆',
    desc: '黑色小恶魔耳朵与粉色骷髅标志。',
    matrix: parseArt(`
      KKK..........KKK
      KhhKK......KKhhK
      .KhhhKK..KKhhhK.
      .KhhhhhKKhhhhhK.
      ..KhhhhPPhhhhK..
      ..KhhhPPPPPhhK..
      .KKhhhPPhhhhKK.
      KWWKhhhhhhhKWWK
      KWWWWWWWWWWWWWWK
      KWWKhhWWWWKhhWWK
      KWWWhhWWWWWhhWWK
      KWWWWWWPWWWWWWWK
      .KWWWWWWWWWWWWK.
      ..KKKKKKKKKKKK..
    `)
  },
  {
    id: 'pochacco',
    title: '帕恰狗 (Pochacco)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★☆☆',
    desc: '垂耳纯真小狗，经典呆萌黑白搭配。',
    matrix: parseArt(`
      ..KKK......KKK..
      .KhhhK....KhhhK.
      .KhhhK....KhhhK.
      .KhhhK....KhhhK.
      ..KhhKKKKKKhhK..
      ..KKWWWWWWWWKK..
      .KWWWWWWWWWWWWK.
      KWWKhhWWWWKhhWWK
      KWWKhhWWWWKhhWWK
      KWWWWWWKKWWWWWWK
      KWWWWWKPPKWWWWWK
      .KWWWWWWWWWWWWK.
      ..KKWWWWWWWWKK..
      ....KKKKKKKK....
    `)
  },
  {
    id: 'mymelody',
    title: '美乐蒂 (My Melody)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★☆☆',
    desc: '戴粉色头巾的小白兔，右耳配小百花。',
    matrix: parseArt(`
      ..PPP......PPP..
      .PPPPP....PPPPP.
      .PPPPP....PPPPP.
      .PPPPPP..PPPPPP.
      ..PPPPPPPPPPPP..
      ..PPPPPYPPPPPP..
      .PPPPPYWWYPPPPP.
      PPPPPPPYWPPPPPPP
      PWWWWWWWWWWWWWPP
      PWKhhWWWWKhhWWPP
      PWKhhWWWWKhhWWPP
      PWWWWWWYWWWWWWPP
      .PWWWWWWWWWWWPP.
      ..PPPPPPPPPPPP..
    `)
  },
  {
    id: 'mario',
    title: '马里奥大叔 (Mario)',
    category: 'anime',
    tag: '任天堂',
    difficulty: '★★★★☆',
    desc: '经典红帽子、大胡子与蓝色背带裤。',
    matrix: parseArt(`
      ....RRRRRRRR....
      ...RRRRRRRRRRR..
      ...NNNSSKSSSS...
      ..NSNSKSSSKSS...
      ..NSNNSSKSSSS...
      ..NNSSSSKKKK....
      ....SSSSSSSS....
      ...RRRBRRRRR....
      ..RRRBRRBRRRR...
      .RRRRBBBBBRRRR..
      .SSSBBYBBYBSSS..
      .SSSSBBBBBBSS...
      .SSBBBBBBBBBS...
      ...BBB....BBB...
      ..NNNN...NNNN...
    `)
  },
  {
    id: 'kirby',
    title: '星之卡比 (Kirby)',
    category: 'anime',
    tag: '任天堂',
    difficulty: '★★★☆☆',
    desc: '粉萌圆球身体，深蓝大眼与标志性腮红。',
    matrix: parseArt(`
      ....PPPPPPPP....
      ..PPPPPPPPPPPP..
      .PPPPPPPPPPPPPP.
      PPPPdKPPPPdKPPPP
      PPPddKPPPPddKPPP
      PPPbKKPPPPbKKPPP
      PPPppPPPPPPppPPP
      PPPPPPPPPPPPPPPP
      PPPPPPPKKPPPPPPP
      PPPPPPKRRKPPPPPP
      .PPPPPPKKPPPPPP.
      .RRRRRPPPPRRRRR.
      RRRRRRRPPRRRRRRR
      .RRRRR....RRRRR.
    `)
  },
  {
    id: 'doraemon',
    title: '哆啦A梦 (Doraemon)',
    category: 'anime',
    tag: '经典日漫',
    difficulty: '★★★★☆',
    desc: '蓝胖子圆圆大脸、红鼻子与胸前金黄铃铛。',
    matrix: parseArt(`
      ....BBBBBBBB....
      ..BBBBBBBBBBBB..
      .BBKKKKWWKKKKBB.
      .BBKWWKWWKWWKBB.
      BBBKWWKWWKWWKBBB
      BBBKWWKWWKWWKBBB
      BBBKKKKWWKKKKBBB
      BBWWWWWRRWWWWWBB
      BBWWWWWKKWWWWWBB
      BBWWWWWWWWWWWWBB
      .BWWWWWWWWWWWWB.
      ..RRRRRRRRRRRR..
      ...KKKYYYYKKK...
      .....KYYYYK.....
    `)
  },
  {
    id: 'chiikawa',
    title: '吉伊卡哇 (Chiikawa)',
    category: 'anime',
    tag: '顶流萌物',
    difficulty: '★★★☆☆',
    desc: '泪汪汪无辜大眼睛，治愈系纯白小可爱。',
    matrix: parseArt(`
      ..KK........KK..
      .KWWK......KWWK.
      .KWWWKKKKKKWWWK.
      KWWWWWWWWWWWWWWK
      KWWKhhWWWWKhhWWK
      KWWKhhWWWWKhhWWK
      KWWWWWWWWWWWWWWK
      KWWpWWKKKKWWpWWK
      KWWWpWKKKKWpWWWK
      KWWWWWWWWWWWWWWK
      .KWWWWWWWWWWWWK.
      ..KKWWWWWWWWKK..
      ....KKKKKKKK....
    `)
  },

  // ================= 2. 名胜地标 & 自然建筑 =================
  {
    id: 'oriental-pearl',
    title: '上海东方明珠 (Oriental Pearl)',
    category: 'architecture',
    tag: '现代地标',
    difficulty: '★★★★☆',
    desc: '标志性大小粉紫明珠球体、高耸天线与下托斜撑立柱。',
    matrix: parseArt(`
      .......HH.......
      .......HH.......
      .......HH.......
      ......PPPP......
      .....PPvvPP.....
      .....PPvvPP.....
      ......PPPP......
      .......HH.......
      .......HH.......
      ......hhhh......
      .....PPPPPP.....
      ....PPvvvvPP....
      ....PPvvvvPP....
      .....PPPPPP.....
      ....hh.hh.hh....
      ...hh..hh..hh...
      ..Hh...hh...hH..
      .HHHHHHHHHHHHHH.
    `)
  },
  {
    id: 'eiffel-tower',
    title: '巴黎埃菲尔铁塔 (Eiffel Tower)',
    category: 'architecture',
    tag: '世界地标',
    difficulty: '★★★★★',
    desc: '镂空经典铁塔身、塔尖避雷针与下层圆拱底座。',
    matrix: parseArt(`
      .......HH.......
      .......HH.......
      ......hhhh......
      ......hhhh......
      .....HHHHHH.....
      .....HHHHHH.....
      ....hhhhhhhh....
      ....hDGRhDGR....
      ...HHHHHHHHHH...
      ...HhHh..HhHh...
      ..HhhH....HhhH..
      ..HhH......HhH..
      .HhH........HhH.
      HHHH........HHHH
      HHHH........HHHH
    `)
  },
  {
    id: 'yellow-crane-tower',
    title: '武汉黄鹤楼 (Yellow Crane)',
    category: 'architecture',
    tag: '名胜古迹',
    difficulty: '★★★★★',
    desc: '金黄琉璃飞檐、红柱朱门重檐叠落的江南名楼。',
    matrix: parseArt(`
      .......YY.......
      ......YYYY......
      ....YYYYYYYY....
      ...YYYYYYYYYY...
      .YYYYYYYYYYYYYY.
      .yYyYyYyYyYyYyY.
      ..DRR.RDRDR.RRD.
      ..DRR.KKKKK.RRD.
      .YYYYYYYYYYYYYY.
      .yYyYyYyYyYyYyY.
      .DRR.DRRRRRD.RRD
      .DRR.KKKKKKK.RRD
      YYYYYYYYYYYYYYYY
      yYyYyYyYyYyYyYyY
      DRRRR.KKKKK.RRRD
      HHHHHHHHHHHHHHHH
    `)
  },
  {
    id: 'great-wall',
    title: '万里长城敌楼 (Great Wall)',
    category: 'architecture',
    tag: '世界奇迹',
    difficulty: '★★★★☆',
    desc: '垛口城墙、瞭望拱门与巍峨依山烽火台。',
    matrix: parseArt(`
      .H.H.H.H.H.H.H..
      .HHHHHHHHHHHHH..
      .HHHHHHHHHHHHH..
      .Hh.hHh.hHh.hH..
      .Hh.hHh.hHh.hH..
      .HHHHHHHHHHHHH..
      HHHHHHHHHHHHHHH.
      H.H.H.H...H.H.H.
      HHHHHHH...HHHHHH
      Hh.hHhH...Hh.hHh
      HHHHHHH...HHHHHH
      MGGMMGGMMGGMMGGM
      MMGGMMGGMMGGMMGG
    `)
  },
  {
    id: 'fuji-sakura',
    title: '富士山与樱花 (Mt. Fuji)',
    category: 'architecture',
    tag: '自然风景',
    difficulty: '★★★★☆',
    desc: '雪顶火山、蓝天红日与烂漫粉色樱花枝。',
    matrix: parseArt(`
      bbbbbbbRRRbbPpp.
      bbbbbbRRRRRbPpPN
      bbbbbbRRRRRbNPpN
      bbbbbWWWWbbPNPp.
      bbbbWWWWWWbNP...
      bbbWWbWWbWWN....
      bbWWBBWWBBWW....
      bBBBBBBBBBBBB...
      BBBdBBBdBBBdBBb.
      GGGGGGGGGGGGGGGG
      MMMMMMMMMMMMMMMM
    `)
  },
  {
    id: 'torii-gate',
    title: '严岛水上鸟居 (Torii Gate)',
    category: 'architecture',
    tag: '东方美学',
    difficulty: '★★★☆☆',
    desc: '经典朱红大鸟居神木，横跨碧波水面。',
    matrix: parseArt(`
      .RRRRRRRRRRRRRR.
      ..DDDDDDDDDDDD..
      ...RRRRRRRRRR...
      ...DD......DD...
      .RRRRRRRRRRRRRR.
      ...RR......RR...
      ...RR......RR...
      ...RR......RR...
      ...RR......RR...
      ...KK......KK...
      ..bbbbbbbbbbbb..
      .bbBBbbBBbbBBbb.
    `)
  },
  {
    id: 'forbidden-city',
    title: '故宫角楼暮色 (Palace)',
    category: 'architecture',
    tag: '古建精粹',
    difficulty: '★★★★★',
    desc: '九梁十八柱七十二条脊，宫廷琉璃金瓦。',
    matrix: parseArt(`
      .......yY.......
      .....YYYYYY.....
      ....YYYYYYYY....
      ...yYyYyyYyYy...
      ..DRRDDRRDDRRD..
      .YYYYYYYYYYYYYY.
      .yYyYyYyYyYyYyY.
      .DR.RD.KK.DR.RD.
      YYYYYYYYYYYYYYYY
      yYyYyYyYyYyYyYyY
      DRRRRDDKKDDDDDDR
      HHHHHHHHHHHHHHHH
    `)
  },
  {
    id: 'pisa-tower',
    title: '比萨斜塔 (Tower of Pisa)',
    category: 'architecture',
    tag: '世界奇观',
    difficulty: '★★★★☆',
    desc: '精美白色大理石柱廊，斜立地面的奇迹。',
    matrix: parseArt(`
      ..........hWh...
      .........hWWWh..
      ........h.h.h.h.
      .......hWWWWWWWh
      ......h.h.h.h.h.
      .....hWWWWWWWh..
      ....h.h.h.h.h...
      ...hWWWWWWWh....
      ..h.h.h.h.h.....
      .hWWWWWWWh......
      .h.h.h.h........
      GGGGGGGGGGGGGGGG
    `)
  },

  // ================= 3. 萌宠与各类动物 =================
  {
    id: 'shiba-inu',
    title: '呆萌柴犬 (Shiba Inu)',
    category: 'pets',
    tag: '萌犬世界',
    difficulty: '★★★☆☆',
    desc: '三角形尖耳朵、白眉毛与吐舌头微笑。',
    matrix: parseArt(`
      .NN........NN.
      KNNK......KNNK
      KNNNK....KNNNK
      KNNNNKKKKNNNNK
      KNNWNNNNNNWNNK
      KNWKWNNNNWKWNK
      KNNWNNNNNNWNNK
      KNWWWWKKWWWWNK
      .KNWWKKKKWWNK.
      ..KWWKPPKWWK..
      ...KKWWWWKK...
      .....KKKK.....
    `)
  },
  {
    id: 'corgi',
    title: '柯基犬 (Corgi)',
    category: 'pets',
    tag: '萌犬世界',
    difficulty: '★★★☆☆',
    desc: '大耳朵与从额头通到鼻尖的白斑。',
    matrix: parseArt(`
      .OO........OO.
      KOOK......KOOK
      KOOOK....KOOOK
      KOOOOKKKKOOOOK
      KOOOWWWWWWOOOK
      KOWKKWWWWKKWOK
      KOWKWOWWOKWWOK
      KOWWWKKKKWWWOK
      .KWWWKPPKWWWK.
      ..KWWWWWWWWK..
      ....KKKKKK....
    `)
  },
  {
    id: 'panda',
    title: '国宝大熊猫 (Giant Panda)',
    category: 'pets',
    tag: '国宝萌宠',
    difficulty: '★★★☆☆',
    desc: '黑眼圈、黑耳朵与手中抱着的小嫩竹子。',
    matrix: parseArt(`
      .KK........KK.
      KhhK......KhhK
      KhhhKKKKKKhhhK
      .KWWWWWWWWWWK.
      KWWKhhWWKhhWWK
      KWWKhhWWKhhWWK
      KWWWWWWWWWWWWK
      KWWWWWKKWWWWWK
      .KWWWWPPWWWWK.
      ..KWWWWWWWWK..
      ..KWWWWWWWWK..
      .GMG.KK..KK...
      .GMG..........
    `)
  },
  {
    id: 'koi-fish',
    title: '开运锦鲤金鱼 (Lucky Koi)',
    category: 'pets',
    tag: '海洋水族',
    difficulty: '★★★★☆',
    desc: '飘逸灵动的大鱼尾、红白相间鱼鳞。',
    matrix: parseArt(`
      ........RRRR....
      .......RRDRRR...
      ......RRRDRRRR..
      ....KWRRRRRRRR..
      ...KWWWRRRRRRRR.
      ..KWWWWRRRRRRRR.
      ...KWWRRRRRRRR..
      ....RRRRRRRR....
      ...RRRR.RRRR....
      ..RRR.....RRR...
      .RR.........RR..
    `)
  },
  {
    id: 'kingfisher',
    title: '灵动翠鸟 (Kingfisher)',
    category: 'pets',
    tag: '鸟类飞羽',
    difficulty: '★★★★☆',
    desc: '长尖黑嘴、鲜橙色肚皮与翠蓝羽毛。',
    matrix: parseArt(`
      ..........KK....
      ........KKKK....
      .......KbbK.....
      ......KbbbK.....
      .....KbbdK......
      .....KOOK.......
      ....KOOOKb......
      ...KOOOOKbb.....
      ...KOOOKbb......
      ....KOKbb.......
      .....KK.........
    `)
  },
  {
    id: 'capybara',
    title: '顶橘卡皮巴拉 (Capybara)',
    category: 'pets',
    tag: '治愈系',
    difficulty: '★★★☆☆',
    desc: '头顶一颗小蜜橘，沉稳呆萌的水豚。',
    matrix: parseArt(`
      .......g........
      ......OOO.......
      .....OOOOO......
      ...KKNNNNNKK....
      ..KNNNNNNNNNK...
      ..KNNKWNNKWNK...
      ..KNNNNNNNNNK...
      ..KNNNnNNnNNK...
      ..KNNNnnnnNNK...
      ...KNNNNNNNK....
      ...KNNNNNNNK....
      ....KK...KK.....
    `)
  },
  {
    id: 'ragdoll-cat',
    title: '布偶猫 (Ragdoll Cat)',
    category: 'pets',
    tag: '猫星人',
    difficulty: '★★★☆☆',
    desc: '重点色深毛、粉红小耳朵与深邃蓝眼睛。',
    matrix: parseArt(`
      .hh........hh.
      KhhK......KhhK
      KhhhKKKKKKhhhK
      .KhhWWWWWWKhK.
      KhhBKhhWWKBhhK
      KhhBKhhWWKBhhK
      KhhWWWWWWWWWhK
      .KhhWWPWWWhhK.
      ..KWhhKKWhhK..
      ...KWWWWWWK...
      ....KKKKKK....
    `)
  },
  {
    id: 'penguin',
    title: '南极小企鹅 (Baby Penguin)',
    category: 'pets',
    tag: '极地萌物',
    difficulty: '★★★☆☆',
    desc: '圆滚黑白身子、黄色脚蹼与小嘴巴。',
    matrix: parseArt(`
      ....KKKKKK....
      ...KhhhhhhK...
      ..KhhWWWWWhK..
      ..KhWKhWKhWhK.
      ..KhWWWWWWWhK.
      ..KhhWYYWhhhK.
      .KKhhWWWWWhhKK
      KhKhWWWWWWWhhK
      KhKhWWWWWWWhhK
      .KKhWWWWWWWhK.
      ...KYYYYYYK...
      ...KYY..YYK...
    `)
  },

  // ================= 4. 美食甜品 & 人气饮品 =================
  {
    id: 'boba-tea',
    title: '黑糖珍珠奶茶 (Boba Tea)',
    category: 'food',
    tag: '人气饮品',
    difficulty: '★★★☆☆',
    desc: '透明杯、斜插粗吸管与底部颗颗黑珍珠。',
    matrix: parseArt(`
      ......RR........
      .....RR.........
      ...KKWWKK.......
      ..KWWWWWWK......
      ..KSSSSSSK......
      ..KSSSSSSK......
      ..KSSSSSSK......
      ..KSKSSKSK......
      ..KSSKKSSK......
      ..KKKKKKKK......
      ...KKKKKK.......
    `)
  },
  {
    id: 'burger',
    title: '双层芝士汉堡 (Cheeseburger)',
    category: 'food',
    tag: '快餐美食',
    difficulty: '★★★★☆',
    desc: '芝麻面包顶、生菜、红番茄、熔岩芝士与牛肉饼。',
    matrix: parseArt(`
      ....SSSSSSSS....
      ..SSNWSSNWSSNS..
      .SSSSSSSSSSSSSS.
      .RRRRRRRRRRRRRR.
      .GLGLGLGLGLGLGL.
      .YYYYYYYYYYYYYY.
      ..YYYY.YYYY.YY..
      .nnnnnnnnnnnnnn.
      .SSSSSSSSSSSSSS.
      ..SSSSSSSSSSSS..
    `)
  },
  {
    id: 'pizza-slice',
    title: '意式披萨切片 (Pizza Slice)',
    category: 'food',
    tag: '西式简餐',
    difficulty: '★★★☆☆',
    desc: '金黄拉丝芝士、香脆饼边与红色意式腊肠圆片。',
    matrix: parseArt(`
      .NNNNNNNNNNNNN..
      .NYYYYYYYYYYYN..
      ..NYYRRRYYYYN...
      ...NYRRRYYYN....
      ....NYYYYYN.....
      .....NYRRYN.....
      ......NYYYN.....
      .......NYN......
      ........N.......
    `)
  },
  {
    id: 'icecream-cone',
    title: '草莓甜筒 (Ice Cream)',
    category: 'food',
    tag: '冷饮甜品',
    difficulty: '★★★☆☆',
    desc: '粉色旋转草莓冰淇淋球配经典华夫蛋筒。',
    matrix: parseArt(`
      .....PPPP......
      ...PPPPPPPP....
      ..PpPpPpPpPP...
      ..PPPPPPPPPP...
      ..PPPPPPPPPP...
      ...NNNNNNNN....
      ....NNNNNN.....
      ....NyNyNN.....
      .....NNNN......
      .....NyNN......
      ......NN.......
    `)
  },
  {
    id: 'donut',
    title: '草莓糖霜甜甜圈 (Donut)',
    category: 'food',
    tag: '烘焙甜点',
    difficulty: '★★★☆☆',
    desc: '粉色草莓糖霜、彩色糖针与中间圆孔。',
    matrix: parseArt(`
      ....PPPPPPPP....
      ..PPYPPWPPBPPP..
      .PPPPPPPPPPPPPP.
      .PPWP..KK..PGPP.
      PPPPP.K__K.PPPPP
      PPPPP.K__K.PPPPP
      .PBPW..KK..PYPP.
      .NNNNNNNNNNNNNN.
      ..NNNNNNNNNNNN..
      ....NNNNNNNN....
    `)
  },
  {
    id: 'salmon-sushi',
    title: '三文鱼握寿司 (Salmon Sushi)',
    category: 'food',
    tag: '精致日料',
    difficulty: '★★★☆☆',
    desc: '鲜橙带白条纹的三文鱼厚切搭白米饭。',
    matrix: parseArt(`
      ...OOOOOOOOO....
      ..OOWOOWOOWOO...
      .OOOOOOOOOOOOO..
      .OOWOOWOOWOOWO..
      .OOOOOOOOOOOOO..
      ..KWWWWWWWWK....
      .KWWWWWWWWWWK...
      .KWWWWWWWWWWK...
      ..KKKKKKKKKK....
    `)
  },
  {
    id: 'french-fries',
    title: '香脆红盒薯条 (French Fries)',
    category: 'food',
    tag: '快餐经典',
    difficulty: '★★★☆☆',
    desc: '金黄根根分明的长薯条与经典红包装盒。',
    matrix: parseArt(`
      ..YY..YY..YY....
      ..YY..YY..YY....
      ..YYYYYYYYYY....
      ..YYYYYYYYYY....
      ..RRRRRRRRRR....
      ..RRRYYYYYRR....
      ...RRRYYYRR.....
      ...RRRRRRRR.....
      ....RRRRRR......
    `)
  },

  // ================= 5. 节日庆典 & 民俗特色 =================
  {
    id: 'cny-lion',
    title: '新春吉祥醒狮 (Lion Dance)',
    category: 'festival',
    tag: '传统民俗',
    difficulty: '★★★★★',
    desc: '金红祥瑞醒狮头，威风凛凛大眼睛。',
    matrix: parseArt(`
      ..yYYy..yYYy..
      .yRRRRyyRRRRy.
      yRWWWWyWWWWyRy
      yRWKKWyWKKWyRy
      yRWbKWyWbKWyRy
      .yRWWyRRyWWyR.
      .yyYYyWWyYYyy.
      WWWRRRRRRRRWWW
      WpWWKKKKKKWWpW
      WWWRWWWWWWWRWW
      ..yRRRRRRRRy..
      ..yyYYYYYYyy..
    `)
  },
  {
    id: 'xmas-tree',
    title: '发光圣诞树 (Xmas Tree)',
    category: 'festival',
    tag: '节日装扮',
    difficulty: '★★★★☆',
    desc: '顶端金黄大星，绿树层上缀红蓝彩灯珠。',
    matrix: parseArt(`
      ......YY......
      .....YYYY.....
      ......GG......
      .....GLGG.....
      ....GLGRGG....
      ...GLGGGGGG...
      ..GLGBGGYGGG..
      .GLGGGGGGGPRG.
      .MMMMMMMMMMMM.
      .....nNNn.....
      ....RR..BB....
    `)
  },
  {
    id: 'red-lantern',
    title: '元宵喜庆红灯笼 (Red Lantern)',
    category: 'festival',
    tag: '传统民俗',
    difficulty: '★★★☆☆',
    desc: '金色提梁、饱满红绸缎与底部摇曳金穗。',
    matrix: parseArt(`
      ......yy......
      ....yyyyyy....
      ...RRRRRRRR...
      ..RRyRRRRyRR..
      ..RRyRRRRyRR..
      ..RRyRRRRyRR..
      ...RRRRRRRR...
      ....yyyyyy....
      ......YY......
      ......YY......
      .....YYYY.....
    `)
  },
  {
    id: 'pumpkin-lantern',
    title: '万圣节南瓜灯 (Jack-o-Lantern)',
    category: 'festival',
    tag: '趣味派对',
    difficulty: '★★★☆☆',
    desc: '绿瓜蒂、橙色条纹与发光镂空搞怪笑脸。',
    matrix: parseArt(`
      ......GG......
      ....OOOOOO....
      ..OOoOOoOOoO..
      .OOoKooKoOoOO.
      .OOoKooKoOoOO.
      .OOoooKKoooOO.
      .OOoKWWKWKoOO.
      ..OOoKKKKooO..
      ....OOOOOO....
    `)
  }
];
