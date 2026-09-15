// 图纸生成器（仅本地使用，不入库）：用几何图元画出 32×32 像素图，输出 patterns-data.js 的条目
import { readFileSync } from 'node:fs';

const W = 32, H = 32;

function painter() {
  const g = Array.from({ length: H }, () => new Array(W).fill(null));
  const api = {
    g,
    set(x, y, c) { if (x >= 0 && y >= 0 && x < W && y < H) g[Math.round(y)][Math.round(x)] = c; },
    rect(x, y, w, h, c) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) api.set(i, j, c); },
    clear(x, y, w, h) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W && j < H) g[j][i] = null; },
    circle(cx, cy, r, c) { api.ellipse(cx, cy, r, r, c); },
    ellipse(cx, cy, rx, ry, c, inner = 0) {
      for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
        for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
          if (inner) {
            const o = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
            const i2 = ((x - cx) / inner) ** 2 + ((y - cy) / inner) ** 2;
            if (o <= 1 && i2 > 1) api.set(x, y, c);
          } else if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) {
            api.set(x, y, c);
          }
        }
      }
    },
    ring(cx, cy, rx, ry, t, c) { api.ellipse(cx, cy, rx, ry, c, Math.max(0.01, rx - t)); },
    mirror() { for (let y = 0; y < H; y++) for (let x = 0; x < W / 2; x++) g[y][W - 1 - x] = g[y][x]; },
    // 每步填 thick×thick 方块，避免陡斜时出现断点
    line(x0, y0, x1, y1, c, thick = 1) {
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
      for (let s = 0; s <= steps; s++) {
        const x = Math.round(x0 + (x1 - x0) * (s / steps));
        const y = Math.round(y0 + (y1 - y0) * (s / steps));
        for (let dx = 0; dx < thick; dx++) for (let dy = 0; dy < thick; dy++) api.set(x + dx, y + dy, c);
      }
    },
    // 等腰三角（朝上）
    triangle(cx, top, bottom, c) {
      const h = bottom - top;
      for (let y = top; y <= bottom; y++) {
        const half = Math.round(((y - top) / Math.max(1, h)) * (h / 2));
        for (let x = cx - half; x <= cx + half; x++) api.set(x, y, c);
      }
    },
  };
  return api;
}

function toRLE(g) {
  return g.map(row => {
    const parts = [];
    let i = 0;
    while (i < W) {
      const c = row[i];
      let j = i;
      while (j < W && row[j] === c) j++;
      const n = j - i;
      parts.push(c === null ? `${n}.` : n === 1 ? c : `${n}${c}`);
      i = j;
    }
    return parts.join(' ');
  }).join(' |\n      ');
}

const RAMP = '@%#*+=-:. ';
const LUM = { H1: 1, H2: .9, H3: .62, H4: .32, H5: .26, H7: .08, A1: .95, A2: .9, A3: .85, A4: .8, A7: .8, A8: .7, A9: .65, A10: .6, A20: .7, B2: .85, B4: .75, B6: .55, B8: .35, B28: .7, B29: .6, C2: .88, C3: .78, C4: .7, C15: .5, C18: .3, C24: .6, D4: .78, D14: .6, D24: .55, D26: .35, E2: .93, E3: .87, E4: .78, E5: .68, E14: .6, E7: .45, F5: .62, F6: .55, F7: .45, F8: .35, F15: .65, G5: .45, G12: .88, G16: .4, G17: .3, G19: .5 };
function preview(g) {
  return g.map(row => row.map(c => (c === null ? '·' : RAMP[Math.min(9, Math.round((1 - (LUM[c] ?? 1)) * 9))])).join('')).join('\n');
}

/* ============================ 图纸设计 ============================ */
const designs = [];

// 1. 柴犬头像
designs.push(['shiba-inu-portrait', '柴犬治愈头像', 'pets', '🐾 治愈萌宠', '★★★☆☆',
  '32×32 标准画幅。奶橘色柴犬头，白色口鼻与黑色圆眼，圆润治愈。', () => {
    const p = painter();
    [[9.5, -1], [22.5, 1]].forEach(([bx, lean]) => {  // 耳朵：顶窄底宽，略微外倾
      for (let y = 1; y <= 15; y++) {
        const t = (y - 1) / 14;
        const w = Math.round(2 + t * 6);
        const cx = bx + lean * (1 - t) * 1.5;
        for (let x = Math.round(cx - w / 2); x <= Math.round(cx + w / 2); x++) p.set(x, y, 'A9');
      }
      for (let y = 7; y <= 14; y++) {                 // 粉色内耳
        const t = (y - 7) / 7;
        const w = Math.max(1, Math.round(t * 3));
        for (let x = Math.round(bx - w); x <= Math.round(bx + w); x++) p.set(x, y, 'E3');
      }
    });
    p.ellipse(15.5, 19, 10.5, 9.5, 'A9');     // 头
    p.ellipse(15.5, 14, 5, 4, 'A7');          // 额头亮部
    p.ellipse(15.5, 23.5, 7, 6, 'H1');        // 口鼻白斑
    p.circle(11, 17, 2.2, 'H7');              // 眼
    p.circle(20, 17, 2.2, 'H7');
    p.set(10, 16, 'H1'); p.set(19, 16, 'H1'); // 眼高光
    p.ellipse(15.5, 20, 2.2, 1.6, 'H7');      // 鼻
    p.set(14, 23, 'H7'); p.set(15, 23, 'H7'); // 嘴
    p.set(15, 24, 'H7');
    p.set(13, 22, 'H7'); p.set(17, 22, 'H7');
    return p.g;
  }]);

// 2. 企鹅先生
designs.push(['mister-penguin', '企鹅先生', 'pets', '🐾 治愈萌宠', '★★★☆☆',
  '32×32 标准画幅。黑白配色的小企鹅，橘色喙与脚蹼，站姿圆润。', () => {
    const p = painter();
    p.circle(15.5, 13, 6.6, 'H7');            // 头
    p.ellipse(15.5, 20, 9.5, 11, 'H7');       // 身体
    p.ellipse(15.5, 21, 6.5, 9, 'H1');        // 肚皮
    p.ellipse(6.8, 20, 2.4, 7, 'H7');         // 鳍
    p.ellipse(24.2, 20, 2.4, 7, 'H7');
    p.circle(12.6, 13.5, 2.7, 'H1');          // 眼白
    p.circle(18.4, 13.5, 2.7, 'H1');
    p.circle(12.6, 13.5, 1.4, 'H7');          // 瞳孔
    p.circle(18.4, 13.5, 1.4, 'H7');
    p.set(12, 12, 'H1'); p.set(18, 12, 'H1');
    p.rect(15, 16, 2, 3, 'A20');              // 喙
    p.set(14, 17, 'A20'); p.set(17, 17, 'A20');
    p.rect(9, 28, 6, 3, 'A20');               // 脚蹼
    p.rect(17, 28, 6, 3, 'A20');
    return p.g;
  }]);

// 3. 猫爪印记
designs.push(['cat-paw-print', '猫爪印记', 'pets', '🐾 治愈萌宠', '★★☆☆☆',
  '32×32 标准画幅。粉嫩猫爪印，四个趾垫与掌垫层次分明，适合做杯垫。', () => {
    const p = painter();
    p.ellipse(15.5, 21, 7.6, 6.6, 'E14');
    p.ellipse(15.5, 21, 6, 5, 'E4');
    p.ellipse(15.5, 20.5, 3.4, 2.8, 'E5');
    [[4.5, 13.5], [11.5, 9.5], [19.5, 9.5], [26.5, 13.5]].forEach(([cx, cy]) => {
      p.ellipse(cx, cy, 3.4, 3.6, 'E14');
      p.ellipse(cx, cy, 2.4, 2.6, 'E4');
      p.circle(cx, cy - 0.6, 1.1, 'E3');
    });
    return p.g;
  }]);

// 4. 抹茶冰淇淋
designs.push(['matcha-ice-cream', '抹茶冰淇淋', 'food', '🍔 美食甜品', '★★★☆☆',
  '32×32 标准画幅。双球抹茶冰淇淋配脆皮甜筒，顶上点缀红樱桃。', () => {
    const p = painter();
    const coneTop = 19, coneBottom = 30;
    for (let y = coneTop; y <= coneBottom; y++) {          // 甜筒
      const t = (y - coneTop) / (coneBottom - coneTop);
      const half = Math.max(0.6, 7.5 * (1 - t));
      for (let x = -half; x <= half; x++) p.set(15.5 + x, y, 'G12');
    }
    for (let y = coneTop + 3; y <= coneBottom; y++) {      // 华夫格纹（只落在筒身内）
      const t = (y - coneTop) / (coneBottom - coneTop);
      const half = Math.max(0.6, 7.5 * (1 - t)) - 0.8;
      for (let x = -half; x <= half; x++) p.set(15.5 + x, y, 'G19');
    }
    p.circle(12, 14, 6.6, 'B6');              // 左球
    p.circle(19.5, 14, 6.6, 'B4');            // 右球
    p.circle(15.5, 8, 6.4, 'B4');             // 顶球
    p.ellipse(11, 10.5, 2.6, 2, 'B2');        // 高光
    p.ellipse(19.5, 4, 2.6, 2, 'B2');
    p.circle(15.5, 3, 2.2, 'F7');             // 樱桃
    p.set(15, 2, 'F5');
    p.set(16, 0, 'B6'); p.set(16, 1, 'B6');   // 果梗
    return p.g;
  }]);

// 5. 西瓜冰棒
designs.push(['watermelon-popsicle', '西瓜冰棒', 'food', '🍔 美食甜品', '★★★☆☆',
  '32×32 标准画幅。绿皮红瓤的西瓜冰棒，点缀黑色瓜籽与木棒。', () => {
    const p = painter();
    p.rect(7, 3, 18, 18, 'B6');               // 绿皮
    p.ellipse(16, 21, 9, 5, 'B6');
    p.rect(8, 5, 16, 15, 'B2');               // 白瓤
    p.ellipse(16, 21, 8, 4, 'B2');
    p.rect(9, 6, 14, 13, 'E5');               // 红瓤
    p.ellipse(16, 20, 7, 3.4, 'E5');
    p.ellipse(12.5, 12, 1.8, 2.6, 'E4');      // 淡淡高光
    [[12, 9], [19, 9], [11, 16], [20, 16], [15, 12], [16, 13]].forEach(([x, y]) => p.set(x, y, 'H7'));
    p.rect(14, 25, 4, 6, 'G12');              // 木棒
    p.rect(14, 25, 4, 1, 'G19');
    return p.g;
  }]);

// 6. 热可可棉花糖
designs.push(['hot-cocoa-marshmallow', '热可可棉花糖', 'food', '🍔 美食甜品', '★★★☆☆',
  '32×32 标准画幅。蓝白马克杯热可可，浮着三颗棉花糖，冒着热气。', () => {
    const p = painter();
    p.ring(25, 19, 5, 5, 2, 'C15');           // 杯耳
    p.rect(6, 11, 18, 17, 'C15');             // 杯身
    p.ellipse(15, 28, 9, 2.5, 'C15');
    p.ellipse(15, 12, 9.5, 3, 'H2');          // 杯口
    p.ellipse(15, 13, 8, 2.4, 'G17');         // 可可液面
    [[11, 12], [15.5, 11.5], [20, 12]].forEach(([x, y]) => p.rect(x - 1, y - 1, 3, 3, 'H1')); // 棉花糖
    p.rect(6, 17, 18, 2, 'H2');               // 杯身高光
    p.ellipse(15, 30, 7, 1.6, 'H3');          // 杯底阴影
    for (let i = 0; i < 4; i++) {             // 热气
      p.set(11 + (i % 2), 8 - i, 'H2');
      p.set(20 - (i % 2), 9 - i, 'H2');
    }
    return p.g;
  }]);

// 7. 新春红灯笼
designs.push(['festival-lantern', '新春红灯笼', 'festival', '🏮 节日庆典', '★★★☆☆',
  '32×32 标准画幅。金黄盖顶的中国红灯笼，配吊绳与流苏，年味十足。', () => {
    const p = painter();
    p.ellipse(15.5, 17, 10.5, 9.5, 'F7');     // 灯身
    for (const x of [10, 13, 18, 21]) p.rect(x, 9, 1, 16, 'F5');   // 竹骨
    p.ellipse(10.5, 15, 1.8, 4, 'F5');        // 亮部
    p.circle(15.5, 17, 3.6, 'A4');            // 中心贴金
    p.circle(15.5, 17, 2.2, 'F7');
    p.rect(11, 7, 9, 3, 'A4');                // 上盖
    p.rect(11, 25, 9, 3, 'A4');               // 下盖
    p.rect(14, 3, 3, 4, 'A20');               // 吊绳
    p.rect(14, 28, 3, 2, 'A20');              // 流苏
    p.rect(14, 30, 3, 1, 'A20');
    p.rect(15, 31, 1, 1, 'A20');
    return p.g;
  }]);

// 8. 圣诞雪人
designs.push(['snowman-christmas', '圣诞雪人', 'festival', '🏮 节日庆典', '★★★★☆',
  '32×32 标准画幅。戴红帽围红围巾的雪人，配树枝手臂与纽扣。', () => {
    const p = painter();
    p.circle(15.5, 25, 7.5, 'H1');            // 身体
    p.circle(15.5, 13, 5.6, 'H1');            // 头
    p.ellipse(15.5, 30, 7, 1.8, 'H2');        // 阴影
    p.rect(10, 6, 11, 3, 'H7');               // 帽檐
    p.rect(12, 1, 7, 5, 'H7');                // 帽身
    p.rect(12, 6, 7, 2, 'F7');                // 红带
    p.circle(13.6, 12.6, 1.3, 'H7');          // 眼
    p.circle(17.4, 12.6, 1.3, 'H7');
    p.rect(16, 14, 3, 2, 'A20');              // 胡萝卜鼻
    p.set(19, 14, 'A20'); p.set(19, 15, 'A20');
    p.rect(11, 16, 10, 2, 'F7');              // 围巾
    p.rect(20, 18, 3, 5, 'F7');               // 围巾尾
    p.set(15.5, 22, 'H7');                    // 纽扣
    p.set(15.5, 26, 'H7');
    p.line(4, 19, 10, 22, 'G16', 1);          // 树枝手臂
    p.line(21, 22, 27, 19, 'G16', 1);
    return p.g;
  }]);

// 9. 春日樱花枝
designs.push(['cherry-blossom-branch', '春日樱花枝', 'festival', '🏮 节日庆典', '★★★★☆',
  '32×32 标准画幅。斜出的樱树枝头缀满粉白花朵，适合做书签。', () => {
    const p = painter();
    p.line(3, 29, 27, 8, 'G17', 2);           // 主枝
    p.line(12, 21, 22, 23, 'G17', 1);         // 侧枝
    p.line(18, 16, 13, 10, 'G17', 1);
    const flower = (cx, cy, petal, core) => {
      p.circle(cx, cy, 2, petal);
      p.set(cx - 3, cy, petal); p.set(cx + 3, cy, petal);
      p.set(cx, cy - 3, petal); p.set(cx, cy + 3, petal);
      p.set(cx - 2, cy - 2, petal); p.set(cx + 2, cy - 2, petal);
      p.set(cx - 2, cy + 2, petal); p.set(cx + 2, cy + 2, petal);
      p.circle(cx, cy, 1, core);
    };
    flower(25, 6, 'E2', 'E14');
    flower(17, 11, 'E3', 'E14');
    flower(23, 14, 'E2', 'E5');
    flower(9, 22, 'E3', 'E14');
    flower(15, 27, 'E2', 'E5');
    p.ellipse(6, 27, 3, 1.6, 'B4');           // 叶片
    p.ellipse(13, 30, 3, 1.4, 'B6');
    p.ellipse(20, 20, 2.4, 1.3, 'B4');
    p.ellipse(27, 11, 2.2, 1.2, 'B6');
    return p.g;
  }]);

// 10. 梦幻独角兽
designs.push(['unicorn-fantasy', '梦幻独角兽', 'anime', '🔥 热门动漫', '★★★★☆',
  '32×32 标准画幅。白色独角兽配彩虹鬃毛与金色独角，少女心满满。', () => {
    const p = painter();
    p.ellipse(16, 20, 9.5, 8.5, 'H1');        // 头
    p.ellipse(16, 12.5, 8, 4.5, 'H1');        // 额
    for (let y = 0; y < 8; y++) {             // 独角
      const w = y > 5 ? 2 : 1;
      for (let x = -w; x <= w; x++) p.set(16 + x, 8 - y, y % 2 ? 'A4' : 'A2');
    }
    p.set(16, 0, 'A20');
    const mane = ['F5', 'A20', 'B4', 'C4', 'D24', 'E14'];   // 彩虹鬃毛
    mane.forEach((c, i) => p.ellipse(6 + i * 1.2, 9.5 + i * 3.6, 2.8, 3.6, c));
    p.circle(12.5, 19, 2.1, 'H7');            // 眼
    p.set(12, 18, 'H1');
    p.ellipse(22, 13, 1.6, 3, 'H1');          // 耳
    p.ellipse(22, 12, 1, 1.8, 'E3');
    p.ellipse(20.5, 26, 3.4, 2.6, 'E3');      // 腮红
    p.ellipse(9.5, 25, 1.3, 1, 'E4');         // 鼻孔
    return p.g;
  }]);

// 11. 像素小幽灵
designs.push(['pixel-ghost', '像素小幽灵', 'anime', '🔥 热门动漫', '★★☆☆☆',
  '32×32 标准画幅。圆滚滚的白色小幽灵，大眼睛与腮红，底部呈波浪形。', () => {
    const p = painter();
    p.circle(15.5, 15, 10, 'H1');             // 圆头
    p.rect(5.5, 15, 20, 9, 'H1');             // 身体
    for (let i = 0; i < 5; i++) p.circle(7.5 + i * 4, 24, 2.4, 'H1');  // 波浪下摆
    p.ellipse(11.5, 14, 3, 3.6, 'H7');        // 眼
    p.ellipse(19.5, 14, 3, 3.6, 'H7');
    p.circle(10.6, 12.6, 1.3, 'H1');          // 高光
    p.circle(18.6, 12.6, 1.3, 'H1');
    p.ellipse(7.5, 19.5, 2.2, 1.6, 'E3');     // 腮红
    p.ellipse(23.5, 19.5, 2.2, 1.6, 'E3');
    p.ellipse(22, 22, 2, 3, 'H2');        // 身体阴影
    return p.g;
  }]);

// 12. 夜晚灯塔
designs.push(['night-lighthouse', '夜晚灯塔', 'architecture', '🏯 名胜古建', '★★★★☆',
  '32×32 标准画幅。深蓝夜空下的红白灯塔，海面倒影与星光点点。', () => {
    const p = painter();
    p.rect(0, 0, 32, 23, 'C18');              // 夜空
    [[3, 4], [8, 7], [27, 3], [23, 11], [5, 14], [29, 17], [17, 2]].forEach(([x, y]) => {
      p.set(x, y, 'A1'); p.set(x + 1, y, 'A1');
    });
    p.circle(26, 7, 3.8, 'A2');               // 月亮
    p.circle(24.4, 6.4, 3.2, 'C18');
    for (let i = 1; i < 7; i++) { p.set(10 - i, 9, 'A3'); p.set(21 + i, 9, 'A3'); } // 灯光
    p.rect(12, 11, 8, 12, 'H1');              // 塔身
    p.rect(12, 14, 8, 2, 'F7');               // 红条纹
    p.rect(12, 18, 8, 2, 'F7');
    p.rect(11, 8, 10, 3, 'H3');               // 灯室
    p.rect(13, 9, 6, 2, 'A3');
    p.rect(14, 5, 4, 3, 'H4');                // 塔顶
    p.ellipse(16, 23.5, 5, 1.6, 'H3');        // 塔基
    p.rect(0, 24, 32, 8, 'C15');              // 海面
    for (let x = 0; x < 32; x += 4) p.set(x, 25, 'C4');
    for (let x = 2; x < 32; x += 5) p.set(x, 28, 'C4');
    p.ellipse(16, 31, 6, 1.6, 'C18');         // 倒影
    return p.g;
  }]);

/* ============================ 输出 ============================ */
let out = '';
for (const [id, title, category, tag, difficulty, desc, draw] of designs) {
  const g = draw();
  const bad = [];
  g.forEach((row, y) => { if (row.length !== W) bad.push(`row ${y} len ${row.length}`); });
  const codes = new Set(g.flat().filter(Boolean));
  out += `  {
    id: '${id}',
    title: '${title}',
    category: '${category}',
    tag: '${tag}',
    difficulty: '${difficulty}',
    desc: '${desc}',
    matrix: decodeGrid(\`
      ${toRLE(g)}
    \`, 32, 32, C_MAP)
  },\n`;
  console.log(`\n===== ${id} | ${title} | ${[...codes].join(',')}${bad.length ? ' ERRORS: ' + bad.join(';') : ''}`);
  console.log(preview(g));
}

import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
const MODE = process.argv[2] || 'preview';   // preview | emit | append

if (MODE === 'emit' || MODE === 'append') {
  if (MODE === 'append') {
    const target = 'assets/js/patterns-data.js';
    const src = readFileSync(target, 'utf8');
    const idx = src.lastIndexOf('\n];');
    if (idx < 0) throw new Error('未找到 ALL_PATTERNS 数组结尾');
    const backup = '.check/patterns-data.backup.js';
    if (!existsSync('.check')) mkdirSync('.check', { recursive: true });
    copyFileSync(target, backup);
    // 去掉数组末尾可能已存在的尾随逗号，避免插入后出现空元素（稀疏数组）
    const head = src.slice(0, idx).replace(/,\s*$/, '');
    writeFileSync(
      target,
      head + ',\n\n  /* ===== 追加精选图纸 ===== */\n' + out.replace(/\n$/, '') + src.slice(idx)
    );
    console.log(`已追加 ${designs.length} 款图纸到 ${target}（备份：${backup}）`);
  } else {
    console.log(out);
  }
}
