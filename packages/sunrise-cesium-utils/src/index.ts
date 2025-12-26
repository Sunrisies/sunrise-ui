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

import CameraUtils from "./camera";
import CoordinateUtils from "./coordinate";
import ScreenUtils from "./screen";
import ModelUtils from "./model";
import { useCesiumCache, useTileCache } from "./cache";
// 导出所有工具类
export { CameraUtils } from "./camera";
export { CoordinateUtils } from "./coordinate";
export { ScreenUtils } from "./screen";
export { ModelUtils } from "./model";
export { useCesiumCache, useTileCache } from "./cache";

// 导出类型
export type {
  CalculateLocationType,
  FindModelByIdType,
  LonLatCoordinate,
  FlyToOptions,
} from "./types";

// 默认导出所有工具
export default {
  CameraUtils,
  CoordinateUtils,
  ScreenUtils,
  ModelUtils,
  useCesiumCache,
  useTileCache,
};
