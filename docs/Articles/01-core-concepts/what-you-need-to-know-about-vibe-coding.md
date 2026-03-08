---
title: 250201-关于 Vibe Coding 你需要知道的一切
description: Vercel 发布的 Vibe Coding 现状报告，概括 AI 编程如何重塑开发者的工作方式
author: Zeb Hermann, Keith Messick
source: https://vercel.com/blog/what-you-need-to-know-about-vibe-coding
date: '2025-02-01'
category: 01-core-concepts
tags:
- Vercel
- Vibe Coding
- AI 编程
- 开发趋势
---

# 关于 Vibe Coding 你需要知道的一切

**作者：Zeb Hermann, Keith Messick**

**原文：[查看原文](https://vercel.com/blog/what-you-need-to-know-about-vibe-coding)**

<div class="article-meta">
</div>

Vibe Coding 正在快速改变软件的生产方式。本文整理自 Vercel 发布的《Vibe Coding 现状报告》，提炼其中几个最值得关注的判断。

2025 年 2 月，Andrej Karpathy [提出](https://x.com/karpathy/status/1886192184808149383?lang=en)了 *vibe coding* 这个说法：一种新的 AI 编程方式——“顺着感觉推进，拥抱指数级提速，甚至不再把代码本身当作唯一焦点。”

短短几个月里，Vibe Coding 已经明显改变了开发者和非开发者的工作方式。[超过 90%](https://github.blog/news-insights/research/survey-reveals-ais-impact-on-the-developer-experience/) 的美国开发者在使用 AI 编程工具，其他岗位的采用率也在快速上升。连“英语成了增长最快的编程语言”这样的说法，也不再只是玩笑。

我们在最新的 [Vibe Coding 现状报告](https://v0.app/vibecoding)中详细讨论了这场变化。下面是几个关键要点。

## 从 No-code 到 Vibe Code

十五年前，no-code 工具让人们可以通过拖拽组件来搭建应用。这标志着“所见即所得”（WYSIWYG）软件工具的一次普及：用户在可视化界面里编辑内容，同时直接看到结果。

现在，像 v0、Lovable、[Replit](https://v0.app/docs/compare/v0-vs-replit) 这样的 Vibe Coding 工具，又把这条路径往前推进了一步，进入“所说即所得”的阶段：你描述需求，系统直接生成应用、网站或工作流。门槛被进一步压低，团队协作方式、项目分工方式，以及个人独立完成工作的边界，都在随之变化。

![从 No-code 到 Vibe Code 的演进](/images/articles/2025-02/vibe-coding-no-code-to-vibe-code.png)

## Vibe Coding 的核心优势

越来越多的大公司开始更公开地拥抱 Vibe Coding。亚马逊推出了自己的工具 [Kiro](https://kiro.dev/blog/introducing-kiro/)，而 [超过 30%](https://abc.xyz/assets/66/ae/c94682fc4137b5fb90a5d709ac4b/2025-q1-earnings-transcript.pdf) 的 Google 新代码已由 AI 参与生成。但这股变化并不只发生在大厂。

现在，不同规模的团队都能在几天内完成过去要花几个月的项目。比如在 2025 年 3 月，[Garry Tan 表示](https://www.cnbc.com/2025/03/15/y-combinator-startups-are-fastest-growing-in-fund-history-because-of-ai.html)，一个 10 人的 AI 驱动团队，如今可以做出过去需要 100 名工程师才能完成的产出。Vibe Coding 也在把生产力的最小单位，从“团队”进一步压缩到“个人”。

更快的迭代、更低的成本，以及想法与执行之间更短的距离，正在变得越来越现实。真正的门槛，越来越接近“你能否把需求说清楚”。

## Vibe Coding 面向所有人

Vibe Coding 正在重新定义“谁能编程”以及“编程意味着什么”。传统开发者依赖编程语言、代码理解和长期训练；而在 Vibe Coding 场景里，表达能力、对基本技术原理的理解，以及一个足够清晰的问题，往往就足以让事情启动起来。

事实上，许多 Vibe Coding 工具的主要用户并不是职业开发者。约 63% 探索这类工具的用户是非开发者，他们使用 v0、Cursor 等产品来简化工作流程，或为自己的具体问题构建定制化方案。

这种可及性的提升会带来新的机会，但也带来了新的要求：当越来越多用户可以直接构建软件时，平台必须把更多安全与约束机制前置进去，而不能默认每个人都具备完整的工程背景。

![Vibe Coding 面向所有人](/images/articles/2025-02/vibe-coding-for-everyone.png)

![谁是 Vibe Coder](/images/articles/2025-02/who-are-vibe-coders.png)

## 构建 Vibe Coding 的护栏

随着越来越多人采用 Vibe Coding，安全能力需要直接内置到工具本身。因为不是每位用户都接受过完整的安全训练，平台就必须承担更多默认防护责任。

换句话说，Vibe Coding 工具需要在产品层面处理那些用户未必会显式提出、却又确实重要的安全问题。考虑到越来越多人会把数据、信任，甚至业务流程交给这些工具，这一点尤其关键。

对 Vercel 来说，这意味着要提供自动干预能力：实时扫描并阻断漏洞、在必要时触发紧急停止，并在部署阶段就把高风险问题拦下来。

最成功的 Vibe Coding 平台，很可能会是那些把安全能力直接做进界面和默认流程的平台。

![Vibe Coding 安全性](/images/articles/2025-02/vibe-coding-security.png)

## Vibe Coding 的未来

对 Vibe Coding 的兴趣只会继续上升。

企业当然可以拥抱 Vibe Coding，用更精简的团队更快交付；也可以在关键系统上继续采用约束更强的工程流程，只把 AI 用在风险可控的环节。真正重要的不是简单站队，而是是否已经开始为这种变化做准备。

无论你是否喜欢这个名字，这场转变都已经在发生。想了解更多，可以查看完整的 [Vibe Coding 现状报告](https://v0.app/vibecoding)。
