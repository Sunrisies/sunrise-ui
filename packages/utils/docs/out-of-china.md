---
title: "out_of_china"
description: "判断坐标是否在中国境外"
module: "map/out_of_china"
pageClass: "api-page function-page"
---


# out_of_china

**模块**: `map/out_of_china`

<Badge type="tip" text="Function" color="purple" />

## 概述

out_of_china function

## 签名

```typescript
const out_of_china = (lng: number, lat: number): boolean
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| lng | `number` | 经度（WGS84坐标系） |
| lat | `number` | 纬度（WGS84坐标系） |

## 返回值

**Type**: `boolean`

> 根据中国边界范围判断坐标是否在境外

## 案例1

```typescript
// 境外坐标示例
out_of_china(135.0, 35.0) // true
// 境内坐标示例
out_of_china(116.4074, 39.9042) // false
```
