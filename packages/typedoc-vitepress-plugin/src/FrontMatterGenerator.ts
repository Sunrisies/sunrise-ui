// src/FrontMatterGenerator.ts
import { ReflectionKind, DeclarationReflection } from "typedoc";
import { VitePressOptions } from "./types";

export class FrontMatterGenerator {
  static generate(
    reflection: DeclarationReflection,
    options: VitePressOptions
  ): string {
    const module = this.getModule(reflection);
    const functionDescription = this.getFunctionDescription(reflection);

    const frontmatter: Record<string, any> = {
      title: reflection.name,
      description: functionDescription || this.getDescription(reflection),
      ...options.frontmatter,
    };

    // 添加模块信息
    if (module) {
      frontmatter.module = module;
    }

    // 根据类型添加特定字段
    switch (reflection.kind) {
      case ReflectionKind.Class:
        frontmatter.pageClass = "api-page class-page";
        frontmatter.sidebar = "auto";
        break;
      case ReflectionKind.Interface:
        frontmatter.pageClass = "api-page interface-page";
        break;
      case ReflectionKind.Function:
        frontmatter.pageClass = "api-page function-page";
        break;
      case ReflectionKind.Variable:
        frontmatter.pageClass = "api-page variable-page";
        // 如果是函数类型的变量，添加函数相关标签
        if (
          reflection.type?.type === "reflection" &&
          reflection.type.declaration?.signatures
        ) {
          frontmatter.tags = ["function", "async"];
        }
        break;
      case ReflectionKind.Component:
        frontmatter.pageClass = "api-page component-page";
        break;
    }

    return `---\n${this.stringifyFrontmatter(frontmatter)}---\n\n`;
  }

  /**
   * 提取模块信息
   */
  private static getModule(reflection: DeclarationReflection): string | null {
    // 从 @memberof 标签提取模块
    const memberofTag = reflection.comment?.tags?.find(
      (tag) => tag.tagName === "memberof"
    );

    if (memberofTag) {
      // 提取模块名称，例如 "module:browser/http" -> "browser/http"
      const moduleMatch = memberofTag.text.match(/module:([^\s]+)/);
      if (moduleMatch) {
        return moduleMatch[1];
      }
      return memberofTag.text.trim();
    }

    return null;
  }

  /**
   * 提取函数描述
   */
  private static getFunctionDescription(
    reflection: DeclarationReflection
  ): string | null {
    // 从 @function 标签提取函数描述
    const functionTag = reflection.comment?.tags?.find(
      (tag) => tag.tagName === "function"
    );

    if (functionTag) {
      return functionTag.text.trim().replace(/。$/, ""); // 去掉句尾的句号
    }

    return null;
  }

  private static getDescription(reflection: DeclarationReflection): string {
    // 优先使用注释的简短描述
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

    // 使用默认描述
    const kindName = ReflectionKind[reflection.kind].toLowerCase();
    return `${reflection.name} ${kindName}`;
  }

  private static stringifyFrontmatter(
    frontmatter: Record<string, any>
  ): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(frontmatter)) {
      if (typeof value === "string") {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      } else if (typeof value === "number" || typeof value === "boolean") {
        lines.push(`${key}: ${value}`);
      } else if (Array.isArray(value)) {
        lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
      } else if (typeof value === "object" && value !== null) {
        lines.push(`${key}:`);
        for (const [subKey, subValue] of Object.entries(value)) {
          lines.push(`  ${subKey}: "${subValue}"`);
        }
      }
    }

    return lines.join("\n") + "\n";
  }
}
