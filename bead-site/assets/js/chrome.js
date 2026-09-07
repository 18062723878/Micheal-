// 主题控制
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

function updateThemeButton() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const label = isDark ? '亮色模式' : '暗色模式';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = label;
  });
}

// 赞助支持弹窗
function injectSponsorModal() {
  if (document.getElementById('sponsor-modal')) return;

  const modalHtml = `
    <div id="sponsor-modal" class="sponsor-backdrop">
      <div class="sponsor-dialog">
        <button id="sponsor-close-btn" class="sponsor-close" type="button">&times;</button>
        
        <div id="sponsor-step-pay">
          <div style="text-align: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: var(--text-main); font-size: 20px;">赞助支持</h3>
            <p style="color: var(--text-muted); font-size: 13px; margin: 8px auto 0; max-width: 380px; line-height: 1.6;">
              如果拼豆工具为你的创作提供了帮助，欢迎赞助支持服务器维护与功能开发。
            </p>
            <div class="sponsor-amount-badge">赞助金额：<strong>¥ 5.00</strong></div>
          </div>

          <div class="sponsor-tabs">
            <button id="tab-wechat" class="sponsor-tab active" type="button">微信支付</button>
            <button id="tab-alipay" class="sponsor-tab" type="button">支付宝</button>
          </div>

          <div class="sponsor-qr-box">
            <div id="qr-wechat" class="qr-panel active" style="text-align: center;">
              <img src="assets/images/wechat-pay.png" alt="微信收款码" onerror="this.parentElement.innerHTML='<div style=\\'padding:30px 10px; color:var(--text-muted); font-size:13px;\\'>请将微信收款码放置于<br><code>assets/images/wechat-pay.png</code></div>'" style="width: 180px; height: 180px; object-fit: contain; border-radius: 8px; background: #ffffff; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #16a34a; font-weight: 600;">微信扫码赞助</p>
            </div>
            
            <div id="qr-alipay" class="qr-panel" style="text-align: center;">
              <img src="assets/images/alipay.png" alt="支付宝收款码" onerror="this.parentElement.innerHTML='<div style=\\'padding:30px 10px; color:var(--text-muted); font-size:13px;\\'>请将支付宝收款码放置于<br><code>assets/images/alipay.png</code></div>'" style="width: 180px; height: 180px; object-fit: contain; border-radius: 8px; background: #ffffff; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #2563eb; font-weight: 600;">支付宝扫码赞助</p>
            </div>
          </div>

          <div style="margin-top: 18px; text-align: center;">
            <button id="btn-confirm-sponsored" class="btn btn-primary" type="button" style="width: 100%; padding: 11px; font-weight: 600;">
              已完成赞助
            </button>
          </div>
        </div>

        <div id="sponsor-step-thanks" style="display: none; text-align: center; padding: 18px 10px;">
          <h3 style="color: var(--text-main); font-size: 20px; margin: 0 0 10px 0;">感谢支持</h3>
          <div class="sponsor-thanks-card">
            <p style="margin: 0; font-size: 14px; line-height: 1.7; color: var(--text-main);">
              已收到你的赞助，感谢对本站的支持，祝你拼豆创作愉快。
            </p>
          </div>
          <button id="btn-close-thanks" class="btn btn-primary" type="button" style="margin-top: 20px; padding: 9px 24px;">
            关闭
          </button>
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

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

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
    modal.classList.remove('open');
    setTimeout(() => {
      stepPay.style.display = 'block';
      stepThanks.style.display = 'none';
    }, 250);
  });
}

function injectHeaderStyles() {
  if (document.getElementById('unified-header-style')) return;

  const style = document.createElement('style');
  style.id = 'unified-header-style';
  style.textContent = `
    .site-nav-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .nav-brand {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-main);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .nav-desktop-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-link {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
      text-decoration: none;
      white-space: nowrap;
      transition: color 0.15s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--primary);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .sponsor-btn-compact {
      background: var(--primary);
      color: #ffffff !important;
      border: 1px solid var(--primary);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s ease;
    }
    .sponsor-btn-compact:hover {
      background: var(--primary-hover);
    }
    .theme-toggle-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-main);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s ease;
    }
    .theme-toggle-btn:hover {
      background: var(--bg-page);
    }

    /* 移动端汉堡菜单 (三条杠) */
    .nav-hamburger-btn {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 4px;
      width: 36px;
      height: 36px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }
    .nav-hamburger-btn span {
      display: block;
      width: 18px;
      height: 2px;
      background-color: var(--text-main);
      border-radius: 2px;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .nav-hamburger-btn.active span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    .nav-hamburger-btn.active span:nth-child(2) {
      opacity: 0;
    }
    .nav-hamburger-btn.active span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    /* 下拉抽屉 */
    .nav-mobile-dropdown {
      display: none;
      background: var(--bg-card);
      border-top: 1px solid var(--border-color);
      padding: 8px 16px 14px;
    }
    .nav-mobile-dropdown.open {
      display: block;
      animation: navSlideDown 0.2s ease-out;
    }
    @keyframes navSlideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .nav-mobile-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-mobile-link {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .nav-mobile-link:hover, .nav-mobile-link.active {
      background: var(--bg-secondary);
      color: var(--primary);
    }

    @media (max-width: 768px) {
      .nav-desktop-menu { display: none !important; }
      .nav-hamburger-btn { display: flex !important; }
      .nav-brand { font-size: 16px; }
      .sponsor-btn-compact { display: none; }
    }
  `;
  document.head.appendChild(style);
}

// 页面导航注入函数 (带 URL 智能自适应纠错)
export function injectChrome(activePage = '') {
  initTheme();
  injectHeaderStyles();

  // 根据当前实际网址路径进行智能判断，确保高亮百分之百准确
  const path = (window.location.pathname || '').toLowerCase();
  if (path.includes('whiteboard')) {
    activePage = 'whiteboard';
  } else if (path.includes('create')) {
    activePage = 'create';
  } else if (path.includes('inspiration')) {
    activePage = 'inspiration';
  } else if (path.includes('tutorial')) {
    activePage = 'tutorial';
  } else if (!activePage || path.endsWith('/') || path.includes('index')) {
    activePage = 'home';
  }

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header class="site-nav-header">
        <div class="nav-container">
          <a href="index.html" class="nav-brand">Micheal 的拼豆网</a>

          <nav class="nav-desktop-menu">
            <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">首页</a>
            <a href="create.html" class="nav-link ${activePage === 'create' ? 'active' : ''}">创作工坊</a>
            <a href="whiteboard.html" class="nav-link ${activePage === 'whiteboard' ? 'active' : ''}">白板画板</a>
            <a href="inspiration.html" class="nav-link ${activePage === 'inspiration' ? 'active' : ''}">灵感图库</a>
            <a href="tutorial.html" class="nav-link ${activePage === 'tutorial' ? 'active' : ''}">制作教程</a>
          </nav>

          <div class="nav-actions">
            <button class="sponsor-btn-compact" id="btn-open-sponsor" type="button">赞助支持</button>
            <button class="theme-toggle-btn" id="theme-toggle-btn" type="button">暗色模式</button>
            <button class="nav-hamburger-btn" id="nav-hamburger-btn" type="button" aria-label="切换菜单">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div class="nav-mobile-dropdown" id="nav-mobile-dropdown">
          <ul class="nav-mobile-list">
            <li><a href="index.html" class="nav-mobile-link ${activePage === 'home' ? 'active' : ''}">首页</a></li>
            <li><a href="create.html" class="nav-mobile-link ${activePage === 'create' ? 'active' : ''}">创作工坊</a></li>
            <li><a href="whiteboard.html" class="nav-mobile-link ${activePage === 'whiteboard' ? 'active' : ''}">白板画板</a></li>
            <li><a href="inspiration.html" class="nav-mobile-link ${activePage === 'inspiration' ? 'active' : ''}">灵感图库</a></li>
            <li><a href="tutorial.html" class="nav-mobile-link ${activePage === 'tutorial' ? 'active' : ''}">制作教程</a></li>
            <li><a href="javascript:void(0)" class="nav-mobile-link" id="mobile-sponsor-btn">赞助支持</a></li>
          </ul>
        </div>
      </header>
    `;

    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    updateThemeButton();

    const hamburgerBtn = document.getElementById('nav-hamburger-btn');
    const mobileDropdown = document.getElementById('nav-mobile-dropdown');

    hamburgerBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDropdown.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (mobileDropdown && !mobileDropdown.contains(e.target) && e.target !== hamburgerBtn) {
        mobileDropdown.classList.remove('open');
        hamburgerBtn?.classList.remove('active');
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
      <footer style="text-align: center; padding: 32px 20px; color: var(--text-muted); font-size: 13px; border-top: 1px solid var(--border-color); margin-top: 48px;">
        <p style="margin: 0 0 6px 0;">Micheal 的拼豆网 · 在线拼豆设计工具</p>
        <p style="margin: 0;">2026 Micheal</p>
      </footer>
    `;
  }
}
