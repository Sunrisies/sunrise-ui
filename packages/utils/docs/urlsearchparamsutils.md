---
title: "URLSearchParamsUtils"
description: "将请求参数对象转换为 URL 查询字符串。"
module: "browser/URLSearchParamsUtils"
pageClass: "api-page function-page"
---


# URLSearchParamsUtils

**模块**: `browser/URLSearchParamsUtils`

<Badge type="tip" text="Function" color="purple" />

## 概述

URLSearchParamsUtils function

## 签名

```typescript
const URLSearchParamsUtils = (data: object): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| data | `object` | 包含查询参数的对象（支持 Record&lt;string, any&gt; 类型） |

## 返回值

**Type**: `string`

> module:browser/URLSearchParamsUtils

## 案例1

```typescript
// 处理嵌套对象（实际开发中应避免）
URLSearchParamsUtils({ filter: { type: 'video', resolution: '1080p' } });
// 返回 'filter=[object%20Object]'
```

## 案例2

```typescript
// 处理数字和布尔值
URLSearchParamsUtils({ active: true, count: 42 });
// 返回 'active=true&count=42'
```
