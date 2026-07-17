// inspiration.js — render the inspiration index and per-category subpages.
// Shared by inspiration.html (index) and inspiration/<cat>.html (subpages).
import { renderGrid } from './convert.js';
import { exportPNG, exportCSV, exportPDF } from './exporter.js';
import { decodeGrid } from './home.js';

let _data = null;

// Data lives at the site root; resolve the correct relative path from any depth.
const DATA_URL = location.pathname.includes('/inspiration/')
  ? '../data/inspiration.json'
  : 'data/inspiration.json';

async function loadData() {
  if (_data) return _data;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('无法加载 ' + DATA_URL);
  _data = await res.json();
  return _data;
}

/**
 * Render the inspiration index (category cards) into #category-grid.
 */
export async function initInspirationIndex() {
  const wrap = document.getElementById('category-grid');
  if (!wrap) return;
  try {
    const data = await loadData();
    wrap.innerHTML = '';
    data.categories.forEach((cat) => {
      const first = cat.examples[0];
      const grid = decodeGrid(first);
      const card = document.createElement('a');
      card.className = 'card category-card';
      card.href = `inspiration/${cat.id}.html`;
      const thumb = document.createElement('div');
      thumb.className = 'category-thumb';
      const cv = document.createElement('canvas');
      cv.className = 'category-canvas';
      renderGrid(cv, grid, Math.max(4, Math.floor(140 / grid[0].length)), { labels: false });
      thumb.appendChild(cv);
      const body = document.createElement('div');
      body.className = 'category-body';
      body.innerHTML = `<h3>${cat.name}</h3><p>${cat.examples.length} 个示例</p>`;
      card.appendChild(thumb);
      card.appendChild(body);
      wrap.appendChild(card);
    });
  } catch (e) {
    wrap.innerHTML = `<p class="error">灵感加载失败：${e.message}</p>`;
  }
}

/**
 * Render one category's examples into #example-grid and wire the lightbox.
 * @param {string} categoryId e.g. "anime"
 */
export async function initInspirationCategory(categoryId) {
  const wrap = document.getElementById('example-grid');
  const titleEl = document.getElementById('category-title');
  const descEl = document.getElementById('category-desc');
  if (!wrap) return;
  try {
    const data = await loadData();
    const cat = data.categories.find((c) => c.id === categoryId);
    if (!cat) {
      wrap.innerHTML = '<p class="error">未找到该分类</p>';
      return;
    }
    if (titleEl) titleEl.textContent = cat.name;
    if (descEl) descEl.textContent = `共 ${cat.examples.length} 个 ${cat.name} 拼豆示例，点击查看大图与做法。`;
    wrap.innerHTML = '';
    cat.examples.forEach((ex) => {
      const grid = decodeGrid(ex);
      const card = document.createElement('article');
      card.className = 'card example-card';
      card.dataset.grid = JSON.stringify(grid);
      card.dataset.title = ex.title;
      card.dataset.tip = ex.tip || '';
      const thumb = document.createElement('div');
      thumb.className = 'example-thumb';
      const cv = document.createElement('canvas');
      cv.className = 'example-canvas';
      renderGrid(cv, grid, Math.max(4, Math.floor(150 / grid[0].length)), { labels: false });
      thumb.appendChild(cv);
      const body = document.createElement('div');
      body.className = 'example-body';
      body.innerHTML = `<h4>${ex.title}</h4><p>${ex.tip || ''}</p>`;
      card.appendChild(thumb);
      card.appendChild(body);
      card.addEventListener('click', () => openLightbox(card.dataset.grid, card.dataset.title, card.dataset.tip));
      wrap.appendChild(card);
    });
  } catch (e) {
    wrap.innerHTML = `<p class="error">灵感加载失败：${e.message}</p>`;
  }
}

/**
 * Lightweight modal showing a large grid + how-to + export buttons.
 */
function openLightbox(gridJson, title, tip) {
  const grid = JSON.parse(gridJson);
  let modal = document.getElementById('bead-lightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bead-lightbox';
    modal.className = 'lightbox';
    modal.innerHTML = `
      <div class="lightbox-panel">
        <button class="lightbox-close" aria-label="关闭">×</button>
        <h3 class="lightbox-title"></h3>
        <div class="lightbox-canvas-wrap"><canvas class="lightbox-canvas"></canvas></div>
        <p class="lightbox-tip"></p>
        <div class="lightbox-actions">
          <button class="btn btn-primary wb-exp-png">导出 PNG</button>
          <button class="btn wb-exp-csv">导出 CSV</button>
          <button class="btn wb-exp-pdf">导出 PDF</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.lightbox-close').addEventListener('click', () => modal.classList.remove('is-open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
    modal.querySelector('.wb-exp-png').addEventListener('click', () => exportPNG(grid, { cell: 18, filename: `${title}.png` }));
    modal.querySelector('.wb-exp-csv').addEventListener('click', () => exportCSV(grid, { filename: `${title}.csv` }));
    modal.querySelector('.wb-exp-pdf').addEventListener('click', () => exportPDF(grid, { cell: 14, filename: `${title}.pdf` }));
  }
  modal.querySelector('.lightbox-title').textContent = title;
  modal.querySelector('.lightbox-tip').textContent = '做法：' + tip;
  const cv = modal.querySelector('.lightbox-canvas');
  renderGrid(cv, grid, Math.max(6, Math.floor(360 / grid[0].length)), { labels: false });
  modal.classList.add('is-open');
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.initInspirationIndex = initInspirationIndex;
BeadStudio.initInspirationCategory = initInspirationCategory;
