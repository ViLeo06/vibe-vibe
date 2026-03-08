---
title: "AGENTS.md vs Skills: Why Passive Context Outperforms Active Retrieval"
description: Vercel's rigorous evaluation reveals that an 8KB AGENTS.md document index achieves 100% pass rate, while Skills top out at 79%—exploring why passive context beats active retrieval for AI agents.
author: Vercel Team
source: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
  - AGENTS.md
  - Skills
  - Context Management
  - Evaluation
  - Agent Performance
---

# AGENTS.md vs Skills: Why Passive Context Outperforms Active Retrieval

**Author: Vercel Team**

**Original: [Read the full article](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)**

<div class="article-meta">
</div>

> **Source:** [Vercel Official Blog](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)

## The Problem

AI coding assistants rely on training data that goes stale. Next.js 16 introduced new APIs like `'use cache'`, `connection()`, and `forbidden()` that don't exist in current model training data. When agents don't know about these APIs, they generate incorrect code or fall back to outdated patterns.

The reverse is also true—if you're running an older version of Next.js, models may suggest new APIs that don't yet exist in your project. The Vercel team wanted to solve this by giving agents access to version-matched documentation.

## Two Teaching Methods

Before diving into results, a quick explanation of the two approaches tested:

### Skills

[Skills](https://agentskills.io/) are an open standard for packaging domain knowledge that coding agents can use. A Skill bundles prompts, tools, and documentation that agents can invoke on demand. The idea is that agents recognize when they need framework-specific help, call the Skill, and get access to relevant documentation.

### AGENTS.md

[AGENTS.md](https://agents.md/) is a Markdown file in the project root that provides persistent context for coding agents. Whatever you put in `AGENTS.md`, the agent has access to it every turn—without the agent needing to decide to load it. Claude Code uses `CLAUDE.md` for the same purpose.

The Vercel team built a Next.js documentation Skill and an `AGENTS.md` documentation index, then ran them through an evaluation suite to see which performed better.

## The Initial Bet on Skills

Skills seemed like the right abstraction. You package framework documentation into a Skill, the agent invokes it when working on Next.js tasks, and you get correct code. Clean separation of concerns, minimal context overhead—the agent loads only what it needs. There's even a growing directory of reusable Skills on [skills.sh](https://skills.sh/).

The team expected that when the agent encountered a Next.js task, it would call the Skill, read the version-matched documentation, and generate correct code.

Then they ran the evaluations.

## Skills Weren't Reliably Triggered

In 56% of evaluation cases, the Skill was never called. The agent had access to the documentation but didn't use it. Adding the Skill produced zero improvement over baseline:

| Configuration | Pass Rate | vs. Baseline |
| --- | --- | --- |
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |

Zero improvement. The Skill existed, the agent could use it, but the agent chose not to. In the detailed build/check/test breakdown, the Skill actually performed worse than baseline on some metrics (test 58% vs 63%), suggesting that an unused Skill in the environment may introduce noise or interference.

This isn't unique to their setup. Agents unreliably using available tools is a [known limitation](https://developers.openai.com/blog/eval-skills) of current models.

## Explicit Instructions Helped, but Wording Was Fragile

The team tried adding explicit instructions in `AGENTS.md` telling the agent to use the Skill:

```
Before writing code, first explore the project structure, then call the nextjs-doc skill to get documentation.
```

This boosted the trigger rate above 95% and raised the pass rate to 79%.

| Configuration | Pass Rate | vs. Baseline |
| --- | --- | --- |
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |
| Skill + explicit instructions | 79% | +26pp |

A significant improvement. But they discovered unexpected things about how instruction wording affects agent behavior.

**Different wording produced dramatically different results:**

| Instruction | Behavior | Outcome |
| --- | --- | --- |
| "You must call the skill" | Reads docs first, anchors on doc patterns | Misses project context |
| "First explore project, then call skill" | Builds mental model first, uses docs as reference | Better results |

Same Skill. Same documentation. Different results based on subtle wording changes.

In one evaluation (the `'use cache'` directive test), the "call first" approach wrote the correct `page.tsx` but completely missed the required `next.config.ts` changes. The "explore first" approach got both right.

This fragility is concerning. If small wording tweaks produce large behavioral swings, the approach feels brittle for production use.

## Building Trustworthy Evaluations

Before drawing conclusions, they needed evaluations they could trust. The initial test suite had vague prompts, tests that verified implementation details rather than observable behavior, and a focus on APIs already in the model's training data. They weren't measuring what actually mattered.

The team hardened the evaluation suite by eliminating test leakage, resolving contradictions, and shifting to behavior-based assertions. Most importantly, they added tests targeting Next.js 16 APIs that don't exist in model training data.

**Key APIs in the focused evaluation suite:**

- `connection()` for dynamic rendering
- `'use cache'` directive
- `cacheLife()` and `cacheTag()`
- `forbidden()` and `unauthorized()`
- `proxy.ts` for API proxying
- Async `cookies()` and `headers()`
- `after()`, `updateTag()`, `refresh()`

All results below come from this hardened evaluation suite. Each configuration was judged against the same tests, with retries to account for model variance.

## The Intuition That Worked

What if the decision was removed entirely? Instead of hoping the agent would call a Skill, embed a documentation index directly in `AGENTS.md`. Not the full docs—just an index telling the agent where to find specific documentation files matching the project's Next.js version. The agent can then read those files as needed, getting version-accurate information whether you're on the latest release or maintaining an older project.

The team added one key instruction to the injected content:

```
IMPORTANT: For any Next.js task, prefer retrieval-led reasoning over pre-training-led reasoning.
```

This tells the agent to consult documentation rather than relying on potentially outdated training data.

## Surprising Results

The team ran the hardened evaluation suite across all four configurations:

**Final pass rates:**

| Configuration | Pass Rate | vs. Baseline |
| --- | --- | --- |
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |
| Skill + explicit instructions | 79% | +26pp |
| **AGENTS.md doc index** | **100%** | **+47pp** |

In the detailed breakdown, `AGENTS.md` achieved perfect scores across build, check, and test:

| Configuration | Build | Check | Test |
| --- | --- | --- | --- |
| Baseline | 84% | 95% | 63% |
| Skill (default behavior) | 84% | 89% | 58% |
| Skill + explicit instructions | 95% | 100% | 84% |
| **AGENTS.md** | **100%** | **100%** | **100%** |

This wasn't what they expected. The "dumb" approach (a static Markdown file) outperformed the more sophisticated Skill-based retrieval, even when they fine-tuned the Skill triggers.

## Why Passive Context Beats Active Retrieval

The team's working theory comes down to three factors:

1. **No decision point.** With `AGENTS.md`, there's no moment where the agent must decide "should I look this up?" The information is already there.

2. **Consistent availability.** Skills load asynchronously, only when called. `AGENTS.md` content is in the system prompt every turn.

3. **No ordering problems.** Skills create ordering decisions (read docs first vs. explore project first). Passive context avoids this entirely.

## Solving Context Bloat

Embedding documentation in `AGENTS.md` risks context window bloat. The team addressed this through compression.

The original documentation injection was roughly 40KB. They compressed it to 8KB (80% reduction) while maintaining the 100% pass rate. The compression format uses a pipe-delimited structure to pack the documentation index into minimal space:

```
[Next.js Docs Index]|root: ./.next-docs|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,...}|01-app/02-building-your-application/01-routing:{01-defining-routes.mdx,...}
```

The full index covers every section of the Next.js documentation. The agent knows where to find docs without needing the full content in context. When it needs specific information, it reads the relevant file from the `.next-docs/` directory.

## Try It Yourself

One command sets this up for your Next.js project:

```bash
npx @next/codemod@canary agents-md
```

This is part of the official [`@next/codemod` package](https://github.com/vercel/next.js/pull/88961).

The command does three things:

1. Detects your Next.js version
2. Downloads matching documentation to `.next-docs/`
3. Injects the compressed index into your `AGENTS.md`

If you're using an agent that respects `AGENTS.md` (like Cursor or other tools), the same approach applies.

## Implications for Framework Authors

Skills aren't useless. The `AGENTS.md` approach provides broad horizontal improvement in how agents use Next.js across all tasks. Skills are better suited for vertical, operation-specific workflows that users explicitly trigger—like "upgrade my Next.js version," "migrate to App Router," or [apply framework best practices](https://x.com/huozhi/status/2015881140281004438). The two approaches complement each other.

That said, for general framework knowledge, passive context currently outperforms on-demand retrieval. If you maintain a framework and want coding agents to generate correct code, consider providing an `AGENTS.md` snippet that users can add to their projects.

**Practical advice:**

- **Don't wait for Skills to improve.** The gap may narrow as models get better at tool use, but right now the results speak for themselves.

- **Compress aggressively.** You don't need full documentation in context. An index pointing to retrievable files works just as well.

- **Build evals.** Construct evaluations targeting APIs not in training data. This is where documentation access matters most.

- **Design for retrieval.** Structure your documentation so agents can look up and read specific files, rather than needing everything provided upfront.

The goal is to shift agents from pre-training-led reasoning to retrieval-led reasoning. `AGENTS.md` has proven to be the most reliable way to achieve this.

---

**Research and evaluation:** [Jude Gao](https://x.com/gao_jude)
**CLI available:** `npx @next/codemod@canary agents-md`

## Key Takeaways

1. **Passive context > active retrieval:** Under current model capabilities, always-available context is more reliable than on-demand Skills.

2. **Compression is key:** An 8KB compressed index achieves 100% pass rate—no need for full documentation.

3. **Eliminate decision points:** Don't make the agent decide "should I check the docs?"—make docs always available.

4. **Version matching matters:** Ensure the agent accesses documentation matching the project's actual framework version.

5. **The two approaches complement each other:** AGENTS.md for horizontal framework knowledge, Skills for vertical specific workflows.
