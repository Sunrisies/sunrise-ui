---
title: "formatChineseDateTime"
description: "格式化中文日期时间"
module: "common/formatChineseDateTime"
pageClass: "api-page function-page"
---


# formatChineseDateTime

**模块**: `common/formatChineseDateTime`

<Badge type="tip" text="Function" color="purple" />

## 概述

formatChineseDateTime function

## 签名

```typescript
const formatChineseDateTime = (date: string | Date): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| date | `string | Date` | 可解析的时间值（Date 实例或 ISO 字符串） |

## 返回值

**Type**: `string`

> 格式化中文日期时间

## 案例1

```typescript
// 格式化当前时间
formatChineseDateTime(new Date());

@example
// 处理跨年日期
formatChineseDateTime('2024-01-01T00:00:00'); // "2024年01月01日 00:00:00"
```
