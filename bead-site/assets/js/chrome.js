// 主题自动检测与切换逻辑
export function initTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  // 监听系统主题变更
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
        <nav style="display: flex; align-items: center; gap: 18px;">
          <a href="index.html" style="color: ${activePage === 'home' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'home' ? '700' : '500'};">首页</a>
          <a href="create.html" style="color: ${activePage === 'create' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'create' ? '700' : '500'};">创作</a>
          <a href="inspiration.html" style="color: ${activePage === 'inspiration' ? 'var(--primary)' : 'var(--text-muted)'}; text-decoration: none; font-weight: ${activePage === 'inspiration' ? '700' : '500'};">灵感</a>
          <button id="theme-toggle-btn" class="theme-toggle-btn" type="button"></button>
        </nav>
      </header>
    `;

    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    updateThemeButton();
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
