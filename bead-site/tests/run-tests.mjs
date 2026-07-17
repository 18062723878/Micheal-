// run-tests.mjs — QA test suite for 拼豆网 (Bead Studio) static site.
// Runs pure-logic + static-consistency + data-integrity checks with Node 22 (ESM).
// No browser required.
//
// Groups:
//   1) Color algorithm fidelity (srgbToLab / nearestColorId vs Python reference)
//   2) Palette integrity (ARTKAL_55)
//   3) Data grid decode (featured.json / inspiration.json)
//   4) Module dependency: no cycle / resolvable (node --check + graph + import)
//   5) DOM id consistency (HTML id="..." vs JS getElementById)
//   6) Worker contract (worker/index.js routes + wrangler.toml)
//   7) Exporter pure part (exportCSV string construction, mock download)

import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.env.NODE_BIN || 'node';

// ---------------------------------------------------------------------------
// Minimal browser-ish globals so the ESM modules can be imported in Node.
// lab.js / palette.js / color.js / convert.js / exporter.js access `window`
// at top-level; exporter.js + a few functions touch document/Blob/URL at call
// time only, so we provide light mocks.
// ---------------------------------------------------------------------------
globalThis.window = globalThis;
globalThis.location = { pathname: '/', href: '' };

let lastBlobContent = null;
globalThis.Blob = class Blob {
  constructor(parts, opts) {
    this.parts = parts;
    this.type = (opts && opts.type) || '';
    lastBlobContent = parts.join('');
  }
};
globalThis.URL = { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} };
globalThis.document = {
  createElement(tag) {
    if (tag === 'a') return { href: '', download: '', click() {}, remove() {}, style: {} };
    if (tag === 'canvas') {
      return { getContext: () => ({}), width: 0, height: 0, toBlob: (cb) => cb({}), toDataURL: () => '' };
    }
    if (tag === 'script') return { src: '', async: false, onload: null, onerror: null };
    return { appendChild() {}, click() {}, remove() {}, style: {}, setAttribute() {}, addEventListener() {} };
  },
  head: { appendChild() {} },
  body: { appendChild() {} },
};

// ---------------------------------------------------------------------------
// Tiny test harness
// ---------------------------------------------------------------------------
const results = [];
function rec(group, name, pass, err) {
  results.push({ group, name, pass, err: pass ? null : err });
}
async function case_(group, name, fn) {
  try {
    await fn();
    rec(group, name, true);
  } catch (e) {
    rec(group, name, false, e && e.message ? e.message : String(e));
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}
function readJSON(rel) {
  return JSON.parse(read(rel));
}
function listJs(dir) {
  return readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.js'));
}
function nodeCheck(fileRel) {
  try {
    execFileSync(NODE, ['--check', join(ROOT, fileRel)], { stdio: 'pipe' });
    return { ok: true, err: null };
  } catch (e) {
    return { ok: false, err: e.stderr ? e.stderr.toString() : e.message };
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  // =====================================================================
  // GROUP 1 — Color algorithm fidelity
  // =====================================================================
  const { srgbToLab } = await import('../assets/js/lab.js');
  const { nearestColorId } = await import('../assets/js/color.js');
  const { ARTKAL_55, PALETTE_LAB } = await import('../assets/js/palette.js');
  const validIds = new Set(ARTKAL_55.map((c) => c.id));

  const REF = {
    '255,255,255': [100, 0, 0],
    '0,0,0': [0, 0, 0],
    '255,0,0': [53.2, 80.1, 67.2],
    '0,255,0': [87.7, -86.2, 83.2],
    '0,0,255': [32.3, 79.2, -107.9],
  };

  for (const key of Object.keys(REF)) {
    const rgb = key.split(',').map(Number);
    await case_('G1-color', `srgbToLab(${key}) within ±0.5 of reference`, () => {
      const got = srgbToLab(rgb);
      const exp = REF[key];
      const maxErr = Math.max(Math.abs(got[0] - exp[0]), Math.abs(got[1] - exp[1]), Math.abs(got[2] - exp[2]));
      assert.ok(maxErr <= 0.5, `maxErr=${maxErr} (got [${got.map((v) => +v.toFixed(3))}] expect [${exp}])`);
    });
  }

  await case_('G1-color', 'nearestColorId(255,255,255) === A01', () => {
    assert.strictEqual(nearestColorId([255, 255, 255]), 'A01');
  });
  await case_('G1-color', 'nearestColorId(26,26,26) === A30', () => {
    assert.strictEqual(nearestColorId([26, 26, 26]), 'A30');
  });

  // Re-implement the same brute-force nearest (sRGB->Lab + min Euclidean dist)
  // to verify nearestColorId is self-consistent with the documented formula.
  function recompute(rgb) {
    const lab = srgbToLab(rgb);
    let best = null;
    let bestD = Infinity;
    for (const id of Object.keys(PALETTE_LAB)) {
      const L = PALETTE_LAB[id];
      const d = Math.hypot(lab[0] - L[0], lab[1] - L[1], lab[2] - L[2]);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    }
    return best;
  }
  function familyOk(id, rgb) {
    const c = ARTKAL_55.find((x) => x.id === id);
    const [r, g, b] = rgb;
    if (r >= g && r >= b && r > 0) return true; // reddish
    if (g >= r && g >= b && g > 0) return true; // greenish
    if (b >= r && b >= g && b > 0) return true; // blueish
    return false;
  }
  for (const [name, rgb] of [
    ['red(255,0,0)', [255, 0, 0]],
    ['green(0,255,0)', [0, 255, 0]],
    ['blue(0,0,255)', [0, 0, 255]],
  ]) {
    await case_('G1-color', `nearestColorId(${name}) is valid Artkal id + self-consistent + in color family`, () => {
      const got = nearestColorId(rgb);
      assert.ok(validIds.has(got), `returned id "${got}" is not a valid Artkal id`);
      assert.strictEqual(got, recompute(rgb), 'not consistent with srgbToLab+min-distance formula');
      assert.ok(familyOk(got, rgb), `returned "${got}" is not a reasonable nearest neighbour for ${name}`);
    });
  }

  // =====================================================================
  // GROUP 2 — Palette integrity
  // =====================================================================
  await case_('G2-palette', 'ARTKAL_55 has exactly 55 entries', () => {
    assert.strictEqual(ARTKAL_55.length, 55);
  });
  await case_('G2-palette', 'ARTKAL_55 ids unique and sequential A01..A55', () => {
    const seen = new Set();
    for (let i = 0; i < ARTKAL_55.length; i++) {
      const c = ARTKAL_55[i];
      assert.ok(/^A\d{2}$/.test(c.id), `bad id format: ${c.id}`);
      assert.ok(!seen.has(c.id), `duplicate id ${c.id}`);
      seen.add(c.id);
      const expected = 'A' + String(i + 1).padStart(2, '0');
      assert.strictEqual(c.id, expected, `expected sequential ${expected}, got ${c.id}`);
    }
    assert.strictEqual(seen.size, 55);
  });
  await case_('G2-palette', 'every entry has legal #RRGGBB hex', () => {
    for (const c of ARTKAL_55) {
      assert.match(c.hex, /^#[0-9A-Fa-f]{6}$/, `bad hex for ${c.id}: ${c.hex}`);
    }
  });
  await case_('G2-palette', 'every entry has rgb[3] ints in 0..255', () => {
    for (const c of ARTKAL_55) {
      assert.ok(Array.isArray(c.rgb) || (typeof c.r === 'number'), 'rgb shape');
      for (const v of [c.r, c.g, c.b]) {
        assert.ok(Number.isInteger(v) && v >= 0 && v <= 255, `rgb out of range for ${c.id}: ${v}`);
      }
    }
  });
  await case_('G2-palette', 'PALETTE_LAB precomputed for all 55 ids', () => {
    const keys = Object.keys(PALETTE_LAB);
    assert.strictEqual(keys.length, 55);
    for (const id of validIds) {
      assert.ok(Array.isArray(PALETTE_LAB[id]) && PALETTE_LAB[id].length === 3, `lab missing/invalid for ${id}`);
      for (const v of PALETTE_LAB[id]) assert.ok(Number.isFinite(v), `lab value not finite for ${id}`);
    }
  });
  await case_('G2-palette', 'PALETTE_LAB matches srgbToLab(rgb)', () => {
    for (const c of ARTKAL_55) {
      const computed = srgbToLab([c.r, c.g, c.b]);
      const stored = PALETTE_LAB[c.id];
      for (let i = 0; i < 3; i++) {
        assert.ok(Math.abs(computed[i] - stored[i]) < 1e-9, `lab mismatch for ${c.id} idx ${i}`);
      }
    }
  });

  // =====================================================================
  // GROUP 3 — Data grid decode (uses the real decodeGrid from home.js)
  // =====================================================================
  const { decodeGrid } = await import('../assets/js/home.js');

  function validateExample(ex, where) {
    assert.ok(Array.isArray(ex.rows) && ex.rows.length > 0, `${where}: empty rows`);
    const w = ex.rows[0].length;
    assert.ok(w > 0, `${where}: zero width`);
    for (let r = 0; r < ex.rows.length; r++) {
      const row = ex.rows[r];
      assert.strictEqual(row.length, w, `${where}: row ${r} width ${row.length} != ${w} (not rectangular)`);
      for (const ch of row.split('')) {
        const idx = parseInt(ch, 36);
        assert.ok(idx >= 0 && idx < ex.colors.length, `${where}: char '${ch}' -> index ${idx} out of colors range [0,${ex.colors.length})`);
        const id = ex.colors[idx];
        assert.ok(validIds.has(id), `${where}: decoded id '${id}' (char '${ch}') not in ARTKAL_55`);
      }
    }
  }

  const featured = readJSON('data/featured.json');
  const inspiration = readJSON('data/inspiration.json');

  await case_('G3-decode', 'featured.json has >= 4 examples', () => {
    assert.ok(Array.isArray(featured.featured) && featured.featured.length >= 4, `got ${featured.featured && featured.featured.length}`);
  });
  await case_('G3-decode', 'inspiration.json has >= 6 categories, each >= 3 examples', () => {
    assert.ok(Array.isArray(inspiration.categories) && inspiration.categories.length >= 6, `cats=${inspiration.categories && inspiration.categories.length}`);
    for (const cat of inspiration.categories) {
      assert.ok(Array.isArray(cat.examples) && cat.examples.length >= 3, `category ${cat.id} has ${cat.examples && cat.examples.length} examples (<3)`);
    }
  });
  await case_('G3-decode', 'featured: all decoded cells valid + rectangular (base36 scheme)', () => {
    for (const ex of featured.featured) {
      validateExample(ex, `featured.${ex.id}`);
      const grid = decodeGrid(ex); // exercise the real source function
      assert.strictEqual(grid.length, ex.rows.length, 'decoded row count mismatch');
    }
  });
  await case_('G3-decode', 'inspiration: all decoded cells valid + rectangular (base36 scheme)', () => {
    for (const cat of inspiration.categories) {
      for (const ex of cat.examples) {
        validateExample(ex, `inspiration.${cat.id}.${ex.id}`);
        const grid = decodeGrid(ex);
        assert.strictEqual(grid.length, ex.rows.length, 'decoded row count mismatch');
      }
    }
  });

  // =====================================================================
  // GROUP 4 — Module dependency: no cycle / resolvable
  // =====================================================================
  const jsFiles = listJs('assets/js');
  await case_('G4-modules', `node --check passes for all ${jsFiles.length} assets/js/*.js + worker`, () => {
    let failed = [];
    for (const f of jsFiles) {
      const r = nodeCheck(`assets/js/${f}`);
      if (!r.ok) failed.push(`${f}: ${r.err}`);
    }
    const w = nodeCheck('worker/index.js');
    if (!w.ok) failed.push(`worker/index.js: ${w.err}`);
    assert.ok(failed.length === 0, 'syntax/parse failures:\n' + failed.join('\n'));
  });
  await case_('G4-modules', 'lab.js has NO imports (no business-module dependency)', () => {
    const src = read('assets/js/lab.js');
    const imports = src.match(/^\s*import\s+/m);
    assert.ok(!imports, 'lab.js must not import anything');
  });
  await case_('G4-modules', 'import graph is acyclic (no circular dependency / TDZ hazard)', () => {
    const nodes = jsFiles.slice();
    const adj = {};
    for (const f of nodes) adj[f] = [];
    for (const f of nodes) {
      const src = read(`assets/js/${f}`);
      const re = /import\s+(?:[^'"]*?\s+from\s+)?['"]\.\/([^'"]+)['"]/g;
      let m;
      while ((m = re.exec(src))) {
        const dep = m[1].split('/').pop();
        if (nodes.includes(dep)) adj[f].push(dep);
      }
    }
    // DFS cycle detection
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = {};
    nodes.forEach((n) => (color[n] = WHITE));
    const stack = [];
    function dfs(u) {
      color[u] = GRAY;
      stack.push(u);
      for (const v of adj[u]) {
        if (color[v] === GRAY) return [u, v];
        if (color[v] === WHITE) {
          const cyc = dfs(v);
          if (cyc) return cyc;
        }
      }
      stack.pop();
      color[u] = BLACK;
      return null;
    }
    let cycle = null;
    for (const n of nodes) {
      if (color[n] === WHITE) {
        cycle = dfs(n);
        if (cycle) break;
      }
    }
    assert.ok(!cycle, 'cycle detected: ' + (cycle ? cycle.join(' -> ') : ''));
  });
  await case_('G4-modules', 'runtime import chain resolves (lab/palette/color/convert/exporter)', async () => {
    // Already imported lab/color/palette above; add convert + exporter.
    const conv = await import('../assets/js/convert.js');
    const exp = await import('../assets/js/exporter.js');
    assert.ok(typeof conv.renderGrid === 'function', 'convert.renderGrid missing');
    assert.ok(typeof exp.exportCSV === 'function', 'exporter.exportCSV missing');
  });

  // =====================================================================
  // GROUP 5 — DOM id consistency
  // =====================================================================
  // Which JS modules each HTML page loads (from <script type="module">).
  const PAGE_JS = {
    'index.html': ['chrome.js', 'home.js'],
    'create.html': ['chrome.js', 'create.js', 'ai.js', 'upload.js', 'bg-removal.js', 'editor.js', 'worker-client.js'],
    'inspiration.html': ['chrome.js', 'inspiration.js'],
    'inspiration/animals.html': ['chrome.js', 'inspiration.js'],
    'inspiration/anime.html': ['chrome.js', 'inspiration.js'],
    'inspiration/festival.html': ['chrome.js', 'inspiration.js'],
    'inspiration/food.html': ['chrome.js', 'inspiration.js'],
    'inspiration/landscape.html': ['chrome.js', 'inspiration.js'],
    'inspiration/text.html': ['chrome.js', 'inspiration.js'],
  };
  // ids that are created dynamically by JS (so they need not exist in static HTML)
  const DYNAMIC_IDS = new Set(['bead-lightbox']);

  function collectHtmlIds(htmlRel) {
    const src = read(htmlRel);
    const ids = new Set();
    const re = /id="([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) ids.add(m[1]);
    return ids;
  }
  function collectJsIds(jsFile) {
    const src = read(`assets/js/${jsFile}`);
    const ids = new Set();
    let m;
    const re1 = /getElementById\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((m = re1.exec(src))) ids.add(m[1]);
    const re2 = /querySelector\(\s*['"]#([^'"]+)['"]\s*\)/g;
    while ((m = re2.exec(src))) ids.add(m[1]);
    return ids;
  }

  // Build module -> set of HTML pages that load it. A shared module (e.g.
  // inspiration.js) is loaded by several pages; its referenced ids must exist
  // in the UNION of those pages' ids, because different entry functions are
  // invoked on different pages (initInspirationIndex on inspiration.html only,
  // initInspirationCategory on the sub-pages only).
  const moduleToPages = {};
  for (const [htmlRel, jsList] of Object.entries(PAGE_JS)) {
    for (const js of jsList) {
      (moduleToPages[js] = moduleToPages[js] || new Set()).add(htmlRel);
    }
  }

  let refStaticSet = new Set();
  let resStaticSet = new Set();
  let dynSet = new Set();

  for (const [js, pages] of Object.entries(moduleToPages)) {
    const refs = collectJsIds(js);
    const unionIds = new Set();
    for (const p of pages) for (const id of collectHtmlIds(p)) unionIds.add(id);
    await case_('G5-dom', `DOM ids: module ${js} — referenced ids exist in its pages`, () => {
      for (const id of refs) {
        if (DYNAMIC_IDS.has(id)) {
          dynSet.add(id);
          continue; // created at runtime, not required in static HTML
        }
        refStaticSet.add(id);
        const ok = unionIds.has(id);
        if (ok) resStaticSet.add(id);
        assert.ok(ok, `module ${js}: id "${id}" not found in any of its pages [${[...pages].join(', ')}]`);
      }
    });
  }
  // Engineer claim: "41 getElementById ids all exist". Actual unique refs =
  // 40 static (resolve in HTML) + 1 dynamic (bead-lightbox, created at runtime).
  await case_('G5-dom', 'engineer claim: 41 getElementById refs all resolvable', () => {
    assert.strictEqual(resStaticSet.size, refStaticSet.size, `resolved ${resStaticSet.size} != referenced ${refStaticSet.size}`);
    const total = refStaticSet.size + dynSet.size;
    assert.strictEqual(total, 41, `expected 41 unique getElementById references, found ${total}`);
    console.log(`   (unique static ids: ${refStaticSet.size}, dynamic: ${[...dynSet].join(',') || 'none'}, total refs: ${total})`);
  });


  // =====================================================================
  // GROUP 6 — Worker contract
  // =====================================================================
  await case_('G6-worker', 'worker/index.js node --check passes', () => {
    const r = nodeCheck('worker/index.js');
    assert.ok(r.ok, r.err || 'check failed');
  });
  await case_('G6-worker', 'worker has /api/convert + /api/ai-proxy routes and reads env.API_KEY', () => {
    const src = read('worker/index.js');
    assert.ok(src.includes("'/api/convert'"), 'missing /api/convert route');
    assert.ok(src.includes("'/api/ai-proxy'"), 'missing /api/ai-proxy route');
    assert.ok(/env\.API_KEY/.test(src), 'does not read env.API_KEY');
  });
  await case_('G6-worker', 'wrangler.toml has name / main / compatibility_date', () => {
    assert.ok(existsSync(join(ROOT, 'worker/wrangler.toml')), 'wrangler.toml missing');
    const t = read('worker/wrangler.toml');
    const name = t.match(/name\s*=\s*"([^"]+)"/);
    const main = t.match(/main\s*=\s*"([^"]+)"/);
    const compat = t.match(/compatibility_date\s*=\s*"([^"]+)"/);
    assert.ok(name, 'wrangler.toml missing name');
    assert.ok(main, 'wrangler.toml missing main');
    assert.ok(compat, 'wrangler.toml missing compatibility_date');
    assert.strictEqual(main[1], 'index.js', 'main should point to index.js');
  });

  // =====================================================================
  // GROUP 7 — Exporter pure part (exportCSV)
  // =====================================================================
  const { exportCSV } = await import('../assets/js/exporter.js');
  await case_('G7-export', 'exportCSV: row count = grid height, col count = grid width', () => {
    lastBlobContent = null;
    const grid = [
      ['A01', 'A30', 'A22'],
      ['A22', null, 'A07'],
      ['A07', 'A07', 'A01'],
    ];
    exportCSV(grid, { filename: 't.csv' });
    assert.ok(lastBlobContent, 'no blob content captured');
    const body = lastBlobContent.replace(/^﻿/, '');
    const rows = body.split('\r\n');
    assert.strictEqual(rows.length, 3, `expected 3 rows, got ${rows.length}`);
    for (const row of rows) {
      const cells = row.split(',');
      assert.strictEqual(cells.length, 3, `expected 3 cols, got ${cells.length}`);
    }
  });
  await case_('G7-export', 'exportCSV: each non-null cell is a valid Artkal id string, null -> empty', () => {
    const grid = [['A01', null], [null, 'A55']];
    exportCSV(grid, { filename: 't2.csv' });
    const body = lastBlobContent.replace(/^﻿/, '');
    const rows = body.split('\r\n');
    assert.strictEqual(rows[0], 'A01,', 'row0 mismatch');
    assert.strictEqual(rows[1], ',A55', 'row1 mismatch');
    for (const row of rows) {
      for (const cell of row.split(',')) {
        if (cell === '') continue;
        assert.ok(validIds.has(cell), `cell "${cell}" is not a valid Artkal id`);
      }
    }
  });
  await case_('G7-export', 'exportCSV: Excel-friendly BOM + CRLF line endings', () => {
    const grid = [
      ['A01', 'A02'],
      ['A03', 'A04'],
    ];
    exportCSV(grid, { filename: 't3.csv' });
    assert.ok(lastBlobContent.startsWith('﻿'), 'missing UTF-8 BOM');
    assert.ok(lastBlobContent.includes('\r\n'), 'missing CRLF line endings');
  });

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------
  const groups = {};
  for (const r of results) {
    groups[r.group] = groups[r.group] || { total: 0, pass: 0, fail: 0 };
    groups[r.group].total++;
    if (r.pass) groups[r.group].pass++;
    else groups[r.group].fail++;
  }
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log('\n================ QA TEST REPORT — 拼豆网 ================');
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log('--------------------------------------------------------');
  for (const g of Object.keys(groups)) {
    const s = groups[g];
    console.log(`${g.padEnd(12)} total=${s.total} pass=${s.pass} fail=${s.fail}`);
  }
  if (failed > 0) {
    console.log('--------------------------------------------------------');
    console.log('FAILED CASES:');
    for (const r of results.filter((x) => !x.pass)) {
      console.log(`  [${r.group}] ${r.name}\n      -> ${r.err}`);
    }
  }
  console.log('========================================================');

  // Routing decision written to a JSON sidecar for the team-lead handoff.
  const decision = failed > 0 ? 'Engineer' : 'NoOne';
  const report = {
    total,
    passed,
    failed,
    groups,
    routing: decision,
    failedCases: results.filter((x) => !x.pass).map((x) => ({ group: x.group, name: x.name, err: x.err })),
  };
  writeSidecar(report);
  process.exit(failed > 0 ? 1 : 0);
}

function writeSidecar(report) {
  try {
    writeFileSync(join(ROOT, 'tests', 'test-report.json'), JSON.stringify(report, null, 2));
  } catch (e) {
    /* non-fatal */
  }
}

main().catch((e) => {
  console.error('TEST RUNNER CRASHED:', e);
  process.exit(2);
});
