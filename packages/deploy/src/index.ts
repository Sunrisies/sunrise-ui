#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { Deployer } from "./deploy";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// 主函数
async function main(): Promise<void> {
  // 获取当前文件的目录
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 读取 package.json 获取版本信息
  const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, "../package.json"), "utf8")
  );

  try {
    program
      .name("sunrise-deploy")
      .description("自动化部署工具")
      .version(packageJson.version, "-v, --version", "显示当前版本号")
      .helpOption("-h, --help", "显示帮助信息")
      .addHelpText(
        "beforeAll",
        `
========================================
  Sunrise Deploy v${packageJson.version} 自动化部署工具
========================================
使用说明:
  sunrise-deploy [options]

示例:
  sunrise-deploy                    # 使用交互模式
      `
      )
      .addHelpText(
        "afterAll",
        `
更多信息请访问: https://github.com/Sunrisies/sunrise-ui.git
问题反馈: https://github.com/Sunrisies/sunrise-ui.git/issues
      `
      )
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
