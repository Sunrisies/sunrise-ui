import {
  Cartesian3,
  Cartographic,
  HeadingPitchRoll,
  Matrix4,
  Model,
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

  /**
   * 根据模型ID在场景中查找对应的模型实例
   * @public
   * @static
   * @param {FindModelByIdType} params - 包含查找模型所需参数的对象
   * @returns {Model | null} 如果找到匹配的模型，则返回该模型实例；否则返回 null
   *
   * @应用场景
   * - 在复杂场景中快速定位特定模型
   * - 实现模型的选择和编辑功能
   * - 资产管理系统中查找特定设备
   * - 游戏中的物体交互和状态管理
   * - 建筑信息模型(BIM)中的构件查找
   * - 模拟训练中的实体管理
   * - 动态更新特定模型的属性
   *
   * @example
   * ```typescript
   * // 初始化查看器
   * const viewer = new Viewer('cesiumContainer');
   *
   * // 添加模型到场景
   * const model = await Model.fromGltfAsync({
   *   url: './assets/models/aircraft.glb',
   *   id: 'my-aircraft'
   * });
   * viewer.scene.primitives.add(model);
   *
   * // 通过ID查找模型
   * const foundModel = ModelUtils.findById({
   *   viewer: viewer,
   *   id: 'my-aircraft'
   * });
   *
   * if (foundModel) {
   *   console.log('找到模型:', foundModel);
   *   // 对模型进行操作...
   * }
   * ```
   */
  static findById({ viewer, id }: FindModelByIdType): Model | null {
    const primitives = viewer.scene.primitives;

    for (let i = 0; i < primitives.length; ++i) {
      const primitive = primitives.get(i);

      if (primitive instanceof Model && primitive.id === id) {
        return primitive;
      }
    }

    return null;
  }

  /**
   * 查找所有模型实例
   * @public
   * @static
   * @param {Viewer} viewer - Cesium 场景查看器实例
   * @returns {Model[]} 返回场景中所有的模型实例数组
   *
   * @应用场景
   * - 场景管理和清理操作
   * - 批量更新模型属性
   * - 统计场景中的模型数量
   * - 实现全选/全不选功能
   * - 场景导出前的数据收集
   * - 性能分析和优化
   *
   * @example
   * ```typescript
   * const allModels = ModelUtils.findAllModels(viewer);
   * console.log(`场景中共有 ${allModels.length} 个模型`);
   * ```
   */
  static findAllModels(viewer: Viewer): Model[] {
    const models: Model[] = [];
    const primitives = viewer.scene.primitives;

    for (let i = 0; i < primitives.length; ++i) {
      const primitive = primitives.get(i);

      if (primitive instanceof Model) {
        models.push(primitive);
      }
    }

    return models;
  }

  /**
   * 设置模型可见性
   * @public
   * @static
   * @param {Model} model - 模型实例
   * @param {boolean} visible - 是否可见
   * @returns {void} 无返回值
   *
   * @应用场景
   * - 实现图层控制功能
   * - 创建模型的显示/隐藏切换
   * - 在复杂场景中减少视觉干扰
   * - 实现模型的渐进式加载
   * - 创建教学演示的步骤控制
   * - 根据用户权限控制模型可见性
   *
   * @example
   * ```typescript
   * const model = ModelUtils.findById({ viewer, id: 'my-model' });
   * if (model) {
   *   ModelUtils.setVisibility(model, false); // 隐藏模型
   * }
   * ```
   */
  static setVisibility(model: Model, visible: boolean): void {
    model.show = visible;
  }
}

export default ModelUtils;
