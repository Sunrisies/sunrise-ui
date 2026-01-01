import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import {
  executeCommand,
  replaceVariables,
  zipDirectory,
  displayHeader,
  gitCommit,
  updatePackageVersion,
  revertPackageVersion,
  getCurrentVersion,
} from "./utils";
import { ConfigManager } from "./config";

export class Deployer {
  private configManager: ConfigManager;
  private currentProject: string;

  constructor(configPath?: string) {
    this.configManager = new ConfigManager(configPath);
    this.currentProject = "";
  }

  /**
   * 获取项目配置
   * @param projectName 项目名称
   * @returns 项目配置
   */
  private getProjectConfig(projectName: string): {
    server: string;
    remote: string;
    local: string;
    zip: string;
    buildCommand: string;
    versionUpdate: {
      enabled: boolean;
      type: "major" | "minor" | "patch";
      description?: string;
    };
    steps: {
      gitCommit: {
        enabled: boolean;
        message?: string;
        description?: string;
      };
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
    const config = this.configManager.getConfig();
    const defaultConfig = config.default;
    const projectConfig = config.projects[projectName];

    // 合并默认配置和项目特定配置
    return {
      server: projectConfig.server,
      remote: projectConfig.remote,
      local: projectConfig.local,
      zip: defaultConfig.zip,
      buildCommand: defaultConfig.buildCommand,
      versionUpdate: defaultConfig.versionUpdate,
      steps: {
        ...defaultConfig.steps,
        extract: projectConfig.steps.extract,
      },
    };
  }

  /**
   * 执行部署
   */
  async deploy(): Promise<void> {
    displayHeader();

    // 选择项目
    this.currentProject = await this.configManager.selectProject();
    const projectConfig = this.getProjectConfig(this.currentProject);

    console.log(
      chalk.cyan(`
当前项目: ${this.currentProject}`)
    );
    console.log(chalk.gray(`服务器: ${projectConfig.server}`));
    console.log(chalk.gray(`远程路径: ${projectConfig.remote}`));
    console.log(
      chalk.gray(`本地路径: ${projectConfig.local}
`)
    );

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
    let originalVersion: string | null = null;
    let newVersion: string | null = null;
    let versionUpdateSuccess = false;

    // ✅ Step 1: 先本地构建（确保代码可构建）
    if (projectConfig.steps.build.enabled) {
      success = await executeCommand(
        projectConfig.buildCommand,
        projectConfig.steps.build.description || "本地build",
        { cwd: projectConfig.local }
      );
      if (!success) {
        console.log(chalk.red("构建失败，停止部署"));
        return;
      }
    }

    // ✅ Step 2: 版本自动更新（在构建成功后）
    if (projectConfig.versionUpdate.enabled) {
      originalVersion = getCurrentVersion(projectConfig.local);
      if (originalVersion) {
        console.log(chalk.cyan(`当前版本: ${originalVersion}`));
        newVersion = await updatePackageVersion(
          projectConfig.local,
          projectConfig.versionUpdate.type
        );
        if (newVersion) {
          versionUpdateSuccess = true;
          console.log(
            chalk.green(`✅ 版本已更新: ${originalVersion} → ${newVersion}`)
          );
        } else {
          console.log(chalk.yellow("⚠️ 版本更新失败，继续部署流程"));
        }
      } else {
        console.log(chalk.yellow("⚠️ 无法获取当前版本，跳过版本更新"));
      }
    }

    // ✅ Step 3: Git 自动提交（可选，如果版本更新成功）
    if (projectConfig.steps.gitCommit?.enabled) {
      // 优先使用新版本号，如果没有则使用原始版本号，如果都没有则使用时间戳
      const versionInfo =
        newVersion || originalVersion || new Date().toLocaleString();
      const commitMessage =
        projectConfig.steps.gitCommit.message ||
        `chore: auto commit before deploy - v${versionInfo}`;
      success = await gitCommit(projectConfig.local, commitMessage);
      if (!success) {
        console.log(chalk.yellow("⚠️ Git 提交失败，但继续部署流程"));
        // Git 提交失败不影响部署流程
      }
    }

    // ✅ Step 4: 压缩构建产物
    if (projectConfig.steps.zip.enabled) {
      const distPath = path.join(projectConfig.local, "dist");
      const zipPath = path.join(projectConfig.local, projectConfig.zip);
      success = await zipDirectory(distPath, zipPath);
      if (!success) {
        // 如果失败且版本已更新，回退版本
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 压缩失败，回退版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
        }
        return;
      }
    }

    // ✅ Step 5: 上传到服务器临时位置（不影响当前线上版本）
    if (projectConfig.steps.upload.enabled) {
      const localZipPath = path.join(projectConfig.local, projectConfig.zip);
      const remoteTempPath = `${projectConfig.remote}/temp/${projectConfig.zip}`;

      // 先上传到临时目录
      success = await executeCommand(
        `ssh "${projectConfig.server}" "mkdir -p ${projectConfig.remote}/temp"`,
        "创建临时目录"
      );

      success = await executeCommand(
        `scp "${localZipPath}" "${projectConfig.server}:${remoteTempPath}"`,
        projectConfig.steps.upload.description || "上传文件到临时目录"
      );
      if (!success) {
        // 如果失败且版本已更新，回退版本
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 上传失败，回退版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
        }
        return;
      }
    }

    // ✅ Step 6: 远程备份当前线上版本（此时本地构建已成功）
    if (projectConfig.steps.backup.enabled) {
      const command = replaceVariables(
        projectConfig.steps.backup.command || "",
        projectConfig
      );
      success = await executeCommand(
        `ssh "${projectConfig.server}" "${command}"`,
        projectConfig.steps.backup.description || "备份当前线上版本",
        { silent: true }
      );
      if (!success) {
        console.log(chalk.yellow("⚠️ 备份失败，但新版本已准备好"));
        // 备份失败不影响后续流程
      }
    }

    // ✅ Step 7: 切换版本（原子操作）
    if (projectConfig.steps.extract.enabled) {
      // 使用原子操作替换线上版本
      const command = `cd ${projectConfig.remote}/temp && unzip ${projectConfig.remote}/temp/${projectConfig.zip} && mv ${projectConfig.remote}/temp/* ${projectConfig.remote}/dist && rm -rf ${projectConfig.remote}/temp`;

      success = await executeCommand(
        `ssh "${projectConfig.server}" "${command}"`,
        "原子切换版本",
        { silent: true }
      );
      if (!success) {
        console.log(chalk.red("❌ 切换版本失败，请手动处理"));

        // 关键步骤失败，回退本地版本
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 自动回退本地版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
          console.log(chalk.red("❌ 部署失败，版本已回退"));
        }
        return;
      }
    }

    // 部署成功
    console.log(chalk.green("====== 发布完成 ======"));
    if (newVersion) {
      console.log(chalk.green(`✅ 新版本 ${newVersion} 已成功部署`));
    }
    process.exit(0);
  }

  /**
   * 配置管理
   */
  async manageConfig(): Promise<void> {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "配置管理:",
        choices: [
          { name: "📋 查看当前配置", value: "view" },
          { name: "📝 新增项目配置", value: "add" },
          { name: "📝 删除项目配置", value: "delete" },
          { name: "🔙 返回主菜单", value: "back" },
        ],
      },
    ]);

    switch (action) {
      case "view":
        await this.configManager.viewConfig();
        await this.manageConfig();
        break;
      case "add":
        await this.configManager.addProject();
        await this.manageConfig();
        break;
      case "delete":
        await this.configManager.deleteProject();
        await this.manageConfig();
        break;
      case "back":
        await this.interactiveMode();
        break;
    }
  }

  /**
   * 交互式模式
   */
  async interactiveMode(): Promise<void> {
    displayHeader();

    // 检查是否有项目配置
    const config = this.configManager.getConfig();
    const hasProjects = Object.keys(config.projects).length > 0;

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
        if (!hasProjects) {
          console.log(
            chalk.yellow("⚠️ 当前没有任何项目配置，请先添加项目配置")
          );
          await this.manageConfig();
        } else {
          await this.deploy();
          await this.interactiveMode();
        }
        break;
      case "config":
        await this.manageConfig();
        break;
      case "exit":
        console.log(chalk.gray("👋 再见！"));
        return;
    }
  }
}
