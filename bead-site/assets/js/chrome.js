// chrome.js — 全站统一主题控制、页头导航、页脚与赞助弹窗
// 视觉样式统一由 assets/css/theme.css 提供，此处只负责结构与行为。

/* ------------------------------------------------------------------ *
 * 主题
 * ------------------------------------------------------------------ */
export function initTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeButton();
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('site-theme', target);
  updateThemeButton();
  window.dispatchEvent(new Event('site:themechange'));
}

export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function updateThemeButton() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const label = isDark ? '亮色模式' : '暗色模式';
  const icon = isDark ? '☀️' : '🌙';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = `<span aria-hidden="true">${icon}</span><span>${label}</span>`;
  });
}

/* ------------------------------------------------------------------ *
 * 赞助支持弹窗
 * ------------------------------------------------------------------ */
function injectSponsorModal() {
  if (document.getElementById('sponsor-modal')) return;

  // 子目录页面（如 inspiration/xxx.html）需要回退到站点根
  const BASE = location.pathname.includes('/inspiration/') ? '../' : '';

  const modalHtml = `
    <div id="sponsor-modal" class="modal-backdrop sponsor-backdrop" role="dialog" aria-modal="true" aria-label="赞助支持">
      <div class="modal-dialog sponsor-dialog">
        <button id="sponsor-close-btn" class="modal-close-btn" type="button" aria-label="关闭">&times;</button>

        <div id="sponsor-step-pay">
          <div style="text-align:center;margin-bottom:18px;">
            <span class="section-label section-label--plain" style="margin-bottom:12px;">Support</span>
            <h3 style="margin:0;font-size:21px;">赞助支持</h3>
            <p class="muted" style="font-size:13.5px;margin:10px auto 0;max-width:380px;line-height:1.7;">
              如果拼豆工具为你的创作提供了帮助，欢迎赞助支持服务器维护与功能开发。
            </p>
            <div class="sponsor-amount-badge">赞助金额：<strong>¥ 5.00</strong></div>
          </div>

          <div class="sponsor-tabs">
            <button id="tab-wechat" class="sponsor-tab active" type="button">微信支付</button>
            <button id="tab-alipay" class="sponsor-tab" type="button">支付宝</button>
          </div>

          <div class="sponsor-qr-box">
            <div id="qr-wechat" class="qr-panel active" style="text-align:center;">
              <img src="${BASE}assets/images/wechat-pay.png" alt="微信收款码" style="width:180px;height:180px;object-fit:contain;border-radius:10px;background:#fff;padding:6px;box-shadow:var(--shadow-sm);" onerror="this.parentElement.innerHTML='&lt;div style=&quot;padding:30px 10px;color:var(--muted-foreground);font-size:13px;&quot;&gt;请将微信收款码放置于&lt;br&gt;&lt;code&gt;assets/images/wechat-pay.png&lt;/code&gt;&lt;/div&gt;'" />
              <p style="margin:10px 0 0;font-size:12px;color:#16a34a;font-weight:600;">微信扫码赞助</p>
            </div>
            <div id="qr-alipay" class="qr-panel" style="text-align:center;">
              <img src="${BASE}assets/images/alipay.png" alt="支付宝收款码" style="width:180px;height:180px;object-fit:contain;border-radius:10px;background:#fff;padding:6px;box-shadow:var(--shadow-sm);" onerror="this.parentElement.innerHTML='&lt;div style=&quot;padding:30px 10px;color:var(--muted-foreground);font-size:13px;&quot;&gt;请将支付宝收款码放置于&lt;br&gt;&lt;code&gt;assets/images/alipay.png&lt;/code&gt;&lt;/div&gt;'" />
              <p style="margin:10px 0 0;font-size:12px;color:var(--accent);font-weight:600;">支付宝扫码赞助</p>
            </div>
          </div>

          <div style="margin-top:18px;">
            <button id="btn-confirm-sponsored" class="btn btn-primary btn-block" type="button">已完成赞助</button>
          </div>
        </div>

        <div id="sponsor-step-thanks" style="display:none;text-align:center;padding:18px 10px;">
          <h3 style="font-size:21px;margin:0 0 10px;">感谢支持</h3>
          <div class="sponsor-thanks-card">
            <p style="margin:0;font-size:14px;line-height:1.75;">已收到你的赞助，感谢对本站的支持，祝你拼豆创作愉快。</p>
          </div>
          <button id="btn-close-thanks" class="btn btn-primary" type="button" style="margin-top:20px;">关闭</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('sponsor-modal');
  const closeBtn = document.getElementById('sponsor-close-btn');
  const tabWechat = document.getElementById('tab-wechat');
  const tabAlipay = document.getElementById('tab-alipay');
  const qrWechat = document.getElementById('qr-wechat');
  const qrAlipay = document.getElementById('qr-alipay');
  const btnConfirm = document.getElementById('btn-confirm-sponsored');
  const stepPay = document.getElementById('sponsor-step-pay');
  const stepThanks = document.getElementById('sponsor-step-thanks');
  const btnCloseThanks = document.getElementById('btn-close-thanks');

  const close = () => modal.classList.remove('open');
  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', e => {
    if (e.target === modal) close();
  });

  tabWechat?.addEventListener('click', () => {
    tabWechat.classList.add('active');
    tabAlipay.classList.remove('active');
    qrWechat.classList.add('active');
    qrAlipay.classList.remove('active');
  });

  tabAlipay?.addEventListener('click', () => {
    tabAlipay.classList.add('active');
    tabWechat.classList.remove('active');
    qrAlipay.classList.add('active');
    qrWechat.classList.remove('active');
  });

  btnConfirm?.addEventListener('click', () => {
    stepPay.style.display = 'none';
    stepThanks.style.display = 'block';
  });

  btnCloseThanks?.addEventListener('click', () => {
    close();
    setTimeout(() => {
      stepPay.style.display = 'block';
      stepThanks.style.display = 'none';
    }, 250);
  });
}

/* ------------------------------------------------------------------ *
 * 滚动淡入
 * ------------------------------------------------------------------ */
function initReveal() {
  const targets = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => el.classList.add('is-visible'), Math.min(i, 6) * 90);
        observer.unobserve(el);
      });
    },
    { rootMargin: '-60px 0px', threshold: 0.15 }
  );
  targets.forEach(el => observer.observe(el));
}

/* ------------------------------------------------------------------ *
 * 页头 / 页脚
 * ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { key: 'home', href: 'index.html', label: '首页' },
  { key: 'create', href: 'create.html', label: '创作工坊' },
  { key: 'whiteboard', href: 'whiteboard.html', label: '白板画板' },
  { key: 'inspiration', href: 'inspiration.html', label: '灵感图库' },
  { key: 'tutorial', href: 'tutorial.html', label: '制作教程' },
];

function resolveActivePage(activePage) {
  const href = (window.location.href || window.location.pathname || '').toLowerCase();
  if (href.includes('whiteboard')) return 'whiteboard';
  if (href.includes('create')) return 'create';
  if (href.includes('inspiration')) return 'inspiration';
  if (href.includes('tutorial')) return 'tutorial';
  if (href.endsWith('/') || href.includes('index')) return 'home';
  return activePage;
}

export function injectChrome(activePage = '') {
  initTheme();

  const page = resolveActivePage(activePage);
  const header = document.getElementById('site-header');

  if (header) {
    const desktopLinks = NAV_ITEMS.map(
      item =>
        `<a href="${item.href}" class="nav-link ${page === item.key ? 'active' : ''}">${item.label}</a>`
    ).join('');

    const mobileLinks = NAV_ITEMS.map(
      item =>
        `<li><a href="${item.href}" class="nav-mobile-link ${page === item.key ? 'active' : ''}">${item.label}</a></li>`
    ).join('');

    header.innerHTML = `
      <header class="site-nav-header">
        <div class="nav-container">
          <a href="index.html" class="nav-brand">
            <span class="nav-brand-mark" aria-hidden="true">M</span>
            <span>Micheal 的拼豆网</span>
          </a>

          <nav class="nav-desktop-menu" aria-label="主导航">${desktopLinks}</nav>

          <div class="nav-actions">
            <button class="sponsor-btn-compact" id="btn-open-sponsor" type="button">赞助支持</button>
            <button class="theme-toggle-btn" id="theme-toggle-btn" type="button" aria-label="切换主题">暗色模式</button>
            <button class="nav-hamburger-btn" id="nav-hamburger-btn" type="button" aria-label="切换菜单" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div class="nav-mobile-dropdown" id="nav-mobile-dropdown">
          <ul class="nav-mobile-list">
            ${mobileLinks}
            <li><a href="javascript:void(0)" class="nav-mobile-link" id="mobile-sponsor-btn">赞助支持</a></li>
          </ul>
        </div>
      </header>
    `;

    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);

    const hamburgerBtn = document.getElementById('nav-hamburger-btn');
    const mobileDropdown = document.getElementById('nav-mobile-dropdown');

    hamburgerBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = mobileDropdown.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', e => {
      if (mobileDropdown && !mobileDropdown.contains(e.target) && !hamburgerBtn?.contains(e.target)) {
        mobileDropdown.classList.remove('open');
        hamburgerBtn?.classList.remove('active');
        hamburgerBtn?.setAttribute('aria-expanded', 'false');
      }
    });

    injectSponsorModal();
    const openSponsor = () => document.getElementById('sponsor-modal')?.classList.add('open');
    document.getElementById('btn-open-sponsor')?.addEventListener('click', openSponsor);
    document.getElementById('mobile-sponsor-btn')?.addEventListener('click', () => {
      mobileDropdown?.classList.remove('open');
      hamburgerBtn?.classList.remove('active');
      openSponsor();
    });
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <div>
            <div class="site-footer-brand">Micheal 的拼豆网</div>
            <p style="margin-top:6px;">在线拼豆图纸生成器 · 上传图片即可获得色号图纸与用量清单</p>
          </div>
          <nav class="site-footer-links" aria-label="页脚导航">
            <a href="create.html">创作工坊</a>
            <a href="whiteboard.html">白板画板</a>
            <a href="inspiration.html">灵感图库</a>
            <a href="tutorial.html">制作教程</a>
          </nav>
          <p>© 2026 Micheal</p>
        </div>
      </footer>
    `;
  }

  initReveal();
  window.addEventListener('site:themechange', () => {
    setTimeout(initReveal, 40);
  });
}
