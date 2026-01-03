import { describe, it, expect } from "vitest";
import {
  addDays,
  compareDates,
  dateRange,
  formatDate,
  toTimezone,
  addWorkdays,
  parseDateEnhanced,
  isValidDate,
  getDateComponents,
  truncateDate,
} from "../common/date-enhanced";

describe("date-enhanced", () => {
  describe("addDays", () => {
    it("应该正确加减天数", () => {
      const baseDate = new Date("2024-01-01");

      expect(addDays(baseDate, { days: 5 })).toEqual(new Date("2024-01-06"));
      expect(addDays(baseDate, { days: -1 })).toEqual(new Date("2023-12-31"));
    });

    it("应该正确处理月份加减", () => {
      const baseDate = new Date("2024-01-15");

      // 加1个月
      const result1 = addDays(baseDate, { months: 1 });
      expect(result1.getMonth()).toBe(1); // 2月
      expect(result1.getDate()).toBe(15);

      // 处理月份溢出（1月31日加1个月）
      const baseDate2 = new Date("2024-01-31");
      const result2 = addDays(baseDate2, { months: 1 });
      // 1月31日加1个月，2月只有29天（2024闰年），所以得到2月29日
      expect(result2.getMonth()).toBe(1); // 2月
      expect(result2.getDate()).toBe(29); // 2月29日
    });

    it("应该正确处理年份加减", () => {
      const baseDate = new Date("2024-02-29"); // 闰年

      expect(addDays(baseDate, { years: 1 }).getFullYear()).toBe(2025);
      expect(addDays(baseDate, { years: -1 }).getFullYear()).toBe(2023);
    });

    it("应该正确处理复杂计算", () => {
      const baseDate = new Date("2024-01-01T12:00:00");

      const result = addDays(baseDate, {
        months: 1,
        days: 2,
        hours: 3,
        minutes: 30,
      });

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // 2月
      expect(result.getDate()).toBe(3);
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(30);
    });

    it("应该处理无效日期", () => {
      expect(() => addDays("invalid" as any, { days: 1 })).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("compareDates", () => {
    it("应该正确比较日期", () => {
      const result = compareDates("2024-01-01", "2024-01-02");

      expect(result.isBefore).toBe(true);
      expect(result.isAfter).toBe(false);
      expect(result.isSame).toBe(false);
      expect(result.diff).toBe(-86400000);
      expect(result.relative).toBe("1天前");
    });

    it("应该处理相同日期", () => {
      const date = new Date("2024-01-01");
      const result = compareDates(date, date);

      expect(result.isSame).toBe(true);
      expect(result.diff).toBe(0);
      expect(result.relative).toBe("刚刚");
    });

    it("应该处理未来日期", () => {
      const result = compareDates("2024-01-02", "2024-01-01");

      expect(result.isAfter).toBe(true);
      expect(result.isBefore).toBe(false);
      expect(result.relative).toBe("1天后");
    });

    it("应该处理不同时间单位", () => {
      const now = new Date("2024-01-01T12:00:00");

      // 秒
      const sec = compareDates("2024-01-01T11:59:30", now);
      expect(sec.relative).toBe("30秒前");

      // 分钟
      const min = compareDates("2024-01-01T11:58:00", now);
      expect(min.relative).toBe("2分钟前");

      // 小时
      const hour = compareDates("2024-01-01T09:00:00", now);
      expect(hour.relative).toBe("3小时前");

      // 周
      const week = compareDates("2023-12-18T12:00:00", now);
      expect(week.relative).toBe("2周前");

      // 月
      const month = compareDates("2023-10-01T12:00:00", now);
      expect(month.relative).toBe("3个月前");

      // 年
      const year = compareDates("2022-01-01T12:00:00", now);
      expect(year.relative).toBe("2年前");
    });

    it("应该处理无效日期", () => {
      expect(() => compareDates("invalid", "2024-01-01")).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("dateRange", () => {
    it("应该生成日期范围", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-05");

      const result = dateRange(start, end);

      expect(result.length).toBe(5);
      expect(result[0]).toEqual(new Date("2024-01-01"));
      expect(result[4]).toEqual(new Date("2024-01-05"));
    });

    it("应该按周生成", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-21");

      const result = dateRange(start, end, { unit: "week", step: 1 });
      expect(result.length).toBe(3); // 1日、8日、15日、22日
      expect(result[1]).toEqual(new Date("2024-01-08"));
    });

    it("应该不包含结束日期", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-05");

      const result = dateRange(start, end, { includeEnd: false });

      expect(result.length).toBe(4);
      expect(result[3]).toEqual(new Date("2024-01-04"));
    });

    it("应该处理无效日期", () => {
      expect(() => dateRange("invalid" as any, "2024-01-01")).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("formatDate", () => {
    it("应该格式化为标准格式", () => {
      const date = new Date("2024-01-15T14:30:25");

      expect(formatDate(date)).toBe("2024-01-15 14:30:25");
      expect(formatDate(date, { template: "YYYY/MM/DD" })).toBe("2024/01/15");
    });

    it("应该支持中文格式", () => {
      const date = new Date("2024-01-15T14:30:25");

      const result = formatDate(date, {
        template: "YYYY年MM月DD日 HH时mm分ss秒",
        locale: "zh-CN",
      });

      expect(result).toBe("2024年01月15日 14时30分25秒");
    });

    it("应该支持12小时制", () => {
      const date = new Date("2024-01-15T14:30:25");

      const result = formatDate(date, {
        template: "YYYY-MM-DD hh:mm:ss a",
        use24Hour: false,
      });

      expect(result).toBe("2024-01-15 02:30:25 PM");
    });

    it("应该显示毫秒", () => {
      const date = new Date("2024-01-15T14:30:25.123");

      const result = formatDate(date, {
        template: "YYYY-MM-DD HH:mm:ss.SSS",
        showMilliseconds: true,
      });

      expect(result).toBe("2024-01-15 14:30:25.123");
    });

    it("应该处理单数字", () => {
      const date = new Date("2024-01-01T01:01:01");

      expect(formatDate(date, { template: "YYYY-M-D H:m:s" })).toBe(
        "2024-1-1 1:1:1"
      );
    });

    it("应该处理无效日期", () => {
      expect(() => formatDate("invalid" as any)).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("toTimezone", () => {
    it("应该转换时区", () => {
      const date = new Date("2024-01-01T12:00:00Z");

      // 这个测试依赖于环境的时区支持
      const result = toTimezone(date, {
        timezone: "Asia/Shanghai",
        keepLocalTime: true,
      });

      expect(result instanceof Date).toBe(true);
    });

    it("应该处理无效日期", () => {
      expect(() => toTimezone("invalid" as any)).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("addWorkdays", () => {
    it("应该计算工作日", () => {
      const start = new Date("2026-01-01");
      const result = addWorkdays(start, 5);
      expect(result.getDay()).toBe(4);
    });

    it("应该跳过周末", () => {
      // 2024-01-05 是周五
      const start = new Date("2024-01-05");

      const result = addWorkdays(start, 2);

      // 周五 + 2个工作日 = 周二
      expect(result.getDay()).toBe(2);
    });

    it("应该跳过节假日", () => {
      // 2024-01-01 是周一
      const start = new Date("2024-01-01");

      const result = addWorkdays(start, 1, {
        holidays: ["2024-01-01"],
      });

      // 1月1日是节假日，所以跳过
      expect(result.getDate()).toBe(2);
    });

    it("应该处理自定义工作日", () => {
      // 2025-12-29 是周一
      const start = new Date("2025-12-29");

      const result = addWorkdays(start, 3, {
        workdays: [1, 3, 5], // 周一、周三、周五
      });
      expect(result.getDay()).toBe(1);
    });

    it("应该处理无效日期", () => {
      expect(() => addWorkdays("invalid" as any, 5)).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("parseDateEnhanced", () => {
    it("应该解析ISO格式", () => {
      const result = parseDateEnhanced("2024-01-01T12:00:00");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("应该解析斜杠格式", () => {
      const result = parseDateEnhanced("2024/01/01");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("应该解析破折号格式", () => {
      const result1 = parseDateEnhanced("01-01-2024");
      expect(result1.getFullYear()).toBe(2024);

      const result2 = parseDateEnhanced("2024-01-01");
      expect(result2.getFullYear()).toBe(2024);
    });

    it("应该解析中文格式", () => {
      const result = parseDateEnhanced("2024年01月01日");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("应该解析英文月份格式", () => {
      const result = parseDateEnhanced("January 1, 2024");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("应该处理Date对象", () => {
      const date = new Date("2024-01-01");
      const result = parseDateEnhanced(date);
      expect(result).toBe(date);
    });

    it("应该处理时间戳", () => {
      const timestamp = new Date("2024-01-01").getTime();
      const result = parseDateEnhanced(timestamp);
      expect(result.getFullYear()).toBe(2024);
    });

    it("应该支持严格模式", () => {
      expect(() => parseDateEnhanced("invalid", { strict: true })).toThrow();
    });

    it("应该处理无效日期", () => {
      const result = parseDateEnhanced("invalid");
      expect(isNaN(result.getTime())).toBe(true);
    });
  });

  describe("isValidDate", () => {
    it("应该返回true对于有效日期", () => {
      // 获取当前时间戳
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date("2024-01-01"))).toBe(true);
    });

    it("应该返回false对于无效日期", () => {
      expect(isValidDate("invalid")).toBe(false);
      expect(isValidDate(new Date("Invalid"))).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe("getDateComponents", () => {
    it("应该返回正确的组件", () => {
      const date = new Date("2024-01-15T14:30:25.123");
      const components = getDateComponents(date);

      expect(components.year).toBe(2024);
      expect(components.month).toBe(1);
      expect(components.day).toBe(15);
      expect(components.hour).toBe(14);
      expect(components.minute).toBe(30);
      expect(components.second).toBe(25);
      expect(components.millisecond).toBe(123);
      expect(components.dayOfWeek).toBe(1); // 周一
      expect(components.timestamp).toBe(date.getTime());
    });

    it("应该处理无效日期", () => {
      expect(() => getDateComponents("invalid" as any)).toThrow(
        "Invalid date provided"
      );
    });
  });

  describe("truncateDate", () => {
    it("应该截断到指定精度", () => {
      const date = new Date("2024-01-15T14:30:25.123");

      const year = truncateDate(date, "year");
      expect(year.getMonth()).toBe(0);
      expect(year.getDate()).toBe(1);
      expect(year.getHours()).toBe(0);

      const day = truncateDate(date, "day");
      expect(day.getHours()).toBe(0);
      expect(day.getMinutes()).toBe(0);

      const hour = truncateDate(date, "hour");
      expect(hour.getMinutes()).toBe(0);
      expect(hour.getSeconds()).toBe(0);

      const minute = truncateDate(date, "minute");
      expect(minute.getSeconds()).toBe(0);
      expect(minute.getMilliseconds()).toBe(0);
    });

    it("应该处理无效日期", () => {
      expect(() => truncateDate("invalid" as any, "day")).toThrow(
        "Invalid date provided"
      );
    });
  });
});
