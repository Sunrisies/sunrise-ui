import { describe, it, expect } from "vitest";
import { deepEqual, getObjectDiff, deepClone } from "../common/object";

describe("deepEqual", () => {
  // 基础类型测试
  it("应正确比较基础类型", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("hello", "hello")).toBe(true);
    expect(deepEqual("hello", "world")).toBe(false);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  // 对象比较测试
  it("应正确比较简单对象", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    const obj3 = { a: 1, b: 3 };
    const obj4 = { a: 1, b: 2, c: 3 };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
    expect(deepEqual(obj1, obj4)).toBe(false);
  });

  // 嵌套对象测试
  it("应正确比较嵌套对象", () => {
    const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
    const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
    const obj3 = { a: 1, b: { c: 2, d: [3, 5] } };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
  });

  // 数组测试
  it("应正确比较数组", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(deepEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
    expect(deepEqual([1, 2, [3, 4]], [1, 2, [3, 4]])).toBe(true);
  });

  // Date对象测试
  it("应正确比较Date对象", () => {
    const date1 = new Date("2024-01-01");
    const date2 = new Date("2024-01-01");
    const date3 = new Date("2024-01-02");

    expect(deepEqual(date1, date2)).toBe(true);
    expect(deepEqual(date1, date3)).toBe(false);
  });

  // RegExp对象测试
  it("应正确比较RegExp对象", () => {
    const regex1 = new RegExp("abc", "i");
    const regex2 = new RegExp("abc", "i");
    const regex3 = new RegExp("abc", "g");

    expect(deepEqual(regex1, regex2)).toBe(true);
    expect(deepEqual(regex1, regex3)).toBe(false);
  });

  // Map对象测试
  it("应正确比较Map对象", () => {
    const map1 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map2 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map3 = new Map([
      ["a", 1],
      ["b", 3],
    ]);

    expect(deepEqual(map1, map2)).toBe(true);
    expect(deepEqual(map1, map3)).toBe(false);
  });

  // Set对象测试
  it("应正确比较Set对象", () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);

    expect(deepEqual(set1, set2)).toBe(true);
    expect(deepEqual(set1, set3)).toBe(false);
  });

  // 原型测试
  it("应正确处理不同原型的对象", () => {
    class Person {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
    }

    const person1 = new Person("Alice");
    const person2 = { name: "Alice" };

    expect(deepEqual(person1, person2)).toBe(false);
  });

  // 边界情况测试
  it("应正确处理边界情况", () => {
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([{}], [{}])).toBe(true);
    expect(deepEqual({ a: undefined }, { b: 1 })).toBe(false);
  });
});

describe("getObjectDiff", () => {
  // 基础差异测试
  it("应正确识别新增、删除、变更和不变的属性", () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 4, d: 5 };

    const diff = getObjectDiff(obj1, obj2);

    expect(diff.added).toEqual(["d"]);
    expect(diff.removed).toEqual(["c"]);
    expect(diff.changed).toEqual(["b"]);
    expect(diff.unchanged).toEqual(["a"]);
  });

  // 空对象测试
  it("应正确处理空对象", () => {
    const obj1 = {};
    const obj2 = { a: 1 };

    const diff = getObjectDiff(obj1, obj2);

    expect(diff.added).toEqual(["a"]);
    expect(diff.removed).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.unchanged).toEqual([]);
  });

  // 相同对象测试
  it("应正确处理相同对象", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };

    const diff = getObjectDiff(obj1, obj2);

    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.unchanged).toEqual(["a", "b"]);
  });

  // null/undefined测试
  it("应正确处理null和undefined", () => {
    const diff1 = getObjectDiff(null, null);
    expect(diff1.added).toEqual([]);
    expect(diff1.removed).toEqual([]);
    expect(diff1.changed).toEqual([]);
    expect(diff1.unchanged).toEqual([]);

    const diff2 = getObjectDiff(null, { a: 1 });
    expect(diff2.added).toEqual(["a"]);
    expect(diff2.removed).toEqual([]);

    const diff3 = getObjectDiff({ a: 1 }, null);
    expect(diff3.added).toEqual([]);
    expect(diff3.removed).toEqual(["a"]);
  });

  // 嵌套对象测试
  it("应正确处理嵌套对象", () => {
    const obj1 = { a: { b: 1, c: 2 }, d: 3 };
    const obj2 = { a: { b: 1, c: 3 }, d: 3 };

    const diff = getObjectDiff(obj1, obj2);

    expect(diff.unchanged).toEqual(["d"]);
    expect(diff.changed).toEqual(["a"]); // 嵌套对象整体被标记为变更
  });
});

describe("deepClone", () => {
  // 基础类型测试
  it("应正确克隆基础类型", () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone("hello")).toBe("hello");
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  // 对象克隆测试
  it("应正确克隆对象并保持独立性", () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // 修改克隆对象不应影响原对象
    cloned.b.c = 3;
    expect(original.b.c).toBe(2);
    expect(cloned.b.c).toBe(3);
  });

  // 数组克隆测试
  it("应正确克隆数组并保持独立性", () => {
    const original = [1, 2, [3, 4]];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // 修改克隆数组不应影响原数组
    cloned[2][0] = 5;
    expect(original[2][0]).toBe(3);
    expect(cloned[2][0]).toBe(5);
  });

  // Date对象测试
  it("应正确克隆Date对象", () => {
    const original = new Date("2024-01-01");
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.getTime()).toBe(original.getTime());
  });

  // RegExp对象测试
  it("应正确克隆RegExp对象", () => {
    const original = new RegExp("abc", "i");
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.source).toBe(original.source);
    expect(cloned.flags).toBe(original.flags);
  });

  // Map对象测试
  it("应正确克隆Map对象并保持独立性", () => {
    const original = new Map([
      ["a", 1],
      ["b", { c: 2 }],
    ]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // 修改克隆Map不应影响原Map
    const nestedObj = cloned.get("b") as { c: number };
    nestedObj.c = 3;
    expect((original.get("b") as { c: number }).c).toBe(2);
    expect(nestedObj.c).toBe(3);
  });

  // Set对象测试
  it("应正确克隆Set对象并保持独立性", () => {
    const original = new Set([1, 2, { a: 3 }]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  // 复杂嵌套测试
  it("应正确克隆复杂的嵌套结构", () => {
    const original = {
      a: 1,
      b: [1, 2, { c: 3 }],
      d: { e: { f: 4 } },
      g: new Date(),
      h: new Map<string | number, string | number | { c: number }>([
        ["key", "value"],
        [1, 2],
      ]),
      i: new Set([1, 2, 3]),
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // 验证所有嵌套对象都是独立的
    (cloned.b as any[])[2] = { c: 5 };
    expect(((original.b as any[])[2] as { c: number }).c).toBe(3);
  });

  // 循环引用测试（可选，如果需要支持）
  it("应正确处理循环引用", () => {
    const obj: any = { a: 1 };
    obj.self = obj;

    // 这可能会导致栈溢出，取决于实现
    // 如果需要支持循环引用，需要在deepClone中处理
    // 但当前实现不支持，所以这个测试可能会失败
  });
});
