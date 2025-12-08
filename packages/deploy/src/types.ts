import * as os from "os";
import * as path from "path";

export interface DefaultConfig {
  zip: string;
  buildCommand: string;
  steps: {
    backup: {
      enabled: boolean;
      command?: string;
      description?: string;
    };
    build: {
      enabled: boolean;
      description?: string;
    };
    zip: {
      enabled: boolean;
      description?: string;
    };
    upload: {
      enabled: boolean;
      description?: string;
    };
  };
}

export interface ProjectConfig {
  server: string;
  remote: string;
  local: string;
  steps: {
    extract: {
      enabled: boolean;
      command?: string;
      description?: string;
    };
  };
}

export interface DeployConfig {
  default: DefaultConfig;
  projects: Record<string, ProjectConfig>;
}

export const deployDir = path.join(os.homedir(), "deploy");
export const defaultConfigPath = path.join(deployDir, "deploy.config.json");
