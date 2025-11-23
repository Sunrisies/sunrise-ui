import { Cartesian3, Cartographic, Math } from "cesium";
import type { LonLatCoordinate } from "../types";

/**
 * 坐标转换工具类
 * @public
 * @author 朝阳
 * @version 1.0.0
 *
 * @memberof module:cesium/utils
 */
export class CoordinateUtils {
  /**
   * 将笛卡尔坐标转换为经纬度
   * @public
   * @static
   * @param {Cartesian3} cartesian - 笛卡尔坐标，表示地球表面或空间中的一个点
   * @returns {LonLatCoordinate} 返回包含经度和纬度的对象
   *
   * @应用场景
   * - 获取相机当前位置的地理坐标
   * - 将实体位置转换为可读的经纬度格式
   * - 计算两点之间的地理距离
   * - 在地图上显示坐标信息
   * - 将3D空间坐标转换为地理信息系统(GIS)可用的格式
   *
   * @example
   * ```typescript
   * // 创建一个笛卡尔坐标点（北京天安门上空1000米）
   * const cartesian = Cartesian3.fromDegrees(116.3974, 39.9093, 1000);
   *
   * // 转换为经纬度
   * const lonLat = CoordinateUtils.cartesianToLonLat(cartesian);
   * console.log(`经度: ${lonLat.Lon}, 纬度: ${lonLat.Lat}`);
   *
   * // 输出: 经度: 116.3974, 纬度: 39.9093
   * ```
   */
  static cartesianToLonLat(cartesian: Cartesian3): LonLatCoordinate {
    const cartographic = Cartographic.fromCartesian(cartesian);
    const Lon = Math.toDegrees(cartographic.longitude);
    const Lat = Math.toDegrees(cartographic.latitude);
    return { Lon, Lat };
  }

  /**
   * 将经纬度转换为笛卡尔坐标
   * @public
   * @static
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} [height=0] - 高度（米）
   * @returns {Cartesian3} 返回笛卡尔坐标
   *
   * @应用场景
   * - 在指定地理坐标放置3D模型
   * - 设置相机飞行的目标位置
   * - 创建地理标记点
   * - 计算空间几何关系
   * - 将GIS数据转换为Cesium可用的3D坐标
   *
   * @example
   * ```typescript
   * // 将经纬度转换为笛卡尔坐标
   * const cartesian = CoordinateUtils.lonLatToCartesian(116.3974, 39.9093, 1000);
   * ```
   */
  static lonLatToCartesian(
    longitude: number,
    latitude: number,
    height: number = 0
  ): Cartesian3 {
    return Cartesian3.fromDegrees(longitude, latitude, height);
  }

  /**
   * 将弧度坐标转换为度坐标
   * @public
   * @static
   * @param {Cartographic} cartographic - 弧度坐标
   * @returns {LonLatCoordinate} 返回度坐标
   *
   * @应用场景
   * - 处理Cesium内部使用的弧度坐标
   * - 将数学计算结果的弧度值转换为可读的度坐标
   * - 与其他使用度坐标的系统进行数据交换
   * - 显示用户友好的坐标信息
   *
   * @example
   * ```typescript
   * const cartographic = new Cartographic(2.034, 0.698, 100);
   * const degrees = CoordinateUtils.cartographicToDegrees(cartographic);
   * ```
   */
  static cartographicToDegrees(cartographic: Cartographic): LonLatCoordinate {
    return {
      Lon: Math.toDegrees(cartographic.longitude),
      Lat: Math.toDegrees(cartographic.latitude),
    };
  }

  /**
   * 计算两点之间的距离（米）
   * @public
   * @static
   * @param {Cartesian3} point1 - 第一个点
   * @param {Cartesian3} point2 - 第二个点
   * @returns {number} 两点之间的距离（米）
   *
   * @应用场景
   * - 测量两个地理特征之间的实际距离
   * - 计算飞行路径长度
   * - 验证空间数据精度
   * - 创建距离相关的空间分析
   * - 在导航应用中计算行程距离
   *
   * @example
   * ```typescript
   * const point1 = Cartesian3.fromDegrees(116.3974, 39.9093);
   * const point2 = Cartesian3.fromDegrees(121.4737, 31.2304);
   * const distance = CoordinateUtils.calculateDistance(point1, point2);
   * console.log(`距离: ${distance} 米`);
   * ```
   */
  static calculateDistance(point1: Cartesian3, point2: Cartesian3): number {
    return Cartesian3.distance(point1, point2);
  }
}

export default CoordinateUtils;
