---
title: "preloadAndCacheImages"
description: "预加载并缓存一组图片资源。"
module: "browser/preloadAndCacheImages"
pageClass: "api-page function-page"
---


# preloadAndCacheImages

**模块**: `browser/preloadAndCacheImages`

<Badge type="tip" text="Function" color="purple" />

## 概述

preloadAndCacheImages function

## 签名

```typescript
const preloadAndCacheImages = (imageUrls: string[]): Promise<HTMLImageElement<>[]>
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| imageUrls | `string[]` | 图片资源的URL数组 |

## 返回值

**Type**: `Promise<HTMLImageElement<>[]>`

> 返回一个Promise，该Promise在所有图片加载完成后解析为一个包含HTMLImageElement对象的数组

## 案例1

```typescript
// 示例：预加载并缓存一组图片
preloadAndCacheImages(['https://example.com/image1.jpg', 'https://example.com/image2.jpg'])
  .then((images) =\> {
    console.log('所有图片加载成功', images);
  \})
  .catch((error) =\> {
    console.error('图片加载失败', error);
  \});
```
