// upload.js — file upload handling with multi-format support and a
// background-removal hook. GIFs use their first frame (browser default decode).

import { removeBackground } from './bg-removal.js';

/**
 * Wire an <input type="file"> to produce an image/canvas for downstream use.
 * @param {HTMLInputElement} input
 * @param {Object} opts
 * @param {Function} [opts.onImage] (image, meta) => void  image is HTMLImageElement | HTMLCanvasElement
 * @param {Function} [opts.onError] (message) => void
 * @param {HTMLInputElement} [opts.bgToggle] checkbox enabling background removal
 * @param {Function} [opts.onStatus] (message) => void  progress / info text
 */
export function setupUpload(input, opts = {}) {
  const { onImage, onError, bgToggle, onStatus } = opts;
  if (!input) return;

  input.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (onStatus) onStatus('正在读取图片…');
    try {
      const img = await fileToImage(file);
      /** @type {HTMLImageElement|HTMLCanvasElement} */
      let result = img;
      if (bgToggle && bgToggle.checked) {
        if (onStatus) onStatus('正在自动抠背景（首次需加载模型）…');
        try {
          result = await removeBackground(img);
        } catch (err) {
          if (onStatus) onStatus('抠背景失败，已跳过：' + (err.message || '未知错误'));
        }
      }
      if (onImage) onImage(result, { name: file.name, type: file.type });
      if (onStatus) onStatus('');
    } catch (err) {
      if (onError) onError(err.message || '读取图片失败');
      if (onStatus) onStatus('');
    }
  });
}

/**
 * Read a File into an Image element (object URL, first frame for GIF).
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
export function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法解码图片，请换一张 jpg/png/webp/gif'));
    };
    img.src = url;
  });
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.setupUpload = setupUpload;
BeadStudio.fileToImage = fileToImage;
