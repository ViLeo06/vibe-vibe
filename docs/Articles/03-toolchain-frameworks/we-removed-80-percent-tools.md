---
title: 260307-我们删掉了智能体 80% 的工具
description: Vercel 花了数月构建复杂的 text-to-SQL 智能体，但最终发现：有时候简单就是更好。给它执行任意 bash 命令的能力，反而超越了所有精心设计的工具
author: Andrew Qu
source: https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
- Vercel
- 智能体工程
- 架构设计
- 工具简化
---

# 我们删掉了智能体 80% 的工具

**作者：Andrew Qu**

**原文：[查看原文](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)**

<div class="article-meta">
</div>

> Vercel 花了数月构建复杂的 text-to-SQL 智能体，但最终发现：有时候简单就是更好。给它执行任意 bash 命令的能力，反而超越了所有精心设计的工具。

结果变得更好了。

我们花了数月时间构建一个复杂的内部 text-to-SQL 智能体 d0，配备了专门的工具、大量的 prompt 工程和精心的上下文管理。它能工作……勉强算是。但它很脆弱、很慢，而且需要持续维护。

于是我们尝试了不同的方法。我们删掉了大部分代码，把智能体精简到只有一个工具：**执行任意 bash 命令**。我们称之为文件系统智能体。Claude 直接访问你的文件，用 `grep`、`cat` 和 `ls` 自己搞定一切。

智能体变得更简单，同时也变得更好。成功率从 80% 提升到 100%。更少的步骤，更少的 token，更快的响应。这一切都是通过做得更少实现的。

## 什么是 d0

如果说 [v0](https://v0.app/) 是我们用于构建 UI 的 AI，那么 d0 就是我们用于理解数据的 AI。

![d0 让任何人都能通过在 Slack 中提问来做出数据驱动的决策](/images/articles/localized/03-toolchain-frameworks/we-removed-80-percent-tools/01.png)

d0 将自然语言问题翻译成针对我们分析基础设施的 SQL 查询，让团队中的任何人都能获得答案，无需编写代码或等待数据团队。

当 d0 运行良好时，它让整个公司的数据访问民主化。当它出问题时，人们就会失去信任，回到在 Slack 里找分析师的老路。我们需要 d0 快速、准确、可靠。

## 别挡着模型的路

回顾过去，我们在解决模型本身就能处理的问题。我们假设它会在复杂的 schema 中迷路，做出错误的 join，或者幻想出不存在的表名。所以我们构建了护栏。我们预先过滤上下文，限制它的选项，用验证逻辑包裹每一次交互。我们在替模型思考：

- 构建了多个专门的工具（schema 查找、查询验证、错误恢复等）
- 添加了大量 prompt 工程来约束推理
- 使用精心的上下文管理来避免压垮模型
- 编写了手工检索代码来呈现"相关的" schema 信息和维度属性

每个边缘情况都意味着又一个补丁，每次模型更新都意味着重新校准我们的约束。我们花在维护脚手架上的时间，比改进智能体本身还多。

ai-sdk@6.0.0-beta.160 ToolLoopAgent

```typescript
import { ToolLoopAgent } from 'ai'
import { GetEntityJoins, LoadCatalog /*...*/ } from '@/lib/tools'

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-opus-4.5',
  instructions: '',
  tools: {
    GetEntityJoins,
    LoadCatalog,
    RecallContext,
    LoadEntityDetails,
    SearchCatalog,
    ClarifyIntent,
    SearchSchema,
    GenerateAnalysisPlan,
    FinalizeQueryPlan,
    FinalizeNoData,
    JoinPathFinder,
    SyntaxValidator,
    FinalizeBuild,
    ExecuteSQL,
    FormatResults,
    VisualizeData,
    ExplainResults
  }
})
```

## 一个新想法：如果我们就是……停下来呢？

我们意识到我们在对抗重力。在约束模型的推理。在总结它本可以自己阅读的信息。在构建工具来保护它免受它本可以处理的复杂性的影响。

所以我们停下来了。假设是：如果我们只是给 Claude 访问原始 Cube DSL 文件的权限，让它自由发挥呢？如果 bash 就是你所需要的一切呢？模型越来越聪明，上下文窗口越来越大，也许最好的智能体架构就是几乎没有架构。

### v2：文件系统就是智能体

**新技术栈**：

- **模型**: Claude Opus 4.5 via [AI SDK](https://ai-sdk.dev/)
- **执行**: [Vercel Sandbox](https://vercel.com/sandbox) 用于上下文探索
- **路由**: [Vercel Gateway](https://vercel.com/ai-gateway) 用于请求处理和可观测性
- **服务器**: Next.js API 路由，使用 [Vercel Slack Bolt](https://vercel.com/academy/slack-agents)
- **数据层**: Cube 语义层，作为 YAML、Markdown 和 JSON 文件的目录

文件系统智能体现在像人类分析师一样浏览我们的语义层。它读取文件，用 grep 搜索模式，构建心智模型，并使用标准 Unix 工具如 `grep`、`cat`、`find` 和 `ls` 编写 SQL。

这之所以有效，是因为语义层本身就是很好的文档。文件包含维度定义、度量计算和 join 关系。我们在构建工具来总结本来就清晰可读的内容。Claude 只需要直接读取它的权限。

ai-sdk@6.0.0 ToolLoopAgent

```typescript
import { Sandbox } from "@vercel/sandbox";
import { files } from './semantic-catalog'
import { tool, ToolLoopAgent } from "ai";
import { ExecuteSQL } from "@/lib/tools";

const sandbox = await Sandbox.create();
await sandbox.writeFiles(files);

const executeCommandTool(sandbox: Sandbox) {
  return tool({
    /* ... */
    execute: async ({ command }) => {
      const result = await sandbox.exec(command);
      return { /* */ };
    }
  })
}

const agent = new ToolLoopAgent({
  model: "anthropic/claude-opus-4.5",
  instructions: "",
  tools: {
    ExecuteCommand: executeCommandTool(sandbox),
    ExecuteSQL,
  },
})
```

## 3.5 倍更快，37% 更少 token，100% 成功率

我们在 5 个代表性查询上对比了旧架构和新的文件系统方法。

| 指标            | 高级版（旧） | 文件系统（新） | 变化           |
| --------------- | ------------ | -------------- | -------------- |
| 平均执行时间    | 274.8s       | 77.4s          | **3.5 倍更快** |
| 成功率          | 4/5 (80%)    | 5/5 (100%)     | **+20%**       |
| 平均 token 使用 | ~102k tokens | ~61k tokens    | **减少 37%**   |
| 平均步骤数      | ~12 步       | ~7 步          | **减少 42%**   |

文件系统智能体在每个对比维度都获胜。旧架构的最坏情况花了 724 秒、100 步和 145,463 个 token，最后还失败了。文件系统智能体用 141 秒、19 步和 67,483 个 token 完成了同样的查询，而且实际成功了。

质的转变同样重要。智能体能捕获我们从未预料到的边缘情况，并以我们能理解的方式解释它的推理。

### 经验教训

**别对抗重力**。 文件系统是一个极其强大的抽象。Grep 已经 50 年了，仍然完全满足我们的需求。我们在为 Unix 已经解决的问题构建自定义工具。

**我们在约束推理，因为我们不信任模型的推理能力**。 有了 Opus 4.5，这种约束反而成了负担。当我们停止替模型做选择时，模型会做出更好的选择。

**这之所以有效，是因为我们的语义层本身就是好文档**。 YAML 文件结构良好、命名一致、包含清晰的定义。如果你的数据层是一团遗留命名约定和未记录的 join，给 Claude 原始文件访问权限救不了你。你只会得到更快的错误查询。

**做减法是真实存在的**。 最好的智能体可能是工具最少的那些。每个工具都是你替模型做的一个选择。有时候模型会做出更好的选择。

### 这对智能体构建者意味着什么

诱惑总是想要考虑到每一种可能性。抵制它。从最简单的架构开始。模型 + 文件系统 + 目标。只有在证明必要时才添加复杂性。

但简单的架构本身还不够。模型需要好的上下文来工作。投资于文档、清晰的命名和结构良好的数据。这个基础比聪明的工具更重要。

模型的改进速度比你的工具能跟上的速度更快。为六个月后你将拥有的模型构建，而不是为今天拥有的模型构建。

如果你正在构建智能体，我们很想听听你学到了什么。

---

**用 Vercel 和 Slack 构建智能体**

使用 Bolt for JavaScript 和 Nitro 模板开始创建你自己的 Slack 智能体。在 Vercel 上部署它，几分钟内获得一个实时的、生产就绪的设置。

[部署模板](https://vercel.com/templates/nitro/slack-agent-template)
