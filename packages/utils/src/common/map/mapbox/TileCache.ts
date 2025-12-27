import useLocalStore from "../../localStore";
import type { Map } from "mapbox-gl";
interface CustomSourceInterface<T = ImageBitmap> {
  id: string;
  type: "custom";
  dataType: "raster";
  minzoom?: number;
  maxzoom?: number;
  scheme?: string;
  tileSize?: number;
  attribution?: string;
  bounds?: [number, number, number, number];
  hasTile?: (tileID: TileID) => boolean;
  loadTile: (tileID: TileID, options: { signal: AbortSignal }) => Promise<T>;
  prepareTile?: (tileID: TileID) => T | undefined;
  unloadTile?: (tileID: TileID) => void;
  onAdd?: (map: Map) => void;
  onRemove?: (map: Map) => void;
}
/**
 * 瓦片缓存配置接口
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface TileCacheConfig {
  /** 数据库名称 */
  dbName?: string;
  /** 瓦片URL模板，使用{z}、{x}、{y}作为占位符 */
  urlTemplate?: string;
  /** 最大缩放级别 */
  maxzoom?: number;
  /** 最小缩放级别 */
  minzoom?: number;
  /** 瓦片大小 */
  tileSize?: number;
  /** 是否开启调试模式 */
  debug?: boolean;
}

/**
 * 瓦片缓存统计信息
 */
export interface TileCacheStats {
  /** 瓦片数量 */
  count: number;
  /** 总大小（字节） */
  size: number;
  /** 格式化后的大小 */
  sizeInMB: string;
}

/**
 * 瓦片坐标
 */
export interface TileID {
  /** 缩放级别 */
  z: number;
  /** 列坐标 */
  x: number;
  /** 行坐标 */
  y: number;
}

/**
 * 瓦片缓存工具类，用于缓存地图瓦片资源
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export const useTileCache = (config: TileCacheConfig = {}) => {
  const {
    dbName = "TileCacheDB",
    urlTemplate = "",
    maxzoom = 18,
    minzoom = 0,
    tileSize = 512,
    debug = false,
  } = config;

  // 创建本地存储实例 (IndexedDB)
  const localStore = useLocalStore({ dbName });

  /**
   * 根据瓦片坐标生成URL
   * @param tileID 瓦片坐标
   * @returns 瓦片URL
   */
  const getTileUrl = (tileID: TileID): string => {
    const { z, x, y } = tileID;
    return urlTemplate
      .replace("{z}", String(z))
      .replace("{x}", String(x))
      .replace("{y}", String(y));
    // .replace("{Galileo}", String(Math.floor(Math.random() * 1000)));
  };

  /**
   * 加载瓦片，优先从缓存获取
   * @param tileID 瓦片坐标
   * @param options 请求选项
   * @returns ImageBitmap对象
   */
  const loadTile = async (
    tileID: TileID,
    options: { signal: AbortSignal } = { signal: new AbortController().signal }
  ): Promise<ImageBitmap> => {
    console.log("loadTile", tileID);
    const url = getTileUrl(tileID);

    // 先检查缓存
    const cachedData = await localStore.getCacheByKey(url);
    if (cachedData) {
      if (debug) {
        console.log(
          `[TileCache] 从缓存加载瓦片: ${tileID.z}/${tileID.x}/${tileID.y}`
        );
      }
      // 将 ArrayBuffer 或 Blob 转换为 ImageBitmap
      if (cachedData instanceof Blob) {
        return createImageBitmap(cachedData);
      } else if (cachedData instanceof ArrayBuffer) {
        const blob = new Blob([cachedData], { type: "image/png" });
        return createImageBitmap(blob);
      } else if (cachedData instanceof ImageBitmap) {
        return cachedData;
      }
    }

    // 缓存未命中，从网络获取
    try {
      const response = await fetch(url, { signal: options.signal });
      if (!response.ok) {
        throw new Error(
          `Failed to load tile ${tileID.z}/${tileID.x}/${tileID.y}`
        );
      }

      const imageBlob = await response.blob();

      // 缓存新获取的数据
      await localStore.setCacheToLocal(url, imageBlob);

      if (debug) {
        console.log(
          `[TileCache] 从网络加载并缓存瓦片: ${tileID.z}/${tileID.x}/${tileID.y}`
        );
      }

      return createImageBitmap(imageBlob);
    } catch (error) {
      // 如果是中止错误，不记录为错误，因为这是正常行为
      if (error instanceof Error && error.name === "AbortError") {
        if (debug) {
          console.log(
            `[TileCache] 瓦片加载被中止: ${tileID.z}/${tileID.x}/${tileID.y}`
          );
        }
        return Promise.reject(error); // 继续传递中止错误
      }
      console.error(
        `[TileCache] 加载瓦片失败: ${tileID.z}/${tileID.x}/${tileID.y}`,
        error
      );
      throw error;
    }
  };

  /**
   * 卸载瓦片
   * @param tileID 瓦片坐标
   */
  const unloadTile = (tileID: TileID): void => {
    if (debug) {
      console.log(
        `[TileCache] Unloading tile ${tileID.z}/${tileID.x}/${tileID.y}`
      );
    }
  };

  /**
   * 获取缓存统计信息
   * @returns 缓存统计信息
   */
  const getCacheStats = async (): Promise<TileCacheStats> => {
    const sizeStr = await localStore.getCacheSize();
    // 解析大小字符串获取字节数
    let sizeInBytes = 0;
    if (sizeStr.includes("MB")) {
      sizeInBytes = parseFloat(sizeStr) * 1024 * 1024;
    } else if (sizeStr.includes("KB")) {
      sizeInBytes = parseFloat(sizeStr) * 1024;
    } else if (sizeStr.includes("B")) {
      sizeInBytes = parseFloat(sizeStr);
    }

    return {
      count: 0, // LocalStore 不直接提供计数，需要扩展
      size: sizeInBytes,
      sizeInMB: sizeStr,
    };
  };

  /**
   * 清除所有缓存
   */
  const clearCache = async (): Promise<void> => {
    await localStore.clearCache();
    if (debug) {
      console.log("[TileCache] 缓存已清除");
    }
  };

  /**
   * 创建自定义地图源实现
   * @returns 地图源对象
   */
  const createRasterSource = (): CustomSourceInterface<ImageBitmap> => {
    return {
      id: "custom-tile-source",
      type: "custom",
      dataType: "raster",
      tileSize,
      minzoom,
      maxzoom,
      loadTile,
      unloadTile,
      onAdd(map: any) {
        if (debug) {
          console.log("[TileCache] Custom source added to map");
        }
      },
      onRemove(map: any) {
        if (debug) {
          console.log("[TileCache] Custom source removed from map");
        }
      },
    };
  };

  return {
    loadTile,
    unloadTile,
    getCacheStats,
    clearCache,
    createRasterSource,
    getTileUrl,
  };
};

export default useTileCache;
