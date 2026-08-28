// 主题自动检测与切换逻辑
export function initTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('site-theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeButton();
    }
  });
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('site-theme', target);
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? '🌙 暗色' : '☀️ 亮色';
  }
}

// 注入赞助弹窗 DOM
function injectSponsorModal() {
  if (document.getElementById('sponsor-modal')) return;

  const modalHtml = `
    <div id="sponsor-modal" class="sponsor-backdrop">
      <div class="sponsor-dialog">
        <button id="sponsor-close-btn" class="sponsor-close">&times;</button>
        
        <!-- 阶段 1：赞助支付展示区 -->
        <div id="sponsor-step-pay">
          <div style="text-align: center; margin-bottom: 18px;">
            <div style="font-size: 32px; margin-bottom: 4px;">☕</div>
            <h3 style="margin: 0; color: var(--text-main); font-size: 20px;">请 Micheal 喝杯热咖啡</h3>
            <p style="color: var(--text-muted); font-size: 13px; margin: 8px auto 0; max-width: 380px; line-height: 1.6;">
              如果这个拼豆工具为你的创作带来了便利与灵感，欢迎赞助支持！你的每一份鼓励都是网站持续维护与扩充图库的最大动力～
            </p>
            <div class="sponsor-amount-badge">推荐赞助：<strong>¥ 5.00</strong> 元</div>
          </div>

          <!-- 支付通道切换 -->
          <div class="sponsor-tabs">
            <button id="tab-wechat" class="sponsor-tab active" type="button">💚 微信支付</button>
            <button id="tab-alipay" class="sponsor-tab" type="button">💙 支付宝</button>
          </div>

          <!-- 二维码展示区域 (可替换为你的真实收款码图片) -->
          <div class="sponsor-qr-box">
            <div id="qr-wechat" class="qr-panel active">
              <div class="qr-placeholder">
                <div style="font-size: 40px; margin-bottom: 8px;">📱</div>
                <span style="font-weight: 700; color: #16a34a;">微信扫码赞助 ¥5</span>
                <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">(可在代码中将此处替换为你的微信收款码)</span>
              </div>
            </div>
            <div id="qr-alipay" class="qr-panel">
              <div class="qr-placeholder">
                <div style="font-size: 40px; margin-bottom: 8px;">⚡</div>
                <span style="font-weight: 700; color: #2563eb;">支付宝扫码赞助 ¥5</span>
                <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">(可在代码中将此处替换为你的支付宝收款码)</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button id="btn-confirm-sponsored" class="btn btn-primary" style="width: 100%; padding: 12px; font-weight: 700;">
              ✨ 我已完成赞助
            </button>
          </div>
        </div>

        <!-- 阶段 2：赞助感谢回馈区 -->
        <div id="sponsor-step-thanks" style="display: none; text-align: center; padding: 20px 10px;">
          <div style="font-size: 48px; margin-bottom: 12px; animation: bounce 1s infinite;">🎉</div>
          <h3 style="color: var(--text-main); font-size: 22px; margin: 0 0 10px 0;">非常感谢你的温暖赞助！</h3>
          <div class="sponsor-thanks-card">
            <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: var(--text-main);">
              “已经收到你的咖啡支持啦！因为有你的认可，代码的每个像素都变得更加有意义。我会继续努力优化设计工坊、增加更多有趣的图纸功能！”
            </p>
            <p style="margin: 0; font-size: 13px; font-weight: 700; color: var(--primary);">
              — Micheal 敬上 ❤️ 祝你拼出独一无二的精美作品！
            </p>
          </div>
          <button id="btn-close-thanks" class="btn btn-primary" style="margin-top: 22px; padding: 10px 28px;">
            开心收下，继续创作 ✨
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // 绑定弹窗事件
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

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  tabWechat.addEventListener('click', () => {
    tabWechat.classList.add('active');
    tabAlipay.classList.remove('active');
    qrWechat.classList.add('active');
    qrAlipay.classList.remove('active');
  });

  tabAlipay.addEventListener('click', () => {
    tabAlipay.classList.add('active');
    tabWechat.classList.remove('active');
    qrAlipay.classList.add('active');
    qrWechat.classList.remove('active');
  });

  btnConfirm.addEventListener('click', () => {
    stepPay.style.display = 'none';
    stepThanks.style.display = 'block';
  });

  btnCloseThanks.addEventListener('click', () => {
    modal.classList.remove('open');
    setTimeout(() => {
      stepPay.style.display = 'block';
      stepThanks.style.display = 'none';
    }, 300);
  });
}

// 注入全站统一顶栏与底栏
export function injectChrome(activePage = 'home') {
  initTheme();

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header style="background: var(--bg-card); border-bottom: 1px solid var(--border-color); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow);">
        <a href="index.html" style="font-size: 18px; font-weight: 800; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 8px;">
          <span>🔵</span> Micheal 的拼豆网
        </a>
        <nav style="display: flex; align-items: center; gap: 16px;">
          <a href="index.html" style="color: ${activePage === 'home' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'home' ? '700' : '500'}; font-size: 14px;">首页</a>
          <a href="create.html" style="color: ${activePage === 'create' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'create' ? '700' : '500'}; font-size: 14px;">创作</a>
          <a href="inspiration.html" style="color: ${activePage === 'inspiration' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'inspiration' ? '700' : '500'}; font-size: 14px;">灵感</a>
          <a href="tutorial.html" style="color: ${activePage === 'tutorial' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'tutorial' ? '700' : '500'}; font-size: 14px;">教程</a>
          
          <!-- 赞助触发按钮 -->
          <button id="btn-open-sponsor" class="sponsor-nav-btn" type="button">
            ☕ 请喝咖啡
          </button>

          <button id="theme-toggle-btn" class="theme-toggle-btn" type="button"></button>
        </nav>
      </header>
    `;

    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    updateThemeButton();

    injectSponsorModal();
    document.getElementById('btn-open-sponsor')?.addEventListener('click', () => {
      document.getElementById('sponsor-modal')?.classList.add('open');
    });
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer style="text-align: center; padding: 30px 20px; color: var(--text-muted); font-size: 13px; border-top: 1px solid var(--border-color); margin-top: 40px;">
        <p style="margin-bottom: 6px;">Micheal 的拼豆网 · 把每张图片变成可拼的高清图纸</p>
        <p style="margin: 0; font-weight: 600;">— Micheal —</p>
      </footer>
    `;
  }
}
