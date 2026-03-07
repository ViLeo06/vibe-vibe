---
title: "1.0 快速开始"
description: "5 分钟完成环境安装，开始 AI 编程"
chapter: "第一章"
---

# 1.0 快速开始

> **阅读完本节后，你将会收获：**
>
> - 完成 Git、Node.js 和 Claude Code 的安装
> - 配置 pnpm 包管理器和国内镜像源，加速下载
> - 配置 GLM 模型，开始 AI 编程

本节提供最简单直接的安装方式，让你快速开始 AI 编程。

> **Windows 用户？** 直接从下面开始阅读。
> **Mac/Linux 用户？** [点击跳转到安装指南](#mac-linux-users)

---

## Windows 用户 {#windows-users}

### 1. 安装 [Git](https://git-scm.com/install/windows)

**下载地址**：<https://registry.npmmirror.com/-/binary/git-for-windows/v2.52.0.windows.1/Git-2.52.0-64-bit.exe>

![image-20260203180304836](/images/Advanced/image-20260203180304836.png)

下载后双击安装，**一直点"下一步"即可**（已安装可跳过）。

### 2. 安装 [Node.js](https://nodejs.org/zh-cn/download)![image-20260203180429883](/images/Advanced/image-20260203180429883.png)

**下载地址**：<https://npmmirror.com/mirrors/node/v24.13.0/node-v24.13.0-x64.msi>

下载后双击安装，**一直点"下一步"即可**（已安装可跳过）。

### 3. 验证安装

按 `Win + X`，选择 **终端（管理员）** 或 **Windows PowerShell**，执行：

```powershell
git --version
node -v
```

如果显示版本号，说明安装成功。

![image-20260203180527608](/images/Advanced/image-20260203180527608.png)

如果提示「无法识别命令」，关闭终端重新打开后再试，如果仍不行则重启电脑。

### 4. 配置国内镜像源并安装 pnpm

在 PowerShell 中执行：

```powershell
npm config set registry https://registry.npmmirror.com/; npm install -g pnpm; pnpm setup; pnpm config set registry https://registry.npmmirror.com/
```

![image-20260203180609407](/images/Advanced/image-20260203180609407.png)

::: warning PowerShell 执行策略错误？

如果在 PowerShell 中运行命令时出现"无法加载脚本，因为在此系统上禁止运行脚本"错误，请以管理员身份运行 PowerShell，然后执行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

然后重新运行上面的命令即可。

![image-20260203180635579](/images/Advanced/image-20260203180635579.png)

:::

### 5. 安装 Claude Code

在 PowerShell 中执行：

```powershell
npm install -g @anthropic-ai/claude-code
```

安装完成后，执行：

```powershell
claude
```

如果看到 Claude Code 的欢迎界面，说明安装成功！

![image-20260203180714506](/images/Advanced/image-20260203180714506.png)

::: warning 如果提示「No suitable shell found」

这是 Git 没有正确安装。请设置环境变量：

1. 按 `Win + S` 搜索"环境变量"

   ![image-20260203180856348](/images/Advanced/image-20260203180856348.png)

2. 点击"编辑系统环境变量"

3. 点击"环境变量"

   ![image-20260203180925214](/images/Advanced/image-20260203180925214.png)

4. 在"系统变量"中点击"新建"

5. 变量名：`CLAUDE_CODE_GIT_BASH_PATH`

6. 变量值：`C:\Program Files\Git\bin\bash.exe`

   ![image-20260203181030343](/images/Advanced/image-20260203181030343.png)

7. 确定保存，**重启 PowerShell** 后再试

如果仍无效，卸载 Git 重新安装。

:::

---

## Mac/Linux 用户 {#mac-linux-users}

### 1. 安装 Git

**macOS**：

- 首次在终端输入 `git` 会提示安装 Xcode 命令行工具，点击安装即可
- 或主动执行：`xcode-select --install`
- 如需最新版本，可用 Homebrew：`brew install git`

**Linux**：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git -y

# CentOS/RHEL
sudo yum install git -y
```

### 2. 打开终端

- **Mac**：按 `Cmd + Space`，输入 "Terminal"
- **Linux**：按 `Ctrl + Alt + T`

### 3. 执行环境初始化脚本

此脚本将自动安装 Node.js、pnpm，并配置国内镜像源：

**macOS：**

```bash
curl -fsSL https://cnb.cool/vibevibe/scripts/-/git/raw/main/init-node-mac.sh | sed 's/\r$//' | sh && npm install -g pnpm && pnpm config set registry https://registry.npmmirror.com/ && pnpm setup
```

**Linux：**

```bash
curl -fsSL https://cnb.cool/vibevibe/scripts/-/git/raw/main/init-node-linux.sh | sed 's/\r$//' | sh
```

脚本执行完成后，**请重新打开终端窗口**（或执行 `source ~/.bashrc` / `source ~/.zshrc`）使配置生效。

这个脚本会自动完成以下配置：**nvm**（Node 版本管理器，用于切换 Node.js 版本）、**Node.js**（JavaScript 运行环境，用于执行 TypeScript 代码）、**pnpm**（包管理器，比 npm 更快更省空间），以及**国内镜像源**（配置淘宝镜像，加速依赖下载）。

### 3. 验证安装

```bash
git --version
node -v
```

如果显示版本号，说明安装成功。

### 4. 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，执行：

```bash
claude
```

如果看到 Claude Code 的欢迎界面，说明安装成功！

---

## 配置 GLM 模型 {#config-glm}

Claude Code 默认使用 Claude 官方模型，但你可以配置国内模型（如 GLM），更便宜且访问快。

**步骤 1：获取 API Key**

访问 [智谱开放平台](https://open.bigmodel.cn/)，点击右上角的「注册/登录」按钮，按照提示完成账号注册流程。登录后，在个人中心页面，点击 [API Keys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)，创建一个新的 API Key。

![image-20260203181347764](/images/Advanced/image-20260203181347764.png)

![image-20260203181406471](/images/Advanced/image-20260203181406471.png)

**步骤 2：一键安装小助手-自动配置**

在终端/PowerShell 中执行：

```bash
npx @z_ai/coding-helper
```

![Description](/images/Advanced/1764741445765coding-tool-helper.gifattname=coding-tool-helper.gif)

输入获取到的 API Key，工具会自动完成所有配置。

**步骤 3：验证配置**

```bash
claude
```

现在 Claude Code 会使用 GLM 模型回答你的问题。

::: tip 官方文档

更多配置详情可参考 [GLM 官方文档 - Claude Code 配置指南](https://docs.bigmodel.cn/cn/coding-plan/tool/claude)。

:::

::: tip 需要管理多个模型供应商？

如果你需要频繁切换不同的 AI 模型供应商（如 GLM、DeepSeek、OpenAI 等），可以使用 [cc-switch](https://github.com/farion1231/cc-switch)——一个支持 Claude Code、Codex 和 Gemini CLI 的桌面 GUI 配置管理工具，可一键切换 API 配置、统一管理 MCP 服务器和 Skills，并支持速度测试和系统托盘快速切换。

![主界面](/images/Advanced/main-zh.png)

:::

---

## 关于 nvm（可选） {#about-nvm}

Mac/Linux 用户的初始化脚本已自动安装 nvm（Node 版本管理器）。Windows 用户如果想管理多个 Node.js 版本，可以安装 nvm：

![image-20260203181915052](/images/Advanced/image-20260203181915052.png)

**下载**连接：<https://ghfast.top/https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-setup.zip>

或者：<https://nvm.uihtm.com/nvm-1.2.2-setup.zip>

**下载安装后设置镜像**：

```powershell
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

**常用命令**：

```bash
nvm install 24.13.0  # 安装指定版本
nvm use 24.13.0      # 使用指定版本
nvm list             # 查看已安装版本
```

::: details 🔄 点击体验：Node 版本管理器
试试切换不同的 Node.js 版本：

<NodeVersionManager />

> 💡 **练习**：点击不同版本进行切换，观察当前版本的变化。
>
> 🎯 **核心概念**：nvm 让你可以在同一台电脑上管理多个 Node.js 版本。
:::

---

## 常见问题 {#faq}

### Q: 安装过程中遇到错误？

把错误信息复制给 AI，它会帮你解决。

### Q: 必须用 GLM 吗？

不是。Claude Code 默认使用 Claude 官方模型，但国内访问需要中转。GLM 是性价比很高的替代方案，你也可以配置其他国内模型，如 Minimax 、 豆包、 千问等。



### Q: 单独安装过 Node.js，还可以安装 nvm 吗？

可以。nvm 会管理独立的 Node.js 版本，不影响你之前安装的版本。安装 nvm 后，你可以用 `nvm use` 切换不同版本，或者用 `nvm install` 安装新版本。

---

## 下一步 {#next-steps}

环境安装完成后，继续阅读：

- [1.1 代码格式演变](./01-code-formats.md)
- [1.2 认识技术栈](./02-tech-stack.md)
- [1.5 包管理与项目配置](./05-package-manager-and-config.md)
- [1.7 创建你的第一个项目](./07-creating-project.md)
