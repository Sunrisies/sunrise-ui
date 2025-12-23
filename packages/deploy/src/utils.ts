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
 * 执行 git commit
 * @param projectPath 项目路径
 * @param commitMessage 提交信息
 * @returns 执行是否成功
 */
export async function gitCommit(
  projectPath: string,
  commitMessage: string
): Promise<boolean> {
  console.log(
    chalk.cyan(`
====== Git 自动提交 ======`)
  );
  console.log(chalk.gray(`项目路径: ${projectPath}`));
  console.log(chalk.gray(`提交信息: ${commitMessage}`));

  // 检查是否有 git 仓库
  const checkGitCommand = `cd "${projectPath}" && git status`;
  const isGitRepo = await new Promise<boolean>((resolve) => {
    const child = spawn(checkGitCommand, [], { shell: true, stdio: "pipe" });
    child.on("close", (code) => resolve(code === 0));
  });

  if (!isGitRepo) {
    console.log(chalk.yellow("⚠️ 当前目录不是 git 仓库，跳过 git commit"));
    return true;
  }

  // 检查是否有未提交的变更
  const hasChangesCommand = `cd "${projectPath}" && git diff --quiet && git diff --cached --quiet`;
  const hasChanges = await new Promise<boolean>((resolve) => {
    const child = spawn(hasChangesCommand, [], { shell: true, stdio: "pipe" });
    child.on("close", (code) => resolve(code !== 0));
  });

  if (!hasChanges) {
    console.log(chalk.green("✅ 没有未提交的变更，跳过 git commit"));
    return true;
  }

  // 执行 git add
  const addCommand = `cd "${projectPath}" && git add .`;
  const addSuccess = await executeCommand(addCommand, "Git 添加变更", {
    silent: true,
  });

  if (!addSuccess) {
    return false;
  }

  // 执行 git commit
  const commitCommand = `cd "${projectPath}" && git commit -m "${commitMessage}"`;
  const commitSuccess = await executeCommand(commitCommand, "Git 提交变更", {
    silent: true,
  });

  if (commitSuccess) {
    console.log(chalk.green("✅ Git 提交成功"));
  }

  return commitSuccess;
}

/**
 * 更新 package.json 版本号
 * @param projectPath 项目路径
 * @param versionType 版本类型 (major/minor/patch)
 * @returns 新版本号，失败返回 null
 */
export async function updatePackageVersion(
  projectPath: string,
  versionType: "major" | "minor" | "patch"
): Promise<string | null> {
  console.log(
    chalk.cyan(`
====== 更新 package.json 版本 ======`)
  );
  console.log(chalk.gray(`项目路径: ${projectPath}`));
  console.log(chalk.gray(`版本类型: ${versionType}`));

  const packageJsonPath = path.join(projectPath, "package.json");

  // 检查 package.json 是否存在
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.yellow("⚠️ package.json 文件不存在，跳过版本更新"));
    return null;
  }

  try {
    // 读取当前 package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    const oldVersion = packageJson.version;

    if (!oldVersion) {
      console.log(chalk.yellow("⚠️ package.json 中没有 version 字段"));
      return null;
    }

    // 解析版本号
    const [major, minor, patch] = oldVersion.split(".").map(Number);
    let newVersion: string;

    // 计算新版本号
    switch (versionType) {
      case "major":
        newVersion = `${major + 1}.0.0`;
        break;
      case "minor":
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case "patch":
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      default:
        console.log(chalk.red(`❌ 无效的版本类型: ${versionType}`));
        return null;
    }

    // 备份原始内容
    const backupContent = packageJsonContent;

    // 更新版本号
    packageJson.version = newVersion;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );

    console.log(chalk.green(`✅ 版本更新成功: ${oldVersion} → ${newVersion}`));
    return newVersion;
  } catch (error) {
    console.log(chalk.red(`❌ 版本更新失败:`), error);
    return null;
  }
}

/**
 * 回退 package.json 版本
 * @param projectPath 项目路径
 * @param originalVersion 原始版本号
 * @returns 是否成功
 */
export async function revertPackageVersion(
  projectPath: string,
  originalVersion: string
): Promise<boolean> {
  console.log(
    chalk.cyan(`
====== 回退 package.json 版本 ======`)
  );
  console.log(chalk.gray(`项目路径: ${projectPath}`));
  console.log(chalk.gray(`回退到版本: ${originalVersion}`));

  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    // 检查文件是否存在
    if (!fs.existsSync(packageJsonPath)) {
      console.log(chalk.yellow("⚠️ package.json 文件不存在"));
      return false;
    }

    // 读取当前 package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // 回退版本
    packageJson.version = originalVersion;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );

    console.log(chalk.green(`✅ 版本回退成功: ${originalVersion}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ 版本回退失败:`), error);
    return false;
  }
}

/**
 * 获取当前 package.json 版本
 * @param projectPath 项目路径
 * @returns 当前版本号，不存在返回 null
 */
export function getCurrentVersion(projectPath: string): string | null {
  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    if (!fs.existsSync(packageJsonPath)) {
      return null;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return packageJson.version || null;
  } catch (error) {
    return null;
  }
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
