/**
 * 文件处理工具函数集合
 * @module file
 */

import { downloadFile } from "./http";

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（不包含点）
 *
 * @example
 * ```typescript
 * getFileExtension('document.pdf'); // 'pdf'
 * getFileExtension('image.jpeg'); // 'jpeg'
 * getFileExtension('archive.tar.gz'); // 'gz'
 * ```
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * 获取文件名（不包含扩展名）
 * @param filename 文件名
 * @returns 不包含扩展名的文件名
 *
 * @example
 * ```typescript
 * getFileName('document.pdf'); // 'document'
 * getFileName('path/to/image.jpeg'); // 'image'
 * ```
 */
export function getFileName(filename: string): string {
  const baseName = filename.split(/[\/]/).pop() || "";
  return baseName.includes(".")
    ? baseName.substring(0, baseName.lastIndexOf("."))
    : baseName;
}

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的文件大小字符串
 *
 * @example
 * ```typescript
 * formatFileSize(1024); // '1 KB'
 * formatFileSize(1048576); // '1 MB'
 * formatFileSize(123456789); // '117.74 MB'
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * 读取文件为DataURL
 * @param file 文件对象
 * @returns Promise<DataURL> DataURL字符串
 *
 * @example
 * ```typescript
 * const fileInput = document.getElementById('file-input') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * if (file) {
 *   const dataUrl = await readFileAsDataURL(file);
 *   console.log(dataUrl); // "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
 * }
 * ```
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as DataURL"));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * 读取文件为文本
 * @param file 文件对象
 * @returns Promise<string> 文件内容
 *
 * @example
 * ```typescript
 * const fileInput = document.getElementById('file-input') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * if (file) {
 *   const content = await readFileAsText(file);
 *   console.log(content); // 文件文本内容
 * }
 * ```
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * 创建文件并下载
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType MIME类型，默认为'text/plain'
 *
 * @example
 * ```typescript
 * // 下载文本文件
 * createAndDownloadFile('Hello, world!', 'hello.txt');
 *
 * // 下载JSON文件
 * const data = { name: 'John', age: 30 };
 * createAndDownloadFile(JSON.stringify(data, null, 2), 'data.json', 'application/json');
 * ```
 */
export function createAndDownloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url); // 释放内存
}

/**
 * 检查文件类型是否在允许的类型列表中
 * @param file 文件对象
 * @param allowedTypes 允许的MIME类型数组
 * @returns 是否为允许的文件类型
 *
 * @example
 * ```typescript
 * const file = fileInput.files?.[0];
 * if (file && isAllowedFileType(file, ['image/jpeg', 'image/png'])) {
 *   console.log('允许的图片类型');
 * } else {
 *   console.log('不允许的文件类型');
 * }
 * ```
 */
export function isAllowedFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 检查文件大小是否超过限制
 * @param file 文件对象
 * @param maxSizeInMB 最大文件大小（MB）
 * @returns 是否超过大小限制
 *
 * @example
 * ```typescript
 * const file = fileInput.files?.[0];
 * if (file && isFileSizeExceeded(file, 5)) {
 *   console.log('文件大小超过5MB限制');
 * }
 * ```
 */
export function isFileSizeExceeded(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size > maxSizeInBytes;
}
