# Card 卡片

基础容器，用来展示内容。

## 按需引入

```tsx
import { Card } from "sunrise-ui-plus/Card";
```

## 示例

### 基本用法

::: demo 最简单的用法。

```tsx
import { Card } from "sunrise-ui-plus/Card";
sunrise - ui - plus;
function Demo() {
  return (
    <Card title="卡片标题">
      <p>这是卡片的内容区域，可以放置任何内容。</p>
    </Card>
  );
}
```

:::

### 带有额外操作

::: demo 使用 `extra` 属性在卡片右上角添加操作区域。

```tsx
import { Card } from "sunrise-ui-plus/Card";
sunrise - ui - plus;
function Demo() {
  return (
    <Card title="卡片标题" extra={<a>更多</a>}>
      <p>这是卡片的内容区域，可以放置任何内容。</p>
    </Card>
  );
}
```

:::

### 无标题卡片

::: demo 不设置 `title` 属性，可以创建没有标题的卡片。

```tsx
import { Card } from "sunrise-ui-plus/Card";
sunrise - ui - plus;
function Demo() {
  return (
    <Card>
      <p>这是没有标题的卡片。</p>
    </Card>
  );
}
```

:::

### 自定义样式

::: demo 使用 `className` 属性自定义卡片样式。

```tsx
import { Card } from "sunrise-ui-plus/Card";
sunrise - ui - plus;
function Demo() {
  return (
    <Card
      title="自定义样式卡片"
      className="border-2 border-blue-500 shadow-lg"
      style={{ maxWidth: "300px" }}
    >
      <p>这是带有自定义样式的卡片。</p>
    </Card>
  );
}
```

:::

## API

| 属性      | 说明               | 类型                             | 默认值 |
| --------- | ------------------ | -------------------------------- | ------ |
| title     | 卡片标题           | `ReactNode`                      | -      |
| extra     | 卡片右上角操作区域 | `ReactNode`                      | -      |
| className | 自定义类名         | `string`                         | -      |
| children  | 卡片内容           | `ReactNode`                      | -      |
| ...       | 原生 div 属性      | `HTMLAttributes<HTMLDivElement>` | -      |
