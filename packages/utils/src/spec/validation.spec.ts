/**
 * validation.ts 测试用例
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidIdCard,
  isValidIp,
  isEmpty,
  isNil
} from '../common/validation'; // 根据实际路径调整

describe('验证工具函数', () => {
  describe('isValidEmail', () => {
    it('应该验证有效的电子邮件地址', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });
  });

  describe('isValidPhone', () => {
    it('应该验证有效的中国大陆手机号码', () => {
      expect(isValidPhone('13812345678')).toBe(true);
      expect(isValidPhone('15987654321')).toBe(true);
      expect(isValidPhone('18812345678')).toBe(true);
    });

    it('应该拒绝无效的手机号码', () => {
      expect(isValidPhone('12812345678')).toBe(false); // 12开头
      expect(isValidPhone('1381234567')).toBe(false); // 少一位
      expect(isValidPhone('138123456789')).toBe(false); // 多一位
      expect(isValidPhone('12345678901')).toBe(false); // 非手机号段
      expect(isValidPhone('abcdefghijk')).toBe(false); // 非数字
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('应该验证有效的URL', () => {
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path?query=value#fragment')).toBe(true);
    });

    it('应该拒绝无效的URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false); // 缺少协议
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isValidIdCard', () => {

    it('应该拒绝无效的身份证号码', () => {
      expect(isValidIdCard('110105194912310020')).toBe(false); // 校验位错误
      expect(isValidIdCard('11010519491231002')).toBe(false); // 17位
      expect(isValidIdCard('1101051949123100211')).toBe(false); // 19位
      expect(isValidIdCard('123456789012345678')).toBe(false); // 随机数字
      expect(isValidIdCard('')).toBe(false);
    });
  });


  describe('isValidIp', () => {
    it('应该验证有效的IP地址', () => {
      expect(isValidIp('192.168.1.1')).toBe(true);
      expect(isValidIp('0.0.0.0')).toBe(true);
      expect(isValidIp('255.255.255.255')).toBe(true);
      expect(isValidIp('10.0.0.1')).toBe(true);
    });

    it('应该拒绝无效的IP地址', () => {
      expect(isValidIp('256.256.256.256')).toBe(false); // 超出范围
      expect(isValidIp('192.168.1')).toBe(false); // 少一位
      expect(isValidIp('192.168.1.1.1')).toBe(false); // 多一位
      expect(isValidIp('192.168.1.a')).toBe(false); // 非数字
      expect(isValidIp('')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('应该正确识别空字符串', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\n')).toBe(true);
      expect(isEmpty('\r\n')).toBe(true);
      expect(isEmpty('\t')).toBe(true);
    });

    it('应该正确处理 null 和 undefined', () => {
      // 根据您的函数签名，isEmpty 接受 string | null | undefined
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('应该正确识别非空字符串', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('isNil', () => {
    it('应该正确识别空值', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
      expect(isNil('')).toBe(true);
      expect(isNil([])).toBe(true);
      expect(isNil({})).toBe(true);
    });

    it('应该正确处理空白字符串', () => {
      // 根据您的 isNil 实现，空白字符串应该返回 true
      expect(isNil('   ')).toBe(true);
    });

    it('应该正确识别非空值', () => {
      expect(isNil(0)).toBe(false);
      expect(isNil(false)).toBe(false);
      expect(isNil('hello')).toBe(false);
      expect(isNil([1, 2, 3])).toBe(false);
      expect(isNil({ key: 'value' })).toBe(false);
    });
  });
});