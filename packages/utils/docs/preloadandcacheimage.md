---
title: "preloadAndCacheImage"
description: "预加载并缓存图片资源"
module: "browser/preloadAndCacheImage"
pageClass: "api-page function-page"
---


# preloadAndCacheImage

**模块**: `browser/preloadAndCacheImage`

<Badge type="tip" text="Function" color="purple" />

## 概述

preloadAndCacheImage function

## 签名

```typescript
const preloadAndCacheImage = (imageUrl: string): Promise<HTMLImageElement<>>
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| imageUrl | `string` | 图片资源的URL |

## 返回值

**Type**: `Promise<HTMLImageElement<>>`

> module:browser/preloadAndCacheImage

## 案例1

```typescript
// 示例：预加载并缓存图片
preloadAndCacheImage('https://example.com/image.jpg')
  .then((image) => {
    console.log('图片加载成功', image);
  })
  .catch((error) => {
    console.error('图片加载失败', error);
  });
```
