/**
 * 文件大小格式化工具
 * @public
 * @func 文件大小格式化工具
 * @memberof module:common/format
 * @remarks
 * 智能格式化文件大小，支持以下特性：
 * - 支持二进制（1024）和十进制（1000）计算方式
 * - 支持国际化数字和单位显示
 * - 智能处理数字精度
 * - 支持自定义单位系统
 * - 处理极限值和边界情况
 *
 * @param bytes - 文件大小（字节数）
 * @param options - 格式化配置选项
 * @param options.base - 进制基数（1024为二进制，1000为十进制）
 * @param options.digits - 小数位数（null为自动判断）
 * @param options.locale - 数字本地化设置，支持字符串或字符串数组
 * @param options.units - 自定义单位数组，长度必须与默认单位系统一致
 * @param options.useIECUnits - 是否使用IEC标准单位（KiB等）
 * @param options.errorMessages - 错误信息本地化配置
 *
 * @returns 格式化后的文件大小字符串，格式为"数字 单位"
 * @throws {TypeError} 当输入参数无效时抛出
 * @throws {RangeError} 当输入值超出范围时抛出
 *
 * @example
 * ```typescript
 * // 基本用法
 * formatBytes(1024) // "1 KB"
 *
 * // 使用二进制单位
 * formatBytes(1024, { base: 1024, useIECUnits: true }) // "1 KiB"
 *
 * // 本地化显示（中文）
 * formatBytes(1024, {
 *   locale: 'zh-CN',
 *   units: ['字节', 'KB', 'MB', 'GB'],
 *   errorMessages: {
 *     invalidNumber: '必须传入有效数字',
 *     negativeValue: '文件大小不能为负数'
 *   }
 * }) // "1 KB"
 *
 * // 自定义精度
 * formatBytes(1234, { digits: 2 }) // "1.21 KB"
 *
 * // 处理极限值
 * formatBytes(0) // "0 B"
 * formatBytes(Number.MAX_SAFE_INTEGER) // 最大可表示值
 * ```
 */
export function formatBytes(
  bytes: number,
  options?: {
    /**
     * 进制基数设置
     * @description 1024为二进制（1KB = 1024B），1000为十进制（1KB = 1000B）
     * @defaultValue 1024
     */
    base?: 1024 | 1000;

    /**
     * 小数位数设置
     * @description null表示自动判断：整数显示0位小数，其他显示2位小数
     * @defaultValue null
     */
    digits?: number | null;

    /**
     * 本地化设置
     * @description 支持单个语言代码或语言代码数组
     * @defaultValue 'en'
     * @example 'zh-CN' | ['en', 'zh-CN']
     */
    locale?: string | string[];

    /**
     * 自定义单位数组
     * @description 完全替换默认单位系统，数组长度必须与默认系统一致
     * @defaultValue []
     * @example ['字节', 'KB', 'MB', 'GB', 'TB']
     */
    units?: string[];

    /**
     * IEC标准单位开关
     * @description true时使用KiB、MiB等IEC标准单位
     * @defaultValue false
     */
    useIECUnits?: boolean;

    /**
     * 错误信息本地化配置
     * @description 自定义错误提示信息
     * @defaultValue undefined
     */
    errorMessages?: {
      /** 无效数字的错误提示 */
      invalidNumber?: string;
      /** 负数的错误提示 */
      negativeValue?: string;
    };
  }
): string {
  // 默认错误消息
  const defaultErrorMessages = {
    invalidNumber: "Invalid number provided",
    negativeValue: "File size cannot be negative",
  };

  // 合并配置项
  const {
    base = 1024,
    digits = null,
    locale = "en",
    units = [],
    useIECUnits = false,
    errorMessages = defaultErrorMessages,
  } = options || {};
  if (typeof bytes !== "number" || isNaN(bytes) || !isFinite(bytes)) {
    throw new TypeError(
      errorMessages.invalidNumber || defaultErrorMessages.invalidNumber
    );
  }
  // 参数校验
  if (typeof bytes !== "number" || isNaN(bytes)) {
    throw new TypeError(
      errorMessages.invalidNumber || defaultErrorMessages.invalidNumber
    );
  }
  if (bytes < 0) {
    throw new RangeError(
      errorMessages.negativeValue || defaultErrorMessages.negativeValue
    );
  }

  // 处理极限值
  if (bytes === 0) {
    return `0 ${units.length > 0 ? units[0] : useIECUnits ? "Bytes" : "B"}`;
  }

  // 准备单位体系
  const defaultUnits = useIECUnits
    ? ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    : ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const unitList = units.length > 0 ? [...units] : [...defaultUnits];

  // 计算合适单位
  let unitIndex = 0;
  let size = Math.abs(bytes);

  // 防止超出最大单位
  const maxUnitIndex = unitList.length - 1;
  while (size >= base && unitIndex < maxUnitIndex) {
    size /= base;
    unitIndex++;
  }

  // 智能确定小数位数
  const precision =
    typeof digits === "number"
      ? digits
      : size >= 100 || size % 1 === 0 // 添加整数判断
      ? 0
      : 2;

  // 本地化数字格式
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(size);

  return `${formatted} ${unitList[unitIndex]}`;
}
