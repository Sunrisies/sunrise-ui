# DataTable 数据表格

集成了表格和分页功能的高级数据展示组件，支持列配置、数据分页、自定义渲染等功能。

## 按需引入

```tsx
import { DataTable } from "sunrise-ui-plus/DataTable";
```

## 示例

### 基础用法

::: demo 基础的数据表格使用示例。

```tsx
import { DataTable, type Column } from "sunrise-ui-plus/DataTable";
import { useState } from "react";

interface DataType {
  id: number;
  name: string;
  age: number;
  address: string;
}

function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 模拟数据
  const data: DataType[] = Array.from({ length: 23 }).map((_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: Math.floor(Math.random() * 40) + 18,
    address: `地址 ${i + 1}`,
  }));

  // 列定义
  const columns: Column<DataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 100,
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <DataTable
      dataSource={data}
      columns={columns}
      pagination={{
        current: currentPage,
        pageSize,
        total: data.length,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  );
}
```

:::

### 自定义渲染

::: demo 使用 render 函数自定义单元格内容。

```tsx
import { DataTable, type Column } from "sunrise-ui-plus/DataTable";
import { useState } from "react";

interface ProductType {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: "inStock" | "outOfStock" | "limited";
}

function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 模拟数据
  const data: ProductType[] = Array.from({ length: 23 }).map((_, i) => {
    const statusOptions: ProductType["status"][] = [
      "inStock",
      "outOfStock",
      "limited",
    ];
    return {
      id: i + 1,
      name: `产品 ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 100),
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    };
  });

  // 列定义
  const columns: Column<ProductType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "产品名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => `¥${price.toFixed(2)}`,
      align: "right",
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        const statusMap = {
          inStock: { text: "有库存", color: "text-green-600" },
          outOfStock: { text: "缺货", color: "text-red-600" },
          limited: { text: "库存有限", color: "text-yellow-600" },
        };
        const { text, color } = statusMap[status];
        return <span className={color}>{text}</span>;
      },
    },
  ];

  return (
    <DataTable
      dataSource={data}
      columns={columns}
      pagination={{
        current: currentPage,
        pageSize,
        total: data.length,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  );
}
```

:::

### 自定义行样式

::: demo 使用 onRow 属性自定义行样式和事件。

```tsx
import { DataTable, type Column } from "sunrise-ui-plus/DataTable";
import { useState } from "react";

interface DataType {
  id: number;
  name: string;
  score: number;
}

function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const pageSize = 5;

  // 模拟数据
  const data: DataType[] = Array.from({ length: 23 }).map((_, i) => ({
    id: i + 1,
    name: `学生 ${i + 1}`,
    score: Math.floor(Math.random() * 100),
  }));

  // 列定义
  const columns: Column<DataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "分数",
      dataIndex: "score",
      key: "score",
      width: 120,
      align: "center",
      render: (score) => {
        if (score >= 90)
          return <span className="text-green-600 font-medium">{score}</span>;
        if (score >= 60) return <span className="text-blue-600">{score}</span>;
        return <span className="text-red-600">{score}</span>;
      },
    },
  ];

  return (
    <DataTable
      dataSource={data}
      columns={columns}
      rowKey="id"
      onRow={(record) => ({
        className: selectedRowId === record.id ? "bg-blue-50" : "",
        onClick: () => setSelectedRowId(record.id),
        style: { cursor: "pointer" },
      })}
      pagination={{
        current: currentPage,
        pageSize,
        total: data.length,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  );
}
```

:::

## API

### DataTable Props

| 属性                | 说明               | 类型                                                                      | 默认值       |
| ------------------- | ------------------ | ------------------------------------------------------------------------- | ------------ |
| dataSource          | 数据数组           | `T[]`                                                                     | -            |
| columns             | 表格列配置         | `Column<T>[]`                                                             | -            |
| pagination          | 分页配置对象       | `PaginationConfig`                                                        | -            |
| className           | 容器自定义类名     | `string`                                                                  | -            |
| tableClassName      | 表格自定义类名     | `string`                                                                  | -            |
| paginationClassName | 分页自定义类名     | `string`                                                                  | -            |
| loading             | 是否显示加载中状态 | `boolean`                                                                 | `false`      |
| emptyText           | 空数据时显示的文本 | `React.ReactNode`                                                         | `"暂无数据"` |
| rowKey              | 行数据的唯一标识   | `string \| ((record: T) => string)`                                       | -            |
| onRow               | 设置行属性         | `(record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>` | -            |
| scroll              | 设置横向或纵向滚动 | `{ x?: number \| string; y?: number \| string }`                          | -            |

### Column

| 属性      | 说明                       | 类型                                                        | 默认值   |
| --------- | -------------------------- | ----------------------------------------------------------- | -------- |
| key       | 列的唯一标识               | `string`                                                    | -        |
| title     | 列标题                     | `string`                                                    | -        |
| dataIndex | 列数据在数据项中对应的路径 | `string`                                                    | -        |
| render    | 自定义列渲染函数           | `(value: any, record: T, index: number) => React.ReactNode` | -        |
| width     | 列宽度                     | `string \| number`                                          | -        |
| align     | 列对齐方式                 | `"left" \| "center" \| "right"`                             | `"left"` |
| className | 列单元格自定义类名         | `string`                                                    | -        |

### PaginationConfig

| 属性            | 说明                     | 类型                                       | 默认值  |
| --------------- | ------------------------ | ------------------------------------------ | ------- |
| current         | 当前页数                 | `number`                                   | -       |
| pageSize        | 每页条数                 | `number`                                   | -       |
| total           | 数据总数                 | `number`                                   | -       |
| onChange        | 页码变化的回调           | `(page: number, pageSize: number) => void` | -       |
| showSizeChanger | 是否显示 pageSize 切换器 | `boolean`                                  | `false` |
| pageSizeOptions | 指定每页可以显示多少条   | `number[]`                                 | -       |
| showTotal       | 是否显示数据总数         | `boolean`                                  | `false` |
| simple          | 是否使用简单分页         | `boolean`                                  | `false` |
