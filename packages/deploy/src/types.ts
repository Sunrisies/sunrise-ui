import * as os from "os";
import * as path from "path";

/**
 * 项目配置（用户只需填这些）
 */
export interface ProjectConfig {
  server: string;
  remote: string;
  local: string;
  /** Vite base 路径，"/" 表示根路径，"/ship" 表示子路径 */
  base: string;
  /** 构建命令，默认 "npm run build" */
  buildCommand?: string;
  /** 是否自动更新版本号，默认 true */
  versionUpdate?: boolean;
  /** 是否自动 git commit，默认 true */
  gitCommit?: boolean;
  /** 是否远程备份，默认 true */
  backup?: boolean;
}

export interface DeployConfig {
  projects: Record<string, ProjectConfig>;
}

export const deployDir = path.join(os.homedir(), "deploy");
export const defaultConfigPath = path.join(deployDir, "deploy.config.json");
