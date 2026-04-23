import { useLocalStore } from "sunrise-utils";

import * as Cesium from "cesium";

type ResponseType = "arraybuffer" | "blob";

/**
 * 缓存配置接口
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface CacheConfig {
  /** 数据库名称，默认为 'LocalStore'，用于 IndexedDB 的存储隔离 */
  dbName?: string;
  /**
   * 生成缓存键的回调函数
   * 默认使用 URL 作为键。如果需要根据请求参数、Headers 等自定义缓存逻辑，可提供此函数。
   * @returns 返回字符串作为缓存键，如果返回空字符串则表示该请求不进行缓存
   */
  key?: (
    url: string,
    responseType: string,
    method: "GET" | "POST",
    data: object | undefined,
    headers: object | undefined,
  ) => string;
  /** 需要缓存的响应类型列表，默认为 ["blob", "arraybuffer"] */
  types?: Array<ResponseType>;
  /** 是否开启调试模式，开启后会在控制台打印缓存命中、未命中及更新日志 */
  debug: boolean;
}

type Resource = typeof Cesium.Resource;

// 标记位，确保全局只对 Cesium.Resource 进行一次 Monkey Patch (方法覆盖)
let used = false;

/**
 * 扩展 Cesium.Resource 类型定义
 * 主要为了访问其内部的 _Implementations.loadWithXhr 方法，
 * Cesium 的网络请求底层基本上都是通过这个方法发起的。
 */
interface CesiumResource extends Resource {
  _Implementations: {
    loadWithXhr: (
      url: string,
      responseType: ResponseType,
      method: "GET" | "POST",
      data: object | undefined,
      headers: object | undefined,
      deferred: {
        promise: Promise<any>;
        reject: (reason?: any) => void;
        resolve: (value?: any) => void;
      },
      overrideMimeType: string | undefined,
    ) => any;
  };
}

/**
 * Cesium 缓存工具 Hook
 * 通过拦截 Cesium.Resource._Implementations.loadWithXhr 方法，
 * 实现对 Cesium 资源请求（如图片、地形数据等）的本地 IndexedDB 缓存。
 *
 * @public
 * @author 朝阳
 * @version 1.0.0
 *
 * @example
 * // 基础用法：开启默认缓存
 * const { clear, getCacheSize } = useCesiumCache({ debug: true });
 *
 * @example
 * // 自定义配置用法
 * const cacheManager = useCesiumCache({
 *   dbName: 'MyCesiumCache', // 自定义数据库名
 *   debug: true,             // 开启日志
 *   types: ['blob'],         // 仅缓存 blob 类型
 *   key: (url) => url        // 自定义 Key 生成逻辑
 * });
 * // 清除缓存
 * cacheManager.clear();
 *
 * @param config - 缓存配置对象
 * @param Resource - Cesium Resource 类。如果不传，默认尝试从全局 Cesium 对象获取。
 * @returns 返回包含缓存管理方法（清除、获取大小）的对象
 */
export const useCesiumCache = (
  config: CacheConfig = {
    types: ["blob", "arraybuffer"],
    debug: false,
  },
  Resource?: Resource,
) => {
  // 解构配置，设置默认数据库名称
  const { dbName = "LocalStore" } = config;

  // 初始化本地存储实例 (基于 IndexedDB)
  const LocalStore = useLocalStore({ dbName });

  // 定义返回的缓存管理对象
  const result = {
    /**
     * 清除当前数据库下的所有缓存数据
     */
    clear() {
      LocalStore.clearCache();
    },
    /**
     * 获取当前缓存占用的存储空间大小
     * @returns 格式化后的缓存大小字符串（例如 "10.5 MB"）
     */
    getCacheSize() {
      return LocalStore.getCacheSize();
    },
  };

  // 如果已经拦截过，直接返回管理对象，避免重复覆盖
  if (used) {
    return result;
  }
  used = true;

  // 如果未传入 Resource，尝试从全局 Cesium 对象获取
  if (!Resource) {
    if (Cesium && Cesium.Resource) {
      Resource = Cesium.Resource as CesiumResource;
    } else {
      // 如果 Cesium 未加载或不存在 Resource，打印错误并退出拦截
      console.error("Resource is not defined Failed to enable caching");
      return result;
    }
  }

  const _Resource = Resource as CesiumResource;
  // 确定需要缓存的响应类型，默认为 blob 和 arraybuffer
  const types = config.types || ["blob", "arraybuffer"];

  // 保存原始的 XHR 加载函数，以便在缓存未命中时调用
  const loadWithXhr = _Resource._Implementations.loadWithXhr;

  // 核心：覆盖 Cesium 内部的 loadWithXhr 方法
  _Resource._Implementations.loadWithXhr = (
    url,
    responseType,
    method,
    data,
    headers,
    deferred,
    overrideMimeType,
  ) => {
    // 1. 生成缓存 Key
    // 如果配置了自定义 key 函数则使用，否则默认使用 URL
    const key = config.key
      ? config.key(url, responseType, method, data, headers)
      : url;

    // 2. 检查是否满足缓存条件：
    //    - Key 不为空字符串（空字符串表示明确不缓存）
    //    - 响应类型在配置的 types 列表中（如 blob, arraybuffer）
    if (key !== "" && types.includes(responseType)) {
      // 3. 尝试从 IndexedDB 获取缓存
      LocalStore.getCacheByKey(key).then((value) => {
        if (value) {
          // --- 缓存命中 ---
          if (config.debug) {
            console.log(`[CesiumCache] 命中缓存: ${url}`);
          }
          // 直接使用缓存数据解决 Promise，不再发起网络请求
          deferred.resolve(value);
        } else {
          // --- 缓存未命中 ---
          if (config.debug) {
            console.log(`[CesiumCache] 未命中缓存，发起网络请求: ${url}`);
          }

          // 劫持 deferred.resolve 方法
          // 这样当网络请求完成时，我们可以先保存数据再触发真正的 resolve
          const { resolve } = deferred;
          deferred.resolve = (data: any) => {
            // 先触发原始逻辑，让 Cesium 正常处理数据
            resolve(data);

            // 如果有数据，将其存入 IndexedDB
            if (data) {
              if (config.debug) {
                console.log(`[CesiumCache] 网络请求完成，更新缓存: ${url}`);
              }
              LocalStore.setCacheToLocal(key, data);
            }
          };

          // 调用原始的 loadWithXhr 发起真实的网络请求
          loadWithXhr(
            url,
            responseType,
            method,
            data,
            headers,
            deferred,
            overrideMimeType,
          );
        }
      });
      // 拦截处理结束，直接返回
      return;
    }

    // 4. 不满足缓存条件（如类型是 json 或 text），直接透传给原始方法
    return loadWithXhr(
      url,
      responseType,
      method,
      data,
      headers,
      deferred,
      overrideMimeType,
    );
  };

  return result;
};

export default useCesiumCache;
