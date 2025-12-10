import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";
import chalk from "chalk";
import figlet from "figlet";
/**
 * 执行命令
 * @param command 要执行的命令
 * @param description 命令描述
 * @param options 选项
 * @returns 执行是否成功
 */
export async function executeCommand(
  command: string,
  description: string,
  options?: { silent?: boolean; cwd?: string }
): Promise<boolean> {
  console.log(
    chalk.cyan(`
====== ${description} ======${command}`)
  );

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

/**
 * 压缩目录
 * @param sourceDir 源目录
 * @param outPath 输出路径
 * @returns 压缩是否成功
 */
export async function zipDirectory(
  sourceDir: string,
  outPath: string
): Promise<boolean> {
  console.log(
    chalk.cyan(`
====== 压缩文件 ======`)
  );
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

/**
 * 替换命令中的变量
 * @param command 命令
 * @param config 配置
 * @returns 替换后的命令
 */
export function replaceVariables(command: string, config: any): string {
  return command
    .replace(/\$SERVER/g, config.server)
    .replace(/\$REMOTE/g, config.remote)
    .replace(/\$ZIP/g, config.zip);
}

/**
 * 显示标题
 */
export function displayHeader(): void {
  console.log(
    chalk.cyan(figlet.textSync("Sunrise Deploy", { horizontalLayout: "full" }))
  );
  console.log(chalk.gray("自动化部署工具 - TypeScript版本\n"));
}
