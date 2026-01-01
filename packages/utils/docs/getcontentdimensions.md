---
title: "getContentDimensions"
description: "获取指定元素ID的内容区域"
module: "browser/dom"
pageClass: "api-page function-page"
---


# getContentDimensions

**模块**: `browser/dom`

<Badge type="tip" text="Function" color="purple" />

## 概述

getContentDimensions function

## 签名

```typescript
const getContentDimensions = (elementId: string): Error | { height: number; width: number }
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| elementId | `string` | 要获取尺寸的元素的ID |

## 返回值

**Type**: `Error | { height: number; width: number }`

> 返回一个包含width和height的对象，如果找不到元素或无法获取计算样式则返回错误对象

## 案例1

```typescript
// 获取ID为 'myElement' 的元素的内容区域尺寸
const dimensions = getContentDimensions('myElement')
if (dimensions instanceof Error) {
  console.error('无法获取元素的尺寸')
} else {
  console.log('内容区域宽度:', dimensions.width)
  console.log('内容区域高度:', dimensions.height)
}
```
