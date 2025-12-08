#!/usr/bin/env node

import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import figlet from "figlet";
import { program } from "commander";
import inquirer from "inquirer";
import archiver from "archiver";
import dotenv from "dotenv";
import os from "os";
import { fileURLToPath } from "url";

interface DefaultConfig {
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

interface ProjectConfig {
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

interface DeployConfig {
  default: DefaultConfig;
  projects: Record<string, ProjectConfig>;
}
const deployDir = path.join(os.homedir(), "deploy");
const defaultConfigPath = path.join(deployDir, "deploy.config.json");

class Deployer {
  private config: DeployConfig;
  private currentProject: string;
  private configFilePath: string;
  constructor(configPath?: string) {
    // 在c盘下面创建一个deploy目录
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir);
    }
    this.config = {} as DeployConfig;
    this.currentProject = "";
    this.configFilePath = "";
    this.loadConfig(configPath);
  }

  private loadConfig(configPath?: string): void {
    // 默认配置文件路径
    this.configFilePath = configPath || defaultConfigPath;

    try {
      // 尝试加载配置文件
      if (fs.existsSync(this.configFilePath)) {
        const configContent = fs.readFileSync(this.configFilePath, "utf-8");
        this.config = JSON.parse(configContent);
        console.log(chalk.green(`✅ 已加载配置文件: ${this.configFilePath}`));
      } else {
        console.log(chalk.red(`❌ 配置文件不存在: ${this.configFilePath}`));
        console.log(
          chalk.yellow(`💡 请参考 deploy.config.example.json 创建配置文件`)
        );
        process.exit(1);
      }
    } catch (error) {
      console.log(chalk.red(`❌ 配置文件加载失败:`), error);
      process.exit(1);
    }
  }

  private async selectProject(): Promise<string> {
    const projectNames = Object.keys(this.config.projects);

    if (projectNames.length === 0) {
      console.log(chalk.red("❌ 配置文件中没有找到任何项目"));
      process.exit(1);
    }

    if (projectNames.length === 1) {
      console.log(chalk.green(`✅ 自动选择唯一项目: ${projectNames[0]}`));
      return projectNames[0];
    }

    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "请选择要部署的项目:",
        choices: projectNames,
      },
    ]);

    return project;
  }

  private getProjectConfig(projectName: string): {
    server: string;
    remote: string;
    local: string;
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
      extract: {
        enabled: boolean;
        command?: string;
        description?: string;
      };
    };
  } {
    const defaultConfig = this.config.default;
    const projectConfig = this.config.projects[projectName];

    // 合并默认配置和项目特定配置
    return {
      server: projectConfig.server,
      remote: projectConfig.remote,
      local: projectConfig.local,
      zip: defaultConfig.zip,
      buildCommand: defaultConfig.buildCommand,
      steps: {
        ...defaultConfig.steps,
        extract: projectConfig.steps.extract,
      },
    };
  }

  private displayHeader(): void {
    console.log(
      chalk.cyan(
        figlet.textSync("Sunrise Deploy", { horizontalLayout: "full" })
      )
    );
    console.log(chalk.gray("自动化部署工具 - TypeScript版本\n"));
  }

  private async executeCommand(
    command: string,
    description: string,
    options?: { silent?: boolean; cwd?: string }
  ): Promise<boolean> {
    console.log(chalk.cyan(`\n====== ${description} ======${command}`));

    if (!options?.silent) {
      console.log(chalk.gray(`执行命令: ${command}`));
    }

    return new Promise((resolve) => {
      const child = spawn(command, [], {
        shell: true,
        stdio: options?.silent ? "pipe" : "inherit",
        cwd: options?.cwd,
      });

      child.on("close", (code) => {
        console.log(code, "==========");
        if (code === 0) {
          console.log(chalk.green(`✅ ${description}完成`));
          resolve(true);
        } else {
          console.log(chalk.red(`❌ ${description}失败`));
          resolve(false);
        }
      });

      child.on("error", (error) => {
        console.log(chalk.red(`❌ 执行${description}时发生错误:`), error);
        resolve(false);
      });
    });
  }

  private async zipDirectory(
    sourceDir: string,
    outPath: string
  ): Promise<boolean> {
    console.log(chalk.cyan(`\n====== 压缩文件 ======`));
    console.log(chalk.gray(`源目录: ${sourceDir}`));
    console.log(chalk.gray(`输出文件: ${outPath}`));

    return new Promise((resolve) => {
      const output = fs.createWriteStream(outPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(
          chalk.green(`✅ 压缩完成，总大小: ${archive.pointer()} bytes`)
        );
        resolve(true);
      });

      archive.on("error", (err) => {
        console.log(chalk.red(`❌ 压缩时发生错误:`), err);
        resolve(false);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  private replaceVariables(command: string, config: any): string {
    return command
      .replace(/\$SERVER/g, config.server)
      .replace(/\$REMOTE/g, config.remote)
      .replace(/\$ZIP/g, config.zip);
  }

  async deploy(): Promise<void> {
    this.displayHeader();

    // 选择项目
    this.currentProject = await this.selectProject();
    const projectConfig = this.getProjectConfig(this.currentProject);

    console.log(chalk.cyan(`\n当前项目: ${this.currentProject}`));
    console.log(chalk.gray(`服务器: ${projectConfig.server}`));
    console.log(chalk.gray(`远程路径: ${projectConfig.remote}`));
    console.log(chalk.gray(`本地路径: ${projectConfig.local}\n`));

    // 确认部署
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "确定要开始部署吗？",
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.gray("👋 部署已取消"));
      return;
    }

    let success = true;

    // Step 1: 远程备份
    if (projectConfig.steps.backup.enabled) {
      const command = this.replaceVariables(
        projectConfig.steps.backup.command || "",
        projectConfig
      );
      success = await this.executeCommand(
        `ssh "${projectConfig.server}" "${command}"`,
        projectConfig.steps.backup.description || "远程备份旧dist",
        { silent: true }
      );
      if (!success) return;
    }

    // Step 2: 本地构建
    if (projectConfig.steps.build.enabled) {
      success = await this.executeCommand(
        projectConfig.buildCommand,
        projectConfig.steps.build.description || "本地build",
        { cwd: projectConfig.local }
      );
      if (!success) return;
    }

    // Step 3: 压缩
    if (projectConfig.steps.zip.enabled) {
      const distPath = path.join(projectConfig.local, "dist");
      const zipPath = path.join(projectConfig.local, projectConfig.zip);
      success = await this.zipDirectory(distPath, zipPath);
      if (!success) return;
    }

    // Step 4: 上传
    if (projectConfig.steps.upload.enabled) {
      const localZipPath = path.join(projectConfig.local, projectConfig.zip);
      const remoteZipPath = `${projectConfig.remote}/dist/${projectConfig.zip}`;
      success = await this.executeCommand(
        `scp "${localZipPath}" "${projectConfig.server}:${remoteZipPath}"`,
        projectConfig.steps.upload.description || "上传文件"
      );
      if (!success) return;
    }

    // Step 5: 远程解压并清理
    if (projectConfig.steps.extract.enabled) {
      const command = this.replaceVariables(
        projectConfig.steps.extract.command || "",
        projectConfig
      );
      success = await this.executeCommand(
        `ssh "${projectConfig.server}" "${command}"`,
        projectConfig.steps.extract.description || "远程解压并清理",
        { silent: true }
      );
      if (!success) return;
    }

    console.log(chalk.green("\n====== 发布完成 ======"));
  }

  async interactiveMode(): Promise<void> {
    this.displayHeader();

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "请选择操作:",
        choices: [
          { name: "🚀 开始部署", value: "deploy" },
          { name: "⚙️ 配置管理", value: "config" },
          { name: "❌ 退出", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "deploy":
        await this.deploy();
        break;
      case "config":
        await this.manageConfig();
        break;
      case "exit":
        console.log(chalk.gray("👋 再见！"));
        return;
    }
  }

  async manageConfig(): Promise<void> {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "配置管理:",
        choices: [
          { name: "📋 查看当前配置", value: "view" },
          { name: "📝 编辑配置文件", value: "edit" },
          { name: "🔙 返回主菜单", value: "back" },
        ],
      },
    ]);

    switch (action) {
      case "view":
        console.log(chalk.cyan("\n当前配置:"));
        console.log(JSON.stringify(this.config, null, 2));
        await this.manageConfig();
        break;
      case "edit":
        const configPath = path.join(this.configFilePath);
        console.log(chalk.yellow(`\n请手动编辑配置文件: ${configPath}`));
        await this.manageConfig();
        break;
      case "back":
        await this.interactiveMode();
        break;
    }
  }
}

// 主函数
async function main(): Promise<void> {
  try {
    program
      .name("sunrise-deploy")
      .description("自动化部署工具")
      .version("1.0.0")
      .option("-c, --config <path>", "指定配置文件路径")
      .action(async (options) => {
        const deployer = new Deployer(options?.config);
        await deployer.interactiveMode();
      });

    await program.parseAsync(process.argv);
  } catch (error) {
    console.log(chalk.red("\n❌ 程序执行出错:"), error);
    process.exit(1);
  }
}

// 运行程序
main().catch(console.error);
