/**
 * param-panel.js — 参数面板的分组收纳 + 宽度调节 + 收起
 *
 * 目标：参数很多时，把低频项折叠起来，让画布在常见屏幕下无需滚动就能完整显示。
 *
 * 关键约束：**不改动任何参数本身**。
 *   - 不新增/删除/重命名控件，不改 min/max/step/value，不改事件绑定；
 *   - 折叠只是给现有 DOM 外面套一层容器，收起时用 hidden 隐藏（display:none），
 *     展开时原样显示 —— 控件的 value 与状态完全不受影响。
 *
 * 能力：
 *   1. 分组折叠：把同级子节点按配置归入若干「组」，组标题可点击展开/收起。
 *   2. 首屏只展开 open: true 的组（默认只开高频组），其余折叠。
 *   3. 面板宽度可拖拽调节，并把宽度/各组展开态写入 localStorage。
 *   4. 面板整体可收起为一条窄把手，把宽度让给画布。
 *   5. 「全部展开 / 全部收起」快捷操作。
 *   6. 窄屏（≤  breakpoint）自动退化为单列、面板宽度不再生效。
 */

const DEFAULTS = {
  width: 260,
  minWidth: 200,
  maxWidth: 460,
  widthKey: null,       // localStorage key：面板宽度
  groupsKey: null,      // localStorage key：各组展开态
  collapsedKey: null,   // localStorage key：面板整体收起态
  breakpoint: 900,      // 窄屏断点
  storageSafe: true,
};

function readLS(key, fallback) {
  if (!key) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function writeLS(key, value) {
  if (!key) return;
  try { localStorage.setItem(key, String(value)); } catch (e) { /* 隐私模式忽略 */ }
}

/**
 * 初始化一个参数面板。
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.panel 面板容器（会被加上 is-param-panel 等类）
 * @param {HTMLElement} opts.gutter 拖拽把手容器（会被插入到 panel 之后）
 * @param {Array<{title:string, open?:boolean, hint?:string, nodes:HTMLElement[]}>} opts.groups
 *        分组定义；nodes 为要收纳的**已存在的**DOM 元素（会被移动进组容器）
 * @param {HTMLElement} [opts.headerExtra] 面板顶部额外内容（宽度调节、展开/收起按钮）
 * @returns {Object} 控制句柄
 */
export function initParamPanel(opts) {
  const cfg = { ...DEFAULTS, ...opts };
  const { panel, gutter, groups } = cfg;

  if (!panel) throw new Error('initParamPanel: panel 未提供');

  panel.classList.add('is-param-panel');

  /* ---------- 记住原始子节点顺序，便于「还原」 ---------- */
  const originalOrder = Array.from(panel.children);

  /* ---------- 建面板头部 ---------- */
  const head = document.createElement('div');
  head.className = 'pp-head';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'pp-head-title';
  titleWrap.textContent = cfg.title || '参数';
  head.appendChild(titleWrap);

  const headActions = document.createElement('div');
  headActions.className = 'pp-head-actions';

  // 全部展开 / 全部收起
  const btnAll = document.createElement('button');
  btnAll.type = 'button';
  btnAll.className = 'pp-mini-btn';
  btnAll.textContent = '全部展开';
  btnAll.title = '展开全部分组';
  headActions.appendChild(btnAll);

  // 收起面板（变成窄把手）
  const btnCollapse = document.createElement('button');
  btnCollapse.type = 'button';
  btnCollapse.className = 'pp-mini-btn pp-collapse-btn';
  btnCollapse.setAttribute('aria-expanded', 'true');
  btnCollapse.title = '收起参数面板';
  btnCollapse.textContent = '⟩';
  headActions.appendChild(btnCollapse);

  if (cfg.headerExtra) headActions.appendChild(cfg.headerExtra);

  head.appendChild(headActions);

  /* ---------- 建分组容器 ---------- */
  const body = document.createElement('div');
  body.className = 'pp-body';

  const groupEls = [];
  const groupState = {};

  // 读取上次的展开态
  const savedGroups = readLS(cfg.groupsKey, null);
  const savedGroupsObj = savedGroups ? safeParse(savedGroups) : null;

  groups.forEach((g, gi) => {
    const sec = document.createElement('section');
    sec.className = 'pp-group';
    sec.dataset.groupIndex = String(gi);

    const h = document.createElement('button');
    h.type = 'button';
    h.className = 'pp-group-head';
    h.setAttribute('aria-expanded', 'false');

    const caret = document.createElement('span');
    caret.className = 'pp-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = '▸';
    h.appendChild(caret);

    const label = document.createElement('span');
    label.className = 'pp-group-label';
    label.textContent = g.title;
    h.appendChild(label);

    if (g.hint) {
      const hint = document.createElement('span');
      hint.className = 'pp-group-hint';
      hint.textContent = g.hint;
      h.appendChild(hint);
    }

    const bodyEl = document.createElement('div');
    bodyEl.className = 'pp-group-body';
    // 关键：把**原有节点**搬进来，控件本身零改动
    for (const n of g.nodes) {
      if (n && n.parentElement === panel) bodyEl.appendChild(n);
      else if (n) bodyEl.appendChild(n);
    }

    h.addEventListener('click', () => {
      const open = !sec.classList.contains('is-open');
      setGroupOpen(gi, open);
    });

    sec.appendChild(h);
    sec.appendChild(bodyEl);
    body.appendChild(sec);

    groupEls.push({ sec, head: h, body: bodyEl, caret, label });

    // 展开态：已保存 > 配置默认
    const saved = savedGroupsObj && typeof savedGroupsObj[g.key || g.title] === 'boolean'
      ? savedGroupsObj[g.key || g.title]
      : !!g.open;
    groupState[g.key || g.title] = saved;
    setGroupOpen(gi, saved);
  });

  function setGroupOpen(i, open) {
    const gi = groupEls[i];
    if (!gi) return;
    gi.sec.classList.toggle('is-open', open);
    gi.head.setAttribute('aria-expanded', String(open));
    gi.caret.textContent = open ? '▾' : '▸';
    const key = groups[i].key || groups[i].title;
    groupState[key] = open;
    writeLS(cfg.groupsKey, JSON.stringify(groupState));
  }

  /* ---------- 组装 ---------- */
  panel.insertBefore(head, panel.firstChild);
  panel.appendChild(body);

  // 把不属于任何组的节点留在头部之后、body 之前（保持原序）
  const grouped = new Set(groups.flatMap((g) => g.nodes));
  for (const node of originalOrder) {
    if (grouped.has(node)) continue;
    if (node === head || node === body) continue;
    panel.insertBefore(node, body);
  }

  /* ---------- 面板整体收起 ---------- */
  let collapsed = readLS(cfg.collapsedKey, '0') === '1';

  function applyCollapsed() {
    panel.classList.toggle('is-collapsed', collapsed);
    // 把手只在「已收起」时出现：收起后它是唯一的展开入口。
    // 展开时面板本体就在，把手没有意义。
    if (gutter) gutter.classList.toggle('is-open', collapsed);
    btnCollapse.setAttribute('aria-expanded', String(!collapsed));
    btnCollapse.title = collapsed ? '展开参数面板' : '收起参数面板';
    btnCollapse.textContent = collapsed ? '⟨' : '⟩';
    writeLS(cfg.collapsedKey, collapsed ? '1' : '0');
  }

  btnCollapse.addEventListener('click', () => {
    collapsed = !collapsed;
    applyCollapsed();
  });

  /* ---------- 宽度拖拽 ---------- */
  let width = clamp(parseInt(readLS(cfg.widthKey, cfg.width), 10) || cfg.width);
  function applyWidth() {
    panel.style.setProperty('--pp-width', width + 'px');
  }
  function clamp(v) {
    return Math.max(cfg.minWidth, Math.min(cfg.maxWidth, v));
  }

  panel.addEventListener('pointerdown', (e) => {
    if (collapsed) return;
    // 展开态：点标题栏右侧的拖拽热区或面板右边缘
    if (!e.target.closest('.pp-resize-handle') && !isNearRightEdge(e)) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const move = (ev) => {
      width = clamp(startW + (ev.clientX - startX));
      applyWidth();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      writeLS(cfg.widthKey, width);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });

  function isNearRightEdge(e) {
    const r = panel.getBoundingClientRect();
    return Math.abs(e.clientX - r.right) <= 6;
  }

  // 可见的拖拽把手（放在面板右侧，窄屏隐藏）
  const handle = document.createElement('div');
  handle.className = 'pp-resize-handle';
  handle.setAttribute('role', 'separator');
  handle.setAttribute('aria-orientation', 'vertical');
  handle.title = '拖动可调整面板宽度';
  panel.appendChild(handle);

  if (gutter) {
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'pp-gutter-btn';
    openBtn.textContent = '参数';
    openBtn.title = '展开参数面板';
    openBtn.addEventListener('click', () => {
      collapsed = false;
      applyCollapsed();
    });
    gutter.appendChild(openBtn);
  }

  /* ---------- 全部展开 / 全部收起 ---------- */
  let allOpen = false;
  btnAll.addEventListener('click', () => {
    allOpen = !allOpen;
    groups.forEach((_, i) => setGroupOpen(i, allOpen));
    btnAll.textContent = allOpen ? '全部收起' : '全部展开';
    btnAll.title = allOpen ? '收起全部分组' : '展开全部分组';
  });

  applyWidth();
  applyCollapsed();

  /* ---------- 窄屏处理 ---------- */
  const mq = window.matchMedia(`(max-width: ${cfg.breakpoint}px)`);
  function applyNarrow() {
    panel.classList.toggle('is-narrow', mq.matches);
    if (gutter) gutter.classList.toggle('is-narrow', mq.matches);
  }
  applyNarrow();
  mq.addEventListener('change', applyNarrow);

  return {
    /** 恢复初始（未分组前）的节点顺序 */
    restore() {
      for (const node of originalOrder) panel.appendChild(node);
    },
    openGroup(title) {
      const i = groups.findIndex((g) => (g.key || g.title) === title);
      if (i >= 0) setGroupOpen(i, true);
    },
    closeGroup(title) {
      const i = groups.findIndex((g) => (g.key || g.title) === title);
      if (i >= 0) setGroupOpen(i, false);
    },
    getWidth: () => width,
    setWidth(v) { width = clamp(v); applyWidth(); writeLS(cfg.widthKey, width); },
    isCollapsed: () => collapsed,
    setCollapsed(v) { collapsed = !!v; applyCollapsed(); },
    groupTitles: groups.map((g) => g.title),
  };
}

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return null; }
}
