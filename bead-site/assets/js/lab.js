// lab.js — pure color-space math with NO other imports.
// Kept separate so palette.js can use srgbToLab without creating a circular
// dependency with color.js (which in turn needs PALETTE_LAB from palette.js).

// 预计算 0..255 的 sRGB 伽马线性化表，查表代替 Math.pow，大幅提升逐像素转换效率
const SRGB_LIN_LUT = new Float64Array(256);
for (let i = 0; i < 256; i++) {
  const v = i / 255;
  SRGB_LIN_LUT[i] = v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
}

function linearize(v) {
  if (v >= 0 && v <= 255 && (v | 0) === v) {
    return SRGB_LIN_LUT[v];
  }
  const nv = v / 255;
  return nv > 0.04045 ? Math.pow((nv + 0.055) / 1.055, 2.4) : nv / 12.92;
}

/**
 * Convert sRGB (0-255) to CIE Lab.
 * @param {number[]} rgb [r, g, b]
 * @returns {number[]} [L, a, b]
 */
export function srgbToLab(rgb) {
  const rLin = linearize(rgb[0]);
  const gLin = linearize(rgb[1]);
  const bLin = linearize(rgb[2]);

  // RGB -> XYZ (D65)
  let x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
  let y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
  let z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

  // Normalize by reference white
  x /= 0.95047;
  z /= 1.08883;

  // XYZ -> Lab
  const fx = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return [L, a, b];
}

/**
 * Euclidean distance between two Lab vectors.
 * @param {number[]} l1
 * @param {number[]} l2
 * @returns {number}
 */
export function labDistance(l1, l2) {
  const dL = l1[0] - l2[0];
  const da = l1[1] - l2[1];
  const db = l1[2] - l2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Convert an sRGB triple to a hex string.
 * @param {number[]} rgb
 * @returns {string}
 */
export function rgbToHex(rgb) {
  return (
    '#' +
    rgb
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.srgbToLab = srgbToLab;
BeadStudio.labDistance = labDistance;
BeadStudio.rgbToHex = rgbToHex;
