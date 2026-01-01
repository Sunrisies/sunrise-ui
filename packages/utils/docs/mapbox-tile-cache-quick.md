# Mapbox 瓦片缓存 - 快速参考

## 快速开始

```typescript
import { useTileCache } from "sunrise-utils";

// 1. 初始化
const cache = useTileCache({
  urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png",
  dbName: "MyCache",
  debug: true,
});

// 2. 加载瓦片
const image = await cache.loadTile({ z: 10, x: 500, y: 300 });

// 3. 集成 Mapbox
const source = cache.createRasterSource();
map.addSource("my-tiles", source);
map.addLayer({ id: "tiles", type: "raster", source: "my-tiles" });
```

## 核心 API

| 方法                         | 说明       | 参数               | 返回值                  |
| ---------------------------- | ---------- | ------------------ | ----------------------- |
| `loadTile(tileID, options?)` | 加载瓦片   | TileID, { signal } | Promise<ImageBitmap>    |
| `getCacheStats()`            | 获取统计   | -                  | Promise<TileCacheStats> |
| `clearCache()`               | 清除缓存   | -                  | Promise<void>           |
| `createRasterSource()`       | 创建地图源 | -                  | CustomSourceInterface   |
| `getTileUrl(tileID)`         | 生成 URL   | TileID             | string                  |

## 配置选项

```typescript
{
  dbName: "TileCacheDB",    // 数据库名称
  urlTemplate: "",          // URL 模板 {z}/{x}/{y}
  maxzoom: 18,              // 最大缩放
  minzoom: 0,               // 最小缩放
  tileSize: 512,            // 瓦片大小
  debug: false              // 调试模式
}
```

## 常用场景

### 手动加载

```typescript
const img = await cache.loadTile({ z: 10, x: 500, y: 300 });
```

### Mapbox 集成

```typescript
const source = cache.createRasterSource();
map.addSource("custom", source);
```

### 查看统计

```typescript
const stats = await cache.getCacheStats();
console.log(stats.sizeInMB); // 输出: "15.5 MB"
```

### 清理缓存

```typescript
await cache.clearCache();
```

## 实用示例

### 批量加载瓦片

```typescript
const tiles = [
  { z: 10, x: 500, y: 300 },
  { z: 10, x: 501, y: 300 },
  { z: 10, x: 502, y: 300 },
];

const promises = tiles.map((tile) => cache.loadTile(tile));
const images = await Promise.all(promises);
```

### 带中止的加载

```typescript
const controller = new AbortController();

// 10秒后自动中止
setTimeout(() => controller.abort(), 10000);

const image = await cache.loadTile(tileID, {
  signal: controller.signal,
});
```

### 定期清理

```typescript
setInterval(async () => {
  const stats = await cache.getCacheStats();
  if (stats.size > 100 * 1024 * 1024) {
    // 100MB
    await cache.clearCache();
  }
}, 1000 * 60 * 60); // 每小时检查
```

## 调试模式

```typescript
const cache = useTileCache({
  urlTemplate: "https://tile.example.com/{z}/{x}/{y}.png",
  debug: true, // 在控制台看到详细日志
});
```

**调试输出示例**:

```
[TileCache] 从缓存加载瓦片: 10/500/300
[TileCache] 从网络加载并缓存瓦片: 10/501/300
[TileCache] 缓存已清除
```

## TypeScript 类型

```typescript
// 配置
interface TileCacheConfig {
  dbName?: string;
  urlTemplate?: string;
  maxzoom?: number;
  minzoom?: number;
  tileSize?: number;
  debug?: boolean;
}

// 瓦片坐标
interface TileID {
  z: number;
  x: number;
  y: number;
}

// 统计信息
interface TileCacheStats {
  count: number;
  size: number;
  sizeInMB: string;
}

// 返回接口
interface TileCacheReturn {
  loadTile: (
    tileID: TileID,
    options?: { signal: AbortSignal }
  ) => Promise<ImageBitmap>;
  unloadTile: (tileID: TileID) => void;
  getCacheStats: () => Promise<TileCacheStats>;
  clearCache: () => Promise<void>;
  createRasterSource: () => CustomSourceInterface<ImageBitmap>;
  getTileUrl: (tileID: TileID) => string;
}
```

## 依赖说明

**必须安装**: `dexie`

```bash
pnpm add dexie
```

## 浏览器支持

- ✅ Chrome/Edge 89+
- ✅ Firefox 78+
- ✅ Safari 15.4+
- ❌ IE 11

## 注意事项

1. **IndexedDB**: 确保浏览器支持并启用 IndexedDB
2. **CORS**: 瓦片服务器需要支持 CORS
3. **存储限制**: 浏览器有存储上限，建议定期清理
4. **内存**: ImageBitmap 会占用内存，及时卸载不需要的瓦片

## 作者

**朝阳** - 版本 1.0.0 - 2025-12-27
