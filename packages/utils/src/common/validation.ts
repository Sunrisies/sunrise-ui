/**
 * 验证工具函数集合
 * @module validation
 */

/**
 * 检查是否为有效的电子邮件地址
 * @param email 待验证的电子邮件地址
 * @returns 是否为有效的电子邮件地址
 * 
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid-email'); // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * 检查是否为有效的手机号码（中国大陆）
 * @param phone 待验证的手机号码
 * @returns 是否为有效的手机号码
 * 
 * @example
 * ```typescript
 * isValidPhone('13812345678'); // true
 * isValidPhone('123456'); // false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 检查是否为有效的URL
 * @param url 待验证的URL
 * @returns 是否为有效的URL
 * 
 * @example
 * ```typescript
 * isValidUrl('https://www.example.com'); // true
 * isValidUrl('not-a-url'); // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查是否为有效的身份证号码（中国大陆）
 * @param idCard 待验证的身份证号码
 * @returns 是否为有效的身份证号码
 * 
 * @example
 * ```typescript
 * isValidIdCard('11010519491231002X'); // true
 * isValidIdCard('123456789012345678'); // false
 * ```
 */
export function isValidIdCard(idCard: string): boolean {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(idCard)) {
    return false;
  }

  // 18位身份证需要验证最后一位校验位
  if (idCard.length === 18) {
    const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
    const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码对应值
    let idCardWiSum = 0;

    for (let i = 0; i < 17; i++) {
      idCardWiSum += parseInt(idCard.substring(i, i + 1)) * idCardWi[i];
    }

    const idCardMod = idCardWiSum % 11;
    const idCardLast = idCard.substring(17).toUpperCase();

    if (idCardY[idCardMod] !== (idCardLast === 'X' ? 10 : parseInt(idCardLast))) {
      return false;
    }
  }

  return true;
}

/**
 * 检查是否为有效的密码强度
 * @param password 待验证的密码
 * @returns 密码强度等级（0-4，0为最弱，4为最强）
 * 
 * @example
 * ```typescript
 * getPasswordStrength('123'); // 0
 * getPasswordStrength('Password123!'); // 4
 * ```
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // 长度加分
  if (password.length >= 8) strength += 1;

  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 1;

  // 包含大写字母
  if (/[A-Z]/.test(password)) strength += 1;

  // 包含数字
  if (/[0-9]/.test(password)) strength += 1;

  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return Math.min(strength, 4);
}

/**
 * 检查是否为有效的IP地址
 * @param ip 待验证的IP地址
 * @returns 是否为有效的IP地址
 * 
 * @example
 * ```typescript
 * isValidIp('192.168.1.1'); // true
 * isValidIp('256.256.256.256'); // false
 * ```
 */
export function isValidIp(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 检查字符串是否为空或仅包含空白字符
 * @param str 待检查的字符串
 * @returns 是否为空字符串
 * 
 * @example
 * ```typescript
 * isEmpty(''); // true
 * isEmpty('   '); // true
 * isEmpty('hello'); // false
 * ```
 */
export function isEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim() === '';
}

/**
 * 检查值是否为空值（null、undefined、空字符串、空数组、空对象）
 * @param value 待检查的值
 * @returns 是否为空值
 * 
 * @example
 * ```typescript
 * isNil(null); // true
 * isNil(undefined); // true
 * isNil(''); // true
 * isNil([]); // true
 * isNil({}); // true
 * isNil(0); // false
 * isNil(false); // false
 * ```
 */
export function isNil(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
