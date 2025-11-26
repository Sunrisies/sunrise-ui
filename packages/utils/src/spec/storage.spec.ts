/**
 * storage.ts 测试用例
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    StorageType,
    setStorageItem,
    getStorageItem,
    removeStorageItem,
    clearStorage,
    getAllStorageKeys,
    getStorageSize,
    StorageManager
} from '../index';

// 模拟 localStorage 和 sessionStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
        get length() {
            return Object.keys(store).length;
        }
    };
})();

const sessionStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
        get length() {
            return Object.keys(store).length;
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});

describe('本地存储工具函数', () => {
    beforeEach(() => {
        // 每次测试前清空存储
        localStorageMock.clear();
        sessionStorageMock.clear();
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('setStorageItem', () => {
        it('应该正确设置localStorage项', () => {
            setStorageItem('testKey', 'testValue');

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'testKey',
                JSON.stringify({ value: 'testValue', expire: undefined })
            );
        });

        it('应该正确设置sessionStorage项', () => {
            setStorageItem('testKey', 'testValue', undefined, StorageType.Session);

            expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
                'testKey',
                JSON.stringify({ value: 'testValue', expire: undefined })
            );
        });

        it('应该设置带过期时间的存储项', () => {
            vi.useFakeTimers();
            const now = Date.now();
            vi.setSystemTime(now);

            setStorageItem('testKey', 'testValue', 1000);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'testKey',
                JSON.stringify({ value: 'testValue', expire: now + 1000 })
            );
        });

        it('应该存储各种数据类型', () => {
            const testData = {
                string: 'hello',
                number: 123,
                boolean: true,
                array: [1, 2, 3],
                object: { key: 'value' },
                null: null
            };

            Object.entries(testData).forEach(([key, value]) => {
                setStorageItem(key, value);
                const expected = JSON.stringify({ value, expire: undefined });
                expect(localStorageMock.setItem).toHaveBeenCalledWith(key, expected);
            });
        });
    });

    describe('getStorageItem', () => {
        it('应该获取存在的localStorage项', () => {
            const testValue = { value: 'testValue', expire: undefined };
            localStorageMock.setItem('testKey', JSON.stringify(testValue));

            const result = getStorageItem('testKey');
            expect(result).toBe('testValue');
        });

        it('应该获取存在的sessionStorage项', () => {
            const testValue = { value: 'testValue', expire: undefined };
            sessionStorageMock.setItem('testKey', JSON.stringify(testValue));

            const result = getStorageItem('testKey', StorageType.Session);
            expect(result).toBe('testValue');
        });

        it('应该返回null对于不存在的项', () => {
            const result = getStorageItem('nonExistentKey');
            expect(result).toBeNull();
        });

        it('应该返回null对于已过期的项并删除它', () => {
            vi.useFakeTimers();
            const now = Date.now();
            vi.setSystemTime(now);

            const expiredItem = { value: 'testValue', expire: now - 1000 };
            localStorageMock.setItem('expiredKey', JSON.stringify(expiredItem));

            const result = getStorageItem('expiredKey');

            expect(result).toBeNull();
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('expiredKey');
        });

        it('应该返回有效值对于未过期的项', () => {
            vi.useFakeTimers();
            const now = Date.now();
            vi.setSystemTime(now);

            const validItem = { value: 'testValue', expire: now + 1000 };
            localStorageMock.setItem('validKey', JSON.stringify(validItem));

            const result = getStorageItem('validKey');

            expect(result).toBe('testValue');
            expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        });

        it('应该处理JSON解析错误并删除无效项', () => {
            localStorageMock.setItem('invalidKey', 'invalid json');

            const result = getStorageItem('invalidKey');

            expect(result).toBeNull();
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('invalidKey');
        });
    });

    describe('removeStorageItem', () => {
        it('应该从localStorage删除项', () => {
            removeStorageItem('testKey');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
        });

        it('应该从sessionStorage删除项', () => {
            removeStorageItem('testKey', StorageType.Session);
            expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('testKey');
        });
    });

    describe('clearStorage', () => {
        it('应该清空localStorage', () => {
            clearStorage();
            expect(localStorageMock.clear).toHaveBeenCalled();
        });

        it('应该清空sessionStorage', () => {
            clearStorage(StorageType.Session);
            expect(sessionStorageMock.clear).toHaveBeenCalled();
        });
    });

    describe('getAllStorageKeys', () => {
        it('应该获取localStorage的所有键', () => {
            // 设置一些测试数据
            localStorageMock.setItem('key1', 'value1');
            localStorageMock.setItem('key2', 'value2');

            // 模拟 key 方法的行为
            let callCount = 0;
            localStorageMock.key.mockImplementation(() => {
                const keys = ['key1', 'key2'];
                return callCount < keys.length ? keys[callCount++] : null;
            });

            const keys = getAllStorageKeys();

            expect(keys).toEqual(['key1', 'key2']);
        });

        it('应该获取sessionStorage的所有键', () => {
            // 设置一些测试数据
            sessionStorageMock.setItem('key1', 'value1');
            sessionStorageMock.setItem('key2', 'value2');

            // 模拟 key 方法的行为
            let callCount = 0;
            sessionStorageMock.key.mockImplementation(() => {
                const keys = ['key1', 'key2'];
                return callCount < keys.length ? keys[callCount++] : null;
            });

            const keys = getAllStorageKeys(StorageType.Session);

            expect(keys).toEqual(['key1', 'key2']);
        });

        it('应该返回空数组对于空存储', () => {
            const keys = getAllStorageKeys();
            expect(keys).toEqual([]);
        });
    });
    describe('getStorageSize', () => {
        it('应该计算localStorage的大小', () => {
            // 设置测试数据
            localStorageMock.setItem('key1', 'value1');
            localStorageMock.setItem('key2', 'value22');

            // 模拟 key 方法的行为
            let callCount = 0;
            const keys = ['key1', 'key2'];
            localStorageMock.key.mockImplementation(() => {
                return callCount < keys.length ? keys[callCount++] : null;
            });

            // 模拟 length 属性
            Object.defineProperty(localStorageMock, 'length', {
                get: () => keys.length
            });

            const size = getStorageSize();

            // key1: 'key1'.length + 'value1'.length = 4 + 6 = 10
            // key2: 'key2'.length + 'value22'.length = 4 + 7 = 11
            // 总共: 10 + 11 = 21
            expect(size).toBe(21);
        });

        it('应该计算sessionStorage的大小', () => {
            // 设置测试数据
            sessionStorageMock.setItem('key', 'value');

            // 模拟 key 方法的行为
            let callCount = 0;
            const keys = ['key'];
            sessionStorageMock.key.mockImplementation(() => {
                return callCount < keys.length ? keys[callCount++] : null;
            });

            // 模拟 length 属性
            Object.defineProperty(sessionStorageMock, 'length', {
                get: () => keys.length
            });

            const size = getStorageSize(StorageType.Session);

            // 'key'.length + 'value'.length = 3 + 5 = 8
            expect(size).toBe(8);
        });

        it('应该对空存储返回0', () => {
            // 模拟空存储
            localStorageMock.key.mockImplementation(() => null);
            Object.defineProperty(localStorageMock, 'length', {
                get: () => 0
            });

            const size = getStorageSize();
            expect(size).toBe(0);
        });
    });

    describe('StorageManager', () => {
        let storageManager: StorageManager;

        beforeEach(() => {
            storageManager = new StorageManager('app');
        });

        it('应该使用前缀设置和获取项', () => {
            storageManager.set('user', { name: 'John' });

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'app:user',
                JSON.stringify({ value: { name: 'John' }, expire: undefined })
            );

            const testValue = { value: { name: 'John' }, expire: undefined };
            localStorageMock.setItem('app:user', JSON.stringify(testValue));

            const result = storageManager.get('user');
            expect(result).toEqual({ name: 'John' });
        });

        it('应该删除带前缀的项', () => {
            storageManager.remove('user');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('app:user');
        });




        it('空前缀的StorageManager应该工作正常', () => {
            const noPrefixManager = new StorageManager();

            noPrefixManager.set('test', 'value');
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'test',
                JSON.stringify({ value: 'value', expire: undefined })
            );

            const keys = noPrefixManager.keys();
            expect(keys).toEqual([]);
        });

        it('应该支持设置过期时间', () => {
            vi.useFakeTimers();
            const now = Date.now();
            vi.setSystemTime(now);

            storageManager.set('token', 'abc123', 3600000);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'app:token',
                JSON.stringify({ value: 'abc123', expire: now + 3600000 })
            );
        });
    });
});