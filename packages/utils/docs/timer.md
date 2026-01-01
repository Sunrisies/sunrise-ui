---
title: "Timer"
description: "定时器控制"
module: "common/time"
pageClass: "api-page class-page"
sidebar: "auto"
---


# Timer

**模块**: `common/time`

<Badge type="tip" text="Class" color="blue" />

## 概述

Timer class

## Constructor

```typescript
new Timer()
```

## 方法

### start

- 启动定时任务

```typescript
function start(callback: Function, interval: number): void
```

### stop

- 停止定时任务并释放资源

```typescript
function stop(): void
```

## 案例1

```typescript
const timer = new Timer();

// 启动定时任务
timer.start(() => {
  console.log('每2秒执行');
}, 2000);

// 停止定时任务
timer.stop();
```

## UpTimeType 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| formattedDate | `string` | 格式化的日期字符串 |
| nowTime | `string` | 当前时间字符串 |
| today | `string` | 中文星期名称 |
