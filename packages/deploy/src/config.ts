import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { DeployConfig, defaultConfigPath, deployDir } from "./types";

export class ConfigManager {
  private config: DeployConfig;
  private configFilePath: string;

  constructor(configPath?: string) {
    // 在用户主目录下创建一个deploy目录
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir);
    }
    this.config = {} as DeployConfig;
    this.configFilePath = "";
    this.loadConfig(configPath);
  }

  /**
   * 加载配置文件
   * @param configPath 配置文件路径
   */
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
        console.log(chalk.yellow(`⚠️ 配置文件不存在: ${this.configFilePath}`));
        console.log(chalk.blue(`🔄 正在创建默认配置文件...`));

        // 创建默认配置
        this.config = this.createDefaultConfig();

        // 保存默认配置到文件
        this.saveConfig();
        console.log(chalk.green(`✅ 已创建默认配置文件: ${this.configFilePath}`));
        console.log(chalk.yellow(`💡 请根据需要修改配置文件后再次运行`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ 配置文件加载失败:`), error);
      process.exit(1);
    }
  }

  /**
   * 创建默认配置
   * @returns 默认配置对象
   */
  private createDefaultConfig(): DeployConfig {
    return {
      default: {
        zip: "dist.zip",
        buildCommand: "npm run build",
        steps: {
          backup: {
            enabled: true,
            command: "cd $REMOTE && cp -r dist dist.backup || true",
            description: "远程备份旧版本"
          },
          build: {
            enabled: true,
            description: "本地构建项目"
          },
          zip: {
            enabled: true,
            description: "压缩项目文件"
          },
          upload: {
            enabled: true,
            description: "上传文件到服务器"
          }
        }
      },
      projects: {}
    };
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
   * 添加项目
   */
  async addProject(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "请输入项目名称:",
        default: () => {
          // 获取当前目录名称作为默认值
          const currentDir = process.cwd().split(path.sep).pop() || "";
          return currentDir;
        },
        validate: (input) => {
          if (!input.trim()) {
            return "项目名称不能为空";
          }
          if (this.config.projects[input]) {
            return "项目名称已存在";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "local",
        message: "请输入本地项目路径:",
        default: process.cwd(),
        validate: (input) => {
          if (!input.trim()) {
            return "本地项目路径不能为空";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "remote",
        message: "请输入远程服务器路径:",
        validate: (input) => {
          if (!input.trim()) {
            return "远程服务器路径不能为空";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "server",
        message: "请输入服务器地址:",
        validate: (input) => {
          if (!input.trim()) {
            return "服务器地址不能为空";
          }
          return true;
        },
        when: () => {
          // 如果没有已配置的服务器，直接显示输入框
          const servers = new Set<string>();
          Object.values(this.config.projects).forEach((project) => {
            servers.add(project.server);
          });
          return servers.size === 0;
        },
      },
      {
        type: "list",
        name: "serverType",
        message: "请选择服务器地址类型:",
        choices: [
          { name: "从已有服务器中选择", value: "existing" },
          { name: "输入新的服务器地址", value: "new" },
        ],
        when: () => {
          // 如果有已配置的服务器，显示选择框
          const servers = new Set<string>();
          Object.values(this.config.projects).forEach((project) => {
            servers.add(project.server);
          });
          return servers.size > 0;
        },
      },
      {
        type: "list",
        name: "server",
        message: "请选择服务器地址:",
        choices: () => {
          // 从现有项目中提取所有服务器地址
          const servers = new Set<string>();
          Object.values(this.config.projects).forEach((project) => {
            servers.add(project.server);
          });
          return Array.from(servers);
        },
        when: (answers) => {
          // 如果有已配置的服务器且用户选择了"从已有服务器中选择"，显示服务器列表
          const servers = new Set<string>();
          Object.values(this.config.projects).forEach((project) => {
            servers.add(project.server);
          });
          return servers.size > 0 && answers.serverType === "existing";
        },
      },
      {
        type: "input",
        name: "server",
        message: "请输入新的服务器地址:",
        validate: (input) => {
          if (!input.trim()) {
            return "服务器地址不能为空";
          }
          return true;
        },
        when: (answers) => {
          // 如果有已配置的服务器且用户选择了"输入新的服务器地址"，显示输入框
          const servers = new Set<string>();
          Object.values(this.config.projects).forEach((project) => {
            servers.add(project.server);
          });
          return servers.size > 0 && answers.serverType === "new";
        },
      },
      {
        type: "confirm",
        name: "extractEnabled",
        message: "是否启用远程解压步骤?",
        default: true,
      },
      {
        type: "list",
        name: "extractType",
        message: "请选择解压类型:",
        choices: [
          { name: "正常的解压上传", value: "normal" },
          { name: "带有路由的解压", value: "router" },
        ],
      },
    ]);

    const { name, local, remote, server, extractEnabled, extractType } =
      answers;
    let extractCommand = "";
    let extractDescription = "远程解压上传文件";

    // 根据解压类型设置不同的命令和描述
    if (extractEnabled) {
      switch (extractType) {
        case "normal":
          extractCommand = `cd $REMOTE/dist && unzip $ZIP && rm $ZIP`;
          break;
        case "router":
          // 需要额外询问路由名称
          const { routerName } = await inquirer.prompt([
            {
              type: "input",
              name: "routerName",
              message: "请输入路由名称:",
              validate: (input) => {
                if (!input.trim()) return "路由名称不能为空";
                return true;
              },
            },
          ]);
          extractCommand = `cd $REMOTE/dist && unzip $ZIP && rm $ZIP && cd ${routerName} && mv * ../ && cd .. && rm -rf ${routerName}`;
          extractDescription = "远程解压上传文件并处理路由";
          break;
      }
    }

    const localPath = local || process.cwd();
    // 创建新项目配置
    const newProject = {
      server,
      remote,
      local: localPath,
      steps: {
        extract: {
          enabled: extractEnabled,
          command: extractCommand,
          description: extractDescription,
        },
      },
    };

    // 添加到配置中
    this.config.projects[name] = newProject;

    // 保存配置
    await this.saveConfig();

    console.log(chalk.green(`✅ 项目 "${name}" 添加成功`));
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
