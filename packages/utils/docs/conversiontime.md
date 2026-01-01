---
title: "conversionTime"
description: "转换时间戳"
module: "common/conversionTime"
pageClass: "api-page function-page"
---


# conversionTime

**模块**: `common/conversionTime`

<Badge type="tip" text="Function" color="purple" />

## 概述

conversionTime function

## 签名

```typescript
const conversionTime = (time: number): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| time | `number` | 时间戳（单位：秒） |

## 返回值

**Type**: `string`

> 转换时间戳

## 案例1

```typescript
// 将时间戳 1633072800 转换为日期字符串
const dateString = conversionTime(1633072800);
console.log(dateString); // 输出 "2021年10月1日00时00分"
```
