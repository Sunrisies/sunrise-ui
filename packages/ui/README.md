# Sunrise UI

一个基于 React 19 的轻量级组件库，提供 `Button`、`Card`、`Input`（含 `TextArea`、`Search`、`Password`）等基础组件。组件内部使用 TailwindCSS 类名编写，开发体验友好；同时在打包阶段会生成 `dist/styles.css`，确保在未集成 Tailwind 的项目中也能正常显示。

## 安装

```bash
npm install sunrise/ui
# 或
pnpm add sunrise/ui
# 或
yarn add sunrise/ui
```

## 环境要求

- React/ReactDOM 19.x
- Node.js ≥ 18，建议配合 `pnpm@10`

## 开始使用

### 1. 引入样式

在应用入口文件中引入组件库样式：

```tsx
import 'sunrise/ui/styles.css'
```

### 2. 按需引入组件

```tsx
// 全量引入
import { Button, Card, Input } from 'sunrise/ui'

// 或按需引入（推荐）
import { Button } from 'sunrise/ui/Button'
import { Card } from 'sunrise/ui/Card'
import { Input, TextArea, Search, Password } from 'sunrise/ui/Input'
```

## 组件文档

### Button 按钮

按钮用于开始一个即时操作。

#### 按需引入

```tsx
import { Button } from 'sunrise/ui/Button'
```

#### 示例

```tsx
import { Button } from 'sunrise/ui/Button'

function Demo() {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Button variant="default">默认按钮</Button>
      <Button variant="destructive">危险按钮</Button>
      <Button variant="outline">轮廓按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="link">链接按钮</Button>
    </div>
  )
}
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| variant | 按钮类型 | `'default' \| 'destructive' \| 'outline-solid' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |
| size | 按钮尺寸 | `'sm' \| 'default' \| 'lg' \| 'icon'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| ... | 原生 button 属性 | `ButtonHTMLAttributes<HTMLButtonElement>` | - |

### Card 卡片

基础容器，用来展示内容。

#### 按需引入

```tsx
import { Card } from 'sunrise/ui/Card'
```

#### 示例

```tsx
import { Card } from 'sunrise/ui/Card'

function Demo() {
  return (
    <Card title="卡片标题" extra={<a>更多</a>}>
      <p>卡片内容</p>
    </Card>
  )
}
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 卡片标题 | `ReactNode` | - |
| extra | 卡片右上角操作区域 | `ReactNode` | - |
| className | 自定义类名 | `string` | - |
| children | 卡片内容 | `ReactNode` | - |
| ... | 原生 div 属性 | `HTMLAttributes<HTMLDivElement>` | - |

### Input 输入框

通过鼠标或键盘输入内容。

#### 按需引入

```tsx
import { Input, TextArea, Search, Password } from 'sunrise/ui/Input'
```

#### 示例

```tsx
import { Input, TextArea, Search, Password } from 'sunrise/ui/Input'

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Input placeholder="请输入内容" />
      <TextArea placeholder="请输入多行文本" rows={4} />
      <Search placeholder="搜索内容" onSearch={(value) => console.log(value)} />
      <Password placeholder="请输入密码" />
    </div>
  )
}
```

#### API

##### Input

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 输入框占位文本 | `string` | - |
| value | 输入框内容 | `string` | - |
| defaultValue | 输入框默认内容 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| onChange | 内容变化时的回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - |
| ... | 原生 input 属性 | `InputHTMLAttributes<HTMLInputElement>` | - |

##### TextArea

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| rows | 文本域高度 | `number` | 4 |
| ... | 继承 Input 的所有属性 | | |
| ... | 原生 textarea 属性 | `TextareaHTMLAttributes<HTMLTextAreaElement>` | - |

##### Search

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| onSearch | 点击搜索或按下回车时的回调 | `(value: string) => void` | - |
| ... | 继承 Input 的所有属性 | | |

##### Password

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| visibilityToggle | 是否显示切换按钮 | `boolean` | `true` |
| ... | 继承 Input 的所有属性 | | |

### Table 表格

使用文档与 API 已迁移至 `./docs/components/table.md`。

## 开发与构建

- 开发监听：`pnpm --filter sunrise/ui dev`
- 构建产物：`pnpm --filter sunrise/ui build`（输出到 `dist/`，包含 `index.mjs` 与 `styles.css`）
- 代码检查：`pnpm --filter sunrise/ui lint`
- 清理：`pnpm --filter sunrise/ui clean`

## 说明

- 打包使用 `tsup`，并通过 Tailwind CLI 生成仅包含库所用类的 `styles.css`
- 默认不注入 reset/base，仅生成 `utilities`，避免与宿主项目样式冲突
- 在未集成 Tailwind 的项目中，手动引入样式：`import 'sunrise/ui/styles.css'`
- 支持按需导入，减少最终打包体积

## 贡献

欢迎提交 issue 和 pull request 来帮助改进项目。

## 许可证

MIT