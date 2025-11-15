# react-ui

一个使用 Vite（rolldown-vite）与 React 19 开发的示例应用，演示如何在 Monorepo 中消费 `sunrise-ui-plus` 组件库与 `sunrise-utils` 工具库。

## 启动与构建

- 开发：`pnpm dev`
- 构建：`pnpm build`
- 预览：`pnpm preview`
- Lint：`pnpm lint`
- 清理：`pnpm clean`

建议在仓库根目录通过 `pnpm --filter react-ui <cmd>` 调用，例如：`pnpm --filter react-ui dev`。

## 依赖

- `react`、`react-dom`（19.x）
- `sunrise-ui-plus`（组件库，workspace 依赖）
- `sunrise-utils`（工具库，workspace 依赖）

## 使用示例

使用组件库中的 `Button` 与 `Input`：

```tsx
import { Button, Input } from "sunrise-ui-plus";

export default function App() {
  return (
    <div>
      <Button onClick={() => alert("clicked")}>点击我</Button>
      <Input placeholder="请输入" allowClear />
    </div>
  );
}
```

使用工具库中的常用方法（示例：相对时间与文件大小格式化）：

```ts
import { getRelativeTime } from "sunrise-utils";
import { formatBytes } from "sunrise-utils";

console.log(getRelativeTime(new Date(Date.now() - 60_000))); // "1分钟前"
console.log(formatBytes(1234)); // "1.21 KB"
```

## 环境与说明

- Node.js ≥ 18，推荐配合 `pnpm@10` 使用
- 使用 `rolldown-vite@7` 作为 Vite 适配版本（见 `package.json` overrides）
