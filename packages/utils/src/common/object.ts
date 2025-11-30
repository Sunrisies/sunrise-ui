
/**
 * 深度比较两个对象是否相等
 * @description 递归比较两个对象的所有属性和嵌套对象，判断它们是否完全相等
 * @public
 * @func 深度比较对象
 * @memberof module:common/object
 *
 * @param obj1 - 第一个要比较的对象
 * @param obj2 - 第二个要比较的对象
 * @returns {boolean} 如果两个对象深度相等则返回true，否则返回false
 *
 * @example
 * ```typescript
 * // 简单对象比较
 * deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 }); // false
 *
 * // 嵌套对象比较
 * const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
 * const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
 * deepEqual(obj1, obj2); // true
 *
 * // 数组比较
 * deepEqual([1, 2, 3], [1, 2, 3]); // true
 * deepEqual([1, 2, 3], [1, 2, 4]); // false
 *
 * // 处理null和undefined
 * deepEqual(null, null); // true
 * deepEqual(undefined, undefined); // true
 * deepEqual(null, undefined); // false
 * ```
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  // 处理严格相等的情况
  if (obj1 === obj2) {
    return true;
  }

  // 处理null/undefined情况
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  // 获取对象类型
  const type1 = typeof obj1;
  const type2 = typeof obj2;

  // 类型不同则不相等
  if (type1 !== type2) {
    return false;
  }

  // 处理基本类型
  if (type1 !== 'object') {
    return obj1 === obj2;
  }

  // 获取对象原型
  const proto1 = Object.getPrototypeOf(obj1);
  const proto2 = Object.getPrototypeOf(obj2);

  // 原型不同则不相等
  if (proto1 !== proto2) {
    return false;
  }

  // 处理数组
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }

    return true;
  }

  // 处理Date对象
  if (obj1 instanceof Date) {
    if (!(obj2 instanceof Date)) {
      return false;
    }
    return obj1.getTime() === obj2.getTime();
  }

  // 处理RegExp对象
  if (obj1 instanceof RegExp) {
    if (!(obj2 instanceof RegExp)) {
      return false;
    }
    return obj1.toString() === obj2.toString();
  }

  // 处理Map对象
  if (obj1 instanceof Map) {
    if (!(obj2 instanceof Map) || obj1.size !== obj2.size) {
      return false;
    }

    for (const [key, value] of obj1.entries()) {
      if (!obj2.has(key) || !deepEqual(value, obj2.get(key))) {
        return false;
      }
    }

    return true;
  }

  // 处理Set对象
  if (obj1 instanceof Set) {
    if (!(obj2 instanceof Set) || obj1.size !== obj2.size) {
      return false;
    }

    for (const value of obj1.values()) {
      if (!obj2.has(value)) {
        return false;
      }
    }

    return true;
  }

  // 获取所有键
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 键数量不同则不相等
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 检查每个键
  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * 比较两个对象并返回差异
 * @description 比较两个对象，返回它们之间的差异信息
 * @public
 * @func 对象差异比较
 * @memberof module:common/object
 *
 * @param obj1 - 源对象
 * @param obj2 - 目标对象
 * @returns {Object} 包含差异信息的对象
 * @returns {Array} returns.added - 目标对象中新增的属性
 * @returns {Array} returns.removed - 目标对象中删除的属性
 * @returns {Array} returns.changed - 目标对象中修改的属性
 * @returns {Array} returns.unchanged - 目标对象中未变更的属性
 *
 * @example
 * ```typescript
 * const obj1 = { a: 1, b: 2, c: 3 };
 * const obj2 = { a: 1, b: 4, d: 5 };
 * 
 * const diff = getObjectDiff(obj1, obj2);
 * console.log(diff);
 * // {
 * //   added: ['d'],
 * //   removed: ['c'],
 * //   changed: ['b'],
 * //   unchanged: ['a']
 * // }
 * ```
 */
export function getObjectDiff(obj1: any, obj2: any): {
  added: string[];
  removed: string[];
  changed: string[];
  unchanged: string[];
} {
  const result = {
    added: [] as string[],
    removed: [] as string[],
    changed: [] as string[],
    unchanged: [] as string[]
  };

  // 处理null/undefined情况
  if (obj1 == null || obj2 == null) {
    if (obj1 === obj2) {
      return result;
    } else if (obj1 == null) {
      result.added = Object.keys(obj2);
      return result;
    } else {
      result.removed = Object.keys(obj1);
      return result;
    }
  }

  // 获取所有键
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 查找新增的键
  for (const key of keys2) {
    if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
      result.added.push(key);
    }
  }

  // 查找删除的键
  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      result.removed.push(key);
    }
  }

  // 查找变更和未变更的键
  for (const key of keys1) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (deepEqual(obj1[key], obj2[key])) {
        result.unchanged.push(key);
      } else {
        result.changed.push(key);
      }
    }
  }

  return result;
}

/**
 * 深度克隆对象
 * @description 创建一个对象的深拷贝，包括所有嵌套对象和数组
 * @public
 * @func 深度克隆对象
 * @memberof module:common/object
 *
 * @param obj - 要克隆的对象
 * @returns {any} 克隆后的新对象
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * 
 * // 修改克隆对象不会影响原对象
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2
 * console.log(cloned.b.c); // 3
 * ```
 */
export function deepClone(obj: any): any {
  // 处理null/undefined/基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理Date对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理RegExp对象
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理Map对象
  if (obj instanceof Map) {
    const clone = new Map();
    for (const [key, value] of obj.entries()) {
      clone.set(deepClone(key), deepClone(value));
    }
    return clone;
  }

  // 处理Set对象
  if (obj instanceof Set) {
    const clone = new Set();
    for (const value of obj.values()) {
      clone.add(deepClone(value));
    }
    return clone;
  }

  // 处理Array对象
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // 处理普通对象
  const clone: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}
