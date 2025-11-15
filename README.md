# Sunrise UI Monorepo

本仓库是一个使用 pnpm Workspaces 与 Turborepo 管理的多包前端工程，包含 React 应用示例、通用组件库、工具函数库、Typedoc→VitePress 文档插件以及一个 CLI 工具。

## 技术栈

- pnpm Workspaces（`pnpm@10`）与 Turborepo 任务编排
- TypeScript 全面支持
- Vite（`rolldown-vite`）用于应用开发与构建
- tsup 用于库的打包
- Vitest/coverage、Jest 用于工具库测试与覆盖率
- Typedoc + VitePress 用于文档生成与站点

## 仓库结构

- `apps/react-ui`：React 示例应用，依赖 `sunrise-ui-plus` 与 `sunrise-utils`
- `packages/ui`：React 组件库（Button、Card、Input 等）
- `packages/utils`：工具函数库（浏览器/通用模块、测试、文档与覆盖率报告）
- `packages/typedoc-vitepress-plugin`：将 Typedoc 输出渲染为 VitePress 的插件
- `packages/git-time-machine`：修改 Git 提交时间的命令行工具（带 UI 输出）

## 环境要求

- Node.js ≥ 18（推荐 18/20/22 LTS）
- pnpm ≥ 10（根目录 `package.json` 指定 `packageManager: pnpm@10.0.0`）

## 安装依赖

- 在仓库根目录执行：`pnpm install`

## 开发模式

- 全仓库开发（由 Turborepo 并行编排）：`pnpm dev`
- 仅启动 React 应用：`pnpm --filter react-ui dev`
- 仅库开发（监听构建）：
  - 组件库：`pnpm --filter sunrise-ui-plus dev`
  - 工具库：`pnpm --filter sunrise-utils dev`
  - 文档插件：`pnpm --filter typedoc-vitepress-plugin dev`
  - CLI 工具：`pnpm --filter git-time-machine dev`

React 应用默认由 Vite 启动本地开发服务器，访问地址通常为 `http://localhost:5173/`（端口可能因本地占用而变化）。

## 构建与清理

- 使用 Turborepo 统一构建：`pnpm exec turbo run build`
  - 会按照依赖顺序构建，产物写入各包的 `dist/` 目录（见 `turbo.json`）
- 统一清理：`pnpm clean`
- 单包构建示例：
  - React 应用：`pnpm --filter react-ui build`
  - 组件库：`pnpm --filter sunrise-ui-plus build`
  - 工具库（生产构建）：`pnpm --filter sunrise-utils build:prod`

## 质量与测试

- 统一代码检查：`pnpm lint`
- 统一测试入口：`pnpm test`（按包内定义执行）
- 工具库测试与覆盖率：
  - 运行覆盖率：`pnpm --filter sunrise-utils coverage`
  - 交互式 UI：`pnpm --filter sunrise-utils ui`
  - 覆盖率报告位置：`packages/utils/coverage/`

## 文档相关

- 工具库文档站点（VitePress）：
  - 开发：`pnpm --filter sunrise-utils docs:dev`
  - 构建：`pnpm --filter sunrise-utils docs:build`
  - 预览：`pnpm --filter sunrise-utils docs:preview`
- Typedoc 生成（工具库）：`pnpm --filter sunrise-utils typedoc`
- `packages/typedoc-vitepress-plugin` 提供将 Typedoc 结果渲染为 VitePress 页面所需的渲染器与前置数据生成能力。

## 使用示例

- 在 React 应用中使用组件库（`sunrise-ui-plus`）：

```tsx
import { Button } from "sunrise-ui-plus";

export default function Demo() {
  return <Button>点击我</Button>;
}
```

- 在 React 应用或库中使用工具函数库（`sunrise-utils`）：

```ts
import { formatDate } from "sunrise-utils";

const s = formatDate(new Date());
console.log(s);
```

## CLI：git-time-machine

- 开发构建（监听）：`pnpm --filter git-time-machine dev`
- 生产构建：`pnpm --filter git-time-machine build`
- 运行（本地构建后）：`node packages/git-time-machine/dist/index.js`

## Turborepo 任务说明（见 `turbo.json`）

- `build`：按依赖拓扑执行，缓存产物到各包 `dist/**`
- `dev`：持久化开发任务（不缓存）
- `lint`：不产生构建输出（仅校验）
- `clean`：禁用缓存，用于清理

## 常见问题

- 若 `pnpm dev` 未能启动应用，请直接进入 `apps/react-ui` 运行：`pnpm dev`
- 若文档相关命令缺少对应包，请使用工具库的文档命令（`sunrise-utils`）。

---

以上命令需在仓库根目录执行，建议配合 `--filter <包名>` 精准运行目标包任务。
