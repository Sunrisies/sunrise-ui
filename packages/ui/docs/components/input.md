
# Input 输入框

通过鼠标或键盘输入内容。

## 按需引入

```tsx
import { Input, TextArea, Search, Password } from 'sunrise/ui/Input'
```

## 示例

### 基本用法

::: demo 基本的输入框用法。

```tsx
import { Input } from 'sunrise/ui/Input'

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Input placeholder="请输入内容" />
      <Input placeholder="禁用的输入框" disabled />
      <Input placeholder="只读的输入框" readOnly defaultValue="只读内容" />
    </div>
  )
}
```

:::

### 多行文本输入

::: demo 使用 `TextArea` 组件进行多行文本输入。

```tsx
import { TextArea } from 'sunrise/ui/Input'

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TextArea placeholder="请输入多行文本" rows={4} />
      <TextArea placeholder="禁用的多行文本" rows={4} disabled />
    </div>
  )
}
```

:::

### 搜索框

::: demo 使用 `Search` 组件创建搜索框。

```tsx
import { Search } from 'sunrise/ui/Input'

function Demo() {
  const handleSearch = (value: string) => {
    console.log('搜索内容:', value)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Search placeholder="搜索内容" onSearch={handleSearch} />
      <Search placeholder="禁用的搜索框" onSearch={handleSearch} disabled />
    </div>
  )
}
```

:::

### 密码框

::: demo 使用 `Password` 组件创建密码输入框。

```tsx
import { Password } from 'sunrise/ui/Input'

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Password placeholder="请输入密码" />
      <Password placeholder="禁用的密码框" disabled />
      <Password placeholder="不显示切换按钮的密码框" visibilityToggle={false} />
    </div>
  )
}
```

:::

## API

### Input

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 输入框占位文本 | `string` | - |
| value | 输入框内容 | `string` | - |
| defaultValue | 输入框默认内容 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| readOnly | 是否只读 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| onChange | 内容变化时的回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - |
| ... | 原生 input 属性 | `InputHTMLAttributes<HTMLInputElement>` | - |

### TextArea

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| rows | 文本域高度 | `number` | 4 |
| ... | 继承 Input 的所有属性 | | |
| ... | 原生 textarea 属性 | `TextareaHTMLAttributes<HTMLTextAreaElement>` | - |

### Search

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| onSearch | 点击搜索或按下回车时的回调 | `(value: string) => void` | - |
| ... | 继承 Input 的所有属性 | | |

### Password

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| visibilityToggle | 是否显示切换按钮 | `boolean` | `true` |
| ... | 继承 Input 的所有属性 | | |
