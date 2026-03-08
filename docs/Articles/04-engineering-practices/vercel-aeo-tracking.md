---
title: 260307-Vercel 如何构建 Coding Agents 的 AEO 追踪系统
description: 深入了解 Vercel 如何使用 Sandbox、AI Gateway 和 Workflows 构建 AEO 系统，追踪 Coding Agents 的行为。
author: Eric Dodds, Allen Zhou
source: https://vercel.com/blog/how-we-built-aeo-tracking-for-coding-agents
date: '2026-03-07'
category: 04-engineering-practices
tags:
- Vercel
- 智能体工程
- AEO
- 架构设计
---

# Vercel 如何构建 Coding Agents 的 AEO 追踪系统

**作者：Eric Dodds, Allen Zhou**

**原文：[查看原文](https://vercel.com/blog/how-we-built-aeo-tracking-for-coding-agents)**

<div class="article-meta">
</div>

AI 改变了人们查找信息的方式。对企业而言，理解 LLM 如何搜索和总结其网站内容至关重要。

我们正在构建一个 AI 引擎优化（AEO）系统，用于追踪模型如何发现、解释和引用 Vercel 及我们的网站。

![营销团队的最终用户看到的是跨编程智能体格式一致的响应](/images/articles/2026-03/vercel-aeo-tracking.png)

这最初只是一个面向标准聊天模型的原型，但我们很快意识到这还不够。想真正看清可见性，就必须把 Coding Agents 也纳入追踪范围。

对于标准模型，追踪相对简单。我们使用 [AI Gateway](https://vercel.com/ai-gateway) 向数十个流行模型（如 GPT、Gemini 和 Claude）发送提示，并分析它们的响应、搜索行为和引用来源。

然而，编程智能体的行为截然不同。许多 Vercel 用户在积极开发项目时通过终端或 IDE 与 AI 交互。在早期采样中，我们发现编程智能体在大约 20% 的提示中执行网络搜索。由于这些搜索与真实开发工作流内联发生，评估响应质量和来源准确性尤为重要。

测量编程智能体的 AEO 需要与纯模型测试不同的方法。编程智能体不是为了响应单个 API 调用而设计的。它们被构建为在项目内部运行，并期望有完整的开发环境，包括文件系统、Shell 访问和包管理器。

这带来了一系列新挑战：

1. **执行隔离**：如何安全地运行可以执行任意代码的自主智能体？
2. **可观测性**：当每个智能体都有自己的记录格式、工具调用约定和输出结构时，如何捕获智能体的行为？

## Coding Agents AEO 生命周期

编程智能体通常通过 CLI 而非 API 访问。即使你只是发送提示并捕获响应，CLI 仍需要在完整的运行时环境中安装和执行。

[Vercel Sandbox](https://vercel.com/sandbox) 通过提供可在几秒内启动的临时 Linux MicroVM 解决了这个问题。每次智能体运行都有自己的沙箱，并遵循相同的六步生命周期，无论使用哪个 CLI。

1. **创建沙箱**：启动一个新的 MicroVM，配置正确的运行时（Node 24、Python 3.13 等）和超时时间。超时是硬上限，如果智能体挂起或循环，沙箱会终止它。

2. **安装智能体 CLI**：每个智能体都作为 npm 包发布（如 `@anthropic-ai/claude-code`、`@openai/codex` 等）。沙箱全局安装它，使其可作为 Shell 命令使用。

3. **注入凭证**：我们不直接给每个智能体提供 API 密钥，而是设置环境变量，将所有 LLM 调用路由到 Vercel AI Gateway。这为我们提供了统一的日志记录、速率限制和成本追踪，即使每个智能体使用不同的底层提供商（系统也允许直接使用提供商密钥）。

4. **使用提示运行智能体**：这是唯一因智能体而异的步骤。每个 CLI 都有自己的调用模式、标志和配置格式。但从沙箱的角度来看，它只是一个 Shell 命令。

5. **捕获记录**：智能体完成后，我们提取它所做操作的记录，包括调用了哪些工具、是否搜索了网络以及在响应中推荐了什么。这是特定于智能体的（下文介绍）。

6. **清理**：停止沙箱。如果出现任何问题，`catch` 块确保沙箱无论如何都会停止，这样我们就不会泄漏资源。

在代码中，生命周期如下所示：

```typescript
import { Sandbox } from '@vercel/sandbox'

// 步骤 1：创建沙箱
sandbox = await Sandbox.create({
  resources: { vcpus: 2 },
  timeout: 10 * 60 * 1000
})

// 步骤 2：安装智能体 CLI
for (const setupCmd of agent.setupCommands) {
  await sandbox.runCommand('sh', ['-c', setupCmd])
}

// 步骤 3：注入 AI Gateway 凭证（通过步骤 4 中的环境变量）

// 步骤 4：运行智能体
const fullCommand = `AI_GATEWAY_API_KEY='${aiGatewayKey}' ${agent.command}`
const result = await sandbox.runCommand('sh', ['-c', fullCommand])

// 步骤 5：捕获记录（特定于智能体 —— 见下一节）

// 步骤 6：清理
await sandbox.stop()
```

### 智能体即配置

由于生命周期是统一的，每个智能体都可以定义为简单的配置对象。向系统添加新智能体意味着添加新条目，沙箱编排处理其他所有事情。

```typescript
export const AGENTS: Agent[] = [
  {
    id: 'anthropic/claude-code',
    name: 'Claude Code',
    setupCommands: ['npm install -g @anthropic-ai/claude-code'],
    buildCommand: prompt => `echo '${prompt}' | claude --print`
  },
  {
    id: 'openai/codex',
    name: 'OpenAI Codex',
    setupCommands: ['npm install -g @openai/codex'],
    buildCommand: prompt => `codex exec -y -S '${prompt}'`
  }
]
```

`runtime` 决定 MicroVM 的基础镜像。大多数智能体在 Node 上运行，但系统也支持 Python 运行时。

`setupCommands` 是一个数组，因为某些智能体需要的不仅仅是全局安装。例如，Codex 还需要将 TOML 配置文件写入 `~/.codex/config.toml`。

`buildCommand` 是一个接受提示并返回要运行的 Shell 命令的函数。每个智能体的 CLI 都有自己的标志和调用风格。

## 使用 AI Gateway 进行路由

我们希望使用 AI Gateway 集中管理成本和日志。这需要通过沙箱内的环境变量覆盖提供商的基础 URL。智能体本身不知道这正在发生，并像直接与其提供商通信一样运行。

以下是 Claude Code 的实现：

```typescript
const claudeResult = await sandbox.runCommand('claude', ['-p', '-m', options.model, '-y', options.prompt], {
  env: {
    ANTHROPIC_BASE_URL: AI_GATEWAY.baseUrl,
    ANTHROPIC_AUTH_TOKEN: options.apiKey,
    ANTHROPIC_API_KEY: '' // 故意留空，因为 AI Gateway 处理认证
  }
})
```

`ANTHROPIC_BASE_URL` 指向 AI Gateway 而不是 `api.anthropic.com`。智能体的 HTTP 调用发送到 Gateway，Gateway 将它们代理到 Anthropic。

`ANTHROPIC_API_KEY` 故意设置为空字符串 —— Gateway 通过自己的令牌进行身份验证，因此智能体不需要（也没有）直接的提供商密钥。

这种模式同样适用于 Codex（覆盖 `OPENAI_BASE_URL`）和任何其他遵循基础 URL 环境变量的智能体。也可以直接使用提供商 API 凭证。

## 记录格式问题

智能体在沙箱中完成运行后，我们有一个原始记录，它是智能体所做一切的记录。

问题是每个智能体以不同的格式生成它们。Claude Code 将 JSONL 文件写入磁盘。Codex 将 JSON 流式传输到 stdout。OpenCode 也使用 stdout，但使用不同的模式。它们对相同工具使用不同的名称、不同的消息嵌套结构和不同的约定。

我们需要将所有这些输入到单一的品牌管道中，因此我们构建了一个四阶段的规范化层：

1. **记录捕获**：每个智能体以不同方式存储其记录，因此此步骤特定于智能体。

2. **解析**：每个智能体都有自己的解析器，用于规范化工具名称并将特定于智能体的消息结构扁平化为单一统一的事件类型。

3. **丰富**：共享的后处理，从工具参数中提取结构化元数据（URL、命令），规范化每个智能体命名其参数的差异。

4. **摘要和品牌提取**：将统一事件聚合为统计数据，然后输入到用于标准模型响应的相同品牌提取管道。

### 阶段 1：记录捕获

这发生在沙箱仍在运行时（上一节生命周期中的步骤 5）。

**Claude Code** 将其记录作为 JSONL 文件写入沙箱文件系统。我们必须在智能体完成后找到并读取它：

```typescript
async function captureTranscript(sandbox) {
  const workdir = sandbox.getWorkingDirectory()
  const projectPath = workdir.replace(/\//g, '-')
  const claudeProjectDir = `~/.claude/projects/${projectPath}`

  // 查找最新的 .jsonl 文件
  const findResult = await sandbox.runShell(`ls -t ${claudeProjectDir}/*.jsonl 2>/dev/null | head -1`)

  const transcriptPath = findResult.stdout.trim()
  return await sandbox.readFile(transcriptPath)
}
```

**Codex 和 OpenCode** 都将其记录输出到 stdout，因此捕获更简单 —— 过滤输出中的 JSON 行：

```typescript
function extractTranscriptFromOutput(output: string) {
  const lines = output.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed.startsWith('{') && trimmed.endsWith('}')
  })
  return lines.join('\n')
}
```

此阶段的输出对所有智能体都相同：原始 JSONL 字符串。但每个 JSON 行的结构仍然完全不同，这就是下一阶段处理的内容。

### 阶段 2：解析工具名称和消息形状

我们为每个智能体构建了专用解析器，同时做两件事：规范化工具名称并将特定于智能体的消息结构扁平化为单一格式化事件类型。

**工具名称规范化**

相同操作在不同智能体中有不同名称：

| 操作     | Claude Code  | Codex        | OpenCode   |
| -------- | ------------ | ------------ | ---------- |
| 读取文件 | `Read`       | `read_file`  | `read`     |
| 写入文件 | `Write`      | `write_file` | `write`    |
| 编辑文件 | `StrReplace` | `patch_file` | `patch`    |
| 运行命令 | `Bash`       | `shell`      | `bash`     |
| 搜索网络 | `WebFetch`   | _(varies)_   | _(varies)_ |

每个解析器维护一个查找表，将特定于智能体的名称映射到约 10 个规范名称：

```typescript
export type ToolName =
  | 'file_read'
  | 'file_write'
  | 'file_edit'
  | 'shell'
  | 'web_fetch'
  | 'web_search'
  | 'glob'
  | 'grep'
  | 'list_dir'
  | 'agent_task'
  | 'unknown'

const claudeToolMap = {
  Read: 'file_read',
  Write: 'file_write',
  Bash: 'shell',
  WebFetch: 'web_fetch',
  Glob: 'glob',
  Grep: 'grep' /* ... */
}

const codexToolMap = {
  read_file: 'file_read',
  write_file: 'file_write',
  shell: 'shell',
  patch_file: 'file_edit' /* ... */
}

const opencodeToolMap = {
  read: 'file_read',
  write: 'file_write',
  bash: 'shell',
  rg: 'grep',
  patch: 'file_edit' /* ... */
}
```

**消息形状扁平化**

除了命名之外，事件的结构在智能体之间也有所不同：

- **Claude Code** 将消息嵌套在 `message` 属性中，并将 `tool_use` 块混合到内容数组中。
- **Codex** 具有 Responses API 生命周期事件（`thread.started`、`turn.completed`、`output_text.delta`）以及工具事件。
- **OpenCode** 通过 `part.tool` 和 `part.state` 在同一事件中捆绑工具调用 + 结果。

每个智能体的解析器处理这些结构差异，并将所有内容折叠为单一的 `TranscriptEvent` 类型：

```typescript
export interface TranscriptEvent {
  timestamp?: string
  type: 'message' | 'tool_call' | 'tool_result' | 'thinking' | 'error'
  role?: 'user' | 'assistant' | 'system'
  content?: string
  tool?: {
    name: ToolName // 规范名称
    originalName: string // 特定于智能体的名称（用于调试）
    args?: Record<string, unknown>
    result?: unknown
  }
}
```

此阶段的输出是一个扁平的 `TranscriptEvent[]` 数组，无论哪个智能体生成它，形状都相同。

### 阶段 3：丰富

解析后，共享的后处理步骤在所有事件中运行。这从工具参数中提取结构化元数据，以便下游代码不需要知道 Claude Code 将文件路径放在 `args.path` 中，而 Codex 使用 `args.file`：

```typescript
if (['file_read', 'file_write', 'file_edit'].includes(event.tool.name)) {
  const path = extractFilePath(args)
  if (path) event.tool.args = { ...args, _extractedPath: path }
}

if (event.tool.name === 'web_fetch') {
  const url = extractUrl(args)
  if (url) event.tool.args = { ...args, _extractedUrl: url }
}
```

### 阶段 4：摘要和品牌提取

丰富的 `TranscriptEvent[]` 数组被汇总为聚合统计数据（按类型划分的总工具调用、网络获取、错误），然后输入到用于标准模型响应的相同品牌提取管道。从这一点开始，系统不知道也不关心数据是来自编程智能体还是模型 API 调用。

## 使用 Vercel Workflow 进行编排

整个管道作为 [Vercel Workflow](https://vercel.com/workflow) 运行。当提示被标记为"agents"类型时，工作流并行扇出到所有配置的智能体，每个智能体都有自己的沙箱：

```typescript
export async function probeTopicWorkflow(topicId: string) {
  'use workflow'

  const agentPromises = AGENTS.map((agent, index) => {
    const command = agent.buildCommand(topicData.text)
    return queryAgentAndSave(
      topicData.text,
      run.id,
      {
        id: agent.id,
        name: agent.name,
        setupCommands: agent.setupCommands,
        command
      },
      index + 1,
      totalQueries
    )
  })

  const results = await Promise.all(agentPromises)
}
```

## 我们学到了什么

- **编程智能体贡献了大量来自网络搜索的流量**。对随机提示样本的早期测试表明，编程智能体大约 20% 的时间执行搜索。随着我们收集更多数据，我们将建立更全面的智能体搜索行为视图，但这些结果清楚地表明，为编程智能体优化内容很重要。

- **智能体推荐的形状与模型响应不同**。当编程智能体建议一个工具时，它倾向于生成该工具的工作代码，如 `import` 语句、配置文件或部署脚本。推荐嵌入在输出中，而不仅仅是在散文中提及。

- **记录格式一团糟**。随着智能体 CLI 工具快速更新，它们变得越来越混乱。尽早构建规范化层使我们免于持续崩溃。

- **相同的品牌提取管道适用于模型和智能体**。困难的部分是上游的一切：让智能体运行、捕获它所做的事情，并将其规范化为你可以评分的结构。

## 下一步

- **开源工具**。我们计划发布系统的 OSS 版本，以便其他团队可以追踪自己的 AEO 评估，包括标准模型和编程智能体。

- **方法论深入探讨**。我们正在撰写一篇后续文章，涵盖完整的 AEO 评估方法论：提示设计、双模式测试（网络搜索与训练数据）、查询即一等公民架构和声音份额指标。

- **扩展智能体覆盖范围**。随着生态系统的增长，添加更多智能体，并扩展我们测试的提示类型（不仅仅是"推荐工具"，还有完整的项目脚手架、调试等）。

