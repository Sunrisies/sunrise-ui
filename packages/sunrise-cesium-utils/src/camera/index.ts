import { Cartesian3, Rectangle, Viewer } from "cesium";
import type { FlyToOptions } from "../types";
import * as Cesium from "cesium";

/**
 * 相机控制工具类
 * @public
 * @author 朝阳
 * @version 1.0.0
 *
 * @memberof module:cesium/utils
 */
export class CameraUtils {
  /**
   * 控制相机飞行到指定位置
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian3 | Rectangle} position - 目标位置，可以是笛卡尔坐标点或矩形区域
   * @param {Partial<FlyToOptions>} [options={}] - 飞行选项
   * @returns {void} 无返回值
   *
   * @应用场景
   * - 实现地图导航功能，快速定位到感兴趣区域
   * - 在GIS应用中跳转到特定地理要素
   * - 创建旅游导览，按顺序展示多个景点
   * - 在应急响应系统中快速定位到事件发生地
   * - 为三维场景创建预设视角
   * - 实现"回到初始位置"功能
   *
   * @example
   * ```typescript
   * // 初始化查看器
   * const viewer = new Viewer('cesiumContainer');
   *
   * // 飞行到指定笛卡尔坐标点
   * const targetPosition = Cartesian3.fromDegrees(116.39, 39.9, 1000);
   * CameraUtils.flyTo(viewer, targetPosition);
   *
   * // 飞行到指定矩形区域
   * const rectangle = Rectangle.fromDegrees(116.3, 39.8, 116.5, 40.0);
   * CameraUtils.flyTo(viewer, rectangle, { duration: 3 });
   *
   * // 使用完整选项
   * CameraUtils.flyTo(viewer, targetPosition, {
   *   duration: 5,
   *   complete: () => console.log('飞行完成!'),
   *   cancel: () => console.log('飞行取消!')
   * });
   * ```
   */
  static flyTo(
    viewer: Viewer,
    position: Cartesian3 | Rectangle,
    options: Partial<FlyToOptions> = {}
  ): void {
    const { duration = 3, complete, cancel } = options;

    viewer.camera.flyTo({
      destination: position,
      duration,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
      complete,
      cancel,
    });
  }

  /**
   * 控制相机飞行到指定经纬度
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} [height=1000] - 飞行高度（米）
   * @param {Partial<FlyToOptions>} [options={}] - 飞行选项
   * @returns {void} 无返回值
   *
   * @应用场景
   * - 快速导航到已知经纬度的位置
   * - 在地理教学软件中展示特定地点
   * - 房地产应用中查看物业位置
   * - 气象应用中定位气象站位置
   * - 结合GPS数据实时跟踪移动目标
   *
   * @example
   * ```typescript
   * // 飞行到北京天安门上空1000米
   * CameraUtils.flyToLonLat(viewer, 116.3974, 39.9093, 1000);
   * ```
   */
  static flyToLonLat(
    viewer: Viewer,
    longitude: number,
    latitude: number,
    height: number = 1000,
    options: Partial<FlyToOptions> = {}
  ): void {
    const position = Cartesian3.fromDegrees(longitude, latitude, height);
    this.flyTo(viewer, position, options);
  }

  /**
   * 设置相机位置（立即跳转，无动画）
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian3} position - 目标位置
   * @returns {void} 无返回值
   *
   * @应用场景
   * - 需要立即切换视角的场景
   * - 创建预设视角的快速切换
   * - 在性能要求高的应用中避免飞行动画
   * - 实现多视图对比功能
   * - 在VR/AR应用中快速重置视角
   *
   * @example
   * ```typescript
   * const position = Cartesian3.fromDegrees(116.3974, 39.9093, 1000);
   * CameraUtils.setView(viewer, position);
   * ```
   */
  static setView(viewer: Viewer, position: Cartesian3): void {
    viewer.camera.setView({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
  }

  /**
   * 获取当前相机位置
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @returns {Cartesian3} 当前相机位置的笛卡尔坐标
   *
   * @应用场景
   * - 保存用户当前的视图状态
   * - 实现"返回上一视图"功能
   * - 记录用户浏览轨迹
   * - 在多用户协作中同步视角
   * - 分析用户关注的热点区域
   *
   * @example
   * ```typescript
   * const cameraPosition = CameraUtils.getCurrentPosition(viewer);
   * console.log('当前相机位置:', cameraPosition);
   * ```
   */
  static getCurrentPosition(viewer: Viewer): Cartesian3 {
    return viewer.camera.position;
  }
}

export default CameraUtils;
