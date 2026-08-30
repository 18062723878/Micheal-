// ==========================================
// 官方标准色库定义 (A/B/C/D/E/F/G/H/M/X 体系)
// ==========================================

const H_PALETTE = [
  { code: 'H1', name: '纯白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { code: 'H2', name: '浅银灰', hex: '#E5E7EB', r: 229, g: 231, b: 235 },
  { code: 'H3', name: '质感灰', hex: '#9CA3AF', r: 156, g: 163, b: 175 },
  { code: 'H4', name: '深灰', hex: '#4B5563', r: 75, g: 85, b: 99 },
  { code: 'H5', name: '碳深灰', hex: '#374151', r: 55, g: 65, b: 81 },
  { code: 'H6', name: '暗黑灰', hex: '#1F2937', r: 31, g: 41, b: 55 },
  { code: 'H7', name: '纯黑', hex: '#111827', r: 17, g: 24, b: 39 }
];

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

const FULL_221_PALETTE = [
  ...A_PALETTE, ...B_PALETTE, ...C_PALETTE, ...D_PALETTE,
  ...E_PALETTE, ...F_PALETTE, ...G_PALETTE, ...H_PALETTE, ...M_PALETTE
];

const X88_PALETTE = Array.from({ length: 88 }, (_, i) => {
  const code = `X${i + 1}`;
  const ref = FULL_221_PALETTE[i % FULL_221_PALETTE.length];
  return { code, name: `${code} ${ref.name}`, hex: ref.hex, r: ref.r, g: ref.g, b: ref.b };
});

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

const ADV_144_PALETTE = FULL_221_PALETTE.filter((_, idx) => idx % 3 !== 0 || idx < 60);

export const PALETTES = {
  standard72: STD_72_PALETTE,
  classic88: X88_PALETTE,
  advance144: ADV_144_PALETTE,
  full221: FULL_221_PALETTE
};

export const C_MAP = {
  H1: H_PALETTE[0],  H2: H_PALETTE[1],  H3: H_PALETTE[2],  H4: H_PALETTE[3],  H5: H_PALETTE[4],  H7: H_PALETTE[6],
  A1: A_PALETTE[0],  A2: A_PALETTE[1],  A3: A_PALETTE[2],  A4: A_PALETTE[3],  A7: A_PALETTE[6],  A8: A_PALETTE[7],  A9: A_PALETTE[8],  A10: A_PALETTE[9], A20: A_PALETTE[19],
  B2: B_PALETTE[1],  B4: B_PALETTE[3],  B6: B_PALETTE[5],  B8: B_PALETTE[7],  B28: B_PALETTE[27], B29: B_PALETTE[28],
  C2: C_PALETTE[1],  C3: C_PALETTE[2],  C4: C_PALETTE[3],  C15: C_PALETTE[14], C18: C_PALETTE[17], C24: C_PALETTE[23],
  D4: D_PALETTE[3],  D14: D_PALETTE[13], D24: D_PALETTE[23], D26: D_PALETTE[25],
  E2: E_PALETTE[1],  E3: E_PALETTE[2],  E4: E_PALETTE[3],  E5: E_PALETTE[4],  E14: E_PALETTE[13], E15: E_PALETTE[14], E7: E_PALETTE[6],
  F5: F_PALETTE[4],  F6: F_PALETTE[5],  F7: F_PALETTE[6],  F8: F_PALETTE[7],  F15: F_PALETTE[14],
  G5: G_PALETTE[4],  G8: G_PALETTE[7],  G12: G_PALETTE[11], G16: G_PALETTE[15], G17: G_PALETTE[16], G19: G_PALETTE[18]
};

function buildMatrix(rows, cmap) {
  return rows.map(r => {
    const tokens = r.trim().split(/\s+/);
    return tokens.map(t => (t === '.' || !t) ? null : (cmap[t] || null));
  });
}

// ==========================================
// 潮流精选 76 款完整图纸矩阵
// ==========================================
export const ALL_PATTERNS = [
  // 1. 库洛米
  {
    id: 'kuromi-goth',
    title: '库洛米 (Kuromi 暗黑萌系)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★★',
    desc: '三丽鸥顶流库洛米，经典暗夜小恶魔头套与粉色骷髅标志。',
    matrix: buildMatrix([
      ". . . H7 . . . . . . . . H7 . . .",
      ". . H7 H7 . . . . . . . . H7 H7 . .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". H7 D26 D24 . . . . . . . . D24 D26 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 D26 D24 D24 D24 D24 D24 D24 D24 D24 D24 D26 H7 . .",
      "H7 D26 D24 D24 D24 D24 D24 D24 D24 D24 D24 D24 D24 D26 H7 .",
      "H7 D24 D24 D24 D24 E14 E14 E14 E14 D24 D24 D24 D24 H7 . .",
      "H7 D24 D24 D24 E14 E14 E14 E14 E14 E14 D24 D24 D24 H7 . .",
      "H7 D24 D24 D24 E14 H7 E14 E14 H7 E14 D24 D24 D24 H7 . .",
      "H7 D24 D24 D24 E14 E14 E14 E14 E14 E14 D24 D24 D24 H7 . .",
      "H7 D24 D24 D24 D24 E14 E14 E14 E14 D24 D24 D24 D24 H7 . .",
      "H7 D24 D24 H1 H1 H1 H1 H1 H1 H1 H1 D24 D24 H7 . . .",
      "H7 D24 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 D24 H7 . . .",
      ". H7 H1 H1 H7 H1 H1 H1 H1 H7 H1 H1 H7 . . . .",
      ". H7 H1 H1 H7 H1 H1 H1 H1 H7 H1 H1 H7 . . . .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 . . . .",
      ". H7 H1 H1 H1 E14 E14 E14 E14 H1 H1 H1 H7 . . . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . . . . .",
      ". . . H7 H7 H1 H1 H1 H1 H7 H7 . . . . . .",
      ". . . . . H7 H7 H7 H7 . . . . . . . ."
    ], C_MAP)
  },
  // 2. 美乐蒂
  {
    id: 'my-melody',
    title: '美乐蒂 (My Melody 甜美粉系)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★☆',
    desc: '软萌兔耳美乐蒂，头戴标志性小花与粉红兜帽。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 E4 E4 H7 . . . . H7 E4 E4 H7 .",
      ". H7 E4 E4 H7 . . . . H7 E4 E4 H7 .",
      ". H7 E4 E4 H7 . . . . H7 E4 E4 H7 .",
      ". . H7 E4 E4 H7 H7 H7 H7 E4 E4 H7 . .",
      ". H7 E4 E4 E4 E4 E4 E4 E4 E4 E4 E4 H7 .",
      "H7 E4 E4 E4 E4 A4 E4 E4 E4 E4 E4 E4 H7",
      "H7 E4 E4 E4 H1 A4 H1 E4 E4 E4 E4 E4 H7",
      "H7 E4 E4 H1 H1 H1 H1 H1 H1 H1 E4 E4 H7",
      "H7 E4 H1 H1 H1 H1 H1 H1 H1 H1 H1 E4 H7",
      "H7 E4 H1 H7 H1 H1 H1 H1 H7 H1 H1 E4 H7",
      ". H7 H1 H1 H1 H1 A4 H1 H1 H1 H1 H7 .",
      ". H7 H1 E3 H1 H1 H1 H1 E3 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H1 H1 H1 H7 H7 . . .",
      ". . . . . H7 H7 H7 H7 . . . . ."
    ], C_MAP)
  },
  // 3. 帕恰狗
  {
    id: 'pochacco',
    title: '帕恰狗 (Pochacco 运动元气)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★★☆',
    desc: '活力满满纯真帕恰狗，标志性黑色大垂耳与红马甲。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . . . H7 H7 .",
      "H7 H7 H7 H7 . . . . . . . H7 H7 H7 H7",
      "H7 H7 H7 H7 H7 . . . . . H7 H7 H7 H7 H7",
      ". H7 H7 H7 . H7 H7 H7 H7 . H7 H7 H7 .",
      ". . H7 . H7 H1 H1 H1 H1 H7 . H7 . .",
      ". . . H7 H1 H1 H1 H1 H1 H1 H7 . . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . H7 H1 H7 H1 H1 H1 H1 H7 H1 H7 . .",
      ". . H7 H1 H1 H1 H7 H7 H1 H1 H1 H7 . .",
      ". . H7 H1 E3 H1 H1 H1 H1 E3 H1 H7 . .",
      ". . . H7 H1 H1 H1 H1 H1 H1 H7 . . .",
      ". . . . H7 F7 F7 F7 F7 H7 . . . .",
      ". . . H7 F7 F7 F7 F7 F7 F7 H7 . . .",
      ". . . H7 H1 F7 F7 F7 F7 H1 H7 . . .",
      ". . . . H7 H7 . . H7 H7 . . . ."
    ], C_MAP)
  },
  // 4. 吉伊卡哇
  {
    id: 'chiikawa-happy',
    title: '吉伊卡哇 (Chiikawa 治愈萌系)',
    category: 'anime',
    tag: '吉伊卡哇',
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
  // 5. 哈奇小八
  {
    id: 'hachiware',
    title: '哈奇·小八 (Hachiware 乐观坚强)',
    category: 'anime',
    tag: '吉伊卡哇',
    difficulty: '★★★★☆',
    desc: '吉伊卡哇最好的伙伴小八，标志性蓝色八字刘海。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 C15 C15 C15 C15 C15 C15 C15 C15 H7 . .",
      ". H7 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 H7 .",
      "H7 C15 C15 H7 H7 C15 C15 C15 C15 H7 H7 C15 H7",
      "H7 C15 H1 H1 H7 C15 C15 C15 C15 H7 H1 H1 C15 H7",
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
  // 6. 乌萨奇
  {
    id: 'usagi-screaming',
    title: '乌萨奇 (Usagi 狂暴尖叫兔)',
    category: 'anime',
    tag: '吉伊卡哇',
    difficulty: '★★★★☆',
    desc: '呀哈！乌萨奇尖叫兔，亮黄色身躯与标志性长兔耳。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 A4 A4 H7 . . . . H7 A4 A4 H7 .",
      ". H7 A4 A4 H7 . . . . H7 A4 A4 H7 .",
      ". H7 A4 A4 H7 . . . . H7 A4 A4 H7 .",
      ". . H7 A4 A4 H7 H7 H7 H7 A4 A4 H7 . .",
      ". H7 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 H7 .",
      "H7 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 H7",
      "H7 A4 A4 A4 H7 H7 A4 A4 H7 H7 A4 A4 H7",
      "H7 A4 A4 H7 H7 H7 H7 H7 H7 H7 A4 A4 H7",
      "H7 A4 A4 H7 H1 H7 A4 A4 H7 H1 H7 A4 H7",
      "H7 A4 E3 A4 H7 H7 A4 A4 H7 H7 E3 A4 H7",
      ". H7 A4 A4 A4 A4 A4 A4 A4 A4 A4 H7 .",
      ". . H7 A4 A4 A4 A4 A4 A4 A4 A4 H7 . .",
      ". . . H7 H7 A4 A4 A4 A4 H7 H7 . . .",
      ". . . . . H7 H7 H7 H7 . . . . ."
    ], C_MAP)
  },
  // 7. 大耳狗
  {
    id: 'cinnamoroll',
    title: '大耳狗·玉桂狗 (Cinnamoroll)',
    category: 'anime',
    tag: '三丽鸥',
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
  // 8. 凯蒂猫
  {
    id: 'hello-kitty',
    title: '凯蒂猫 (Hello Kitty 经典蝴蝶结)',
    category: 'anime',
    tag: '三丽鸥',
    difficulty: '★★★☆☆',
    desc: '经典红色大蝴蝶结与纯白猫咪面庞。',
    matrix: buildMatrix([
      ". . . . . H7 H7 . . . F7 F7 . F7 F7",
      ". H7 H7 . H7 H1 H7 . F7 F7 F7 F7 F7 F7",
      "H7 H1 H7 H7 H1 H1 H7 . F7 F7 F7 F7 .",
      "H7 H1 H1 H1 H1 H1 H1 H7 . F7 F7 . .",
      "H7 H1 H1 H1 H1 H1 H1 H1 H7 H7 . . .",
      "H7 H1 H7 H1 H1 H1 H7 H1 H1 H7 . . .",
      "H7 H1 H7 H1 A4 H1 H7 H1 H1 H7 . . .",
      ". H7 H1 H1 A4 A4 H1 H1 H7 . . . .",
      ". . H7 H1 H1 H1 H1 H7 . . . . .",
      ". . . H7 H7 H7 H7 H7 . . . . . ."
    ], C_MAP)
  },
  // 9. 拉布布
  {
    id: 'labubu',
    title: '拉布布 (Labubu 精灵潮玩)',
    category: 'anime',
    tag: '潮流盲盒',
    difficulty: '★★★★★',
    desc: '泡泡玛特当红顶流 Labubu，两只长耳朵与九颗尖尖小虎牙。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 G16 G16 H7 . . . . H7 G16 G16 H7 .",
      ". H7 G16 G16 H7 . . . . H7 G16 G16 H7 .",
      ". H7 G16 G16 H7 . . . . H7 G16 G16 H7 .",
      ". . H7 G16 G16 H7 H7 H7 H7 G16 G16 H7 . .",
      ". H7 G16 G16 G16 G16 G16 G16 G16 G16 G16 G16 H7 .",
      "H7 G16 G16 G16 G16 G16 G16 G16 G16 G16 G16 G16 H7",
      "H7 G16 G16 H7 H7 G16 G16 H7 H7 G16 G16 G16 H7",
      "H7 G16 G16 H7 H1 H7 G16 H7 H1 H7 G16 G16 H7",
      "H7 G16 G16 H7 H7 G16 G16 H7 H7 G16 G16 G16 H7",
      "H7 G16 E3 G16 G16 G16 G16 G16 G16 E3 G16 G16 H7",
      "H7 G16 H7 H1 H7 H1 H7 H1 H7 H1 H7 G16 H7",
      ". H7 G16 H7 H7 H7 H7 H7 H7 H7 G16 H7 .",
      ". . H7 G16 G16 G16 G16 G16 G16 G16 G16 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 10. 黄油小熊
  {
    id: 'butterbear',
    title: '黄油小熊 (Butterbear 甜美烘焙)',
    category: 'anime',
    tag: '潮流顶流',
    difficulty: '★★★★☆',
    desc: '泰国爆火的可爱黄油小熊，金黄毛茸茸与粉红小裙子。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 A20 A20 H7 . . . . H7 A20 A20 H7 .",
      ". H7 A20 A20 H7 H7 H7 H7 H7 A20 A20 H7 .",
      "H7 A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 H7",
      "H7 A20 A20 H7 H7 A20 A20 H7 H7 A20 A20 H7",
      "H7 A20 A20 H7 H7 A20 A20 H7 H7 A20 A20 H7",
      "H7 A20 A20 A20 A20 H7 A20 A20 A20 A20 H7",
      "H7 A20 E4 A20 A20 H7 A20 A20 E4 A20 H7",
      ". H7 A20 A20 A20 A20 A20 A20 A20 A20 H7 .",
      ". . H7 E14 E14 E14 E14 E14 E14 H7 . .",
      ". H7 E14 E14 E14 E14 E14 E14 E14 E14 H7 .",
      ". H7 H1 H1 E14 E14 E14 E14 H1 H1 H7 .",
      ". . H7 H7 . . . . H7 H7 . ."
    ], C_MAP)
  },
  // 11. 皮卡丘
  {
    id: 'pikachu',
    title: '皮卡丘 (Pikachu 元气电气鼠)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★☆',
    desc: '经典黑尖耳、元气红脸蛋与闪电黄色大头。',
    matrix: buildMatrix([
      "H7 . . . . . . . . . . . . . . H7",
      "H7 H7 . . . . . . . . . . . . H7 H7",
      "H7 A4 H7 . . . . . . . . . H7 A4 H7",
      "H7 A4 A4 H7 . . . . . . . H7 A4 A4 H7",
      ". H7 A4 A4 H7 H7 H7 H7 H7 H7 A4 A4 H7 .",
      ". . H7 A4 A4 A4 A4 A4 A4 A4 A4 A4 H7 . .",
      ". H7 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 H7 .",
      ". H7 A4 H7 H7 A4 A4 A4 A4 H7 H7 A4 H7 .",
      ". H7 A4 H7 H1 A4 A4 A4 A4 H7 H1 A4 H7 .",
      ". H7 F7 A4 A4 A4 H7 H7 A4 A4 A4 F7 H7 .",
      ". H7 F7 F7 A4 A4 A4 A4 A4 A4 F7 F7 H7 .",
      ". . H7 A4 A4 A4 F7 F7 A4 A4 A4 H7 . .",
      ". . . H7 A4 A4 A4 A4 A4 A4 H7 . . .",
      ". . . . H7 H7 H7 H7 H7 H7 . . . ."
    ], C_MAP)
  },
  // 12. 耿鬼
  {
    id: 'gengar',
    title: '耿鬼 (Gengar 坏笑幽灵)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★★',
    desc: '暗影宝可梦耿鬼，标志性大红眼与咧嘴坏笑。',
    matrix: buildMatrix([
      ". . H7 . . . . . . . . . . H7 . .",
      ". H7 D26 H7 . . . . . . . H7 D26 H7 .",
      "H7 D26 D26 D26 H7 H7 H7 H7 H7 D26 D26 D26 H7",
      "H7 D26 D26 D26 D26 D26 D26 D26 D26 D26 D26 D26 H7",
      "H7 D26 F7 F7 D26 D26 D26 D26 F7 F7 D26 D26 H7",
      "H7 D26 F7 H1 D26 D26 D26 D26 F7 H1 D26 D26 H7",
      "H7 D26 D26 D26 D26 D26 D26 D26 D26 D26 D26 D26 H7",
      "H7 D26 H7 H7 H7 H7 H7 H7 H7 H7 H7 D26 H7",
      "H7 D26 H7 H1 H7 H1 H7 H1 H7 H1 H7 D26 H7",
      "H7 D26 H7 H1 H7 H1 H7 H1 H7 H1 H7 D26 H7",
      ". H7 D26 H7 H7 H7 H7 H7 H7 H7 D26 H7 .",
      ". . H7 D26 D26 D26 D26 D26 D26 D26 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 13. 小火龙
  {
    id: 'charmander',
    title: '小火龙 (Charmander 萌火蜥蜴)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★☆',
    desc: '第一世代初代御三家小火龙，亮橙色身体与清澈蓝眼。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 . . . .",
      ". . . H7 A10 A10 A10 A10 A10 H7 . . .",
      ". . H7 A10 A10 A10 A10 A10 A10 H7 . .",
      ". H7 A10 C3 H7 A10 A10 A10 A10 H7 .",
      ". H7 A10 C3 H1 A10 A10 A10 A10 H7 .",
      ". H7 A10 A10 A10 A10 A10 A10 A10 H7 .",
      ". . H7 A10 A10 A10 A10 A10 H7 . .",
      ". . . H7 A10 A10 A10 A10 H7 . . .",
      ". . H7 A7 A7 A7 A7 A7 A7 H7 . .",
      ". H7 A10 A7 A7 A7 A7 A10 A10 H7 .",
      "H7 A10 A10 A7 A7 A7 A10 A10 A10 H7",
      ". H7 A10 A10 A10 A10 A10 A10 H7 F7",
      ". . H7 H7 A10 A10 H7 H7 F7 A4",
      ". . . . H7 H7 H7 . . F7 ."
    ], C_MAP)
  },
  // 14. 杰尼龟
  {
    id: 'squirtle',
    title: '杰尼龟 (Squirtle 墨镜憨憨)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★★☆',
    desc: '水箭龟幼体杰尼龟，天蓝色圆脑袋与棕色小龟壳。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 . . . .",
      ". . . H7 C3 C3 C3 C3 C3 H7 . . .",
      ". . H7 C3 C3 C3 C3 C3 C3 H7 . .",
      ". H7 C3 F7 H7 C3 C3 C3 C3 H7 .",
      ". H7 C3 F7 H1 C3 C3 C3 C3 H7 .",
      ". H7 C3 C3 C3 C3 C3 C3 C3 H7 .",
      ". . H7 C3 C3 C3 C3 C3 H7 . .",
      ". . . H7 A1 A1 A1 A1 H7 . . .",
      ". . H7 A1 A1 A1 A1 A1 A1 H7 . .",
      ". H7 C3 G16 G16 G16 G16 C3 C3 H7 .",
      ". H7 C3 G16 G16 G16 G16 C3 C3 H7 .",
      ". . H7 C3 C3 C3 C3 C3 C3 H7 . .",
      ". . . H7 H7 . . H7 H7 . . ."
    ], C_MAP)
  },
  // 15. 精灵球
  {
    id: 'pokeball',
    title: '精灵球 (Poké Ball 经典款)',
    category: 'anime',
    tag: '宝可梦',
    difficulty: '★★★☆☆',
    desc: '红白分明、金属按扣的经典大师捕捉精灵球。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 F7 F7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 F7 F7 H7 H7 H7 H7 F7 F7 F7 F7 H7",
      "H7 H7 H7 H7 H7 H1 H1 H7 H7 H7 H7 H7 H7",
      "H7 H1 H1 H1 H7 H1 H1 H7 H1 H1 H1 H1 H7",
      "H7 H1 H1 H1 H7 H7 H7 H7 H1 H1 H1 H1 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . . H7 H7 H7 H7 H7 H7 . . . ."
    ], C_MAP)
  },
  // 16. 蜡笔小新
  {
    id: 'shinchan',
    title: '蜡笔小新 (Shin-chan 标志浓眉)',
    category: 'anime',
    tag: '经典动漫',
    difficulty: '★★★★☆',
    desc: '春日部防卫队野原新之助，经典粗眉大眼。',
    matrix: buildMatrix([
      ". . . H7 H7 H7 H7 H7 H7 . . .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 H7 H7 H7 H7 H7 H7 H7 H7 .",
      "H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7",
      "H7 A7 A7 A7 A7 A7 A7 A7 A7 A7 H7",
      "H7 H7 H7 A7 A7 H7 H7 H7 A7 A7 H7",
      "H7 A7 A7 A7 A7 A7 A7 A7 A7 A7 H7",
      "H7 A7 H7 H1 A7 A7 H7 H1 A7 A7 H7",
      "H7 A7 H7 H7 A7 A7 H7 H7 A7 A7 H7",
      ". H7 A7 A7 E4 E4 A7 A7 A7 H7 .",
      ". . H7 A7 A7 A7 A7 A7 H7 . .",
      ". . . H7 F7 F7 F7 F7 H7 . . .",
      ". . H7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". . H7 A4 A4 A4 A4 A4 A4 H7 . .",
      ". . . H7 H7 . . H7 H7 . . ."
    ], C_MAP)
  },
  // 17. 哆啦A梦
  {
    id: 'doraemon',
    title: '哆啦A梦 (Doraemon 蓝胖子)',
    category: 'anime',
    tag: '经典动漫',
    difficulty: '★★★★☆',
    desc: '来自22世纪的机器猫，红鼻子与四次元口袋。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 C15 C15 C15 C15 C15 C15 C15 C15 H7 . .",
      ". H7 C15 H7 H7 C15 C15 H7 H7 C15 C15 H7 .",
      "H7 C15 H7 H1 H7 H7 H7 H1 H7 C15 C15 H7",
      "H7 C15 H7 H7 H1 H1 H7 H7 H1 C15 C15 H7",
      "H7 C15 C15 H1 H1 F7 H1 H1 C15 C15 C15 H7",
      "H7 C15 H1 H1 H1 H7 H1 H1 H1 C15 C15 H7",
      "H7 C15 H1 H1 H7 H7 H7 H1 H1 C15 C15 H7",
      ". H7 C15 H1 H1 H1 H1 H1 H1 C15 C15 H7 .",
      ". . H7 F7 F7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". . H7 F7 F7 A4 A4 F7 F7 F7 F7 H7 . .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". H7 H1 H1 H7 H7 H7 H7 H1 H1 H1 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 18. 阿尼亚
  {
    id: 'anya-smug',
    title: '阿尼亚 (Anya 呵·优雅坏笑)',
    category: 'anime',
    tag: '间谍过家家',
    difficulty: '★★★★★',
    desc: '《间谍过家家》世界名画坏笑，粉发与标志发饰。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 E14 E14 H7 . . . . H7 E14 E14 H7 .",
      "H7 E14 E14 E14 H7 H7 H7 H7 E14 E14 E14 H7",
      "H7 E14 E14 E14 E14 E14 E14 E14 E14 E14 E14 H7",
      "H7 E14 E14 A7 A7 A7 A7 A7 A7 E14 E14 H7",
      "H7 E14 A7 H7 H7 A7 A7 H7 H7 A7 E14 H7",
      "H7 E14 A7 B6 H7 A7 A7 B6 H7 A7 E14 H7",
      "H7 E14 A7 A7 A7 A7 A7 A7 A7 A7 E14 H7",
      "H7 E14 A7 E3 H7 H7 H7 E3 A7 A7 E14 H7",
      ". H7 E14 A7 A7 A7 A7 A7 A7 E14 H7 .",
      ". . H7 E14 E14 E14 E14 E14 E14 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 . . .",
      ". . . H7 H5 H5 H5 H5 H5 H7 . . .",
      ". . . H7 H5 A20 A20 H5 H5 H7 . . ."
    ], C_MAP)
  },
  // 19. 龙猫
  {
    id: 'totoro',
    title: '龙猫 (Totoro 森林守护神)',
    category: 'anime',
    tag: '宫崎骏',
    difficulty: '★★★★☆',
    desc: '吉卜力吉兆龙猫，灰色毛茸茸肚子与三道标志胡须。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 H3 H3 H7 . . . . H7 H3 H3 H7 .",
      ". H7 H3 H3 H7 H7 H7 H7 H7 H3 H3 H7 .",
      "H7 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H7",
      "H7 H3 H3 H1 H1 H3 H3 H1 H1 H3 H3 H3 H7",
      "H7 H3 H3 H7 H1 H3 H3 H7 H1 H3 H3 H3 H7",
      "H7 H3 H3 H3 H3 H7 H7 H3 H3 H3 H3 H3 H7",
      "H7 H3 H1 H1 H1 H1 H1 H1 H1 H1 H3 H3 H7",
      "H7 H3 H1 H3 H1 H1 H1 H3 H1 H1 H3 H3 H7",
      "H7 H3 H1 H1 H1 H3 H1 H1 H1 H1 H3 H3 H7",
      ". H7 H3 H1 H1 H1 H1 H1 H1 H1 H3 H7 .",
      ". . H7 H3 H3 H3 H3 H3 H3 H3 H3 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 20. 炭治郎
  {
    id: 'tanjiro',
    title: '灶门炭治郎 (Tanjiro 绿黑市松纹)',
    category: 'anime',
    tag: '鬼灭之刃',
    difficulty: '★★★★★',
    desc: '鬼灭之刃男主，经典日轮耳饰、额头伤疤与绿黑羽织。',
    matrix: buildMatrix([
      ". . . H7 H7 H7 H7 H7 H7 . . .",
      ". . H7 F8 F8 F8 F8 F8 F8 H7 . .",
      ". H7 F8 F8 F8 F8 F8 F8 F8 F8 H7 .",
      "H7 F8 F8 F7 A7 A7 A7 A7 F8 F8 H7",
      "H7 F8 F7 A7 A7 A7 A7 A7 A7 F8 H7",
      "H7 A7 A7 H7 H1 A7 A7 H7 H1 A7 H7",
      "H7 A7 A7 F8 H7 A7 A7 F8 H7 A7 H7",
      "H7 A7 A7 A7 A7 A7 A7 A7 A7 A7 H7",
      ". H7 A7 A7 A7 H7 H7 A7 A7 H7 .",
      ". . H7 A7 A7 A7 A7 A7 A7 H7 . .",
      ". H7 B6 B6 H7 H7 B6 B6 H7 H7 .",
      ". H7 H7 H7 B6 B6 H7 H7 B6 B6 .",
      ". H7 B6 B6 H7 H7 B6 B6 H7 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 21. 祢豆子
  {
    id: 'nezuko',
    title: '灶门祢豆子 (Nezuko 咬竹筒萌妹)',
    category: 'anime',
    tag: '鬼灭之刃',
    difficulty: '★★★★★',
    desc: '粉红麻叶和服、粉眼眸与嘴衔绿竹筒的祢豆子。',
    matrix: buildMatrix([
      ". . . H7 H7 H7 H7 H7 H7 . . .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 H7 A10 A10 H7 H7 A10 A10 H7 .",
      "H7 H7 H7 A7 A7 A7 A7 A7 A7 H7 H7",
      "H7 H7 A7 E14 H1 A7 E14 H1 A7 H7 H7",
      "H7 A7 A7 E14 H7 A7 E14 H7 A7 A7 H7",
      "H7 A7 A7 A7 A7 A7 A7 A7 A7 A7 A7 H7",
      "H7 A7 B4 B4 B4 B4 B4 B4 B4 B4 A7 H7",
      ". H7 A7 B8 B8 B8 B8 B8 B8 A7 H7 .",
      ". . H7 E4 E4 E4 E4 E4 E4 H7 . .",
      ". H7 E4 E4 H7 H7 E4 E4 H7 H7 .",
      ". H7 H7 H7 E4 E4 H7 H7 E4 E4 .",
      ". . H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 22. 路飞
  {
    id: 'luffy',
    title: '草帽路飞 (Monkey D. Luffy)',
    category: 'anime',
    tag: '航海王',
    difficulty: '★★★★★',
    desc: '海贼王路飞，经典标志黄色草帽与红丝带。',
    matrix: buildMatrix([
      ". . . . . A20 A20 A20 A20 . . . . .",
      ". . . A20 A20 A20 A20 A20 A20 A20 . . .",
      ". . A20 A20 F7 F7 F7 F7 F7 A20 A20 . .",
      ". A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 .",
      "A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 A20",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 H7 A7 A7 A7 A7 A7 A7 H7 H7 .",
      ". H7 A7 H7 H1 A7 A7 H7 H1 A7 H7 .",
      ". H7 A7 H7 H7 A7 A7 H7 H7 A7 H7 .",
      ". H7 A7 A7 A7 H7 A7 A7 A7 A7 H7 .",
      ". . H7 A7 H7 H7 H7 H7 A7 H7 . .",
      ". . . H7 A7 A7 A7 A7 H7 . . .",
      ". . . . H7 F7 F7 H7 . . . ."
    ], C_MAP)
  },
  // 23. 乔巴
  {
    id: 'chopper',
    title: '托尼托尼·乔巴 (Chopper 驯鹿医生)',
    category: 'anime',
    tag: '航海王',
    difficulty: '★★★★★',
    desc: '草帽海贼团船医乔巴，粉色大十字帽与蓝鼻子。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 E14 E14 H1 H1 E14 E14 H7 . .",
      ". H7 E14 E14 H1 H1 H1 H1 E14 E14 H7 .",
      "H7 G17 E14 H1 H1 H1 H1 E14 E14 G17 H7",
      "H7 G17 G17 E14 E14 E14 E14 E14 G17 G17 H7",
      ". H7 G17 G17 G17 G17 G17 G17 G17 G17 H7 .",
      ". H7 G19 G19 G19 G19 G19 G19 G19 G19 H7 .",
      ". H7 G19 H7 H1 G19 G19 H7 H1 G19 H7 .",
      ". H7 G19 H7 H7 G19 G19 H7 H7 G19 H7 .",
      ". H7 G19 G19 G19 C3 C3 G19 G19 G19 H7 .",
      ". . H7 G19 G19 G19 G19 G19 G19 H7 . .",
      ". . . H7 F7 F7 F7 F7 F7 F7 H7 . . ."
    ], C_MAP)
  },
  // 24. 鸣人
  {
    id: 'naruto',
    title: '漩涡鸣人 (Naruto 木叶护额)',
    category: 'anime',
    tag: '火影忍者',
    difficulty: '★★★★★',
    desc: '火影男主鸣人，金黄刺猬头、木叶护额与脸颊六道胡须。',
    matrix: buildMatrix([
      ". . . A4 . A4 A4 . A4 A4 . A4 . . .",
      ". . A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 . .",
      ". A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 H5 H5 H3 H3 H3 H3 H5 H5 H7 .",
      ". H7 H5 H5 H3 H7 H7 H3 H5 H5 H7 .",
      ". . H7 A7 A7 A7 A7 A7 A7 A7 A7 H7 .",
      ". H7 A7 C3 H1 A7 A7 C3 H1 A7 H7 .",
      ". H7 A7 H7 H7 A7 A7 H7 H7 A7 H7 .",
      ". H7 H7 A7 A7 A7 A7 A7 A7 H7 H7 .",
      ". . H7 A7 H7 H7 H7 H7 A7 H7 . .",
      ". . . H7 A7 A7 A7 A7 H7 . . .",
      ". . . H7 A10 A10 A10 A10 H7 . . ."
    ], C_MAP)
  },
  // 25. 初音未来
  {
    id: 'miku',
    title: '初音未来 (Hatsune Miku 双马尾)',
    category: 'anime',
    tag: '虚拟歌姬',
    difficulty: '★★★★★',
    desc: '世界第一公主殿下，经典青葱绿双马尾与发饰。',
    matrix: buildMatrix([
      ". . B28 . . . . . . . . . . B28 . .",
      ". B28 B28 . . H7 H7 H7 H7 . . B28 B28 .",
      "B28 B28 B28 . H7 B28 B28 B28 H7 . B28 B28 B28",
      "B28 B28 . H7 B28 B28 B28 B28 B28 H7 . B28 B28",
      "B28 . . H7 B28 A7 A7 A7 A7 B28 H7 . . B28",
      ". . . H7 B28 A7 A7 A7 A7 B28 H7 . . .",
      ". . . H7 A7 B28 H1 A7 B28 H1 A7 H7 . . .",
      ". . . H7 A7 B28 H7 A7 B28 H7 A7 H7 . . .",
      ". . . H7 A7 A7 A7 A7 A7 A7 A7 H7 . . .",
      ". . . H7 A7 E3 H7 H7 E3 A7 H7 . . .",
      ". . . . H7 A7 A7 A7 A7 H7 . . . .",
      ". . . . H7 H4 H4 H4 H4 H7 . . . .",
      ". . . H7 B28 H4 H4 H4 H4 B28 H7 . . ."
    ], C_MAP)
  },

  // ================= 2. 热门游戏 / 像素硬核 (20个) =================
  // 26. 黑神话悟空
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
  // 27. 派蒙
  {
    id: 'paimon',
    title: '派蒙 (Paimon 原神应急食品)',
    category: 'games',
    tag: '原神',
    difficulty: '★★★★★',
    desc: '原神向导派蒙，白色头发、金眸与深蓝星空发夹。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". H7 H1 H1 C18 C18 H1 H1 H1 H1 H1 H7 .",
      "H7 H1 H1 C18 C18 C18 H1 H1 H1 H1 H1 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 A7 A7 A7 A7 A7 A7 A7 A7 H1 H7",
      "H7 H1 A7 A4 H1 A7 A7 A4 H1 A7 H1 H7",
      "H7 H1 A7 A4 H7 A7 A7 A4 H7 A7 H1 H7",
      "H7 H1 A7 E3 A7 A7 A7 A7 E3 A7 H1 H7",
      ". H7 H1 A7 A7 F7 F7 A7 A7 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 C18 H1 H1 H1 H1 C18 H7 . . .",
      ". . . H7 C18 A20 A20 C18 C18 H7 . . ."
    ], C_MAP)
  },
  // 28. 胡桃
  {
    id: 'hu-tao',
    title: '胡桃 (Hu Tao 往生堂主)',
    category: 'games',
    tag: '原神',
    difficulty: '★★★★★',
    desc: '往生堂七十七代堂主胡桃，标志梅花乾坤帽与梅花瞳。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 G17 G17 G17 G17 G17 G17 G17 G17 H7 . .",
      ". H7 G17 G17 F7 G17 G17 G17 G17 G17 G17 H7 .",
      "H7 G17 G17 F7 F7 G17 G17 G17 G17 G17 G17 H7",
      "H7 G17 G17 G17 G17 G17 G17 G17 G17 G17 G17 H7",
      "H7 G17 A7 A7 A7 A7 A7 A7 A7 A7 G17 H7",
      "H7 G17 A7 F7 H1 A7 A7 F7 H1 A7 G17 H7",
      "H7 G17 A7 F7 H7 A7 A7 F7 H7 A7 G17 H7",
      "H7 G17 A7 A7 A7 A7 A7 A7 A7 A7 G17 H7",
      ". H7 G17 A7 E3 F7 F7 E3 A7 G17 H7 .",
      ". . H7 G17 A7 A7 A7 A7 G17 H7 . .",
      ". . . H7 G17 G17 G17 G17 H7 . . .",
      ". . . H7 H5 H5 H5 H5 H5 H7 . . ."
    ], C_MAP)
  },
  // 29. 钟离
  {
    id: 'zhongli',
    title: '钟离 (Zhongli 岩王帝君)',
    category: 'games',
    tag: '原神',
    difficulty: '★★★★★',
    desc: '尘世闲游钟离，金珀色眼眸与沉稳神态。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 G17 G17 G17 G17 G17 G17 G17 G17 H7 . .",
      ". H7 G17 G17 G17 G17 G17 G17 G17 G17 G17 G17 H7 .",
      "H7 G17 G17 A20 G17 G17 G17 A20 G17 G17 G17 H7",
      "H7 G17 A7 A7 A7 A7 A7 A7 A7 A7 G17 H7",
      "H7 G17 A7 A20 H1 A7 A7 A20 H1 A7 G17 H7",
      "H7 G17 A7 A20 H7 A7 A7 A20 H7 A7 G17 H7",
      "H7 G17 A7 A7 A7 A7 A7 A7 A7 A7 G17 H7",
      ". H7 G17 A7 A7 H7 H7 A7 A7 G17 H7 .",
      ". . H7 G17 A7 A7 A7 A7 G17 H7 . .",
      ". . . H7 G17 G17 G17 G17 H7 . . .",
      ". . . H7 G16 A20 A20 G16 H7 . . ."
    ], C_MAP)
  },
  // 30. 雷电将军
  {
    id: 'raiden',
    title: '雷电将军 (Raiden Shogun 鸣神雷痕)',
    category: 'games',
    tag: '原神',
    difficulty: '★★★★★',
    desc: '稻妻鸣神大社守护者，紫色长编发与尊贵发簪。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 D26 D26 D26 D26 D26 D26 D26 D26 H7 . .",
      ". H7 D26 D26 D26 A20 D26 D26 D26 D26 D26 D26 H7 .",
      "H7 D26 D26 D26 A20 A20 D26 D26 D26 D26 D26 H7",
      "H7 D26 A7 A7 A7 A7 A7 A7 A7 A7 D26 H7",
      "H7 D26 A7 D24 H1 A7 A7 D24 H1 A7 D26 H7",
      "H7 D26 A7 D24 H7 A7 A7 D24 H7 A7 D26 H7",
      "H7 D26 A7 A7 A7 A7 A7 A7 A7 A7 D26 H7",
      ". H7 D26 A7 A7 H7 H7 A7 A7 D26 H7 .",
      ". . H7 D26 A7 A7 A7 A7 D26 H7 . .",
      ". . . H7 D26 D26 D26 D26 H7 . . .",
      ". . . H7 D4 D4 D4 D4 H7 . . ."
    ], C_MAP)
  },
  // 31. 钻石剑
  {
    id: 'diamond-sword',
    title: '我的世界·钻石剑 (MC Diamond Sword)',
    category: 'games',
    tag: '我的世界',
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
  },
  // 32. 钻石镐
  {
    id: 'diamond-pickaxe',
    title: '我的世界·钻石镐 (MC Diamond Pickaxe)',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: '矿工必备神级工具钻石镐。',
    matrix: buildMatrix([
      ". . . . . . . . . . H7 C24 C3 C24 H7 . .",
      ". . . . . . . H7 C24 C3 C24 C3 C24 C3 C24 H7",
      ". . . . . . H7 C24 C3 C24 H7 H7 C24 C3 C24 H7",
      ". . . . . H7 C24 C3 H7 . . . H7 C24 C3 H7 .",
      ". . . . H7 C24 H7 . . . . . . H7 C24 H7 .",
      ". . . H7 H7 . . . . H7 G19 H7 . . H7 H7 .",
      ". . . . . . . . H7 G19 H7 . . . . . . .",
      ". . . . . . . H7 G19 H7 . . . . . . . .",
      ". . . . . . H7 G19 H7 . . . . . . . . .",
      ". . . . . H7 G19 H7 . . . . . . . . . .",
      ". . . . H7 G19 H7 . . . . . . . . . . .",
      ". . . H7 G19 H7 . . . . . . . . . . . .",
      ". . H7 G19 H7 . . . . . . . . . . . . .",
      ". H7 H7 . . . . . . . . . . . . . . ."
    ], C_MAP)
  },
  // 33. 苦力怕
  {
    id: 'creeper',
    title: '我的世界·苦力怕 (MC Creeper)',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: 'SSSS...BOOM！经典绿色爆炸苦力怕头像。',
    matrix: buildMatrix([
      "B6 B6 B6 B6 B6 B6 B6 B6 B6 B6 B6 B6",
      "B6 B4 B4 B6 B6 B4 B4 B6 B6 B4 B4 B6",
      "B6 B4 H7 H7 B6 B6 B6 B6 H7 H7 B4 B6",
      "B6 B6 H7 H7 B6 B6 B6 B6 H7 H7 B6 B6",
      "B6 B6 B6 B6 H7 H7 H7 H7 B6 B6 B6 B6",
      "B6 B6 B6 H7 H7 H7 H7 H7 H7 B6 B6 B6",
      "B6 B6 B6 H7 H7 H7 H7 H7 H7 B6 B6 B6",
      "B6 B6 B6 H7 H7 . . H7 H7 B6 B6 B6",
      "B6 B6 B6 H7 H7 . . H7 H7 B6 B6 B6",
      "B6 B4 B6 B6 B6 B6 B6 B6 B6 B6 B4 B6",
      "B6 B4 B4 B6 B6 B4 B4 B6 B6 B4 B4 B6",
      "B6 B6 B6 B6 B6 B6 B6 B6 B6 B6 B6 B6"
    ], C_MAP)
  },
  // 34. TNT炸药
  {
    id: 'tnt-block',
    title: '我的世界·TNT炸药 (MC TNT Block)',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: '红白分明、破坏力惊人的 TNT 方块。',
    matrix: buildMatrix([
      "F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7",
      "F7 F8 F7 F8 F7 F8 F7 F8 F7 F8 F7 F8",
      "F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7",
      "H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1",
      "H1 H7 H7 H7 H1 H7 H1 H1 H7 H7 H7 H1",
      "H1 H1 H7 H1 H1 H7 H7 H1 H1 H7 H1 H1",
      "H1 H1 H7 H1 H1 H7 H1 H7 H1 H7 H1 H1",
      "H1 H1 H7 H1 H1 H7 H1 H1 H7 H7 H1 H1",
      "H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1",
      "F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7",
      "F7 F8 F7 F8 F7 F8 F7 F8 F7 F8 F7 F8",
      "F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7"
    ], C_MAP)
  },
  // 35. 史蒂夫
  {
    id: 'steve',
    title: '我的世界·史蒂夫 (MC Steve 方块人)',
    category: 'games',
    tag: '我的世界',
    difficulty: '★★★★☆',
    desc: '沙盒元老史蒂夫，棕发方脸与青蓝战袍。',
    matrix: buildMatrix([
      "G17 G17 G17 G17 G17 G17 G17 G17",
      "G17 G17 G17 G17 G17 G17 G17 G17",
      "G17 A7 G17 G17 G17 G17 A7 G17",
      "A7 A7 A7 A7 A7 A7 A7 A7",
      "A7 H1 C15 A7 A7 C15 H1 A7",
      "A7 A7 A7 G19 G19 A7 A7 A7",
      "A7 A7 G19 G19 G19 G19 A7 A7",
      "A7 A7 G19 G19 G19 G19 A7 A7",
      ". C24 C24 C24 C24 C24 C24 .",
      "C24 C24 C24 C24 C24 C24 C24 C24",
      "C24 C24 C24 C24 C24 C24 C24 C24",
      ". C18 C18 C18 C18 C18 C18 ."
    ], C_MAP)
  },
  // 36. 超级马里奥
  {
    id: 'mario-classic',
    title: '超级马里奥 (Super Mario 8-Bit)',
    category: 'games',
    tag: '任天堂',
    difficulty: '★★★☆☆',
    desc: '红白机经典 8-Bit 像素马里奥跑跳姿态。',
    matrix: buildMatrix([
      ". . . . F7 F7 F7 F7 F7 . . . .",
      ". . . F7 F7 F7 F7 F7 F7 F7 F7 F7 .",
      ". . . G17 G17 G17 A7 A7 G17 A7 . . .",
      ". . G17 A7 G17 A7 A7 A7 G17 A7 A7 A7 .",
      ". . G17 A7 G17 G17 A7 A7 A7 G17 A7 A7 A7",
      ". . G17 G17 A7 A7 A7 A7 G17 G17 G17 G17 .",
      ". . . . A7 A7 A7 A7 A7 A7 A7 . . .",
      ". . . F7 F7 C15 F7 F7 F7 . . . .",
      ". . F7 F7 F7 C15 F7 F7 C15 F7 F7 F7 .",
      ". F7 F7 F7 F7 C15 C15 C15 C15 F7 F7 F7 F7",
      ". A7 A7 F7 C15 A4 C15 C15 A4 C15 F7 A7 A7",
      ". A7 A7 A7 C15 C15 C15 C15 C15 C15 A7 A7 A7",
      ". . . C15 C15 C15 C15 C15 C15 C15 . . .",
      ". . G17 G17 G17 . . . G17 G17 G17 . .",
      ". G17 G17 G17 G17 . . G17 G17 G17 G17 ."
    ], C_MAP)
  },
  // 37. 星之卡比
  {
    id: 'kirby',
    title: '星之卡比 (Kirby 粉红大胃王)',
    category: 'games',
    tag: '任天堂',
    difficulty: '★★★☆☆',
    desc: '粉色圆滚滚卡比，大眼睛与红扑扑小脚丫。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 E4 E4 E4 E4 E4 E4 E4 E4 H7 . .",
      ". H7 E4 E4 E4 E4 E4 E4 E4 E4 E4 E4 H7 .",
      "H7 E4 E4 H7 H7 E4 E4 H7 H7 E4 E4 E4 H7",
      "H7 E4 E4 H7 C15 E4 E4 H7 C15 E4 E4 E4 H7",
      "H7 E4 E4 H7 H1 E4 E4 H7 H1 E4 E4 E4 H7",
      "H7 E4 E14 E4 E4 E4 E4 E4 E4 E14 E4 E4 H7",
      "H7 E4 E14 E4 E4 F7 F7 E4 E4 E14 E4 E4 H7",
      ". H7 E4 E4 E4 E4 E4 E4 E4 E4 E4 E4 H7 .",
      ". . H7 E4 E4 E4 E4 E4 E4 E4 E4 H7 . .",
      ". H7 F7 F7 H7 . . . . H7 F7 F7 H7 .",
      "H7 F7 F7 F7 F7 H7 . H7 F7 F7 F7 F7 H7",
      ". H7 H7 H7 H7 . . . . H7 H7 H7 H7 ."
    ], C_MAP)
  },
  // 38. 大师剑
  {
    id: 'zelda-sword',
    title: '大师之剑 (Master Sword 退魔之剑)',
    category: 'games',
    tag: '塞尔达传说',
    difficulty: '★★★★☆',
    desc: '《塞尔达传说》系列灵魂退魔神剑。',
    matrix: buildMatrix([
      ". . . . . . H7 C3 H7 . . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . . H7 C3 C3 H7 . . . . .",
      ". . . . H7 D24 C3 C3 D24 H7 . . . .",
      ". H7 H7 D24 D24 A20 A20 D24 D24 H7 H7 .",
      "H7 D24 D24 D24 H7 A20 H7 D24 D24 D24 H7",
      ". H7 H7 H7 . H7 C15 H7 . H7 H7 H7 .",
      ". . . . . H7 C15 H7 . . . . .",
      ". . . . . H7 C15 H7 . . . . .",
      ". . . . . H7 A20 H7 . . . . .",
      ". . . . . . H7 H7 . . . . . ."
    ], C_MAP)
  },
  // 39. 三角力量
  {
    id: 'triforce',
    title: '三角力量 (Triforce 圣三角)',
    category: 'games',
    tag: '塞尔达传说',
    difficulty: '★★★☆☆',
    desc: '海拉鲁大陆力量、智慧与勇气的金色象征。',
    matrix: buildMatrix([
      ". . . . . . A20 A20 . . . . . .",
      ". . . . . A20 A4 A4 A20 . . . . .",
      ". . . . A20 A4 A4 A4 A4 A20 . . . .",
      ". . . A20 A4 A4 A4 A4 A4 A4 A20 . . .",
      ". . A20 A4 A4 A4 A4 A4 A4 A4 A4 A20 . .",
      ". A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 .",
      ". A20 A4 A20 . . . . . . A20 A4 A20 .",
      "A20 A4 A4 A4 A20 . . . A20 A4 A4 A4 A20",
      "A20 A4 A4 A4 A4 A20 . A20 A4 A4 A4 A4 A20",
      "A20 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A20",
      "A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 A20 A20"
    ], C_MAP)
  },
  // 40. 太空狼人杀
  {
    id: 'among-us-red',
    title: '太空狼人杀 (Among Us 红色内鬼)',
    category: 'games',
    tag: '热门游戏',
    difficulty: '★★★☆☆',
    desc: '经典太空船员造型，浅蓝面罩与氧气背包。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 . . .",
      ". . . H7 F7 F7 F7 F7 F7 H7 . .",
      ". . H7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". H7 F7 F7 C2 C2 C2 C2 C2 H7 .",
      "H7 F7 F7 F7 C2 H1 C3 C3 C3 H7",
      "H7 F7 F7 F7 C2 C3 C3 C3 C3 H7",
      "H7 F7 F7 F7 H7 H7 H7 H7 H7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      ". H7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      ". . H7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". . H7 F7 F7 H7 H7 F7 F7 H7 . .",
      ". . H7 F7 F7 H7 H7 F7 F7 H7 . .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 41. 吃豆人幽灵
  {
    id: 'pacman-ghost',
    title: '吃豆人幽灵 (Pac-Man Red Ghost)',
    category: 'games',
    tag: '经典街机',
    difficulty: '★★★☆☆',
    desc: '街机黄金时代标志性小红幽灵。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 F7 F7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      "H7 F7 F7 H1 H1 F7 F7 H1 H1 F7 F7 F7 H7",
      "H7 F7 H1 H1 C15 H7 H1 H1 C15 H7 F7 F7 H7",
      "H7 F7 H1 H1 C15 H7 H1 H1 C15 H7 F7 F7 H7",
      "H7 F7 F7 H1 H1 F7 F7 H1 H1 F7 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 H7 F7 F7 H7 H7 F7 F7 H7 F7 F7 H7",
      "H7 H7 . H7 H7 . . H7 H7 . H7 H7 ."
    ], C_MAP)
  },
  // 42. 星露谷蓝鸡
  {
    id: 'blue-chicken',
    title: '星露谷·蓝鸡 (Stardew Blue Chicken)',
    category: 'games',
    tag: '星露谷物语',
    difficulty: '★★★★☆',
    desc: '玛妮农场与谢恩好感度专属奇迹蓝鸡。',
    matrix: buildMatrix([
      ". . . . . . H7 H7 H7 . . . .",
      ". . . . . H7 C15 C15 C15 H7 . . .",
      ". . . . H7 C15 C15 C15 C15 H7 . .",
      ". . . H7 F7 C15 C15 C15 C15 H7 .",
      ". . . H7 F7 F7 H7 H1 C15 C15 H7",
      ". . . . H7 F7 A4 A4 C15 C15 H7",
      ". . . H7 C15 C15 C15 C15 C15 C15 H7",
      ". . H7 C15 C15 C15 C15 C15 C15 C15 H7",
      ". H7 C15 C15 C15 C15 C15 C15 C15 C15 H7",
      "H7 C15 C15 C15 C15 C15 C15 C15 C15 C15 H7",
      "H7 C15 C15 C15 C15 C15 C15 C15 C15 C15 H7",
      ". H7 H7 C15 C15 C15 C15 C15 C15 H7 .",
      ". . . H7 A4 H7 . H7 A4 H7 . .",
      ". . . H7 A4 H7 . H7 A4 H7 . ."
    ], C_MAP)
  },
  // 43. 五彩碎片
  {
    id: 'prismatic-shard',
    title: '五彩碎片 (Prismatic Shard)',
    category: 'games',
    tag: '星露谷物语',
    difficulty: '★★★★★',
    desc: '矿洞深处蕴含彩虹光芒的至尊五彩神石。',
    matrix: buildMatrix([
      ". . . . . . H7 H7 . . . . . .",
      ". . . . . H7 F7 F7 H7 . . . . .",
      ". . . . H7 F7 A10 A10 H7 . . . .",
      ". . . H7 F7 A10 A4 A4 H7 . . .",
      ". . H7 F7 A10 A4 B4 B4 H7 . .",
      ". H7 F7 A10 A4 B4 C3 C3 H7 .",
      "H7 F7 A10 A4 B4 C3 D24 D24 H7",
      "H7 E14 A10 A4 B4 C3 D24 D26 H7",
      ". H7 E14 A4 B4 C3 D24 D26 H7 .",
      ". . H7 E14 B4 C3 D24 D26 H7 . .",
      ". . . H7 E14 C3 D24 D26 H7 . . .",
      ". . . . H7 E14 D24 D26 H7 . . . .",
      ". . . . . H7 D24 D26 H7 . . . . .",
      ". . . . . . H7 H7 . . . . . ."
    ], C_MAP)
  },
  // 44. 空洞骑士
  {
    id: 'hollow-knight',
    title: '空洞骑士 (Hollow Knight 小骑士)',
    category: 'games',
    tag: '独立游戏',
    difficulty: '★★★★★',
    desc: '圣巢救世主小骑士，白骨面具、纯黑眼窝与灰色披风。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . . . H7 H7 . .",
      ". H7 H1 H1 H7 . . . . H7 H1 H1 H7 .",
      ". H7 H1 H1 H1 H7 H7 H7 H7 H1 H1 H1 H7 .",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 H7 H7 H7 H1 H1 H7 H7 H7 H1 H7",
      "H7 H1 H7 H7 H7 H1 H1 H7 H7 H7 H1 H7",
      "H7 H1 H7 H7 H7 H1 H1 H7 H7 H7 H1 H7",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H4 H4 H4 H4 H4 H7 . . .",
      ". . H7 H4 H4 H4 H4 H4 H4 H4 H7 . .",
      ". H7 H4 H4 H4 H4 H4 H4 H4 H4 H4 H7 .",
      ". H7 H4 H4 H7 H7 H7 H7 H4 H4 H4 H7 ."
    ], C_MAP)
  },
  // 45. 菈妮
  {
    id: 'ranni',
    title: '月之公主菈妮 (Ranni the Witch)',
    category: 'games',
    tag: '艾尔登法环',
    difficulty: '★★★★★',
    desc: '《艾尔登法环》超人气月之公主，蓝色大巫师帽。',
    matrix: buildMatrix([
      ". . . . . . H7 C18 C18 H7 . . . . . .",
      ". . . . . H7 C18 C18 C18 C18 H7 . . . . .",
      ". . . . H7 C18 C18 C18 C18 C18 C18 H7 . . . .",
      ". . . H7 C18 C18 C18 C18 C18 C18 C18 C18 H7 . . .",
      ". . H7 C18 C18 C18 C18 C18 C18 C18 C18 C18 C18 H7 . .",
      "H7 C18 C18 C18 C18 C18 C18 C18 C18 C18 C18 C18 C18 H7",
      ". H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 .",
      ". . H7 C2 C2 C2 C2 C2 C2 C2 C2 C2 C2 H7 . .",
      ". H7 C2 C2 C2 C2 C2 C2 C2 C2 C2 C2 C2 C2 H7 .",
      ". H7 C2 C2 H7 H1 C2 C2 C2 H7 H1 C2 C2 H7 .",
      ". H7 C2 C2 H7 H7 C2 C2 C2 H7 H7 C2 C2 H7 .",
      ". . H7 C2 C2 C2 C2 H7 H7 C2 C2 C2 H7 . .",
      ". . . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . . .",
      ". . . H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 . . ."
    ], C_MAP)
  },

  // ================= 3. 治愈萌宠 / 可爱动物 (15个) =================
  // 46. 卡皮巴拉
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
  // 47. 柯基蜜桃臀
  {
    id: 'corgi-butt',
    title: '柯基蜜桃臀 (Corgi 摇尾柯基)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '圆滚滚大桃心柯基小屁股与粉红肉垫。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . H7 H7 .",
      "H7 A9 A9 H7 . . . . . . H7 A9 A9 H7",
      "H7 A9 A9 A9 H7 . . . . H7 A9 A9 A9 H7",
      "H7 A9 A9 A9 A9 H7 H7 H7 H7 A9 A9 A9 A9 H7",
      "H7 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 H7",
      "H7 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 H7",
      ". H7 A9 A9 A9 H1 H1 H1 H1 A9 A9 A9 H7 .",
      ". H7 A9 A9 H1 H1 H1 H1 H1 H1 A9 A9 H7 .",
      ". . H7 A9 H1 H1 H1 H1 H1 H1 A9 H7 . .",
      ". . H7 E3 H1 H1 H1 H1 H1 H1 E3 H7 . .",
      ". . H7 E3 E3 H1 H1 H1 H1 E3 E3 H7 . .",
      ". . . H7 H7 H1 H1 H1 H1 H7 H7 . . .",
      ". . . . . H7 H7 H7 H7 . . . . ."
    ], C_MAP)
  },
  // 48. 柴犬微笑
  {
    id: 'shiba-inu',
    title: '柴犬微笑 (Shiba Inu 赤柴大头)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '治愈系赤柴大笑脸，标志性白眉与翘耳朵。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . H7 H7 .",
      "H7 A9 A9 H7 . . . . . . H7 A9 A9 H7",
      "H7 A9 A9 A9 H7 H7 H7 H7 H7 A9 A9 A9 H7",
      "H7 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 H7",
      "H7 A9 H1 A9 A9 A9 A9 A9 A9 H1 A9 H7",
      "H7 A9 A9 H7 H1 A9 A9 H7 H1 A9 A9 H7",
      "H7 A9 A9 H7 H7 A9 A9 H7 H7 A9 A9 H7",
      "H7 A9 H1 H1 H1 H7 H7 H1 H1 H1 A9 H7",
      "H7 A9 H1 H1 H1 H7 H7 H1 H1 H1 A9 H7",
      ". H7 H1 H1 H1 E4 E4 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 49. 英短蓝猫
  {
    id: 'british-shorthair',
    title: '英国短毛猫 (Blue Cat 蓝猫圆脸)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '圆滚滚大腮帮英短蓝猫，金黄色铜钱大眼。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . H7 H7 .",
      "H7 H3 H3 H7 . . . . . . H7 H3 H3 H7",
      "H7 H3 H3 H3 H7 H7 H7 H7 H7 H3 H3 H3 H7",
      "H7 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H7",
      "H7 H3 H3 A4 H7 H3 H3 A4 H7 H3 H3 H3 H7",
      "H7 H3 H3 A4 H1 H3 H3 A4 H1 H3 H3 H3 H7",
      "H7 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H7",
      "H7 H3 H3 H3 H3 E4 E4 H3 H3 H3 H3 H3 H7",
      ". H7 H3 H3 H3 H7 H7 H3 H3 H3 H3 H7 .",
      ". . H7 H3 H3 H3 H3 H3 H3 H3 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 50. 三花猫
  {
    id: 'calico-cat',
    title: '三花猫 (Calico Cat 招财三色猫)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '黑白黄三色拼接的招财三花猫。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . H7 H7 .",
      "H7 H7 H7 H7 . . . . . . H7 A9 A9 H7",
      "H7 H7 H7 H7 H7 H7 H7 H7 H7 A9 A9 A9 H7",
      "H7 H7 H7 H1 H1 H1 H1 H1 A9 A9 A9 A9 H7",
      "H7 H7 H1 H7 H1 H1 H1 H1 H7 H1 A9 A9 H7",
      "H7 H1 H1 H7 H7 H1 H1 H1 H7 H7 H1 H7",
      "H7 H1 H1 H1 H1 E4 E4 H1 H1 H1 H1 H7",
      ". H7 H1 H1 H1 H7 H7 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 51. 小熊猫
  {
    id: 'red-panda',
    title: '小熊猫 (Red Panda 环尾小熊猫)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '软萌干脆面小熊猫，白耳朵、红棕毛与黑眼圈。',
    matrix: buildMatrix([
      ". H7 H1 . . . . . . . . H1 H7 .",
      "H7 H1 H1 H7 . . . . . . H7 H1 H1 H7",
      "H7 A9 A9 A9 H7 H7 H7 H7 H7 A9 A9 A9 H7",
      "H7 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 H7",
      "H7 A9 H1 H1 A9 A9 A9 A9 H1 H1 A9 H7",
      "H7 H7 H7 H1 H7 A9 A9 H7 H1 H7 H7 H7",
      "H7 H7 H7 H7 H7 A9 A9 H7 H7 H7 H7 H7",
      "H7 A9 H1 H1 H1 H7 H7 H1 H1 H1 A9 H7",
      ". H7 H5 H5 H5 H5 H5 H5 H5 H5 H7 .",
      ". . H7 H5 H5 H5 H5 H5 H5 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 52. 拿刀鸭鸭
  {
    id: 'knife-duck',
    title: '拿刀鸭鸭 (Duck with Knife 战神鸭)',
    category: 'pets',
    tag: '网红搞笑',
    difficulty: '★★★☆☆',
    desc: '全网爆火表情包：看似无辜其实手握菜刀的呆萌小黄鸭。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . . . .",
      ". . . H7 A4 A4 A4 A4 H7 . . . . .",
      ". . H7 A4 A4 A4 A4 A4 A4 H7 . . . .",
      ". . H7 A4 H7 A4 A4 A4 A4 H7 . . . .",
      ". H7 A10 A10 A10 A10 A4 A4 H7 . . . .",
      ". H7 A10 A10 A10 A10 A4 A4 H7 . . H7 H7",
      ". . H7 A4 A4 A4 A4 A4 A4 H7 H7 H3 H3 H7",
      ". H7 A4 A4 A4 A4 A4 A4 A4 H7 H3 H3 H7 .",
      "H7 A4 A4 A4 A4 A4 A4 A4 A4 H7 H7 H7 . .",
      "H7 A4 A4 A4 A4 A4 A4 A4 A4 H7 . . . .",
      ". H7 A4 A4 A4 A4 A4 A4 H7 . . . . .",
      ". . H7 A10 H7 . H7 A10 H7 . . . . ."
    ], C_MAP)
  },
  // 53. 企鹅宝宝
  {
    id: 'baby-penguin',
    title: '企鹅宝宝 (Baby Penguin 呆萌企鹅)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '圆滚滚小企鹅，黑白分明与嫩黄小嘴。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 H5 H5 H5 H5 H7 . . .",
      ". . H7 H5 H5 H5 H5 H5 H5 H7 . .",
      ". H7 H5 H1 H5 H5 H1 H5 H5 H7 .",
      ". H7 H5 H7 H1 H1 H7 H5 H5 H7 .",
      ". H7 H5 H1 A4 A4 H1 H5 H5 H7 .",
      ". H7 H5 H1 H1 H1 H1 H5 H5 H7 .",
      "H7 H5 H5 H1 H1 H1 H1 H5 H5 H7",
      "H7 H5 H5 H1 H1 H1 H1 H5 H5 H7",
      ". H7 H5 H5 H1 H1 H5 H5 H7 .",
      ". . H7 A4 H7 . H7 A4 H7 . .",
      ". . H7 H7 H7 . H7 H7 H7 . ."
    ], C_MAP)
  },
  // 54. 仓鼠
  {
    id: 'hamster',
    title: '吃瓜子仓鼠 (Cheeky Hamster)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '鼓起大腮帮吃瓜子的小仓鼠。',
    matrix: buildMatrix([
      ". . H7 H7 . . . . H7 H7 . .",
      ". H7 E3 E3 H7 . . H7 E3 E3 H7 .",
      ". H7 G12 G12 H7 H7 H7 G12 G12 H7 .",
      "H7 G12 G12 G12 G12 G12 G12 G12 G12 H7",
      "H7 G12 H7 H1 G12 G12 H7 H1 G12 H7",
      "H7 G12 H7 H7 G12 G12 H7 H7 G12 H7",
      "H7 E3 G12 G12 G17 G17 G12 G12 E3 H7",
      ". H7 H1 H1 H7 G8 G8 H7 H1 H7 .",
      ". H7 H1 H1 H7 G8 G8 H7 H1 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 55. 垂耳兔
  {
    id: 'lop-bunny',
    title: '垂耳兔 (Holland Lop 奶白兔)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '两只长耳朵耷拉下来的软萌垂耳兔。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 H1 H1 H1 H1 H7 . . .",
      ". H7 H7 H1 H1 H1 H1 H7 H7 .",
      "H7 E3 H1 H1 H1 H1 H1 H1 E3 H7",
      "H7 E3 H1 H7 H1 H1 H7 H1 E3 H7",
      "H7 H1 H1 H7 H1 H1 H7 H1 H1 H7",
      "H7 H1 H1 H1 E4 E4 H1 H1 H1 H7",
      ". H7 H1 H1 H1 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 56. 悲伤蛙
  {
    id: 'pepe-frog',
    title: '悲伤蛙·佩佩 (Pepe the Frog)',
    category: 'pets',
    tag: '网红搞笑',
    difficulty: '★★★★☆',
    desc: '网络知名神态佩佩蛙，大厚嘴唇与忧郁眼神。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 B4 B4 B4 B4 B4 B4 B4 B4 H7 . .",
      ". H7 B4 H1 H1 B4 B4 H1 H1 B4 B4 H7 .",
      "H7 B4 H1 H7 H1 B4 H1 H7 H1 B4 B4 H7",
      "H7 B4 H1 H7 H1 B4 H1 H7 H1 B4 B4 H7",
      "H7 B4 B4 H1 H1 B4 B4 H1 H1 B4 B4 H7",
      "H7 B4 B4 B4 B4 B4 B4 B4 B4 B4 B4 H7",
      ". H7 B6 B6 B6 B6 B6 B6 B6 B6 H7 .",
      ". H7 B6 F5 F5 F5 F5 F5 F5 B6 H7 .",
      "H7 B6 F5 F5 F5 F5 F5 F5 F5 F5 B6 H7",
      ". H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 ."
    ], C_MAP)
  },
  // 57. 美西螈
  {
    id: 'axolotl',
    title: '六角恐龙·美西螈 (Pink Axolotl)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '粉色美西螈蝾螈，六朵标志性红色小角鳃。',
    matrix: buildMatrix([
      "F7 . . . H7 H7 H7 H7 . . . F7",
      "F7 F7 . H7 E3 E3 E3 E3 H7 . F7 F7",
      ". F7 H7 E3 E3 E3 E3 E3 E3 H7 F7 .",
      "F7 F7 H7 E3 H7 H1 E3 H7 H1 E3 H7 F7 F7",
      "F7 . H7 E3 H7 H7 E3 H7 H7 E3 H7 . F7",
      ". . H7 E3 E3 E3 E3 E3 E3 E3 H7 . .",
      ". . H7 E3 E14 E3 E3 E14 E3 E3 H7 . .",
      ". . . H7 E3 E3 F5 E3 E3 H7 . . .",
      ". . . . H7 E3 E3 E3 E3 H7 . . . .",
      ". . . . . H7 H7 H7 H7 . . . . ."
    ], C_MAP)
  },
  // 58. 熊猫
  {
    id: 'panda',
    title: '国宝大熊猫 (Giant Panda 啃竹子)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★☆☆',
    desc: '圆滚滚大熊猫，黑眼圈与嫩绿小竹子。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . H7 H7 .",
      "H7 H7 H7 H7 . . . . H7 H7 H7 H7",
      "H7 H7 H7 H1 H1 H1 H1 H1 H7 H7 H7",
      ". H7 H1 H7 H7 H1 H7 H7 H1 H7 .",
      ". H7 H1 H7 H1 H1 H7 H1 H1 H7 .",
      ". H7 H1 H1 H1 H7 H1 H1 H1 H7 .",
      ". H7 H1 H1 H7 H7 H7 H1 B4 H7 .",
      ". . H7 H1 H1 H1 H1 H1 B4 H7 .",
      ". H7 H7 H5 H5 H5 H5 H5 B4 H7 .",
      ". H7 H5 H5 H5 H5 H5 H5 B4 H7 .",
      ". . H7 H7 . . . . H7 H7 ."
    ], C_MAP)
  },
  // 59. 水獭
  {
    id: 'otter',
    title: '仰泳水獭 (Cute Sea Otter)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '漂浮在水面、双手抱胸的可爱小水獭。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 G16 G16 G16 G16 H7 . . .",
      ". . H7 G16 G16 G16 G16 G16 G16 H7 . .",
      ". H7 G16 H7 H1 G16 G16 H7 H1 G16 H7 .",
      ". H7 G16 H7 H7 G16 G16 H7 H7 G16 H7 .",
      ". H7 G16 G12 G12 G17 G12 G12 G16 H7 .",
      ". . H7 G12 G12 G12 G12 G12 G12 H7 . .",
      ". H7 G16 G16 G16 G16 G16 G16 G16 G16 H7 .",
      "H7 G16 G16 G16 G12 G12 G16 G16 G16 H7",
      ". H7 G16 G16 G16 G16 G16 G16 G16 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 60. 小狐狸
  {
    id: 'red-fox',
    title: '小狐狸 (Cute Red Fox 蓬松大尾巴)',
    category: 'pets',
    tag: '治愈萌宠',
    difficulty: '★★★★☆',
    desc: '橙红毛皮、纯白围脖与大耳朵的小狐狸。',
    matrix: buildMatrix([
      "H7 H7 . . . . . . . . H7 H7",
      "H7 F15 H7 . . . . . . H7 F15 H7",
      "H7 F15 F15 H7 H7 H7 H7 H7 F15 F15 H7",
      "H7 F15 F15 F15 F15 F15 F15 F15 F15 F15 F15 H7",
      "H7 F15 F15 H7 H1 F15 F15 H7 H1 F15 F15 H7",
      "H7 F15 H1 H7 H7 H1 H1 H7 H7 H1 F15 H7",
      ". H7 H1 H1 H1 H7 H7 H1 H1 H1 H7 .",
      ". . H7 H1 H1 H1 H1 H1 H1 H7 . .",
      ". . . H7 F15 F15 F15 F15 H7 . . .",
      ". . H7 F15 F15 F15 F15 H1 H1 H7 .",
      ". . . H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },

  // ================= 4. 美食甜品 / 快乐水 (10个) =================
  // 61. 汉堡
  {
    id: 'double-burger',
    title: '双层芝士牛肉汉堡 (Burger)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '松软芝麻面包、香煎多汁肉饼、融化芝士与新鲜生菜。',
    matrix: buildMatrix([
      ". . . . A9 A9 A9 A9 A9 A9 . . . .",
      ". . A9 A9 A4 A9 A4 A9 A4 A9 A9 . .",
      ". A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 A9 .",
      ". B4 B4 B4 B4 B4 B4 B4 B4 B4 B4 B4 .",
      ". F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 .",
      ". A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 .",
      ". G17 G17 G17 G17 G17 G17 G17 G17 G17 G17 G17 .",
      ". . A9 A9 A9 A9 A9 A9 A9 A9 A9 . .",
      ". . . A9 A9 A9 A9 A9 A9 A9 . . ."
    ], C_MAP)
  },
  // 62. 薯条
  {
    id: 'french-fries',
    title: '香脆薯条 (French Fries)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '金黄诱人炸薯条与红色包装盒。',
    matrix: buildMatrix([
      ". . A4 . A4 . A4 . A4 . .",
      ". A4 A4 A4 A4 A4 A4 A4 A4 A4 .",
      ". A4 A4 A4 A4 A4 A4 A4 A4 A4 .",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 F7 F7 A4 A4 F7 F7 F7 F7 H7",
      "H7 F7 F7 A4 A4 A4 A4 F7 F7 F7 H7",
      "H7 F7 F7 A4 A4 A4 A4 F7 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      ". H7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      ". H7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 63. 披萨
  {
    id: 'pizza-slice',
    title: '拉丝披萨 (Pepperoni Pizza)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '浓郁芝士、意式萨拉米香肠与金黄酥脆饼底。',
    matrix: buildMatrix([
      ". . . . . . G16 G16 G16 G16 .",
      ". . . . . G16 A9 A9 A9 A9 G16",
      ". . . . A9 A4 A4 F7 F7 A4 A9",
      ". . . A9 A4 A4 F7 F7 A4 A4 .",
      ". . A9 A4 F7 F7 A4 A4 A4 . .",
      ". A9 A4 F7 F7 A4 A4 . . . .",
      "A9 A4 A4 A4 A4 . . . . . .",
      "A9 A4 A4 . . . . . . . . .",
      "A9 . . . . . . . . . . . ."
    ], C_MAP)
  },
  // 64. 珍珠奶茶
  {
    id: 'boba-tea',
    title: '黑糖珍珠奶茶 (Boba Milk Tea)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★☆☆☆',
    desc: '夏日解暑黑糖波霸奶茶，附带条纹吸管。',
    matrix: buildMatrix([
      ". . . . . . F7 F7 . . . . .",
      ". . . . . F7 H1 . . . . . .",
      ". . . . F7 F7 . . . . . . .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". H7 G12 G12 G12 G12 G12 G12 G12 G12 H7 .",
      ". H7 G12 G12 G12 G12 G12 G12 G12 G12 H7 .",
      ". H7 G12 G12 G12 G12 G12 G12 G12 G12 H7 .",
      ". H7 G12 H7 G12 G12 H7 G12 H7 G12 H7 .",
      ". H7 H7 G12 H7 H7 G12 H7 H7 G12 H7 .",
      ". H7 G12 H7 G12 G12 H7 G12 H7 G12 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 65. 草莓蛋糕
  {
    id: 'strawberry-cake',
    title: '草莓奶油蛋糕 (Strawberry Cake)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '新鲜多汁大草莓配上层层雪白松软奶油蛋糕。',
    matrix: buildMatrix([
      ". . . . . F7 F7 . . . . .",
      ". . . . F7 F7 F7 F7 . . . .",
      ". . . F7 A4 F7 A4 F7 . . .",
      ". . H7 H1 H1 H1 H1 H1 H1 H7 . .",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      "H7 E3 E3 E3 E3 E3 E3 E3 E3 E3 E3 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 G16 G16 G16 G16 G16 G16 G16 G16 G16 G16 H7",
      ". H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 ."
    ], C_MAP)
  },
  // 66. 甜甜圈
  {
    id: 'sprinkle-donut',
    title: '彩针甜甜圈 (Sprinkle Donut)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '粉色糖霜与彩色糖针的经典松软甜甜圈。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 E14 E14 E14 E14 E14 E14 E14 E14 H7 . .",
      ". H7 E14 A4 E14 E14 C3 E14 E14 F7 E14 H7 .",
      "H7 E14 E14 E14 H7 H7 H7 H7 E14 E14 B4 E14 H7",
      "H7 E14 B4 E14 H7 G12 G12 H7 E14 E14 E14 E14 H7",
      "H7 E14 E14 E14 H7 G12 G12 H7 E14 A4 E14 E14 H7",
      "H7 E14 C3 E14 H7 H7 H7 H7 E14 E14 E14 E14 H7",
      ". H7 G16 G16 G16 G16 G16 G16 G16 G16 E14 H7 .",
      ". . H7 G16 G16 G16 G16 G16 G16 G16 G16 H7 . .",
      ". . . . H7 H7 H7 H7 H7 H7 . . . ."
    ], C_MAP)
  },
  // 67. 甜筒
  {
    id: 'soft-ice-cream',
    title: '双色甜筒 (Soft Ice Cream)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★☆☆',
    desc: '草莓香草双色旋涡冰淇淋与华夫脆筒。',
    matrix: buildMatrix([
      ". . . . H7 E4 E4 H7 . . . .",
      ". . . H7 E4 H1 H1 E4 H7 . . .",
      ". . H7 E4 H1 H1 E4 H1 E4 H7 . .",
      ". . H7 E4 H1 H1 E4 H1 E4 H7 . .",
      ". H7 E4 H1 E4 H1 E4 H1 E4 H1 H7 .",
      ". H7 E4 E4 E4 E4 E4 E4 E4 E4 H7 .",
      ". . H7 G16 G16 G16 G16 G16 H7 . .",
      ". . . H7 G16 A20 G16 G16 H7 . . .",
      ". . . H7 G16 G16 A20 G16 H7 . . .",
      ". . . . H7 G16 G16 G16 H7 . . . .",
      ". . . . . H7 G16 H7 . . . . .",
      ". . . . . . H7 H7 . . . . . ."
    ], C_MAP)
  },
  // 68. 日式拉面
  {
    id: 'ramen-bowl',
    title: '日式拉面 (Tonkotsu Ramen)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★★★☆',
    desc: '浓郁骨汤、溏心蛋、鸣门卷与红色大面碗。',
    matrix: buildMatrix([
      ". . . . . . . . . G16 G16 G16 G16",
      ". . . H7 H7 H7 H7 H7 G16 . . .",
      ". . H7 A4 A4 H1 F7 A4 A4 H7 . .",
      ". H7 A4 A4 A4 H1 F7 A4 A4 A4 H7 .",
      ". H7 A4 A4 A4 A4 A4 A4 A4 A4 H7 .",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      "H7 F7 H1 H1 F7 F7 F7 H1 H1 F7 F7 H7",
      "H7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 H7",
      ". H7 F7 F7 F7 F7 F7 F7 F7 H7 .",
      ". . H7 F7 F7 F7 F7 F7 F7 F7 H7 . .",
      ". . . H7 H7 H7 H7 H7 H7 H7 . . ."
    ], C_MAP)
  },
  // 69. 牛油果
  {
    id: 'avocado',
    title: '牛油果 (Avocado 森林奶油)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★☆☆☆',
    desc: '对半切开的青绿牛油果与圆润大果核。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 . . . .",
      ". . . H7 B8 B8 B8 B8 H7 . . .",
      ". . H7 B8 B4 B4 B4 B4 B8 H7 . .",
      ". H7 B8 B4 B2 B2 B2 B2 B4 B8 H7 .",
      ". H7 B8 B4 B2 G17 G17 B2 B4 B8 H7 .",
      "H7 B8 B4 B2 G17 G19 G17 B2 B4 B8 H7",
      "H7 B8 B4 B2 G17 G19 G17 B2 B4 B8 H7",
      ". H7 B8 B4 B2 G17 G17 B2 B4 B8 H7 .",
      ". H7 B8 B4 B2 B2 B2 B2 B4 B8 H7 .",
      ". . H7 B8 B4 B4 B4 B4 B8 H7 . .",
      ". . . H7 B8 B8 B8 B8 H7 . . .",
      ". . . . H7 H7 H7 H7 . . . ."
    ], C_MAP)
  },
  // 70. 三文鱼寿司
  {
    id: 'sushi-salmon',
    title: '三文鱼寿司 (Salmon Sushi)',
    category: 'food',
    tag: '美食甜品',
    difficulty: '★★☆☆☆',
    desc: '鲜美橙红三文鱼刺身与软糯醋饭团。',
    matrix: buildMatrix([
      ". . . . H7 H7 H7 H7 H7 H7 H7 H7 . . . .",
      ". . H7 A10 A10 H1 H1 A10 A10 H1 H1 A10 H7 . .",
      ". H7 A10 A10 H1 H1 A10 A10 H1 H1 A10 A10 H7 .",
      "H7 A10 A10 A10 A10 A10 A10 A10 A10 A10 A10 A10 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      ". H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },

  // ================= 5. 名胜古建 / 节日东方 (6个) =================
  // 71. 2026 祥瑞金马
  {
    id: 'horse-2026',
    title: '2026 祥瑞金马 (马年特辑)',
    category: 'culture',
    tag: '2026马年',
    difficulty: '★★★★★',
    desc: '2026马年吉祥物，昂首奔腾的祥瑞赤金小骏马。',
    matrix: buildMatrix([
      ". . . . . . H7 H7 H7 H7 . . . . . . . .",
      ". . . . H7 H7 A20 A4 A20 A4 H7 H7 . . . . . .",
      ". . . H7 A20 A4 A4 A4 A20 A4 A20 A4 H7 . . . .",
      ". . H7 A20 A4 A4 A4 A20 A4 A20 A4 A4 H7 . . .",
      ". H7 A20 A4 A4 H7 H7 A20 A4 A20 A4 A4 H7 . . .",
      ". H7 A20 A4 A4 H7 H7 A20 A4 A20 A4 H7 . . . .",
      ". H7 A20 A4 A4 A4 A4 A4 A4 A20 A4 H7 . . . .",
      ". H7 A20 A4 A4 A7 A7 A7 A7 A4 A4 H7 . . . .",
      ". . H7 A20 A4 A4 A4 A4 A4 A4 H7 H7 H7 H7 H7 H7",
      ". . . H7 A20 A4 A4 A4 A4 A4 A4 A4 A4 A4 A4 A20 H7",
      ". . . H7 A20 A4 A4 A20 A4 A20 A4 A4 A4 A4 A4 A20 H7",
      ". . . . H7 A20 A4 A20 A4 A20 A4 A4 A4 A4 A4 A20 H7",
      ". . . . H7 A20 A4 A20 A4 A20 A4 A4 F7 F7 A4 A20 H7",
      ". . . . H7 A20 A4 A4 A4 A20 A4 F7 H1 H1 A4 F7 A20 H7",
      ". . . . H7 A20 A4 A20 A4 A20 A4 A4 F7 F7 A4 A20 H7",
      ". . . . H7 A20 A4 H7 H7 A20 A4 H7 H7 A4 A4 A20 H7",
      ". . . . H7 A20 A4 H7 . H7 A20 A4 H7 . H7 A20 H7",
      ". . . . H7 A20 A4 H7 . H7 A20 A4 H7 . H7 A20 H7",
      ". . . . H7 H7 H7 H7 . H7 H7 H7 H7 . H7 H7 H7"
    ], C_MAP)
  },
  // 72. 严岛鸟居
  {
    id: 'torii-gate',
    title: '严岛水上鸟居 (东方美学)',
    category: 'culture',
    tag: '名胜古建',
    difficulty: '★★★☆☆',
    desc: '东方美学经典神木朱红大鸟居，静立于碧海之上。',
    matrix: buildMatrix([
      ". F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 .",
      ". F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 .",
      ". . . . F7 F7 . . . . . . F7 F7 . . . .",
      ". . . . F8 F8 . . . . . . F8 F8 . . . .",
      ". F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 F7 .",
      ". . . . F7 F7 . . . . . . F7 F7 . . . .",
      ". . . . F7 F7 . . . . . . F7 F7 . . . .",
      ". . . . F7 F7 . . . . . . F7 F7 . . . .",
      ". . . . F7 F7 . . . . . . F7 F7 . . . .",
      ". . . . H7 H7 . . . . . . H7 H7 . . . .",
      "C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3",
      "C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15 C15"
    ], C_MAP)
  },
  // 73. 富士山
  {
    id: 'fuji-mountain',
    title: '富士山 (Mount Fuji 雪顶红日)',
    category: 'culture',
    tag: '名胜古建',
    difficulty: '★★★☆☆',
    desc: '雪顶富士山配以东方朱红初升旭日。',
    matrix: buildMatrix([
      ". . . . . . . F7 F7 F7 F7 . . . . . . .",
      ". . . . . . F7 F7 F7 F7 F7 F7 . . . . . .",
      ". . . . . . F7 F7 F7 F7 F7 F7 . . . . . .",
      ". . . . . . . F7 F7 F7 F7 . . . . . . .",
      ". . . . . . H1 H1 H1 H1 . . . . . . .",
      ". . . . . H1 H1 H1 H1 H1 H1 . . . . .",
      ". . . . H1 H1 H1 H1 H1 H1 H1 H1 . . . .",
      ". . . H1 H1 C3 H1 H1 H1 H1 C3 H1 H1 . . .",
      ". . C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 . .",
      ". C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 .",
      "C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3 C3"
    ], C_MAP)
  },
  // 74. 醒狮头
  {
    id: 'lion-dance',
    title: '传统醒狮头 (Southern Lion Dance)',
    category: 'culture',
    tag: '国潮非遗',
    difficulty: '★★★★★',
    desc: '非遗国潮南狮醒狮头，威武霸气生龙活虎。',
    matrix: buildMatrix([
      ". . . . . F7 F7 F7 F7 F7 F7 . . . . .",
      ". . . F7 F7 A4 A4 A4 A4 F7 F7 . . .",
      ". . F7 F7 A20 A20 A20 A20 A20 A20 F7 F7 . .",
      ". F7 F7 H1 H1 H7 H7 H7 H7 H1 H1 F7 F7 .",
      ". F7 F7 H1 H7 H1 H1 H1 H1 H7 H1 F7 F7 .",
      "F7 F7 F7 H1 H7 H1 H1 H1 H1 H7 H1 F7 F7 F7",
      "F7 A4 F7 H1 H1 H7 H7 H7 H7 H1 H1 F7 A4 F7",
      "F7 A4 F7 F7 F7 A4 A4 A4 A4 F7 F7 F7 A4 F7",
      ". F7 F7 F7 H1 H1 H1 H1 H1 H1 F7 F7 F7 .",
      ". . F7 F7 H1 H7 H1 H1 H7 H1 F7 F7 . .",
      ". . . F7 F7 H1 H1 H1 H1 F7 F7 . . ."
    ], C_MAP)
  },
  // 75. 招财猫
  {
    id: 'lucky-cat',
    title: '招财猫 (Maneki Neko 举手招财)',
    category: 'culture',
    tag: '东方吉祥',
    difficulty: '★★★★☆',
    desc: '举起右手招财纳福的日本招财猫，红项圈与金铃铛。',
    matrix: buildMatrix([
      ". H7 H7 . . . . . . . . H7 H7",
      "H7 F7 F7 H7 . . . . . . H7 F7 F7 H7",
      "H7 F7 F7 F7 H7 H7 H7 H7 H7 F7 F7 F7 H7",
      "H7 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H1 H7",
      "H7 H1 H7 H1 H1 H1 H1 H1 H1 H7 H1 H1 H7",
      "H7 H1 H7 H7 H1 H1 H1 H1 H1 H7 H7 H1 H7",
      "H7 H1 E4 E4 H1 H1 H1 H1 H1 E4 E4 H1 H7",
      ". H7 H1 H1 H1 F7 F7 F7 F7 H1 H1 H1 H7",
      "H7 H1 H1 H1 F7 F7 A4 A4 F7 F7 H1 H1 H7",
      "H7 H1 H1 H1 H1 F7 F7 F7 F7 H1 H1 H1 H7",
      ". H7 H1 H1 H1 A20 A20 A20 A20 H1 H1 H7 .",
      ". . H7 H7 H7 H7 H7 H7 H7 H7 H7 H7 . ."
    ], C_MAP)
  },
  // 76. 锦鲤戏水
  {
    id: 'lucky-koi',
    title: '锦鲤戏水 (Lucky Koi 鸿运当头)',
    category: 'culture',
    tag: '东方吉祥',
    difficulty: '★★★★☆',
    desc: '赤金红白相间的鸿运锦鲤，灵动摇尾。',
    matrix: buildMatrix([
      ". . . . . . . . . . H7 F7 H7",
      ". . . . . . . . . H7 F7 F7 H7",
      ". . . . . . . . H7 F7 F7 F7 H7",
      ". . . . . . . H7 F7 F7 F7 H7",
      ". . . . . . H7 A10 A10 F7 H7 .",
      ". . . . . H7 A10 A10 H1 H7 . .",
      ". . . . H7 A10 H1 H1 H7 . . .",
      ". . . H7 F7 H1 H1 H7 . . . .",
      ". . H7 F7 F7 H7 H7 . . . . .",
      ". H7 F7 F7 H7 H7 F7 H7 . . .",
      "H7 F7 H7 H7 . . H7 F7 H7 . .",
      "H7 H7 . . . . . . H7 H7 . ."
    ], C_MAP)
  }
];
