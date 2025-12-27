---
title: "Http"
description: "可配置的 HTTP 客户端实例"
module: "browser/http"
pageClass: "api-page class-page"
sidebar: "auto"
---


# Http

**模块**: `browser/http`

<Badge type="tip" text="Class" color="blue" />

## 概述

Http class

## Constructor

```typescript
new Http(baseURL?: string)
```

## 方法

### delete

- 发送 DELETE 请求删除资源

```typescript
function delete(endpoint: string, config?: Omit<RequestConfig<unknown>, "data" | "method">): Promise<ApiResponse<TResponse>>
```

### get

- 发送 GET 请求获取资源

```typescript
function get(endpoint: string, config?: Omit<RequestConfig<unknown>, "data" | "method">): Promise<ApiResponse<TResponse>>
```

### post

- 发送 POST 请求创建资源

```typescript
function post(endpoint: string, data?: T, config?: Omit<RequestConfig<unknown>, "data" | "method">): Promise<ApiResponse<TResponse>>
```

### put

- 发送 PUT 请求更新资源

```typescript
function put(endpoint: string, data?: T, config?: Omit<RequestConfig<unknown>, "data" | "method">): Promise<ApiResponse<TResponse>>
```

### request

- 执行 HTTP 请求的核心方法

```typescript
function request(endpoint: string, config?: RequestConfig<T>): Promise<ApiResponse<TResponse>>
```

## 案例1

```typescript
// 创建 GitHub API 客户端
const http = new Http('https://api.github.com');

// 发送带认证的请求
const httpWithAuth = new Http('https://api.example.com');
```
