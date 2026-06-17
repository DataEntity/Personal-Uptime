# Personal Uptime · v0.1.1

基于 Wallpaper Engine 的个人运维 HUD 壁纸。在桌面以 **ASCII 终端风格** 展示服务器状态与 Git 提交记录。

> 不是传统监控后台，而是面向个人开发者的桌面状态面板（Narrative Dashboard）。

---

## 当前进度

开发节奏不按固定阶段推进，以下为截至目前的实际状态。

### 已有

- ASCII 终端 HUD（`█░` 进度条、`┌─┐` 边框）
- 四象限画布 + 暗色径向渐变背景（占位）
- 右下 **Server Status**：CPU / 内存 / 磁盘 / 运行时间（`GET /status`）
- 左下 **Git Log**：最近 commit 列表（`GET /commits/log`）
- 数据层与 UI 解耦（`StatusLoader` / `CommitsLogLoader` 可插拔）
- `mock` / `live` / `auto` 三种数据模式
- 静态导出（`out/`），可导入 Wallpaper Engine

### 规划（粗略，顺序不定）

- live 联调稳定、Wallpaper Engine 正式部署
- 服务列表（Docker / Node 等）
- Daily Summary、Today's Work 等叙事面板
- 日志聚合、AI 日报
- 壁纸背景图与动效
- systemd 常驻、多机配置化

---

## 系统架构

本项目是 **展示端**（客户端）。数据采集与 API 在独立仓库运行：

```text
服务器（Linux + Tailscale）
├─ collect-status.sh     采集 /proc、df 等
├─ data/status.json      JSON 数据文件
└─ Node API :3000        GET /status、/commits/log、/health
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
  Git 仓库  → commits/log → HTTP API → fetch → Git Log 终端
```

---

## 项目结构

```text
app/
├── page.tsx                              # Composition Root（注入配置）
├── data/
│   ├── types.ts                          # ServerStatus 数据契约、StatusBadge
│   ├── ports.ts                          # StatusLoader 接口
│   ├── app-config.ts                     # env → AppStatusConfig / AppCommitsLogConfig
│   ├── loaders/                          # status: mock / live / auto
│   ├── hooks/use-status-loader.ts        # 服务器状态轮询 hook（60s）
│   └── commits/
│       ├── types.ts                      # CommitsLog 数据契约
│       ├── ports.ts                      # CommitsLogLoader 接口
│       ├── loaders/                      # commits: mock / live / auto
│       └── hooks/use-commits-log-loader.ts  # commits 轮询 hook（15min）
├── components/
│   ├── ServerStatus/
│   │   ├── ServerStatusWidget.tsx        # 容器：loader + hook
│   │   └── StatusPanel.tsx               # 纯展示
│   ├── Commits/
│   │   ├── CommitsLogWidget.tsx          # 容器：loader + hook
│   │   └── CommitsLogPanel.tsx           # 纯展示
│   ├── hud/AsciiHud.tsx                  # AsciiBlock / AsciiTerminal / HudQuadrant
│   └── layout/WallpaperCanvas.tsx        # 四象限画布
└── lib/ascii/
    ├── render-server-status.ts           # 右下服务器面板
    ├── render-commits-log.ts             # 左下 Git Log 终端
    └── box.ts                            # 边框与进度条工具
```

### 依赖方向

```text
page.tsx
  → app-config
  → CommitsLogWidget / ServerStatusWidget（注入 config）
      → createCommitsLogLoader / createStatusLoader（可插拔）
      → useCommitsLogLoader / useStatusLoader
      → CommitsLogPanel / StatusPanel（纯 props）
          → renderCommitsLogPanel / renderServerStatusPanel
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

将 `out/` 目录拷到 Windows，用本地 HTTP 服务打开：

```cmd
cd out
npx serve .
```

或在 Wallpaper Engine 中创建网页壁纸，入口指向 `index.html`。

---

## 环境变量

复制 `.env.local.example` 为 `.env.local`：

| 变量                          | 说明                     | 默认      |
| ----------------------------- | ------------------------ | --------- |
| `NEXT_PUBLIC_DATA_MODE`       | `mock` / `live` / `auto` | `mock`    |
| `NEXT_PUBLIC_HOST_NAME`       | 服务器面板显示名         | `homelab` |
| `NEXT_PUBLIC_STATUS_API_URL`  | `GET /status` 地址       | —         |
| `NEXT_PUBLIC_COMMITS_API_URL` | `GET /commits/log` 地址  | —         |

改 `.env.local` 后需重启 `pnpm dev`；`pnpm build` 前也需确认配置。

### 数据模式

| 模式   | 行为                                 |
| ------ | ------------------------------------ |
| `mock` | 本地假数据，不轮询，右上角徽章 `DEV` |
| `live` | 只拉真实 API，失败显示 `OFF`         |
| `auto` | 先 fetch，失败回退 mock 并标记 `OFF` |

---

## API 数据契约

### `GET /status`

```json
{
  "cpu": 12,
  "memory": 47,
  "disk": 63,
  "uptime": "15d",
  "updatedAt": "2026-06-15T15:09:44Z"
}
```

### `GET /commits/log`

```json
{
  "updatedAt": "2026-06-18T10:00:00Z",
  "lines": [
    {
      "repo": "personal-uptime-server",
      "short": "a1b2c3d",
      "subject": "feat: add /commits/log proxy",
      "time": "2h"
    }
  ]
}
```

后端仓库（独立维护）：[personal-uptime-server](https://github.com/DataEntity/personal-uptime-server)

---

## 面板预览

**左下 — Git Log**

```text
┌─ GIT LOG ──────────────── DEV ─┐
│  ~/github                      │
│                                │
│> a1b2c3d  feat: add /commits…  2h│
│> b2c3d4e  docs: deployment …  1d│
│> f4e5d6a  fix(search): rebu…  3d│
│                                │
│  _                             │
└────────────────────────────────┘
```

**右下 — Server Status**

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
  apiUrl: "http://<tailscale-ip>:<port>/status",
};

<HudColumn>
  <ServerStatusWidget config={homelab} />
  <ServerStatusWidget config={vps} />
</HudColumn>;
```

每台机器一个 `ServerStatusWidget` 实例，独立 loader、独立轮询。

---

## 四象限布局

```text
┌─────────────────┬─────────────────┐
│  Daily Summary  │  Services       │  规划中
│                 │                 │
├─────────────────┼─────────────────┤
│  Git Log        │  Server Status  │  已有
└─────────────────┴─────────────────┘
```

---

## 技术栈

| 项     | 选型                        |
| ------ | --------------------------- |
| 框架   | Next.js 16 + React 19       |
| 样式   | Tailwind CSS 4              |
| 部署   | `output: "export"` 静态导出 |
| 包管理 | pnpm                        |
| 后端   | Node.js `http`（独立仓库）  |
| 网络   | Tailscale                   |
| 存储   | JSON 文件                   |
