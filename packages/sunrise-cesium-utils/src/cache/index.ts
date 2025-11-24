
import useLocalStore from './LocalStore'
import * as Cesium from 'cesium'

type ResponseType = 'arraybuffer' | 'blob'

/**
 * 缓存配置接口
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface CacheConfig {
  /** 数据库名称 */
  dbName?: string
  /** 生成缓存键的回调函数 */
  key?: (
    url: string,
    responseType: string,
    method: 'GET' | 'POST',
    data: object | undefined,
    headers: object | undefined
  ) => string
  /** 需要缓存的响应类型 */
  types?: Array<ResponseType>
  /** 是否开启调试模式 */
  debug: boolean
}

type Resource = typeof Cesium.Resource

// 类型定义,覆盖 Cesium.Resource._Implementations.loadWithXhr 方法 cesium 的请求基本上都是走这个方法
let used = false

interface CesiumResource extends Resource {
  _Implementations: {
    loadWithXhr: (
      url: string,
      responseType: ResponseType,
      method: 'GET' | 'POST',
      data: object | undefined,
      headers: object | undefined,
      deferred: {
        promise: Promise<any>
        reject: (reason?: any) => void
        resolve: (value?: any) => void
      },
      overrideMimeType: string | undefined
    ) => any
  }
}

/**
 * Cesium 缓存工具类，用于缓存 Cesium 资源请求
 * @public
 * @author 朝阳
 * @version 1.0.0
 * @param config - 缓存配置
 * @param Resource - Cesium Resource 类，可选
 * @returns 缓存工具实例
 */
export const useCesiumCache = (
  config: CacheConfig = {
    types: ['blob', 'arraybuffer'],
    debug: false
  },
  Resource?: Resource
) => {
  const { dbName = 'LocalStore' } = config
  // 创建本地存储实例 (indexDb)
  const LocalStore = useLocalStore({ dbName })
  const result = {
    /**
     * 清除所有缓存
     */
    clear() {
      LocalStore.clearCache()
    },
    /**
     * 获取缓存大小
     * @returns 格式化后的缓存大小
     */
    getCacheSize() {
      return LocalStore.getCacheSize()
    }
  }

  if (used) {
    return result
  }
  used = true

  if (!Resource) {
    if (Cesium && Cesium.Resource) {
      // 从 window 对象中获取 Resource
      Resource = Cesium.Resource as CesiumResource
    } else {
      // throw new Error('Resource is not defined')
      console.error('Resource is not defined Failed to enable caching')
      return result
    }
  }

  const _Resource = Resource as CesiumResource
  const types = config.types || ['blob', 'arraybuffer']
  const loadWithXhr = _Resource._Implementations.loadWithXhr

  _Resource._Implementations.loadWithXhr = (
    url,
    responseType,
    method,
    data,
    headers,
    deferred,
    overrideMimeType
  ) => {
    const key = config.key ? config.key(url, responseType, method, data, headers) : url // 默认以 url 作为 key 若 key 为 空字符串 不缓存

    if (key !== '' && types.includes(responseType)) {
      // 查询缓存
      LocalStore.getCacheByKey(key).then((value) => {
        if (value) {
          // 命中缓存
          if (config.debug) {
            console.log(`[CesiumCache] Hit: ${url}`)
          }
          deferred.resolve(value)
        } else {
          // 没有命中，发起网络请求
          if (config.debug) {
            console.log(`[CesiumCache] Miss: ${url}`)
          }
          // 缓存
          const { resolve } = deferred
          deferred.resolve = (data: any) => {
            resolve(data)
            if (data) {
              if (config.debug) {
                console.log(`[CesiumCache] Cached: ${url}`)
              }
              LocalStore.setCacheToLocal(key, data)
            }
          }
          loadWithXhr(url, responseType, method, data, headers, deferred, overrideMimeType)
        }
      })
      return
    }

    return loadWithXhr(url, responseType, method, data, headers, deferred, overrideMimeType)
  }

  return result
}

export default useCesiumCache
