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
  private toolVersion: string;

  constructor(toolVersion: string, configPath?: string) {
    this.toolVersion = toolVersion;
    this.configManager = new ConfigManager(configPath);
    this.currentProject = "";
  }

  /**
   * 生成远程解压命令
   * - base="/"：直接解压到 dist/
   * - base="/ship"：解压后把 ship/ 子目录内容合并到 dist/ 根目录
   */
  private buildExtractCommand(base: string, zipName: string): string {
    var unzip = "cd $REMOTE/dist && unzip " + zipName + " && rm " + zipName;

    if (base === "/" || !base) {
      return unzip;
    }

    var routeName = base.replace(/^\//, "").replace(/\/+$/, "");
    // 解压后：若存在路由子目录，将其内容合并到 dist/ 根目录
    // 注意：glob (*) 必须在引号外才能展开，所以写成 "routeName"/*
    var q = '"' + routeName + '"';
    var mergeCmd =
      '{ [ ! -d ' + q + ' ] || { ' +
      'mv ' + q + '/* ./ 2>/dev/null; ' +
      'mv ' + q + '/.[!.]* ./ 2>/dev/null; ' +
      'rm -rf ' + q + '; }; }';
    return unzip + " && " + mergeCmd;
  }

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
    const projectConfig = config.projects[projectName];

    if (!projectConfig) {
      throw new Error(`项目 "${projectName}" 不存在`);
    }

    const base = projectConfig.base || "/";
    const zipName = "dist.zip";
    const extractCommand = this.buildExtractCommand(base, zipName);

    return {
      server: projectConfig.server,
      remote: projectConfig.remote,
      local: projectConfig.local,
      zip: zipName,
      buildCommand: projectConfig.buildCommand || "npm run build",
      versionUpdate: {
        enabled: projectConfig.versionUpdate !== false,
        type: "patch",
        description: "自动更新 package.json 版本",
      },
      steps: {
        gitCommit: {
          enabled: projectConfig.gitCommit !== false,
          message: "chore: auto commit before deploy",
          description: "自动提交本地变更",
        },
        backup: {
          enabled: projectConfig.backup !== false,
          command: "rm -rf $REMOTE/dist.backup && mv $REMOTE/dist $REMOTE/dist.backup && mkdir -p $REMOTE/dist",
          description: "远程备份旧版本",
        },
        build: {
          enabled: true,
          description: "本地构建",
        },
        zip: {
          enabled: true,
          description: "压缩文件",
        },
        upload: {
          enabled: true,
          description: "上传文件到服务器",
        },
        extract: {
          enabled: true,
          command: extractCommand,
          description: "远程解压上传文件",
        },
      },
    };
  }

  /**
   * 执行部署
   */
  async deploy(): Promise<void> {
    displayHeader(this.toolVersion);

    // 选择项目
    this.currentProject = await this.configManager.selectProject();
    const projectConfig = this.getProjectConfig(this.currentProject);

    console.log(
      chalk.cyan(`
当前项目: ${this.currentProject}`)
    );
    console.log(chalk.gray(`服务器: ${projectConfig.server}`));
    console.log(chalk.gray(`远程路径: ${projectConfig.remote}`));
    console.log(chalk.gray(`本地路径: ${projectConfig.local}`));

    // 显示当前版本号
    const currentVersion = getCurrentVersion(projectConfig.local);
    if (currentVersion) {
      console.log(chalk.gray(`当前版本: ${chalk.green(currentVersion)}`));
    }
    console.log("");

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
    let backupSucceeded = false;

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

    // ✅ Step 5: 远程备份当前线上版本（先备份，再上传）
    if (projectConfig.steps.backup.enabled) {
      const command = replaceVariables(
        projectConfig.steps.backup.command || "",
        projectConfig
      );
      const backupOk = await executeCommand(
        `ssh "${projectConfig.server}" "${command}"`,
        projectConfig.steps.backup.description || "备份当前线上版本",
        { silent: true }
      );
      if (!backupOk) {
        console.log(chalk.yellow("⚠️ 备份失败，但继续部署流程"));
        // 备份失败不影响后续流程
      } else {
        backupSucceeded = true;
      }
    }

    // ✅ Step 6: 上传文件到服务器
    if (projectConfig.steps.upload.enabled) {
      // 规范化 remote 路径，去除尾部斜杠
      const remoteBase = projectConfig.remote.replace(/\/+$/, "");
      const localZipPath = path.join(projectConfig.local, projectConfig.zip);
      const remoteZipPath = `${remoteBase}/dist/${projectConfig.zip}`;

      // 确保远端 dist 目录存在（备份步骤可能已创建）
      const mkdirOk = await executeCommand(
        `ssh "${projectConfig.server}" "mkdir -p ${remoteBase}/dist"`,
        "创建远端目录"
      );
      if (!mkdirOk) {
        console.log(chalk.red("❌ 创建远端目录失败，停止部署"));
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 回退本地版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
        }
        return;
      }

      const uploadOk = await executeCommand(
        `scp "${localZipPath}" "${projectConfig.server}:${remoteZipPath}"`,
        projectConfig.steps.upload.description || "上传文件到服务器"
      );
      if (!uploadOk) {
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 上传失败，回退版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
        }
        return;
      }
    }

    // ✅ Step 7: 远程解压（使用项目配置的自定义命令）
    if (projectConfig.steps.extract.enabled) {
      const extractCommand = replaceVariables(
        projectConfig.steps.extract.command || "",
        projectConfig
      );
      success = await executeCommand(
        `ssh "${projectConfig.server}" "${extractCommand}"`,
        projectConfig.steps.extract.description || "远程解压上传文件",
        { silent: true }
      );
      if (!success) {
        console.log(chalk.red("❌ 切换版本失败"));

        // 远端回滚：删除损坏的 dist，从备份恢复
        if (backupSucceeded) {
          console.log(chalk.yellow("⚠️ 正在从备份恢复远端版本..."));
          const rollbackRemote = projectConfig.remote.replace(/\/+$/, "");
          await executeCommand(
            `ssh "${projectConfig.server}" "rm -rf ${rollbackRemote}/dist && mv ${rollbackRemote}/dist.backup ${rollbackRemote}/dist"`,
            "远端版本回滚",
            { silent: true }
          );
          console.log(chalk.green("✅ 远端版本已恢复"));
        } else {
          console.log(chalk.yellow("⚠️ 无远端备份，请手动检查服务器状态"));
        }

        // 回退本地版本
        if (versionUpdateSuccess && originalVersion) {
          console.log(chalk.yellow("⚠️ 回退本地版本..."));
          await revertPackageVersion(projectConfig.local, originalVersion);
        }
        console.log(chalk.red("❌ 部署失败"));
        return;
      }
    }

    // 清理远端临时文件
    const cleanBase = projectConfig.remote.replace(/\/+$/, "");
    await executeCommand(
      `ssh "${projectConfig.server}" "rm -f ${cleanBase}/dist/${projectConfig.zip} && rm -rf ${cleanBase}/dist.backup"`,
      "清理远端临时文件",
      { silent: true }
    );

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
    displayHeader(this.toolVersion);

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
