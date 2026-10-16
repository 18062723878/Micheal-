/**
 * liquid-glass.js — Apple Liquid Glass（iOS 26 / macOS Tahoe 26）Web 实现的 JS 部分
 * ---------------------------------------------------------------------------
 * 这个模块负责 CSS 做不到的三件事：
 *
 *   1) L2 折射贴图 —— 按元素**实际 px 尺寸**用 canvas 生成「倒角位移贴图」，
 *      再包成 SVG feDisplacementMap，塞进元素的 backdrop-filter。
 *        · 贴图 = 中间一整片 50% 灰（128 = 不偏移）+ 四条边的斜坡（倒角模型）。
 *          绝对不能用 feTurbulence 噪点 —— 那是热浪，不是玻璃。
 *        · R 通道 → x 偏移，G 通道 → y 偏移。
 *        · 倒角宽度是**常数**（默认 46px），不随元素尺寸等比缩放；
 *          否则 900px 的大卡片会得到一条 200px 的糊边。
 *        · 中心必须严格零位移（验收：只截卡片正中，开关折射前后像素几乎一致）。
 *        · 滤镜区域外扩 30%，否则边缘采样被裁出硬切口。
 *        · 用 ResizeObserver 跟踪尺寸变化并重算。
 *
 *   2) L4 镜面驱动 —— 指针划过时把相对坐标写进 --lg-mx / --lg-my，
 *      由 CSS 的径向渐变把高光「拖」过去，产生「光在动」的感觉。
 *
 *   3) 能力检测与性能守卫 ——
 *        · url() 进 backdrop-filter 只有 Chromium 认，Safari / Firefox 会整条丢弃，
 *          所以折射只在检测通过时挂载（CSS 侧另有 @supports 兜底）。
 *        · 折射滤镜按视口懒挂载，同一时刻最多 N 个，离开视口即卸载。
 *        · 尊重 prefers-reduced-motion 与 prefers-reduced-transparency。
 *
 * 用法：initLiquidGlass() —— 幂等，重复调用无副作用。
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ------------------------------------------------------------------ *
 * 配置
 * ------------------------------------------------------------------ */
const CFG = {
  /** 倒角宽度（常数 px）—— 不随元素尺寸缩放 */
  bevel: 46,
  /** 最大位移量 = bevel × 该系数 */
  refractFactor: 0.35,
  /** 折射只挂在这种「够大」的元素上：短边下限 / 面积下限 */
  minRefractSide: 150,
  minRefractArea: 24000,
  /** 同一时刻最多挂载多少个折射滤镜（超出按面积优先） */
  maxRefract: 18,
  /** 贴图尺寸取整粒度：相同尺寸的贴图直接复用，避免重复生成 */
  mapQuantum: 8,
  /** 单张贴图像素上限，超过则按比例缩采样（feImage 会拉伸回实际尺寸） */
  mapMaxPixels: 2.4e6,
  /** 贴图缓存条数 */
  mapCacheMax: 40,
  /** 总玻璃元素超过这个数就把控制件的 backdrop-filter 摘掉，只留材质外观 */
  liteThreshold: 170,
  /** 玻璃元素超过这个数就启用「离屏摘模糊」（避免长列表页每帧合成上百层） */
  offscreenThreshold: 14,
};

/* ------------------------------------------------------------------ *
 * 自动挂载的选择器表
 * ------------------------------------------------------------------ */

/** 表面层（L5：功能层）—— 导航 / 工具栏 / 面板 / 卡片 / 弹层 */
const SURFACE_SELECTORS = [
  '.site-nav-header',
  '.nav-mobile-dropdown',
  '.modal-dialog',
  '.lightbox-panel',
  '.sb-root',
  '.hero-metric',
  '.featured-card',
  '.step-card',
  '.panel',
  '.settings-group',
  '.import-bar',
  '.stage-toolbar',
  '.stage-legend-wrap',
  '.bead-stat',
  '.stage-empty',
  '.wb-card',
  '.board-workbench',
  '.draw-sidebar',
  '.pattern-card',
  '.category-card',
  '.example-card',
  '.tutorial-step',
];

/** 控制件（按键 / 输入 / chip / 分段控件 / 列表项） */
const CONTROL_SELECTORS = [
  '.btn',
  '.featured-btn',
  '.filter-tab',
  '.toggle-chip',
  '.segmented',
  '.zoom-controls',
  '.wb-zoom-controls',
  '.theme-toggle-btn',
  '.sponsor-btn-compact',
  '.nav-hamburger-btn',
  '.modal-close-btn',
  '.lightbox-close',
  '.sponsor-tab',
  '.sb-link',
  '.sb-collapse-btn',
  '.sb-hit',
  '.sb-search',
  '.pp-group',
  '.pp-head',
  '.pp-mini-btn',
  '.pp-gutter-btn',
  '.pp-inline-fold',
  '.form-select',
  '.slider-val-badge',
  '.slider-val-box',
  '.badge',
  '.bead-legend-item',
  '.tool-chip',
  '.tool-btn',
  '.size-btn',
  '.mini-toggle',
  '.wb-select',
  '.current-color-tag',
  '.palette-search',
];

/* ------------------------------------------------------------------ *
 * 能力检测
 * ------------------------------------------------------------------ */

/** 是否 Chromium 系（只有它认 backdrop-filter: url()） */
function isChromiumFamily() {
  const ua = navigator.userAgent || '';
  if (/Firefox\//.test(ua)) return false;
  if (/Safari\//.test(ua) && !/Chrom(e|ium)\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)) {
    return false;
  }
  return /Chrom(e|ium)\//.test(ua) || /Edg\//.test(ua) || /OPR\//.test(ua);
}

/**
 * 真正验证「url() 形式的 backdrop-filter 会不会被解析」。
 * 做法：往一个游离元素上写内联样式，再读回来。
 * 浏览器若认为该值非法，会直接把声明丢掉 —— 读回来就是空字符串。
 * 这比 @supports 可靠：Safari 能解析 url() 语法但渲染时忽略它。
 */
function detectUrlBackdrop() {
  try {
    const el = document.createElement('div');
    el.style.setProperty('backdrop-filter', 'url("#lg-probe")');
    el.style.setProperty('-webkit-backdrop-filter', 'url("#lg-probe")');
    const ok = el.style.getPropertyValue('backdrop-filter') !== '';
    if (!ok) return false;
    if (typeof CSS !== 'undefined' && CSS.supports) {
      if (!CSS.supports('backdrop-filter', 'url("#lg-probe")')) return false;
    }
    return isChromiumFamily();
  } catch (e) {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * 位移贴图
 * ------------------------------------------------------------------ */

const mapCache = new Map(); // key -> dataURL

/**
 * 生成倒角位移贴图。
 * 用圆角矩形 SDF 求「距边界距离」，只在距边界 < bevel 的带内产生位移，
 * 方向取 SDF 的外法线 —— 于是四条边附近的背景被向内挤压/弯曲，中心完全不动。
 */
function buildDisplacementMap(w, h, radius, bevel) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;

  const cx = w / 2;
  const cy = h / 2;
  const hw = w / 2;
  const hh = h / 2;
  const R = Math.max(0, Math.min(radius, hw, hh));
  const B = Math.max(1, Math.min(bevel, Math.min(hw, hh)));
  const iw = hw - R;
  const ih = hh - R;

  let i = 0;
  for (let y = 0; y < h; y++) {
    const py = y + 0.5 - cy;
    const ay = py < 0 ? -py : py;
    const qy = ay - ih;
    const sy = py < 0 ? -1 : 1;
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - cx;
      const ax = px < 0 ? -px : px;
      const qx = ax - iw;
      const sx = px < 0 ? -1 : 1;

      // 圆角矩形 SDF：length(max(q,0)) + min(max(qx,qy),0) - R
      const mx = qx > 0 ? qx : 0;
      const my = qy > 0 ? qy : 0;
      let sdf = mx > 0 && my > 0 ? Math.sqrt(mx * mx + my * my) : 0;
      const inner = qx > qy ? qx : qy;
      sdf += (inner < 0 ? inner : 0) - R;

      const edge = -sdf; // 距边界距离，内部为正
      let nx = 0;
      let ny = 0;

      if (edge < B) {
        let t = 1 - edge / B;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        // smoothstep：内边界处斜率为 0，不会出现一条可见的位移接缝
        const m = t * t * (3 - 2 * t);
        // 外法线（解析解，比有限差分快得多）
        if (qx > 0 && qy > 0) {
          const len = Math.sqrt(qx * qx + qy * qy) || 1;
          nx = (sx * qx) / len;
          ny = (sy * qy) / len;
        } else if (qx > qy) {
          nx = sx;
        } else {
          ny = sy;
        }
        nx *= m;
        ny *= m;
      }

      d[i] = 128 + Math.round(nx * 127); // R → x 偏移，128 = 不偏移
      d[i + 1] = 128 + Math.round(ny * 127); // G → y 偏移
      d[i + 2] = 128;
      d[i + 3] = 255;
      i += 4;
    }
  }

  ctx.putImageData(img, 0, 0);
  return cv;
}

/** 取（并缓存）某尺寸的贴图 dataURL */
function getMapUrl(w, h, radius, bevel) {
  const q = CFG.mapQuantum;
  let mw = Math.max(4, Math.round(w / q) * q);
  let mh = Math.max(4, Math.round(h / q) * q);
  const px = mw * mh;
  let scale = 1;
  if (px > CFG.mapMaxPixels) {
    scale = Math.sqrt(CFG.mapMaxPixels / px);
    mw = Math.max(4, Math.round(mw * scale));
    mh = Math.max(4, Math.round(mh * scale));
  }
  const key = `${mw}x${mh}_${Math.round(radius)}_${Math.round(bevel)}`;
  const hit = mapCache.get(key);
  if (hit) return hit;

  const cv = buildDisplacementMap(mw, mh, radius * (mw / Math.max(1, w)), bevel * (mw / Math.max(1, w)));
  const url = cv.toDataURL('image/png');
  if (mapCache.size >= CFG.mapCacheMax) {
    const oldest = mapCache.keys().next().value;
    mapCache.delete(oldest);
  }
  mapCache.set(key, url);
  return url;
}

/* ------------------------------------------------------------------ *
 * SVG 滤镜容器
 * ------------------------------------------------------------------ */

let svgRoot = null;
let uidSeq = 0;

function ensureSvgRoot() {
  if (svgRoot && svgRoot.isConnected) return svgRoot;
  svgRoot = document.createElementNS(SVG_NS, 'svg');
  svgRoot.setAttribute('id', 'lg-filter-root');
  svgRoot.setAttribute('aria-hidden', 'true');
  svgRoot.setAttribute('focusable', 'false');
  svgRoot.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.appendChild(svgRoot);
  return svgRoot;
}

function createFilter(id) {
  const f = document.createElementNS(SVG_NS, 'filter');
  f.setAttribute('id', id);
  // 滤镜区域外扩 30%，否则边缘采样被裁出硬切口
  f.setAttribute('x', '-30%');
  f.setAttribute('y', '-30%');
  f.setAttribute('width', '160%');
  f.setAttribute('height', '160%');
  // 关键：SVG 滤镜默认在线性 RGB 里运算，会把我们精心算好的 128 灰阶整体搬走，
  // 中心就不再是零位移了。必须显式声明 sRGB。
  f.setAttribute('color-interpolation-filters', 'sRGB');

  const feImg = document.createElementNS(SVG_NS, 'feImage');
  feImg.setAttribute('x', '0');
  feImg.setAttribute('y', '0');
  feImg.setAttribute('preserveAspectRatio', 'none');
  feImg.setAttribute('result', 'lgMap');

  const feDisp = document.createElementNS(SVG_NS, 'feDisplacementMap');
  feDisp.setAttribute('in', 'SourceGraphic');
  feDisp.setAttribute('in2', 'lgMap');
  feDisp.setAttribute('xChannelSelector', 'R');
  feDisp.setAttribute('yChannelSelector', 'G');

  f.appendChild(feImg);
  f.appendChild(feDisp);
  ensureSvgRoot().appendChild(f);
  return { filter: f, feImg, feDisp };
}

/* ------------------------------------------------------------------ *
 * 单个元素的折射绑定
 * ------------------------------------------------------------------ */

class GlassSurface {
  constructor(el, index) {
    this.el = el;
    this.id = `lg-f-${index}`;
    this.attached = false;
    this.sizeKey = '';
    this.parts = createFilter(this.id);
  }

  measure() {
    const r = this.el.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width));
    const h = Math.max(2, Math.round(r.height));
    let radius = 16;
    try {
      const br = getComputedStyle(this.el).borderTopLeftRadius || '';
      const v = parseFloat(br);
      if (isFinite(v)) radius = v;
    } catch (e) {
      /* 忽略 */
    }
    return { w, h, radius };
  }

  /** 挂载折射（进入视口时调用） */
  attach() {
    if (this.attached) return;
    const { w, h, radius } = this.measure();
    if (Math.min(w, h) < CFG.minRefractSide || w * h < CFG.minRefractArea) return;

    const bevel = Math.min(CFG.bevel, Math.min(w, h) / 2);
    const disp = Math.min(bevel * CFG.refractFactor, Math.min(w, h) * 0.2);
    const url = getMapUrl(w, h, radius, bevel);

    const { feImg, feDisp } = this.parts;
    feImg.setAttribute('width', String(w));
    feImg.setAttribute('height', String(h));
    // 贴图尺寸做过取整（可能被等比缩过），用 preserveAspectRatio=none 拉伸回实际尺寸
    feImg.setAttribute('href', url);
    feImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);
    // feDisplacementMap 的最大偏移 = scale/2，所以 scale 取位移量的两倍
    feDisp.setAttribute('scale', String(disp * 2));

    this.sizeKey = `${w}x${h}`;
    this.el.style.setProperty('--lg-filter', `url(#${this.id})`);
    this.el.classList.add('lg--refract');
    this.attached = true;
  }

  /** 卸载折射（离开视口时调用）—— 每帧重算 backdrop 会掉帧，所以离屏就摘掉 */
  detach() {
    if (!this.attached) return;
    this.el.classList.remove('lg--refract');
    this.el.style.removeProperty('--lg-filter');
    this.attached = false;
  }

  /** 尺寸变了：重算贴图与 scale */
  resync() {
    if (!this.attached) return;
    const { w, h } = this.measure();
    const key = `${w}x${h}`;
    if (key === this.sizeKey) return;
    this.attached = false;
    this.attach();
  }

  destroy() {
    this.detach();
    this.parts.filter.remove();
  }
}

/* ------------------------------------------------------------------ *
 * 主入口
 * ------------------------------------------------------------------ */

const state = {
  inited: false,
  supportsRefract: false,
  cfg: { ...CFG },
  seen: new WeakSet(),
  blurObserved: new WeakSet(),
  surfaces: [],
  refract: [],
  byElement: new Map(),
  io: null,
  ro: null,
  blurIo: null,
  seq: 0,
  lastTouched: [],
  raf: 0,
  pendingEvt: null,
};

/**
 * 扫描并挂载。可重复调用 —— 只处理「没见过」的元素，
 * 所以页面异步渲染出卡片之后再调一次就能补上。
 */
export function scanLiquidGlass() {
  if (!state.inited) return null;
  const cfg = state.cfg;

  /* ---- 表面层 ---- */
  const freshSurfaces = [];
  for (const el of document.querySelectorAll(SURFACE_SELECTORS.join(','))) {
    if (state.seen.has(el)) continue;
    state.seen.add(el);
    el.classList.add('lg');
    state.surfaces.push(el);
    freshSurfaces.push(el);
  }

  /* ---- 控制件 ---- */
  for (const el of document.querySelectorAll(CONTROL_SELECTORS.join(','))) {
    if (state.seen.has(el)) continue;
    state.seen.add(el);
    el.classList.add('lg-ctl');
  }

  /* ---- 控制件自带模糊的判定 ----
     只给「不处在玻璃表面内部」的控件加 backdrop-filter：
     嵌在玻璃卡片里的控件再叠一层是双重模糊，既费性能也看不出区别。 */
  for (const el of document.querySelectorAll('.lg-ctl')) {
    el.classList.toggle('lg-ctl--blur', !el.closest('.lg'));
  }

  /* ---- 性能守卫 ----
     低端设备或玻璃元素总量过大时，摘掉一部分 backdrop-filter，只保留材质外观。
     优先摘「嵌套的」那一层 —— 它背后已经有一层玻璃在模糊了。 */
  const allSurfaces = state.surfaces;
  const controls = document.querySelectorAll('.lg-ctl');
  const totalGlass = allSurfaces.length + controls.length;
  const lowEnd =
    (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const nestedSurfaces = allSurfaces.filter(el => el.parentElement && el.parentElement.closest('.lg'));
  const heavy = lowEnd || totalGlass > cfg.liteThreshold;
  if (heavy) {
    controls.forEach(el => {
      el.classList.remove('lg-ctl--blur');
      el.classList.add('lg--no-blur');
    });
    nestedSurfaces.forEach(el => el.classList.add('lg--no-blur'));
  } else if (nestedSurfaces.length > 12) {
    nestedSurfaces.forEach(el => el.classList.add('lg--no-blur'));
  }

  /* ---- 离屏摘模糊 ----
     只在「玻璃元素很多」的长列表页启用；短页面直接常驻，省掉观察器开销。 */
  if (state.blurIo) {
    const blurTargets = document.querySelectorAll('.lg, .lg-ctl--blur');
    if (blurTargets.length > cfg.offscreenThreshold) {
      for (const el of blurTargets) {
        if (state.blurObserved.has(el)) continue;
        state.blurObserved.add(el);
        state.blurIo.observe(el);
      }
    }
  }

  /* ---- 折射：按面积优先，限额懒挂载 ---- */
  if (state.supportsRefract && freshSurfaces.length) {
    const candidates = freshSurfaces
      .map(el => {
        const r = el.getBoundingClientRect();
        return { el, area: r.width * r.height, side: Math.min(r.width, r.height) };
      })
      .filter(c => c.side >= cfg.minRefractSide && c.area >= cfg.minRefractArea)
      .sort((a, b) => b.area - a.area);

    const room = Math.max(0, cfg.maxRefract - state.refract.length);
    for (const c of candidates.slice(0, room)) {
      const s = new GlassSurface(c.el, state.seq++);
      state.refract.push(s);
      state.byElement.set(c.el, s);
      state.io && state.io.observe(c.el);
      state.ro && state.ro.observe(c.el);
    }
  }

  return api;
}

export function initLiquidGlass(opts = {}) {
  if (state.inited) return api;
  state.inited = true;
  state.cfg = { ...CFG, ...opts };
  const cfg = state.cfg;

  const reduceTransparency =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-transparency: reduce)').matches;
  state.supportsRefract = !reduceTransparency && detectUrlBackdrop();

  /* ---- 观察器：先建好，scan 时逐个登记 ---- */
  if ('IntersectionObserver' in window) {
    state.io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const s = state.byElement.get(entry.target);
          if (!s) return;
          // 离开视口就卸载折射 —— 每帧重算 backdrop 会掉帧，这是最有效的一道闸
          if (entry.isIntersecting) s.attach();
          else s.detach();
        });
      },
      { rootMargin: '240px 0px' }
    );

    // 离屏摘模糊：长列表页（图库一屏几十张卡片）如果每张都常年挂着 backdrop-filter，
    // 滚动时合成开销会线性叠加。这里让离屏的玻璃先摘掉模糊，
    // rootMargin 240px 保证用户看不到切换过程。
    state.blurIo = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('lg--offscreen', !entry.isIntersecting);
        });
      },
      { rootMargin: '240px 0px' }
    );
  }

  if ('ResizeObserver' in window) {
    let dirty = new Set();
    let raf = 0;
    state.ro = new ResizeObserver(entries => {
      entries.forEach(e => {
        const s = state.byElement.get(e.target);
        if (s) dirty.add(s);
      });
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          dirty.forEach(s => s.resync());
          dirty = new Set();
        });
      }
    });
  }

  /* ---------- L4 镜面：指针驱动 --lg-mx / --lg-my ---------- */
  function setSheen(el, clientX, clientY) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty('--lg-mx', (((clientX - r.left) / r.width) * 100).toFixed(2) + '%');
    el.style.setProperty('--lg-my', (((clientY - r.top) / r.height) * 100).toFixed(2) + '%');
  }
  function resetSheen(el) {
    el.style.removeProperty('--lg-mx');
    el.style.removeProperty('--lg-my');
  }
  function flush() {
    state.raf = 0;
    const e = state.pendingEvt;
    state.pendingEvt = null;
    if (!e) return;
    const touched = [];
    let el = e.target instanceof Element ? e.target : null;
    while (el && el !== document.documentElement) {
      if (el.classList && (el.classList.contains('lg') || el.classList.contains('lg-ctl'))) {
        setSheen(el, e.clientX, e.clientY);
        touched.push(el);
      }
      el = el.parentElement;
    }
    // 指针离开的那些元素，把高光送回默认位置
    for (const prev of state.lastTouched) if (!touched.includes(prev)) resetSheen(prev);
    state.lastTouched = touched;
  }
  function queue(e) {
    state.pendingEvt = e;
    if (!state.raf) state.raf = requestAnimationFrame(flush);
  }
  function clearAllSheen() {
    state.lastTouched.forEach(resetSheen);
    state.lastTouched = [];
  }

  window.addEventListener('pointermove', queue, { passive: true });
  window.addEventListener('pointerdown', queue, { passive: true });
  document.addEventListener('pointerleave', clearAllSheen);
  window.addEventListener('blur', clearAllSheen);
  window.addEventListener('site:themechange', clearAllSheen);

  /* ---------- 首扫 + 补扫 ---------- */
  scanLiquidGlass();
  // 页面脚本常在 injectChrome 之后才把卡片渲染出来，补两次扫描把它们收进来
  requestAnimationFrame(() => scanLiquidGlass());
  setTimeout(() => scanLiquidGlass(), 350);
  setTimeout(() => scanLiquidGlass(), 1200);

  window.__liquidGlass = api;
  return api;
}

const api = {
  scan: scanLiquidGlass,
  /** 供调试 / 测试使用 */
  stats: () => ({
    supportsRefract: state.supportsRefract,
    surfaces: state.surfaces.length,
    controls: document.querySelectorAll('.lg-ctl').length,
    blurControls: document.querySelectorAll('.lg-ctl--blur').length,
    noBlur: document.querySelectorAll('.lg--no-blur').length,
    offscreen: document.querySelectorAll('.lg--offscreen').length,
    refractTargets: state.refract.length,
    attached: state.refract.filter(s => s.attached).length,
    mapCacheSize: mapCache.size,
  }),
  /** 折射目标实例（含 attach/detach，供调试与自动化测试使用） */
  targets: () => state.refract.slice(),
  refresh() {
    state.refract.forEach(s => s.resync());
  },
};

/** 供测试直接调用：不依赖 DOM 自动发现 */
export const _internal = { buildDisplacementMap, detectUrlBackdrop, CFG };
