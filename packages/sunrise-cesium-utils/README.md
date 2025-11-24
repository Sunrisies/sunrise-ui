# @sunrise-ui/cesium-utils

Cesium utility library for Sunrise UI, providing a set of helper functions and classes for common Cesium operations.

## 安装

```bash
npm install @sunrise-ui/cesium-utils
```

## 功能特性

- **坐标转换工具** - 提供经纬度与笛卡尔坐标的相互转换，距离计算等功能
- **相机控制工具** - 提供相机飞行、跳转、位置获取等功能
- **模型管理工具** - 提供模型位置计算、查找、可见性控制等功能
- **屏幕坐标工具** - 提供屏幕坐标与地理坐标的相互转换，实体选择等功能
- **缓存工具** - 提供 Cesium 资源缓存功能，提高资源加载速度，减少网络请求

## 快速开始

### 基本使用

```javascript
import { CameraUtils, CoordinateUtils, ScreenUtils, ModelUtils, useCesiumCache } from '@sunrise-ui/cesium-utils';

// 初始化 Cesium
const viewer = new Cesium.Viewer('cesiumContainer');

// 使用相机工具
CameraUtils.flyTo(viewer, {
  destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000)
});

// 使用坐标转换
const cartesian = CoordinateUtils.lonLatToCartesian(116.39, 39.9, 0);
const lonLat = CoordinateUtils.cartesianToLonLat(cartesian);

// 使用缓存功能
const cache = useCesiumCache({
  dbName: 'MyCesiumCache',
  debug: true,
  types: ['blob', 'arraybuffer']
});
```

### 浏览器中使用

```html
<script src="https://cesium.com/downloads/cesiumjs/releases/1.135.0/Build/Cesium/Cesium.js"></script>
<script src="https://unpkg.com/@sunrise-ui/cesium-utils/dist/iife/index.js"></script>

<script>
  // 通过全局变量 SunriseCesiumUtils 访问工具函数
  const { CameraUtils, CoordinateUtils, useCesiumCache } = SunriseCesiumUtils;
  
  // 初始化 Cesium
  const viewer = new Cesium.Viewer('cesiumContainer');
  
  // 使用工具函数
  CameraUtils.flyTo(viewer, {
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000)
  });
</script>
```

## API 文档

### CameraUtils

相机控制工具，提供相机相关的操作方法。

#### flyTo(viewer, options)

飞行到指定位置。

- `viewer` - Cesium.Viewer 实例
- `options` - 飞行选项，包含目标位置、持续时间等

### CoordinateUtils

坐标转换工具，提供各种坐标系统的转换方法。

#### lonLatToCartesian(longitude, latitude, height)

将经纬度坐标转换为笛卡尔坐标。

- `longitude` - 经度
- `latitude` - 纬度
- `height` - 高度，默认为 0

#### cartesianToLonLat(cartesian)

将笛卡尔坐标转换为经纬度坐标。

- `cartesian` - 笛卡尔坐标

### ScreenUtils

屏幕坐标工具，提供屏幕坐标与地理坐标的转换方法。

#### screenToLonLat(viewer, screenPosition)

将屏幕坐标转换为经纬度坐标。

- `viewer` - Cesium.Viewer 实例
- `screenPosition` - 屏幕坐标 {x, y}

#### lonLatToScreen(viewer, longitude, latitude)

将经纬度坐标转换为屏幕坐标。

- `viewer` - Cesium.Viewer 实例
- `longitude` - 经度
- `latitude` - 纬度

### ModelUtils

模型管理工具，提供模型相关的操作方法。

#### calculateModelPosition(longitude, latitude, height, heading, pitch, roll, terrainProvider)

计算模型的位置矩阵。

- `longitude` - 经度
- `latitude` - 纬度
- `height` - 高度
- `heading` - 方位角
- `pitch` - 俯仰角
- `roll` - 翻滚角
- `terrainProvider` - 地形提供者

### useCesiumCache(config, Resource)

初始化 Cesium 资源缓存功能。

- `config` - 缓存配置
  - `dbName` - 数据库名称，默认为 'LocalStore'
  - `key` - 生成缓存键的回调函数
  - `types` - 需要缓存的响应类型，默认为 ['blob', 'arraybuffer']
  - `debug` - 是否开启调试模式，默认为 false
- `Resource` - Cesium.Resource 类，可选

返回值包含以下方法：
- `clear()` - 清除所有缓存
- `getCacheSize()` - 获取缓存大小

## 示例

更多示例请参考 [demo 目录](./demo)。
