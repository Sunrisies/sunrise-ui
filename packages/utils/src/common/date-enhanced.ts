/**
 * 日期增强工具函数集合
 * @module date-enhanced
 */

/**
 * 日期计算单位类型
 */
export type DateUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second";

/**
 * 日期计算配置选项
 */
export interface DateCalculationOptions {
  /**
   * 要加减的年数
   */
  years?: number;
  /**
   * 要加减的月数
   */
  months?: number;
  /**
   * 要加减的周数
   */
  weeks?: number;
  /**
   * 要加减的天数
   */
  days?: number;
  /**
   * 要加减的小时数
   */
  hours?: number;
  /**
   * 要加减的分钟数
   */
  minutes?: number;
  /**
   * 要加减的秒数
   */
  seconds?: number;
}

/**
 * 日期比较结果类型
 */
export interface DateComparison {
  /**
   * 是否相同
   */
  isSame: boolean;
  /**
   * 是否在之前
   */
  isBefore: boolean;
  /**
   * 是否在之后
   */
  isAfter: boolean;
  /**
   * 时间差（毫秒）
   */
  diff: number;
  /**
   * 相对描述
   */
  relative: string;
}

/**
 * 日期范围配置
 */
export interface DateRangeOptions {
  /**
   * 步长单位
   */
  unit?: DateUnit;
  /**
   * 步长数值
   */
  step?: number;
  /**
   * 包含结束日期
   */
  includeEnd?: boolean;
}

/**
 * 日期格式化配置
 */
export interface DateFormatOptions {
  /**
   * 语言环境
   */
  locale?: string;
  /**
   * 是否使用24小时制
   */
  use24Hour?: boolean;
  /**
   * 是否显示毫秒
   */
  showMilliseconds?: boolean;
  /**
   * 自定义格式化模板
   */
  template?: string;
}

/**
 * 时区配置
 */
export interface TimezoneOptions {
  /**
   * 目标时区（如：'Asia/Shanghai', 'America/New_York'）
   */
  timezone?: string;
  /**
   * 是否保留原始时间（仅改变显示）
   */
  keepLocalTime?: boolean;
}

/**
 * 工作日计算配置
 */
export interface WorkdayOptions {
  /**
   * 工作日（1-7，周一到周日）
   */
  workdays?: number[];
  /**
   * 节假日列表（日期字符串）
   */
  holidays?: string[];
}

/**
 * 日期解析增强配置
 */
export interface ParseOptions {
  /**
   * 严格模式，是否验证日期有效性
   */
  strict?: boolean;
  /**
   * 期望的输入格式优先级
   */
  preferredFormats?: string[];
  /**
   * 时区信息
   */
  timezone?: string;
}

/**
 * 日期计算 - 加减日期
 * @description 对日期进行加减运算，支持年、月、周、天、小时、分钟、秒
 * @param date 原始日期
 * @param options 计算配置
 * @returns 计算后的新日期
 *
 * @example
 * ```typescript
 * // 基本用法
 * addDays(new Date('2024-01-01'), { days: 5 }) // 2024-01-06
 *
 * // 复杂计算
 * addDays(new Date('2024-01-01'), {
 *   months: 1,
 *   days: 2,
 *   hours: 3
 * })
 *
 * // 负数表示减法
 * addDays(new Date('2024-01-01'), { days: -1 }) // 2023-12-31
 * ```
 */
export function addDays(
  date: Date | number | string,
  options: DateCalculationOptions
): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const result = new Date(d);

  // 处理年份
  if (options.years) {
    result.setFullYear(result.getFullYear() + options.years);
  }

  // 处理月份 - 使用更可靠的逻辑
  if (options.months) {
    const originalDay = result.getDate();
    const originalMonth = result.getMonth();
    const originalYear = result.getFullYear();

    // 计算目标月份
    const targetMonth = originalMonth + options.months;
    const targetYear = originalYear + Math.floor(targetMonth / 12);
    const adjustedMonth = targetMonth % 12;

    // 获取目标月份的天数
    const firstDayOfNextMonth = new Date(targetYear, adjustedMonth + 1, 1);
    const lastDayOfTargetMonth = new Date(
      firstDayOfNextMonth.getTime() - 86400000
    );
    const daysInTargetMonth = lastDayOfTargetMonth.getDate();

    // 使用原始日期，但如果超过了目标月份的天数，则使用最后一天
    const newDay = Math.min(originalDay, daysInTargetMonth);

    result.setFullYear(targetYear, adjustedMonth, newDay);
  }

  // 处理周、天、小时、分钟、秒
  const milliseconds =
    (options.weeks || 0) * 7 * 24 * 60 * 60 * 1000 +
    (options.days || 0) * 24 * 60 * 60 * 1000 +
    (options.hours || 0) * 60 * 60 * 1000 +
    (options.minutes || 0) * 60 * 1000 +
    (options.seconds || 0) * 1000;

  result.setTime(result.getTime() + milliseconds);

  return result;
}

/**
 * 日期比较
 * @description 比较两个日期的相对关系
 * @param date1 第一个日期
 * @param date2 第二个日期（默认为当前时间）
 * @returns 比较结果对象
 *
 * @example
 * ```typescript
 * const result = compareDates('2024-01-01', '2024-01-02');
 * console.log(result.isBefore); // true
 * console.log(result.diff); // -86400000 (毫秒)
 * console.log(result.relative); // "1天前"
 * ```
 */
export function compareDates(
  date1: Date | number | string,
  date2: Date | number | string = new Date()
): DateComparison {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const diff = d1.getTime() - d2.getTime();
  const isSame = diff === 0;
  const isBefore = diff < 0;
  const isAfter = diff > 0;

  // 计算相对描述
  const absDiff = Math.abs(diff);
  let relative = "";

  if (absDiff < 1000) {
    relative = "刚刚";
  } else if (absDiff < 60000) {
    const seconds = Math.floor(absDiff / 1000);
    relative = `${seconds}秒${isAfter ? "后" : "前"}`;
  } else if (absDiff < 3600000) {
    const minutes = Math.floor(absDiff / 60000);
    relative = `${minutes}分钟${isAfter ? "后" : "前"}`;
  } else if (absDiff < 86400000) {
    const hours = Math.floor(absDiff / 3600000);
    relative = `${hours}小时${isAfter ? "后" : "前"}`;
  } else if (absDiff < 604800000) {
    const days = Math.floor(absDiff / 86400000);
    relative = `${days}天${isAfter ? "后" : "前"}`;
  } else if (absDiff < 2592000000) {
    const weeks = Math.floor(absDiff / 604800000);
    relative = `${weeks}周${isAfter ? "后" : "前"}`;
  } else if (absDiff < 31536000000) {
    const months = Math.floor(absDiff / 2592000000);
    relative = `${months}个月${isAfter ? "后" : "前"}`;
  } else {
    const years = Math.floor(absDiff / 31536000000);
    relative = `${years}年${isAfter ? "后" : "前"}`;
  }

  return {
    isSame,
    isBefore,
    isAfter,
    diff,
    relative,
  };
}

/**
 * 日期范围生成
 * @description 生成两个日期之间的日期数组
 * @param start 开始日期
 * @param end 结束日期
 * @param options 配置选项
 * @returns 日期数组
 *
 * @example
 * ```typescript
 * // 生成一周的日期
 * dateRange('2024-01-01', '2024-01-07');
 *
 * // 按周生成
 * dateRange('2024-01-01', '2024-01-31', { unit: 'week', step: 1 });
 *
 * // 不包含结束日期
 * dateRange('2024-01-01', '2024-01-05', { includeEnd: false });
 * ```
 */
export function dateRange(
  start: Date | number | string,
  end: Date | number | string,
  options: DateRangeOptions = {}
): Date[] {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const { unit = "day", step = 1, includeEnd = true } = options;

  const result: Date[] = [];
  let current = new Date(startDate);

  // 计算步长的毫秒数
  const stepMs =
    {
      year: 31536000000,
      month: 2592000000,
      week: 604800000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    }[unit] * step;

  const endMs = endDate.getTime();
  const compareFn = includeEnd
    ? (current: Date) => current.getTime() <= endMs
    : (current: Date) => current.getTime() < endMs;

  while (compareFn(current)) {
    result.push(new Date(current));
    current = new Date(current.getTime() + stepMs);
  }

  return result;
}

/**
 * 日期格式化增强
 * @description 支持更多格式的日期格式化
 * @param date 日期
 * @param options 格式化选项
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * // 标准格式
 * formatDate(new Date(), { template: 'YYYY-MM-DD HH:mm:ss' })
 *
 * // 中文格式
 * formatDate(new Date(), {
 *   template: 'YYYY年MM月DD日 HH时mm分ss秒',
 *   locale: 'zh-CN'
 * })
 *
 * // 12小时制
 * formatDate(new Date(), {
 *   template: 'YYYY-MM-DD hh:mm:ss a',
 *   use24Hour: false
 * })
 *
 * // 包含毫秒
 * formatDate(new Date(), {
 *   template: 'YYYY-MM-DD HH:mm:ss.SSS',
 *   showMilliseconds: true
 * })
 * ```
 */
export function formatDate(
  date: Date | number | string,
  options: DateFormatOptions = {}
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const {
    locale = "zh-CN",
    use24Hour = true,
    showMilliseconds = false,
    template = "YYYY-MM-DD HH:mm:ss",
  } = options;

  // 获取日期组件
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milliseconds = d.getMilliseconds();

  // 处理小时格式
  let displayHours = hours;
  let ampm = "";
  if (!use24Hour) {
    ampm = hours >= 12 ? "PM" : "AM";
    displayHours = hours % 12 || 12;
  }

  // 格式化函数
  const pad = (num: number, length = 2) => num.toString().padStart(length, "0");
  const formatMap: Record<string, string> = {
    YYYY: year.toString(),
    YY: year.toString().slice(-2),
    MM: pad(month),
    M: month.toString(),
    DD: pad(day),
    D: day.toString(),
    HH: pad(displayHours),
    H: displayHours.toString(),
    hh: pad(displayHours),
    h: displayHours.toString(),
    mm: pad(minutes),
    m: minutes.toString(),
    ss: pad(seconds),
    s: seconds.toString(),
    SSS: pad(milliseconds, 3),
    S: milliseconds.toString(),
    a: ampm,
    A: ampm.toUpperCase(),
  };

  // 中文格式支持
  if (locale === "zh-CN") {
    formatMap["年"] = "年";
    formatMap["月"] = "月";
    formatMap["日"] = "日";
    formatMap["时"] = "时";
    formatMap["分"] = "分";
    formatMap["秒"] = "秒";
  }

  // 替换模板
  let result = template;
  for (const [key, value] of Object.entries(formatMap)) {
    result = result.replace(new RegExp(key, "g"), value);
  }

  return result;
}

/**
 * 时区处理
 * @description 将日期转换到指定时区
 * @param date 日期
 * @param options 时区配置
 * @returns 转换后的日期（或字符串）
 *
 * @example
 * ```typescript
 * // 转换到纽约时区
 * toTimezone(new Date(), { timezone: 'America/New_York' })
 *
 * // 转换为指定时区的字符串
 * toTimezone('2024-01-01T12:00:00Z', {
 *   timezone: 'Asia/Shanghai',
 *   keepLocalTime: false
 * })
 * ```
 */
export function toTimezone(
  date: Date | number | string,
  options: TimezoneOptions = {}
): Date | string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    keepLocalTime = true,
  } = options;

  try {
    // 使用 Intl.DateTimeFormat 获取时区信息
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    if (keepLocalTime) {
      // 保持本地时间，仅改变时区显示
      const parts = formatter.formatToParts(d);
      const timeStr = parts
        .filter((p) =>
          ["year", "month", "day", "hour", "minute", "second"].includes(p.type)
        )
        .map((p) => p.value)
        .join("-")
        .replace(/(\d{2})-(\d{2})-(\d{2})/, "$1-$2-$3T$4:$5:$6");

      return new Date(timeStr + "Z");
    } else {
      // 转换为指定时区的本地时间
      const utc = d.getTime() + d.getTimezoneOffset() * 60000;
      const targetTime = new Date(utc + 3600000 * getTimezoneOffset(timezone));
      return targetTime;
    }
  } catch (error) {
    // 如果不支持指定时区，返回原始日期
    console.warn(`不支持的时区: ${timezone}, 返回原始日期`);
    return d;
  }
}

/**
 * 工作日计算
 * @description 计算从指定日期开始的N个工作日后的日期
 * @param startDate 开始日期
 * @param workdays 工作日数量
 * @param options 配置选项
 * @returns 目标日期
 *
 * @example
 * ```typescript
 * // 计算5个工作日后
 * addWorkdays(new Date('2024-01-01'), 5)
 *
 * // 自定义工作日（周一到周五）
 * addWorkdays(new Date('2024-01-01'), 5, {
 *   workdays: [1, 2, 3, 4, 5],
 *   holidays: ['2024-01-01', '2024-12-25']
 * })
 * ```
 */
export function addWorkdays(
  startDate: Date | number | string,
  workdays: number,
  options: WorkdayOptions = {}
): Date {
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const { workdays: workdayList = [1, 2, 3, 4, 5], holidays = [] } = options;

  // 标准化节假日格式
  const holidaySet = new Set(
    holidays.map((h) => new Date(h).toISOString().split("T")[0])
  );

  let result = new Date(start);
  let count = 0;

  while (count < workdays) {
    result.setDate(result.getDate() + 1);

    const dayOfWeek = result.getDay() || 7; // 1-7, 周日为7
    const dateStr = result.toISOString().split("T")[0];

    // 检查是否是工作日且不是节假日
    if (workdayList.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
      count++;
    }
  }

  return result;
}

/**
 * 日期解析增强
 * @description 支持多种格式的日期解析
 * @param dateStr 日期字符串
 * @param options 解析选项
 * @returns 解析后的日期
 *
 * @example
 * ```typescript
 * // 多种格式支持
 * parseDateEnhanced('2024-01-01')
 * parseDateEnhanced('2024/01/01')
 * parseDateEnhanced('01-01-2024')
 * parseDateEnhanced('2024年01月01日')
 * parseDateEnhanced('January 1, 2024')
 *
 * // 严格模式
 * parseDateEnhanced('invalid', { strict: true }) // 抛出错误
 *
 * // 指定时区
 * parseDateEnhanced('2024-01-01 12:00:00', { timezone: 'Asia/Shanghai' })
 * ```
 */
export function parseDateEnhanced(
  dateStr: string | number | Date,
  options: ParseOptions = {}
): Date {
  const { strict = false, preferredFormats = [], timezone } = options;

  // 如果已经是Date对象
  if (dateStr instanceof Date) {
    if (strict && isNaN(dateStr.getTime())) {
      throw new TypeError("Invalid date object");
    }
    return dateStr;
  }

  // 如果是时间戳
  if (typeof dateStr === "number") {
    const d = new Date(dateStr);
    if (strict && isNaN(d.getTime())) {
      throw new TypeError("Invalid timestamp");
    }
    return d;
  }

  // 字符串解析
  const str = dateStr.trim();

  // 1. 尝试标准ISO格式
  const isoMatch = str.match(
    /^(\d{4})-(\d{2})-(\d{2})([T\s](\d{2}):(\d{2}):(\d{2})(\.\d{3})?)?$/
  );
  if (isoMatch) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. 尝试YYYY/MM/DD格式
  const slashMatch = str.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashMatch) {
    const d = new Date(`${slashMatch[1]}-${slashMatch[2]}-${slashMatch[3]}`);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. 尝试DD-MM-YYYY或MM-DD-YYYY格式
  const dashMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dashMatch) {
    const [, d1, d2, year] = dashMatch;
    // 尝试两种顺序
    const d = new Date(`${year}-${d2}-${d1}`);
    if (!isNaN(d.getTime())) return d;
    const dAlt = new Date(`${year}-${d1}-${d2}`);
    if (!isNaN(dAlt.getTime())) return dAlt;
  }

  // 4. 尝试中文格式
  const cnMatch = str.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日?$/);
  if (cnMatch) {
    const d = new Date(
      `${cnMatch[1]}-${cnMatch[2].padStart(2, "0")}-${cnMatch[3].padStart(
        2,
        "0"
      )}`
    );
    if (!isNaN(d.getTime())) return d;
  }

  // 5. 尝试英文月份格式
  const enMatch = str.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (enMatch) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  }

  // 6. 尝试优先格式列表
  for (const format of preferredFormats) {
    try {
      const d = parseWithFormat(str, format);
      if (d && !isNaN(d.getTime())) return d;
    } catch (e) {
      // 继续尝试下一个格式
    }
  }

  // 7. 最后尝试Date构造函数
  const d = new Date(str);
  if (isNaN(d.getTime())) {
    if (strict) {
      throw new TypeError(`无法解析日期: ${dateStr}`);
    }
    return new Date("Invalid Date");
  }

  // 时区处理
  if (timezone) {
    return toTimezone(d, { timezone, keepLocalTime: true }) as Date;
  }

  return d;
}

/**
 * 辅助函数：解析特定格式
 */
function parseWithFormat(dateStr: string, format: string): Date | null {
  // 简单的格式解析器
  const formatMap: Record<string, string> = {
    YYYY: "(\\d{4})",
    MM: "(\\d{2})",
    DD: "(\\d{2})",
    HH: "(\\d{2})",
    mm: "(\\d{2})",
    ss: "(\\d{2})",
  };

  let regexStr = format;
  for (const [key, pattern] of Object.entries(formatMap)) {
    regexStr = regexStr.replace(key, pattern);
  }

  const match = dateStr.match(new RegExp(`^${regexStr}$`));
  if (!match) return null;

  // 提取组件
  const components: Record<string, number> = {};
  const parts = format.match(/YYYY|MM|DD|HH|mm|ss/g) || [];

  parts.forEach((part, index) => {
    components[part] = parseInt(match[index + 1], 10);
  });

  // 构建日期
  const year = components["YYYY"] || 0;
  const month = (components["MM"] || 1) - 1;
  const day = components["DD"] || 1;
  const hour = components["HH"] || 0;
  const minute = components["mm"] || 0;
  const second = components["ss"] || 0;

  return new Date(year, month, day, hour, minute, second);
}

/**
 * 辅助函数：获取时区偏移
 */
function getTimezoneOffset(timezone: string): number {
  // 简化的时区偏移映射
  const offsets: Record<string, number> = {
    "Asia/Shanghai": 8,
    "Asia/Tokyo": 9,
    "Asia/Seoul": 9,
    "America/New_York": -5,
    "America/Los_Angeles": -8,
    "America/Chicago": -6,
    "America/Denver": -7,
    "Europe/London": 0,
    "Europe/Paris": 1,
    "Europe/Berlin": 1,
    "Australia/Sydney": 11,
  };

  return offsets[timezone] || 0;
}

/**
 * 日期有效性检查
 * @description 检查日期是否有效
 * @param date 日期
 * @returns 是否有效
 *
 * @example
 * ```typescript
 * isValidDate(new Date()) // true
 * isValidDate('invalid') // false
 * isValidDate(new Date('Invalid')) // false
 * ```
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 获取日期组件
 * @description 获取日期的各个组成部分
 * @param date 日期
 * @returns 日期组件对象
 *
 * @example
 * ```typescript
 * const components = getDateComponents(new Date('2024-01-15 14:30:25.123'));
 * // {
 * //   year: 2024,
 * //   month: 1,
 * //   day: 15,
 * //   hour: 14,
 * //   minute: 30,
 * //   second: 25,
 * //   millisecond: 123,
 * //   dayOfWeek: 1 (周一)
 * // }
 * ```
 */
export function getDateComponents(date: Date | number | string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
    millisecond: d.getMilliseconds(),
    dayOfWeek: d.getDay() || 7, // 1-7, 周日为7
    timestamp: d.getTime(),
    isoString: d.toISOString(),
  };
}

/**
 * 日期截断
 * @description 将日期截断到指定精度
 * @param date 日期
 * @param precision 精度
 * @returns 截断后的日期
 *
 * @example
 * ```typescript
 * truncateDate(new Date('2024-01-15 14:30:25.123'), 'day') // 2024-01-15 00:00:00
 * truncateDate(new Date('2024-01-15 14:30:25.123'), 'hour') // 2024-01-15 14:00:00
 * ```
 */
export function truncateDate(
  date: Date | number | string,
  precision: "year" | "month" | "day" | "hour" | "minute" | "second"
): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError("Invalid date provided");
  }

  const result = new Date(d);

  switch (precision) {
    case "year":
      result.setMonth(0);
    case "month":
      result.setDate(1);
    case "day":
      result.setHours(0);
    case "hour":
      result.setMinutes(0);
    case "minute":
      result.setSeconds(0);
    case "second":
      result.setMilliseconds(0);
  }

  return result;
}
