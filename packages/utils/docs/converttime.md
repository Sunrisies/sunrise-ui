---
title: "convertTime"
description: "转换时长"
module: "common/convertTime"
pageClass: "api-page function-page"
---


# convertTime

**模块**: `common/convertTime`

<Badge type="tip" text="Function" color="purple" />

## 概述

convertTime function

## 签名

```typescript
const convertTime = (duration: number, type?: "en" | "zh"): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| duration | `number` | 以秒为单位的时长（必须为数字类型） |
| type | `"en" | "zh"` | 输出语言类型，支持中文（zh）和英文（en） |

## 返回值

**Type**: `string`

> 转换时长

## 案例1

```typescript
// 基本用法
convertTime(3661); // "1小时1分1秒"
```

## 案例2

```typescript
// 小数处理
convertTime(45.5); // "45.50秒"
```

## 案例3

```typescript
// 英文显示
convertTime(100000, 'en'); // "11d 4h 20m"
```
