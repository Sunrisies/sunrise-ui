import {
  Cartesian2,
  Cartographic,
  Math,
  Viewer,
  defined,
  SceneTransforms,
  Cartesian3,
} from "cesium";
import type { LonLatCoordinate } from "../types";

/**
 * 屏幕坐标工具类
 * @public
 * @author 朝阳
 * @version 1.0.0
 *
 * @memberof module:cesium/utils
 */
export class ScreenUtils {
  /**
   * 计算屏幕坐标对应的经纬度
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian2} position - 屏幕坐标，原点在左上角
   * @returns {LonLatCoordinate | null} 返回经纬度对象，如果无法获取则返回 null
   *
   * @应用场景
   * - 实现地图点击查询位置信息
   * - 创建交互式地图标注工具
   * - 测量用户点击的地理坐标
   * - 实现拖拽放置标记功能
   * - 游戏中的点击交互
   * - 地理数据采集工具
   * - 军事指挥系统中的目标定位
   *
   * @example
   * ```typescript
   * // 初始化查看器
   * const viewer = new Viewer('cesiumContainer');
   *
   * // 监听鼠标点击事件
   * viewer.screenSpaceEventHandler.setInputAction((movement) => {
   *   const position = movement.position;
   *   const lonLat = ScreenUtils.screenToLonLat(viewer, position);
   *
   *   if (lonLat) {
   *     console.log(`经度: ${lonLat.Lon}, 纬度: ${lonLat.Lat}`);
   *   } else {
   *     console.log('无法获取该位置的经纬度');
   *   }
   * }, ScreenSpaceEventType.LEFT_CLICK);
   * ```
   */
  static screenToLonLat(
    viewer: Viewer,
    position: Cartesian2
  ): LonLatCoordinate | null {
    const ray = viewer.camera.getPickRay(position);

    if (!ray) {
      return null;
    }

    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);

    if (defined(cartesian)) {
      const cartographic = Cartographic.fromCartesian(cartesian);
      const Lon = Math.toDegrees(cartographic.longitude);
      const Lat = Math.toDegrees(cartographic.latitude);
      return { Lon, Lat };
    } else {
      return null;
    }
  }

  /**
   * 将经纬度转换为屏幕坐标
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} [height=0] - 高度（米）
   * @returns {Cartesian2 | null} 返回屏幕坐标，如果点在视锥体外或不可见则返回 null
   *
   * @应用场景
   * - 在屏幕上显示地理坐标对应的位置
   * - 创建HUD(平视显示器)信息显示
   * - 实现屏幕空间的地理信息标注
   * - 检测地理要素是否在可视范围内
   * - 创建自定义的UI覆盖物
   * - 游戏中的小地图坐标转换
   * - 实现地理要素的屏幕空间高亮
   *
   * @example
   * ```typescript
   * const screenPos = ScreenUtils.lonLatToScreen(viewer, 116.3974, 39.9093);
   * if (screenPos) {
   *   console.log(`屏幕坐标: x=${screenPos.x}, y=${screenPos.y}`);
   *   // 在屏幕位置绘制UI元素
   * }
   * ```
   */
  static lonLatToScreen(
    viewer: Viewer,
    longitude: number,
    latitude: number,
    height: number = 0
  ): Cartesian2 | null {
    try {
      // 将经纬度转换为笛卡尔坐标
      const cartesian = Cartesian3.fromDegrees(longitude, latitude, height);

      // 使用 SceneTransforms 将世界坐标转换为屏幕坐标
      // 这个方法会考虑相机的视图矩阵和投影矩阵
      const screenPosition = SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        cartesian
      );

      if (!screenPosition) {
        return null;
      }

      // 检查点是否在视锥体内（在屏幕上可见）
      // SceneTransforms 会自动处理点在视锥体外的情况，返回 undefined
      // 但我们还需要检查是否在画布范围内
      const canvas = viewer.scene.canvas;
      if (
        screenPosition.x >= 0 &&
        screenPosition.x <= canvas.width &&
        screenPosition.y >= 0 &&
        screenPosition.y <= canvas.height
      ) {
        return screenPosition;
      }

      return null;
    } catch (error) {
      console.error("经纬度转屏幕坐标失败:", error);
      return null;
    }
  }

  /**
   * 将世界坐标转换为屏幕坐标（通用方法）
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian3} worldPosition - 世界坐标系中的位置
   * @returns {Cartesian2 | null} 返回屏幕坐标，如果转换失败或点在视锥体外则返回 null
   *
   * @应用场景
   * - 将任意3D实体位置转换为屏幕坐标
   * - 实现3D对象的屏幕空间效果
   * - 创建指向3D对象的UI指示器
   * - 检测3D对象是否在屏幕内
   * - 实现世界坐标到屏幕坐标的通用转换
   *
   * @example
   * ```typescript
   * const entityPosition = entity.position.getValue(viewer.clock.currentTime);
   * const screenPos = ScreenUtils.worldToScreen(viewer, entityPosition);
   * if (screenPos) {
   *   // 在实体位置显示屏幕提示
   * }
   * ```
   */
  static worldToScreen(
    viewer: Viewer,
    worldPosition: Cartesian3
  ): Cartesian2 | null {
    try {
      const screenPosition = SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        worldPosition
      );

      if (!screenPosition) {
        return null;
      }

      const canvas = viewer.scene.canvas;
      if (
        screenPosition.x >= 0 &&
        screenPosition.x <= canvas.width &&
        screenPosition.y >= 0 &&
        screenPosition.y <= canvas.height
      ) {
        return screenPosition;
      }

      return null;
    } catch (error) {
      console.error("世界坐标转屏幕坐标失败:", error);
      return null;
    }
  }

  /**
   * 获取鼠标位置对应的地球坐标
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian2} mousePosition - 鼠标位置
   * @returns {Cartesian3 | undefined} 返回地球坐标，如果未命中则返回 undefined
   *
   * @应用场景
   * - 实现3D场景中的精确点击交互
   * - 在模型表面放置标记
   * - 测量地形表面高度
   * - 实现拖拽模型功能
   * - 创建地形编辑工具
   * - 实现射线投射选择功能
   * - 游戏中的3D对象选择
   *
   * @example
   * ```typescript
   * const earthPosition = ScreenUtils.getEarthPosition(viewer, mousePosition);
   * if (earthPosition) {
   *   // 在地球位置放置标记
   * }
   * ```
   */
  static getEarthPosition(
    viewer: Viewer,
    mousePosition: Cartesian2
  ): Cartesian3 | undefined {
    const ray = viewer.camera.getPickRay(mousePosition);

    if (!ray) {
      return undefined;
    }

    return viewer.scene.globe.pick(ray, viewer.scene);
  }

  /**
   * 获取鼠标位置对应的3D实体
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian2} mousePosition - 鼠标位置
   * @returns {Entity | undefined} 返回命中的实体，如果未命中则返回 undefined
   *
   * @应用场景
   * - 实现实体选择功能
   * - 创建交互式信息提示
   * - 实现实体编辑功能
   * - 游戏中的对象选择
   * - 数据可视化中的交互
   *
   * @example
   * ```typescript
   * const pickedEntity = ScreenUtils.pickEntity(viewer, mousePosition);
   * if (pickedEntity) {
   *   console.log('选中的实体:', pickedEntity.id);
   * }
   * ```
   */
  static pickEntity(
    viewer: Viewer,
    mousePosition: Cartesian2
  ): any | undefined {
    const picked = viewer.scene.pick(mousePosition);
    return picked?.id;
  }

  /**
   * 检查屏幕坐标是否在画布范围内
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 地图查看器实例
   * @param {Cartesian2} screenPosition - 屏幕坐标
   * @returns {boolean} 如果在画布范围内返回 true，否则返回 false
   *
   * @应用场景
   * - 验证屏幕坐标的有效性
   * - 防止在画布外绘制UI元素
   * - 坐标边界检查
   *
   * @example
   * ```typescript
   * if (ScreenUtils.isInCanvas(viewer, screenPosition)) {
   *   // 在有效位置执行操作
   * }
   * ```
   */
  static isInCanvas(viewer: Viewer, screenPosition: Cartesian2): boolean {
    const canvas = viewer.scene.canvas;
    return (
      screenPosition.x >= 0 &&
      screenPosition.x <= canvas.width &&
      screenPosition.y >= 0 &&
      screenPosition.y <= canvas.height
    );
  }
}

export default ScreenUtils;
