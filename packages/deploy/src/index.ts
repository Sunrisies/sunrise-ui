#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { Deployer } from "./deploy";

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
