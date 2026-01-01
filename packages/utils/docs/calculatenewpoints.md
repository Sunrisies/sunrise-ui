---
title: "calculateNewPoints"
description: "计算四向坐标点"
module: "map/calculatenewpoints"
pageClass: "api-page function-page"
---


# calculateNewPoints

**模块**: `map/calculatenewpoints`

<Badge type="tip" text="Function" color="purple" />

## 概述

calculateNewPoints function

## 签名

```typescript
const calculateNewPoints = (centerPoint: Point): any[]
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| centerPoint | `Point` | 包含中心点经纬度和距离的对象 |

## 返回值

**Type**: `any[]`

> 使用球面三角学计算以中心点为原点，在正东、正南、正西、正北四个方向上指定距离处的坐标点

## 案例1

```typescript
// 在中心点周围生成四个坐标点
const newPoints = calculateNewPoints({
  lon: 113.5930592,
  lat: 33.4148429,
  distance: 1000  // 1公里
});

// 输出示例
// [
//   [113.6030592, 33.4148429],  // 东
//   [113.5930592, 33.4048429],  // 南
//   [113.5830592, 33.4148429],  // 西
//   [113.5930592, 33.4248429]   // 北
// ]

// 处理错误情况
try {
  calculateNewPoints({ lat: 91, lon: 0, distance: 1000 });
} catch (error) {
  console.error(error.message); // "纬度必须在 -90 到 90 之间"
}
```
