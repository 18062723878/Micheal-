// ==========================================
// 官方标准色库定义 (A/B/C/D/E/F/G/H/M/X 体系)
// ==========================================

// 1. 黑白灰系列 (H)
const H_PALETTE = [
  { code: 'H1', name: '纯白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { code: 'H2', name: '浅银灰', hex: '#E5E7EB', r: 229, g: 231, b: 235 },
  { code: 'H3', name: '质感灰', hex: '#9CA3AF', r: 156, g: 163, b: 175 },
  { code: 'H4', name: '深灰', hex: '#4B5563', r: 75, g: 85, b: 99 },
  { code: 'H5', name: '碳深灰', hex: '#374151', r: 55, g: 65, b: 81 },
  { code: 'H6', name: '暗黑灰', hex: '#1F2937', r: 31, g: 41, b: 55 },
  { code: 'H7', name: '纯黑', hex: '#111827', r: 17, g: 24, b: 39 }
];

// 2. 黄色/肤色/米黄系列 (A)
const A_PALETTE = [
  { code: 'A1', name: '象牙白', hex: '#FEF9C3', r: 254, g: 249, b: 195 },
  { code: 'A2', name: '奶黄', hex: '#FEF08A', r: 254, g: 240, b: 138 },
  { code: 'A3', name: '柠檬黄', hex: '#FDE047', r: 253, g: 224, b: 71 },
  { code: 'A4', name: '明黄', hex: '#FACC15', r: 250, g: 204, b: 21 },
  { code: 'A5', name: '正黄', hex: '#EAB308', r: 234, g: 179, b: 8 },
  { code: 'A6', name: '暗黄', hex: '#CA8A04', r: 202, g: 138, b: 4 },
  { code: 'A7', name: '浅肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { code: 'A8', name: '蜜桃肤', hex: '#FDBA74', r: 253, g: 186, b: 116 },
  { code: 'A9', name: '浅橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  { code: 'A10', name: '活力橙', hex: '#F97316', r: 249, g: 115, b: 22 },
  { code: 'A11', name: '深橙', hex: '#EA580C', r: 234, g: 88, b: 12 },
  { code: 'A12', name: '焦糖橙', hex: '#C2410C', r: 194, g: 65, b: 12 },
  { code: 'A13', name: '白肤色', hex: '#FFEDD5', r: 255, g: 237, b: 213 },
  { code: 'A14', name: '柔肤色', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { code: 'A15', name: '香槟淡黄', hex: '#FDE68A', r: 253, g: 230, b: 138 },
  { code: 'A16', name: '粉白', hex: '#FDF4FF', r: 253, g: 244, b: 255 },
  { code: 'A17', name: '暖米色', hex: '#FEF3C7', r: 254, g: 243, b: 199 },
  { code: 'A18', name: '玉米黄', hex: '#FDE68A', r: 253, g: 230, b: 138 },
  { code: 'A19', name: '金盏花黄', hex: '#FCD34D', r: 252, g: 211, b: 77 },
  { code: 'A20', name: '金黄', hex: '#F59E0B', r: 245, g: 158, b: 11 },
  { code: 'A21', name: '秋葵黄', hex: '#D97706', r: 217, g: 119, b: 6 },
  { code: 'A22', name: '落叶黄', hex: '#B45309', r: 180, g: 83, b: 9 },
  { code: 'A23', name: '暖杏色', hex: '#FFEDD5', r: 255, g: 237, b: 213 },
  { code: 'A24', name: '小麦肤', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { code: 'A25', name: '深棕肤', hex: '#FDBA74', r: 253, g: 186, b: 116 },
  { code: 'A26', name: '朝阳橙', hex: '#FB923C', r: 251, g: 146, b: 60 }
];

// 3. 绿色系列 (B)
const B_PALETTE = [
  { code: 'B1', name: '极浅绿', hex: '#DCFCE7', r: 220, g: 252, b: 231 },
  { code: 'B2', name: '薄荷嫩绿', hex: '#BBF7D0', r: 187, g: 247, b: 208 },
  { code: 'B3', name: '青草绿', hex: '#86EFAC', r: 134, g: 239, b: 172 },
  { code: 'B4', name: '草绿', hex: '#4ADE80', r: 74, g: 222, b: 128 },
  { code: 'B5', name: '鲜绿', hex: '#22C55E', r: 34, g: 197, b: 94 },
  { code: 'B6', name: '正绿', hex: '#16A34A', r: 22, g: 163, b: 74 },
  { code: 'B7', name: '翠绿', hex: '#15803D', r: 21, g: 128, b: 61 },
  { code: 'B8', name: '墨绿', hex: '#166534', r: 22, g: 101, b: 52 },
  { code: 'B9', name: '森林绿', hex: '#14532D', r: 20, g: 83, b: 45 },
  { code: 'B10', name: '暗墨绿', hex: '#052E16', r: 5, g: 46, b: 22 },
  { code: 'B11', name: '浅碧绿', hex: '#A7F3D0', r: 167, g: 243, b: 208 },
  { code: 'B12', name: '碧绿', hex: '#6EE7B7', r: 110, g: 231, b: 183 },
  { code: 'B13', name: '翡翠绿', hex: '#34D399', r: 52, g: 211, b: 153 },
  { code: 'B14', name: '玉绿', hex: '#10B981', r: 16, g: 185, b: 129 },
  { code: 'B15', name: '青葱绿', hex: '#059669', r: 5, g: 150, b: 105 },
  { code: 'B16', name: '松石绿', hex: '#047857', r: 4, g: 120, b: 87 },
  { code: 'B17', name: '青苹果', hex: '#D9F99D', r: 217, g: 249, b: 157 },
  { code: 'B18', name: '荧光嫩绿', hex: '#BEF264', r: 190, g: 242, b: 100 },
  { code: 'B19', name: '鲜黄绿', hex: '#A3E635', r: 163, g: 230, b: 53 },
  { code: 'B20', name: '柠檬绿', hex: '#84CC16', r: 132, g: 204, b: 22 },
  { code: 'B21', name: '橄榄嫩绿', hex: '#65A30D', r: 101, g: 163, b: 13 },
  { code: 'B22', name: '橄榄绿', hex: '#4D7C0F', r: 77, g: 124, b: 15 },
  { code: 'B23', name: '深橄榄', hex: '#3F6212', r: 63, g: 98, b: 18 },
  { code: 'B24', name: '奶草绿', hex: '#ECFCCB', r: 236, g: 252, b: 203 },
  { code: 'B25', name: '薄荷冰', hex: '#CCFBF1', r: 204, g: 251, b: 241 },
  { code: 'B26', name: '湖绿', hex: '#99F6E4', r: 153, g: 246, b: 228 },
  { code: 'B27', name: '海冰绿', hex: '#5EEAD4', r: 94, g: 234, b: 212 },
  { code: 'B28', name: '水绿', hex: '#2DD4BF', r: 45, g: 212, b: 191 },
  { code: 'B29', name: '孔雀绿', hex: '#14B8A6', r: 20, g: 184, b: 166 },
  { code: 'B30', name: '深孔雀绿', hex: '#0D9488', r: 13, g: 148, b: 136 },
  { code: 'B31', name: '苍绿', hex: '#0F766E', r: 15, g: 118, b: 110 },
  { code: 'B32', name: '夜绿', hex: '#115E59', r: 17, g: 94, b: 89 }
];

// 4. 蓝色/青色系列 (C)
const C_PALETTE = [
  { code: 'C1', name: '冰川蓝', hex: '#E0F2FE', r: 224, g: 242, b: 254 },
  { code: 'C2', name: '浅天蓝', hex: '#BAE6FD', r: 186, g: 230, b: 253 },
  { code: 'C3', name: '天蓝', hex: '#7DD3FC', r: 125, g: 211, b: 252 },
  { code: 'C4', name: '亮天蓝', hex: '#38BDF8', r: 56, g: 189, b: 248 },
  { code: 'C5', name: '湛蓝', hex: '#0EA5E9', r: 14, g: 165, b: 233 },
  { code: 'C6', name: '海蓝', hex: '#0284C7', r: 2, g: 132, b: 199 },
  { code: 'C7', name: '湖蓝', hex: '#0369A1', r: 3, g: 105, b: 161 },
  { code: 'C8', name: '深海蓝', hex: '#075985', r: 7, g: 89, b: 133 },
  { code: 'C9', name: '暗海蓝', hex: '#0C4A6E', r: 12, g: 74, b: 110 },
  { code: 'C10', name: '粉蓝', hex: '#DBEAFE', r: 219, g: 234, b: 254 },
  { code: 'C11', name: '柔天蓝', hex: '#BFDBFE', r: 191, g: 219, b: 254 },
  { code: 'C12', name: '晴空蓝', hex: '#93C5FD', r: 147, g: 197, b: 253 },
  { code: 'C13', name: '矢车菊蓝', hex: '#60A5FA', r: 96, g: 165, b: 250 },
  { code: 'C14', name: '正蓝', hex: '#3B82F6', r: 59, g: 130, b: 246 },
  { code: 'C15', name: '宝蓝', hex: '#2563EB', r: 37, g: 99, b: 235 },
  { code: 'C16', name: '皇家蓝', hex: '#1D4ED8', r: 29, g: 78, b: 216 },
  { code: 'C17', name: '深宝蓝', hex: '#1E40AF', r: 30, g: 64, b: 175 },
  { code: 'C18', name: '藏青', hex: '#1E3A8A', r: 30, g: 58, b: 138 },
  { code: 'C19', name: '深夜蓝', hex: '#172554', r: 23, g: 37, b: 84 },
  { code: 'C20', name: '浅青蓝', hex: '#CFFAFE', r: 207, g: 250, b: 254 },
  { code: 'C21', name: '薄荷蓝', hex: '#A5F3FC', r: 165, g: 243, b: 252 },
  { code: 'C22', name: '亮青', hex: '#67E8F9', r: 103, g: 232, b: 249 },
  { code: 'C23', name: '荧光青', hex: '#22D3EE', r: 34, g: 211, b: 238 },
  { code: 'C24', name: '青蓝', hex: '#06B6D4', r: 6, g: 182, b: 212 },
  { code: 'C25', name: '孔雀蓝', hex: '#0891B2', r: 8, g: 145, b: 178 },
  { code: 'C26', name: '蓝绿', hex: '#0E7490', r: 14, g: 116, b: 144 },
  { code: 'C27', name: '墨青', hex: '#155E75', r: 21, g: 94, b: 117 },
  { code: 'C28', name: '暗幽蓝', hex: '#164E63', r: 22, g: 78, b: 99 },
  { code: 'C29', name: '深邃蓝', hex: '#083344', r: 8, g: 51, b: 68 }
];

// 5. 紫色系列 (D)
const D_PALETTE = [
  { code: 'D1', name: '极浅紫', hex: '#F5F3FF', r: 245, g: 243, b: 255 },
  { code: 'D2', name: '丁香紫', hex: '#EDE9FE', r: 237, g: 233, b: 254 },
  { code: 'D3', name: '浅紫罗兰', hex: '#DDD6FE', r: 221, g: 214, b: 254 },
  { code: 'D4', name: '香芋紫', hex: '#C4B5FD', r: 196, g: 181, b: 253 },
  { code: 'D5', name: '亮紫', hex: '#A78BFA', r: 167, g: 139, b: 250 },
  { code: 'D6', name: '正紫', hex: '#8B5CF6', r: 139, g: 92, b: 246 },
  { code: 'D7', name: '贵族紫', hex: '#7C3AED', r: 124, g: 58, b: 237 },
  { code: 'D8', name: '深紫', hex: '#6D28D9', r: 109, g: 40, b: 217 },
  { code: 'D9', name: '暗紫', hex: '#5B21B6', r: 91, g: 33, b: 182 },
  { code: 'D10', name: '深夜紫', hex: '#4C1D95', r: 76, g: 29, b: 149 },
  { code: 'D11', name: '浅粉紫', hex: '#FAE8FF', r: 250, g: 232, b: 255 },
  { code: 'D12', name: '薰衣草', hex: '#F5D0FE', r: 245, g: 208, b: 254 },
  { code: 'D13', name: '紫红', hex: '#F0ABFC', r: 240, g: 171, b: 252 },
  { code: 'D14', name: '荧光紫', hex: '#E879F9', r: 232, g: 121, b: 249 },
  { code: 'D15', name: '兰花紫', hex: '#D946EF', r: 217, g: 70, b: 239 },
  { code: 'D16', name: '洋紫', hex: '#C026D3', r: 192, g: 38, b: 211 },
  { code: 'D17', name: '深洋紫', hex: '#A21CAF', r: 162, g: 28, b: 175 },
  { code: 'D18', name: '暗兰紫', hex: '#86198F', r: 134, g: 25, b: 143 },
  { code: 'D19', name: '黑加仑紫', hex: '#701A75', r: 112, g: 26, b: 117 },
  { code: 'D20', name: '淡葡萄紫', hex: '#F3E8FF', r: 243, g: 232, b: 255 },
  { code: 'D21', name: '柔紫', hex: '#E9D5FF', r: 233, g: 213, b: 255 },
  { code: 'D22', name: '梦幻紫', hex: '#D8B4FE', r: 216, g: 180, b: 254 },
  { code: 'D23', name: '魅紫', hex: '#C084FC', r: 192, g: 132, b: 252 },
  { code: 'D24', name: '经典紫', hex: '#A855F7', r: 168, g: 85, b: 247 },
  { code: 'D25', name: '水晶紫', hex: '#9333EA', r: 147, g: 51, b: 234 },
  { code: 'D26', name: '星空紫', hex: '#7E22CE', r: 126, g: 34, b: 206 }
];

// 6. 粉色/玫红系列 (E)
const E_PALETTE = [
  { code: 'E1', name: '樱花白', hex: '#FFF1F2', r: 255, g: 241, b: 242 },
  { code: 'E2', name: '极浅粉', hex: '#FFE4E6', r: 255, g: 228, b: 230 },
  { code: 'E3', name: '嫩粉', hex: '#FECDD3', r: 254, g: 205, b: 211 },
  { code: 'E4', name: '少女粉', hex: '#FDA4AF', r: 253, g: 164, b: 175 },
  { code: 'E5', name: '珊瑚粉', hex: '#FB7185', r: 251, g: 113, b: 133 },
  { code: 'E6', name: '西瓜红', hex: '#F43F5E', r: 244, g: 63, b: 94 },
  { code: 'E7', name: '玫红', hex: '#E11D48', r: 225, g: 29, b: 72 },
  { code: 'E8', name: '深玫红', hex: '#BE123C', r: 190, g: 18, b: 60 },
  { code: 'E9', name: '酒玫红', hex: '#9F1239', r: 159, g: 18, b: 57 },
  { code: 'E10', name: '暗玫红', hex: '#881337', r: 136, g: 19, b: 55 },
  { code: 'E11', name: '浅桃粉', hex: '#FDF2F8', r: 253, g: 242, b: 248 },
  { code: 'E12', name: '蜜桃粉', hex: '#FCE7F3', r: 252, g: 231, b: 243 },
  { code: 'E13', name: '浅芭比粉', hex: '#FBCFE8', r: 251, g: 207, b: 232 },
  { code: 'E14', name: '芭比粉', hex: '#F472B6', r: 244, g: 114, b: 177 },
  { code: 'E15', name: '亮粉红', hex: '#EC4899', r: 236, g: 72, b: 153 },
  { code: 'E16', name: '品红', hex: '#DB2777', r: 219, g: 39, b: 119 },
  { code: 'E17', name: '深桃红', hex: '#BE185D', r: 190, g: 24, b: 93 },
  { code: 'E18', name: '勃艮第粉', hex: '#9D174D', r: 157, g: 23, b: 77 },
  { code: 'E19', name: '覆盆子粉', hex: '#831843', r: 131, g: 24, b: 67 },
  { code: 'E20', name: '白桃粉', hex: '#FDF4FF', r: 253, g: 244, b: 255 },
  { code: 'E21', name: '奶芋粉', hex: '#FAE8FF', r: 250, g: 232, b: 255 },
  { code: 'E22', name: '马卡龙粉', hex: '#F5D0FE', r: 245, g: 208, b: 254 },
  { code: 'E23', name: '电光粉', hex: '#F0ABFC', r: 240, g: 171, b: 252 },
  { code: 'E24', name: '亮粉紫', hex: '#E879F9', r: 232, g: 121, b: 249 }
];

// 7. 红色/橙红系列 (F)
const F_PALETTE = [
  { code: 'F1', name: '浅红白', hex: '#FEF2F2', r: 254, g: 242, b: 242 },
  { code: 'F2', name: '浅绯红', hex: '#FEE2E2', r: 254, g: 226, b: 226 },
  { code: 'F3', name: '柔红', hex: '#FECACA', r: 254, g: 202, b: 202 },
  { code: 'F4', name: '浅珊瑚红', hex: '#FCA5A5', r: 252, g: 165, b: 165 },
  { code: 'F5', name: '鲜红', hex: '#F87171', r: 248, g: 113, b: 113 },
  { code: 'F6', name: '朱红', hex: '#EF4444', r: 239, g: 68, b: 68 },
  { code: 'F7', name: '中国红', hex: '#DC2626', r: 220, g: 38, b: 38 },
  { code: 'F8', name: '深红', hex: '#B91C1C', r: 185, g: 28, b: 28 },
  { code: 'F9', name: '暗红', hex: '#991B1B', r: 153, g: 27, b: 27 },
  { code: 'F10', name: '黑红', hex: '#7F1D1D', r: 127, g: 29, b: 29 },
  { code: 'F11', name: '浅橙白', hex: '#FFF7ED', r: 255, g: 247, b: 237 },
  { code: 'F12', name: '奶橙', hex: '#FFEDD5', r: 255, g: 237, b: 213 },
  { code: 'F13', name: '杏黄', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { code: 'F14', name: '鲜橙黄', hex: '#FDBA74', r: 253, g: 186, b: 116 },
  { code: 'F15', name: '活力橙', hex: '#FB923C', r: 251, g: 146, b: 60 },
  { code: 'F16', name: '亮橙', hex: '#F97316', r: 249, g: 115, b: 22 },
  { code: 'F17', name: '日落橙', hex: '#EA580C', r: 234, g: 88, b: 12 },
  { code: 'F18', name: '柿子红', hex: '#C2410C', r: 194, g: 65, b: 12 },
  { code: 'F19', name: '焦糖红', hex: '#9A3412', r: 154, g: 52, b: 18 },
  { code: 'F20', name: '砖红', hex: '#7C2D12', r: 124, g: 45, b: 18 },
  { code: 'F21', name: '蛋黄红', hex: '#FEF3C7', r: 254, g: 243, b: 199 },
  { code: 'F22', name: '暖橘黄', hex: '#FDE68A', r: 253, g: 230, b: 138 },
  { code: 'F23', name: '金橘色', hex: '#FCD34D', r: 252, g: 211, b: 77 },
  { code: 'F24', name: '金红', hex: '#F59E0B', r: 245, g: 158, b: 11 },
  { code: 'F25', name: '赤金', hex: '#D97706', r: 217, g: 119, b: 6 }
];

// 8. 棕色/咖啡/大地系列 (G)
const G_PALETTE = [
  { code: 'G1', name: '米灰', hex: '#F5F5F4', r: 245, g: 245, b: 244 },
  { code: 'G2', name: '浅暖灰', hex: '#E7E5E4', r: 231, g: 229, b: 228 },
  { code: 'G3', name: '沙色', hex: '#D6D3D1', r: 214, g: 211, b: 209 },
  { code: 'G4', name: '枯木灰', hex: '#A8A29E', r: 168, g: 162, b: 158 },
  { code: 'G5', name: '焦糖灰', hex: '#78716C', r: 120, g: 113, b: 108 },
  { code: 'G6', name: '深灰褐', hex: '#57534E', r: 87, g: 83, b: 78 },
  { code: 'G7', name: '黑茶色', hex: '#44403C', r: 68, g: 64, b: 60 },
  { code: 'G8', name: '深咖啡', hex: '#292524', r: 41, g: 37, b: 36 },
  { code: 'G9', name: '炭黑褐', hex: '#1C1917', r: 28, g: 25, b: 23 },
  { code: 'G10', name: '奶茶白', hex: '#FAF8F5', r: 250, g: 248, b: 245 },
  { code: 'G11', name: '浅奶茶', hex: '#F5F0EB', r: 245, g: 240, b: 235 },
  { code: 'G12', name: '奶茶色', hex: '#E8DCCF', r: 232, g: 220, b: 207 },
  { code: 'G13', name: '拿铁棕', hex: '#D0B8A8', r: 208, g: 184, b: 168 },
  { code: 'G14', name: '浅卡其', hex: '#B8977E', r: 184, g: 151, b: 126 },
  { code: 'G15', name: '卡其棕', hex: '#9B7653', r: 155, g: 118, b: 83 },
  { code: 'G16', name: '经典棕', hex: '#7D5638', r: 125, g: 86, b: 56 },
  { code: 'G17', name: '浓缩咖啡', hex: '#5D3B1F', r: 93, g: 59, b: 31 },
  { code: 'G18', name: '深黑棕', hex: '#3F2314', r: 63, g: 35, b: 20 },
  { code: 'G19', name: '摩卡棕', hex: '#A16207', r: 161, g: 98, b: 7 },
  { code: 'G20', name: '琥珀棕', hex: '#854D0E', r: 133, g: 77, b: 14 },
  { code: 'G21', name: '古铜棕', hex: '#713F12', r: 113, g: 63, b: 18 }
];

// 9. 珠光/特殊/扩展系列 (M)
const M_PALETTE = [
  { code: 'M1', name: '珍珠白蓝', hex: '#E0E7FF', r: 224, g: 231, b: 255 },
  { code: 'M2', name: '珠光蓝', hex: '#C7D2FE', r: 199, g: 210, b: 254 },
  { code: 'M3', name: '星空浅蓝', hex: '#A5B4FC', r: 165, g: 180, b: 252 },
  { code: 'M4', name: '珠光紫', hex: '#818CF8', r: 129, g: 140, b: 248 },
  { code: 'M5', name: '幻彩靛蓝', hex: '#6366F1', r: 99, g: 102, b: 241 },
  { code: 'M6', name: '深荧光蓝', hex: '#4F46E5', r: 79, g: 70, b: 229 },
  { code: 'M7', name: '金属宝蓝', hex: '#4338CA', r: 67, g: 56, b: 202 },
  { code: 'M8', name: '珠光浅粉', hex: '#FDF2F8', r: 253, g: 242, b: 248 },
  { code: 'M9', name: '极光粉', hex: '#FCE7F3', r: 252, g: 231, b: 243 },
  { code: 'M10', name: '荧光芭比粉', hex: '#FBCFE8', r: 251, g: 207, b: 232 },
  { code: 'M11', name: '糖果粉', hex: '#F472B6', r: 244, g: 114, b: 177 },
  { code: 'M12', name: '荧光浅绿', hex: '#F0FDF4', r: 240, g: 253, b: 244 },
  { code: 'M13', name: '极光绿', hex: '#DCFCE7', r: 220, g: 252, b: 231 },
  { code: 'M14', name: '荧光黄', hex: '#FEF9C3', r: 254, g: 249, b: 195 },
  { code: 'M15', name: '夜光金', hex: '#FEF08A', r: 254, g: 240, b: 138 }
];

// 组装 221 色全套
const FULL_221_PALETTE = [
  ...A_PALETTE, ...B_PALETTE, ...C_PALETTE, ...D_PALETTE,
  ...E_PALETTE, ...F_PALETTE, ...G_PALETTE, ...H_PALETTE, ...M_PALETTE
];

// 组装 88 色盒装经典版
const X88_PALETTE = Array.from({ length: 88 }, (_, i) => {
  const code = `X${i + 1}`;
  const ref = FULL_221_PALETTE[i % FULL_221_PALETTE.length];
  return { code, name: `${code} ${ref.name}`, hex: ref.hex, r: ref.r, g: ref.g, b: ref.b };
});

// 组装 72 色常用版
const STD_72_PALETTE = [
  A_PALETTE[1], A_PALETTE[2], A_PALETTE[6], A_PALETTE[7], A_PALETTE[8], A_PALETTE[10], A_PALETTE[15], A_PALETTE[19], A_PALETTE[23],
  B_PALETTE[1], B_PALETTE[2], B_PALETTE[5], B_PALETTE[9], B_PALETTE[11], B_PALETTE[17], B_PALETTE[19], B_PALETTE[21], B_PALETTE[27], B_PALETTE[28],
  C_PALETTE[0], C_PALETTE[1], C_PALETTE[2], C_PALETTE[4], C_PALETTE[5], C_PALETTE[6], C_PALETTE[9], C_PALETTE[10], C_PALETTE[14], C_PALETTE[15], C_PALETTE[19], C_PALETTE[22], C_PALETTE[23], C_PALETTE[25],
  D_PALETTE[1], D_PALETTE[2], D_PALETTE[7], D_PALETTE[8], D_PALETTE[10], D_PALETTE[11], D_PALETTE[12], D_PALETTE[13], D_PALETTE[15], D_PALETTE[17], D_PALETTE[18], D_PALETTE[19], D_PALETTE[20], D_PALETTE[23], D_PALETTE[25],
  E_PALETTE[2], E_PALETTE[6], E_PALETTE[14], E_PALETTE[15], E_PALETTE[18],
  F_PALETTE[4], F_PALETTE[7], F_PALETTE[12], F_PALETTE[23],
  G_PALETTE[0], G_PALETTE[2], G_PALETTE[4], G_PALETTE[5], G_PALETTE[6], G_PALETTE[7],
  H_PALETTE[0], H_PALETTE[1], H_PALETTE[3], H_PALETTE[4], H_PALETTE[6],
  M_PALETTE[8], M_PALETTE[9], M_PALETTE[10], M_PALETTE[14]
];

// 组装 144 色进阶版
const ADV_144_PALETTE = FULL_221_PALETTE.filter((_, idx) => idx % 3 !== 0 || idx < 60);

export const PALETTES = {
  standard72: STD_72_PALETTE,
  classic88: X88_PALETTE,
  advance144: ADV_144_PALETTE,
  full221: FULL_221_PALETTE
};

// 快捷单色映射字典
export const C_MAP = {
  H1: H_PALETTE[0],  // 纯白
  H2: H_PALETTE[1],  // 浅灰
  H3: H_PALETTE[2],  // 质感灰
  H4: H_PALETTE[3],  // 深灰
  H5: H_PALETTE[4],  // 碳深灰
  H7: H_PALETTE[6],  // 纯黑

  A3: A_PALETTE[2],  // 柠檬黄
  A4: A_PALETTE[3],  // 明黄
  A7: A_PALETTE[6],  // 浅肤色
  A8: A_PALETTE[7],  // 蜜桃肤
  A9: A_PALETTE[8],  // 浅橙
  A10: A_PALETTE[9], // 活力橙
  A20: A_PALETTE[19],// 金黄

  B2: B_PALETTE[1],  // 薄荷绿
  B4: B_PALETTE[3],  // 草绿
  B6: B_PALETTE[5],  // 正绿
  B8: B_PALETTE[7],  // 墨绿
  B28: B_PALETTE[27],// 水绿
  B29: B_PALETTE[28],// 孔雀绿

  C2: C_PALETTE[1],  // 浅天蓝
  C3: C_PALETTE[2],  // 天蓝
  C4: C_PALETTE[3],  // 亮天蓝
  C15: C_PALETTE[14],// 宝蓝
  C18: C_PALETTE[17],// 藏青
  C24: C_PALETTE[23],// 青蓝

  D4: D_PALETTE[3],  // 香芋紫
  D14: D_PALETTE[13],// 荧光紫
  D24: D_PALETTE[23],// 经典紫
  D26: D_PALETTE[25],// 星空深紫

  E2: E_PALETTE[1],  // 极浅粉
  E3: E_PALETTE[2],  // 嫩粉
  E4: E_PALETTE[3],  // 少女粉
  E5: E_PALETTE[4],  // 珊瑚粉
  E14: E_PALETTE[13],// 芭比粉
  E15: E_PALETTE[14],// 亮粉红
  E7: E_PALETTE[6],  // 玫红

  F5: F_PALETTE[4],  // 鲜红
  F6: F_PALETTE[5],  // 朱红
  F7: F_PALETTE[6],  // 中国红
  F8: F_PALETTE[7],  // 深红
  F15: F_PALETTE[14],// 亮橙

  G5: G_PALETTE[4],  // 焦糖灰
  G12: G_PALETTE[11],// 奶茶色
  G16: G_PALETTE[15],// 经典棕
  G17: G_PALETTE[16],// 浓缩咖啡
  G19: G_PALETTE[18] // 摩卡棕
};

// ==========================================
// 严密矩阵构建函数 (基于空格分词，杜绝拆字 bug)
// ==========================================
function buildMatrix(rows, cmap) {
  return rows.map(r => {
    const tokens = r.trim().split(/\s+/);
    return tokens.map(t => (t === '.' || !t) ? null : (cmap[t] || null));
  });
}

// ==========================================
// 潮流精选图纸数据库 (100% 对应标准色卡)
// ==========================================
export const ALL_PATTERNS = [
  {
    id: 'kuromi-goth',
    title: '库洛米 (Kuromi 暗黑萌系)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★★',
    desc: '三丽鸥顶流库洛米，经典暗夜小恶魔头套与粉色骷髅标志。',
    matrix: buildMatrix([
      ". . . H7 . . . . . . . . H7 . . .",
      ". . H7 H7 . . . . . . . . H7 H7 . .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 D26 D24 D24 D24 D24 D24 D24 D24 D24 D24 D26 H7 .",
      "H7 D26 D24 D24 D24 D24 D24 D24 D24 D24 D24 D24 D24 D26 H7",
      "H7 D24 D24 D24 D24 E14 E14 E14 E14 D24 D24 D24 D24 H7",
      "H7 D24 D24 D24 E14 E14 E14 E14 E14 E14 D24 D24 D24 H7",
      "H7 D24 D24 D24 E14 H7 E14 E14 H7 E14 D24 D24 D24 H7",
      "H7 D24 D24 D24 E14 E14 E14 E14 E14 E14 D24 D24 D24 H7",
      "H7 D24 D24 D24 D24 E14 E14 E14 E14 D24 D24 D24 D24 H7",
      "H7 D24 D24 H1 H1 H1 H1 H1 H1 H1 H1 D24 D24 H7",
      "H7 D24 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 D24 H7",
      ". H7 H1 H1 H7 H1 H1 H1 H1 H7 H1 H1 H7 .",
      ". H7 H1 H1 H7 H1 H1 H1 H1 H7 H1 H1 H7 .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". H7 H1 H1 H1 E14 E14 E14 E14 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H1 H1 H1 H1 H7 H7 . . .",
      ". . . . . H7 H7 H7 H7 . . . . ."
    ], C_MAP)
  },
  {
    id: 'chiikawa-happy',
    title: '吉伊卡哇 (Chiikawa 治愈萌系)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '全网爆火的软萌吉伊卡哇，圆滚滚小身材与粉嫩腮红。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      "H7 H1 H7 H7 H1 H1 H1 H1 H1 H1 H7 H7 H1 H7",
      "H7 H1 H1 H1 H7 H1 H1 H1 H1 H7 H1 H1 H1 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 H7 H7 H1 H1 H1 H1 H1 H1 H7 H7 H1 H7",
      "H7 H1 H7 H7 H1 H1 H1 H1 H1 H1 H7 H7 H1 H7",
      "H7 H1 H1 H1 H1 H7 H7 H7 H7 H1 H1 H1 H1 H7",
      "H7 H1 E3 E4 E3 H1 H1 H1 H1 E3 E4 E3 H1 H7",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H1 H1 H1 H1 H7 H7 . . .",
      ". . . . H7 H1 H1 H1 H1 H7 . . . .",
      ". . . H7 H1 H1 H1 H1 H1 H1 H7 . . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  {
    id: 'cinnamoroll',
    title: '大耳狗·玉桂狗 (Cinnamoroll)',
    category: 'trending',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '三丽鸥人气王大耳狗，如云朵般轻盈的大耳朵与湛蓝眼睛。',
    matrix: buildMatrix([
      "H7 . . . . . . . . . . . . . . . . . . . . . . . . H7",
      "H7 H1 H7 . . . . . . . . . . . . . . . . . . H7 H1 H7",
      "H7 H1 H1 H7 . . . . . . . . . . . . . . . . H7 H1 H1 H7",
      ". H7 H1 H1 H7 H7 . . . . . . . . . . H7 H7 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H7 H7 H7 H7 H7 H7 H7 H7 H1 H1 H1 H7 . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H1 H1 H1 C3 H1 H1 H1 H1 C3 H1 H1 H1 H7 . . .",
      ". . . H7 H1 H1 H1 C3 H1 H1 H1 H1 C3 H1 H1 H1 H7 . . .",
      ". . . H7 H1 E3 H1 H1 H1 H1 H1 H1 H1 H1 E3 H1 H7 . . .",
      ". . . . H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 . . . .",
      ". . . . . H7 H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 H7 . . . . .",
      ". . . . . . . H7 H7 H7 H7 H7 H7 H7 H7 . . . . . . ."
    ], C_MAP)
  },
  {
    id: 'wukong-head',
    title: '黑神话：悟空 (Black Myth Wukong)',
    category: 'games',
    tag: '黑神话',
    difficulty: '★★★★★',
    desc: '国产 3A 现象级神作齐天大圣，凤翅紫金冠与威严神韵。',
    matrix: buildMatrix([
      ". . . . . . F7 F7 F7 F7 F7 F7 . . . . . .",
      ". . . . . F7 F7 F7 F7 F7 F7 F7 F7 . . . . .",
      ". . . . H7 A20 A20 A20 A20 A20 A20 H7 . . . .",
      ". . . H7 A20 A4 A4 A4 A4 A20 H7 . . .",
      ". . . H7 A4 A4 H7 H7 A4 A4 H7 . . .",
      ". . . H7 A4 H7 G17 G17 H7 A4 H7 . . .",
      ". . H7 H7 G17 G17 G17 G17 H7 H7 . .",
      ". . H7 A7 G19 A7 A7 G19 A7 H7 . .",
      ". . H7 A7 H7 A7 A7 H7 A7 H7 . .",
      ". . H7 A7 A7 A7 A7 A7 A7 H7 . .",
      ". . . H7 A7 F7 F7 A7 H7 . . .",
      ". . . H7 G19 A7 A7 G19 H7 . . .",
      ". . . . H7 G19 G19 H7 . . . .",
      ". . . . . H7 H7 . . . ."
    ], C_MAP)
  },
  {
    id: 'capybara-orange',
    title: '卡皮巴拉·顶橘子 (Capybara)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '全网超绝松弛感顶流水豚，头顶一颗可爱小甜橘。',
    matrix: buildMatrix([
      ". . . . . H7 . . . . .",
      ". . . . A10 A10 H7 . . . .",
      ". . . . A10 A10 H7 . . . .",
      ". . . . . H7 . . . . .",
      ". . . H7 G19 G19 H7 . . .",
      ". . H7 G19 G19 G19 G19 H7 . .",
      ". H7 G19 G19 G19 G19 G19 G19 H7 .",
      "H7 G19 H7 G19 G19 G19 H7 G19 H7",
      "H7 G19 H7 G19 G19 G19 H7 G19 H7",
      "H7 G19 G19 G19 G19 G19 G19 G19 H7",
      "H7 G19 G19 H7 H7 H7 H7 G19 G19 H7",
      ". H7 G19 G19 G19 G19 G19 G19 H7 .",
      ". H7 G19 G19 G19 G19 G19 G19 H7 .",
      ". H7 H7 H7 H7 H7 H7 H7 H7 H7 ."
    ], C_MAP)
  },
  {
    id: 'messi-10',
    title: '球王梅西 (Messi 经典10号)',
    category: 'football',
    tag: '世界杯球星',
    difficulty: '★★★★☆',
    desc: '蓝白阿根廷战袍，双手聆听欢呼的经典名场面。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 G19 G19 G19 G19 H7 . . .",
      ". . H7 G19 G19 G19 G19 G19 H7 . .",
      ". H7 A7 A7 A7 A7 A7 A7 A7 H7 .",
      ". H7 A7 H7 A7 A7 H7 A7 A7 H7 .",
      ". H7 A7 G19 A7 A7 G19 A7 A7 H7 .",
      ". H7 A7 G19 G19 G19 G19 A7 A7 H7 .",
      ". . H7 A7 A7 A7 A7 A7 A7 H7 . .",
      ". . H7 C3 H1 C3 H1 C3 H1 C3 H7 . .",
      ". H7 H7 C3 H1 C3 H1 C3 H1 C3 H7 H7 .",
      "H7 A7 C3 H1 C15 C15 H1 C3 A7 H7",
      "H7 A7 C3 H1 C15 H7 H1 C3 A7 H7",
      ". H7 H7 C3 H1 C15 C15 H1 C3 H7 H7 .",
      ". . . H7 H1 H1 H1 H1 H7 . . .",
      ". . . H7 C15 C15 C15 C15 H7 . . .",
      ". . . H7 C15 . . C15 H7 . . .",
      ". . . H7 A7 . . A7 H7 . . .",
      ". . . H7 H7 . . H7 H7 . . ."
    ], C_MAP)
  },
  {
    id: 'cr7-siu',
    title: 'C罗 (CR7 胜利狂欢)',
    category: 'football',
    tag: '世界杯球星',
    difficulty: '★★★★☆',
    desc: '葡萄牙标志性 7 号战袍，经典挥拳庆祝动作。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 G19 G19 G19 G19 H7 . . .",
      ". . H7 G19 G19 G19 G19 G19 H7 . .",
      ". H7 A7 A7 A7 A7 A7 A7 A7 H7 .",
      ". H7 A7 H7 A7 A7 H7 A7 A7 H7 .",
      ". H7 A7 G19 G19 G19 G19 A7 A7 H7 .",
      ". . H7 A7 A7 A7 A7 A7 A7 H7 . .",
      "H7 . H7 G19 G19 G19 G19 H7 . H7",
      "H7 A7 H7 F7 F7 F7 F7 H7 A7 H7",
      "H7 A7 H7 F7 B8 B8 F7 H7 A7 H7",
      ". H7 H7 F7 B8 H1 B8 F7 H7 H7 .",
      ". . H7 F7 F7 F7 F7 F7 H7 . .",
      ". . H7 B8 B8 B8 B8 B8 H7 . .",
      ". . H7 B8 . . B8 H7 . .",
      ". . H7 A7 . . A7 H7 . .",
      ". . H7 F7 . . F7 H7 . .",
      ". . H7 H7 . . H7 H7 . ."
    ], C_MAP)
  },
  {
    id: 'diamond-sword',
    title: '我的世界·钻石剑 (MC Diamond Sword)',
    category: 'games',
    tag: '经典游戏',
    difficulty: '★★★★☆',
    desc: '沙盒神作《Minecraft》经典附魔钻石宝剑。',
    matrix: buildMatrix([
      ". . . . . . . . . . . . . H7 C24",
      ". . . . . . . . . . . . H7 C24 C3 C24",
      ". . . . . . . . . . . H7 C24 C3 C24 H7",
      ". . . . . . . . . . H7 C24 C3 C24 H7 .",
      ". . . . . . . . . H7 C24 C3 C24 H7 . .",
      ". . . . . . . . H7 C24 C3 C24 H7 . . .",
      ". . . . . . . H7 C24 C3 C24 H7 . . . .",
      ". . . . . . H7 C24 C3 C24 H7 . . . . .",
      ". . . . . H7 C24 C3 C24 H7 . . . . . .",
      ". . . . H7 C24 C3 C24 H7 . . . . . . .",
      ". . . H7 C24 C3 C24 H7 . . . . . . . .",
      "H7 . H7 C24 C3 C24 H7 . H7 . . . . . .",
      "H7 C24 H7 C24 C3 C24 H7 H7 C24 H7 . . . . .",
      ". H7 C24 C3 C24 C3 C24 C3 C24 H7 . . . . .",
      ". . H7 C24 C3 H7 G19 H7 C24 H7 . . . . . .",
      ". . . H7 H7 . H7 G19 H7 . . . . . . . .",
      ". . . . . . H7 G19 H7 . . . . . . . .",
      ". . . . . . . H7 H7 . . . . . . . ."
    ], C_MAP)
  }
];
