# sunrise-utils

一个使用 TypeScript 构建的浏览器/通用工具函数库，提供日期、格式化、字符串、计时器与地图相关方法，以及浏览器端的 DOM、HTTP、图片处理、文件操作、本地存储等工具。内置文档与测试流程。

## 安装与开发
- 安装依赖（在仓库根目录）：`pnpm install`
- 开发监听：`pnpm --filter sunrise-utils dev`
- TypeScript 编译：`pnpm --filter sunrise-utils tsc`
- 单元测试（Jest/Vitest，按包内配置）：`pnpm --filter sunrise-utils test`
- 覆盖率报告：`pnpm --filter sunrise-utils coverage`
- 文档生成（Typedoc）：`pnpm --filter sunrise-utils typedoc`
- 文档站点（VitePress）：
  - 开发：`pnpm --filter sunrise-utils docs:dev`
  - 构建：`pnpm --filter sunrise-utils docs:build`
  - 预览：`pnpm --filter sunrise-utils docs:preview`

覆盖率报告输出在 `packages/utils/coverage/`。

## 模块结构
- 浏览器模块：`browser/dom`、`browser/http`、`browser/images`、`browser/file`、`browser/storage`
- 通用模块：`common/date`、`common/format`、`common/string`、`common/timer`、`common/activity`、`common/validation`、`common/crypto`
- 地图相关：`common/map/*`（坐标转换、距离计算、点生成等）

## 使用示例

### 日期时间处理
```ts
import { getRelativeTime, formatDate } from 'sunrise-utils'

getRelativeTime(new Date(Date.now() - 2 * 60_000)) // "2分钟前"
getRelativeTime(new Date(Date.now() + 60_000), { locale: 'en-US' }) // "in 1 minute"

formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2023-11-25 14:30:45"
```

### 数据格式化
```ts
import { formatBytes, formatNumber } from 'sunrise-utils'

formatBytes(1024) // "1 KB"
formatBytes(1024, { base: 1024, useIECUnits: true }) // "1 KiB"

formatNumber(1234567) // "1,234,567"
formatNumber(0.12345, { digits: 2, percent: true }) // "12.35%"
```

### 字符串处理
```ts
import { truncate, capitalize, genRandStr } from 'sunrise-utils'

truncate('这是一个很长的字符串', 10) // "这是一个很..."
capitalize('hello world') // "Hello world"
genRandStr(16) // "aB3fG7hJ9kL2mN4"
```

### 数据验证
```ts
import { isValidEmail, isValidPhone, getPasswordStrength } from 'sunrise-utils'

isValidEmail('user@example.com') // true
isValidEmail('invalid-email') // false

isValidPhone('13812345678') // true
isValidPhone('123456') // false

getPasswordStrength('Password123!') // 4 (强)
getPasswordStrength('123') // 0 (弱)
```

### 文件操作
```ts
import { getFileExtension, formatFileSize, readFileAsDataURL, downloadFile } from 'sunrise-utils'

getFileExtension('document.pdf') // 'pdf'
formatFileSize(123456789) // '117.74 MB'

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  const dataUrl = await readFileAsDataURL(file);
  console.log(dataUrl); // "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}

downloadFile('https://example.com/file.pdf', 'document.pdf');
```

### 本地存储
```ts
import { setStorageItem, getStorageItem, StorageManager } from 'sunrise-utils'

// 简单存储
setStorageItem('username', 'john_doe');
setStorageItem('token', 'abc123', 3600000); // 1小时后过期

const username = getStorageItem('username'); // 'john_doe'

// 使用存储管理类
const userStorage = new StorageManager('user');
userStorage.set('preferences', { theme: 'dark' });
const prefs = userStorage.get('preferences'); // { theme: 'dark' }
```

### 加密工具
```ts
import { base64Encode, xorEncrypt, generateUUID, generatePasswordHash } from 'sunrise-utils'

base64Encode('Hello, world!') // 'SGVsbG8sIHdvcmxkIQ=='

const encrypted = xorEncrypt('Secret message', 'myKey');
const decrypted = xorDecrypt(encrypted, 'myKey'); // 'Secret message'

generateUUID() // '550e8400-e29b-41d4-a716-446655440000'

const { salt, hash } = await generatePasswordHash('myPassword');
```

### 浏览器工具
```ts
import { loadImage, getContentDimensions } from 'sunrise-utils'

const img = await loadImage('https://example.com/a.png')

const dimensions = getContentDimensions('my-element');
if (!(dimensions instanceof Error)) {
  console.log(`宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
}
```

## 其他
- 发布与推送脚本参考包内 `publish.js`、`docs:push` 等命令
- 建议在 Monorepo 中通过 `pnpm --filter sunrise-utils <cmd>` 精准运行