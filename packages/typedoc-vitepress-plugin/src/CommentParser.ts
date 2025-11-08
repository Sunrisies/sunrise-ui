// src/CommentParser.ts
import {
  DeclarationReflection,
  Comment,
  SignatureReflection,
  ReflectionKind,
} from "typedoc";

export class CommentParser {
  /**
   * 从反射体中提取模块信息
   */
  static getModule(reflection: DeclarationReflection): string | null {
    console.log(JSON.stringify(reflection.comment, null, 2));
    console.log("----------------------------------分割线--------------");
    // 检查反射体本身的注释
    const reflectionModule = this.extractModuleFromComment(reflection.comment);
    if (reflectionModule) return reflectionModule;

    // 检查函数签名的注释
    if (reflection.signatures) {
      for (const signature of reflection.signatures) {
        const signatureModule = this.extractModuleFromComment(
          signature.comment
        );
        if (signatureModule) return signatureModule;
      }
    }

    // 检查类型声明中的签名（针对函数类型的变量）
    if (
      reflection.type?.type === "reflection" &&
      reflection.type.declaration?.signatures
    ) {
      for (const signature of reflection.type.declaration.signatures) {
        const signatureModule = this.extractModuleFromComment(
          signature.comment
        );
        if (signatureModule) return signatureModule;
      }
    }

    return null;
  }

  /**
   * 从反射体中提取函数描述
   */
  static getFunctionDescription(
    reflection: DeclarationReflection
  ): string | null {
    // 检查反射体本身的注释
    const reflectionDescription = this.extractFunctionDescriptionFromComment(
      reflection.comment
    );
    if (reflectionDescription) return reflectionDescription;

    // 检查函数签名的注释
    if (reflection.signatures) {
      for (const signature of reflection.signatures) {
        const signatureDescription = this.extractFunctionDescriptionFromComment(
          signature.comment
        );
        if (signatureDescription) return signatureDescription;

        // 如果没有 @function 标签，使用签名的简短描述
        if (signature.comment?.shortText) {
          return signature.comment.shortText;
        }
      }
    }

    // 检查类型声明中的签名（针对函数类型的变量）
    if (
      reflection.type?.type === "reflection" &&
      reflection.type.declaration?.signatures
    ) {
      for (const signature of reflection.type.declaration.signatures) {
        const signatureDescription = this.extractFunctionDescriptionFromComment(
          signature.comment
        );
        if (signatureDescription) return signatureDescription;

        // 如果没有 @function 标签，使用签名的简短描述
        if (signature.comment?.shortText) {
          return signature.comment.shortText;
        }
      }
    }

    return null;
  }

  /**
   * 从注释中提取模块信息
   */
  private static extractModuleFromComment(
    comment: Comment | undefined
  ): string | null {
    console.log(comment?.tags, "==============================");
    if (!comment?.blockTags) return null;
    const memberofTag = comment.blockTags.find(
      (tag) => tag.tag === "@memberof"
    );
    console.log("------------------", memberofTag);
    if (memberofTag) {
      const moduleMatch = memberofTag.content[0].text.match(/module:([^\s]+)/);
      console.log(moduleMatch, "moduleMatch");
      if (moduleMatch) {
        return moduleMatch[1];
      }
      return memberofTag.text.trim();
    }

    return null;
  }

  /**
   * 从注释中提取函数描述
   */
  private static extractFunctionDescriptionFromComment(
    comment: Comment | undefined
  ): string | null {
    if (!comment?.tags) return null;

    const functionTag = comment.tags.find((tag) => tag.tagName === "function");
    if (functionTag) {
      return functionTag.text.trim().replace(/。$/, "");
    }

    return null;
  }

  /**
   * 获取完整的描述信息（包括简短描述和详细描述）
   */
  static getFullDescription(reflection: DeclarationReflection): string {
    // 优先使用函数描述
    const functionDescription = this.getFunctionDescription(reflection);
    if (functionDescription) {
      return functionDescription;
    }

    // 检查反射体本身的注释
    if (reflection.comment) {
      const fullText = [reflection.comment.shortText, reflection.comment.text]
        .filter(Boolean)
        .join("\n\n");

      if (fullText) {
        return fullText;
      }
    }

    // 检查函数签名的注释
    if (reflection.signatures) {
      for (const signature of reflection.signatures) {
        if (signature.comment) {
          const fullText = [signature.comment.shortText, signature.comment.text]
            .filter(Boolean)
            .join("\n\n");

          if (fullText) {
            return fullText;
          }
        }
      }
    }

    // 默认描述
    const kindName = ReflectionKind[reflection.kind].toLowerCase();
    return `${reflection.name} ${kindName}`;
  }
}
