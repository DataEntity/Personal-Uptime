# Personal Uptime · v0.1

基于 Wallpaper Engine 的个人运维 HUD 壁纸。在桌面右下角以 **ASCII 终端风格** 展示服务器 CPU / 内存 / 磁盘 / 运行时间。

> 不是传统监控后台，而是面向个人开发者的桌面状态面板（Narrative Dashboard）。

---

## v0.1 范围

### 已完成

- ASCII 进度条 HUD 面板（`█░` 字符绘制）
- 四象限壁纸画布布局（当前仅启用右下象限）
- 阶段一数据契约：`cpu` / `memory` / `disk` / `uptime` / `updatedAt`
- 数据层与 UI **彻底解耦**（可插拔 `StatusLoader`）
- `mock` / `live` / `auto` 三种数据模式
- 静态导出（`out/`），可导入 Wallpaper Engine

### 未完成（后续版本）

- 服务列表（Docker / Node 等）— 阶段二
- Git 开发活动 — 阶段三
- 日志聚合 / AI 日报 — 阶段四、五
- 壁纸背景图、动效
- systemd 常驻、多机配置化

---

## 系统架构

本项目是 **展示端**（客户端）。数据采集与 API 在独立仓库运行：

```text
服务器（Linux + Tailscale）
├─ collect-status.sh     采集 /proc、df 等
├─ data/status.json      JSON 数据文件
└─ Node API :3000        GET /status、/health
         │
    Tailscale 私有网络
         │
Windows 客户端
└─ Wallpaper Engine
   └─ 本仓库 out/index.html
```

```text
数据流：

  采集脚本 → status.json → HTTP API → fetch → ASCII HUD
```

---

## 项目结构

```text
app/
├── page.tsx                          # Composition Root（注入配置）
├── data/
│   ├── types.ts                      # 数据契约、StatusBadge
│   ├── ports.ts                      # StatusLoader 接口
│   ├── app-config.ts                 # env → AppStatusConfig
│   ├── loaders/                      # mock / live / auto 实现
│   └── hooks/use-status-loader.ts    # 通用轮询 hook
├── components/
│   ├── ServerStatus/
│   │   ├── ServerStatusWidget.tsx    # 容器：loader + hook
│   │   └── StatusPanel.tsx           # 纯展示
│   ├── hud/AsciiHud.tsx              # <pre> 渲染壳
│   └── layout/WallpaperCanvas.tsx    # 四象限画布
└── lib/ascii/                        # 纯函数拼 ASCII 字符串
```

### 依赖方向

```text
page.tsx
  → app-config
  → ServerStatusWidget（注入 config）
      → createStatusLoader（可插拔）
      → useStatusLoader
      → StatusPanel（纯 props）
          → renderServerStatusPanel
```

UI 组件不直接 import fetch、env 或 loader 实现。

---

## 快速开始

### 环境要求

- Node.js 20+
- pnpm

### 安装与开发

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

默认 `NEXT_PUBLIC_DATA_MODE=mock`，**不需要启动 API** 即可调 UI。

### 构建（Wallpaper Engine）

```bash
pnpm build
# 产物在 out/
```

将 `out/` 目录拷到 Windows，用本地 HTTP 服务打开（不要直接 `file://`）：

```cmd
cd out
npx serve .
```

或在 Wallpaper Engine 中创建网页壁纸，入口指向 `index.html`。

---

## 环境变量

复制 `.env.local.example` 为 `.env.local`：

| 变量 | 说明 | 默认 |
|------|------|------|
| `NEXT_PUBLIC_DATA_MODE` | `mock` / `live` / `auto` | `mock` |
| `NEXT_PUBLIC_STATUS_API_URL` | API 地址（Tailscale IP） | `http://100.67.173.13:3000/status` |
| `NEXT_PUBLIC_HOST_NAME` | 面板显示的主机名 | `homelab` |

### 数据模式

| 模式 | 行为 |
|------|------|
| `mock` | 本地假数据，不轮询，右上角徽章 `DEV` |
| `live` | 只拉真实 API，失败显示 `OFF` |
| `auto` | 先 fetch，失败回退 mock 并标记 `OFF` |

改 `.env.local` 后需重启 `pnpm dev`；`pnpm build` 前也需确认配置。

### 网络注意（WSL 开发）

| 环境 | API 地址 |
|------|----------|
| WSL 终端 `curl` | `http://localhost:3000/status` ✅ |
| Windows 浏览器 / WE | `http://<tailscale-ip>:3000/status` ✅ |
| Windows 浏览器 `localhost:3000` | ❌ 到不了 WSL 里的 API |

---

## API 数据契约

`GET /status` 返回：

```json
{
  "cpu": 12,
  "memory": 47,
  "disk": 63,
  "uptime": "15d",
  "updatedAt": "2026-06-15T15:09:44Z"
}
```

后端仓库路径（独立维护）：

```text
/Project/infra/server/node-for-wallpaper/server/
```

---

## 面板预览

```text
┌─ SERVER ─────────────── DEV ─┐
│  homelab                     │
│  CPU   ████░░░░░░░░    12%  │
│  RAM   ███████░░░░░    47%  │
│  DISK  █████████░░░    63%  │
│  ↑ 15d uptime          23:09 │
└──────────────────────────────┘
```

状态徽章：`SYNC`（加载中）/ `DEV`（mock）/ `LIVE`（在线）/ `OFF`（离线）

---

## 添加第二台服务器

在 `app/page.tsx` 注入多个配置即可：

```tsx
const homelab = getAppStatusConfig();
const vps = {
  ...homelab,
  hostName: "vps",
  apiUrl: "http://100.x.x.x:3000/status",
};

<HudColumn>
  <ServerStatusWidget config={homelab} />
  <ServerStatusWidget config={vps} />
</HudColumn>
```

每台机器一个 `ServerStatusWidget` 实例，独立 loader、独立轮询。

---

## 四象限布局（预留）

```text
┌─────────────────┬─────────────────┐
│  Daily Summary  │  Services       │  ← 阶段五 / 二
│                 │                 │
├─────────────────┼─────────────────┤
│  Today's Work   │  Server Status  │  ← 阶段三 / 一 ✅
└─────────────────┴─────────────────┘
```

---

## 技术栈

| 项 | 选型 |
|----|------|
| 框架 | Next.js 16 + React 19 |
| 样式 | Tailwind CSS 4 |
| 部署 | `output: "export"` 静态导出 |
| 包管理 | pnpm |
| 后端 | Node.js `http`（独立仓库） |
| 网络 | Tailscale |
| 存储 | JSON 文件 |

---

## 路线图

| 版本 | 目标 |
|------|------|
| **v0.1** | 单服务器 ASCII HUD + 可插拔数据层 + mock 开发 |
| v0.2 | live 联调稳定、WE 正式部署、背景图 |
| v0.3 | 服务列表面板（阶段二） |
| v0.4 | Git 活动面板（阶段三） |
| v1.0 | 日志 + AI 日报 + 长期统计 |

---

## License

Private — personal use only.
