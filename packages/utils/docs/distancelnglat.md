---
title: "distanceLngLat"
description: "计算经纬度距离"
module: "map/distance"
pageClass: "api-page function-page"
---


# distanceLngLat

**模块**: `map/distance`

<Badge type="tip" text="Function" color="purple" />

## 概述

distanceLngLat function

## 签名

```typescript
const distanceLngLat = (lat1: number, lon1: number, lat2: number, lon2: number): Point
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| lat1 | `number` | 第一个点的纬度（-90 到 90 之间） |
| lon1 | `number` | 第一个点的经度（-180 到 180 之间） |
| lat2 | `number` | 第二个点的纬度（-90 到 90 之间） |
| lon2 | `number` | 第二个点的经度（-180 到 180 之间） |

## 返回值

**Type**: `Point`

> 使用球面距离公式（Haversine公式）计算两点间距离，并计算中心点坐标

## 案例1

```typescript
// 计算北京到上海的距离和中心点
const result = distanceLngLat(39.9042, 116.4074, 31.2304, 121.4737);
console.log('中心点经度:', result.lon);  // 中心点经度
console.log('中心点纬度:', result.lat);  // 中心点纬度
console.log('距离:', result.distance + '米');  // 距离（米）

// 处理错误情况
try {
  distanceLngLat(91, 0, 0, 0);  // 纬度超出范围
} catch (error) {
  console.error(error.message);  // "纬度必须在 -90 到 90 之间"
}
```
