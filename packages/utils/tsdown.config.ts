import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  // dts: false,
  format: ["esm"],
  external: ["mapbox-gl"],
  outDir: "dist",
  minify: true,
  clean: false,
  target: false,
  treeshake:true
});
