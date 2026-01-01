# Sunrise Deploy

自动化部署工具，支持多项目配置管理和一键部署。

## 特性

- 🚀 一键部署项目到远程服务器
- ⚙️ 管理多个项目配置
- 📦 自动构建和压缩项目
- 🔄 支持远程备份和解压
- 🌳 支持路由部署模式
- 💾 配置文件持久化存储

## 安装

```bash
npm install -g sunrise-deploy
```

## 使用方法

### 基本使用

安装完成后，在命令行中运行：

```bash
sunrise-deploy
```

### 指定配置文件

```bash
sunrise-deploy -c /path/to/deploy.config.json
```

## 配置文件

配置文件默认位于 `~/deploy/deploy.config.json`，包含以下结构：

```json
{
  "default": {
    "zip": "dist.zip",
    "buildCommand": "npm run build",
    "steps": {
      "gitCommit": {
        "enabled": false,
        "message": "chore: auto commit before deploy",
        "description": "自动提交本地变更"
      },
      "backup": {
        "enabled": true,
        "command": "cd $REMOTE && cp -r dist dist.backup",
        "description": "远程备份旧版本"
      },
      "build": {
        "enabled": true,
        "description": "本地构建项目"
      },
      "zip": {
        "enabled": true,
        "description": "压缩项目文件"
      },
      "upload": {
        "enabled": true,
        "description": "上传文件到服务器"
      }
    }
  },
  "projects": {
    "my-project": {
      "server": "user@example.com",
      "remote": "/var/www/my-project",
      "local": "/path/to/local/project",
      "steps": {
        "extract": {
          "enabled": true,
          "command": "cd $REMOTE/dist && unzip $ZIP && rm $ZIP",
          "description": "远程解压文件"
        }
      }
    }
  }
}
```

### 配置说明

- `default`: 默认配置，所有项目共享
  - `zip`: 压缩文件名
  - `buildCommand`: 本地构建命令
  - `steps`: 部署步骤配置
- `projects`: 各项目特定配置
  - `server`: 服务器地址
  - `remote`: 远程路径
  - `local`: 本地路径
  - `steps.extract`: 解压步骤配置

### Git 自动提交功能

工具支持在部署前自动提交本地变更，便于后续回滚：

- `gitCommit.enabled`: 是否启用自动提交（默认为 false）
- `gitCommit.message`: 自定义提交信息，支持变量替换
- `gitCommit.description`: 步骤描述

**注意事项：**

- 仅在项目是 git 仓库时才会执行提交
- 如果没有未提交的变更，会自动跳过
- 提交失败不会中断部署流程
- 建议在生产环境部署前手动确认变更

**启用示例：**

```json
{
  "gitCommit": {
    "enabled": true,
    "message": "chore: auto commit before deploy - ${version}",
    "description": "自动提交本地变更"
  }
}
```

### 变量替换

在命令中可以使用以下变量：

- `$SERVER`: 服务器地址
- `$REMOTE`: 远程路径
- `$ZIP`: 压缩文件名

## 功能说明

### 交互式界面

工具提供了友好的交互式界面，支持以下操作：

1. 🚀 开始部署：选择项目并执行部署流程
2. ⚙️ 配置管理：添加、查看、删除项目配置
3. ❌ 退出程序

### 配置管理

配置管理功能支持：

- 📋 查看当前配置：显示所有项目配置
- 📝 新增项目配置：添加新项目配置
- 📝 删除项目配置：删除已有项目配置

### 部署流程

部署流程包含以下步骤：

1. 本地构建（可选）
2. 版本自动更新（可选）
3. Git 自动提交（可选）
4. 文件压缩（可选）
5. 文件上传到临时目录（可选）
6. 远程备份当前线上版本（可选）
7. 原子切换版本（可选）

**版本管理说明：**

- 版本更新在构建成功后执行
- 如果后续步骤失败，会自动回退版本
- 支持 major/minor/patch 三种版本类型
- 回退功能确保部署失败时版本一致性

## 开发

### 功能特性

#### 1. Git 自动提交

在部署前自动提交本地变更，便于后续回滚：

- 自动检测 git 仓库
- 智能跳过无变更的情况
- 提交失败不影响部署流程
- **版本号自动包含** - commit 信息中自动包含版本号

**提交信息示例：**

```
chore: auto commit before deploy - v1.0.1
```

如果启用了版本更新，commit 信息会自动包含新版本号，便于追踪每次部署的版本变更。

#### 2. 版本自动管理

自动更新 package.json 版本号，支持回退：

- **版本类型**: major/minor/patch
- **自动回退**: 部署失败时自动恢复原版本
- **版本信息**: 可在提交信息中使用新版本号

**配置示例：**

```json
{
  "versionUpdate": {
    "enabled": true,
    "type": "patch",
    "description": "自动更新 package.json 版本"
  }
}
```

**部署流程中的版本管理：**

1. 构建成功后更新版本号
2. 记录原始版本用于回退
3. 后续步骤失败时自动回退
4. 部署成功时显示新版本号

**回退机制：**

- 压缩失败 → 回退版本
- 上传失败 → 回退版本
- 切换版本失败 → 回退版本
- 确保部署失败时代码库状态一致

## 开发

### 构建项目

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

### 类型检查

```bash
npm run tsc
```

## 许可证

MIT
