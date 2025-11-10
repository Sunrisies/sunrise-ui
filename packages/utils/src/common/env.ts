/**
 * 运行环境类型枚举
 * @description 定义了可能的运行环境类型
 * @remarks
 * - "browser": 浏览器环境
 * - "node": Node.js 环境
 * - "unknown": 未知环境
 */
export type RuntimeEnvironment = "browser" | "node" | "unknown";

/**
 * 检测当前运行环境
 * @description 通过检查全局对象的存在性来判断当前运行环境
 * @func 检测当前运行环境
 * @memberof module:common/env
 * @returns {RuntimeEnvironment} 返回当前运行环境类型
 * @example
 * ```typescript
 * const env = detectEnvironment();
 * if (env === 'browser') {
 *   console.log('Running in browser');
 * }
 * ```
 */
export function detectEnvironment(): RuntimeEnvironment {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    return "node";
  }
  return "unknown";
}

/**
 * 检查是否在浏览器环境中运行
 * @func 检查是否在浏览器环境中运行
 * @memberof module:common/env
 * @description 使用detectEnvironment()来判断当前环境是否为浏览器
 * @returns {boolean} 如果当前在浏览器环境中返回true，否则返回false
 * @example
 * ```typescript
 * if (isBrowser()) {
 *   // 浏览器特定代码
 *   document.getElementById('app');
 * }
 * ```
 */
export function isBrowser(): boolean {
  return detectEnvironment() === "browser";
}

/**
 * 检查是否在 Node.js 环境中运行
 * @func 检查是否在 Node.js 环境中运行
 * @memberof module:common/env
 * @description 使用detectEnvironment()来判断当前环境是否为Node.js
 * @returns {boolean} 如果当前在Node.js环境中返回true，否则返回false
 * @example
 * ```typescript
 * if (isNode()) {
 *   // Node.js特定代码
 *   const fs = require('fs');
 * }
 * ```
 */
export function isNode(): boolean {
  return detectEnvironment() === "node";
}

/**
 * 确保代码在特定环境中运行
 * @description 用于环境检查，如果当前环境不符合要求则抛出错误
 * @func 确保代码在特定环境中运行
 * @memberof module:common/env
 * @param {RuntimeEnvironment} env - 期望的运行环境
 * @param {string} feature - 功能名称，用于错误提示
 * @throws {Error} 当当前环境与期望环境不符时抛出错误
 * @example
 * ```typescript
 * // 确保只在浏览器环境中执行
 * ensureEnvironment('browser', 'DOM操作');
 *
 * // 确保只在Node.js环境中执行
 * ensureEnvironment('node', '文件系统操作');
 * ```
 */
export function ensureEnvironment(
  env: RuntimeEnvironment,
  feature: string
): void {
  const currentEnv = detectEnvironment();
  if (currentEnv !== env) {
    throw new Error(
      `${feature} 只能在 ${env} 环境中使用，当前环境为 ${currentEnv}`
    );
  }
}
