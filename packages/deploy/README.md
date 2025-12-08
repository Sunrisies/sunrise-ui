# Sunrise Deploy

自动化部署工具，支持通过配置文件灵活适配不同项目。

## 功能特点

- 🚀 一键部署，自动化完成构建、压缩、上传和解压
- ⚙️ 灵活的配置文件，支持不同项目的自定义设置
- 🎨 美观的命令行界面，清晰的步骤提示
- 📦 支持本地压缩和远程解压
- 🔧 可配置的部署步骤，可选择性启用/禁用特定步骤

## 安装

```bash
# 本地安装
npm install sunrise-deploy

# 全局安装
npm install -g sunrise-deploy
```

## 使用方法

### 1. 创建配置文件

在项目根目录创建 `deploy.config.json` 文件，参考以下示例：

```json
{
  "server": "root@sunrise1024.top",
  "remote": "/home/www/react-bun/",
  "local": "D:\\project\\user\\bun-react",
  "zip": "dist.zip",
  "buildCommand": "bun run build",
  "steps": {
    "backup": {
      "enabled": true,
      "command": "mv $REMOTE/dist $REMOTE/dist_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true; mkdir -p $REMOTE/dist"
    },
    "build": {
      "enabled": true,
      "description": "本地构建"
    },
    "zip": {
      "enabled": true,
      "description": "压缩文件"
    },
    "upload": {
      "enabled": true,
      "description": "上传文件"
    },
    "extract": {
      "enabled": true,
      "command": "cd $REMOTE/dist && unzip $ZIP && rm -r $ZIP && cd ship && mv * ../",
      "description": "远程解压并清理"
    }
  }
}
```

### 2. 运行部署

```bash
# 使用默认配置文件
sunrise-deploy

# 指定配置文件
sunrise-deploy --config /path/to/deploy.config.json
```

### 3. 交互式操作

运行命令后，会进入交互式界面，可以选择：

- 🚀 开始部署：执行完整的部署流程
- ⚙️ 配置管理：查看或编辑配置文件
- ❌ 退出：退出程序

## 配置说明

| 字段 | 说明 |
|------|------|
| server | 服务器地址，格式：user@hostname |
| remote | 远程服务器上的部署路径 |
| local | 本地项目路径 |
| zip | 压缩文件名 |
| buildCommand | 本地构建命令 |
| steps | 部署步骤配置 |

### 部署步骤配置

每个步骤都有 `enabled` 字段控制是否启用，可选的 `description` 字段自定义显示名称，部分步骤支持自定义 `command` 字段：

- backup：远程备份旧版本
- build：本地构建
- zip：压缩文件
- upload：上传文件
- extract：远程解压并清理

### 变量替换

在命令中可以使用以下变量，它们会被自动替换为配置中的值：

- `$SERVER`：服务器地址
- `$REMOTE`：远程路径
- `$ZIP`：压缩文件名

## 示例

### React项目部署示例

```json
{
  "server": "user@example.com",
  "remote": "/var/www/my-react-app/",
  "local": "/home/user/projects/my-react-app",
  "zip": "build.zip",
  "buildCommand": "npm run build",
  "steps": {
    "backup": {
      "enabled": true,
      "command": "mv $REMOTE/build $REMOTE/build_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true; mkdir -p $REMOTE/build"
    },
    "build": {
      "enabled": true,
      "description": "构建React应用"
    },
    "zip": {
      "enabled": true,
      "description": "压缩构建文件"
    },
    "upload": {
      "enabled": true,
      "description": "上传到服务器"
    },
    "extract": {
      "enabled": true,
      "command": "cd $REMOTE && unzip $ZIP && rm $ZIP",
      "description": "解压并清理"
    }
  }
}
```

## 开发

```bash
# 克隆仓库
git clone https://github.com/your-username/sunrise-deploy.git

# 安装依赖
cd sunrise-deploy
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 许可证

ISC
