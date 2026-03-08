---
title: 260307-用文件系统和 Bash 构建智能体
description: Vercel 团队分享如何用文件系统和 Bash 替代复杂工具链，将智能体成本降低 75%
author: Ashka Stephen
source: https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash
date: '2026-03-07'
category: 02-technical-architecture
tags:
- Vercel
- 智能体架构
- 上下文管理
- 成本优化
---

# 用文件系统和 Bash 构建智能体

**作者：Ashka Stephen**

**原文：[查看原文](https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash)**

<div class="article-meta">
</div>

> 原文：[How to build agents with filesystems and bash](https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash)
> 作者：Ashka Stephen（Vercel 软件工程师）

最好的智能体架构，其实很可能就藏在你的终端里。

很多团队为了给智能体提供“正确的信息”，会先搭一条复杂的工具链。但这种做法往往很脆弱，因为它的前提是：你得先替模型判断它需要什么。我们后来找到了一条更简单的路：用文件系统工具和 Bash 工具，替掉智能体系统里大部分定制工具。这样做之后，我们的销售电话总结智能体在 Claude Opus 4.5 上的单次通话成本从约 1 美元降到约 0.25 美元，输出质量还更好了。[我们在 d0（文本转 SQL 智能体）上也采用了类似方法](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)。

这个思路的核心在于：LLM 在海量代码与终端操作语料上接受过训练。它们非常熟悉目录导航、`grep` 搜索、文件读取，以及在复杂代码库里逐步收集上下文的工作方式。如果一个模型擅长处理代码仓库里的文件系统任务，那么把其他领域的数据组织成文件之后，它通常也能用同样的方式去理解和处理。

客户支持工单、销售电话记录、CRM 数据、对话历史——只要把这些信息组织成文件，再给智能体一个 Bash 接口，模型就能用自己熟悉的“代码导航能力”来处理这些数据。

## 智能体如何读取文件系统

智能体运行在沙箱环境中，你的数据则以文件形式组织在其中。当它需要上下文时，会先用 Unix 命令探索文件系统，抽取相关内容，再把必要信息发送给 LLM。

```
智能体收到任务
    ↓
探索文件系统（ls、find）
    ↓
搜索相关内容（grep、cat）
    ↓
发送上下文 + 请求给 LLM
    ↓
返回结构化输出
```

智能体与工具执行环境是隔离的。你信任的是模型的推理过程，而不是让它无限制地接触真实系统。

## 为什么文件系统适合做上下文管理

给智能体提供上下文，常见做法无非两种：把所有内容直接塞进提示里，或者通过向量检索来召回相关信息。前者很快会碰到 token 限制；后者适合找语义相近的内容，但当你要从结构化数据里精确找出某个值时，往往不够稳定，也不够可解释。

文件系统提供了另一种权衡。

**结构天然贴合你的领域**。客户记录、工单历史、CRM 数据本来就有层级关系，很容易直接映射到目录结构。你不需要先把这些关系硬压成向量。

**检索结果足够精确**。像 `grep -r "pricing objection" transcripts/` 这样的命令返回的是明确匹配，而不是“看起来相关”的片段。当你要找的是一个具体值，这一点尤其重要。

**上下文可以保持最小化**。智能体按需加载文件，而不是一开始就把整份大文档塞进提示里。它可以先读元数据，用 `grep` 定位相关片段，再只提取真正需要的内容。

## 把你的领域映射成文件

下面看几个具体例子，感受一下不同业务数据如何映射到文件系统。

**示例 1：客户支持系统**

不要把原始 JSON 一股脑扔给智能体，而是像下面这样组织：

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

当客户问“我的问题是怎么解决的？”时，智能体可以先 `ls` 工单目录，再 `grep` “resolved”，最后只读取相关文件。

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

原始输入放在一处，处理后的输出放在结构化目录中。这样，智能体可以直接引用历史分析结果，而不必每次都从头处理。

## 案例研究：销售电话总结智能体

我们基于这套思路做了一个[销售电话总结模板](https://vercel.com/templates/ai/call-summary-agent)。智能体会分析销售电话记录，并生成包含异议、行动项和洞察的结构化总结。

智能体看到的文件结构大致如下：

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

智能体会像探索代码库一样探索这些文件：

```bash
# 看看有哪些内容可用
$ ls sales-calls/
customer-call-123456-q4.md
metadata.json

# 读取元数据
$ cat sales-calls/metadata.json

# 查找异议
$ grep -i "concern\|worried\|issue\|problem" sales-calls/*.md
```

直观地说，智能体是在把这些记录当作“另一种代码库”来处理：搜索模式、读取片段、拼出上下文。这里没有额外定制的检索逻辑，模型直接使用自己已经熟悉的工具来决定该读什么、忽略什么。也正因为它面对的是原始信息，而不是你预先定义死的参数，所以它更能覆盖你事先没想到的边缘情况。

我们后面还会单独写一篇文章，专门拆解这个销售电话总结智能体。

## 为什么应该优先考虑 Bash 和文件系统

**它贴近模型原生熟悉的操作界面。** `grep`、`cat`、`find`、`awk` 这些工具并不是我们额外教给模型的新本事。LLM 在训练中早就大量接触过这些模式。

**它是面向未来的架构。** 随着模型在编码与终端理解上的能力持续提升，你的智能体系统也会同步受益。你不是在和模型的训练分布对着干，而是在顺着它擅长的方向搭系统。

**它更容易调试。** 当智能体失败时，你能直接看到它读了哪些文件、执行了哪些命令，整个执行路径是可观察的，而不是黑盒。

**它通过隔离获得安全性。** 沙箱让智能体能够探索文件，却无法直接触达生产系统。这样你开放的是“推理空间”，不是“无限权限”。

**它显著减少需要维护的代码。** 你不必为每一种数据类型都单独写检索管道，只需要把数据组织进合理的目录结构，剩下的交给模型按需处理。

## 开始使用

几乎每个智能体系统都能从文件系统和 Bash 中获益。如果你正在设计这类系统，不妨先克制一下“继续发明新工具”的冲动，转而问自己：这件事能不能先表示成文件？

我们最近开源了 [bash-tool](https://vercel.com/changelog/introducing-bash-tool-for-filesystem-based-context-retrieval)，它正是这套模式的一个具体实现。

1. [**AI SDK**](https://ai-sdk.dev/docs/introduction) 用于工具执行与模型调用
2. [**bash-tool**](https://www.npmjs.com/package/bash-tool) 用于沙箱化的文件系统访问
3. [**销售电话总结模板**](https://vercel.com/templates/ai/call-summary-agent) 展示这套模式如何完整落地

智能体的未来，也许会比很多人想象得更简单。最好的架构未必是“功能最多”的架构，而可能是那种几乎没有多余抽象、只保留文件系统和 Bash 这类基础接口的架构。

---

**开始使用文件系统智能体**

销售电话总结模板展示了文件系统与 Bash 模式在真实生产环境中的应用。你可以把它部署到 Vercel 上，直接观察智能体如何在文件之间探索、检索和组织上下文。

[部署模板](https://vercel.com/templates/ai/call-summary-agent)
