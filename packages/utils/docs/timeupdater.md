---
title: "TimeUpdater"
description: "时间更新管理"
module: "common/TimeUpdater"
pageClass: "api-page class-page"
sidebar: "auto"
---


# TimeUpdater

**模块**: `common/TimeUpdater`

<Badge type="tip" text="Class" color="blue" />

## 概述

TimeUpdater class

## Constructor

```typescript
new TimeUpdater()
```

## 方法

### startUpdate

- 开始定期更新时间

```typescript
function startUpdate(callback: (result: UpTimeType) => void): void
```

### stopUpdate

- 停止定期更新时间

```typescript
function stopUpdate(): void
```

## 案例1

```typescript
const updater = new TimeUpdater();

// 启动时间更新
updater.startUpdate(({ nowTime }) => {
  console.log('当前时间:', nowTime);
});

// 停止更新时间
updater.stopUpdate();
```
