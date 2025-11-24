import Dexie, { type EntityTable } from "dexie";
interface Cache {
  value: Blob | ArrayBuffer | ImageBitmap | null;
  key: string;
  id?: number;
}

interface Config {
  dbName: string;
}

/**
 * 格式化使用的内存大小
 * @param size - 内存大小（字节）
 * @returns 格式化后的内存大小字符串
 */
export const formatMemorySize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

/**
 * 本地存储工具类，基于 IndexedDB 实现
 * @public
 * @author 朝阳
 * @version 1.0.0
 */
export default (config: Config = { dbName: "LocalStore" }) => {
  const { dbName = "LocalStore" } = config;
  const db = new Dexie(dbName) as Dexie & {
    cache: EntityTable<Cache, "key">;
  };
  db.version(1).stores({
    cache: "++id, &key, value,&url", // id 自动生成主键，url 唯一索引
  });

  /**
   * 通过 key 获取缓存数据
   * @param key - 缓存键
   * @returns 缓存的数据
   */
  const getCacheByKey = async (key: string) => {
    const { value } = (await db.cache.where({ key }).first()) || {
      value: null,
    };
    return value;
  };

  /**
   * 将数据存储到本地数据库
   * @param key - 缓存键
   * @param value - 要缓存的数据
   */
  const setCacheToLocal = async (
    key: string,
    value: Blob | ArrayBuffer | ImageBitmap
  ) => {
    await db.cache.put({ value, key });
  };

  /**
   * 清除所有缓存数据
   */
  const clearCache = async () => {
    await db.cache.clear();
  };

  /**
   * 获取已使用的缓存大小
   * @returns 格式化后的缓存大小
   */
  const getCacheSize = async () => {
    const cache = await db.cache.toArray();
    const size = cache.reduce((total: number, item: Cache) => {
      if (item.value instanceof Blob) {
        return total + item.value.size;
      }
      if (item.value instanceof ArrayBuffer) {
        return total + item.value.byteLength;
      }
      return total;
    }, 0);
    return formatMemorySize(size);
  };

  // 暴露接口
  return {
    getCacheByKey,
    setCacheToLocal,
    clearCache,
    getCacheSize,
  };
};
