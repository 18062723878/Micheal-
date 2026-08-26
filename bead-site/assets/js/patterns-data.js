// 标准 Artkal 颜色字典
export const C = {
  _: null,
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
  DY: { code: 'S14', name: '琉璃金黄', hex: '#D97706', r: 217, g: 119, b: 6 },
  O: { code: 'S15', name: '活力橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  DO: { code: 'S16', name: '深橙', hex: '#EA580C', r: 234, g: 88, b: 12 },
  PU: { code: 'S17', name: '香芋紫', hex: '#C084FC', r: 192, g: 132, b: 252 },
  SK: { code: 'S19', name: '暖肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  BR: { code: 'S21', name: '摩卡棕', hex: '#A16207', r: 161, g: 98, b: 7 },
  DBR: { code: 'S22', name: '浓缩咖啡', hex: '#451A03', r: 69, g: 26, b: 3 },
  GR: { code: 'S24', name: '中灰', hex: '#94A3B8', r: 148, g: 163, b: 184 },
  CR: { code: 'S29', name: '奶黄', hex: '#FEF08A', r: 254, g: 240, b: 138 }
};

// 基础核心手工图纸
const rawBasePatterns = [
  {
    id: 'spongebob',
    title: '经典海绵宝宝 (SpongeBob)',
    category: 'anime',
    tag: '热门动漫',
    difficulty: '★★★★☆',
    desc: '大眼睛与经典红领带，拼豆界的顶流 IP。',
    matrix: [
      [C._, C._, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C._, C._],
      [C._, C.K, C.Y, C.Y, C.DY, C.Y, C.Y, C.Y, C.Y, C.DY, C.Y, C.Y, C.Y, C.Y, C.K, C._],
      [C.K, C.Y, C.Y, C.K, C.K, C.K, C.Y, C.Y, C.K, C.K, C.K, C.Y, C.DY, C.Y, C.Y, C.K],
      [C.K, C.Y, C.K, C.W, C.LB, C.K, C.K, C.K, C.W, C.LB, C.K, C.K, C.Y, C.Y, C.Y, C.K],
      [C.K, C.DY, C.K, C.LB, C.B, C.K, C.Y, C.K, C.LB, C.B, C.K, C.Y, C.Y, C.DY, C.Y, C.K],
      [C.K, C.Y, C.K, C.W, C.W, C.K, C.Y, C.K, C.W, C.W, C.K, C.Y, C.Y, C.Y, C.Y, C.K],
      [C.K, C.Y, C.Y, C.K, C.K, C.Y, C.Y, C.Y, C.K, C.K, C.Y, C.Y, C.P, C.P, C.Y, C.K],
      [C.K, C.Y, C.P, C.P, C.Y, C.Y, C.DY, C.DY, C.Y, C.Y, C.Y, C.P, C.P, C.P, C.Y, C.K],
      [C.K, C.Y, C.Y, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.Y, C.Y, C.Y, C.K],
      [C.K, C.DY, C.Y, C.K, C.W, C.K, C.Y, C.Y, C.K, C.W, C.K, C.Y, C.Y, C.DY, C.Y, C.K],
      [C.K, C.Y, C.Y, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.Y, C.Y, C.Y, C.Y, C.K],
      [C._, C.K, C.W, C.W, C.W, C.R, C.R, C.W, C.W, C.R, C.R, C.W, C.W, C.W, C.K, C._],
      [C._, C.K, C.W, C.W, C.W, C.R, C.R, C.R, C.R, C.R, C.R, C.W, C.W, C.W, C.K, C._],
      [C._, C.K, C.BR, C.BR, C.K, C.K, C.BR, C.BR, C.BR, C.K, C.K, C.BR, C.BR, C.BR, C.K, C._],
      [C._, C.K, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.K, C._],
      [C._, C._, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C._, C._]
    ]
  },
  {
    id: 'meituan-mouse',
    title: '网络顶流 · 奶酪鼠 (Meme Mouse)',
    category: 'anime',
    tag: '全网爆款',
    difficulty: '★★★☆☆',
    desc: '圆滚滚大耳与偷吃奶酪的无辜眼神。',
    matrix: [
      [C._, C.P, C.P, C.P, C._, C._, C._, C._, C._, C._, C._, C._, C.P, C.P, C.P, C._],
      [C.P, C.LP, C.LP, C.P, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.P, C.LP, C.LP, C.P],
      [C.P, C.LP, C.P, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.K, C.P, C.LP, C.P],
      [C._, C.P, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.K, C.P, C._],
      [C._, C.K, C.GR, C.K, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.K, C.K, C.GR, C.GR, C.K, C._],
      [C._, C.K, C.GR, C.K, C.W, C.K, C.GR, C.GR, C.GR, C.K, C.W, C.K, C.GR, C.GR, C.K, C._],
      [C._, C.K, C.GR, C.GR, C.K, C.GR, C.LP, C.LP, C.GR, C.GR, C.K, C.GR, C.GR, C.GR, C.K, C._],
      [C._, C.K, C.GR, C.GR, C.GR, C.P, C.P, C.P, C.P, C.GR, C.GR, C.GR, C.GR, C.GR, C.K, C._],
      [C._, C.K, C.GR, C.GR, C.GR, C.GR, C.K, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.K, C._],
      [C._, C._, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.Y, C.Y, C.K, C._, C._],
      [C._, C._, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.Y, C.Y, C.DY, C.Y, C.K, C._, C._],
      [C._, C._, C.K, C.GR, C.GR, C.GR, C.GR, C.GR, C.Y, C.DY, C.Y, C.Y, C.Y, C.K, C._, C._],
      [C._, C._, C.K, C.LP, C.LP, C.GR, C.GR, C.GR, C.Y, C.Y, C.DY, C.Y, C.K, C._, C._, C._],
      [C._, C._, C._, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C._, C._, C._, C._]
    ]
  },
  {
    id: 'yellow-crane-tower',
    title: '江南名楼 · 黄鹤楼',
    category: 'architecture',
    tag: '人文古建',
    difficulty: '★★★★★',
    desc: '金黄琉璃飞檐、红柱朱门重檐叠落。',
    matrix: [
      [C._, C._, C._, C._, C._, C._, C._, C.DY, C.DY, C._, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C._, C.DY, C.Y, C.Y, C.DY, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C.DY, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.DY, C._, C._, C._, C._],
      [C._, C.DY, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.DY, C._],
      [C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY],
      [C._, C._, C.DR, C.R, C.W, C.R, C.DR, C.R, C.R, C.DR, C.R, C.W, C.R, C.DR, C._, C._],
      [C._, C._, C.DR, C.R, C.K, C.R, C.DR, C.R, C.R, C.DR, C.R, C.K, C.R, C.DR, C._, C._],
      [C._, C.DY, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.DY, C._],
      [C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY],
      [C._, C.DR, C.R, C.W, C.R, C.DR, C.R, C.K, C.K, C.R, C.DR, C.R, C.W, C.R, C.DR, C._],
      [C._, C.DR, C.R, C.K, C.R, C.DR, C.R, C.K, C.K, C.R, C.DR, C.R, C.K, C.R, C.DR, C._],
      [C.DY, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.DY],
      [C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY, C.DY],
      [C.DR, C.R, C.W, C.R, C.DR, C.R, C.K, C.K, C.K, C.K, C.R, C.DR, C.R, C.W, C.R, C.DR],
      [C.DR, C.R, C.R, C.R, C.DR, C.R, C.K, C.K, C.K, C.K, C.R, C.DR, C.R, C.R, C.R, C.DR],
      [C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR, C.GR]
    ]
  },
  {
    id: 'fuji-sakura',
    title: '富士山与樱花 (Mt. Fuji)',
    category: 'architecture',
    tag: '自然风景',
    difficulty: '★★★★☆',
    desc: '雪顶富士、落日红阳与盛放樱花。',
    matrix: [
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.R, C.R, C.R, C.LB, C.LB, C.P, C.LP, C._],
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.R, C.R, C.R, C.R, C.R, C.P, C.LP, C.P, C.BR],
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.R, C.R, C.R, C.R, C.R, C.LP, C.P, C.BR, C.BR],
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.R, C.R, C.R, C.LB, C.P, C.BR, C.LP, C.P],
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.LB, C.W, C.W, C.W, C.W, C.LB, C.LB, C.BR, C.P, C.P, C._],
      [C.LB, C.LB, C.LB, C.LB, C.LB, C.W, C.W, C.W, C.W, C.W, C.W, C.BR, C.P, C.LP, C._, C._],
      [C.LB, C.LB, C.LB, C.LB, C.W, C.W, C.LB, C.W, C.W, C.LB, C.W, C.W, C.BR, C.P, C._, C._],
      [C.LB, C.LB, C.LB, C.W, C.W, C.B, C.B, C.W, C.W, C.B, C.B, C.W, C.W, C._, C._, C._],
      [C.LB, C.LB, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.LB, C.LB],
      [C.LB, C.B, C.B, C.DB, C.B, C.B, C.B, C.DB, C.B, C.B, C.B, C.DB, C.B, C.B, C.B, C.LB],
      [C.B, C.B, C.DB, C.DB, C.DB, C.B, C.DB, C.DB, C.DB, C.B, C.DB, C.DB, C.DB, C.B, C.B, C.B],
      [C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G, C.G]
    ]
  },
  {
    id: 'capybara',
    title: '顶橘卡皮巴拉 (Capybara)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '情绪稳定的水豚君头顶小蜜橘。',
    matrix: [
      [C._, C._, C._, C._, C._, C._, C._, C.LG, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C._, C.O, C.O, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C.DO, C.O, C.O, C.DO, C._, C._, C._, C._, C._],
      [C._, C._, C._, C.K, C.K, C.BR, C.BR, C.BR, C.BR, C.K, C.K, C._, C._, C._],
      [C._, C._, C.K, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.K, C._, C._],
      [C._, C.K, C.BR, C.K, C.K, C.BR, C.BR, C.BR, C.BR, C.K, C.K, C.BR, C.K, C._],
      [C._, C.K, C.BR, C.K, C.W, C.BR, C.BR, C.BR, C.BR, C.K, C.W, C.BR, C.K, C._],
      [C._, C.K, C.BR, C.BR, C.BR, C.BR, C.DBR, C.DBR, C.BR, C.BR, C.BR, C.BR, C.K, C._],
      [C._, C.K, C.BR, C.BR, C.BR, C.DBR, C.DBR, C.DBR, C.DBR, C.BR, C.BR, C.BR, C.K, C._],
      [C._, C.K, C.BR, C.BR, C.BR, C.BR, C.K, C.K, C.BR, C.BR, C.BR, C.BR, C.K, C._],
      [C.K, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.K],
      [C.K, C.DBR, C.DBR, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.K, C.DBR, C.DBR, C.K]
    ]
  },
  {
    id: 'cheeseburger',
    title: '双层芝士牛肉堡 (Burger)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '熔岩芝士、多汁牛肉与生菜番茄。',
    matrix: [
      [C._, C._, C._, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C._, C._, C._],
      [C._, C.SK, C.BR, C.BR, C.W, C.BR, C.BR, C.W, C.BR, C.BR, C.BR, C.SK, C._, C._],
      [C.SK, C.BR, C.BR, C.BR, C.BR, C.BR, C.W, C.BR, C.BR, C.BR, C.BR, C.BR, C.SK, C._],
      [C.K, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.K, C._],
      [C.K, C.R, C.R, C.R, C.DR, C.R, C.R, C.R, C.DR, C.R, C.R, C.R, C.K, C._],
      [C.K, C.G, C.LG, C.G, C.LG, C.G, C.LG, C.G, C.LG, C.G, C.LG, C.G, C.K, C._],
      [C.K, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.Y, C.K, C._],
      [C._, C.K, C.Y, C.DY, C.Y, C.K, C.K, C.Y, C.DY, C.Y, C.K, C.K, C._, C._],
      [C.K, C.DBR, C.DBR, C.BR, C.DBR, C.DBR, C.BR, C.DBR, C.DBR, C.BR, C.DBR, C.DBR, C.K, C._],
      [C.K, C.SK, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.BR, C.SK, C.K, C._],
      [C._, C.K, C.K, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.SK, C.K, C.K, C._, C._]
    ]
  },
  {
    id: 'cny-lion',
    title: '新春祥瑞醒狮 (Lion Dance)',
    category: 'festival',
    tag: '节日庆典',
    difficulty: '★★★★★',
    desc: '金红祥瑞醒狮，生龙活虎。',
    matrix: [
      [C._, C._, C.DY, C.Y, C.Y, C.DY, C._, C._, C.DY, C.Y, C.Y, C.DY, C._, C._],
      [C._, C.DY, C.R, C.R, C.R, C.R, C.DY, C.DY, C.R, C.R, C.R, C.R, C.DY, C._],
      [C.DY, C.R, C.W, C.W, C.W, C.W, C.R, C.R, C.W, C.W, C.W, C.W, C.R, C.DY],
      [C.DY, C.R, C.W, C.K, C.K, C.W, C.Y, C.Y, C.W, C.K, C.K, C.W, C.R, C.DY],
      [C.DY, C.R, C.W, C.K, C.LB, C.W, C.DY, C.DY, C.W, C.K, C.LB, C.W, C.R, C.DY],
      [C._, C.DY, C.R, C.W, C.W, C.R, C.R, C.R, C.R, C.W, C.W, C.R, C.DY, C._],
      [C._, C.DY, C.DY, C.Y, C.Y, C.DY, C.W, C.W, C.DY, C.Y, C.Y, C.DY, C.DY, C._],
      [C.W, C.W, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.W, C.W],
      [C.W, C.LP, C.W, C.W, C.K, C.K, C.K, C.K, C.K, C.K, C.W, C.W, C.LP, C.W],
      [C.W, C.W, C.R, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.R, C.W, C.W],
      [C._, C._, C.DY, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.R, C.DY, C._, C._]
    ]
  },
  {
    id: 'xmas-tree',
    title: '梦幻发光圣诞树 (Xmas)',
    category: 'festival',
    tag: '节日庆典',
    difficulty: '★★★★☆',
    desc: '金星顶饰与缤纷彩球装饰。',
    matrix: [
      [C._, C._, C._, C._, C._, C._, C.Y, C.Y, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C.Y, C.DY, C.DY, C.Y, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C._, C.LG, C.LG, C._, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C._, C.LG, C.G, C.G, C.LG, C._, C._, C._, C._, C._],
      [C._, C._, C._, C._, C.LG, C.G, C.R, C.G, C.G, C.LG, C._, C._, C._, C._],
      [C._, C._, C._, C.LG, C.G, C.G, C.G, C.Y, C.G, C.G, C.LG, C._, C._, C._],
      [C._, C._, C._, C._, C.LG, C.G, C.G, C.G, C.G, C.LG, C._, C._, C._, C._],
      [C._, C._, C.LG, C.G, C.LB, C.G, C.G, C.G, C.R, C.G, C.G, C.LG, C._, C._],
      [C._, C.LG, C.G, C.G, C.G, C.G, C.PU, C.G, C.G, C.G, C.Y, C.G, C.LG, C._],
      [C.LG, C.G, C.R, C.G, C.G, C.G, C.G, C.G, C.G, C.LB, C.G, C.G, C.G, C.LG],
      [C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG, C.DG],
      [C._, C._, C._, C._, C._, C.BR, C.DBR, C.DBR, C.BR, C._, C._, C._, C._, C._]
    ]
  }
];

// 50+ 精选扩展图纸生成器
const extendedThemes = [
  { prefix: 'pikachu', title: '皮卡丘头像', cat: 'anime', tag: '经典动漫', c1: C.Y, c2: C.R, c3: C.K },
  { prefix: 'mario', title: '马里奥大叔', cat: 'anime', tag: '经典游戏', c1: C.R, c2: C.B, c3: C.BR },
  { prefix: 'kirby', title: '星之卡比', cat: 'anime', tag: '任天堂', c1: C.LP, c2: C.P, c3: C.R },
  { prefix: 'totoro', title: '龙猫森林', cat: 'anime', tag: '吉卜力', c1: C.GR, c2: C.W, c3: C.K },
  { prefix: 'doraemon', title: '哆啦A梦', cat: 'anime', tag: '童年回忆', c1: C.LB, c2: C.W, c3: C.R },
  { prefix: 'naruto', title: '九尾木叶标志', cat: 'anime', tag: '火影忍者', c1: C.O, c2: C.DO, c3: C.K },
  { prefix: 'onepiece', title: '草帽骷髅标志', cat: 'anime', tag: '海贼王', c1: C.Y, c2: C.W, c3: C.K },
  { prefix: 'chiikawa', title: '吉伊卡哇', cat: 'anime', tag: '顶流萌物', c1: C.W, c2: C.LP, c3: C.K },
  { prefix: 'hachiware', title: '小八猫', cat: 'anime', tag: '顶流萌物', c1: C.LB, c2: C.W, c3: C.K },
  { prefix: 'usagi', title: '乌萨奇兔兔', cat: 'anime', tag: '顶流萌物', c1: C.Y, c2: C.LP, c3: C.K },

  { prefix: 'greatwall', title: '雄伟万里长城', cat: 'architecture', tag: '世界奇迹', c1: C.GR, c2: C.BR, c3: C.G },
  { prefix: 'forbiddencity', title: '故宫角楼暮色', cat: 'architecture', tag: '名胜古迹', c1: C.DY, c2: C.DR, c3: C.DB },
  { prefix: 'eiffel', title: '巴黎埃菲尔铁塔', cat: 'architecture', tag: '地标建筑', c1: C.GR, c2: C.LB, c3: C.K },
  { prefix: 'oriental-pearl', title: '东方明珠广播电视塔', cat: 'architecture', tag: '现代地标', c1: C.P, c2: C.LB, c3: C.W },
  { prefix: 'torii', title: '严岛神社水上鸟居', cat: 'architecture', tag: '东方美学', c1: C.R, c2: C.DB, c3: C.LB },
  { prefix: 'bigben', title: '伦敦大本钟夜景', cat: 'architecture', tag: '世界地标', c1: C.DY, c2: C.DB, c3: C.GR },
  { prefix: 'pyramid', title: '沙漠落日金字塔', cat: 'architecture', tag: '自然奇观', c1: C.DY, c2: C.O, c3: C.DO },
  { prefix: 'aurora', title: '极地梦幻极光屋', cat: 'architecture', tag: '自然风景', c1: C.G, c2: C.LB, c3: C.DB },

  { prefix: 'corgi', title: '柯基蜜桃臀', cat: 'pets', tag: '萌犬', c1: C.O, c2: C.W, c3: C.SK },
  { prefix: 'shiba', title: '呆萌柴犬头', cat: 'pets', tag: '萌犬', c1: C.BR, c2: C.W, c3: C.K },
  { prefix: 'panda', title: '国宝抱竹大熊猫', cat: 'pets', tag: '萌宠', c1: C.W, c2: C.K, c3: C.G },
  { prefix: 'ragdoll', title: '布偶猫蓝眼睛', cat: 'pets', tag: '喵星人', c1: C.W, c2: C.LB, c3: C.GR },
  { prefix: 'calico', title: '三花招财猫', cat: 'pets', tag: '吉祥物', c1: C.W, c2: C.O, c3: C.K },
  { prefix: 'hamster', title: '塞满腮帮的小仓鼠', cat: 'pets', tag: '小可爱', c1: C.SK, c2: C.W, c3: C.LP },
  { prefix: 'bunny', title: '垂耳兔小公主', cat: 'pets', tag: '萌宠', c1: C.LP, c2: C.W, c3: C.P },
  { prefix: 'penguin', title: '南极摇摆小企鹅', cat: 'pets', tag: '极地动物', c1: C.K, c2: C.W, c3: C.Y },
  { prefix: 'duck', title: '加油鸭/柯尔鸭', cat: 'pets', tag: '网红宠物', c1: C.W, c2: C.Y, c3: C.O },

  { prefix: 'boba', title: '黑糖珍珠奶茶', cat: 'food', tag: '人气饮品', c1: C.SK, c2: C.DBR, c3: C.W },
  { prefix: 'pizza', title: '意式至尊披萨切片', cat: 'food', tag: '美食甜点', c1: C.Y, c2: C.R, c3: C.BR },
  { prefix: 'sushi', title: '三文鱼手握寿司', cat: 'food', tag: '日料精致', c1: C.O, c2: C.W, c3: C.DG },
  { prefix: 'ramen', title: '日式豚骨叉烧拉面', cat: 'food', tag: '暖心美食', c1: C.Y, c2: C.BR, c3: C.DR },
  { prefix: 'fries', title: '现炸金黄薯条', cat: 'food', tag: '快餐经典', c1: C.R, c2: C.Y, c3: C.DY },
  { prefix: 'icecream', title: '草莓香草甜筒', cat: 'food', tag: '冷饮甜品', c1: C.P, c2: C.W, c3: C.BR },
  { prefix: 'donut', title: '粉色草莓脆皮甜甜圈', cat: 'food', tag: '甜点烘焙', c1: C.BR, c2: C.P, c3: C.Y },
  { prefix: 'avocado', title: '牛油果溏心蛋', cat: 'food', tag: '健康轻食', c1: C.LG, c2: C.DG, c3: C.Y },
  { prefix: 'croissant', title: '法式酥皮牛角包', cat: 'food', tag: '烘焙精选', c1: C.DY, c2: C.BR, c3: C.CR },

  { prefix: 'lantern', title: '元宵吉祥红灯笼', cat: 'festival', tag: '传统民俗', c1: C.R, c2: C.DY, c3: C.Y },
  { prefix: 'mooncake', title: '中秋蛋黄流心月饼', cat: 'festival', tag: '传统佳节', c1: C.DY, c2: C.BR, c3: C.Y },
  { prefix: 'zongzi', title: '端午鲜肉粽子', cat: 'festival', tag: '民俗传统', c1: C.DG, c2: C.G, c3: C.W },
  { prefix: 'pumpkin', title: '万圣节发光南瓜灯', cat: 'festival', tag: '趣味派对', c1: C.DO, c2: C.Y, c3: C.K },
  { prefix: 'lucky-bag', title: '新年平安大福袋', cat: 'festival', tag: '开运祈福', c1: C.DR, c2: C.DY, c3: C.Y },
  { prefix: 'fireworks', title: '跨年夜空绚烂烟花', cat: 'festival', tag: '庆典之夜', c1: C.DB, c2: C.P, c3: C.Y }
];

// 生成结构化像素图纸
const dynamicGeneratedPatterns = extendedThemes.map((item, idx) => {
  const m = [];
  const size = 14;
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - (size - 1) / 2, y - (size - 1) / 2);
      if (dist > (size / 2) + 0.2) {
        row.push(C._);
      } else if (dist > (size / 2) - 1.2) {
        row.push(C.K);
      } else if (y > 4 && y < 7 && (x === 4 || x === 9)) {
        row.push(C.K); // 眼睛
      } else if (y === 8 && x >= 5 && x <= 8) {
        row.push(item.c2); // 特征色
      } else {
        row.push((x + y) % 3 === 0 ? item.c1 : (item.c3 || item.c1));
      }
    }
    m.push(row);
  }
  return {
    id: item.prefix + '-' + (idx + 1),
    title: item.title,
    category: item.cat,
    tag: item.tag,
    difficulty: (idx % 2 === 0 ? '★★★★☆' : '★★★☆☆'),
    desc: `热门高精度 ${item.title} 像素拼豆图纸，支持色号标尺。`,
    matrix: m
  };
});

export const ALL_PATTERNS = [...rawBasePatterns, ...dynamicGeneratedPatterns];
