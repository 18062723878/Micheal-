// color.js — nearest-palette-color matching.
// Pure color math lives in lab.js (no imports); PALETTE_LAB lives in palette.js.
// color.js depends on both but neither depends back on color.js, so there is
// no circular-import evaluation hazard.

import { srgbToLab, labDistance, rgbToHex } from './lab.js';
import { PALETTE_LAB } from './palette.js';

// Re-export the color math so other modules can keep importing from color.js.
export { srgbToLab, labDistance, rgbToHex };

/**
 * Find the nearest Artkal palette color id for an sRGB pixel.
 * @param {number[]} rgb [r, g, b]
 * @param {Object} [labMap] id -> [L,a,b]; defaults to the precomputed PALETTE_LAB
 * @returns {string} palette color id (e.g. "A07")
 */
export function nearestColorId(rgb, labMap = PALETTE_LAB) {
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
  return best;
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.srgbToLab = srgbToLab;
BeadStudio.labDistance = labDistance;
BeadStudio.nearestColorId = nearestColorId;
BeadStudio.rgbToHex = rgbToHex;
