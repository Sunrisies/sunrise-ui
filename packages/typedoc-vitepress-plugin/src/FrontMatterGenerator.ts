import { ReflectionKind, DeclarationReflection } from "typedoc";
import { VitePressOptions } from "./types";
import { CommentParser } from "./CommentParser";

export class FrontMatterGenerator {
  static generate(
    reflection: DeclarationReflection,
    options: VitePressOptions
  ): string {
    const module = CommentParser.getModule(reflection);
    const functionDescription = CommentParser.getModule(reflection, "@func");

    const frontmatter: Record<string, any> = {
      title: reflection.name,
      description: functionDescription,
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
    }

    return `---\n${this.stringifyFrontmatter(frontmatter)}---\n\n`;
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
