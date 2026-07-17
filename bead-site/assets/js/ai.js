// ai.js — AI image generation panel.
// Calls /api/ai-proxy on the optional Worker. Without a configured worker (or
// missing API key) it shows the "未配置 API Key" hint with a link to the tutorial.

import { aiProxy } from './worker-client.js';

/**
 * Wire the AI generation panel.
 * @param {Object} [opts] element refs; any omitted ref is resolved by id.
 * @param {HTMLTextAreaElement|HTMLInputElement} [opts.promptEl]
 * @param {HTMLButtonElement} [opts.generateEl]
 * @param {HTMLElement} [opts.previewEl]
 * @param {HTMLElement} [opts.statusEl]
 * @param {HTMLElement} [opts.tutorialEl]
 * @param {HTMLButtonElement} [opts.toBeadEl]
 * @param {Function} [opts.onResult] (HTMLImageElement) => void  send result to bead pipeline
 */
export function initAi(opts = {}) {
  const promptEl = opts.promptEl || document.getElementById('ai-prompt');
  const generateEl = opts.generateEl || document.getElementById('ai-generate');
  const previewEl = opts.previewEl || document.getElementById('ai-preview');
  const statusEl = opts.statusEl || document.getElementById('ai-status');
  const tutorialEl = opts.tutorialEl || document.getElementById('ai-tutorial');
  const toBeadEl = opts.toBeadEl || document.getElementById('ai-to-bead');
  const onResult = opts.onResult || (() => {});

  let lastImage = null;

  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg || ''; };
  const showTutorial = (show) => { if (tutorialEl) tutorialEl.style.display = show ? '' : 'none'; };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = src;
    });

  generateEl?.addEventListener('click', async () => {
    const prompt = (promptEl?.value || '').trim();
    if (!prompt) { setStatus('请输入提示词'); return; }
    setStatus('正在生成…');
    showTutorial(false);
    if (toBeadEl) toBeadEl.style.display = 'none';
    try {
      const res = await aiProxy({ prompt }, () => ({ error: 'NO_KEY' }));
      if (!res || res.error === 'NO_KEY') {
        setStatus('未配置 API Key，点此查看接入教程');
        showTutorial(true);
        return;
      }
      const src = res.image || res.url || (res.data && res.data[0] && res.data[0].url);
      if (!src) { setStatus('生成失败：返回数据异常'); return; }
      const img = await loadImage(src);
      lastImage = img;
      if (previewEl) {
        previewEl.innerHTML = '';
        img.className = 'ai-result-img';
        previewEl.appendChild(img);
      }
      setStatus('生成完成，可送进拼豆。');
      if (toBeadEl) toBeadEl.style.display = '';
    } catch (e) {
      setStatus('生成出错：' + (e.message || '请稍后重试'));
    }
  });

  toBeadEl?.addEventListener('click', () => {
    if (lastImage) onResult(lastImage);
  });
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.initAi = initAi;
