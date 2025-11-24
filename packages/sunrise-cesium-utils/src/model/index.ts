import {
  Cartesian3,
  Cartographic,
  HeadingPitchRoll,
  Matrix4,
  sampleTerrain,
  Transforms,
  Viewer,
} from "cesium";
import type { CalculateLocationType, FindModelByIdType } from "../types";

/**
 * 模型工具类
 * @public
 * @author 朝阳
 * @version 1.0.0
 *
 * @memberof module:cesium/utils
 */
export class ModelUtils {
  /**
   * 计算位置矩阵，根据传入的经纬度和地形数据获取新的位置矩阵
   * @public
   * @static
   * @param {CalculateLocationType} params - 包含计算位置矩阵所需参数的对象
   * @returns {Promise<Matrix4>} 返回一个 4x4 变换矩阵，可用于定位和旋转 3D 对象
   * @throws {Error} 当地形采样失败或坐标转换出错时抛出错误
   *
   * @应用场景
   * - 在数字孪生项目中精确放置建筑模型
   * - 城市规划可视化中定位基础设施
   * - 军事模拟中部署装备和单位
   * - 游戏开发中生成场景物体
   * - 考古重建中复原历史建筑
   * - 电力线路规划中放置杆塔设备
   * - 林业管理中定位监测设备
   *
   * @example
   * ```typescript
   * // 创建地形提供者
   * const terrainProvider = await createWorldTerrain();
   *
   * // 计算北京天安门的位置矩阵
   * const matrix = await ModelUtils.calculateLocationMatrix({
   *   longitude: 116.3974,
   *   latitude: 39.9093,
   *   heading: 45, // 东北方向
   *   terrainProvider
   * });
   *
   * // 将矩阵应用到模型
   * model.modelMatrix = matrix;
   * ```
   */
  static async calculateLocationMatrix({
    longitude,
    latitude,
    heading = 0,
    terrainProvider,
  }: CalculateLocationType): Promise<Matrix4> {
    try {
      // 创建坐标点并采样地形高度
      const positions = [Cartographic.fromDegrees(longitude, latitude)];
      const result = await sampleTerrain(terrainProvider, 11, positions);
      const height = result[0].height;

      console.log("地形高度:", height);

      // 创建原点坐标（在地形高度基础上增加2米偏移）
      const origin = Cartesian3.fromDegrees(longitude, latitude, height + 2);

      // 创建方位角、俯仰角、滚动角
      const hpr = HeadingPitchRoll.fromDegrees(heading, 0, 0);

      // 生成变换矩阵
      const matrix = Transforms.headingPitchRollToFixedFrame(origin, hpr);
      return matrix;
    } catch (error) {
      console.error("计算位置矩阵时发生错误:", error);
      throw new Error(
        `计算位置矩阵失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    }
  }
}

export default ModelUtils;
