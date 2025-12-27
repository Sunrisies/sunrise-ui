---
title: "getCenterLonLat"
description: "计算两个经纬度之间的中心经纬度。"
module: "map/getCenterLonLat"
pageClass: "api-page function-page"
---


# getCenterLonLat

**模块**: `map/getCenterLonLat`

<Badge type="tip" text="Function" color="purple" />

## 概述

getCenterLonLat function

## 签名

```typescript
const getCenterLonLat = (oneLon: number, oneLat: number, twoLon: number, twoLat: number): any
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| oneLon | `number` | 第一个点的经度（-180 到 180 之间） |
| oneLat | `number` | 第一个点的纬度（-90 到 90 之间） |
| twoLon | `number` | 第二个点的经度（-180 到 180 之间） |
| twoLat | `number` | 第二个点的纬度（-90 到 90 之间） |

## 返回值

**Type**: `any`

> module:map/getCenterLonLat

## 案例1

```typescript
// 计算北京和上海之间的中心点
const center = getCenterLonLat(116.4074, 39.9042, 121.4737, 31.2304);
console.log('中心点经纬度:', center); // 输出 [118.94055, 35.5673]
```
