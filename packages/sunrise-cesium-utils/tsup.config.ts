import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["iife", "esm"], // 使用IIFE格式，确保所有代码被打包进一个文件
  outDir: "dist",
  minify: true,
  bundle: true,
  splitting: false,
  globalName: "SunriseCesiumUtils",
  injectStyle: true,
  // 为不同格式设置不同的输出文件名
  outExtension({ format }) {
    if (format === "iife") {
      return "[name].global";
    } else if (format === "esm") {
      return "[name].mjs";
    }
    return "[name]";
  },
  legacyOutput: true,
});
