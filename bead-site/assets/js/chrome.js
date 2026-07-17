// chrome.js — shared site header (nav) and footer injection.
// Pages call injectChrome(active, base) where base is '' for root pages and
// '../' for pages inside inspiration/.

const NAV = [
  { id: 'home', label: '首页', href: 'index.html' },
  { id: 'create', label: '创作', href: 'create.html' },
  { id: 'inspiration', label: '灵感', href: 'inspiration.html' }
];

const BEAD_ICON = `<svg class="logo-icon" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
  <circle cx="16" cy="16" r="14" fill="#3b82f6"/>
  <circle cx="16" cy="16" r="14" fill="none" stroke="#1e3a8a" stroke-width="2"/>
  <circle cx="11" cy="11" r="3.2" fill="#bfdbfe"/>
  <circle cx="21" cy="21" r="2.2" fill="#1e3a8a" opacity="0.5"/>
</svg>`;

/**
 * Inject the shared header and footer into the current page.
 * @param {string} active one of 'home' | 'create' | 'inspiration'
 * @param {string} [base] relative path prefix (default '')
 */
export function injectChrome(active, base = '') {
  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <a class="logo" href="${base}index.html">
        ${BEAD_ICON}
        <span>Micheal 的拼豆网</span>
      </a>
      <nav class="site-nav">
        ${NAV.map((n) => `<a href="${base}${n.href}" class="${n.id === active ? 'is-active' : ''}">${n.label}</a>`).join('')}
      </nav>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <p>Micheal 的拼豆网 · 把每张图片变成可拼的图纸</p>
      <p class="sign">— Michael</p>`;
  }
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.injectChrome = injectChrome;
