
# Button 按钮

按钮用于开始一个即时操作。

## 按需引入

```tsx
import { Button } from 'sunrise/ui/Button'
```

## 示例

### 基本用法

::: demo 使用 `variant` 属性来设置按钮类型。

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

:::

### 不同尺寸

::: demo 使用 `size` 属性来设置按钮尺寸。

```tsx
import { Button } from 'sunrise/ui/Button'

function Demo() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Button size="sm">小按钮</Button>
      <Button size="default">默认按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="icon">🔍</Button>
    </div>
  )
}
```

:::

### 禁用状态

::: demo 使用 `disabled` 属性来禁用按钮。

```tsx
import { Button } from 'sunrise/ui/Button'

function Demo() {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Button disabled variant="default">禁用的默认按钮</Button>
      <Button disabled variant="destructive">禁用的危险按钮</Button>
      <Button disabled variant="outline">禁用的轮廓按钮</Button>
      <Button disabled variant="secondary">禁用的次要按钮</Button>
      <Button disabled variant="ghost">禁用的幽灵按钮</Button>
      <Button disabled variant="link">禁用的链接按钮</Button>
    </div>
  )
}
```

:::

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| variant | 按钮类型 | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |
| size | 按钮尺寸 | `'sm' \| 'default' \| 'lg' \| 'icon'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| ... | 原生 button 属性 | `ButtonHTMLAttributes<HTMLButtonElement>` | - |
