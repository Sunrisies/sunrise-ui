// src/SidebarGenerator.ts
import {
  ProjectReflection,
  ReflectionKind,
  DeclarationReflection,
} from "typedoc";
import { VitePressOptions, ModuleInfo } from "./types";

export class SidebarGenerator {
  static generate(project: ProjectReflection, options: VitePressOptions): any {
    const modules: Record<string, ModuleInfo> = {};

    if (project.children) {
      // 首先按模块分组
      for (const reflection of project.children) {
        const moduleName = this.getModule(reflection) || "Global";
        const itemDescription = this.getItemDescription(reflection);

        if (!modules[moduleName]) {
          modules[moduleName] = {
            name: moduleName,
            description: this.getModuleDescription(moduleName),
            items: [],
          };
        }

        modules[moduleName].items.push({
          name: reflection.name,
          description: itemDescription,
          link: this.getLink(reflection, options),
          kind: ReflectionKind[reflection.kind],
        });
      }
    }

    // 转换为 VitePress 侧边栏格式
    return this.convertToVitePressSidebar(modules, options);
  }

  /**
   * 提取模块信息
   */
  private static getModule(reflection: DeclarationReflection): string | null {
    const memberofTag = reflection.comment?.tags?.find(
      (tag) => tag.tagName === "memberof"
    );

    if (memberofTag) {
      const moduleMatch = memberofTag.text.match(/module:([^\s]+)/);
      if (moduleMatch) {
        return moduleMatch[1];
      }
      return memberofTag.text.trim();
    }

    return null;
  }

  /**
   * 获取模块描述
   */
  private static getModuleDescription(moduleName: string): string {
    const moduleDescriptions: Record<string, string> = {
      "browser/http": "浏览器 HTTP 请求工具",
      browser: "浏览器相关工具",
      common: "通用工具函数",
      utils: "工具函数集合",
      // 可以继续添加更多模块描述
    };

    return moduleDescriptions[moduleName] || `${moduleName} 模块`;
  }

  /**
   * 获取项目描述
   */
  private static getItemDescription(reflection: DeclarationReflection): string {
    // 优先使用 @function 标签
    const functionTag = reflection.comment?.tags?.find(
      (tag) => tag.tagName === "function"
    );

    if (functionTag) {
      return functionTag.text.trim().replace(/。$/, "");
    }

    // 使用注释的简短描述
    if (reflection.comment?.shortText) {
      return reflection.comment.shortText;
    }

    // 检查函数签名中的注释
    if (
      reflection.type?.type === "reflection" &&
      reflection.type.declaration?.signatures
    ) {
      const signature = reflection.type.declaration.signatures[0];
      if (signature.comment?.shortText) {
        return signature.comment.shortText;
      }
    }

    // 默认描述
    const kindName = ReflectionKind[reflection.kind].toLowerCase();
    return `${reflection.name} ${kindName}`;
  }

  /**
   * 转换为 VitePress 侧边栏格式
   */
  private static convertToVitePressSidebar(
    modules: Record<string, ModuleInfo>,
    options: VitePressOptions
  ): any {
    const sidebarItems: any[] = [];

    // 按模块名称排序
    const sortedModuleNames = Object.keys(modules).sort();

    for (const moduleName of sortedModuleNames) {
      const module = modules[moduleName];

      // 对模块内的项目按名称排序
      module.items.sort((a, b) => a.name.localeCompare(b.name));

      sidebarItems.push({
        text: module.name,
        collapsible: true,
        collapsed: false,
        items: module.items.map((item) => ({
          text: item.description, // 使用函数描述作为显示文本
          link: item.link,
        })),
      });
    }

    return {
      "/api/": sidebarItems,
    };
  }

  private static getLink(
    reflection: DeclarationReflection,
    options: VitePressOptions
  ): string {
    const kind = ReflectionKind[reflection.kind].toLowerCase();
    const name = reflection.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `/api/${kind}-${name}`;
  }
}
