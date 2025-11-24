import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["iife"], // 使用IIFE格式，确保所有代码被打包进一个文件
  outDir: "dist",
  minify: true,
  bundle: true,
  splitting: false,
  globalName: "SunriseCesiumUtils",
  injectStyle: true,
  outExtension({ format, options }) {
    return {
      js: options.minify ? ".min.js" : `.js`,
    };
  },
});
