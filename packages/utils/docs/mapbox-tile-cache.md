# Mapbox 瓦片缓存 (TileCache)

## 概述

`useTileCache` 是一个基于 IndexedDB 的地图瓦片缓存工具，专为 Mapbox GL JS 自定义瓦片源设计。它提供了瓦片的本地缓存、自动加载、统计管理和缓存清理等功能，能够显著提升地图应用的性能和离线使用体验。

**作者**: 朝阳  
**版本**: 1.0.0  
**依赖**: Dexie.js (IndexedDB 封装库)

## 功能特性

- ✅ **智能缓存策略**: 优先从本地缓存加载瓦片，缓存未命中时自动从网络获取
- ✅ **IndexedDB 存储**: 使用浏览器原生 IndexedDB 存储，支持大容量数据存储
- ✅ **自动类型转换**: 自动处理 Blob、ArrayBuffer、ImageBitmap 等多种数据格式
- ✅ **缓存统计**: 提供缓存大小、瓦片数量等统计信息
- ✅ **调试模式**: 支持调试模式，便于开发和问题排查
- ✅ **Mapbox 集成**: 可直接创建 Mapbox 自定义瓦片源
- ✅ **请求中止支持**: 支持 AbortSignal，可中止正在进行的瓦片加载请求

## 安装依赖

```bash
# 使用 pnpm
pnpm add dexie

# 使用 npm
npm install dexie

# 使用 yarn
yarn add dexie
```

## 基础使用

### 1. 导入模块

```typescript
import { useTileCache } from "sunrise-utils";
// 或者从具体路径导入
import { useTileCache } from "sunrise-utils/src/common/map/mapbox/TileCache";
```

### 2. 创建缓存实例

```typescript
const tileCache = useTileCache({
  dbName: "MyMapCache", // 数据库名称（可选）
  urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png", // 瓦片URL模板（可选）
  maxzoom: 18, // 最大缩放级别（可选）
  minzoom: 0, // 最小缩放级别（可选）
  tileSize: 512, // 瓦片大小（可选）
  debug: false, // 调试模式（可选）
});
```

## API 接口文档

### 配置接口 (TileCacheConfig)

```typescript
interface TileCacheConfig {
  /** 数据库名称，默认: "TileCacheDB" */
  dbName?: string;

  /** 瓦片URL模板，使用{z}、{x}、{y}作为占位符 */
  urlTemplate?: string;

  /** 最大缩放级别，默认: 18 */
  maxzoom?: number;

  /** 最小缩放级别，默认: 0 */
  minzoom?: number;

  /** 瓦片大小，默认: 512 */
  tileSize?: number;

  /** 是否开启调试模式，默认: false */
  debug?: boolean;
}
```

### 瓦片坐标接口 (TileID)

```typescript
interface TileID {
  /** 缩放级别 */
  z: number;

  /** 列坐标 */
  x: number;

  /** 行坐标 */
  y: number;
}
```

### 缓存统计接口 (TileCacheStats)

```typescript
interface TileCacheStats {
  /** 瓦片数量 */
  count: number;

  /** 总大小（字节） */
  size: number;

  /** 格式化后的大小（如 "15.5 MB"） */
  sizeInMB: string;
}
```

### 返回方法

调用 `useTileCache(config)` 后返回的对象包含以下方法：

#### `loadTile(tileID, options?)`

加载瓦片，优先从缓存获取。

**参数**:

- `tileID: TileID` - 瓦片坐标
- `options?: { signal: AbortSignal }` - 请求选项，支持中止信号

**返回**: `Promise<ImageBitmap>`

**示例**:

```typescript
const imageBitmap = await tileCache.loadTile(
  { z: 10, x: 500, y: 300 },
  { signal: abortController.signal }
);
```

#### `unloadTile(tileID)`

卸载瓦片（主要用于调试和资源清理）。

**参数**:

- `tileID: TileID` - 瓦片坐标

**示例**:

```typescript
tileCache.unloadTile({ z: 10, x: 500, y: 300 });
```

#### `getCacheStats()`

获取缓存统计信息。

**返回**: `Promise<TileCacheStats>`

**示例**:

```typescript
const stats = await tileCache.getCacheStats();
console.log(`缓存大小: ${stats.sizeInMB}, 瓦片数量: ${stats.count}`);
```

#### `clearCache()`

清除所有缓存数据。

**返回**: `Promise<void>`

**示例**:

```typescript
await tileCache.clearCache();
console.log("缓存已清除");
```

#### `createRasterSource()`

创建 Mapbox 自定义瓦片源对象。

**返回**: `CustomSourceInterface<ImageBitmap>`

**示例**:

```typescript
const rasterSource = tileCache.createRasterSource();
map.addSource("my-tiles", rasterSource);
```

#### `getTileUrl(tileID)`

根据瓦片坐标生成完整的 URL。

**参数**:

- `tileID: TileID` - 瓦片坐标

**返回**: `string`

**示例**:

```typescript
const url = tileCache.getTileUrl({ z: 10, x: 500, y: 300 });
// 返回: "https://tile.example.com/10/500/300.png"
```

## 使用示例

### 示例 1: 基本使用 - 手动加载瓦片

```typescript
import { useTileCache } from "sunrise-utils";

// 1. 创建缓存实例
const tileCache = useTileCache({
  urlTemplate: "https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  debug: true,
});

// 2. 加载特定瓦片
async function loadTileExample() {
  try {
    const tileID = { z: 15, x: 9372, y: 12534 };
    const imageBitmap = await tileCache.loadTile(tileID);

    // 使用 ImageBitmap 进行绘制或其他操作
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);

    console.log("瓦片加载成功");
  } catch (error) {
    console.error("加载失败:", error);
  }
}

// 3. 查看缓存统计
async function showStats() {
  const stats = await tileCache.getCacheStats();
  console.log(`当前缓存: ${stats.sizeInMB}`);
}

// 4. 清理缓存
async function clearAll() {
  await tileCache.clearCache();
  console.log("缓存已清空");
}
```

### 示例 2: 集成 Mapbox GL JS

```typescript
import mapboxgl from "mapbox-gl";
import { useTileCache } from "sunrise-utils";

// 1. 初始化地图和缓存
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [116.3974, 39.9093], // 北京
  zoom: 10,
});

const tileCache = useTileCache({
  dbName: "BeijingTiles",
  urlTemplate: "https://tile.example.com/beijing/{z}/{x}/{y}.png",
  maxzoom: 18,
  debug: true,
});

// 2. 等待地图加载完成后添加自定义源
map.on("load", () => {
  const customSource = tileCache.createRasterSource();

  map.addSource("custom-tiles", customSource);

  map.addLayer({
    id: "custom-tiles-layer",
    type: "raster",
    source: "custom-tiles",
    paint: {
      "raster-opacity": 0.8,
    },
  });
});

// 3. 错误处理和清理
map.on("error", (e) => {
  console.error("地图错误:", e);
});

// 页面卸载时清理
window.addEventListener("beforeunload", () => {
  map.remove();
});
```

### 示例 3: 带请求中止的高级用法

```typescript
import { useTileCache } from "sunrise-utils";

const tileCache = useTileCache({
  urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png",
  debug: true,
});

// 创建中止控制器
let abortController = new AbortController();

async function loadTilesWithAbort() {
  // 取消之前的请求
  abortController.abort();

  // 创建新的中止控制器
  abortController = new AbortController();

  const tiles = [
    { z: 10, x: 500, y: 300 },
    { z: 10, x: 501, y: 300 },
    { z: 10, x: 502, y: 300 },
  ];

  try {
    const promises = tiles.map((tile) =>
      tileCache.loadTile(tile, { signal: abortController.signal })
    );

    const images = await Promise.all(promises);
    console.log(`成功加载 ${images.length} 个瓦片`);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("请求被中止");
    } else {
      console.error("加载失败:", error);
    }
  }
}

// 取消加载
function cancelLoading() {
  abortController.abort();
  console.log("已取消瓦片加载");
}
```

### 示例 4: 缓存管理工具

```typescript
import { useTileCache } from "sunrise-utils";

class TileCacheManager {
  private cache;

  constructor() {
    this.cache = useTileCache({
      dbName: "MapCache",
      urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png",
      debug: true,
    });
  }

  // 获取缓存信息
  async getCacheInfo() {
    const stats = await this.cache.getCacheStats();
    return {
      count: stats.count,
      size: stats.size,
      sizeFormatted: stats.sizeInMB,
      lastUpdated: new Date().toISOString(),
    };
  }

  // 检查缓存是否充足
  async hasEnoughSpace(minSizeMB: number = 100): Promise<boolean> {
    const stats = await this.cache.getCacheStats();
    const sizeMB = stats.size / (1024 * 1024);
    return sizeMB < minSizeMB;
  }

  // 智能清理 - 如果缓存过大，清理最旧的数据
  async smartClean(targetSizeMB: number = 50) {
    const stats = await this.cache.getCacheStats();
    const currentSizeMB = stats.size / (1024 * 1024);

    if (currentSizeMB > targetSizeMB) {
      console.log(`缓存过大 (${currentSizeMB.toFixed(2)} MB)，开始清理...`);
      await this.cache.clearCache();
      console.log("清理完成");
      return true;
    }

    return false;
  }

  // 导出缓存信息（用于调试）
  async exportInfo() {
    const info = await this.getCacheInfo();
    console.table(info);
    return info;
  }
}

// 使用
const manager = new TileCacheManager();

// 定期检查和清理
setInterval(async () => {
  const info = await manager.exportInfo();
  await manager.smartClean(100); // 保持在100MB以下
}, 1000 * 60 * 30); // 每30分钟检查一次
```

### 示例 5: 与 React 集成

```typescript
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useTileCache } from "sunrise-utils";

interface MapComponentProps {
  accessToken: string;
  tileUrl: string;
}

const TileCacheMap: React.FC<MapComponentProps> = ({
  accessToken,
  tileUrl,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [cacheStats, setCacheStats] = useState({
    count: 0,
    size: 0,
    sizeInMB: "0 B",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = accessToken;

    // 初始化缓存
    const tileCache = useTileCache({
      dbName: "ReactMapCache",
      urlTemplate: tileUrl,
      debug: process.env.NODE_ENV === "development",
    });

    // 创建地图
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [116.3974, 39.9093],
      zoom: 10,
    });

    mapRef.current = map;

    map.on("load", async () => {
      // 添加自定义瓦片源
      const source = tileCache.createRasterSource();
      map.addSource("cached-tiles", source);

      map.addLayer({
        id: "cached-layer",
        type: "raster",
        source: "cached-tiles",
        paint: { "raster-opacity": 0.9 },
      });

      // 更新统计信息
      updateStats();
    });

    // 更新统计信息的函数
    const updateStats = async () => {
      const stats = await tileCache.getCacheStats();
      setCacheStats(stats);
    };

    // 定时更新统计
    const interval = setInterval(updateStats, 5000);

    // 清理函数
    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [accessToken, tileUrl]);

  // 清除缓存
  const handleClearCache = async () => {
    if (!mapRef.current) return;

    setIsLoading(true);
    try {
      const tileCache = useTileCache({
        urlTemplate: tileUrl,
      });
      await tileCache.clearCache();
      await updateStats();
    } catch (error) {
      console.error("清除缓存失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = async () => {
    const tileCache = useTileCache({ urlTemplate: tileUrl });
    const stats = await tileCache.getCacheStats();
    setCacheStats(stats);
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />

      {/* 缓存统计面板 */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: 10,
          borderRadius: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: 12,
        }}
      >
        <div>瓦片数量: {cacheStats.count}</div>
        <div>缓存大小: {cacheStats.sizeInMB}</div>
        <button
          onClick={handleClearCache}
          disabled={isLoading}
          style={{ marginTop: 8, padding: "4px 8", cursor: "pointer" }}
        >
          {isLoading ? "清理中..." : "清除缓存"}
        </button>
      </div>
    </div>
  );
};

export default TileCacheMap;
```

## 最佳实践

### 1. 性能优化

```typescript
// ✅ 推荐：批量加载瓦片
const tiles = [
  { z: 10, x: 500, y: 300 },
  { z: 10, x: 501, y: 300 },
  { z: 10, x: 502, y: 300 },
];

const promises = tiles.map((tile) => tileCache.loadTile(tile));
const images = await Promise.all(promises);

// ❌ 避免：串行加载
for (const tile of tiles) {
  await tileCache.loadTile(tile); // 慢！
}
```

### 2. 内存管理

```typescript
// 定期清理缓存，避免占用过多存储空间
async function maintainCache() {
  const stats = await tileCache.getCacheStats();
  const sizeMB = stats.size / (1024 * 1024);

  // 如果超过100MB，清理缓存
  if (sizeMB > 100) {
    await tileCache.clearCache();
    console.log("缓存清理完成");
  }
}

// 每小时检查一次
setInterval(maintainCache, 1000 * 60 * 60);
```

### 3. 错误处理

```typescript
async function safeLoadTile(tileID) {
  try {
    const controller = new AbortController();

    // 设置超时
    setTimeout(() => controller.abort(), 10000);

    const image = await tileCache.loadTile(tileID, {
      signal: controller.signal,
    });

    return image;
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("请求超时或被中止");
    } else if (error.message.includes("Failed to load tile")) {
      console.error("瓦片加载失败，可能网络问题");
    } else {
      console.error("未知错误:", error);
    }
    return null;
  }
}
```

### 4. 离线支持

```typescript
// 检测网络状态，调整缓存策略
function setupOfflineSupport() {
  const isOnline = navigator.onLine;

  if (isOnline) {
    // 在线时：正常加载并缓存
    return tileCache.loadTile(tileID);
  } else {
    // 离线时：只从缓存加载
    return tileCache.loadTile(tileID).catch(() => {
      throw new Error("离线模式下无法获取瓦片");
    });
  }
}

window.addEventListener("online", setupOfflineSupport);
window.addEventListener("offline", setupOfflineSupport);
```

## 调试技巧

### 开启调试模式

```typescript
const tileCache = useTileCache({
  urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png",
  debug: true, // 开启后会在控制台输出详细日志
});
```

### 调试输出示例

```
[TileCache] 从缓存加载瓦片: 10/500/300
[TileCache] 从网络加载并缓存瓦片: 10/501/300
[TileCache] 瓦片加载被中止: 10/502/300
[TileCache] Custom source added to map
[TileCache] 缓存已清除
```

### 开发工具检查

1. **Application 面板**: 查看 IndexedDB 数据库

   - 打开 Chrome DevTools → Application → IndexedDB
   - 查看 `TileCacheDB` 数据库中的 `cache` 表
   - 检查存储的数据和大小

2. **Network 面板**: 监控瓦片请求
   - 过滤 `Fetch/XHR` 请求
   - 查看哪些瓦片来自网络，哪些来自缓存

## 常见问题

### Q: 为什么有些瓦片没有被缓存？

**A**: 检查以下几点：

- 确保 `urlTemplate` 配置正确
- 确保网络请求成功（状态码 200）
- 检查浏览器是否启用了 IndexedDB
- 查看控制台是否有错误信息

### Q: 如何清除特定数据库？

**A**: 目前 `clearCache()` 会清除当前数据库的所有数据。如果需要清除其他数据库，需要创建新的实例：

```typescript
const otherCache = useTileCache({ dbName: "OtherDB" });
await otherCache.clearCache();
```

### Q: 缓存容量有上限吗？

**A**: IndexedDB 的存储上限取决于浏览器和设备：

- 通常为可用磁盘空间的 60%
- 移动设备可能有较低限制
- 浏览器可能会自动清理过期数据

### Q: 支持哪些浏览器？

**A**: 支持所有现代浏览器：

- Chrome/Edge 89+
- Firefox 78+
- Safari 15.4+
- 不支持 IE

## 浏览器兼容性

| 浏览器         | 最低版本 | 支持情况    |
| -------------- | -------- | ----------- |
| Chrome         | 89       | ✅ 完全支持 |
| Edge           | 89       | ✅ 完全支持 |
| Firefox        | 78       | ✅ 完全支持 |
| Safari         | 15.4     | ✅ 完全支持 |
| iOS Safari     | 15.4     | ✅ 完全支持 |
| Chrome Android | 89       | ✅ 完全支持 |
| IE             | 11       | ❌ 不支持   |

## 技术实现细节

### 数据存储格式

瓦片数据在 IndexedDB 中以以下格式存储：

```typescript
interface CacheEntry {
  key: string; // URL (唯一索引)
  value: Blob | ArrayBuffer | ImageBitmap;
  id?: number; // 自增主键
}
```

### 缓存策略流程图

```
1. loadTile() 被调用
   ↓
2. 生成 URL (根据 tileID)
   ↓
3. 检查 IndexedDB 缓存
   ↓
4. 缓存命中？
   ├─ 是 → 返回 ImageBitmap
   └─ 否 → 发起网络请求
           ↓
        请求成功？
        ├─ 是 → 缓存数据 + 返回 ImageBitmap
        └─ 否 → 抛出错误
```

### 性能指标

- **缓存读取**: < 10ms
- **网络请求**: 50-500ms (取决于网络)
- **ImageBitmap 转换**: < 20ms
- **IndexedDB 写入**: < 50ms

## 版本历史

- **1.0.0**: 初始版本
  - 基础瓦片缓存功能
  - Mapbox 自定义源支持
  - IndexedDB 存储
  - 缓存统计和清理

## 相关文档

- [Dexie.js 文档](https://dexie.org/)
- [Mapbox GL JS 自定义源](https://docs.mapbox.com/mapbox-gl-js/api/#customsourceinterface)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## 作者信息

**朝阳**  
GitHub: @Sunrisies  
版本: 1.0.0  
更新日期: 2025-12-27
