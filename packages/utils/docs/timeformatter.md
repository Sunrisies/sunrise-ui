---
title: "TimeFormatter"
description: "日期时间格式化"
module: "common/TimeFormatter"
pageClass: "api-page class-page"
sidebar: "auto"
---


# TimeFormatter

**模块**: `common/TimeFormatter`

<Badge type="tip" text="Class" color="blue" />

## 概述

TimeFormatter class

## Constructor

```typescript
new TimeFormatter()
```

## 方法

### formatDate

- 生成符合 ISO 8601 的短日期格式字符串

```typescript
function formatDate(date: Date): string
```

### formatTime

- 生成标准化时间字符串

```typescript
function formatTime(date: Date): string
```

### getWeekday

- 获取中文星期名称

```typescript
function getWeekday(date: Date): string
```

## 案例1

```typescript
const formatter = new TimeFormatter();
// 格式化当前日期
formatter.formatDate(new Date()); // "2023-10-01"

// 获取中文星期
formatter.getWeekday(new Date()); // "星期一"
```
