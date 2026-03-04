---
title: “随时随地 AI 编程”
description: “使用 Happy Coder 实现移动端远程控制 AI 编程，配合云电脑打造全场景开发环境”
order: 2
---

# 随时随地 AI 编程：Happy Coder 工具链

> 作者：沐橙

**Happy Coder** 是一款专为 **Claude Code**、**Codex** 及  **Gemini** 等 AI 命令行助手打造的开源免费的远程控制工具。

它的核心愿景并非取代你的电脑，而是通过先进的**端到端加密技术**，将强大的终端能力”装进你的口袋”。通过 Happy Coder，你可以随时随地在移动端设备上实时遥控电脑端的 AI 编程代理，让原本受限于桌面的 AI 开发工作流，进化为跨时空、全场景的移动生产力。

> 甚至可以在 Happy App 中使用 语言输入动动嘴就能实现 AI 编程

![img](../public/images/Advanced/happy-coder/header.png)

注：

- Happy Coder 官网：[https://happy.engineering](https://happy.engineering)
- Happy App：[Web UI + 移动客户端](https://github.com/slopus/happy/tree/main/packages/happy-app)
- Happy CLI：[Claude Code 和 Codex 的命令行界面](https://github.com/slopus/happy-cli)
- Happy Server：[加密同步的后端服务器](https://github.com/slopus/happy-server)

## 一、为什么它是 AI 时代的开发神器

在2026年的开发者圈子里，**Happy Coder** 能够被称为“神器”，主要是因为它跳出了单纯的“写代码”的逻辑，进化出了一个**跨平台的智能研发中枢**。

它只是一个集成在编辑器里的插件，却解决了AI时代开发者最头疼的三个痛点：**多端同步、隐私安全、以及“重任务”执行**。

- 真正的“生产力”：移动端良好
- 极致的隐私安全（信号级加密）
- 从“对话框”到“命令行”的降维打击
- 2026年的“开发者唤醒器”
- 从此做一个快乐的程序员：在电梯、咖啡厅、吃饭、火车上、飞机上、甚至户外步行都可以随时监控代码开发进度

> Happy Coder 的神不在于它的模型比别人强，而在于它让 AI 开发变得像呼吸一样随时随地，而且像保险柜一样安全。

<video src="./../public/images/Advanced/happy-coder/Happy-App.mp4" autoplay muted loop playsinline controls></video>

### 1、Happy Coder 解决了什么痛点

传统 AI 编程开发模式 与 Happy Coder 开发模式的痛点对比

| **核心痛点**   | **传统 AI 编程开发模式 (Old School)**                  | **Happy Coder 模式 (Next Gen)**                              | **对应的“特技”功能**                                         |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **空间束缚**   | 必须坐在电脑前，需要长时间等待 AI 生成代码或运行测试   | **拿起手机即走**<br />在电梯、咖啡厅、吃饭、火车上、飞机上、甚至户外步行都可以随时监控代码开发进度 | **Relay 穿透技术**<br /> (无需公网 IP)，也无需在同一网络环境，可以随时连接 |
| **体力消耗**   | 长期伏案，颈椎和腰椎承受巨大压力，姿势固定             | **站着、躺着、走着都能开发**<br />彻底解放身体姿势           | **Voice-to-Action**<br /> (真正的语音编程)                   |
| **碎片时间**   | 通勤、排队等碎片时间只能刷手机，无法处理复杂的编程任务 | **掏出手机**<br />就能让家里的电脑改 Bug 或重构，变废为宝    | **Multi-Sessions** <br />(多任务并行切换)                    |
| **等待焦虑**   | 长时间任务（如跑测试）时不敢离开，怕 AI 停下来等授权   | **任务完成或需要授权时**<br />口袋里的手机会震动提醒         | **Smart Push** <br />(智能推送通知)                          |
| **安全门槛**   | 远程桌面配置极其复杂；SSH 连通性差；担心代码泄露       | **扫码即连**<br />端到端加密保障代码隐私，中转站无法偷窥。<br />中转站仅搬运加密后的“数据块”，**它看不见、也无法解密你的代码内容** | **E2EE 加密架构** <br />(端到端加密)                         |
| **控制权冲突** | 远程操作时，若本地有人动键盘会造成输入混乱             | **物理键盘优先级最高**<br />当你回到桌前，不需要在手机上点退出。<br />只需敲击电脑键盘的**任意键**控制权会瞬间从手机跳回电脑终端，手机端自动进入“观察模式”。 | **Zero Disruption**<br /> (无感控制权切换)                   |

核心价值：

- **对于个人开发者**：它是你的“远程大脑控制器”，让你不再被椅子绑架
- **对于团队 Leader**：它让你在开会或巡视时，依然能随时介入复杂的代码执行流程
- **对于硬核 Geek**：它提供了最安全的、零配置的 AI Agent 远程交互方案

### 2、Happy Coder 工作原理解析

 Happy Coder 采用了 “三位一体” 的协作系统架构，即 ”三剑客架构“ ：

![AA332EC147F2DC33DBF646428A1BFDDC](../public/images/Advanced/happy-coder/AA332EC147F2DC33DBF646428A1BFDDC.jpg)

- **Happy CLI（电脑端的“大脑”）**：它是包裹在 AI 助手（如 Claude Code、Gemini、CodeX）外的“智能外壳”。负责把终端屏幕上的内容**瞬间加密**并打包发走

> **通俗理解**：它是你的**“私人秘书”**，在电脑旁盯着屏幕，把信息塞进保险箱寄出去

- **Relay Server（云端的“管道” 中转站）**：**基于 WebSocket 的双工信令中转** 它是连接电脑与手机的数字桥梁，解决了复杂网络环境下的“穿透”难题。负责把电脑的数据传给手机，无论你在 5G 网络还是咖啡店 Wi-Fi，都能实现“电脑打字，手机秒显”

  利用 WebSocket 的协议特性，通过电脑端‘主动发起’的加密长连接，巧妙绕过防火墙对外部入侵的拦截，实现任何网络环境下的即时穿透。

> **通俗理解**：它是**“盲人快递员”**，只负责搬运保险箱，由于没有钥匙，他完全看不见里面的代码，放心使用 ！

- **Happy App (手机端)**：这是数据的终点。它负责**本地解密**并呈现美观的界面，同时采集你的语音或打字指令。支持 iOS、Android 和 Web

> **通俗理解**：它是你的“远程监视器+遥控器”，让你在几千公里外也能像坐在电脑前一样操作

### 3、Happy Coder 的 运行逻辑

为了让我们在逻辑上彻底理解 Happy Coder 的运行机制，我们需要深入拆解它的**底层通信逻辑**、**安全加密方案** 以及 **AI 协作模型**。

- **标准终端**：用户 ↔ 终端 ↔ Claude Code。

- **Happy 模式**：用户 ↔ **Happy CLI** ↔ Claude Code。

  当 `Claude Code` 在屏幕上输出一行字时，Happy CLI 会瞬间捕捉到这行字，将其转化为加密数据流。

> 下图精髓：电脑是**真大脑**（Source of Truth），手机是**远程遥控器**（Shadow View），而中转服务器只是一个**看不见内容**的搬运工。

```mermaid
graph TD
    %% 全局样式定义
    classDef pcStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef mobileStyle fill:#f1f8e9,stroke:#33691e,stroke-width:2px;
    classDef relayStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px,stroke-dasharray: 5 5;
    classDef coreNode fill:#fff,stroke:#333,stroke-width:2px;

    subgraph Local_Environment ["💻 电脑端 (权威源 Source of Truth)"]
        direction TB
        A[Claude Code / Shell] <==> B{Happy CLI 代理}
        B -- "PTY 拦截" --> C([E2EE 加密引擎])
        D[物理键盘] -- "高优先级中断" --> B
    end

    subgraph Security_Boundary ["🛡️ 安全中转层 (Relay)"]
        E((Relay 服务器))
    end

    subgraph Remote_Client ["📱 手机端 (影子视图 Shadow View)"]
        direction TB
        F[Happy App] -- "私钥解密" --> G[[影子终端视图]]
        H[虚拟输入] -- "指令密文" --> F
    end

    %% 数据流转关系
    C == "加密二进制流 (Ciphertext)" ==> E
    E == "加密二进制流 (Ciphertext)" ==> F
    
    %% 交互控制逻辑
    B -. "1. 生成秘钥 & QR 交换" .-> F
    F -. "2. 频道同步握手" .-> E
    B -. "3. 建立 WebSocket 长连接" .-> E
    D -. "抢占机制限制输入" .-> H

    %% 应用样式
    class Local_Environment pcStyle;
    class Remote_Client mobileStyle;
    class Security_Boundary relayStyle;
    class B,C,F,G coreNode;
```

上图中核心逻辑拆解：

**核心链路：影子控制流**

手机虚拟输入 ↔ Happy App ↔ Relay 服务器 ↔ Happy CLI ↔ Claude Code

> 通俗说：手机端通过 App 发送指令，经过中转和加密代理，最终“模拟”成键盘敲击传递给 AI 助手

**安全链路：端到端加密流 （E2EE）**

本地数据 ↔ CLI 加密 ↔ 密文转发 (Relay) ↔ App 解密 ↔ 用户视觉

> 通俗说：数据在离开电脑前变身“乱码”，中转服务器只负责搬运，只有你的手机拥有解开乱码的私钥

**冲突链路：抢占机制 （Preemption）**

物理键盘输入 → Happy CLI 强制拦截 → 挂起远程输入

> 通俗说：当你在电脑前亲手打字时，系统会自动切断手机端的输入权限，确保本地操作的最高优先级

**协作链路：远程感知闭环**

AI 执行产生结果 → Happy CLI 捕获输出 → 手机 App 异步通知 → 用户决策介入

> 通俗说：将“发送指令”与“等待结果”解耦，即使你关掉手机屏幕，AI 在电脑端跑完后依然会通过该链路推送到你的手心里

### 4、安全与隐私

> 很多同学担心：*“我的代码经过它们的服务器，安全吗？”*

**官方承诺**：Happy 采用的是**零知识架构 (Zero-Knowledge Architecture)**

- **端到端加密**：配对时 通过二维码 或 URL 交换密钥，数据在离开你的电脑前已加密

- **中转站角色**：Happy Server 只是一个搬运工只负责转发加密后的“数据块”，它只能看到加密后的二进制块，完全无法解密你的内容

- **自托管选项**：如果你是极客，甚至可以根据 [官方指南](https://happy.engineering/docs/guides/self-hosting/) 在自己的 VPS 上部署私有的 Happy Server
- **开源透明**：你可以随时在 [GitHub](https://github.com/slopus/happy) 审查所有源代码

### 5、安全性 与 FAQ

- **Q：电脑休眠了还能连吗 ？**

A：不行。电脑必须保持运行且联网，建议在长任务期间调高系统的休眠时间 或 直接使用云主机就能保证长时间链接

- **Q：我的代码会被上传吗 ？**

A：不会。Happy 仅通过中转站传递加密后的“二进制块”，它不存储、也无法读取你的源代码

- **Q：运行 `happy` 报错怎么办 ？**

A：检查是否已全局安装了 `claude-code`。如果是权限问题，尝试在命令前加 `sudo`（Mac）或 以管理员身份运行（Win）

## 二、使用 Happy Coder 前的准备工作

本教程以 Windows 系统为主作为基础环境（为照顾到大多数同学）当然 Mac / Linux 也类似 不用担心。

### 1、环境支持

确保你的电脑满足以下条件：

- **安装了 Node.js**（建议版本 18 或更高）
- **安装了 Claude Code**（或其他支持的 CLI 工具）
- **有一台智能手机**（用于安装 App）
- 安装 Git （非必须，主要用于项目开发 与 Happy Coder 无关）

### 1.1、Node.js 安装

Node.js 官方下载地址：[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)

![image-20260131001148941](../public/images/Advanced/happy-coder/image-20260131001148941.png)

执行以下命令来验证版本

```bash
node -v

# 终端输出类似 v24.11.1 版本号，说明安装成功
```

### 1.2、Git 安装

在使用 Git 前我们得需要先安装 Git，Git 目前支持 Linux/Unix、Solaris、Mac 和 Windows 平台上运行。

- Git 各系统安装包下载地址：[https://git-scm.com/install/windows](https://git-scm.com/install/windows)
- 完成安装之后，就可以使用命令行的 git 工具（已经自带了 ssh 客户端）了，另外还有一个图形界面的 Git 项目管理工具
- 在开始菜单里找到`Git -> Git Bash`，会弹出 Git 命令窗口，你可以在该窗口进行 Git 操作

![image-20260131021033116](../public/images/Advanced/happy-coder/image-20260131021033116.png)

执行以下命令来验证版本

```bash
git -v

# 终端输出类似 git version 2.52.0.windows.1 版本号，说明安装成功
```

### 1.3、Claude Code 安装

【此步骤在 Windows PowerShell】卸载已安装的 Claude Code（未安装请跳过）

```bash
npm uninstall -g @anthropic-ai/claude-code
```

【此步骤在 Windows PowerShell】安装官方原版包，详细查阅 [Claude Code 官方文档](https://code.claude.com/docs/en/quickstart)

```bash
# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code
```

启动 Claude Code，终端输入 `claude` 指令，回车

![image-20260131034907440](../public/images/Advanced/happy-coder/image-20260131034907440.png)

> 注：文件夹地址栏输“cmd”进入命令行的方式使用 Claude code，更方便，更便捷

### 1.4、模型获取

国内模型用到最多的几大模型服务商

| 模型名称             | 所属公司     | 主要特点和应用                                               | 获取地址                                                     |
| :------------------- | :----------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **DeepSeek**         | **深度求索** | **性价比之王**：中国最强开源力量。DeepSeek-V3.2/R1 系列在数学逻辑和代码能力上惊艳全球，推理成本极低 | [DeepSeek](https://platform.deepseek.com)                    |
| **GLM（智谱清言）**  | **智谱 AI**  | **学术背景/强推理**：源自清华。GLM-5 系列在复杂推理和智能体 Agent 调度上表现出色，是国内开源社区的核心 | [智普 AI](https://bigmodel.cn/glm-coding)                    |
| **Qwen（通义千问）** | **阿里巴巴** | **全能型/商业生态**：支持超长上下文，在中文榜单和代码榜单常年领先，与阿里云深度绑定。 | [Qwen](https://bailian.console.aliyun.com/)                  |
| **Kimi**             | **月之暗面** | **长文本专家**：国内率先攻克“长上下文”瓶颈。最新 Kimi 2.5 具备原生多模态架构，支持视觉理解与编程、智能体集群高效协作、办公自动化全流程处理。并且开源 | [Kimi](https://www.kimi.com/membership/pricing)              |
| **MiniMax**          | **稀宇极智** | **情感交互/全模态**：旗下海螺 AI 在语音生成和视频生成（Hailuo 2.0）上处于国际领先水平，AI 社交属性强。 | [MiniMax](https://platform.minimaxi.com/docs/coding-plan/intro) |

国际模型用到最多的几大模型服务商

| 模型名称   | 所属公司      | 主要特点和应用                                               | 获取地址       |
| :--------- | :------------ | :----------------------------------------------------------- | :------------- |
| **Claude** | **Anthropic** | **人文与逻辑平衡**：以“宪法 AI”著称，安全性高。Claude 4.x 在创意写作、长文档分析和复杂编程（Claude Code）方面表现卓越 | 国内建议中转站 |
| **Gemini** | Google        | **原生多模态**：在搜索集成、长上下文（200 万+ tokens）和视频理解上极具优势。Gemini 3 号称 全栈文档与遗留代码专家 | 国内建议中转站 |
| **GPT**    | OpenAI        | **行业风向标**：融合了 o 系列的逻辑推理与 GPT 系列的快速响应。GPT-5 具备极强的多模态理解力及自主 Agent 执行力。<br />利用内置的 **o1 强化推理架构**，它在处理极高难度的算法优化、加密协议实现及需要反复推演的逻辑死结时，展现出超越常人的稳定性。 | 国内建议中转站 |

### 1.5、一定要购买模型的 API 服务吗

- 注：Happy Coder 本身是免费开源的。不需要任何费用 ！

- 但它调用的 Claude Code 、Gemini、CodeX 还是会消耗你原本在 模型厂商的 Token 额度 或 费用，所以必须购买模型服务才能使用
- Happy Coder 官方支持 Claude Code（默认）、Gemini、CodeX 这几个 CLI 终端
- 如：常用的 Claude Code 中也可以接入国产模型（**GLM**、**Qwen**、**DeepSeek**、**Kimi**、**MiniMax** 等）

## 三、Happy Coder 用法

深入浅出 Happy CLI 安装、授权登录、在浏览器端使用 Happy Coder 操作 Claude Code 终端、在 手机 App 端连接 Claude Code 终端，包括任意终端都可以任意接管。

### 1、在电脑上安装 Happy CLI

- 你需要在运行代码的电脑（或服务器）上安装 Happy Coder 的命令行工具
- **安装工具**： 确保你已安装 Node.js 18 或更高版本

打开你常用的终端（Terminal 或 PowerShell），输入以下命令：

```bash
npm install -g happy-coder
```

### 2、启动 Happy Coder（默认启动 Claude Code）

在终端输入

```bash
happy
# 或
happy claude
```

以 Windows 为例

![image-20260121191356935](../public/images/Advanced/happy-coder/image-20260121191356935.png)

运行 `happy claude` 指令后，选择什么终端进行身份验证（Mobile App 或 Web Browser）

![image-20260122210939700](../public/images/Advanced/happy-coder/image-20260122210939700.png)

注：

- 选项 1：Mobile App 移动应用，用于手机端连接 电脑端的 Happy Coder 命令行终端
- 选项 2：Web Browser 网页浏览器，用于在浏览器网页中连接  Happy Coder 命令行终端

### 3、选择 Web Browser 网页浏览器

选择 Web Browser，即可在浏览器网页中使用 Claude Code

- 创建账户，完成授权
- 开启会话，即可完成在浏览器网页中使用 Claude Code 的一切

在终端输入 `happy claude` 指令回车后，选择 `Web Browser`

![image-20260122210432625](../public/images/Advanced/happy-coder/image-20260122210432625.png)

当选择 `Web Browser` 后，会自动跳转弹出浏览器窗口，如下图

![image-20260121181508114](../public/images/Advanced/happy-coder/image-20260121181508114.png)

### 3.1、第一次接受连接会失败

第一次点击 “接受连接” 可能会连接终端失败，不过不要慌 ！

![image-20260121182200139](../public/images/Advanced/happy-coder/image-20260121182200139.png)

只需要打开 Happy Coder 的官网 [https://happy.engineering](https://happy.engineering/) 点击 “Launch Web App” （启动 Web 应用）

![image-20260121182844980](../public/images/Advanced/happy-coder/image-20260121182844980.png)

### 3.2、创建账户

点击 “Launch Web App” 按钮后会跳转 应用登录页面，先创建账户

![image-20260121182628650](../public/images/Advanced/happy-coder/image-20260121182628650.png)

点击 “创建账户” 后，会进入 “Web Browser” （网页浏览器）模式，会显示终端连接成功

![image-20260121185336273](../public/images/Advanced/happy-coder/image-20260121185336273.png)

点击 “启动新会话” 后，在文本框中输入 “你好” 测试，错误提示 “选择一台设备以启动会话”

![image-20260121190528627](../public/images/Advanced/happy-coder/image-20260121190528627.png)

再返回浏览器 “连接终端页面”，右键选择 “重新加载” 刷新一次当前页面，再次点击 “连接终端” 按钮

![image-20260122133741436](../public/images/Advanced/happy-coder/image-20260122133741436.png)

### 3.2、终端连接成功

刷新浏览器页面后，重新点击 “接受连接” 按钮，显示 “终端连接成功”，终端也发生了变化

![image-20260122174624545](../public/images/Advanced/happy-coder/image-20260122174624545.png)

当点击 “确定按钮” 后，再次点击左侧对话列表中的，当前终端目录就可以进入对话模式

![image-20260122175007857](../public/images/Advanced/happy-coder/image-20260122175007857.png)

### 3.3、开启会话，发送指令即可在浏览器中随意使用 Claude Code

点击左侧列表的当前对话后，页面即进入对话模式，同时终端也会实时同步

![image-20260122180649958](../public/images/Advanced/happy-coder/image-20260122180649958.png)

接下来就跟之前在 Claude Code 终端中开发项目一样，就不用那个黑窗口终端了（记住：终端不能关闭）

![image-20260122180854765](../public/images/Advanced/happy-coder/image-20260122180854765.png)

当我们在终端按下 `Ctrl + C` 时，happy claude 就会退出会话，同时浏览器网页端也会退出会话

![image-20260122204025422](../public/images/Advanced/happy-coder/image-20260122204025422.png)

再次连接，只需要在终端输入 `happy claude` 指令，浏览器端就会自动连接开启会话，终端也会自动进入 Claude Code 开启会话，无需再做任何验证。

![image-20260122205314503](../public/images/Advanced/happy-coder/image-20260122205314503.png)

> 现在，就可以继续在浏览器中使用 Claude Code 了

### 3.4、随时可接管

- 当浏览器处于会话状态，Claude Code 终端默认会是锁定（观察模式）状态（可看到生成内容与浏览器是实时同步的）
- 当需要在命令行终端人工接管时，光标在终端按下任意键即可接管，在终端即可再次输入指令
- 同时，在浏览器的对话框中继续输入指令发送后，浏览器端继续接管回来。则 Claude Code 终端继续回到锁定（观察模式）状态

### 4、选择 Mobile app 移动应用

如果你之前连接过其他终端（如：浏览器端），此时需要先退出登录后，才能再次进入移动端的连接

```bash
# Happy coder 退出登录
happy auth logout
```

输入指令后，终端提示 “您需要重新认证才能再次使用 Happy，您确定要注销吗？(y/N)” 

![image-20260125235204925](../public/images/Advanced/happy-coder/image-20260125235204925.png)

选择 "y" ，确认退出登录

![image-20260126030118571](../public/images/Advanced/happy-coder/image-20260126030118571.png)

退出登录后，终端再次输入启动 Happy Coder 指令

```bash
happy claude
```

在终端输入 `happy claude` 指令

![image-20260121191356935](../public/images/Advanced/happy-coder/image-20260121191356935.png)

运行 `happy claude` 指令后，选择 Mobile App 终端进行身份验证，回车确认

![image-20260122210244474](../public/images/Advanced/happy-coder/image-20260122210244474.png)

选择 ”Mobile App“ 后，会生成移动端认证二维码 和 URL 地址，进行身份验证

- 使用 Happy 手机端 App 扫描二维码
- 或 手动输入 URL 进行身份验证

![image-20260126030816690](../public/images/Advanced/happy-coder/image-20260126030816690.png)

### 4.1、  安装 Happy App

- 安卓端：[Happy Coder](https://play.google.com/store/apps/details?id=com.ex3ndr.happy) Google Play 下载
- IOS 端：[Happy Coder](https://apps.apple.com/us/app/happy-codex-claude-code-app/id6748571505)  Apple App Store 下载

> 安装成功后，直接打开 Happy App 不需要注册登录

<img src="../public/images/Advanced/happy-coder/image-20260126040729755.png" alt="image-20260126040729755" style="zoom: 20%;" />

### 4.2、通过 App 连接电脑终端

- 点击 App 中 “打开相机” 按钮，扫描终端的二维码
- 点击手动输入 URL，复制终端中 “Or manually enter this URL” 后的连接地址，手动输入

<img src="../public/images/Advanced/happy-coder/image-20260126041817239.png" alt="image-20260126041817239" style="zoom:20%;" />

### 4.3、开启 Claude Code 和 Happy App 实时会话

- 在手机端 Happy App 中可以文字输入
- 同时，也可以语音输入
- 移动端 和 电脑端 无需同一网络，随时随地都可以保持实时会话

<img src="../public/images/Advanced/happy-coder/image-20260126044357499.png" alt="image-20260126044357499" style="zoom: 50%;" />

当用户在移动端发出指令后，会实时同步到电脑端的 Claude Code 完成与模型的会话

![image-20260126044604246](../public/images/Advanced/happy-coder/image-20260126044604246.png)

> 此时，就可以根据自己的需求在手机上通过 Happy App 发出指令，完成自己的任何任务

### 4.4、随时可接管

- 当你回到桌前，不需要在手机上点退出
- 只需敲击电脑键盘的**任意键**控制权会瞬间从手机跳回电脑终端，手机端自动进入“观察模式”
- 同时，控制权要再次回到手机端，只需要在 Happy App 的对话框输入指令即可，电脑终端再次回到“观察模式”

## 四、Happy Coder 常用命令行

Happy Coder 常用的命令不多，梳理了 主要命令、实用命令、相关子命令 等 用到时随时查阅

### 1、主要命令（启动会话）

| **命令**        | **说明**                                                     |
| --------------- | ------------------------------------------------------------ |
| `happy`         | **默认启动 Claude Code**。启动 Claude Code 会话可选择 Mobile App 或 Web Browser |
| `happy gemini`  | 启动 Gemini CLI 会话                                         |
| `happy codex`   | 启动 OpenAI Codex 模式                                       |
| `happy connect` | 连接并验证服务（如 `happy connect gemini`）                  |

### 2、实用命令

| **命令**        | **功能说明 **                                                |
| --------------- | ------------------------------------------------------------ |
| `happy auth`    | **管理身份验证**：用于登录、退出 或 管理 Happy Coder 自身的账户体系<br />如：`happy auth logout` 退出会话登录 |
| `happy connect` | **云端密钥同步**：将 AI 厂商的 API 密钥安全存储在 Happy 云端，以便跨设备调用 |
| `happy notify`  | **发送推送通知**：手动向你连接的移动设备（手机/平板）发送推送消息 |
| `happy daemon`  | **管理后台服务**：启动、停止或重启 Happy Coder 的守护进程（后台常驻服务） |
| `happy doctor`  | **系统诊断与排错**：运行环境自检，检测配置错误并提供修复建议 |

### 3、连接子命令

| **命令**               | **功能说明**                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `happy connect gemini` | **Google Gemini 身份验证**：关联你的 Google 账号以使用 Gemini 模型。 |
| `happy connect claude` | **Anthropic Claude 身份验证**：关联你的 Anthropic 账号以使用 Claude 系列模型。 |
| `happy connect codex`  | **OpenAI Codex 身份验证**：关联你的 OpenAI 账号以使用 Codex/GPT 相关模型。 |
| `happy connect status` | **查看连接状态**：显示目前所有 AI 厂商的认证连接情况。       |

### 4、Gemini 子命令速查表

| **命令**                         | **功能说明 **                                                |
| -------------------------------- | ------------------------------------------------------------ |
| `happy gemini`                   | **启动 Gemini 会话**：进入基于 Gemini 模型的 AI 编程模式     |
| `happy gemini model set <model>` | **设置默认模型**：切换使用的具体模型版本（如 flash 或 pro）  |
| `happy gemini model get`         | **查看当前模型**：确认目前正在运行的是哪个版本的 Gemini      |
| `happy gemini project set <id>`  | **设置项目 ID**：配置 Google Cloud 项目 ID（适用于企业/工作区账号） |
| `happy gemini project get`       | **查看当前项目 ID**                                          |

Gemini 最新模型建议（2026年 2月版）目前 Gemini 已经全面进化到 **3.0 时代**。如果你在使用 Happy Coder，建议根据任务复杂度选择以下模型：

| **模型 ID**               | **角色定位**        | **适用场景**                                                 |
| ------------------------- | ------------------- | ------------------------------------------------------------ |
| **`gemini-3-pro`**        | **最强大脑 / 旗舰** | **深度开发与架构设计**：具备“Deep Think”模式，适合重构复杂逻辑、编写大型模块、跨文件代码审计。 |
| **`gemini-3-flash`**      | **全能选手 / 默认** | **日常高效编程**：目前的默认首选。推理能力超越了 2.5 Pro，但保持了极低的延迟。适合快速修复 Bug、编写单元测试。 |
| **`gemini-3-flash-lite`** | **效率专家 / 轻量** | **简单辅助与格式化**：极高性价比，适合处理简单的代码格式化、写注释或实时语法检查。 |

相关操作命令

```bash
# 1. 切换到性能最强的 3 Pro (推荐用于复杂项目)
happy gemini model set gemini-3-pro

# 或者切换到速度最快的 3 Flash (推荐日常使用)
happy gemini model set gemini-3-flash

# 2. 验证设置是否成功
happy gemini model get

# 3. 开启 AI 编程会话
happy gemini
```

## 五、在云端开发，使用 Happy Coder 随时随地 AI 编程

我们如果希望可随时随地通过桌面客户端、移动端或小程序等连接使用。

不受本地设备限制，满足随时开启办公、AI 开发、设计、游戏的需求。可随时切换不同规格配置的电脑，按需使用，弹性灵活的升级 和 释放。就可以选择 云主机 或 云电脑。

> 本次我们选择使用门槛最低的功能最强大的 **“阿里无影云电脑 + Happy Coder”** 来实现在云端实现随时随地 AI 编程

![image-20260201045344280](../public/images/Advanced/happy-coder/image-20260201045344280.png)

### 1、云电脑是什么

- 你再也看不到主机箱了，云电脑的核心部件都跑在阿里云上，你只需要准备显示屏和键鼠就行
- 正因为核心部件都在云上，所以你可以随时升降电脑配置、随地跨设备使用云电脑
- 并且只有开机期间才需要付费

![image-20260201040412804](../public/images/Advanced/happy-coder/image-20260201040412804.png)

### 2、云电脑的使用场景

- **AI 办公 与 AI 开发：**AI 模型随时接入辅助日常办公，多环境多系统，适用与AI开发
- **云上设计 / 编程：**可随时升降配置，实时感受高配电脑的丝滑设计体验
- **AI 领域尝鲜**：AI 领域发展非常迅速，几乎每天都会有新的工具
- **教培学习：**教学电脑内容一键共享，省去软件文件下载、配置时间
- **电竞娱乐：**云游戏一键开启畅玩《黑神话：悟空》《永劫无间》等超多云游戏
- **出差办公：**出差无需携带笨重打电脑平板、手机等随时变为办公电脑
- **低配机、MacBook、手机打高端游戏：**低配机随时复活变高配，MacBook、手机也畅玩 3A 大作游戏

![image-20260201044503810](../public/images/Advanced/happy-coder/image-20260201044503810.png)

### 3、云电脑有什么优势

深入浅出从三个方面解读云电脑的优势：突破性能瓶颈、拓展设备功能、跨越平台限制

### 3.1、突破性能瓶颈

通过无影客户端，低配置的传统电脑也能运行大型软件 或 游戏，包括 编程 都可以。

> 在编程开发、AI 大模型部署 等，都可随时升级提高配置，以满足实际需求

![image-20260201040810890](../public/images/Advanced/happy-coder/image-20260201040810890.png)

### 3.2、拓展设备功能

主打休闲娱乐的 Pad 类设备，只要装上无影云电脑客户端，也能立刻化身为办公利器，工作休闲两不误。

> 有没有发现 ？出门再也不用背电脑了！就连电视机，也可以秒变电脑。



![image-20260201042041634](../public/images/Advanced/happy-coder/image-20260201042041634.png)



### 3.3、跨越平台限制

对于仅支持限定平台的软件或游戏，云电脑可以帮你跨越这一限制。不用捣鼓麻烦的双系统 或 虚拟机，也能在 Mac 上轻松玩 3A 游戏 ！

> 包括编程开发，需要用到 Linux 系统、Windows 等多平台测试开发时，随时切换省时省力

![image-20260201042214018](../public/images/Advanced/happy-coder/image-20260201042214018.png)

### 4、云电脑怎么用

只需安装 并 登录无影客户端，就能在客户端内一键启动云电脑。

- 电脑端：支持 Windows 客户端、macOS 客户端
- Web 端：在 Chrome、Firefox 等浏览器中支持打开 Web 端进 行登录
- 移动端：支持 iOS 端、Android 端

> 无影云电脑客户端下载地址：[https://www.aliyun.com/product/wuying/download](https://www.aliyun.com/product/wuying/download)

### 4.1、安装无影客户端（电脑端）

- 请根据您的本地设备类型和操作系统版本，下载对应的客户端版本；
- 安装成功后，即可通过客户端随时随地访问无影服务
- 推荐使用阿里系账号扫码登录即可

![image-20260206210230299](../public/images/Advanced/happy-coder/image-20260206210230299.png)

选择个人版，使用支付宝登录

![image-20260202222641438](../public/images/Advanced/happy-coder/image-20260202222641438.png)

新用户第一次注册，可免费试用一个月（学习使用完全够用）

![image-20260203190342789](../public/images/Advanced/happy-coder/image-20260203190342789.png)

确认领取并下单

- 黄金款：系统盘 60G + 数据盘 40 G + 公网带宽 10 Mbps + 40 核时算力（免费赠送一个月、到期续费 9.9元/月）
- 240 核时算力 （免费 1年有效期）

![image-20260203224450286](../public/images/Advanced/happy-coder/image-20260203224450286.png)

设置云电脑基础信息

- 云电脑名称：自定义一个名称（类似本地电脑的名称）
- 常用地：就近原则（选择距离自己城市近的节点，理论上速度更快）

![image-20260203224822787](../public/images/Advanced/happy-coder/image-20260203224822787.png)

点击立即下单即可

![image-20260203230146847](../public/images/Advanced/happy-coder/image-20260203230146847.png)

下单成功后，扫描开通免密支付

> 注：自动续费可以去支付宝取消即可。不影响新注册免费用政策，后续不用也不会继续收费，不用担心

![image-20260203235745450](../public/images/Advanced/happy-coder/image-20260203235745450.png)

支付宝扫码成功后，点击 “已完成开通并授权扣款” 按钮

![image-20260204000019220](../public/images/Advanced/happy-coder/image-20260204000019220.png)

进入订购成功页面

![image-20260204000140841](../public/images/Advanced/happy-coder/image-20260204000140841.png)

可关闭订购成功页面，进入无影云电脑客户端首页，直接点击 “连接” 按钮 即可进入云电脑

![image-20260204000837531](../public/images/Advanced/happy-coder/image-20260204000837531.png)

第一次进入默认是 Windows 系统，所有操作跟本地电脑一模一样

![image-20260204001044451](../public/images/Advanced/happy-coder/image-20260204001044451.png)

注：

- 在云电脑中安装开发环境、开发工具等与本地电脑一模一样
- 同时，关于 AI 编程相关工具安装 和 模型配置 同理

### 4.2、无影云电脑切换操作系统

- 默认是 Windows 可随时切换 Linux 系统
- 也可随时切回 Windows 系统，方法同样

![image-20260204002406928](../public/images/Advanced/happy-coder/image-20260204002406928.png)

确定后，再次确认即可切换操作系统

![image-20260204002601380](../public/images/Advanced/happy-coder/image-20260204002601380.png)

系统切换成功后，进入 Linux 系统

![image-20260204210109896](../public/images/Advanced/happy-coder/image-20260204210109896.png)

### 4.3、安装无影客户端（移动端）

如果在移动设备上使用

- 通过应用商店搜索下载安装 **无影云电脑 App**（管理 和 操作云电脑）
- 通过支付宝扫码登录后，也可以通过支付宝小程序管理 无影云电脑（只能管理不能操作云电脑）

![image-20260204220317499](../public/images/Advanced/happy-coder/image-20260204220317499.png)

### 4.4、云电脑开机灵活选择配置

云电脑最强大一直就在于它可以在每次开机前随时选择我们需要的配置

| **模式名称** | **CPU 核心数** | 内存   | GPU 显存 | **核时算力费率**   | **建议适用场景**                                             |
| ------------ | -------------- | ------ | -------- | ------------------ | ------------------------------------------------------------ |
| **经济模式** | 4核            | 8 GiB  | -        | 4 核时算力 / 小时  | 轻量级代码编辑、文档处理、简单脚本运行                       |
| **流畅模式** | 8核            | 16 GiB | -        | 8 核时算力 / 小时  | **日常 AI 开发首选**。流畅运行 VS Code 和 多个 AI Agent 会话 |
| **性能模式** | 16核           | 32 GiB | -        | 16 核时算力 / 小时 | 大型项目编译、多容器运行、复杂架构分析                       |
| **电竞模式** | 12核           | 46 GiB | 11 GiB   | 60 核时算力 / 小时 | 需要 GPU 加速的任务、运行大型本地模型或图形渲染              |

> 试用可选择最低配置，不够用时随时切换即可（配置越高 每小时消耗的核时越多）

![image-20260205223928504](../public/images/Advanced/happy-coder/image-20260205223928504.png)

### 5、在云电脑上部署安装 Happy Coder 实现全面上云

- 和本地一样安装安装配置好 Claude Code 工具 与 对应的模型，保证与本地一样可以正常使用
- 在云电脑上安装 Happy Coder，具体步骤与本地一样

![image-20260205194841161](../public/images/Advanced/happy-coder/image-20260205194841161.png)

- 安装成功后，使用 `happy claude` 选择 Mobile App 终端进行身份验证，回车确认

![image-20260205195159053](../public/images/Advanced/happy-coder/image-20260205195159053.png)

选择 ”Mobile App“ 后，会生成移动端认证二维码 和 URL 地址，进行身份验证

- 使用 Happy 手机端 App 扫描二维码
- 或 手动输入 URL 进行身份验证

![image-20260205202715658](../public/images/Advanced/happy-coder/image-20260205202715658.png)

### 5.1、在手机端 Happy App 上连接云电脑终端

打开手机端 Happy App 通过扫描二维码 或 手动输入 URL 进行身份验证，输入提示词即可连接云电脑上 Claude Code 进行项目的开发

![image-20260205205229841](../public/images/Advanced/happy-coder/image-20260205205229841.png)

同时云电脑端的 Claude Code 也会同步

![image-20260205205508549](../public/images/Advanced/happy-coder/image-20260205205508549.png)

### 5.2、随时可接管

- 当你回到桌前，不需要在手机上点退出
- 只需敲击电脑键盘的**任意键**控制权会瞬间从手机跳回电脑终端，手机端自动进入“观察模式”
- 同时，控制权要再次回到手机端，只需要在 Happy App 的对话框输入指令即可，电脑终端再次回到“观察模式”

> 另外，云电脑还有一个好处是，直接可以通过 “无影云电脑 App” 在手机上随时操作（接管）Claude Code

### 5.3、在无影云电脑 App 上操控云电脑

![image-20260205210533916](../public/images/Advanced/happy-coder/image-20260205210533916.png)

## 六、为什么会选择这套 AI 编程的工具链

在 AI 编程时代，传统的“电脑 + 编译器”模式正成为瓶颈。我选择 Happy Coder + Claude Code（Gemini 或 Codex） + Happy App + 无影云电脑，是为了打造一个永不掉线、多脑协同、且绝对安全的超级开发环境。将 这套工具链作为日常项目开发的最佳实践

- 它实际上代表了目前最前沿的 **“Agent-First（智能体优先）”** 开发范式
- 本质：**云端算力中心 + 多模型，全能大脑 + 跨端随身控制**

### 1、核心架构

这套体系本质上是把 **“重型生产环境”** 留在云端，把**“智能决策”**交给 AI，把**“控制权”**握在手心

-  **算力底座（无影云电脑）：** 24 小时永不掉线、提供高性能、弹性可扩展的云端 Linux/Windows 环境。确保复杂任务不卡顿（提供最高 12 核 GPU 、46G 内存、11G GPU显存的弹性算力，企业版配置还可更高）实现代码资产“不落地”，从物理层面安全隔离、杜绝数据泄露。
- **执行引擎：**  一个全能的 “常驻程序员”，具备多模型调度能力的 CLI 智能代理。Happy Coder 原生支持 Claude Code + Gemini CLI + Codex，可接入国内外常用的所有模型（Claude 、Gemini、GPT、Minimax，Kimi，GML）等
- **协同网关/安全加密：** Happy Coder + Happy 手机 APP（实现云端终端 与 移动端的无缝连接与消息推送）采用与 Signal 相同的 **E2EE 端到端加密协议**。代码在云桌面加密后传出，中转服务器看到的只是乱码，只有我手机上的私钥能解密。

> 解决开发者 “随时随地、高效率、低成本” 的痛点

### 2、它是我的“全能大脑”、更是模型全明星

不再纠结用 Claude 还是 Gemini，国内外所有模型可以随时切换、博采众长的“最强大脑”。它能读懂我几十万行的代码库，也能给出最精准的重构建议。

### 3、它是我的“离身生产力”：AI 在干活，我在喝咖啡

这是最让我兴奋的一点。借助 **Happy Coder** 与 **Happy App** 的联动，我实现了**异步开发**：

- **任务脱机运行：** 我可以在**无影云电脑**下达重构指令，然后合上电脑去健身或通勤。
- **远程实时把关：** 当 AI 需要确认文件写入或运行报错时，**手机 App** 会立刻推送通知。我只需在手机上点一下“允许”，AI 就能在云端继续狂奔。

> **通俗点说：** 我雇了一个 24 小时待命的资深程序员，我只需要在手机上做“审批”工作。

### 4、它是我的“数字堡垒”：比本地开发更安全的架构

安全性不是附件，而是这套体系的底座。通过“数据不落地”与“端到端加密”，我解决了 AI 开发最大的隐私隐患：

- **特种级加密传输：** **Happy Coder** 采用与 Signal 相同的 **E2EE 端到端加密协议**。代码在云桌面加密后传出，中转服务器看到的只是乱码，只有我手机上的私钥能解密。
- **物理级隐私隔离：** 所有核心代码、API Keys 和开发环境都锁在**无影云电脑**中。我的个人设备不留存任何敏感数据，即便手机丢失，代码资产依然稳坐云端保险箱。
- **匿名与最小化权限：** 无需注册账号，减少了身份泄露的攻击面；AI 的每一次关键操作都需我远程手动授权，防范了 Agent “跑偏”带来的风险。

### 5、它是我的“移动指挥部”：性能 与 自由的极致平衡

- **算力自由：** 借助**无影云电脑**，我不再受限于本地电脑的配置。编译慢了 ？一键切换到“性能模式”；想省钱了 ？切回“流畅模式”
- **空间自由：** 无论是在咖啡馆用平板，还是在高铁上用手机，我连接的都是同一个高性能的 Linux/Windows 环境。环境永远一致，代码永远最新，数据永远安全（代码不落地）
- **省钱专家：** 把每一分钱花在刀刃上，无影云电脑按核时计费，不用即停

### 6、总结：这套工具链的核心逻辑

| **维度**     | **传统本地开发模式**     | **“Happy+无影” 模式**                            |
| ------------ | ------------------------ | ------------------------------------------------ |
| **工作地点** | 被拴在工位屏幕前         | 任何有网络的地方（手机、平板、电脑）             |
| **工作效率** | 盯着进度条，不敢离开     | **异步交付**，手机审批，AI 自动推进              |
| **算力资源** | 受限于本地硬件，发热严重 | 云端弹性配置，从 4 核到 12 核 GPU 甚至更高随心换 |
| **AI 能力**  | 单一模型，上下文有限     | 多模型混血，具备百万级长上下文分析力             |
