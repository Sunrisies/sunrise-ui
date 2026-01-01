---
title: "genRandStr"
description: "生成随机字符串"
module: "common/string"
pageClass: "api-page function-page"
---


# genRandStr

**模块**: `common/string`

<Badge type="tip" text="Function" color="purple" />

## 概述

genRandStr function

## 签名

```typescript
const genRandStr = (length: T): GenRandStrResult<T>
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| length | `T` | 随机字符串的目标长度 |

## 返回值

**Type**: `GenRandStrResult<T>`

> 根据输入参数的类型和值生成随机字符串或返回错误

## 案例1

```typescript
// 生成10位随机字符串
const result1 = genRandStr(10);
console.log(result1); // 输出类似 "aB3dE7gH9j"

// 错误处理示例
const result2 = genRandStr('invalid');
if (result2 instanceof Error) {
  console.error(result2.message); // "Length must be a positive number"
}

// 类型检查示例
const result3 = genRandStr(-5);
if (result3 instanceof Error) {
  console.error(result3.message); // "Length must be a positive number"
}

// TypeScript类型推导
const result4 = genRandStr(8); // result4 的类型为 string
const result5 = genRandStr('test'); // result5 的类型为 Error
```

## 类型别名

> 根据输入类型决定返回类型：number返回string，其他类型返回Error