import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { DeployConfig, ProjectConfig, defaultConfigPath, deployDir } from "./types";

export class ConfigManager {
  private config: DeployConfig;
  private configFilePath: string;

  constructor(configPath?: string) {
    this.config = { projects: {} };
    this.configFilePath = configPath || defaultConfigPath;

    // 确保配置目录存在
    const dir = path.dirname(this.configFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.loadConfig();
  }

  /**
   * 加载配置文件
   */
  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const configContent = fs.readFileSync(this.configFilePath, "utf-8");
        const raw = JSON.parse(configContent);

        // 自动迁移旧格式（带 default 字段）
        if (raw.default) {
          this.config = this.migrateOldConfig(raw);
          this.saveConfig();
          console.log(chalk.green(`✅ 已自动迁移配置文件到新格式`));
        } else {
          this.config = raw;
        }

        console.log(chalk.green(`✅ 已加载配置文件: ${this.configFilePath}`));
      } else {
        console.log(chalk.yellow(`⚠️ 配置文件不存在: ${this.configFilePath}`));
        console.log(chalk.blue(`🔄 正在创建空配置文件...`));
        this.config = { projects: {} };
        this.saveConfig();
        console.log(chalk.green(`✅ 已创建配置文件: ${this.configFilePath}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ 配置文件加载失败:`), error);
      process.exit(1);
    }
  }

  /**
   * 从旧格式（带 default）迁移到新格式
   */
  private migrateOldConfig(oldConfig: any): DeployConfig {
    const projects: Record<string, ProjectConfig> = {};

    for (const [name, proj] of Object.entries(oldConfig.projects || {})) {
      const p = proj as any;
      let base = "/";

      // 从 extract.command 反推 base 路径
      if (p.steps?.extract?.command) {
        const cmd: string = p.steps.extract.command;
        // 匹配 "cd 路由名 && mv * ../ ... rm -rf 路由名"
        const routeMatch = cmd.match(/cd\s+(\w+)\s+&&\s+mv\s+\*\s+\.\.\/.*rm\s+-rf\s+\1/);
        if (routeMatch) {
          base = "/" + routeMatch[1];
        }
      }

      projects[name] = {
        server: p.server,
        remote: p.remote.replace(/\/+$/, ""),
        local: p.local,
        base,
      };
    }

    return { projects };
  }

  /**
   * 获取配置
   * @returns 配置对象
   */
  getConfig(): DeployConfig {
    return this.config;
  }

  /**
   * 保存配置
   */
  async saveConfig(): Promise<void> {
    try {
      fs.writeFileSync(
        this.configFilePath,
        JSON.stringify(this.config, null, 2),
        "utf-8"
      );
      console.log(chalk.green("✅ 配置已保存"));
    } catch (error) {
      console.log(chalk.red("❌ 保存配置失败:"), error);
    }
  }

  /**
   * 选择项目
   * @returns 项目名称
   */
  async selectProject(): Promise<string> {
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

  /**
   * 查看配置
   */
  async viewConfig(): Promise<void> {
    console.log(chalk.cyan("当前配置:"));
    console.log(JSON.stringify(this.config, null, 2));
    await inquirer.prompt([
      { type: "input", name: "continue", message: "按回车键继续..." },
    ]);
  }

  /**
   * 获取已配置的服务器列表（去重）
   */
  private getServerList(): string[] {
    const servers = new Set<string>();
    for (const project of Object.values(this.config.projects)) {
      if (project.server) servers.add(project.server);
    }
    return Array.from(servers);
  }

  /**
   * 添加项目
   */
  async addProject(): Promise<void> {
    const existingServers = this.getServerList();

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "项目名称:",
        default: () => process.cwd().split(path.sep).pop() || "",
        validate: (input) => {
          if (!input.trim()) return "项目名称不能为空";
          if (this.config.projects[input]) return "项目名称已存在";
          return true;
        },
      },
      {
        type: existingServers.length > 0 ? "list" : "input",
        name: "server",
        message: "服务器地址:",
        choices: existingServers.length > 0
          ? [...existingServers.map((s) => ({ name: s, value: s })), { name: "✏️ 输入新的服务器地址", value: "__new__" }]
          : undefined,
        default: existingServers[0] || undefined,
      },
      {
        type: "input",
        name: "server",
        message: "输入新的服务器地址:",
        validate: (input) => input.trim() ? true : "服务器地址不能为空",
        when: (answers) => answers.server === "__new__",
      },
      {
        type: "input",
        name: "remote",
        message: "远程部署路径 (如 /home/www/project):",
        validate: (input) => input.trim() ? true : "远程路径不能为空",
      },
      {
        type: "input",
        name: "local",
        message: "本地项目路径:",
        default: process.cwd(),
      },
      {
        type: "input",
        name: "base",
        message: "Vite base 路径 (/ 或 /路由名 如 /ship):",
        default: "/",
      },
    ]);

    this.config.projects[answers.name] = {
      server: answers.server,
      remote: answers.remote.replace(/\/+$/, ""),
      local: answers.local,
      base: answers.base || "/",
    };

    await this.saveConfig();
    console.log(chalk.green(`✅ 项目 "${answers.name}" 添加成功`));
  }

  /**
   * 删除项目
   */
  async deleteProject(): Promise<void> {
    const projectNames = Object.keys(this.config.projects);

    if (projectNames.length === 0) {
      console.log(chalk.yellow("⚠️ 当前没有任何项目配置"));
      return;
    }

    const { projectName } = await inquirer.prompt([
      {
        type: "list",
        name: "projectName",
        message: "选择要删除的项目:",
        choices: projectNames,
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `确定要删除项目 "${projectName}" 吗？`,
        default: false,
      },
    ]);

    if (confirm) {
      delete this.config.projects[projectName];
      await this.saveConfig();
      console.log(chalk.green(`✅ 项目 "${projectName}" 删除成功`));
    } else {
      console.log(chalk.gray("❌ 操作已取消"));
    }
  }
}
