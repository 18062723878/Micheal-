/**
 * tutorial-data.js — 「创作工坊」两个工作区的结构化使用教程
 *
 * 设计要点：
 *  1. 两个模块（studio 创意工坊 / whiteboard 白板画板）数据源**完全独立**，
 *     各自持有自己的分类与条目，检索时按模块作用域过滤，绝不跨模块混淆。
 *  2. 每个条目都是结构化字段，而不是一整段流水账：
 *       category  所属分类（用于分节展示）
 *       title     条目标题
 *       summary   一句话说明
 *       steps     操作步骤（整体流程 / 典型路径）
 *       controls  界面上的每一个按钮 / 工具 / 快捷键：名称、作用、点击后的行为
 *       tips      常见操作与避坑提示
 *       keywords  额外检索关键词（界面文案之外的同义词、别名）
 *  3. 纯数据 + 纯函数，无 DOM 依赖 → 可被侧栏搜索框、完整教程页与
 *     Node 回归测试共用同一份真相。
 */

/** 两个工作区的元信息（侧栏导航与页面标题都读这里） */
export const MODULES = {
  studio: {
    id: 'studio',
    name: '创意工坊',
    subtitle: '图片一键转拼豆图纸',
    icon: '🎨',
    href: 'create.html',
    accent: 'var(--accent)',
  },
  whiteboard: {
    id: 'whiteboard',
    name: '白板画板',
    subtitle: '手绘像素画，逐颗核对色号',
    icon: '🧩',
    // 用 .html 显式路径：部分静态服务器（含 python http.server）不认无扩展名的
    // pretty URL，直接写 whiteboard 会 404。
    href: 'whiteboard.html',
    accent: 'var(--info, #0ea5e9)',
  },
};

/**
 * 条目字段的轻量规范化：保证每个条目都有可检索的纯文本字段。
 * @param {Object} entry
 */
function normalize(entry) {
  return {
    id: entry.id,
    module: entry.module,
    category: entry.category,
    title: entry.title,
    summary: entry.summary || '',
    steps: entry.steps || [],
    controls: (entry.controls || []).map((c) => ({
      name: c.name,
      type: c.type || '按钮',
      action: c.action || '',
      result: c.result || '',
    })),
    tips: entry.tips || [],
    keywords: entry.keywords || [],
  };
}

/* ------------------------------------------------------------------ *
 * 创意工坊（studio）教程 —— 仅描述「图片转图纸」这条链路
 * ------------------------------------------------------------------ */
const STUDIO_ENTRIES = [
  {
    id: 'studio-flow',
    module: 'studio',
    category: '整体流程',
    title: '四步做出一张拼豆图纸',
    summary: '上传图片 → 校准参数 → 拼豆模式逐色核对 → 导出图纸。',
    steps: [
      '在「导入图片」栏点【上传本地图片】，选择照片或插画。',
      '在「画幅与色板配置」里设定像素尺寸（板宽）与色板，展开参数说明可看每项建议值。',
      '在「图像优化」里调亮度 / 对比度 / 饱和度，右侧预览会实时更新。',
      '点【拼豆模式】进入全屏核对，逐色高亮确认无误后导出 PNG / PDF / CSV。',
    ],
    controls: [
      { name: '上传本地图片', type: '按钮', action: '打开系统文件选择器', result: '读取图片并自动生成预览与色号统计' },
      { name: '拼装打卡模式', type: '开关', action: '开启后进入逐颗核对状态', result: '图纸上可点击标记已拼装的豆子' },
      { name: '清空标记', type: '按钮', action: '清除所有打卡记录', result: '已标记数量归零' },
    ],
    tips: [
      '照片类素材建议先降饱和度，避免大量近似色浪费豆子。',
      '细节复杂的图先把板宽调到 48 以上再看效果。',
    ],
    keywords: ['流程', '上传', '转换', '转图', '图纸', '怎么做', '新手', '第一步'],
  },
  {
    id: 'studio-params',
    module: 'studio',
    category: '画幅与色板',
    title: '像素尺寸、色板与色数上限',
    summary: '决定图纸密度、颜色还原度与最终用豆量。',
    steps: [
      '拖动【像素尺寸（板宽）】滑块设定横向格子数，高度按原图比例自动换算。',
      '在【标准色板选择】下拉里选一套色库。',
      '需要按库存控制用色时，打开【色数上限限制】。',
      '需要分板拼装时，打开【拼豆板拼接线】。',
    ],
    controls: [
      { name: '像素尺寸（板宽）', type: '滑块', action: '设定图纸横向格子数', result: '右侧预览与色号统计按新尺寸重算' },
      { name: '标准色板选择', type: '下拉', action: '指定转换时比对的色库', result: '色号全部按新色库重新匹配' },
      { name: '色数上限限制', type: '开关', action: '限制成品最多使用的颜色种类', result: '超出的颜色被替换为最接近的保留色' },
      { name: '拼豆板拼接线', type: '开关', action: '按真实拼板格数画出分割线', result: '图纸上出现蓝色虚线并标注板号' },
    ],
    tips: [
      '32 格适合挂件与钥匙扣；48–64 格适合摆件与大幅作品。',
      '格子越多细节越丰富，但用豆量也成倍增长。',
    ],
    keywords: ['板宽', '尺寸', '分辨率', '色板', '色库', '色数', '上限', '拼接线', '分板'],
  },
  {
    id: 'studio-optimize',
    module: 'studio',
    category: '图像优化',
    title: '亮度、对比度与饱和度调整',
    summary: '转换前先把图调得「更像拼豆」，能显著减少无谓的近似色。',
    steps: [
      '上传图片后，在「图像优化」区拖动三个滑块。',
      '观察右侧预览与色号统计是否收敛到你要的几种颜色。',
      '满意后点【重置所有参数】可一键回到初始状态。',
    ],
    controls: [
      { name: '亮度', type: '滑块', action: '提亮或压暗原图', result: '预览与色号按新亮度重新匹配' },
      { name: '对比度', type: '滑块', action: '拉开或压缩明暗差异', result: '边缘更清晰 / 色调更平缓' },
      { name: '饱和度', type: '滑块', action: '增强或减弱色彩浓度', result: '色彩更艳丽 / 更接近实物' },
      { name: '重置所有参数', type: '按钮', action: '恢复默认数值', result: '所有滑块与开关回到初始状态' },
    ],
    tips: [
      '转换是**有损**的：调色越极端，可用的真实色号越少。',
      '参数说明面板默认收起，点标题即可展开查看每项建议。',
    ],
    keywords: ['亮度', '对比度', '饱和度', '调色', '色彩', '滤镜', '优化', '重置'],
  },
  {
    id: 'studio-beadmode',
    module: 'studio',
    category: '拼豆模式',
    title: '全屏逐色核对与打卡',
    summary: '拼装时最常用的一屏：放大、逐色高亮、标记进度。',
    steps: [
      '点【拼豆模式】进入全屏。',
      '点右侧色卡高亮某个色号，图纸上只保留该色。',
      '拼完一颗就点一下该格子做打卡标记。',
      '用顶栏的 － / ＋ 缩放，按 0 或「还原」回到合适大小。',
    ],
    controls: [
      { name: '拼豆模式', type: '按钮', action: '进入全屏核对界面', result: '隐藏页面其余部分，专注拼装' },
      { name: '－ / ＋', type: '按钮', action: '缩小 / 放大图纸', result: '百分比实时变化' },
      { name: '还原', type: '按钮', action: '回到最适合当前屏幕的大小', result: '缩放恢复自适应' },
      { name: '+ / - / 0', type: '快捷键', action: '键盘缩放与还原', result: '与点击按钮等效' },
      { name: '色卡', type: '色块', action: '点击高亮该色号', result: '其余颜色淡出，便于数豆' },
      { name: '点击格子', type: '交互', action: '标记 / 取消标记该颗豆子', result: '已标记计数相应变化' },
    ],
    tips: [
      '放得很大时可以拖动画布查看细节。',
      '拼装前记得先看色号清单，缺色先补料再开工。',
    ],
    keywords: ['拼豆模式', '全屏', '核对', '打卡', '标记', '高亮', '缩放', '数豆'],
  },
  {
    id: 'studio-export',
    module: 'studio',
    category: '导出',
    title: '导出 PNG / PDF / CSV',
    summary: 'PNG 适合手机查看，PDF 适合打印，CSV 适合再加工。',
    steps: [
      '确认图纸无误后，在导出区选择格式。',
      'PNG 直接得到方格图纸图片。',
      'PDF 额外包含尺寸与色号信息，适合打印。',
      'CSV 给出逐格色号矩阵，可导入表格软件统计。',
    ],
    controls: [
      { name: '导出 PNG', type: '按钮', action: '生成并下载 PNG 图片', result: '浏览器保存图纸图片' },
      { name: '导出 PDF', type: '按钮', action: '生成可打印图纸', result: '含尺寸与色号的 PDF 文件' },
      { name: '导出 CSV', type: '按钮', action: '导出色号矩阵表格', result: '得到逐格色号数据' },
    ],
    tips: ['首次导出 PDF 需要联网加载打印库，失败会自动降级为 PNG。'],
    keywords: ['导出', '下载', '保存', 'png', 'pdf', 'csv', '打印', '矩阵'],
  },
];

/* ------------------------------------------------------------------ *
 * 白板画板（whiteboard）教程 —— 仅描述「手绘像素画」这条链路
 * 与上面 studio 的条目**一一对应但内容完全不同**，检索互不干扰。
 * ------------------------------------------------------------------ */
const WHITEBOARD_ENTRIES = [
  {
    id: 'wb-flow',
    module: 'whiteboard',
    category: '整体流程',
    title: '从空白板到成品图纸',
    summary: '选板型 → 选色 → 画（或导入图片）→ 导出。',
    steps: [
      '在左侧【选择板型尺寸】里选 20 / 29 / 40 / 52 格。',
      '在【选择色板库】挑一套色号，或用搜索框输入色号定位。',
      '用画笔、矩形、直线等工具逐颗绘制。',
      '需要底图时用【临摹底图】导入图片当参照。',
      '在右侧「用量清单」核对色号与颗数，再导出 PNG / CSV。',
    ],
    controls: [
      { name: '选择板型尺寸', type: '下拉 / 滑块', action: '设定画布为 20 / 29 / 40 / 52 格', result: '画布与右侧图纸同步重建' },
      { name: '选择色板库', type: '下拉', action: '切换 Artkal / Perler / 马卡龙 / 莫兰迪 / 复古', result: '所有格子重映射到新色板真实色号' },
      { name: '导出 PNG / CSV', type: '按钮', action: '下载当前作品', result: 'PNG 为方格图，CSV 为色号矩阵' },
    ],
    tips: [
      '换色板会重算全部色号，这是正常行为，不是出错。',
      '顶栏与侧栏的参数滑块是联动的，两边都能调。',
    ],
    keywords: ['流程', '白板', '画板', '手绘', '开始', '怎么做', '新建', '第一步'],
  },
  {
    id: 'wb-tools',
    module: 'whiteboard',
    category: '绘画工具',
    title: '画笔、橡皮、填充、吸管与形状工具',
    summary: '六种工具覆盖逐颗绘制、区域上色与取色。',
    steps: [
      '在【绘画工具】区点选一个工具，按钮会高亮表示当前选中。',
      '【笔刷大小】可选 1–5 格，画笔、橡皮、矩形都跟着变。',
      '在画布上按住拖动即可连续绘制。',
      '矩形与直线需要先按住起点、拖到终点再松开。',
    ],
    controls: [
      { name: '✏️ 画笔', type: '工具', action: '按当前色号落子', result: '拖动时连续画出一条笔迹' },
      { name: '🪣 填充', type: '工具', action: '对点击位置做洪水填充', result: '同色连通区域整体换成当前色号' },
      { name: '🧹 橡皮', type: '工具', action: '把格子擦成空白', result: '该格恢复为空，可再上色' },
      { name: '💉 吸管', type: '工具', action: '拾取格子上已有的色号', result: '当前色切换为该色并自动回到画笔' },
      { name: '▭ 矩形', type: '工具', action: '拖出一个矩形区域', result: '松开时整块填入当前色，拖动中有半透明预览' },
      { name: '📏 直线', type: '工具', action: '拖出一条直线', result: '松开时沿线落子，支持任意方向' },
      { name: '✋ 移动', type: '工具', action: '拖动画布位置', result: '只平移不落笔，方便放大后挪动' },
      { name: '笔刷大小', type: '按钮组', action: '选择 1–5 格的笔刷范围', result: '当前绘制工具的作用范围随之改变' },
    ],
    tips: [
      '形状类工具的历史只在松开时记录一次，拖动过程不会塞满撤销栈。',
      '双指捏合 = 缩放，双指拖动 = 平移，单指永远是画画。',
    ],
    keywords: ['画笔', '笔刷', '橡皮', '擦除', '填充', '油漆桶', '吸管', '取色', '矩形', '直线', '移动', '工具'],
  },
  {
    id: 'wb-symmetry',
    module: 'whiteboard',
    category: '绘画工具',
    title: '对称绘制',
    summary: '画一笔自动镜像，适合对称图案。',
    steps: [
      '在【对称绘制】区点开关切到「开」。',
      '在下拉里选左右 / 上下 / 四向。',
      '正常落笔，对侧会同步出现同样的豆子。',
    ],
    controls: [
      { name: '对称开关', type: '开关', action: '启用 / 关闭对称', result: '按钮显示「开 / 关」，下拉同时启用或禁用' },
      { name: '对称方向', type: '下拉', action: '选择左右 / 上下 / 四向', result: '后续落笔按所选轴镜像' },
    ],
    tips: ['正中间的格子镜像到自己，不会重复落子。'],
    keywords: ['对称', '镜像', '轴', '左右', '上下', '四向'],
  },
  {
    id: 'wb-filters',
    module: 'whiteboard',
    category: '画面调整',
    title: '亮度、对比度与饱和度（色号实时联动）',
    summary: '调完立刻重算每一颗的真实色号，画布、图纸、用量清单三处同步。',
    steps: [
      '在顶部筛选栏或侧栏拖动三个滑块，两边数值实时联动。',
      '观察画布颜色、右侧图纸上的色号文字与下方用量清单同步变化。',
      '想恢复原样点【重置所有参数】。',
    ],
    controls: [
      { name: '亮度', type: '滑块', action: '提亮 / 压暗所有豆子', result: '每格重新匹配到更亮或更暗的真实色号' },
      { name: '对比度', type: '滑块', action: '拉开 / 压缩明暗差异', result: '色号向两端重新分布' },
      { name: '饱和度', type: '滑块', action: '增强 / 减弱色彩浓度', result: '彩色与灰阶色号之间切换' },
      { name: '重置所有参数', type: '按钮', action: '三个滑块归零', result: '色号回到未调整状态' },
    ],
    tips: [
      '实测：橙色 A05 亮度 +50 → A03，−50 → A26，对比度 +70 → A04。',
      '这是逐颗数学计算的结果，任何浏览器都一致生效。',
    ],
    keywords: ['亮度', '对比度', '饱和度', '调色', '滤镜', '色号', '刷新', '联动'],
  },
  {
    id: 'wb-image',
    module: 'whiteboard',
    category: '图片导入',
    title: '图片转色号与临摹底图',
    summary: '两种用法：直接变成豆子，或只当参照。',
    steps: [
      '点【🧩 转色号】选择图片，图片会按当前板型缩放并匹配真实色号。',
      '想临摹就点【🖼️ 临摹底图】，图片以半透明层铺在画布下方。',
      '拖动【底图透明度】调整参考层的深浅。',
      '用【显示底图】复选框随时隐藏 / 恢复参考层。',
    ],
    controls: [
      { name: '🧩 转色号', type: '按钮', action: '导入图片并转换成拼豆矩阵', result: '画布被真实色号填满，可继续手绘修改' },
      { name: '🖼️ 临摹底图', type: '按钮', action: '把图片作为参考层', result: '图片半透明铺在豆子下方，不改变任何格子' },
      { name: '显示底图', type: '复选框', action: '显示 / 隐藏参考层', result: '便于在「看着图描」和「检查成品」之间切换' },
      { name: '底图透明度', type: '滑块', action: '调节参考层透明度', result: '数值越大越清晰，越小越不影响取色' },
    ],
    tips: ['转色号用的是和「上传转图纸」同一套配色算法，结果一致。'],
    keywords: ['图片', '导入', '底图', '参考图', '临摹', '转色号', '描图', '上传'],
  },
  {
    id: 'wb-history',
    module: 'whiteboard',
    category: '编辑与视图',
    title: '撤销、重做与旋转翻转',
    summary: '双栈历史，两个方向都能回退。',
    steps: [
      '每次落笔、填充、清空、翻转都会自动记入历史。',
      '点【↩️ 撤销】回退一步，或按 `Ctrl+Z`。',
      '点【↪️ 重做】前进一步，或按 `Ctrl+Y` / `Ctrl+Shift+Z`。',
      '用【⇄ 水平】【⇅ 垂直】【🔄 旋转】调整方向。',
    ],
    controls: [
      { name: '↩️ 撤销', type: '按钮', action: '回退到上一步', result: '可连续点击逐级回退' },
      { name: '↪️ 重做', type: '按钮', action: '恢复到撤销掉的那一步', result: '历史用尽时按钮自动置灰' },
      { name: 'Ctrl+Z', type: '快捷键', action: '撤销', result: '与点击撤销按钮等效' },
      { name: 'Ctrl+Y / Ctrl+Shift+Z', type: '快捷键', action: '重做', result: '与点击重做按钮等效' },
      { name: '🗑️ 清空', type: '按钮', action: '清空整块画布', result: '弹出确认后回到空白状态' },
      { name: '⇄ 水平', type: '按钮', action: '左右镜像整幅作品', result: '图纸左右翻转' },
      { name: '⇅ 垂直', type: '按钮', action: '上下镜像整幅作品', result: '图纸上下翻转' },
      { name: '🔄 旋转', type: '按钮', action: '顺时针旋转 90°', result: '长条作品变竖向时使用' },
    ],
    tips: ['产生新操作后重做栈会被清空，这是编辑器的标准行为。'],
    keywords: ['撤销', '重做', '回退', '历史', '清空', '翻转', '水平', '垂直', '旋转', '快捷键'],
  },
  {
    id: 'wb-view',
    module: 'whiteboard',
    category: '编辑与视图',
    title: '网格、标尺、色号显示与色板搜索',
    summary: '按需要增减视觉噪音，快速定位色号。',
    steps: [
      '在【显示设置】里单独开关网格线、坐标标尺、色号文字。',
      '在色板上方搜索框输入色号（如 `A07`）或名称（如 `Red`）。',
      '色板按颜色深浅排序，55 色也很好找。',
      '顶部提示会显示「已筛选 N / 总数 色」。',
    ],
    controls: [
      { name: '🔲 网格', type: '开关', action: '显示 / 隐藏格子线', result: '关掉后画面更干净' },
      { name: '📐 标尺', type: '开关', action: '显示 / 隐藏行列坐标', result: '右侧图纸尺寸随之变化' },
      { name: '🔢 色号', type: '开关', action: '显示 / 隐藏格内色号文字', result: '格子小时建议关掉以免糊成一团' },
      { name: '色板搜索框', type: '输入框', action: '按色号或名称筛选色板', result: '色板实时过滤，并显示命中数量' },
    ],
    tips: ['色板库切换后，之前选中的色号会重映射到新色板的对应色。'],
    keywords: ['网格', '标尺', '坐标', '色号', '显示', '隐藏', '搜索', '筛选', '色板', '查找'],
  },
];

/** 汇总导出：模块 → 分类 → 条目 */
export const TUTORIALS = {
  studio: STUDIO_ENTRIES.map(normalize),
  whiteboard: WHITEBOARD_ENTRIES.map(normalize),
};

/**
 * 取某模块的全部分类（保持数据里声明的顺序）。
 * @param {'studio'|'whiteboard'} moduleId
 * @returns {Array<{name:string, items:Array<Object>}>}
 */
export function categoriesOf(moduleId) {
  const list = TUTORIALS[moduleId] || [];
  const order = [];
  const bucket = new Map();
  for (const entry of list) {
    if (!bucket.has(entry.category)) {
      bucket.set(entry.category, []);
      order.push(entry.category);
    }
    bucket.get(entry.category).push(entry);
  }
  return order.map((name) => ({ name, items: bucket.get(name) }));
}

/** 取某模块的条目数量 */
export function countOf(moduleId) {
  return (TUTORIALS[moduleId] || []).length;
}
