/**
 * 预加载并缓存一组图片资源。
 * @public
 *
 * @param imageUrls - 图片资源的URL数组
 * @returns 返回一个Promise，该Promise在所有图片加载完成后解析为一个包含HTMLImageElement对象的数组
 * @memberof module:browser/images
 * @func 预加载并缓存一组图片资源。
 * @example
 * ```typescript
 * // 示例：预加载并缓存一组图片
 * preloadAndCacheImages(['https://example.com/image1.jpg', 'https://example.com/image2.jpg'])
 *   .then((images) =\> {
 *     console.log('所有图片加载成功', images);
 *   \})
 *   .catch((error) =\> {
 *     console.error('图片加载失败', error);
 *   \});
 * ```
 */
export const preloadAndCacheImages = (
  imageUrls: string[]
): Promise<HTMLImageElement[]> => {
  return Promise.all(
    imageUrls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`图片加载失败: ${url}`));
          image.src = url;
        })
    )
  );
};

/**
 * 预加载并缓存图片资源。
 * @public
 * @memberof module:browser/images
 * @func 预加载并缓存图片资源
 * @param imageUrl - 图片资源的URL
 * @returns 返回一个Promise，该Promise在图片加载完成后解析为一个包含HTMLImageElement对象
 *
 * @example
 * ```typescript
 * // 示例：预加载并缓存图片
 * preloadAndCacheImage('https://example.com/image.jpg')
 *   .then((image) => {
 *     console.log('图片加载成功', image);
 *   })
 *   .catch((error) => {
 *     console.error('图片加载失败', error);
 *   });
 * ```
 */
export const preloadAndCacheImage = (
  imageUrl: string
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error("图片加载失败"));
    };
    img.src = imageUrl;
  });
};
