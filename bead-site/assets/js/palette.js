// palette.js — Artkal 55-color palette with precomputed Lab values.
// Exports ARTKAL_55, PALETTE, PALETTE_LAB and attaches to window.BeadStudio
// for environments where ES Modules are unavailable.

import { srgbToLab } from './lab.js';

/**
 * @typedef {Object} BeadColor
 * @property {string} id   e.g. "A01"
 * @property {string} name e.g. "White"
 * @property {string} hex  e.g. "#FFFFFF"
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */

/** @type {BeadColor[]} Full 55-color Artkal palette. */
export const ARTKAL_55 = [
  { id: 'A01', name: 'White', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { id: 'A02', name: 'Cream', hex: '#F4E9D4', r: 244, g: 233, b: 212 },
  { id: 'A03', name: 'Yellow', hex: '#FFE600', r: 255, g: 230, b: 0 },
  { id: 'A04', name: 'Bright Yellow', hex: '#FFD400', r: 255, g: 212, b: 0 },
  { id: 'A05', name: 'Light Orange', hex: '#FFB347', r: 255, g: 179, b: 71 },
  { id: 'A06', name: 'Orange', hex: '#FF7A00', r: 255, g: 122, b: 0 },
  { id: 'A07', name: 'Red', hex: '#E60012', r: 230, g: 0, b: 18 },
  { id: 'A08', name: 'Bright Red', hex: '#FF2D2D', r: 255, g: 45, b: 45 },
  { id: 'A09', name: 'Dark Red', hex: '#B22222', r: 178, g: 34, b: 34 },
  { id: 'A10', name: 'Wine', hex: '#722F37', r: 114, g: 47, b: 55 },
  { id: 'A11', name: 'Pink', hex: '#FFC0CB', r: 255, g: 192, b: 203 },
  { id: 'A12', name: 'Bright Pink', hex: '#FF69B4', r: 255, g: 105, b: 180 },
  { id: 'A13', name: 'Magenta', hex: '#E6007E', r: 230, g: 0, b: 126 },
  { id: 'A14', name: 'Purple', hex: '#800080', r: 128, g: 0, b: 128 },
  { id: 'A15', name: 'Light Purple', hex: '#B19CD9', r: 177, g: 156, b: 217 },
  { id: 'A16', name: 'Lavender', hex: '#E6E6FA', r: 230, g: 230, b: 250 },
  { id: 'A17', name: 'Light Blue', hex: '#ADD8E6', r: 173, g: 216, b: 230 },
  { id: 'A18', name: 'Blue', hex: '#1E90FF', r: 30, g: 144, b: 255 },
  { id: 'A19', name: 'Dark Blue', hex: '#0050A0', r: 0, g: 80, b: 160 },
  { id: 'A20', name: 'Navy', hex: '#002366', r: 0, g: 35, b: 102 },
  { id: 'A21', name: 'Light Green', hex: '#90EE90', r: 144, g: 238, b: 144 },
  { id: 'A22', name: 'Green', hex: '#00A651', r: 0, g: 166, b: 81 },
  { id: 'A23', name: 'Dark Green', hex: '#006400', r: 0, g: 100, b: 0 },
  { id: 'A24', name: 'Mint', hex: '#98FFB3', r: 152, g: 255, b: 179 },
  { id: 'A25', name: 'Light Brown', hex: '#C8A06A', r: 200, g: 160, b: 106 },
  { id: 'A26', name: 'Brown', hex: '#8B5A2B', r: 139, g: 90, b: 43 },
  { id: 'A27', name: 'Dark Brown', hex: '#5C3317', r: 92, g: 51, b: 23 },
  { id: 'A28', name: 'Grey', hex: '#B0B0B0', r: 176, g: 176, b: 176 },
  { id: 'A29', name: 'Dark Grey', hex: '#606060', r: 96, g: 96, b: 96 },
  { id: 'A30', name: 'Black', hex: '#1A1A1A', r: 26, g: 26, b: 26 },
  { id: 'A31', name: 'Peach', hex: '#FFDAB3', r: 255, g: 218, b: 179 },
  { id: 'A32', name: 'Apricot', hex: '#F8B88B', r: 248, g: 184, b: 139 },
  { id: 'A33', name: 'Olive', hex: '#808000', r: 128, g: 128, b: 0 },
  { id: 'A34', name: 'Khaki', hex: '#C3B091', r: 195, g: 176, b: 145 },
  { id: 'A35', name: 'Sand', hex: '#E2CA9C', r: 226, g: 202, b: 156 },
  { id: 'A36', name: 'Coral', hex: '#FF7F50', r: 255, g: 127, b: 80 },
  { id: 'A37', name: 'Salmon', hex: '#FA8072', r: 250, g: 128, b: 114 },
  { id: 'A38', name: 'Rose', hex: '#F6546A', r: 246, g: 84, b: 106 },
  { id: 'A39', name: 'Plum', hex: '#8E4585', r: 142, g: 69, b: 133 },
  { id: 'A40', name: 'Cyan', hex: '#00CED1', r: 0, g: 206, b: 209 },
  { id: 'A41', name: 'Teal', hex: '#008080', r: 0, g: 128, b: 128 },
  { id: 'A42', name: 'Turquoise', hex: '#40E0D0', r: 64, g: 224, b: 208 },
  { id: 'A43', name: 'Sky Blue', hex: '#87CEEB', r: 135, g: 206, b: 235 },
  { id: 'A44', name: 'Royal Blue', hex: '#4169E1', r: 65, g: 105, b: 225 },
  { id: 'A45', name: 'Indigo', hex: '#4B0082', r: 75, g: 0, b: 130 },
  { id: 'A46', name: 'Forest Green', hex: '#228B22', r: 34, g: 139, b: 34 },
  { id: 'A47', name: 'Lime', hex: '#BFFF00', r: 191, g: 255, b: 0 },
  { id: 'A48', name: 'Chartreuse', hex: '#7FFF00', r: 127, g: 255, b: 0 },
  { id: 'A49', name: 'Gold', hex: '#D4AF37', r: 212, g: 175, b: 55 },
  { id: 'A50', name: 'Beige', hex: '#F5F5DC', r: 245, g: 245, b: 220 },
  { id: 'A51', name: 'Pearl', hex: '#EAE0C8', r: 234, g: 224, b: 200 },
  { id: 'A52', name: 'Champagne', hex: '#F7E7CE', r: 247, g: 231, b: 206 },
  { id: 'A53', name: 'Burgundy', hex: '#800020', r: 128, g: 0, b: 32 },
  { id: 'A54', name: 'Maroon', hex: '#610000', r: 97, g: 0, b: 0 },
  { id: 'A55', name: 'Slate', hex: '#708090', r: 112, g: 128, b: 144 }
];

/** Map of id -> BeadColor for O(1) lookup. */
export const PALETTE = ARTKAL_55.reduce((acc, c) => { acc[c.id] = c; return acc; }, /** @type {Object} */ ({}));

/** Map of id -> [L, a, b] precomputed once at module load. */
export const PALETTE_LAB = ARTKAL_55.reduce((acc, c) => {
  acc[c.id] = srgbToLab([c.r, c.g, c.b]);
  return acc;
}, /** @type {Object} */ ({}));

// Attach to window for non-module consumers.
const BeadStudio = (window.BeadStudio = window.BeadStudio || {});
BeadStudio.ARTKAL_55 = ARTKAL_55;
BeadStudio.PALETTE = PALETTE;
BeadStudio.PALETTE_LAB = PALETTE_LAB;
