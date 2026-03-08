---
title: 260307-AI 驱动的原型开发：v0、Bolt 和 Lovable 对比
description: 深入分析三大 AI 辅助开发工具在快速原型开发中的实际应用、局限与工程权衡
author: Addy Osmani
source: https://addyo.substack.com/p/ai-driven-prototyping-v0-bolt-and
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
- AI 开发工具
- 原型开发
- v0
- Bolt
- Lovable
- 全栈开发
- UI生成
---

# AI 驱动的原型开发：v0、Bolt 和 Lovable 对比


**作者：Addy Osmani**

**原文：[查看原文](https://addyo.substack.com/p/ai-driven-prototyping-v0-bolt-and)**



> ## 摘要
>
> 探索新一代 AI 辅助开发工具

---

在竞争激烈的 AI 辅助开发工具赛道里，Vercel 的 [v0](http://v0.dev/)、StackBlitz 的 [Bolt](http://bolt.new/) 和 [Lovable](https://lovable.dev/) 已经成为原型开发领域最受关注的三个选手。本文会从工程视角比较它们在快速构建 MVP 时的实际表现、边界和取舍。

## 全景：v0、Bolt、Lovable

这些工具试图解决的基本挑战并不新鲜：减少从构思到实现之间的摩擦。然而，它们在架构和执行方面的方法存在显著差异。

[v0.dev](http://v0.dev/) 在**快速 UI 原型开发**方面尤其突出。很多团队会用它补充设计系统、维护组件库，或者快速试验界面方案。它与 Tailwind、Material UI 等常见 UI 框架配合顺畅。如今的 v0 已不只会生成 UI 组件，也开始覆盖后端能力，包括数据库和 API 路由集成，显示出 Vercel 在全栈方向上的明确投入。虽然这部分能力还在早期，但已经能看出竞争力。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/01.png)

_我经常先给 v0 一个参考稿——要么上传图片，要么直接喂 Figma 设计——再通过几轮提示，把交互细化到我满意的程度。如果你愿意把设计往后放，纯文本提示也能起步。若原型需要持久化能力，v0 也能配合 Prisma 一类方案把数据模型先搭起来。_

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/02.jpg)

StackBlitz的[Bolt.new](http://bolt.new/)专为**前端和全栈开发**设计，允许前端和后端原型开发，无需设置本地环境。它因速度快（非常适合快速MVP）、灵活性以及自定义部署流程的能力而受到赞誉。Bolt支持各种框架并提供实时调试，适合需要快速原型开发和部署应用的开发者。其基于浏览器的环境简化了工作流程，尽管对于非常复杂的项目可能面临限制。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/03.png)

_我用 Bolt 做过不少东西，从带认证、存储能力的 React + Tailwind 全栈应用，到调用浏览器内 AI 模型、WASM 的更复杂原型，整体体验都不错。和 v0 一样，它也支持把图片、文件一起作为提示输入。它与 Supabase 的集成做得比较顺，省去了不少手工建表和对接的步骤。_

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/04.jpg)

[Lovable](https://lovable.dev/) 同样聚焦**前端与全栈开发**，但整体路线更偏“引导式体验”。它擅长从文本提示直接生成完整应用，把数据库、认证等后端部分也一起带上，对团队协作场景尤其友好。它很早就接入了 Supabase 这类数据库与认证服务。不过到了复杂项目里，它在可定制性上的上限通常不如 Bolt。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/05.png)

_我觉得 Lovable 在能力面上和 Bolt 很接近，Supabase 集成也都做得不错。就目前而言，我更信任 Bolt 在少来回修改的情况下产出更成熟的 UI。不过这很看具体项目，我还是建议两者都试一下，再决定哪一个更贴你的工作流。_

在幕后，这些工具大多利用Claude Sonnet，并使用Gemini或o1等其他模型处理特殊用例。

### v0的UI中心方法

Vercel的v0对UI开发采取了有主见的立场，专注于通过自然语言处理进行**组件生成**。它的与众不同之处在于与React生态系统的紧密集成，特别是[Next.js](https://nextjs.org/)和[shadcn/ui](https://ui.shadcn.com/)。它已开始支持全栈，现在可以在一次生成中创建多个文件。

**开发者体验亮点**：

- 组件迭代的即时视觉反馈循环
- 与UI库的npm包原生集成
- 并排代码生成和预览
- 通过Vercel的无缝部署管道

**工程权衡**：

- 该工具假定以React为中心的工作流程
- 对Vercel生态系统的依赖会造成潜在的供应商锁定
- 复杂UI模式的组件生成可能不一致
- 虽然后端功能仍在开发中，但Vercel已表现出增强这一点的承诺，例如提供强大的服务器端支持

**我喜欢的额外功能**：

**CLI集成**：v0允许开发者通过其"Blocks"功能将组件直接安装到项目中。生成组件后，v0提供一个npx命令，你可以在终端中运行以将组件安装到代码库中。这对于使用Next.js的人特别有益，因为安装可以直接添加组件及其所有依赖项。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/06.png)

**Figma集成**：用户可以直接从Figma导入设计到v0，作为UI生成的起点。这允许从设计到代码的更平滑过渡，利用现有的设计工作来加速开发。导入设计时，v0现在能够识别Figma文件中使用的确切颜色和设计令牌。

**支持动画和过渡**：v0不仅可以生成静态UI，还可以包含基本动画或过渡，如果指定，可以利用Framer Motion等库，为原型添加交互性。[Motion](https://x.com/mattgperry/status/1875176041842647286?现在也支持直接在v0中打开他们的React示例。

### Bolt：全栈浏览器IDE

StackBlitz的Bolt代表了一种更雄心勃勃的方法，试图通过[WebContainers](http://webcontainers/)技术将整个开发栈带入浏览器。最近的新增功能，包括实验性的Supabase集成，标志着向全面全栈开发的推进。

**开发者体验亮点**：

- 基于浏览器的开发环境消除了本地设置
- 实时调试，即时反馈
- 框架无关，支持多种技术栈
- 一键部署到包括Netlify在内的各种平台

**工程权衡**：

- 浏览器限制可能影响大型项目的性能
- 基于浏览器的开发的安全考虑（例如CORS）
- 追赶功能（如[Supabase集成](https://x.com/weswinder/status/1868486090220343744)）运行良好但仍在变化中
- 网络依赖可能影响开发速度

**我喜欢的额外功能**：

**文件锁定和定向**：Bolt有一个功能，开发者可以[控制](https://x.com/stackblitz/status/1854205385344999477)Bolt AI可以修改或保持不变的文件。这允许有针对性的开发或保护代码库的某些部分不被重写，当你在应用的某个部分工作而不想影响其余部分时，这非常有用。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/07.png)

**在StackBlitz中打开选项**：此功能允许用户无缝地从Bolt的AI驱动开发环境过渡到StackBlitz的交互式编码空间，实现进一步的GitHub同步、手动编辑或与现有StackBlitz项目的集成。当你需要调整AI生成的代码或添加Bolt的自动生成功能尚不支持的复杂功能时，这特别有用。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/08.png)

**请求中继**：Bolt实现了"[请求中继](https://x.com/stackblitz/status/1869097850233376911)"功能，允许你的Bolt应用连接到通常会因CORS策略而被浏览器阻止的API和服务。我确实遇到过几个这个功能有用的情况。

**通过提示文件自定义指令**：[最近的更新](https://x.com/stackblitz/status/1860013597281370565?允许开发者编辑包含项目自定义指令的"提示文件"。此文件在每次页面刷新时加载，确保你的提示在会话之间保持一致。此功能对于维护项目特定的配置或样式特别有用。

**本地开发选项**：虽然Bolt以其基于浏览器的[开发](https://www.reddit.com/r/boltnewbuilders/comments/1hnujvn/lovable_vs_bolt/)而闻名，但有一个名为[Bolt.diy](http://bolt.diy/)的本地版本。这允许开发者自定义使用的模型（Ollama、LMStudio、Gemini、OpenRouter等）。

### Lovable：引导式全栈体验

Lovable采用独特的方法，专注于引导式开发，对架构和工具有强烈的主见。其原生Supabase集成和对开发者指导的强调使其与众不同。

**开发者体验亮点**：

- 结构化的全栈开发方法
- 强大的[Supabase集成](https://x.com/weswinder/status/1865136721794347078?用于后端服务
- GitHub优先的协作功能
- 前端和后端的自然语言到代码转换

**工程权衡**：

- 有主见的架构可能限制自定义
- 基于令牌的限制影响开发流程
- 较新的平台，社区支持较少
- 对于习惯更多控制的有经验开发者来说有学习曲线

**我喜欢的额外功能**：

**选择元素功能**：在Lovable中，你可以直接从预览中[选择](https://pixeljets.com/blog/lovable-dev-vs-bolt-new/)一个元素，并在聊天消息中引用它进行修改。这个不常被讨论的功能通过将你的反馈直接链接到UI元素，使迭代设计调整更加直观。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/09.jpg)

**自定义指令和知识库**：Lovable支持在项目中创建"知识库"，你可以在其中定义项目特定的细节、功能或设计指南。这有助于保持一致性并为AI提供上下文以获得更好的结果。

## 各工具的共同挑战

用 AI 辅助工具构建 Web 应用，确实能大幅降低起步成本，但这类平台也有一些共通挑战。

- **高度依赖提示质量与迭代质量**：如果需求表达得不够清楚，或者上下文约束不足，生成结果就容易偏离预期，后续还得靠补充说明和多轮迭代拉回来。这个问题本质上是规格与约束的问题，不是哪一家工具独有的“智力缺陷”。

- **成本和资源限制**：归根结底，如果你不运行本地模型，就必须有人为计算付费。所有三个工具都有类似的基于令牌的使用限制问题，这可能影响在大型项目上快速迭代的能力，促使用户更快地转向付费计划。

- **最终需要"导出"或"弹出"**：引导工具非常适合帮助你比以前更快地达到MVP，但会遇到我在[70%问题](https://addyo.substack.com/p/the-70-problem-hard-truths-about?中写到的问题。你可能会达到一个复杂性阈值，在那里转向本地编辑代码（无论是使用传统编辑器手动编辑还是使用Cursor/Cline/Windsurf等AI增强编辑器）将是必要的。

这些挑战并不会否定它们在 Web 开发里的价值，但会提醒你：想把原型真正推进到可持续开发，通常还需要额外的时间、预算，或者配套工具链。

## **用例和建议**

1. **快速前端组件原型开发**：v0是最佳选择，提供快速且视觉上吸引人的设计。值得尝试他们的全栈支持。

2. **快速全栈应用开发**：Bolt为前端和后端开发提供了全面的环境，具有最快的生成时间。

3. **协作团队项目**：Lovable与GitHub的集成和分支功能使其成为基于团队开发的理想选择。

4. **后端密集型应用**：Bolt和Lovable都提供强大的后端集成，Lovable在Supabase等特定集成方面具有优势（Bolt也一直在探索）。

这些工具的演变表明了向更集成的开发环境的趋势，但实现这一目标的方法各不相同。

## 结论

这些工具之间的选择最终取决于具体的工程需求和团队偏好：

- 在基于React的项目中使用v0进行快速UI开发

- 选择Bolt进行快速全栈原型和MVP

- 当团队一致性和引导式开发是优先事项时选择Lovable

这些工具当然还不能完全替代传统开发流程，但它们已经显著降低了从想法到可运行原型之间的摩擦。最终谁更适合你，取决于它在“自动化”和“开发者控制权”之间的平衡，以及它能否随着项目复杂度继续撑下去。

![](/images/articles/localized/03-toolchain-frameworks/ai-driven-prototyping-v0-bolt-and-lovable-compared/10.png)
