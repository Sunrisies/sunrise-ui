// 方案1：将 cesium 改为基类
class CesiumBase {
  private static initialized = false;
  static init() {
    if (!this.initialized) {
      console.log("init");
      this.initialized = true;
    }
  }
  constructor() {
    CesiumBase.init();
  }

  // 其他共享方法
  protected someMethod() {
    console.log("some method");
  }
}

class Cesium extends CesiumBase {
  constructor() {
    super();
    console.log("cesium");
    // this.init();
  }
}

class Cesium2 extends CesiumBase {
  constructor() {
    super();
    console.log("cesium2");
    // this.init(); // 手动调用需要的方法
  }
}

new Cesium2();
new Cesium();
new CesiumBase();
