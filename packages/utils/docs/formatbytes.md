---
title: "formatBytes"
description: "文件大小格式化工具"
module: "common/format"
pageClass: "api-page function-page"
---


# formatBytes

**模块**: `common/format`

<Badge type="tip" text="Function" color="purple" />

## 概述

formatBytes function

## 签名

```typescript
const formatBytes = (bytes: number, options?: { base?: 1000 | 1024; digits?: number | ; errorMessages?: { invalidNumber?: string; negativeValue?: string }; locale?: string | string[]; units?: string[]; useIECUnits?: boolean }): string
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| bytes | `number` | 文件大小（字节数） |
| options | `{ base?: 1000 | 1024; digits?: number | ; errorMessages?: { invalidNumber?: string; negativeValue?: string }; locale?: string | string[]; units?: string[]; useIECUnits?: boolean }` | 格式化配置选项 |

## 返回值

**Type**: `string`

> 文件大小格式化工具

## 案例1

```typescript
// 基本用法
formatBytes(1024) // "1 KB"

// 使用二进制单位
formatBytes(1024, { base: 1024, useIECUnits: true }) // "1 KiB"

// 本地化显示（中文）
formatBytes(1024, {
  locale: 'zh-CN',
  units: ['字节', 'KB', 'MB', 'GB'],
  errorMessages: {
    invalidNumber: '必须传入有效数字',
    negativeValue: '文件大小不能为负数'
  }
}) // "1 KB"

// 自定义精度
formatBytes(1234, { digits: 2 }) // "1.21 KB"

// 处理极限值
formatBytes(0) // "0 B"
formatBytes(Number.MAX_SAFE_INTEGER) // 最大可表示值
```
