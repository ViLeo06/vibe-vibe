---
title: "260307-测试「Bash 就够了」假设：SQL vs Bash 智能体对比实验"
description: "Vercel 和 Braintrust 联合测试 bash 与 SQL 智能体在结构化数据查询上的表现，混合方案达到 100% 准确率"
author: "Ankur Goyal, Andrew Qu"
source: "https://vercel.com/blog/testing-if-bash-is-all-you-need"
date: "2026-03-07"
category: agent-engineering
tags: [Vercel, Braintrust, 智能体工程, 工具选择, 性能优化]
---

# 测试「Bash 就够了」假设：SQL vs Bash 智能体对比实验

<div class="article-meta">
📅 2026-03-07 | 👤 Ankur Goyal, Andrew Qu | 🔗 <a href="https://vercel.com/blog/testing-if-bash-is-all-you-need" target="_blank">查看原文</a>
</div>

> **本文来源**：[Vercel 官方博客](https://vercel.com/blog/testing-if-bash-is-all-you-need)
> **作者**：Ankur Goyal（Braintrust 创始人兼 CEO）、Andrew Qu（Vercel 软件负责人）

AI 社区中有一个日益流行的观点：文件系统和 bash 是 AI 智能体的最佳抽象层。这个逻辑听起来很合理：大语言模型在代码、终端和文件导航上接受了大量训练，所以你应该能给智能体一个 shell，让它自由工作。

<div class="twitter-quote">
<p>看起来文件系统是 AI 的下一个大趋势 :) 每个人都在玩这个。这是因为模型在沙盒环境中的编码任务上接受了大量训练，包括 shell 和文件系统。因此，它们在导航目录、读取文件方面变得非常擅长……</p>
<cite>— Arpit Bhayani (@arpit_bhayani)</cite>
</div>

模型从以编码为主的训练数据中继承了 shell 流畅性。

即使是非编码智能体也可能从这种方法中受益。Vercel 最近关于[使用文件系统和 bash 构建智能体](https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash)的文章通过将销售电话、支持工单和其他结构化数据映射到文件系统来展示了这一点。智能体用 grep 查找相关部分，提取所需内容，并按需构建上下文。

但还有另一种值得测试的观点。文件系统可能是探索和检索上下文的正确抽象，但对于查询结构化数据呢？我们[构建了一个评估框架](https://github.com/braintrustdata/bash-agent-evals)来找出答案。

## 设置评估实验

我们让智能体查询一个包含 GitHub issues 和 pull requests 的数据集。这种半结构化数据反映了现实世界的用例，如客户支持工单或销售电话记录。

问题复杂度范围从：

- **简单查询**："有多少个开放的 issue 提到了 'security'？"
- **复杂查询**："找出有人报告了 bug，后来又有人提交了声称修复该 bug 的 pull request 的 issue"

三种智能体方法竞争：

1. **SQL 智能体**：直接对包含相同数据的 SQLite 数据库进行查询
2. **Bash 智能体**：使用 [`just-bash`](https://justbash.dev/) 在文件系统上导航和查询 JSON 文件
3. **文件系统智能体**：基本文件工具（搜索、读取），没有完整的 shell 访问权限

每个智能体收到相同的问题，并根据准确性进行评分。

## 初步结果

| 智能体 | 准确率 | 平均 Token 数 | 成本 | 耗时 |
|--------|--------|---------------|------|------|
| SQL | 100% | 155,531 | $0.51 | 45s |
| Bash | 52.7% | 1,062,031 | $3.34 | 401s |
| 文件系统 | 63.0% | 1,275,871 | $3.89 | 126s |

SQL 占据主导地位。它达到了 100% 的准确率，而 bash 只有 53%。Bash 还使用了 7 倍的 token，成本高出 6.5 倍，运行时间长 9 倍。即使是基本的文件系统工具（搜索、读取）也优于完整的 bash 访问，达到了 63% 的准确率。

你可以直接探索 [SQL 实验](https://www.braintrust.dev/app/braintrust-labs/p/bash-evals/experiments/sql-claude-sonnet-4-5?c=bash-claude-sonnet-4-5)、[bash 实验](https://www.braintrust.dev/app/braintrust-labs/p/bash-evals/experiments/bash-claude-sonnet-4-5?c=sql-claude-sonnet-4-5)和[文件系统实验](https://www.braintrust.dev/app/braintrust-labs/p/bash-evals/experiments/fs-claude-sonnet-4-5?c=bash-sqlite-claude-sonnet-4-5)的结果。

一个令人惊讶的发现是，bash 智能体生成了[高度复杂的 shell 命令](https://www.braintrust.dev/app/braintrust-labs/p/bash-evals/experiments/bash-claude-sonnet-4-5?c=sql-claude-sonnet-4-5&r=b665a3b6-a046-4584-a8f7-2289ef580384&s=510baab2-879b-4a8e-9f9f-c4cb716dc6f4&fs=1)，将 `find`、`grep`、`jq`、`awk` 和 `xargs` 以在典型智能体工作流中很少出现的方式链接起来。模型显然对 shell 脚本有深入的了解，但这些知识并没有转化为更好的任务性能。

![复杂的 shell 脚本并未转化为准确性](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F6Cvx8yBqPQE8BrsQMAK26c%2Fc280298be058861f971726019c072146%2Fgrep-chain.png&w=1920&q=75)

*复杂的 shell 脚本并未转化为准确性*

## 调试结果

评估揭示了需要关注的实质性问题。

**性能瓶颈**。应该在毫秒内运行的命令在 10 秒时超时。对 68,000 个文件的 `stat()` 调用是罪魁祸首。[`just-bash` 工具收到了优化](https://x.com/cramforce/status/2010516747070349709)来解决这个问题。

**缺少 schema 上下文**。Bash 智能体不知道它正在查询的 JSON 文件的结构。在系统提示中添加 schema 信息和示例命令有所帮助，但不足以缩小差距。

**评估评分问题**。手动检查失败案例发现，有几个问题的"预期"答案实际上是错误的，或者智能体找到了额外的有效结果但被评分器惩罚了。五个问题收到了更正，解决了歧义或数据集不匹配的问题。

- "哪些仓库有最多的独特 issue 报告者"在组织级别和仓库级别分组之间存在歧义
- 几个问题的预期输出与实际数据集不匹配
- Bash 智能体有时找到的有效结果比参考答案包含的更多

Vercel 团队提交了一个[包含更正的 PR](https://github.com/braintrustdata/bash-agent-evals/pull/5)。

在对 `just-bash` 和评估本身进行修复后，性能差距大大缩小了。

## 混合方案

然后我们尝试了一个不同的想法。与其选择一种抽象，不如给智能体两种：

- 让它使用 bash 来探索和操作文件
- 同时在合适的时候提供对 SQLite 数据库的访问

混合智能体发展出了一种有趣的行为。它会运行 SQL 查询，然后通过 grep 文件系统来验证结果。这种双重检查是混合方法始终达到 100% 准确率的原因，而纯 SQL 偶尔会出错。

你可以直接探索[混合实验结果](https://www.braintrust.dev/app/braintrust-labs/p/bash-evals/experiments/bash-sqlite-claude-sonnet-4-5?c=)。

权衡是成本。混合方法使用的 token 大约是纯 SQL 的两倍，因为它要推理工具选择并验证其工作。

## 关键学习

在对 `just-bash`、评估数据集和数据加载问题进行所有修复后，bash-sqlite 成为最可靠的方法。"赢家"不是单次运行的原始准确性，而是通过自我验证实现的一致准确性。

![混合方法在准确性上与 SQL 持平，同时增加了自我验证](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F7KgOPR8IraRs4nYwxM52Ef%2F13e193cb6e596c02121374d1cf8d7f9c%2Fall-experiments.png&w=1920&q=75)

*混合方法在准确性上与 SQL 持平，同时增加了自我验证*

经过 200 多条消息和数百条追踪后，我们：

- 修复了 `just-bash` 中的性能瓶颈
- 更正了评估中五个模糊或错误的预期答案
- 发现了导致偏差一错误的数据加载 bug
- 观察到智能体发展出复杂的验证策略

Bash 智能体检查自己工作的倾向被证明是有价值的，不仅是为了准确性，也为了发现纯 SQL 方法会忽略的问题。

## 这对智能体设计意味着什么

对于具有清晰 schema 的结构化数据，SQL 仍然是最直接的路径。它快速、易于理解，并且使用更少的 token。

对于探索和验证，bash 提供了 SQL 无法匹敌的灵活性。智能体可以检查文件、抽查结果，并通过文件系统访问捕获边缘情况。

但更大的教训是关于评估本身。Braintrust 和 Vercel 团队之间的来回交流，以及每一步的详细追踪，才是真正改进工具和基准的原因。如果没有这种可见性，我们仍然会基于有缺陷的数据争论哪种抽象"赢了"。

## 运行你自己的基准测试

[评估框架是开源的](https://github.com/braintrustdata/bash-agent-evals)。

你可以替换你自己的：

- 数据集（客户工单、销售电话、日志，任何你正在处理的）
- 智能体实现
- 对你的用例重要的问题

---

*本文由 [Ankur Goyal](https://x.com/ankrgyl) 和 [Braintrust](https://www.braintrust.dev/) 团队撰写，他们为 AI 应用构建评估基础设施。评估框架是开源的，并与 Vercel 的 [`just-bash`](https://justbash.dev/) 集成。*
