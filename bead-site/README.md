# Micheal 的拼豆网 (Bead Studio)

把任意图片自动转换为 **Artkal 55 色** 拼豆图纸的零构建静态站。支持上传转拼豆、AI 生图、白板绘制、灵感临摹，并一键导出 **PNG / PDF / CSV**。

- 技术栈：**原生 HTML / CSS / JS + Canvas 2D + ES Modules**，无框架、无打包步骤。
- 直接拖到 **Cloudflare Pages** 即可上线。
- 所有 P0 功能在浏览器本地完成，不依赖联网；可选 Cloudflare Worker 仅作边缘增强（AI 生图 / 边缘转换）。

---

## 目录结构

```
bead-site/
├── index.html              # 首页：精选图纸 + 分步骤教程
├── create.html             # 创作页：AI 生图 / 上传转拼豆 / 相似图 / 白板
├── inspiration.html        # 灵感首页：6 大分类入口
├── inspiration/            # 6 个分类子页（anime/animals/landscape/text/festival/food）
├── assets/
│   ├── css/theme.css       # 蓝色设计令牌 + 拼豆板背景 + 组件样式
│   ├── css/layout.css      # 三页布局
│   └── js/                 # 全部模块（palette/color/convert/exporter/upload/
│                           #   bg-removal/worker-client/editor/home/inspiration/ai/chrome/create）
├── data/                   # featured.json / tutorials.json / inspiration.json（程序化网格）
├── worker/                 # Cloudflare Worker（/api/convert + /api/ai-proxy）+ wrangler.toml
└── docs/api-integration.md # AI 生图接入分步教程
```

---

## 本地预览

ES Modules 在 `file://` 下会被浏览器拦截，请用任意一个静态服务器：

```bash
# 任选其一，在项目根目录执行：
python -m http.server 8080
# 或
npx serve .
```

然后浏览器打开 `http://localhost:8080/`。

> 不配置任何后端即可使用全部 P0 功能（上传转拼豆、白板、灵感、导出）。

---

## 部署到 Cloudflare Pages

1. 把整个 `bead-site/` 目录推到 GitHub（或任意 Git 仓库）。
2. 在 Cloudflare Pages 新建项目，构建命令**留空**，输出目录设为 `bead-site`（或仓库根，视放置位置而定）。
3. 部署完成后即获得 `*.pages.dev` 地址，可自定义域名。
4. 无需构建、无需环境变量即可运行。

---

## 启用 Worker（可选，仅 AI 生图需要）

AI 生图需要服务端转发 Key，请部署 `worker/` 下的 Cloudflare Worker：

```bash
cd worker
wrangler deploy
wrangler secret put API_KEY      # 粘贴你的 OpenAI 兼容 Key
```

部署后得到 Worker 地址，例如 `https://bead-studio-worker.<子域>.workers.dev`。
让前端知道它：在 `create.html` 的脚本里或浏览器控制台设置

```js
window.BEAD_WORKER_BASE = 'https://bead-studio-worker.<子域>.workers.dev';
```

也可在 Cloudflare Pages 的「环境变量 / 函数变量」里配置 `BEAD_WORKER_BASE`（若你用 Pages Functions 承载 worker）。
详细分步图文见 **docs/api-integration.md**。

未配置 Worker 时，AI 板块会显示「未配置 API Key，点此查看接入教程」，其余功能照常可用。

---

## 核心算法

- `srgbToLab(rgb)`：sRGB → CIE Lab（忠实移植参考 Python 实现）。
- `nearestColorId(rgb)`：把像素 Lab 与 Artkal 55 各色预计算 Lab 比较，取欧氏距离最小者。
- `imageToBeads(image, boardWidth)`：高质量缩放后逐像素映射为色号网格，返回 `{ grid, preview, width, height }`。
- `renderGrid / renderPreview`：把网格画成带描边的小方块 / 像素化预览。
- `exportPNG / exportCSV / exportPDF`：PDF 懒加载 jsPDF（CDN），失败自动降级为 PNG。

---

## 已知限制

- **AI 生图**依赖外部 API Key 与 Worker；无 Key 时该板块不可用（其余功能不受影响）。
- **自动抠背景**首次会联网懒加载 `@imgly/background-removal` 的 WASM 模型，失败则跳过并提示。
- **PDF 导出**首次需联网加载 jsPDF；离线时自动降级为 PNG。
- 大图转换在主线程进行，超大图（板宽 > 80）可能略有卡顿；已按行分块处理以控制内存峰值。
- 选色板当前固定为 Artkal 55；如需扩展调色板，可在 `palette.js` 增加并扩展导出/统计逻辑。
