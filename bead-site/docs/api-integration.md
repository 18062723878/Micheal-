# AI 生图接入教程（小白版）

拼豆网的「创作」页顶部有 **AI 生图** 板块：输入提示词 → 点「生成」→ 得到一张图 → 一键送进拼豆流程。

默认情况下网站**不需要任何配置**就能用（P0 功能全部在浏览器本地完成）。只有当你想启用「AI 生图」时，才需要按下面三步配置一个 API Key。

---

## 第一步：申请一个 API Key

AI 生图需要一个「OpenAI 兼容」的图像接口。你可以任选其一：

1. **OpenAI**（原生）：打开 https://platform.openai.com/api-keys ，登录后点 **Create new secret key**，复制以 `sk-` 开头的密钥。
2. **国内/第三方兼容服务**：很多平台提供 OpenAI 兼容的 Images 接口（如 Azure OpenAI、或任意支持 `/v1/images/generations` 的服务）。拿到它们的 `API Base` 地址和 Key 即可。

> ⚠️ 密钥等同于你的钱，不要发给任何人，也不要写进会被公开的代码里。

---

## 第二步：把 Key 交给 Worker（两种部署方式二选一）

AI 生图必须由**服务端**转发（浏览器直连会暴露你的 Key），所以我们用一个轻量的 Cloudflare Worker 做代理。

### A. 部署到 Cloudflare Workers（推荐）

1. 安装 Node 与 Wrangler：
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. 进入项目里的 `worker/` 目录并部署：
   ```bash
   cd worker
   wrangler deploy
   ```
   部署成功后会得到一个地址，形如 `https://bead-studio-worker.<你的子域>.workers.dev`。
3. 设置密钥（**不会**写进代码）：
   ```bash
   wrangler secret put API_KEY
   # 粘贴你的 sk-... 密钥
   ```
   如果你的接口不是 OpenAI 官方，还要设置上游地址：
   ```bash
   wrangler secret put API_BASE
   # 粘贴你的 images 接口完整 URL，例如 https://api.openai.com/v1/images/generations
   ```
4. 让网站知道 Worker 地址。在 `create.html` 任意 `<script>` 里、或在浏览器控制台设置：
   ```js
   window.BEAD_WORKER_BASE = 'https://bead-studio-worker.<你的子域>.workers.dev';
   ```
   更稳妥的做法：在 Cloudflare **Pages** 的环境变量里加 `BEAD_WORKER_BASE`，或在 `worker/wrangler.toml` 同级加一个前端配置。

### B. 仅本地测试（不用部署 Worker）

1. 安装 Wrangler 后在 `worker/` 目录启动本地服务：
   ```bash
   cd worker
   wrangler dev --local
   ```
   本地地址通常是 `http://127.0.0.1:8787`。
2. 设置本地密钥：
   ```bash
   wrangler secret put API_KEY   # 或在 wrangler.toml 的 [vars] 临时填（不推荐提交）
   ```
3. 在浏览器控制台执行：
   ```js
   window.BEAD_WORKER_BASE = 'http://127.0.0.1:8787';
   ```
   刷新「创作」页即可本地联调 AI 生图。

---

## 第三步：验证是否成功

1. 打开「创作」页，在 AI 生图输入框写：`一只戴帽子的卡通猫，扁平插画风格`。
2. 点「生成」：
   - 成功 → 出现图片 + 「把这张图送进拼豆」按钮。
   - 若提示 **未配置 API Key** → 说明 Worker 没连上或没设 Key，回到第二步检查 `BEAD_WORKER_BASE` 与 `API_KEY`。
   - 若返回上游错误 → 检查 `API_BASE` 与 Key 是否仍然有效、额度是否充足。

---

## 没有 Key 也能用吗？

能。AI 生图只是「可选项」：
- 不配置时，页面会显示「未配置 API Key，点此查看接入教程」的链接，其余功能（上传转拼豆、白板、灵感、导出）**完全不受影响**。
- 所有 P0 功能都在浏览器本地运行，不依赖联网。

---

## 接口约定（给开发者）

`POST /api/ai-proxy`
- 请求：`{ "prompt": "..." }`
- 成功：`{ "image": "data:image/png;base64,..." }`
- 缺 Key：`{ "error": "NO_KEY" }`

`POST /api/convert`
- 请求：`{ "grid": string[][], "op": "export", "format": "png", "size": 29 }`
- 成功：`{ "ok": true, "width": w, "height": h, ... }`
- 该端点为边缘增强；客户端始终本地完成渲染与导出，Worker 不可用时自动降级。
