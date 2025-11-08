// src/index.ts
import {
  Application,
  ParameterType,
  Converter,
  Context,
  EventDispatcher,
} from "typedoc";
import { VitePressRenderer } from "./VitePressRenderer";

export function load(app: Application) {
  // 注册插件选项
  app.options.addDeclaration({
    name: "vitepressOutput",
    help: "Output directory for VitePress documentation",
    type: ParameterType.String,
    defaultValue: "./docs/.vitepress/api",
  });

  app.options.addDeclaration({
    name: "vitepressBaseUrl",
    help: "Base URL for VitePress documentation",
    type: ParameterType.String,
    defaultValue: "/",
  });

  app.options.addDeclaration({
    name: "vitepressTitle",
    help: "Title for VitePress documentation",
    type: ParameterType.String,
    defaultValue: "API Documentation",
  });

  app.options.addDeclaration({
    name: "vitepressDescription",
    help: "Description for VitePress documentation",
    type: ParameterType.String,
    defaultValue: "Auto-generated API documentation",
  });

  //   在转换完成后生成 VitePress 文档
  (app.converter as EventDispatcher).on(
    Converter.EVENT_END,
    (context: Context) => {
      const renderer = new VitePressRenderer(app.options);
      renderer.renderProject(context.project);
    }
  );
}

// 导出类型供外部使用
export { VitePressRenderer } from "./VitePressRenderer";
export { FrontMatterGenerator } from "./FrontMatterGenerator";
export { SidebarGenerator } from "./SidebarGenerator";
