/**
 * 本地存储工具函数集合
 * @module storage
 */

/**
 * 本地存储类型枚举
 */
export enum StorageType {
  Local = 'localStorage',
  Session = 'sessionStorage'
}

/**
 * 存储项接口
 */
interface StorageItem<T = any> {
  value: T;
  expire?: number; // 过期时间戳
}

/**
 * 设置本地存储项
 * @param key 存储键
 * @param value 存储值
 * @param expire 过期时间（毫秒），可选
 * @param type 存储类型，默认为localStorage
 * 
 * @example
 * ```typescript
 * // 简单存储
 * setStorageItem('username', 'john_doe');
 * 
 * // 带过期时间的存储（1小时后过期）
 * setStorageItem('token', 'abc123', 3600000);
 * 
 * // 存储到sessionStorage
 * setStorageItem('tempData', { id: 1 }, 0, StorageType.Session);
 * ```
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  expire?: number,
  type: StorageType = StorageType.Local
): void {
  const storage = window[type];

  const item: StorageItem<T> = {
    value,
    expire: expire ? Date.now() + expire : undefined
  };

  storage.setItem(key, JSON.stringify(item));
}

/**
 * 获取本地存储项
 * @param key 存储键
 * @param type 存储类型，默认为localStorage
 * @returns 存储值，如果不存在或已过期则返回null
 * 
 * @example
 * ```typescript
 * const username = getStorageItem('username'); // 'john_doe' 或 null
 * const token = getStorageItem('token'); // 如果已过期则为null
 * ```
 */
export function getStorageItem<T>(
  key: string,
  type: StorageType = StorageType.Local
): T | null {
  const storage = window[type];
  const itemStr = storage.getItem(key);

  if (!itemStr) return null;

  try {
    const item: StorageItem<T> = JSON.parse(itemStr);

    // 检查是否过期
    if (item.expire && Date.now() > item.expire) {
      storage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    // 如果解析失败，删除该项并返回null
    storage.removeItem(key);
    return null;
  }
}

/**
 * 删除本地存储项
 * @param key 存储键
 * @param type 存储类型，默认为localStorage
 * 
 * @example
 * ```typescript
 * removeStorageItem('username');
 * removeStorageItem('tempData', StorageType.Session);
 * ```
 */
export function removeStorageItem(
  key: string,
  type: StorageType = StorageType.Local
): void {
  window[type].removeItem(key);
}

/**
 * 清空本地存储
 * @param type 存储类型，默认为localStorage
 * 
 * @example
 * ```typescript
 * clearStorage(); // 清空localStorage
 * clearStorage(StorageType.Session); // 清空sessionStorage
 * ```
 */
export function clearStorage(type: StorageType = StorageType.Local): void {
  window[type].clear();
}

/**
 * 获取所有存储键
 * @param type 存储类型，默认为localStorage
 * @returns 存储键数组
 * 
 * @example
 * ```typescript
 * const keys = getAllStorageKeys(); // ['username', 'token', 'settings']
 * ```
 */
export function getAllStorageKeys(type: StorageType = StorageType.Local): string[] {
  const storage = window[type];
  const keys: string[] = [];

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) keys.push(key);
  }

  return keys;
}

/**
 * 获取存储大小（字节）
 * @param type 存储类型，默认为localStorage
 * @returns 存储大小（字节）
 * 
 * @example
 * ```typescript
 * const size = getStorageSize(); // 1024
 * console.log(`存储大小: ${formatFileSize(size)}`);
 * ```
 */
export function getStorageSize(type: StorageType = StorageType.Local): number {
  const storage = window[type];
  let size = 0;

  // 使用 storage.length 和 storage.key() 来遍历所有存储项
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      const value = storage.getItem(key);
      size += key.length + (value ? value.length : 0);
    }
  }

  return size;
}

/**
 * 存储管理类，提供面向对象的存储操作方式
 */
export class StorageManager {
  private prefix: string;
  private type: StorageType;

  /**
   * 构造函数
   * @param prefix 键名前缀，用于避免命名冲突
   * @param type 存储类型，默认为localStorage
   */
  constructor(prefix: string = '', type: StorageType = StorageType.Local) {
    this.prefix = prefix;
    this.type = type;
  }

  /**
   * 获取完整的键名
   * @param key 原始键名
   * @returns 带前缀的完整键名
   */
  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  /**
   * 设置存储项
   * @param key 存储键
   * @param value 存储值
   * @param expire 过期时间（毫秒），可选
   */
  set<T>(key: string, value: T, expire?: number): void {
    setStorageItem(this.getKey(key), value, expire, this.type);
  }

  /**
   * 获取存储项
   * @param key 存储键
   * @returns 存储值，如果不存在或已过期则返回null
   */
  get<T>(key: string): T | null {
    return getStorageItem<T>(this.getKey(key), this.type);
  }

  /**
   * 删除存储项
   * @param key 存储键
   */
  remove(key: string): void {
    removeStorageItem(this.getKey(key), this.type);
  }

  /**
   * 清空所有带前缀的存储项
   */
  clear(): void {
    const keys = getAllStorageKeys(this.type);
    keys.forEach(key => {
      if (this.prefix && key.startsWith(`${this.prefix}:`)) {
        removeStorageItem(key, this.type);
      }
    });
  }

  /**
   * 获取所有带前缀的键
   * @returns 存储键数组（不包含前缀）
   */
  keys(): string[] {
    const allKeys = getAllStorageKeys(this.type);
    return allKeys
      .filter(key => this.prefix && key.startsWith(`${this.prefix}:`))
      .map(key => key.replace(`${this.prefix}:`, ''));
  }
}
