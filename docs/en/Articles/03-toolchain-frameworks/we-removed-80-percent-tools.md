---
title: We Removed 80% of Our Agent's Tools
description: Vercel spent months building a complex text-to-SQL agent, only to discover that simplifying to bash and the filesystem outperformed every specialized tool—3.5x faster, 100% accuracy, 37% fewer tokens.
author: Andrew Qu
source: https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
  - Agent Tools
  - Simplification
  - Filesystem
  - Bash
  - Performance Optimization
---

# We Removed 80% of Our Agent's Tools

**Author: Andrew Qu (Vercel)**

**Original: [Read the full article](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)**

<div class="article-meta">
</div>

> Vercel spent months building a complex text-to-SQL agent, only to discover: sometimes simpler is just better. Giving it the ability to execute arbitrary bash commands outperformed every carefully designed tool.

The results got better.

We spent months building a complex internal text-to-SQL agent called d0, equipped with specialized tools, extensive prompt engineering, and careful context management. It worked... barely. But it was fragile, slow, and required constant maintenance.

So we tried something different. We stripped out most of the code and simplified the agent down to one tool: **execute arbitrary bash commands**. We called it the filesystem agent. Claude directly accesses your files, using `grep`, `cat`, and `ls` to figure things out on its own.

The agent got simpler, and it also got better. Success rate went from 80% to 100%. Fewer steps, fewer tokens, faster responses. All by doing less.

## What Is d0

If [v0](https://v0.app/) is our AI for building UIs, d0 is our AI for understanding data.

d0 translates natural language questions into SQL queries against our analytics infrastructure, letting anyone on the team get answers without writing code or waiting for the data team.

When d0 works well, it democratizes data access across the entire company. When it doesn't, people lose trust and go back to asking analysts in Slack. We needed d0 to be fast, accurate, and reliable.

## Get Out of the Model's Way

Looking back, we were solving problems the model could handle on its own. We assumed it would get lost in complex schemas, make wrong joins, or hallucinate table names that don't exist. So we built guardrails. We pre-filtered context, limited its options, wrapped every interaction with validation logic. We were thinking for the model:

- Built multiple specialized tools (schema lookup, query validation, error recovery, etc.)
- Added extensive prompt engineering to constrain reasoning
- Used careful context management to avoid overwhelming the model
- Wrote hand-crafted retrieval code to surface "relevant" schema info and dimension attributes

Every edge case meant another patch, every model update meant recalibrating our constraints. We spent more time maintaining the scaffolding than improving the agent itself.

**The old architecture** (using AI SDK's ToolLoopAgent):

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

17 specialized tools. Heavy prompt engineering. Constant maintenance.

## A New Idea: What If We Just... Stopped?

We realized we were fighting gravity. Constraining the model's reasoning. Summarizing information it could read on its own. Building tools to protect it from complexity it could handle.

So we stopped. The hypothesis: what if we just gave Claude access to the raw Cube DSL files and let it go? What if bash is all you need? Models are getting smarter, context windows are getting bigger—maybe the best agent architecture is almost no architecture.

### v2: The Filesystem Is the Agent

**New tech stack:**

- **Model:** Claude Opus 4.5 via [AI SDK](https://ai-sdk.dev/)
- **Execution:** [Vercel Sandbox](https://vercel.com/sandbox) for context exploration
- **Routing:** [Vercel Gateway](https://vercel.com/ai-gateway) for request handling and observability
- **Server:** Next.js API routes using [Vercel Slack Bolt](https://vercel.com/academy/slack-agents)
- **Data layer:** Cube semantic layer, as a directory of YAML, Markdown, and JSON files

The filesystem agent now navigates our semantic layer like a human analyst would. It reads files, searches for patterns with grep, builds a mental model, and writes SQL using standard Unix tools like `grep`, `cat`, `find`, and `ls`.

This works because the semantic layer itself is good documentation. Files contain dimension definitions, metric calculations, and join relationships. We'd been building tools to summarize content that was already clearly readable. Claude just needed permission to read it directly.

**The new architecture:**

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

From 17 tools down to 2: `ExecuteCommand` (bash) and `ExecuteSQL`.

## 3.5x Faster, 37% Fewer Tokens, 100% Success Rate

We benchmarked the old architecture against the new filesystem approach on 5 representative queries.

| Metric | Premium (Old) | Filesystem (New) | Change |
| --- | --- | --- | --- |
| Average execution time | 274.8s | 77.4s | **3.5x faster** |
| Success rate | 4/5 (80%) | 5/5 (100%) | **+20%** |
| Average token usage | ~102k tokens | ~61k tokens | **37% fewer** |
| Average steps | ~12 steps | ~7 steps | **42% fewer** |

The filesystem agent won on every dimension. The old architecture's worst case took 724 seconds, 100 steps, and 145,463 tokens—and still failed. The filesystem agent completed the same query in 141 seconds, 19 steps, and 67,483 tokens, and actually succeeded.

The qualitative shift matters too. The agent captures edge cases we never anticipated and explains its reasoning in ways we can understand.

## Lessons Learned

**Don't fight gravity.** The filesystem is an incredibly powerful abstraction. Grep is 50 years old and still perfectly serves our needs. We were building custom tools for problems Unix had already solved.

**We were constraining reasoning because we didn't trust the model's reasoning ability.** With Opus 4.5, those constraints became liabilities. When we stopped making choices for the model, the model made better choices.

**This works because our semantic layer is good documentation.** YAML files are well-structured, consistently named, and contain clear definitions. If your data layer is a mess of legacy naming conventions and undocumented joins, giving Claude raw file access won't save you. You'll just get faster wrong queries.

**"Do less" is real.** The best agents may be the ones with the fewest tools. Every tool is a choice you're making for the model. Sometimes the model makes better choices.

## What This Means for Agent Builders

The temptation is always to account for every possibility. Resist it. Start with the simplest architecture possible. Model + filesystem + goal. Only add complexity when you've proven it's necessary.

But simple architecture alone isn't enough. The model needs good context to work with. Invest in documentation, clear naming, and well-structured data. This foundation matters more than clever tools.

Models improve faster than your tools can keep up. Build for the models you'll have in six months, not the ones you have today.

### Key Principles

1. **Fewer tools = better results.** Each tool is a decision point; fewer decision points mean less room for the model to get confused.

2. **The filesystem is a universal interface.** LLMs navigate file systems naturally—it's deeply represented in their training data. Don't abstract away what already works.

3. **Good data > smart tools.** Well-structured, clearly named files with consistent conventions enable the model to reason effectively without guidance.

4. **Stop second-guessing the model.** Modern models (especially Claude 4.5+) make better decisions when unconstrained than when you build guardrails around their reasoning.

5. **Measure everything.** Speed, token usage, success rate, steps—quantify the impact of every tool you add or remove.

Sometimes the best agent architecture has almost no architecture at all. Model + files + goal = optimal.

---

**Build agents with Vercel and Slack**

Start creating your own Slack agent using the Bolt for JavaScript and Nitro template. Deploy it on Vercel and get a live, production-ready setup within minutes.

[Deploy the template](https://vercel.com/templates/nitro/slack-agent-template)
