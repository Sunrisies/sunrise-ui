# Pagination 分页

采用分页形式分隔长列表，每次只加载一个页面。

## 按需引入

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  CustomPagination,
} from "sunrise-ui-plus/Pagination";
```

## 示例

### 基础用法

::: demo 使用 `CustomPagination` 组件快速创建一个完整的分页。

```tsx
import { CustomPagination } from "sunrise-ui-plus/Pagination";
import { useState } from "react";

function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <CustomPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
```

:::

### 自定义分页

::: demo 使用基础组件组合自定义分页。

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "sunrise-ui-plus/Pagination";
import { useState } from "react";

function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
```

:::

## API

### CustomPagination

| 属性         | 说明           | 类型                     | 默认值 |
| ------------ | -------------- | ------------------------ | ------ |
| currentPage  | 当前页数       | `number`                 | -      |
| totalPages   | 总页数         | `number`                 | -      |
| onPageChange | 页码改变的回调 | `(page: number) => void` | -      |
| className    | 自定义类名     | `string`                 | -      |

### Pagination

| 属性      | 说明          | 类型                          | 默认值 |
| --------- | ------------- | ----------------------------- | ------ |
| className | 自定义类名    | `string`                      | -      |
| ...       | 原生 nav 属性 | `React.ComponentProps<"nav">` | -      |

### PaginationContent

| 属性      | 说明         | 类型                         | 默认值 |
| --------- | ------------ | ---------------------------- | ------ |
| className | 自定义类名   | `string`                     | -      |
| ...       | 原生 ul 属性 | `React.ComponentProps<"ul">` | -      |

### PaginationItem

| 属性      | 说明         | 类型                         | 默认值 |
| --------- | ------------ | ---------------------------- | ------ |
| className | 自定义类名   | `string`                     | -      |
| ...       | 原生 li 属性 | `React.ComponentProps<"li">` | -      |

### PaginationLink

| 属性      | 说明             | 类型                                  | 默认值 |
| --------- | ---------------- | ------------------------------------- | ------ |
| isActive  | 是否为当前页     | `boolean`                             | false  |
| size      | 按钮尺寸         | `'default' \| 'sm' \| 'lg' \| 'icon'` | 'icon' |
| className | 自定义类名       | `string`                              | -      |
| ...       | 原生 button 属性 | `React.ComponentProps<"button">`      | -      |

### PaginationPrevious/PaginationNext

| 属性      | 说明                | 类型                  | 默认值 |
| --------- | ------------------- | --------------------- | ------ |
| className | 自定义类名          | `string`              | -      |
| ...       | PaginationLink 属性 | `PaginationLinkProps` | -      |

### PaginationEllipsis

| 属性      | 说明           | 类型                           | 默认值 |
| --------- | -------------- | ------------------------------ | ------ |
| className | 自定义类名     | `string`                       | -      |
| ...       | 原生 span 属性 | `React.ComponentProps<"span">` | -      |
