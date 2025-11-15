# Sunrise UI

一个基于 React 19 的轻量级组件库，提供 `Button`、`Card`、`Input`（含 `TextArea`、`Search`、`Password`）等基础组件。

## 特性

- 🚀 **轻量级** - 基于现代构建工具，支持按需加载
- 🎨 **美观** - 使用 Tailwind CSS 构建，提供一致的设计语言
- 📦 **按需引入** - 支持按需引入组件，减少打包体积
- 🔧 **TypeScript** - 完全使用 TypeScript 编写，提供完整的类型支持
- 🌈 **灵活** - 支持自定义主题和样式

## 安装

````bash
npm install sunrise-ui-plus
# 或
pnpm add sunrise-ui-plus
# 或sunrise-ui-plus
yarn add sunrise-ui-plus
```sunrise-ui-plus

## 快速开始

### 1. 引入样式

在应用入口文件中引入组件库样式：

```tsx
import "sunrise-ui-plus/styles.css";
````

### 2. 使用组件

```tsx
import { Button } from "sunrise-ui-plus/Button";

function App() {
  return <Button variant="primary">点击我</Button>;
}
```

## 环境要求

- React/ReactDOM 19.x
- Node.js ≥ 18，建议配合 `pnpm@10`

## 开发与构建

- 开发监听：`pnpm --filter sunrise-ui-plus dev`
- 构建产物：`pnpm --filter sunrise-ui-plus build`（输出到 `dist/`，包含 `index.mjs` 与 `styles.css`）
- 代码检查：`pnpm --filter sunrise-ui-plus lint`
- 清理：`pnpm --filter sunrise-ui-plus clean`

## 组件列表

- [Button 按钮](./components/button.md)
- [Card 卡片](./components/card.md)
- [Input 输入框](./components/input.md)
- [Table 表格](./components/table.md)
