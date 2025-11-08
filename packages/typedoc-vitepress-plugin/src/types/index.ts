// src/types/index.ts
export interface VitePressOptions {
  outputDir: string;
  baseUrl: string;
  title: string;
  description: string;
  themeConfig?: {
    nav?: Array<{ text: string; link: string }>;
    sidebar?: any;
  };
  frontmatter?: Record<string, any>;
}

export interface RenderContext {
  reflection: any;
  options: VitePressOptions;
  outputPath: string;
}
// 新增模块信息接口
export interface ModuleInfo {
  name: string;
  description?: string;
  items: Array<{
    name: string;
    description: string;
    link: string;
    kind: string;
  }>;
}
