// lab.js — pure color-space math with NO other imports.
// Kept separate so palette.js can use srgbToLab without creating a circular
// dependency with color.js (which in turn needs PALETTE_LAB from palette.js).

/**
 * Convert sRGB (0-255) to CIE Lab.
 * @param {number[]} rgb [r, g, b]
 * @returns {number[]} [L, a, b]
 */
export function srgbToLab(rgb) {
  // Normalize to 0..1
  const c = rgb.map((v) => v / 255);
  // Linearize (sRGB gamma)
  const mask = c.map((v) => (v > 0.04045 ? 1 : 0));
  const lin = c.map((v, i) =>
    mask[i] ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92
  );
  // RGB -> XYZ (D65)
  let x = lin[0] * 0.4124 + lin[1] * 0.3576 + lin[2] * 0.1805;
  let y = lin[0] * 0.2126 + lin[1] * 0.7152 + lin[2] * 0.0722;
  let z = lin[0] * 0.0193 + lin[1] * 0.1192 + lin[2] * 0.9505;
  // Normalize by reference white
  x /= 0.95047;
  z /= 1.08883;
  // XYZ -> Lab
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
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
