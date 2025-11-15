# Table 表格

用于展示结构化数据，提供分区与单元格组件组合使用。

## 按需引入

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption } from 'sunrise/ui/Table'
```

## 示例

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption } from 'sunrise/ui/Table'

function Demo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>姓名</TableHead>
          <TableHead>年龄</TableHead>
          <TableHead>城市</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>张三</TableCell>
          <TableCell>24</TableCell>
          <TableCell>上海</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>李四</TableCell>
          <TableCell>28</TableCell>
          <TableCell>北京</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>合计 2 项</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption>示例数据</TableCaption>
    </Table>
  )
}
```

## 组成与 API

- `Table`：外层容器，支持原生 `table` 属性与 `className`
- `TableHeader`：表头分区（`thead`），支持原生属性与 `className`
- `TableBody`：主体分区（`tbody`），支持原生属性与 `className`
- `TableFooter`：尾部分区（`tfoot`），支持原生属性与 `className`
- `TableRow`：行（`tr`），支持原生属性与 `className`
- `TableHead`：头部单元格（`th`），支持原生属性与 `className`
- `TableCell`：数据单元格（`td`），支持原生属性与 `className`
- `TableCaption`：表格说明（`caption`），支持原生属性与 `className`