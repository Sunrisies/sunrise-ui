import * as Cesium from "cesium";

/**
 * 飞行配置选项接口
 */
export interface JumpToPositionsOptions {
  /**
   * 视图高度相对于数据跨度的倍数。
   * 值越大，相机离地越远，视野范围越大。
   * @default 1.5
   */
  rangeFactor?: number;
  /**
   * 相机的最小飞行高度（米）。
   * 即使数据跨度很小，相机也不会低于这个高度。
   * @default 1000
   */
  minHeight?: number;
}

/**
 * 计算结果类型定义
 */
export interface JumpToPositionsResult {
  /** 计算是否成功 */
  success: boolean;
  /** 中心点经度 */
  longitude?: number;
  /** 中心点纬度 */
  latitude?: number;
  /** 计算出的相机高度 */
  height?: number;
  /** Cesium 笛卡尔坐标目标点（相机位置） */
  destination: Cesium.Cartesian3 | null;
}

/**
 * 计算一系列位置的中心点（包围盒中心），并返回计算出的相机目标位置。
 *
 * 该函数通过计算所有坐标点的经纬度极值，确定数据的包围盒。
 * 然后计算包围盒的几何中心作为相机观察的目标点。
 * 最后根据包围盒的跨度计算合适的相机高度，确保所有点都在视野内。
 *
 * @public
 * @author 朝阳
 * @version 1.0.6
 *
 * @memberof module:cesium/utils
 *
 * @example
 * // 示例 1: 基础用法（使用默认参数）
 * const positions = [
 *   [116.39, 39.9, 100], // 北京
 *   [116.40, 39.91, 100],
 *   [116.41, 39.92, 100]
 * ];
 * const result = jumpToPositions(positions, viewer);
 * if (result.success && result.destination) {
 *   viewer.camera.flyTo({ destination: result.destination });
 * }
 *
 * @example
 * // 示例 2: 自定义缩放比例和最小高度
 * const points = [
 *   [120.0, 30.0, 0],
 *   [120.1, 30.1, 1000]
 * ];
 * const options = {
 *   rangeFactor: 2.0, // 视野更远
 *   minHeight: 5000  // 最小高度 5000米
 * };
 * const result = jumpToPositions(points, viewer, options);
 * if (result.success && result.destination) {
 *   viewer.camera.flyTo({ destination: result.destination });
 * }
 *
 * @param positions - 坐标数组，格式为 `[longitude, latitude, height]` 的二维数组。
 * @param map - Cesium 地图查看器实例。
 * @param options - 可选配置项，包含 rangeFactor (缩放倍数) 和 minHeight (最小高度)。
 * @returns {JumpToPositionsResult} 包含计算出的中心点经纬度、高度和目标笛卡尔坐标的对象。
 */
export const jumpToPositions = (
  positions: number[][],
  viewer: Cesium.Viewer,
  options: JumpToPositionsOptions = {},
): JumpToPositionsResult => {
  // 解构配置，设置默认值
  const { rangeFactor = 1.5, minHeight = 1000 } = options;

  if (!positions || positions.length === 0 || !viewer) {
    console.warn(
      "[jumpToPositions] Invalid parameters: positions or viewer is missing.",
    );
    return {
      success: false,
      destination: null,
    };
  }

  //   // 1. 初始化经纬度极值数组
  //   const lons: number[] = [];
  //   const lats: number[] = [];

  //   // 2. 遍历所有点，提取经纬度
  //   for (const pos of positions) {
  //     if (pos && pos.length >= 2) {
  //       lons.push(pos[0]);
  //       lats.push(pos[1]);
  //     }
  //   }

  //   if (lons.length === 0) return { success: false, destination: null };

  //   // 3. 排序以找到最小值和最大值
  //   lons.sort((a, b) => a - b);
  //   lats.sort((a, b) => a - b);

  //   // 4. 计算包围盒的边界
  //   const minLon = lons[0];
  //   const maxLon = lons[lons.length - 1];
  //   const minLat = lats[0];
  //   const maxLat = lats[lats.length - 1];

  //   // 5. 计算中心点
  //   const centerLon = (minLon + maxLon) / 2;
  //   const centerLat = (minLat + maxLat) / 2;

  //   // 6. 计算包围盒的跨度
  //   const startCarto = Cesium.Cartographic.fromDegrees(minLon, minLat);
  //   const endCarto = Cesium.Cartographic.fromDegrees(maxLon, maxLat);

  //   const geodesic = new Cesium.EllipsoidGeodesic();
  //   geodesic.setEndPoints(startCarto, endCarto);
  //   const surfaceDistance = geodesic.surfaceDistance;

  //   // 7. 确定相机位置
  //   // 高度 = 跨度 * 倍数，但必须大于最小高度
  //   const cameraHeight = Math.max(surfaceDistance * rangeFactor, minHeight);

  //   // 将中心点和计算出的高度转换为笛卡尔坐标
  //   const destination = Cesium.Cartesian3.fromDegrees(
  //     centerLon,
  //     centerLat,
  //     cameraHeight,
  //   );

  // 1. 提取所有有效经纬度
  const lons: number[] = [];
  const lats: number[] = [];
  for (const pos of positions) {
    if (pos && pos.length >= 2) {
      lons.push(pos[0]);
      lats.push(pos[1]);
    }
  }

  if (lons.length === 0) {
    return { success: false, destination: null };
  }

  // 2. 获取经纬度极值
  lons.sort((a, b) => a - b);
  lats.sort((a, b) => a - b);
  const minLon = lons[0];
  const maxLon = lons[lons.length - 1];
  const minLat = lats[0];
  const maxLat = lats[lats.length - 1];

  // 3. 计算中心点
  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;

  // 4. 构建矩形包围盒（弧度）
  const rectangle = Cesium.Rectangle.fromDegrees(
    minLon,
    minLat,
    maxLon,
    maxLat,
  );

  // 5. 计算东西向最大距离（取矩形上边界处的经度跨度，以覆盖最大可能距离）
  const width = Cesium.Rectangle.computeWidth(rectangle); // 弧度
  const eastDistance = width * Cesium.Ellipsoid.WGS84.maximumRadius; // 近似米

  // 6. 计算南北向最大距离（纬度跨度固定转换为米）
  const heightRad = Cesium.Rectangle.computeHeight(rectangle); // 弧度
  const northDistance = heightRad * Cesium.Ellipsoid.WGS84.maximumRadius;

  // 7. 取东西、南北跨度中的较大者作为基准跨度
  const maxSpan = Math.max(eastDistance, northDistance);

  // 8. 计算相机高度
  const cameraHeight = Math.max(maxSpan * rangeFactor, minHeight);

  // 9. 转换为笛卡尔坐标（相机位置：正对中心点上方 cameraHeight 米）
  const destination = Cesium.Cartesian3.fromDegrees(
    centerLon,
    centerLat,
    cameraHeight,
  );

  return {
    longitude: centerLon,
    latitude: centerLat,
    height: cameraHeight,
    destination,
    success: true,
  };
};
