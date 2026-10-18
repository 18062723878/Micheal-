// liquid-glass.js — 已停用液态玻璃材质，提供空实现保持 API 兼容性并消除所有性能开销。
export function initLiquidGlass() {
  return {
    targets: () => [],
    scan: () => {},
    stats: () => ({ supportsRefract: false, surfaces: 0, controls: 0 }),
    setRefract: () => false,
  };
}
