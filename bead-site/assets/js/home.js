// home.js — render the homepage featured patterns and step-by-step tutorials.
import { renderGrid } from './convert.js';

/** Decode an example object ({colors, rows}) into a 2D array of color ids. */
export function decodeGrid(ex) {
  return ex.rows.map((row) =>
    row.split('').map((ch) => ex.colors[parseInt(ch, 36)])
  );
}

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('无法加载 ' + url);
  return res.json();
}

/**
 * Initialize the homepage. Looks for #featured-grid and #tutorial-steps.
 */
export async function initHome() {
  await Promise.all([renderFeatured(), renderTutorials()]);
}

async function renderFeatured() {
  const wrap = document.getElementById('featured-grid');
  if (!wrap) return;
  try {
    const data = await loadJson('data/featured.json');
    wrap.innerHTML = '';
    data.featured.forEach((ex) => {
      const grid = decodeGrid(ex);
      const card = document.createElement('article');
      card.className = 'card feature-card';
      const thumb = document.createElement('div');
      thumb.className = 'feature-thumb';
      const cv = document.createElement('canvas');
      cv.className = 'feature-canvas';
      renderGrid(cv, grid, Math.max(4, Math.floor(200 / grid[0].length)), { labels: false });
      thumb.appendChild(cv);
      const body = document.createElement('div');
      body.className = 'feature-body';
      body.innerHTML = `
        <h3>${ex.title}</h3>
        <p>${ex.desc}</p>
        <p class="feature-tip">做法：${ex.tip || ''}</p>
        <a class="btn btn-primary" href="create.html">用这张图创作 →</a>`;
      card.appendChild(thumb);
      card.appendChild(body);
      wrap.appendChild(card);
    });
  } catch (e) {
    wrap.innerHTML = `<p class="error">示例加载失败：${e.message}</p>`;
  }
}

async function renderTutorials() {
  const wrap = document.getElementById('tutorial-steps');
  if (!wrap) return;
  try {
    const data = await loadJson('data/tutorials.json');
    wrap.innerHTML = '';
    data.steps.forEach((s) => {
      const step = document.createElement('div');
      step.className = 'tutorial-step';
      step.innerHTML = `
        <div class="tutorial-num">${s.n}</div>
        <div class="tutorial-text">
          <h4>${s.title}</h4>
          <p>${s.text}</p>
        </div>`;
      wrap.appendChild(step);
    });
  } catch (e) {
    wrap.innerHTML = `<p class="error">教程加载失败：${e.message}</p>`;
  }
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.initHome = initHome;
BeadStudio.decodeGrid = decodeGrid;
