import { defineConfig } from "tsup";
import { glob } from "glob";
import path from "path";

// 获取所有组件的入口文件
async function getEntries() {
  const componentDirs = await glob("src/components/*/index.{ts,tsx}");
  const entries: Record<string, string> = {};

  // 添加主入口
  entries["index"] = "src/index.ts";

  // 添加每个组件的入口
  componentDirs.forEach((file) => {
    const componentName = path.basename(path.dirname(file));
    entries[componentName] = file;
  });

  return entries;
}

export default defineConfig(async () => {
  const entries = await getEntries();
  console.log(entries);
  return {
    entry: entries,
    dts: true,
    format: ["esm"],
    outDir: "dist",
    clean: true, // 构建前清理dist目录
    splitting: false, // 禁用代码分割，确保每个组件独立
  };
});
