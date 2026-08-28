/**
 * @file 坐标系转换工具
 * @description 国家测量局坐标（火星坐标，GCJ02）与WGS84坐标系之间的转换工具
 * @packageDocumentation
 * @module map/coordinate
 * @public
 *
 * @remarks
 * 实现WGS84坐标系与GCJ02坐标系之间的双向转换算法，包含：
 * - 中国境内坐标偏移计算
 * - 坐标边界校验
 * - 参数有效性验证
 *
 * 注意：转换算法基于国家测绘局公开的偏移参数，不可用于高精度测绘场景
 */

/** 圆周率转换系数 */
const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
/** 标准圆周率 */
const PI = 3.1415926535897932384626;
/** WGS84椭球长半轴 */
const a = 6378245.0;
/** WGS84椭球第一偏心率平方 */
const ee = 0.00669342162296594323;

/**
 * 坐标校验装饰器工厂函数
 * @description 创建一个用于验证坐标参数的方法装饰器
 * @public
 * @func 坐标校验装饰器
 * @memberof module:map/coordinate
 *
 * @param min - 坐标最小值
 * @param max - 坐标最大值
 * @returns 方法装饰器
 *
 * @example
 * ```typescript
 * class Example {
 *   @validateCoordinates(-180, 180)
 *   static process(lng: number, lat: number) {
 *     // 处理坐标
 *   }
 * }
 * ```
 */
function validateCoordinates(min: number, max: number) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (lng: number, lat: number) {
      if (typeof lng !== "number" || typeof lat !== "number") {
        throw new Error("坐标必须为数字类型");
      }
      if (lng < min || lng > max || lat < min || lat > max) {
        throw new Error(`坐标值应在${min}到${max}之间`);
      }
      return originalMethod.apply(this, [lng, lat]);
    };
    return descriptor;
  };
}

/**
 * 判断坐标是否在中国境外
 * @description 根据中国边界范围判断坐标是否在境外
 * @public
 * @func 判断坐标是否在中国境外
 * @memberof module:map/out_of_china
 *
 * @param lng - 经度（WGS84坐标系）
 * @param lat - 纬度（WGS84坐标系）
 * @returns 是否在境外（true表示境外坐标，不进行转换）
 *
 * @example
 * ```typescript
 * // 境外坐标示例
 * out_of_china(135.0, 35.0) // true
 * // 境内坐标示例
 * out_of_china(116.4074, 39.9042) // false
 * ```
 */
export function out_of_china(lng: number, lat: number):Boolean {
  return (
    lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
  );
}

/**
 * 纬度转换辅助函数
 * @description 计算纬度偏移量的内部函数
 * @private
 * @func 纬度转换
 * @memberof module:map/coordinate
 *
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 纬度偏移量
 */
const transformLat = (lng: number, lat: number) => {
  var ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
};

/**
 * 经度转换辅助函数
 * @description 计算经度偏移量的内部函数
 * @private
 * @func 经度转换
 * @memberof module:map/coordinate
 *
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 经度偏移量
 */
const transformLng = (lng: number, lat: number) => {
  var ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
};

/**
 * 坐标系转换工具类
 * @description 提供WGS84和GCJ02坐标系之间的转换功能
 * @public
 * @func 坐标系转换
 * @memberof module:map/CoordinateTransform
 *
 *
 * @example
 * ```typescript
 * const [gcjLng, gcjLat] = wgs84ToGcj02(114.123, 22.456)
 * ```
 *
 * @example
 * ```typescript
 * const [wgsLng, wgsLat] = gcj02ToWgs84(114.123, 22.456)
 * ```
 */
export class CoordinateTransform {
  /**
   * 将WGS84坐标系转换为GCJ02火星坐标系
   * @description 将国际标准坐标系转换为中国国内使用的火星坐标系
   * @public
   * @func WGS84转GCJ02
   * @memberof module:map/coordinate
   *
   * @param lng - WGS84经度，范围-180到180
   * @param lat - WGS84纬度，范围-90到90
   * @returns [经度, 纬度] 格式的GCJ02坐标数组
   *
   * @throws {Error} 当坐标超出范围或类型错误时抛出
   *
   * @example
   * ```typescript
   * const [gcjLng, gcjLat] = wgs84ToGcj02(114.123, 22.456)
   * ```
   */
  @validateCoordinates(-180, 180)
  static wgs84ToGcj02(lng: number, lat: number): [number, number] {
    const baseLng = lng - 105.0;
    const baseLat = lat - 35.0;

    // 计算纬度偏移量
    const latOffset = transformLat(baseLng, baseLat);
    // 计算经度偏移量
    const lngOffset = transformLng(baseLng, baseLat);

    // 地理弧度计算
    const radianLat = (lat / 180.0) * PI;
    const sinLat = Math.sin(radianLat);
    const eccentricityFactor = 1 - ee * sinLat * sinLat; // 偏心率因子
    const sqrtEccentricity = Math.sqrt(eccentricityFactor);

    // 修正后的偏移量
    const adjustedLatOffset =
      (latOffset * 180.0) /
      (((a * (1 - ee)) / (eccentricityFactor * sqrtEccentricity)) * PI);
    const adjustedLngOffset =
      (lngOffset * 180.0) / ((a / sqrtEccentricity) * Math.cos(radianLat) * PI);

    // 计算火星坐标系结果
    const marsLat = lat + adjustedLatOffset;
    const marsLng = lng + adjustedLngOffset;

    return [marsLng, marsLat];
  }

  /**
   * 将GCJ02火星坐标系转换为WGS84坐标系
   * @description 将中国国内使用的火星坐标系转换为国际标准坐标系
   * @public
   * @func GCJ02转WGS84
   * @memberof module:map/coordinate
   *
   * @param lng - GCJ02经度，范围-180到180
   * @param lat - GCJ02纬度，范围-90到90
   * @returns [经度, 纬度] 格式的WGS84坐标数组
   *
   * @throws {Error} 当坐标超出范围或类型错误时抛出
   *
   * @example
   * ```typescript
   * const [wgsLng, wgsLat] = gcj02ToWgs84(114.123, 22.456)
   * ```
   */
  @validateCoordinates(-180, 180)
  static gcj02ToWgs84(lng: number, lat: number): [number, number] {
    // 计算初始偏移量
    const latOffset = transformLat(lng - 105.0, lat - 35.0);
    const lngOffset = transformLng(lng - 105.0, lat - 35.0);

    // 地理弧度计算
    const radianLat = (lat / 180.0) * PI;
    const sinLat = Math.sin(radianLat);
    const eccentricityFactor = 1 - ee * sinLat * sinLat;
    const sqrtEccentricity = Math.sqrt(eccentricityFactor);

    // 修正后的偏移量
    const adjustedLatOffset =
      (latOffset * 180.0) /
      (((a * (1 - ee)) / (eccentricityFactor * sqrtEccentricity)) * PI);
    const adjustedLngOffset =
      (lngOffset * 180.0) / ((a / sqrtEccentricity) * Math.cos(radianLat) * PI);

    // 计算中间火星坐标
    const marsLat = lat + adjustedLatOffset;
    const marsLng = lng + adjustedLngOffset;

    // 通过反向计算得到WGS84坐标
    return [lng * 2 - marsLng, lat * 2 - marsLat];
  }
}
