/**
 * tutorial-search.js — 教程检索（按模块隔离 + 模糊匹配 + 命中高亮）
 *
 * 关键约束：**结果绝不跨模块**。每次检索都传入 moduleId，
 * 只在该模块自己的条目里找 —— 创意工坊的教程不会出现在白板画板的搜索结果里。
 *
 * 匹配策略（从强到弱）：
 *   1. 标题完全相等        权重 100
 *   2. 标题包含            权重 60
 *   3. 关键词精确命中      权重 45
 *   4. 控件名 / 分类命中   权重 30
 *   5. 任意字段包含        权重 20
 *   6. 子序列模糊匹配      权重 10（容忍错字与跳字，如「对称」↔「寸」）
 *
 * 纯函数、无 DOM 依赖：渲染交给调用方，命中区间以 [start, end) 返回。
 */

/** 把字符串拆成检索用的词元：英文/数字整词 + 中文单字 + 中文 2-gram */
export function tokenize(text) {
  const s = String(text || '').toLowerCase();
  const tokens = [];
  // 英文与数字连续段
  for (const m of s.match(/[a-z0-9]+/g) || []) tokens.push(m);
  // 中文字符：同时产出单字与相邻二元组，提升「对称」这类词的召回
  const cjk = s.match(/[\u4e00-\u9fa5]+/g) || [];
  for (const run of cjk) {
    for (let i = 0; i < run.length; i++) {
      tokens.push(run[i]);
      if (i + 1 < run.length) tokens.push(run.slice(i, i + 2));
    }
  }
  return tokens;
}

/**
 * 子序列匹配：query 的字符按顺序出现在 text 中即算命中。
 * 例：'dui' 命中「对称绘制」？否；但 '对称' 的拼音式跳字查询 '对画' 可命中。
 * 返回命中字符的下标数组，用于生成高亮区间。
 */
export function subsequenceMatch(query, text) {
  const q = String(query || '').toLowerCase();
  const t = String(text || '').toLowerCase();
  if (!q) return [];
  const hits = [];
  let ti = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return [];
    hits.push(found);
    ti = found + 1;
  }
  return hits;
}

/**
 * 在一段文本里找出所有命中区间（用于高亮）。
 * 支持「连续子串」与「子序列」两种命中，都会合并重叠区间。
 *
 * @param {string} text 原始文本
 * @param {string} query 查询词
 * @returns {Array<[number, number]>} 半开区间 [start, end) 列表，已排序且不重叠
 */
export function highlightRanges(text, query) {
  const src = String(text || '');
  const q = String(query || '').trim().toLowerCase();
  if (!q || !src) return [];
  const lower = src.toLowerCase();
  const ranges = [];

  // 1) 连续子串（优先，能给出最自然的高亮块）
  let from = 0;
  while (from <= lower.length - q.length) {
    const i = lower.indexOf(q, from);
    if (i === -1) break;
    ranges.push([i, i + q.length]);
    from = i + 1;
  }

  // 2) 子序列（仅在没有连续命中时补充，避免把整段都标黄）
  if (!ranges.length) {
    const hits = subsequenceMatch(q, src);
    if (hits.length === q.length) {
      // 把相邻下标合并成区间，减少 <mark> 数量
      let start = hits[0];
      let prev = hits[0];
      for (let i = 1; i < hits.length; i++) {
        if (hits[i] === prev + 1) prev = hits[i];
        else {
          ranges.push([start, prev + 1]);
          start = hits[i];
          prev = hits[i];
        }
      }
      ranges.push([start, prev + 1]);
    }
  }

  return mergeRanges(ranges);
}

function mergeRanges(ranges) {
  if (ranges.length < 2) return ranges;
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1]) {
      last[1] = Math.max(last[1], sorted[i][1]);
    } else {
      out.push(sorted[i]);
    }
  }
  return out;
}

/** 条目里所有可被检索的字段（标题权重最高） */
function fieldsOf(entry) {
  return [
    { key: 'title', label: '标题', text: entry.title, weight: 60 },
    { key: 'keywords', label: '关键词', text: (entry.keywords || []).join(' '), weight: 45 },
    { key: 'controls', label: '控件', text: (entry.controls || []).map((c) => `${c.name} ${c.type} ${c.action} ${c.result}`).join(' '), weight: 30 },
    { key: 'category', label: '分类', text: entry.category, weight: 30 },
    { key: 'summary', label: '简介', text: entry.summary, weight: 20 },
    { key: 'steps', label: '步骤', text: (entry.steps || []).join(' '), weight: 20 },
    { key: 'tips', label: '提示', text: (entry.tips || []).join(' '), weight: 20 },
  ];
}

/**
 * 检索单个条目。
 * @param {Object} entry
 * @param {string} query
 * @returns {{score:number, snippet:Object}|null}
 */
function scoreEntry(entry, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return null;
  const qTokens = tokenize(q);

  let score = 0;
  const hitLabels = new Set();

  for (const field of fieldsOf(entry)) {
    const text = field.text;
    if (!text) continue;
    const lower = text.toLowerCase();

    if (field.key === 'title' && lower === q) {
      score = Math.max(score, 100);
      hitLabels.add(field.label);
      continue;
    }
    if (lower.includes(q)) {
      score = Math.max(score, field.weight);
      hitLabels.add(field.label);
    }
  }

  // 控件名单独加权：用户往往直接搜按钮上的字
  for (const c of entry.controls || []) {
    const name = String(c.name || '').toLowerCase();
    if (name && name.includes(q)) {
      score = Math.max(score, 55);
      hitLabels.add('控件：' + c.name);
    }
  }

  // 词元级匹配：query 分词后，只要全部词元都能在条目里找到就得分
  if (qTokens.length) {
    const haystack = tokenize(fieldsOf(entry).map((f) => f.text).join(' '));
    const hay = new Set(haystack);
    const allHit = qTokens.every((t) => hay.has(t));
    if (allHit) score = Math.max(score, 30);
  }

  // 最后的兜底：子序列模糊
  if (score === 0 && subsequenceMatch(q, entry.title).length === q.length) {
    score = 10;
    hitLabels.add('标题（模糊）');
  }

  if (score === 0) return null;
  return { score, snippet: buildSnippet(entry, q, hitLabels) };
}

/**
 * 构造结果摘要：优先给出「包含命中词」的那一段文字，并标出高亮区间。
 */
function buildSnippet(entry, query, hitLabels) {
  const q = query.toLowerCase();
  const candidates = [
    { label: 'summary', text: entry.summary },
    ...(entry.controls || []).flatMap((c) => [
      { label: `控件「${c.name}」`, text: c.result || c.action },
    ]),
    ...(entry.steps || []).map((s) => ({ label: '步骤', text: s })),
    ...(entry.tips || []).map((s) => ({ label: '提示', text: s })),
  ].filter((c) => c.text);

  // 第一个正文含命中词的片段作为摘要
  for (const c of candidates) {
    const ranges = highlightRanges(c.text, q);
    if (ranges.length) {
      return { ...c, ranges, hitLabels: [...hitLabels] };
    }
  }
  // 都��有正文命中时回落到标题
  return {
    label: '标题',
    text: entry.title,
    ranges: highlightRanges(entry.title, q),
    hitLabels: [...hitLabels],
  };
}

/**
 * 在指定模块内检索教程。**绝不跨模块返回结果。**
 *
 * @param {Array<Object>} entries 该模块的教程条目（用 TUTORIALS[moduleId]）
 * @param {string} query 关键词
 * @param {{limit?:number}} [opts]
 * @returns {Array<{entry:Object, score:number, snippet:Object}>}
 */
export function searchTutorials(entries, query, opts = {}) {
  const { limit = 20 } = opts;
  const q = String(query || '').trim();
  if (!q) return [];
  return entries
    .map((entry) => {
      const r = scoreEntry(entry, q);
      return r ? { entry, score: r.score, snippet: r.snippet } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.title.localeCompare(b.entry.title, 'zh-Hans-CN');
    })
    .slice(0, limit);
}

/**
 * 把带高亮区间的文本渲染成 HTML（供 innerHTML 使用）。
 * 命中片段用 <mark> 包裹，其余部分按原样输出（会做 HTML 转义）。
 *
 * @param {string} text
 * @param {Array<[number,number]>} ranges
 * @returns {string} 安全 HTML
 */
export function renderHighlight(text, ranges) {
  const src = String(text || '');
  if (!ranges || !ranges.length) return escapeHtml(src);
  let out = '';
  let cur = 0;
  for (const [s, e] of ranges) {
    if (s > cur) out += escapeHtml(src.slice(cur, s));
    out += `<mark>${escapeHtml(src.slice(s, e))}</mark>`;
    cur = e;
  }
  if (cur < src.length) out += escapeHtml(src.slice(cur));
  return out;
}

/** HTML 转义，防止教程文案里的尖括号破坏结构 */
export function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 供输入框实时提示的轻量结果（只回标题与分类）。
 * @param {Array<Object>} entries
 * @param {string} query
 * @param {number} [limit]
 */
export function quickSuggest(entries, query, limit = 6) {
  return searchTutorials(entries, query, { limit })
    .map((r) => ({ id: r.entry.id, title: r.entry.title, category: r.entry.category, score: r.score }));
}
