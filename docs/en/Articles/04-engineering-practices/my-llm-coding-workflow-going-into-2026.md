---
title: My LLM Coding Workflow Going Into 2026
description: AI coding assistants became game-changers in 2025, but using them effectively requires skill and structure. This article shares a workflow for planning, coding, and collaborating with AI
author: Addy Osmani
source: https://addyosmani.com/blog/ai-coding-workflow/
date: '2025-01-15'
category: 04-engineering-practices
tags:
  - AI Coding
  - LLM
  - Workflow
  - Productivity
  - Developer Tools
---

# My LLM Coding Workflow Going Into 2026

> Original article: [My LLM Coding Workflow Going Into 2026](https://addyosmani.com/blog/ai-coding-workflow/) by Addy Osmani

## The Workflow That Emerged

After a year of daily AI-assisted coding, one thing became clear: the developers who get the most out of LLMs aren't the ones using the fanciest tools—they're the ones with the most disciplined workflows. AI coding assistants are force multipliers, but like any powerful tool, they amplify both good habits and bad ones.

What follows is the workflow I've refined through 2025 and plan to carry into 2026. It's built around three phases: **planning**, **implementation**, and **review**. Each phase has specific AI touchpoints, and critically, specific places where human judgment is non-negotiable.

## Phase 1: Planning

The planning phase is where AI delivers the highest ROI per token spent. Before writing a single line of code, use AI to explore the solution space:

- **Requirements generation**: Describe your feature at a high level and ask the AI to enumerate edge cases, potential failure modes, and non-obvious requirements. This surfaces blindspots in your thinking that would otherwise become bugs later.
- **Architecture drafting**: Ask the AI to propose 2-3 architectural approaches with trade-offs. You're not looking for the "right" answer—you're looking for a structured comparison that helps you decide faster.
- **Dependency research**: Have the AI analyze potential libraries, their maintenance status, bundle size impact, and compatibility with your existing stack.

The key insight: planning with AI is a conversation, not a query. Start broad, then narrow. Each exchange should refine your understanding and produce artifacts (requirement docs, architecture decision records) that feed into the next phase.

## Phase 2: Implementation

Implementation is where tool selection matters most. Different tools excel at different granularities:

### Claude Code for Complex Tasks

When you need to build a new feature end-to-end, refactor across multiple files, or reason about system-level changes, Claude Code's agentic workflow shines. It can read your codebase, understand context, plan multi-step changes, and execute them. The key is giving it clear, scoped tasks with well-defined acceptance criteria.

### Cursor for Inline Editing

For focused, file-level work—refactoring a function, adding error handling to an existing module, or implementing a well-defined interface—Cursor's inline editing provides tight feedback loops. You see the changes in context, accept or reject individual edits, and iterate rapidly.

### GitHub Copilot for Completions

For the small stuff—filling in boilerplate, completing patterns, writing test assertions—Copilot's tab-completion model remains unmatched for raw speed. It's best when the intent is obvious from context and the completion is short.

### Matching Tool to Task

The mistake I see most often is using one tool for everything. Copilot is terrible at multi-file refactors. Claude Code is overkill for adding a log statement. Cursor is awkward for greenfield architecture. Match the tool to the task's complexity and scope.

## Phase 3: Review

This is the phase most developers skip, and it's the phase that determines whether AI-assisted code ships clean or ships broken.

**Always read the output**. Every line. AI-generated code is a proposal, not a deliverable. You're the engineer of record. Reading the code isn't optional—it's how you maintain understanding of your own system.

**Test before committing**. AI code passes the "looks right" test far more often than it passes the "works right" test. Run the tests. Try the edge cases. Hit the endpoint. Click the button. Verification is non-negotiable.

**Check for coherence**. AI doesn't have a mental model of your system's invariants. It might generate a function that works perfectly in isolation but violates an assumption made elsewhere. Review with the whole system in mind.

## Session Management

One of the most underrated aspects of AI-assisted coding is session hygiene:

- **Fresh sessions for clean context**: When switching tasks, start a new session. Stale context from a previous conversation can bias the AI's responses in subtle, hard-to-debug ways.
- **Task-scoped conversations**: Keep each conversation focused on a single, well-defined task. A session that starts with "implement user authentication" and drifts into "also fix the CSS on the sidebar" will produce worse results for both.
- **Context loading**: At the start of a session, explicitly provide the context the AI needs—relevant files, architectural constraints, coding conventions. Don't assume it knows your codebase just because you're in an IDE.

## Model Selection

Different models have different strengths. By 2025, a pragmatic model selection strategy looked like this:

- **High-reasoning models** (Claude 3.5 Sonnet, GPT-4) for architecture decisions, complex debugging, and code review
- **Fast models** (Claude Haiku, GPT-4o-mini) for completions, simple transformations, and bulk operations
- **Specialized models** for domain-specific tasks (code-tuned models for pure code generation, instruction-tuned models for documentation)

The cost-quality trade-off is real. Using a frontier model for every autocompletion is wasteful. Using a cheap model for security-sensitive code review is reckless.

## Prompt Patterns That Work

After thousands of AI interactions, these patterns consistently produce better results:

1. **Constraint-first prompting**: State what the code must NOT do before what it should do. "Do not modify the public API. Do not add new dependencies. Within those constraints, refactor the data layer to use repository pattern."
2. **Example-driven specification**: Instead of describing the desired behavior abstractly, show a concrete example of input and expected output.
3. **Incremental refinement**: Start with the happy path, verify it works, then layer in error handling, edge cases, and optimizations in separate passes.
4. **Role framing**: "You are reviewing this code as a senior backend engineer focused on security" produces different (and often better) output than a generic "review this code."

## Integrating AI Into Existing Workflows

AI doesn't replace your workflow—it augments specific steps within it:

- **Pull request descriptions**: AI can draft them from the diff, but you should edit for narrative clarity.
- **Commit messages**: AI-generated messages from diffs are surprisingly good. Add human context about *why*, not just *what*.
- **Documentation**: AI excels at generating API docs from code. It's mediocre at writing architecture docs that require system-level understanding.
- **Code review**: AI catches mechanical issues fast, freeing human reviewers to focus on design and logic.

## Daily Rhythm

A productive AI-assisted day follows a rhythm:

1. **Morning**: Plan the day's work with AI. Generate task breakdowns, identify blockers, draft approaches for complex tasks.
2. **Focused work blocks**: Alternate between AI-assisted implementation and manual coding. Use AI for the parts where it adds velocity. Code manually when you need deep understanding.
3. **Review blocks**: Dedicate time to reviewing AI output, running tests, and verifying behavior. Never merge AI-generated code you haven't personally validated.
4. **End of day**: Use AI to document what you built, generate test cases you might have missed, and plan tomorrow's work.

## Looking Ahead to 2026

The tools will get better. Models will get faster and cheaper. Context windows will keep growing. But the fundamental workflow—plan, implement, review—won't change. The developers who thrive will be the ones who treat AI as a powerful but imperfect collaborator, not an oracle. Structure your workflow, maintain your standards, and let the AI handle the rest.
