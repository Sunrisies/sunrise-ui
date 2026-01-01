---
title: "downloadFile"
description: "下载文件"
module: "browser/downloadFile"
pageClass: "api-page function-page"
---


# downloadFile

**模块**: `browser/downloadFile`

<Badge type="tip" text="Function" color="purple" />

## 概述

downloadFile function

## 签名

```typescript
const downloadFile = (url: string, filename: string): Promise<void>
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| url | `string` | 文件下载地址（需符合 URL 规范） |
| filename | `string` | 保存时使用的文件名（需包含扩展名） |

## 返回值

**Type**: `Promise<void>`

> module:browser/downloadFile

## 案例1

```typescript
// 下载图片文件
await downloadFile('https://example.com/photo.jpg', 'vacation-photo.jpg');
```
