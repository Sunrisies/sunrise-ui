/**
 * Cesium 工具库
 * @packageDocumentation
 * @module cesium/utils
 * @author 朝阳
 * @version 1.0.0
 *
 * 提供 Cesium 相关的实用工具函数，包括：
 * - 相机控制
 * - 坐标转换
 * - 屏幕坐标转换
 * - 模型操作
 */

import CameraUtils from "./camera/index.js";
import CoordinateUtils from "./coordinate/index.js";
import ScreenUtils from "./screen/index.js";
import ModelUtils from "./model/index.js";
import { useCesiumCache } from "./cache/index.js";
// 导出所有工具类
export { CameraUtils } from "./camera/index.js";
export { CoordinateUtils } from "./coordinate/index.js";
export { ScreenUtils } from "./screen/index.js";
export { ModelUtils } from "./model/index.js";
export { useCesiumCache } from "./cache/index.js";

// 导出类型
export type {
  CalculateLocationType,
  FindModelByIdType,
  LonLatCoordinate,
  FlyToOptions,
} from "./types/index.js";

// 默认导出所有工具
export default {
  CameraUtils,
  CoordinateUtils,
  ScreenUtils,
  ModelUtils,
  useCesiumCache,
};
