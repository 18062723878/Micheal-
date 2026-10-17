// color.js — nearest-palette-color matching.
// Pure color math lives in lab.js (no imports); PALETTE_LAB lives in palette.js.
// color.js depends on both but neither depends back on color.js, so there is
// no circular-import evaluation hazard.

import { srgbToLab, labDistance, rgbToHex } from './lab.js';
import { PALETTE_LAB } from './palette.js';

// Re-export the color math so other modules can keep importing from color.js.
export { srgbToLab, labDistance, rgbToHex };

// 高命中率 24-bit RGB 颜色量化缓存（0x000000 - 0xFFFFFF），避免对相邻重复像素做昂贵的 Lab 空间距离重算
const CACHE_MAX = 8192;
const _defaultNearestCache = new Map();

/**
 * Find the nearest Artkal palette color id for an sRGB pixel.
 * @param {number[]} rgb [r, g, b]
 * @param {Object} [labMap] id -> [L,a,b]; defaults to the precomputed PALETTE_LAB
 * @returns {string} palette color id (e.g. "A07")
 */
export function nearestColorId(rgb, labMap = PALETTE_LAB) {
  const isDefault = labMap === PALETTE_LAB;
  let key = -1;
  if (isDefault && rgb && rgb.length >= 3) {
    key = (Math.round(rgb[0]) << 16) | (Math.round(rgb[1]) << 8) | Math.round(rgb[2]);
    const cached = _defaultNearestCache.get(key);
    if (cached !== undefined) return cached;
  }

  const lab = srgbToLab(rgb);
  let best = null;
  let bestD = Infinity;
  for (const id in labMap) {
    const d = labDistance(lab, labMap[id]);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }

  if (isDefault && key >= 0) {
    if (_defaultNearestCache.size >= CACHE_MAX) {
      _defaultNearestCache.clear();
    }
    _defaultNearestCache.set(key, best);
  }

  return best;
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.srgbToLab = srgbToLab;
BeadStudio.labDistance = labDistance;
BeadStudio.nearestColorId = nearestColorId;
BeadStudio.rgbToHex = rgbToHex;
