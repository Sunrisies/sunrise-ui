---
title: "createActivityMonitor"
description: "活动监控器"
module: "common/activity"
pageClass: "api-page function-page"
---


# createActivityMonitor

**模块**: `common/activity`

<Badge type="tip" text="Function" color="purple" />

## 概述

createActivityMonitor function

## 签名

```typescript
const createActivityMonitor = (options: ActivityMonitorOptions): ActivityMonitorController
```

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| options | `ActivityMonitorOptions` |  |

## 返回值

**Type**: `ActivityMonitorController`

> 用于监控用户活动状态，可以设置超时时间和各种回调函数。
支持自动启动、暂停恢复等功能，适用于会话超时、屏保等场景。

## 案例1

```typescript
// 基本用法
const monitor = createActivityMonitor({
  timeout: 5000,
  onTimeout: () => console.log('超时'),
  onActivity: () => console.log('检测到活动')
});

// 启动监控
monitor.start();

// 手动触发活动检查
monitor.check();

// 停止监控
monitor.stop();
```

## ActivityMonitorController 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| check | `any` |  |
| getState | `any` |  |
| pause | `any` |  |
| resume | `any` |  |
| start | `any` |  |
| stop | `any` |  |

## ActivityMonitorOptions 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| autoStart | `boolean` | 是否在创建监控器实例时自动启动监控 |
| onActivity | `() => void` | 检测到活动时执行的回调函数 |
| onStart | `() => void` | 监控器首次启动时执行的回调函数 |
| onStop | `() => void` | 监控器停止时执行的回调函数 |
| onTimeout | `() => void` | 超时时执行的回调函数 |
| pauseOnBlur | `boolean` | 是否在窗口失去焦点时暂停监控 |
| resumeOnFocus | `boolean` | 是否在窗口重新获得焦点时恢复监控 |
| timeout | `number` | 设置活动超时时间（毫秒） |

## ActivityMonitorState 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| elapsedTime | `number` | 活动已运行时间（毫秒） |
| isActive | `boolean` | 指示当前监控器是否处于活动状态 |
| remainingTime | `number` | 活动剩余时间（毫秒） |
