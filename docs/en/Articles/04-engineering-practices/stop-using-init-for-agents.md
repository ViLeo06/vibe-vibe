---
title: Stop Using /init for AGENTS.md
description: Two papers published in early 2026 show that auto-generated AGENTS.md files can degrade AI agent performance and add 20%+ overhead. This article discusses how to write AGENTS.md properly and why most auto-generated content is redundant
author: Addy Osmani
source: https://addyosmani.com/blog/agents-md/
date: '2026-03-07'
category: 04-engineering-practices
tags:
  - AI Agents
  - AGENTS.md
  - Context Engineering
  - Configuration
  - Best Practices
---

# Stop Using /init for AGENTS.md

> Original article: [Stop Using /init for AGENTS.md](https://addyosmani.com/blog/agents-md/) by Addy Osmani

## The Problem with Auto-Generated AGENTS.md

When AI coding tools introduced commands like `/init` to auto-generate AGENTS.md (or CLAUDE.md, CURSOR.md, etc.), it seemed like a productivity win. Run one command, get a project context file, and your AI assistant suddenly "understands" your codebase. Except it doesn't—not the way you'd hope.

Two papers published in early 2026 quantified what many developers had suspected: auto-generated context files frequently **degrade** AI agent performance rather than improving it. The findings were consistent across multiple models and agent frameworks:

- Auto-generated files add an average of **20%+ token overhead** to every interaction
- The additional tokens consist largely of information the model can already infer from the codebase itself
- Performance on coding benchmarks **decreased** when auto-generated context files were included, compared to no context file at all

## What /init Actually Produces

When you run `/init` or equivalent auto-generation commands, you typically get:

- A project description derived from README.md (which the agent can already read)
- A directory listing (which the agent can already explore)
- Detected languages and frameworks (which the agent can already identify from file extensions and config files)
- Generic coding conventions (which are either standard for the language or inferable from existing code)
- Build and test commands (which are in package.json, Makefile, or equivalent)

In other words, **most of the content is redundant**. The AI agent already has access to the same information through its file system tools. Feeding it a summary of what it can discover on its own doesn't make it smarter—it just makes every prompt longer and more expensive.

## The Signal-to-Noise Problem

The real damage isn't just token cost—it's attention dilution. Language models have finite effective attention within their context window. When you fill that window with generic, inferable content, you reduce the model's ability to focus on the content that actually matters: your project-specific conventions and decisions.

Think of it like onboarding a new developer. If you hand them a 50-page document that's 80% "JavaScript uses semicolons and React uses JSX," they'll skim the whole thing and miss the 20% that contains genuinely important project-specific knowledge—like "we use a custom error boundary that logs to Sentry" or "all database migrations must be backwards-compatible."

## How to Write Effective AGENTS.md

An effective AGENTS.md contains **only information the agent cannot infer from the codebase itself**. Here's what belongs:

### Project-Specific Conventions

Document conventions that deviate from defaults or that aren't obvious from the code:

- "We use kebab-case for file names, not the framework's default PascalCase"
- "All API responses use envelope format: `{ data, error, meta }`"
- "Feature flags are managed through LaunchDarkly, not environment variables"

### Architecture Decisions

Record decisions that have context the code alone doesn't convey:

- "We chose SQLite over Postgres because this runs on embedded devices"
- "The `legacy/` directory uses a different pattern—do not refactor it to match `src/`"
- "We deliberately don't use an ORM; raw SQL is preferred for query visibility"

### Testing Patterns

Specify non-obvious testing requirements:

- "Integration tests must use the `test-db` Docker container, not mocks"
- "Snapshot tests are banned—use explicit assertions"
- "All API endpoints must have both happy path and error path tests"

### Deployment Procedures

Include deployment context that affects how code should be written:

- "This deploys to Lambda—functions must complete within 15 seconds"
- "Database migrations run automatically on deploy; they must be backwards-compatible"
- "Environment variables are set via Terraform, not manually"

## What to Exclude

Actively remove or avoid including:

- Language syntax basics
- Framework defaults and standard patterns
- Information already in README.md, package.json, or config files
- Generic best practices (use TypeScript strict mode, write tests, etc.)
- Directory structures the agent can explore itself

## The 8KB Sweet Spot

Research and practical experience suggest that effective AGENTS.md files converge around **8KB or less**. Beyond that, you're almost certainly including redundant content. Some compression techniques:

1. **Use references, not repetition**: "Follow the patterns in `src/api/users.ts` as the canonical example" is better than reproducing the entire pattern.
2. **Be declarative, not explanatory**: "Use Zod for all input validation" beats a paragraph explaining why Zod was chosen.
3. **Prioritize by impact**: If the agent gets one thing wrong, what would cost you the most time to fix? Put that first.
4. **Version and prune**: Review your AGENTS.md quarterly. Remove anything that's become standard practice or is now enforced by linting rules.

## Handcrafted vs Auto-Generated: The Evidence

In controlled experiments, handcrafted AGENTS.md files of ~4-8KB consistently outperformed auto-generated files of ~20-40KB:

- **Task completion rate**: 12% higher with handcrafted files
- **Code quality scores**: Handcrafted files produced code that better matched project conventions
- **Token efficiency**: 25-35% fewer tokens consumed per task
- **Error rate**: Fewer convention violations and architectural mismatches

The takeaway is clear: a small, curated context file beats a large, auto-generated one every time. The agent doesn't need a map of the entire forest—it needs to know where the traps are.

## Practical Migration

If you're currently using an auto-generated AGENTS.md:

1. **Audit**: Read every line. For each one, ask: "Can the agent figure this out by reading my code?" If yes, delete it.
2. **Add what's missing**: Think about the last 5 times the AI got something wrong about your project. Write rules that would have prevented those mistakes.
3. **Test**: Run the same prompt with the old file and the new file. Compare the outputs. The leaner file should produce more project-appropriate results.
4. **Commit to maintenance**: A stale AGENTS.md is worse than none. Keep it current as your project evolves.

## The Bottom Line

Auto-generated AGENTS.md files are the "default settings" trap of AI-assisted development. They feel productive—you ran a command and got a file—but they actively harm the quality of your AI interactions. Take the time to write a focused, project-specific context file. Your future self (and your token budget) will thank you.
