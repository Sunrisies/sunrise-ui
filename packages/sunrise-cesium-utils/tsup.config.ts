import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["iife"], // 使用IIFE格式，确保所有代码被打包进一个文件
  outDir: "dist",
  minify: true,
  // 不设置external，让cesium被打包进最终文件
  bundle: true,
  splitting: false,
  // 添加全局变量，避免模块解析问题
  globalName: "SunriseCesiumUtils",
  // 将Cesium作为全局变量处理
  injectStyle: true,
});
