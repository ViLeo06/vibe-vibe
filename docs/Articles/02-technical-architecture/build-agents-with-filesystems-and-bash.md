---
title: '260307-用文件系统和 Bash 构建智能体'
description: 'Vercel 团队分享如何用文件系统和 Bash 替代复杂工具链,将智能体成本降低 75%'
author: 'Ashka Stephen'
source: 'https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash'
date: '2026-03-07'
category: 02-technical-architecture
tags: [Vercel, 智能体架构, 上下文管理, 成本优化]
---

# 用文件系统和 Bash 构建智能体

<div class="article-meta">
📅 2026-03-07 | 👤 Ashka Stephen | 🔗 <a href="https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash" target="_blank">查看原文</a>
</div>

> 原文：[How to build agents with filesystems and bash](https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash)
> 作者：Ashka Stephen（Vercel 软件工程师）

最好的智能体架构，其实就在你的终端里。

很多人为了给智能体提供正确的信息，构建了复杂的工具链。这种方式很脆弱，因为我们在猜测模型需要什么，而不是让它自己找到需要的东西。我们找到了一个更简单的方法：用文件系统工具和 Bash 工具替换掉内部智能体中的大部分自定义工具。我们的销售电话总结智能体在 Claude Opus 4.5 上的成本从每次通话约 $1.00 降到了约 $0.25，而且输出质量还提升了。[我们在 d0（文本转 SQL 智能体）上也用了同样的方法](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)。

这个思路的核心是：LLM 在海量代码上训练过。它们花了无数时间导航目录、用 grep 搜索文件、在复杂代码库中管理状态。如果智能体擅长处理代码的文件系统操作，那它也会擅长处理任何东西的文件系统操作。智能体天生就懂文件系统。

客户支持工单、销售电话记录、CRM 数据、对话历史——把它们结构化成文件，给智能体 Bash，模型就能用处理代码导航的能力来处理这些数据。

## 智能体如何读取文件系统

智能体运行在一个沙箱里，你的数据被结构化成文件。当它需要上下文时，它用 Unix 命令探索文件系统，提取相关内容，然后发送给 LLM。

```
智能体收到任务
    ↓
探索文件系统（ls, find）
    ↓
搜索相关内容（grep, cat）
    ↓
发送上下文 + 请求给 LLM
    ↓
返回结构化输出
```

智能体和它的工具执行运行在独立的计算环境上。你信任智能体的推理，但沙箱隔离了它实际能做的事情。

## 为什么文件系统适合上下文管理

智能体上下文的典型做法要么是把所有东西塞进 prompt，要么是用向量搜索。塞 prompt 会碰到 token 限制。向量搜索适合语义相似性，但当你需要从结构化数据中找一个特定值时，返回的结果不够精确。

文件系统提供了不同的权衡。

**结构匹配你的领域**。 客户记录、工单历史、CRM 数据——这些都有天然的层级关系，可以直接映射到目录。你不需要把关系扁平化成嵌入向量。

**检索是精确的**。 `grep -r "pricing objection" transcripts/` 返回精确匹配。当你需要一个特定值时，你就能得到那个值。

**上下文保持最小化**。 智能体按需加载文件。一个大型记录不会一开始就进入 prompt。智能体读取元数据，用 grep 找相关部分，然后只提取它需要的内容。

## 把你的领域映射到文件

让我们看一些具体例子，看看不同领域如何映射到文件系统结构。

**示例 1：客户支持系统**

不要把原始 JSON 扔给智能体，而是这样结构化：

```
/customers/
  /cust_12345/
    profile.json          # 高层信息
    tickets/
      ticket_001.md       # 每个工单
      ticket_002.md
    conversations/
      2024-01-15.txt      # 每日对话日志
    preferences.json
```

当客户问"我的问题是怎么解决的？"，智能体可以 `ls` tickets 目录，`grep` "resolved"，然后只读取相关文件。

**示例 2：文档分析系统**

```
/documents/
  /uploaded/
    contract_abc123.pdf
    invoice_def456.pdf
  /extracted/
    contract_abc123.txt
    invoice_def456.txt
  /analysis/
    contract_abc123/
      summary.md
      key_terms.json
      risk_assessment.md
/templates/
  contract_analysis_prompt.md
  invoice_validation_rules.md
```

原始输入在一个地方，处理后的输出在结构化目录中。智能体可以引用之前的分析而不需要重新处理。

## 案例研究：销售电话总结智能体

我们用这个架构构建了一个[销售电话总结模板](https://vercel.com/templates/ai/call-summary-agent)。智能体分析销售电话记录，生成包含异议、行动项和洞察的结构化总结。

智能体看到的文件结构：

```
gong-calls/
  demo-call-001-companyname-product-demo.md     # 当前通话记录
  metadata.json                                 # 通话元数据
  previous-calls/
    demo-call-000-discovery-call.md             # 之前的发现电话
    demo-call-intro-initial-call.md             # 初次介绍电话

salesforce/
  account.md                                    # CRM 账户记录
  opportunity.md                                # 交易/机会详情
  contacts.md                                   # 联系人资料

slack/
  slack-channel.md                              # Slack 历史

research/
  company-research.md                           # 公司背景
  competitive-intel.md                          # 竞争对手分析

playbooks/
  sales-playbook.md                             # 内部销售手册
```

智能体像探索代码库一样探索这些文件：

```bash
# 探索有什么可用的
$ ls sales-calls/
customer-call-123456-q4.md
metadata.json

# 读取元数据
$ cat sales-calls/metadata.json

# 查找异议
$ grep -i "concern\|worried\|issue\|problem" sales-calls/*.md
```

直觉是智能体把记录当作代码库来处理。它搜索模式、读取片段、构建上下文，就像调试代码一样。没有自定义检索逻辑。智能体用它已经知道如何使用的工具来决定需要什么上下文。它处理我们从未预料到的边缘情况，因为它在处理原始信息，而不是我们定义的参数。

我们会有另一篇文章深入探讨销售电话总结智能体。

## 为什么你应该使用 Bash 和文件系统

**原生模型能力**。 grep、cat、find、awk——这些不是我们在教的新技能。LLM 在训练期间见过这些工具数十亿次。它们是原生操作，不是后加的行为。

**面向未来的架构**。 随着模型在编码方面变得更好，你的智能体也会变得更好。代码理解的每一次改进都会直接转化过来。你在利用训练分布，而不是与之对抗。

**可调试性**。 当智能体失败时，你能准确看到它读了哪些文件、运行了哪些命令。执行路径是可见的。没有黑盒。

**通过隔离实现安全**。 沙箱让智能体可以探索文件，但无法访问生产系统。你信任推理，而不是执行环境。

**更少的代码需要维护**。 不需要为每种数据类型构建检索管道，你只需要把文件写到目录结构中。智能体处理剩下的事情。

## 开始使用

每个智能体都需要文件系统和 Bash。如果你在构建智能体，抵制创建自定义工具的冲动。相反，问自己：我能把这个表示成文件吗？

我们最近开源了 [bash-tool](https://vercel.com/changelog/introducing-bash-tool-for-filesystem-based-context-retrieval)，这是支撑这个模式的专用工具。

1. [**AI SDK**](https://ai-sdk.dev/docs/introduction) 用于工具执行和模型调用
2. [**bash-tool**](https://www.npmjs.com/package/bash-tool) 用于沙箱化的文件系统访问
3. [**销售电话总结模板**](https://vercel.com/templates/ai/call-summary-agent) 查看完整模式，一键开始

智能体的未来可能出人意料地简单。也许最好的架构几乎就是没有架构。只需要文件系统和 Bash。

---

**开始使用文件系统智能体**

销售电话总结模板展示了文件系统和 Bash 模式在生产环境中的应用。在 Vercel 上部署它，实时观察智能体探索文件。

[部署模板](https://vercel.com/templates/ai/call-summary-agent)
