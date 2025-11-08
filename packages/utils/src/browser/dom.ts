/**
 * 获取指定元素ID的内容区域（排除内边距padding）的尺寸。
 * @public
 *
 * @param elementId - 要获取尺寸的元素的ID
 * @returns 返回一个包含width和height的对象，如果找不到元素或无法获取计算样式则返回错误对象
 * @memberof module:utils/dom
 * @function 获取指定元素ID的内容区域
 * @example
 * ```typescript
 * // 获取ID为 'myElement' 的元素的内容区域尺寸
 * const dimensions = getContentDimensions('myElement')
 * if (dimensions instanceof Error) {
 *   console.error('无法获取元素的尺寸')
 * } else {
 *   console.log('内容区域宽度:', dimensions.width)
 *   console.log('内容区域高度:', dimensions.height)
 * }
 * ```
 */
export const getContentDimensions = (
  elementId: string
): Error | { width: number; height: number } => {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    if (style) {
      const paddingTop = parseFloat(style.paddingTop);
      const paddingRight = parseFloat(style.paddingRight);
      const paddingBottom = parseFloat(style.paddingBottom);
      const paddingLeft = parseFloat(style.paddingLeft);
      const contentWidth = rect.width - (paddingLeft + paddingRight);
      const contentHeight = rect.height - (paddingTop + paddingBottom);
      return {
        width: contentWidth,
        height: contentHeight,
      };
    } else {
      return new Error("Element has no computed style" + elementId);
    }
  } else {
    return new Error("找不到id为" + elementId + "的元素");
  }
};
