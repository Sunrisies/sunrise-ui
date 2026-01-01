#!/usr/bin/env node
const { exec } = require('child_process');
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

// 获取当前版本号
function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

// 设置版本号
function setVersion(version) {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// 回退版本号
function revertVersion(previousVersion) {
  console.log(`回退版本号到: ${previousVersion}`);
  setVersion(previousVersion);
}

// 执行命令
function runCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令 ${command} 时出错:`, error);
      callback(error); // 传递错误给回调
    } else if (stderr) {
      console.warn(`命令 ${command} 的标准错误输出:`, stderr);
      callback(new Error(stderr)); // 将标准错误输出作为错误传递
    } else {
      console.log(`命令 ${command} 执行成功:`, stdout);
      callback(null); // 没有错误，传递 null 给回调
    }
  });
}

// 主逻辑
function main() {
  const previousVersion = getCurrentVersion(); // 保存当前版本号
  console.log(`当前版本号: ${previousVersion}`);

  // 更新版本号
  runCommand('npm version patch --no-git-tag-version', (errorPatch) => {
    if (errorPatch) {
      console.error('npm version patch 执行失败，跳过 npm publish。');
      return;
    }

    // 设置 npm 注册表
    runCommand('npm config set registry=https://registry.npmjs.org/', (errorRegistry) => {
      if (errorRegistry) {
        console.error('npm config set registry 执行失败，跳过 npm publish。');
        revertVersion(previousVersion); // 回退版本号
        return;
      }

      // 检查 npm 注册表
      runCommand('npm config get registry', (errorGetRegistry) => {
        if (errorGetRegistry) {
          console.error('npm config get registry 执行失败，跳过 npm publish。');
          revertVersion(previousVersion); // 回退版本号
          return;
        }

        // 发布包
        const child = spawn('npm', ['publish'], { stdio: 'inherit' });
        child.on('close', (res) => {
          if (res === 0) {
            console.log('上传成功');
            // 切换回淘宝镜像
            runCommand('npx nrm use taobao', (errorNrm) => {
              if (errorNrm) {
                console.error('npx nrm use taobao 执行失败');
              }
            });
          } else {
            console.log('上传失败');
            revertVersion(previousVersion); // 回退版本号
          }
        });
      });
    });
  });
}

// 执行主逻辑
main();