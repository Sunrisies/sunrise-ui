import type { Cartesian3, Rectangle, TerrainProvider, Viewer } from "cesium";

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
  types?: Array<'arraybuffer' | 'blob'>
  /** 是否开启调试模式 */
  debug: boolean
}

/**
 * 计算位置矩阵参数类型
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface CalculateLocationType {
  /** 经度值，范围：-180 到 180 */
  longitude: number;
  /** 纬度值，范围：-90 到 90 */
  latitude: number;
  /** 方位角（度），默认值为 0，表示正北方向 */
  heading?: number;
  /** Cesium 地形提供者，用于获取地形高度数据 */
  terrainProvider: TerrainProvider;
}

/**
 * 查找模型参数类型
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface FindModelByIdType {
  /** Cesium 场景查看器实例，用于访问场景中的模型 */
  viewer: Viewer;
  /** 要查找的模型的唯一标识符 */
  id: string;
}

/**
 * 经纬度坐标类型
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface LonLatCoordinate {
  /** 经度 */
  Lon: number;
  /** 纬度 */
  Lat: number;
}

/**
 * 相机飞行选项类型
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export interface FlyToOptions {
  /** 目标位置，可以是笛卡尔坐标点或矩形区域 */
  destination: Cartesian3 | Rectangle;
  /** 飞行持续时间（秒） */
  duration?: number;
  /** 飞行完成后的回调函数 */
  complete?: () => void;
  /** 飞行取消时的回调函数 */
  cancel?: () => void;
}
