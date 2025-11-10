/**
 * 生成随机字符串工具函数
 * @description 根据输入参数的类型和值生成随机字符串或返回错误
 * @public
 * @func 生成随机字符串
 * @memberof module:utils/string
 *
 * @typeParam T - 输入参数的类型，用于类型推导
 *
 * @param length - 随机字符串的目标长度
 * @remarks 必须是大于0的数字，其他类型或值将返回错误
 *
 * @returns {GenRandStrResult<T>} 根据输入类型返回结果
 * @returns {string} 当输入为有效正数时返回随机字符串
 * @returns {Error} 当输入无效时返回错误对象
 *
 * @throws {Error} 当输入不是正数时抛出错误
 *
 * @example
 * ```typescript
 * // 生成10位随机字符串
 * const result1 = genRandStr(10);
 * console.log(result1); // 输出类似 "aB3dE7gH9j"
 *
 * // 错误处理示例
 * const result2 = genRandStr('invalid');
 * if (result2 instanceof Error) {
 *   console.error(result2.message); // "Length must be a positive number"
 * }
 *
 * // 类型检查示例
 * const result3 = genRandStr(-5);
 * if (result3 instanceof Error) {
 *   console.error(result3.message); // "Length must be a positive number"
 * }
 *
 * // TypeScript类型推导
 * const result4 = genRandStr(8); // result4 的类型为 string
 * const result5 = genRandStr('test'); // result5 的类型为 Error
 * ```
 */

/**
 * 生成随机字符串的返回类型
 * @template T 输入参数的类型
 * @description 根据输入类型决定返回类型：number返回string，其他类型返回Error
 */
export type GenRandStrResult<T> = T extends number ? string : Error;

/**
 * 生成随机字符串的实现
 * @description 使用大小写字母和数字生成指定长度的随机字符串
 *
 * @internal
 * @remarks 包含62个字符：26个大写字母、26个小写字母和10个数字
 */
const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * 生成随机字符串的主函数
 * @func 生成随机字符串
 * @memberof module:utils/string
 * @param length 字符串长度
 * @returns 随机字符串或错误对象
 */
export const genRandStr = <T>(length: T): GenRandStrResult<T> => {
  // 参数验证
  if (typeof length !== "number" || length <= 0) {
    return new Error("Length must be a positive number") as GenRandStrResult<T>;
  }

  // 生成随机字符串
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    randomString += CHARACTERS.charAt(randomIndex);
  }
  return randomString as GenRandStrResult<T>;
};
