/**
 * 加密工具函数集合
 * @module crypto
 */

/**
 * Base64 编码
 * @param str 待编码的字符串
 * @returns Base64 编码后的字符串
 * 
 * @example
 * ```typescript
 * const encoded = base64Encode('Hello, world!'); // 'SGVsbG8sIHdvcmxkIQ=='
 * ```
 */
export function base64Encode(str: string): string {
  try {
    // 在浏览器环境中
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    // 在Node.js环境中
    else if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf8').toString('base64');
    }
    // 通用实现
    else {
      return btoa(unescape(encodeURIComponent(str)));
    }
  } catch (error) {
    console.error('Base64编码失败:', error);
    return '';
  }
}

/**
 * Base64 解码
 * @param str Base64 编码的字符串
 * @returns 解码后的原始字符串
 * 
 * @example
 * ```typescript
 * const decoded = base64Decode('SGVsbG8sIHdvcmxkIQ=='); // 'Hello, world!'
 * ```
 */
export function base64Decode(str: string): string {
  try {
    // 在浏览器环境中
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return decodeURIComponent(escape(window.atob(str)));
    }
    // 在Node.js环境中
    else if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf8');
    }
    // 通用实现
    else {
      return decodeURIComponent(escape(atob(str)));
    }
  } catch (error) {
    console.error('Base64解码失败:', error);
    return '';
  }
}

/**
 * 生成随机字符串
 * @param length 字符串长度，默认为8
 * @param charset 字符集，默认为字母数字
 * @returns 随机字符串
 * 
 * @example
 * ```typescript
 * const randomStr = generateRandomString(12); // 'aB3fG7hJ9kL2'
 * const secureStr = generateRandomString(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*');
 * ```
 */
export function generateRandomString(
  length: number = 8, 
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 简单的XOR加密
 * @param data 待加密的数据
 * @param key 加密密钥
 * @returns 加密后的数据（Base64编码）
 * 
 * @example
 * ```typescript
 * const encrypted = xorEncrypt('Secret message', 'myKey');
 * const decrypted = xorDecrypt(encrypted, 'myKey'); // 'Secret message'
 * ```
 */
export function xorEncrypt(data: string, key: string): string {
  if (!key) return data;

  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }

  return base64Encode(result);
}

/**
 * 简单的XOR解密
 * @param encryptedData 加密的数据（Base64编码）
 * @param key 解密密钥
 * @returns 解密后的原始数据
 */
export function xorDecrypt(encryptedData: string, key: string): string {
  if (!key) return encryptedData;

  try {
    const data = base64Decode(encryptedData);
    let result = '';

    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }

    return result;
  } catch (error) {
    console.error('XOR解密失败:', error);
    return '';
  }
}

/**
 * 生成UUID v4
 * @returns UUID字符串
 * 
 * @example
 * ```typescript
 * const id = generateUUID(); // '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export function generateUUID(): string {
  // 在浏览器环境中
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && window.crypto.getRandomValues) {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))
      ).toString(16)
    );
  }
  // 通用实现
  else {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

/**
 * 计算字符串的哈希值（简单实现）
 * @param str 待哈希的字符串
 * @returns 哈希值（32位十六进制字符串）
 * 
 * @example
 * ```typescript
 * const hash = simpleHash('Hello, world!'); // '2ef7bde608ce5404e97d5f042f95f89f1c232871'
 * ```
 */
export function simpleHash(str: string): string {
  let hash = 0;

  if (str.length === 0) return hash.toString();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 转换为正数并格式化为十六进制
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * 生成密码哈希（使用PBKDF2）
 * @param password 密码
 * @param salt 盐值，如果不提供则随机生成
 * @param iterations 迭代次数，默认为10000
 * @param keyLength 密钥长度，默认为32
 * @param hashAlgorithm 哈希算法，默认为'SHA-256'
 * @returns 包含盐值和哈希值的对象
 * 
 * @example
 * ```typescript
 * // 生成密码哈希
 * const { salt, hash } = await generatePasswordHash('myPassword');
 * 
 * // 验证密码
 * const { hash: newHash } = await generatePasswordHash('myPassword', salt);
 * const isValid = hash === newHash; // true
 * ```
 */
export async function generatePasswordHash(
  password: string,
  salt?: string,
  iterations: number = 10000,
  keyLength: number = 32,
  hashAlgorithm: string = 'SHA-256'
): Promise<{ salt: string; hash: string }> {
  // 如果没有提供盐值，则随机生成
  if (!salt) {
    salt = generateRandomString(16);
  }

  try {
    // 在浏览器环境中使用Web Crypto API
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode(salt),
          iterations,
          hash: hashAlgorithm,
        },
        keyMaterial,
        { name: 'AES-GCM', length: keyLength * 8 },
        true,
        ['encrypt', 'decrypt']
      );

      const hashBuffer = await window.crypto.subtle.exportKey('raw', key);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return { salt, hash: hashHex };
    }
    // 在Node.js环境中使用crypto模块
    else if (typeof require !== 'undefined') {
      const crypto = require('crypto');
      const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, hashAlgorithm);
      const hashHex = hash.toString('hex');

      return { salt, hash: hashHex };
    }
    // 如果都不支持，则抛出错误
    else {
      throw new Error('不支持密码哈希生成');
    }
  } catch (error) {
    console.error('密码哈希生成失败:', error);
    throw error;
  }
}
