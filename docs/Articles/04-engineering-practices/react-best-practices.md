---
title: "260114-React 最佳实践：Vercel 十年性能优化经验总结"
description: "Vercel 将 10+ 年的 React 和 Next.js 性能优化知识封装成结构化仓库，专为 AI Agent 和 LLM 优化，涵盖消除瀑布流、减少 Bundle 体积等 40+ 条规则"
author: "Shu Ding, Andrew Qu"
source: "https://vercel.com/blog/introducing-react-best-practices"
date: "2026-01-14"
category: engineering-practice
tags: [Vercel, React, 性能优化, Next.js, AI Agent]
---

# React 最佳实践：Vercel 十年性能优化经验总结

<div class="article-meta">
📅 2026-01-14 | 👤 Shu Ding, Andrew Qu | 🔗 <a href="https://vercel.com/blog/introducing-react-best-practices" target="_blank">查看原文</a>
</div>

我们将 10+ 年的 React 和 Next.js 性能优化知识封装到 [`react-best-practices`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) 中，这是一个专为 AI Agent 和 LLM 优化的结构化仓库。

![React Best Practices](/images/articles/2026-01/react-best-practices-hero.png)

## 为什么需要这个框架

React 性能优化工作通常是被动的：发布上线后应用变慢，团队开始追查症状。这种方式成本高昂，而且容易优化错方向。

我们在生产代码库中看到了十多年来反复出现的根本原因：

- **异步操作意外变成串行执行**
- **客户端 Bundle 体积随时间增长**
- **组件不必要的重复渲染**

这些问题的影响很直接：它们表现为等待时间、卡顿和重复成本，影响每个用户会话。

所以我们整理了这个 React 最佳实践框架，让这些问题更容易发现和修复。

## 核心理念：优先级排序

大多数性能优化工作失败，是因为从技术栈的底层开始着手。

如果请求瀑布流增加了 600ms 的等待时间，再怎么优化 `useMemo` 调用也无济于事。如果每个页面都多发送 300KB 的 JavaScript，从循环中节省几微秒也没有意义。

性能问题还会累积。今天发布的小退化会成为每个会话的长期税收，直到有人偿还这笔债务。

所以这个框架从两个通常最能改善实际指标的修复开始：

1. **消除瀑布流**
2. **减少 Bundle 体积**

然后再转向服务端性能、客户端数据获取和重渲染优化。

框架包含 8 个类别的 40+ 条规则，按影响力排序，从 CRITICAL（消除瀑布流、减少 Bundle 体积）到增量优化（高级模式）。

## 框架内容

仓库涵盖八个性能类别：

- **消除异步瀑布流**
- **Bundle 体积优化**
- **服务端性能**
- **客户端数据获取**
- **重渲染优化**
- **渲染性能**
- **高级模式**
- **JavaScript 性能**

每条规则都包含影响评级（CRITICAL 到 LOW）以帮助优先修复，并提供代码示例展示问题和解决方案。

### 示例：避免不必要的异步等待

这是一个常见的阻塞未使用代码的模式：

**错误写法（两个分支都被阻塞）：**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  // 即使 skipProcessing 为 true，也会等待 userData
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // 立即返回但仍然等待了 userData
    return { skipped: true }
  }

  // 只有这个分支使用 userData
  return processUserData(userData)
}
```

**正确写法（仅在需要时阻塞）：**

```typescript
async function handleRequest(
  userId: string,
  skipProcessing: boolean
) {
  if (skipProcessing) {
    // 提前返回，不等待任何数据
    return { skipped: true }
  }

  // 只在需要时获取数据
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

单个规则文件会编译成 `AGENTS.md`，这是一个你的 Agent 在审查代码或建议优化时可以查询的单一文档。它被设计为可以一致地遵循，包括由 AI Agent 进行重构时，这样团队可以在大型代码库中应用相同的决策。

## 这些实践的来源

这些不是理论。它们来自生产代码库的真实性能优化工作。

几个例子：

![React Best Practices Examples](/images/articles/2026-01/react-best-practices-example.png)

### 合并循环迭代

一个聊天页面对同一个消息列表扫描了八次。我们将其合并为单次遍历，当你有数千条消息时，这会产生显著差异。

### 并行化 await

一个 API 在等待一个数据库调用完成后才开始下一个，即使它们之间没有依赖关系。同时运行它们将总等待时间减半。

### 惰性状态初始化

一个组件在每次渲染时都从 `localStorage` 解析 JSON 配置，即使它只需要在状态初始化时使用一次。将其包装在回调中（`useState(() => JSON.parse(...))`）消除了浪费的工作。

## 在你的 Coding Agent 中使用

这些最佳实践也被打包为 [Agent Skills](https://github.com/vercel-labs/agent-skills)，可以安装到 Opencode、Codex、Claude Code、Cursor 和其他 Coding Agent 中。当你的 Agent 发现级联的 `useEffect` 调用或大量客户端导入时，它可以参考这些模式并建议修复。

```bash
npx skills add vercel-labs/agent-skills
```

查看 [`react-best-practices`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) 仓库了解更多。

## 关键要点

1. **优先级很重要**：先修复瀑布流和 Bundle 体积，再优化微观性能
2. **性能债务会累积**：小退化会成为长期税收
3. **使用 Agent Skills**：让 AI Agent 在编码时自动应用这些最佳实践
4. **基于真实案例**：这些规则来自生产环境的实际优化经验

---

**相关资源：**
- [react-best-practices 仓库](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- [Agent Skills 项目](https://github.com/vercel-labs/agent-skills)
- [Vercel 性能优化指南](https://vercel.com/docs/concepts/performance)
