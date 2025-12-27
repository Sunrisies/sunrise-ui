---
title: "CoordinateTransform"
description: "坐标系转换"
module: "map/CoordinateTransform"
pageClass: "api-page class-page"
sidebar: "auto"
---


# CoordinateTransform

**模块**: `map/CoordinateTransform`

<Badge type="tip" text="Class" color="blue" />

## 概述

CoordinateTransform class

## Constructor

```typescript
new CoordinateTransform()
```

## 方法

### gcj02ToWgs84

- 将GCJ02火星坐标系转换为WGS84坐标系

```typescript
function gcj02ToWgs84(lng: number, lat: number): any
```

### wgs84ToGcj02

- 将WGS84坐标系转换为GCJ02火星坐标系

```typescript
function wgs84ToGcj02(lng: number, lat: number): any
```

## 案例1

```typescript
const [gcjLng, gcjLat] = wgs84ToGcj02(114.123, 22.456)
```

## 案例2

```typescript
const [wgsLng, wgsLat] = gcj02ToWgs84(114.123, 22.456)
```
