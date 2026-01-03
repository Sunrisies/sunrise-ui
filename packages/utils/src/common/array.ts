/**
 * 数组工具函数集合
 * @module array
 */

/**
 * 数组去重
 * @description 移除数组中的重复元素，支持基本类型和对象引用
 * @param array 待去重的数组
 * @returns 去重后的新数组
 *
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 1]) // [1, 2, 3]
 * unique(['a', 'b', 'a']) // ['a', 'b']
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 数组扁平化
 * @description 将多维数组转换为一维数组
 * @param array 待扁平化的数组
 * @returns 扁平化后的一维数组
 *
 * @example
 * ```typescript
 * flatten([1, [2, 3], [4, [5, 6]]]) // [1, 2, 3, 4, 5, 6]
 * flatten(['a', ['b', ['c']]]) // ['a', 'b', 'c']
 * ```
 */
export function flatten<T>(array: any[]): T[] {
  return array.flat(Infinity);
}

/**
 * 数组分组
 * @description 根据指定的键或回调函数对数组元素进行分组
 * @param array 待分组的数组
 * @param keyOrFn 分组键名或分组回调函数
 * @returns 分组后的对象，键为分组标识，值为对应元素数组
 *
 * @example
 * ```typescript
 * // 按键名分组
 * groupBy([{type: 'A'}, {type: 'B'}, {type: 'A'}], 'type')
 * // {A: [{type: 'A'}, {type: 'A'}], B: [{type: 'B'}]}
 *
 * // 按回调函数分组
 * groupBy([1.2, 2.8, 3.5], n => Math.floor(n))
 * // {1: [1.2], 2: [2.8], 3: [3.5]}
 * ```
 */
export function groupBy<T>(
  array: T[],
  keyOrFn: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key =
      typeof keyOrFn === "function" ? keyOrFn(item) : String(item[keyOrFn]);
    const keyStr = String(key);
    if (!acc[keyStr]) {
      acc[keyStr] = [];
    }
    acc[keyStr].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * 数组分块
 * @description 将数组分割成指定大小的多个子数组
 * @param array 待分块的数组
 * @param size 每个子数组的大小
 * @returns 分块后的二维数组
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c', 'd'], 3) // [['a', 'b', 'c'], ['d']]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Size must be a positive number");
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * 数组差集
 * @description 计算两个数组的差集（在array1中但不在array2中的元素）
 * @param array1 主数组
 * @param array2 对比数组
 * @returns 差集数组
 *
 * @example
 * ```typescript
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 * difference(['a', 'b', 'c'], ['b', 'c', 'd']) // ['a']
 * ```
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}

/**
 * 数组交集
 * @description 计算两个数组的交集（同时存在于两个数组中的元素）
 * @param array1 第一个数组
 * @param array2 第二个数组
 * @returns 交集数组
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd']) // ['b', 'c']
 * ```
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => array2.includes(item));
}

/**
 * 数组并集
 * @description 计算两个数组的并集（合并并去重）
 * @param array1 第一个数组
 * @param array2 第二个数组
 * @returns 并集数组
 *
 * @example
 * ```typescript
 * union([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 * union(['a', 'b'], ['b', 'c']) // ['a', 'b', 'c']
 * ```
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * 数组排序增强
 * @description 对数组进行排序，支持自定义比较器和多字段排序
 * @param array 待排序的数组
 * @param comparator 比较器函数或字段配置
 * @returns 排序后的新数组
 *
 * @example
 * ```typescript
 * // 基本排序
 * sortBy([3, 1, 2]) // [1, 2, 3]
 *
 * // 对象数组按字段排序
 * sortBy([{age: 25}, {age: 18}], 'age') // [{age: 18}, {age: 25}]
 *
 * // 自定义比较器
 * sortBy(['apple', 'banana', 'cherry'], (a, b) => b.localeCompare(a))
 *
 * // 多字段排序
 * sortBy(
 *   [{name: 'John', age: 30}, {name: 'Jane', age: 25}],
 *   [{field: 'age', order: 'asc'}, {field: 'name', order: 'desc'}]
 * )
 * ```
 */
export function sortBy<T>(
  array: T[],
  comparator:
    | ((a: T, b: T) => number)
    | keyof T
    | Array<{ field: keyof T; order?: "asc" | "desc" }>
): T[] {
  const copy = [...array];

  if (typeof comparator === "function") {
    return copy.sort(comparator);
  }

  if (Array.isArray(comparator)) {
    return copy.sort((a, b) => {
      for (const { field, order = "asc" } of comparator) {
        const aVal = a[field];
        const bVal = b[field];

        if (aVal === bVal) continue;

        const comparison = aVal > bVal ? 1 : -1;
        return order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  return copy.sort((a, b) => {
    const aVal = a[comparator];
    const bVal = b[comparator];
    if (aVal === bVal) return 0;
    return aVal > bVal ? 1 : -1;
  });
}

/**
 * 数组查找增强
 * @description 在数组中查找元素，支持条件查询和返回索引
 * @param array 待查找的数组
 * @param condition 查找条件（值、谓词函数或对象条件）
 * @returns 找到的元素或索引，未找到返回 null 或 -1
 *
 * @example
 * ```typescript
 * // 查找元素
 * find([1, 2, 3], 2) // 2
 * find([{id: 1}, {id: 2}], {id: 2}) // {id: 2}
 * find([1, 2, 3], n => n > 1) // 2
 *
 * // 查找索引
 * findIndex([1, 2, 3], 2) // 1
 * findIndex([{id: 1}, {id: 2}], {id: 2}) // 1
 * ```
 */
export function find<T>(
  array: T[],
  condition: T | ((item: T) => boolean) | Partial<T>
): T | null {
  if (typeof condition === "function") {
    return array.find(condition as (item: T) => boolean) || null;
  }

  if (condition && typeof condition === "object") {
    const keys = Object.keys(condition) as (keyof T)[];
    return (
      array.find((item) => keys.every((key) => item[key] === condition[key])) ||
      null
    );
  }

  return array.find((item) => item === condition) || null;
}

/**
 * 查找元素索引增强
 * @description 在数组中查找元素的索引，支持条件查询
 * @param array 待查找的数组
 * @param condition 查找条件（值、谓词函数或对象条件）
 * @returns 找到的索引，未找到返回 -1
 *
 * @example
 * ```typescript
 * findIndex([1, 2, 3], 2) // 1
 * findIndex([{id: 1}, {id: 2}], {id: 2}) // 1
 * findIndex([1, 2, 3], n => n > 1) // 1
 * ```
 */
export function findIndex<T>(
  array: T[],
  condition: T | ((item: T) => boolean) | Partial<T>
): number {
  if (typeof condition === "function") {
    return array.findIndex(condition as (item: T) => boolean);
  }

  if (condition && typeof condition === "object") {
    const keys = Object.keys(condition) as (keyof T)[];
    return array.findIndex((item) =>
      keys.every((key) => item[key] === condition[key])
    );
  }

  return array.findIndex((item) => item === condition);
}

/**
 * 数组切片
 * @description 对数组进行安全切片，支持负索引和范围验证
 * @param array 待切片的数组
 * @param start 开始索引（支持负数）
 * @param end 结束索引（支持负数）
 * @returns 切片后的数组
 *
 * @example
 * ```typescript
 * slice([1, 2, 3, 4, 5], 1, 3) // [2, 3]
 * slice([1, 2, 3, 4, 5], -3) // [3, 4, 5]
 * slice([1, 2, 3, 4, 5], -3, -1) // [3, 4]
 * ```
 */
export function slice<T>(array: T[], start?: number, end?: number): T[] {
  if (!array || array.length === 0) return [];

  const len = array.length;

  // 处理负索引
  let startIndex = start ?? 0;
  let endIndex = end ?? len;

  if (startIndex < 0) startIndex = Math.max(0, len + startIndex);
  if (endIndex < 0) endIndex = Math.max(0, len + endIndex);

  // 验证范围
  if (startIndex >= len) return [];
  if (endIndex > len) endIndex = len;
  if (startIndex >= endIndex) return [];

  return array.slice(startIndex, endIndex);
}

/**
 * 数组移动
 * @description 将数组中的元素从一个位置移动到另一个位置
 * @param array 待操作的数组
 * @param from 源位置索引
 * @param to 目标位置索引
 * @returns 移动后的新数组
 *
 * @example
 * ```typescript
 * move([1, 2, 3, 4], 0, 2) // [2, 3, 1, 4]
 * move(['a', 'b', 'c'], 1, 0) // ['b', 'a', 'c']
 * ```
 */
export function move<T>(array: T[], from: number, to: number): T[] {
  const copy = [...array];

  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length) {
    throw new Error("Index out of bounds");
  }

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy;
}

/**
 * 数组替换
 * @description 替换数组中指定位置的元素
 * @param array 待操作的数组
 * @param index 要替换的位置索引
 * @param newValue 新值
 * @returns 替换后的新数组
 *
 * @example
 * ```typescript
 * replace([1, 2, 3], 1, 99) // [1, 99, 3]
 * replace(['a', 'b', 'c'], 0, 'x') // ['x', 'b', 'c']
 * ```
 */
export function replace<T>(array: T[], index: number, newValue: T): T[] {
  if (index < 0 || index >= array.length) {
    throw new Error("Index out of bounds");
  }

  const copy = [...array];
  copy[index] = newValue;
  return copy;
}

/**
 * 数组插入
 * @description 在指定位置插入元素
 * @param array 待操作的数组
 * @param index 插入位置索引
 * @param value 要插入的元素
 * @returns 插入后的新数组
 *
 * @example
 * ```typescript
 * insert([1, 2, 3], 1, 99) // [1, 99, 2, 3]
 * insert(['a', 'c'], 1, 'b') // ['a', 'b', 'c']
 * ```
 */
export function insert<T>(array: T[], index: number, value: T): T[] {
  if (index < 0 || index > array.length) {
    throw new Error("Index out of bounds");
  }

  const copy = [...array];
  copy.splice(index, 0, value);
  return copy;
}

/**
 * 数组删除
 * @description 删除指定位置的元素
 * @param array 待操作的数组
 * @param index 要删除的位置索引
 * @returns 删除后的新数组
 *
 * @example
 * ```typescript
 * remove([1, 2, 3], 1) // [1, 3]
 * remove(['a', 'b', 'c'], 0) // ['b', 'c']
 * ```
 */
export function remove<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    throw new Error("Index out of bounds");
  }

  const copy = [...array];
  copy.splice(index, 1);
  return copy;
}

/**
 * 数组求和
 * @description 计算数组中所有数字的总和
 * @param array 数字数组
 * @returns 总和
 *
 * @example
 * ```typescript
 * sum([1, 2, 3]) // 6
 * sum([1.5, 2.5, 3]) // 7
 * ```
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * 数组平均值
 * @description 计算数组中所有数字的平均值
 * @param array 数字数组
 * @returns 平均值，空数组返回 0
 *
 * @example
 * ```typescript
 * average([1, 2, 3]) // 2
 * average([1.5, 2.5, 3]) // 2.333...
 * average([]) // 0
 * ```
 */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/**
 * 数组最大值
 * @description 获取数组中的最大值
 * @param array 数字数组
 * @returns 最大值，空数组返回 -Infinity
 *
 * @example
 * ```typescript
 * max([1, 5, 3]) // 5
 * max([-1, -5, -3]) // -1
 * max([]) // -Infinity
 * ```
 */
export function max(array: number[]): number {
  if (array.length === 0) return -Infinity;
  return Math.max(...array);
}

/**
 * 数组最小值
 * @description 获取数组中的最小值
 * @param array 数字数组
 * @returns 最小值，空数组返回 Infinity
 *
 * @example
 * ```typescript
 * min([1, 5, 3]) // 1
 * min([-1, -5, -3]) // -5
 * min([]) // Infinity
 * ```
 */
export function min(array: number[]): number {
  if (array.length === 0) return Infinity;
  return Math.min(...array);
}

/**
 * 数组洗牌
 * @description 随机打乱数组顺序（Fisher-Yates算法）
 * @param array 待洗牌的数组
 * @returns 洗牌后的新数组
 *
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]) // 例如: [3, 1, 5, 2, 4]
 * shuffle(['a', 'b', 'c']) // 例如: ['c', 'a', 'b']
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 数组抽样
 * @description 从数组中随机抽取指定数量的元素
 * @param array 待抽样的数组
 * @param size 抽样数量
 * @returns 抽样结果数组
 *
 * @example
 * ```typescript
 * sample([1, 2, 3, 4, 5], 2) // 例如: [3, 1]
 * sample(['a', 'b', 'c', 'd'], 3) // 例如: ['c', 'a', 'd']
 * ```
 */
export function sample<T>(array: T[], size: number): T[] {
  if (size <= 0) return [];
  if (size >= array.length) return [...array];

  const shuffled = shuffle(array);
  return shuffled.slice(0, size);
}

/**
 * 数组去空
 * @description 移除数组中的空值（null、undefined、空字符串）
 * @param array 待处理的数组
 * @returns 去空后的新数组
 *
 * @example
 * ```typescript
 * compact([1, null, 2, undefined, 3, '']) // [1, 2, 3]
 * compact(['a', null, 'b', undefined]) // ['a', 'b']
 * ```
 */
export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item) => item != null && item !== "") as T[];
}

/**
 * 数组拉链
 * @description 将多个数组按位置组合成元组数组
 * @param arrays 待拉链的数组们
 * @returns 拉链后的元组数组
 *
 * @example
 * ```typescript
 * zip([1, 2], ['a', 'b']) // [[1, 'a'], [2, 'b']]
 * zip([1, 2, 3], ['a', 'b'], [true, false]) // [[1, 'a', true], [2, 'b', false]]
 * ```
 */
export function zip<T extends any[]>(
  ...arrays: { [K in keyof T]: T[K][] }
): T[] {
  const length = Math.min(...arrays.map((arr) => arr.length));
  const result: T[] = [];

  for (let i = 0; i < length; i++) {
    const tuple = arrays.map((arr) => arr[i]) as T;
    result.push(tuple);
  }

  return result;
}

/**
 * 数组转置
 * @description 将二维数组的行列互换
 * @param matrix 二维数组
 * @returns 转置后的二维数组
 *
 * @example
 * ```typescript
 * transpose([[1, 2], [3, 4]]) // [[1, 3], [2, 4]]
 * transpose([['a', 'b', 'c'], ['d', 'e', 'f']]) // [['a', 'd'], ['b', 'e'], ['c', 'f']]
 * ```
 */
export function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: T[][] = Array.from({ length: cols }, () => Array(rows));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

/**
 * 数组分隔
 * @description 使用分隔符将数组元素连接成字符串
 * @param array 待连接的数组
 * @param separator 分隔符，默认为逗号
 * @returns 连接后的字符串
 *
 * @example
 * ```typescript
 * join([1, 2, 3]) // "1,2,3"
 * join(['a', 'b', 'c'], ' - ') // "a - b - c"
 * join([1, 2, 3], '') // "123"
 * ```
 */
export function join<T>(array: T[], separator: string = ","): string {
  return array.join(separator);
}

/**
 * 数组范围
 * @description 生成指定范围的数字数组
 * @param start 开始数字（包含）
 * @param end 结束数字（包含）
 * @param step 步长，默认为1
 * @returns 数字数组
 *
 * @example
 * ```typescript
 * range(1, 5) // [1, 2, 3, 4, 5]
 * range(5, 1) // [5, 4, 3, 2, 1]
 * range(0, 10, 2) // [0, 2, 4, 6, 8, 10]
 * ```
 */
export function range(start: number, end: number, step: number = 1): number[] {
  if (step === 0) {
    throw new Error("Step cannot be zero");
  }

  const result: number[] = [];
  const direction = start < end ? 1 : -1;

  if (step * direction < 0) {
    step = -step;
  }

  for (let i = start; direction > 0 ? i <= end : i >= end; i += step) {
    result.push(i);
  }

  return result;
}

/**
 * 数组重复
 * @description 重复数组元素指定次数
 * @param array 要重复的数组
 * @param times 重复次数
 * @returns 重复后的数组
 *
 * @example
 * ```typescript
 * repeat([1, 2], 2) // [1, 2, 1, 2]
 * repeat(['a'], 3) // ['a', 'a', 'a']
 * repeat([1, 2], 0) // []
 * ```
 */
export function repeat<T>(array: T[], times: number): T[] {
  if (times < 0) {
    throw new Error("Times must be non-negative");
  }

  const result: T[] = [];
  for (let i = 0; i < times; i++) {
    result.push(...array);
  }
  return result;
}

/**
 * 数组补全
 * @description 使用指定值补全数组到指定长度
 * @param array 待补全的数组
 * @param length 目标长度
 * @param value 补全使用的值
 * @returns 补全后的数组
 *
 * @example
 * ```typescript
 * pad([1, 2], 5, 0) // [1, 2, 0, 0, 0]
 * pad(['a'], 3, 'x') // ['a', 'x', 'x']
 * pad([1, 2, 3], 2, 0) // [1, 2, 3]
 * ```
 */
export function pad<T>(array: T[], length: number, value: T): T[] {
  if (length <= array.length) {
    return [...array];
  }

  const result = [...array];
  const padding = Array(length - array.length).fill(value);
  return result.concat(padding);
}

/**
 * 数组分区
 * @description 根据条件将数组分成两个数组
 * @param array 待分区的数组
 * @param predicate 分区条件函数
 * @returns [满足条件的数组, 不满足条件的数组]
 *
 * @example
 * ```typescript
 * partition([1, 2, 3, 4, 5], n => n % 2 === 0) // [[2, 4], [1, 3, 5]]
 * partition(['a', 'b', 'c'], s => s > 'a') // [['b', 'c'], ['a']]
 * ```
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  array.forEach((item) => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });

  return [pass, fail];
}

/**
 * 数组去重（深度）
 * @description 深度比较去重，适用于对象数组
 * @param array 待去重的数组
 * @param key 可选的键名，用于对象数组的去重
 * @returns 去重后的新数组
 *
 * @example
 * ```typescript
 * uniqueBy([{id: 1, name: 'a'}, {id: 1, name: 'b'}], 'id') // [{id: 1, name: 'a'}]
 * uniqueBy([{x: 1, y: 2}, {x: 1, y: 2}]) // [{x: 1, y: 2}]
 * ```
 */
export function uniqueBy<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return unique(array);
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组差异（深度）
 * @description 深度比较差异，适用于对象数组
 * @param array1 主数组
 * @param array2 对比数组
 * @param key 可选的键名，用于对象数组的比较
 * @returns 差集数组
 *
 * @example
 * ```typescript
 * differenceBy([{id: 1}, {id: 2}], [{id: 2}, {id: 3}], 'id') // [{id: 1}]
 * differenceBy([1, 2, 3], [2, 3, 4]) // [1]
 * ```
 */
export function differenceBy<T>(array1: T[], array2: T[], key?: keyof T): T[] {
  if (!key) {
    return difference(array1, array2);
  }

  const keys2 = new Set(array2.map((item) => item[key]));
  return array1.filter((item) => !keys2.has(item[key]));
}

/**
 * 数组交集（深度）
 * @description 深度比较交集，适用于对象数组
 * @param array1 第一个数组
 * @param array2 第二个数组
 * @param key 可选的键名，用于对象数组的比较
 * @returns 交集数组
 *
 * @example
 * ```typescript
 * intersectionBy([{id: 1}, {id: 2}], [{id: 2}, {id: 3}], 'id') // [{id: 2}]
 * intersectionBy([1, 2, 3], [2, 3, 4]) // [2, 3]
 * ```
 */
export function intersectionBy<T>(
  array1: T[],
  array2: T[],
  key?: keyof T
): T[] {
  if (!key) {
    return intersection(array1, array2);
  }

  const keys2 = new Set(array2.map((item) => item[key]));
  return array1.filter((item) => keys2.has(item[key]));
}

/**
 * 数组并集（深度）
 * @description 深度比较并集，适用于对象数组
 * @param array1 第一个数组
 * @param array2 第二个数组
 * @param key 可选的键名，用于对象数组的比较
 * @returns 并集数组
 *
 * @example
 * ```typescript
 * unionBy([{id: 1}, {id: 2}], [{id: 2}, {id: 3}], 'id') // [{id: 1}, {id: 2}, {id: 3}]
 * unionBy([1, 2], [2, 3]) // [1, 2, 3]
 * ```
 */
export function unionBy<T>(array1: T[], array2: T[], key?: keyof T): T[] {
  if (!key) {
    return union(array1, array2);
  }

  const seen = new Set();
  const result: T[] = [];

  [...array1, ...array2].forEach((item) => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(item);
    }
  });

  return result;
}
