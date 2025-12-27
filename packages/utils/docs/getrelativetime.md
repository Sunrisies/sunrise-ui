---
title: "getRelativeTime"
description: "相对时间描述工具"
module: "common/date"
pageClass: "api-page function-page"
---


# getRelativeTime

**模块**: `common/date`

<Badge type="tip" text="Function" color="purple" />

## 概述

getRelativeTime function

## 签名

```typescript
const getRelativeTime = (date: string | number | Date, options?: RelativeTimeOptions): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| date | `string | number | Date` | 目标日期或时间戳 |
| options | `RelativeTimeOptions` | 格式化配置选项对象 |

## 返回值

**Type**: `string`

> module:common/date

## 案例1

```typescript
// 基本用法（中文）
getRelativeTime(new Date("2024-01-01")); // "x天前"

// 英文显示
getRelativeTime(date, { locale: "en-US" }); // "x days ago"

// 自定义文案（会覆盖默认语言设置）
getRelativeTime(date, {
  messages: {
    minutes: "{count} mins",
    past: "{time} before"
  }
});
```

## RelativeTimeOptions 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| locale | `"zh-CN" | "en-US"` | 设置显示语言 |
| messages | `{ days?: string; future?: string; hours?: string; justNow?: string; minutes?: string; months?: string; past?: string; seconds?: string; weeks?: string; years?: string }` | 自定义文案配置 |
| now | `string | number | Date` | 设置当前时间的参考点 |
