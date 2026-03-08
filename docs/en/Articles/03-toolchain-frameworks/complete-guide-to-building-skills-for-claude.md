---
title: Complete Guide to Building Skills for Claude
description: A comprehensive guide covering everything from basics to advanced techniques for building custom Claude Skills—including design patterns, testing methods, and distribution strategies.
author: Anthropic
source: https://docs.anthropic.com/en/docs/build-with-claude/skills
date: '2026-01-15'
category: 03-toolchain-frameworks
tags:
  - Claude
  - Skills
  - Configuration
  - Best Practices
  - Anthropic
---

# Complete Guide to Building Skills for Claude

**Author: Anthropic**

**Original: [Read the full article](https://docs.anthropic.com/en/docs/build-with-claude/skills)**

<div class="article-meta">
</div>

> ## Summary
>
> Skills are persistent instruction packages that teach Claude how to handle specific tasks or workflows. This guide covers everything you need to know—from folder structure and YAML frontmatter to progressive disclosure, MCP integration, testing, and distribution.

## Table of Contents

- [Introduction](#introduction)
- [Fundamentals](#fundamentals)
- [Planning and Design](#planning-and-design)
- [Testing and Iteration](#testing-and-iteration)
- [Distribution and Sharing](#distribution-and-sharing)
- [Patterns and Troubleshooting](#patterns-and-troubleshooting)
- [Resources and References](#resources-and-references)

## Introduction

A Skill is a set of instructions—packaged as a simple folder—that teaches Claude how to handle specific tasks or workflows. Skills are one of the most powerful ways to customize Claude for specific needs. Instead of re-explaining your preferences, processes, and domain expertise in every conversation, skills let you teach Claude once and benefit every time.

Skills are especially powerful when you have repeatable workflows: generating frontend designs from specifications, conducting research with a consistent methodology, creating documentation that follows your team's style guide, or orchestrating multi-step processes. They work well alongside Claude's built-in capabilities like code execution and document creation. For those building MCP integrations, skills add another powerful layer that helps transform raw tool access into reliable, optimized workflows.

This guide covers everything you need to build effective skills—from planning and structure to testing and distribution. Whether you're building a skill for yourself, your team, or the community, you'll find practical patterns and real-world guidance throughout.

### What You'll Learn

- Technical requirements and best practices for skill structure
- Patterns for standalone skills and MCP-enhanced workflows
- Effective patterns observed across different use cases
- How to test, iterate, and distribute your skills

### Who This Is For

- Developers who want Claude to consistently follow specific workflows
- Power users who want Claude to adhere to particular processes
- Teams looking to standardize how Claude works across the organization

### Two Paths in This Guide

Building standalone skills? Focus on Fundamentals, Planning & Design, and Categories 1-2. Enhancing MCP integrations? The "Skills + MCP" section and Category 3 are for you. Both paths share the same technical requirements, but you can pick the content relevant to your use case.

**Time estimate:** You can build a functional skill in a single session. Using the skill-creator to build and test your first working skill takes approximately 15-30 minutes.

## Fundamentals

### What Is a Skill?

A skill is a folder containing:

- **SKILL.md** (required): Markdown instructions with YAML frontmatter
- **scripts/** (optional): Executable code (Python, Bash, etc.)
- **references/** (optional): Documentation loaded on demand
- **assets/** (optional): Templates, fonts, icons used in output

### Core Design Principles

#### Progressive Disclosure

Skills use a three-level system:

- **Level 1 (YAML frontmatter):** Always loaded in Claude's system prompt. Provides enough information for Claude to know when it should use each skill, without loading everything into context.

- **Level 2 (SKILL.md body):** Loaded when Claude determines the skill is relevant to the current task. Contains full instructions and guidance.

- **Level 3 (Linked files):** Additional files bundled in the skill directory that Claude can optionally navigate to and discover only when needed.

This progressive disclosure minimizes token usage while maintaining expertise availability.

#### Composability

Claude can load multiple skills simultaneously. Your skill should work well alongside others rather than assuming it's the only capability available.

#### Portability

Skills work identically across Claude.ai, Claude Code, and the API. Create a skill once, and it works across all platforms without modification—provided the environment supports any dependencies the skill requires.

### For MCP Builders: Skills + Connectors

If you're building standalone skills without MCP, skip ahead to Planning & Design—you can always come back here later.

When combined with MCP, skills transform from instruction documents into workflow orchestrators. Where MCP provides the *tools* (API access, database connections, file operations), skills provide the *intelligence* (when to use which tool, in what order, with what parameters, and how to handle edge cases).

**The synergy pattern:**

| Component | Provides | Example |
| --- | --- | --- |
| MCP Server | Raw tool access | `create_issue()`, `query_database()` |
| Skill | Workflow intelligence | "When creating a bug report, first check for duplicates, then gather system info, then create with proper labels" |
| Combined | Reliable automated workflows | One-prompt bug filing that's consistent every time |

Skills solve common MCP pain points: inconsistent tool usage, missing steps in workflows, poor error handling, and the need for users to remember complex sequences. They transform "here are some tools" into "here's an expert assistant."

## Planning and Design

### Three Categories of Skills

Skills typically fall into three categories, each with distinct design patterns:

#### Category 1: Document and Asset Creation

Skills that produce consistent, high-quality outputs like reports, presentations, designs, or code. The key challenge is maintaining quality and format consistency across uses.

**Design pattern:** Define clear output specifications, include examples of good output, specify quality criteria, and build in self-evaluation checkpoints.

#### Category 2: Workflow Automation

Skills that orchestrate multi-step processes. The key challenge is handling branching logic, error states, and maintaining context across steps.

**Design pattern:** Map the complete workflow with decision points, define clear entry/exit criteria for each step, include error handling at every stage, and preserve state across steps.

#### Category 3: MCP Enhancement

Skills that add workflow intelligence on top of MCP tool access. The key challenge is making tool usage reliable and optimized.

**Design pattern:** Document the optimal sequence for tool usage, include common error recovery patterns, define quality gates between steps, and provide context-aware tool selection guidance.

### SKILL.md Structure

The SKILL.md file has two parts: YAML frontmatter and the instruction body.

#### YAML Frontmatter

```yaml
---
name: skill-name-kebab-case
description: "[What it does] + [When to use] + [Key features]"
license: MIT
compatibility:
  - "Requires Python 3.9+"
  - "Works with Claude.ai, Claude Code, API"
metadata:
  author: your-name
  version: "1.0.0"
---
```

**Critical rules:**

- `name` must be kebab-case (lowercase with hyphens)
- `description` must include both *what* and *when*—Claude uses this to decide when to load the skill
- No XML angle brackets in frontmatter
- Folder naming: kebab-case only
- File naming: exactly `SKILL.md` (case-sensitive)
- No `README.md` inside the skill folder

#### Instruction Body

The body follows the frontmatter and contains the actual instructions Claude will follow. Key principles:

**Be specific and actionable.** Instead of "write good code," say "use TypeScript strict mode, handle all error cases with typed error objects, and include JSDoc for public APIs."

**Use examples liberally.** Show Claude what good output looks like. One concrete example communicates more than paragraphs of description.

**Include decision trees.** When the skill handles multiple scenarios, make the branching logic explicit: "If the user provides a Figma link, start with design extraction. If they provide text requirements, start with wireframe generation."

**Define quality criteria.** State what "done" looks like: "The output is complete when all API endpoints have corresponding test files, each with at least one happy-path and one error test."

## Testing and Iteration

### Three Testing Dimensions

#### 1. Trigger Testing

Verify the skill loads at the right times—and doesn't load when it shouldn't.

- Test with prompts that should trigger the skill
- Test with similar but unrelated prompts that should *not* trigger it
- Verify the description in frontmatter is specific enough to avoid false positives

#### 2. Functional Testing

Validate that the skill produces correct outputs.

- Test each major workflow path
- Test edge cases and error scenarios
- Verify output format matches specifications
- Check that quality criteria are met

#### 3. Performance Comparison

Prove the skill improves over baseline Claude behavior.

- Run the same task with and without the skill
- Measure quality, consistency, and completion rate
- Track token usage and response time
- Document specific improvements

### Key Success Metrics

- Triggers on 90%+ of relevant queries
- Completes workflows in X tool calls (set your target)
- Zero failed API calls per workflow
- No user prompting required for next steps
- Consistent results across sessions

### Iteration Approach

Skills rarely work perfectly on the first attempt. The iteration loop:

1. **Test** the skill with representative prompts
2. **Identify** where Claude deviates from expected behavior
3. **Diagnose** whether the issue is in trigger conditions, instructions, or examples
4. **Refine** the specific section causing problems
5. **Re-test** to verify the fix and check for regressions

Common fixes:
- Skill doesn't trigger → Improve the `description` field in frontmatter
- Skill triggers too broadly → Add specificity to the description, include "don't use when" guidance
- Output quality inconsistent → Add more examples, tighten quality criteria
- Workflow steps skipped → Make step transitions more explicit, add checkpoints

## Distribution and Sharing

### Hosting

Host skills on GitHub with a public repository. Include:
- Clear README explaining the skill's purpose and usage
- Installation instructions
- Example prompts and expected outputs
- Version history

### Installation Methods

**Individual users:** Upload to Claude.ai via Settings > Skills.

**Organization deployment:** Available as of December 2025 for teams that need standardized skill sets across the organization.

**API usage:** Skills can be loaded programmatically for automated workflows.

**Claude Code:** Skills are automatically discovered from your project directory structure.

### When to Use Skills vs. AGENTS.md vs. Both

| Approach | Best For | How It Works |
| --- | --- | --- |
| **Skills** | Specific, repeatable workflows | Loaded on demand when relevant |
| **AGENTS.md** | Broad project conventions and context | Always present in system prompt |
| **Both** | Complex projects with both conventions and workflows | AGENTS.md for horizontal knowledge, Skills for vertical workflows |

Skills and AGENTS.md serve complementary roles. AGENTS.md provides the persistent, always-available context about your project (tech stack, coding conventions, architecture decisions). Skills provide on-demand expertise for specific tasks (code review workflows, deployment procedures, testing patterns).

For maximum effectiveness, use AGENTS.md for information the agent needs on every task, and Skills for specialized workflows the agent needs only when performing specific operations.

## Patterns and Troubleshooting

### Common Patterns

**1. Sequential Workflow Orchestration:** A linear series of steps where each builds on the output of the previous one. Best for processes with clear start-to-finish flow.

**2. Multi-MCP Coordination:** Skills that orchestrate across multiple MCP servers, selecting the right tool from the right server at each step. Essential for complex integrations.

**3. Iterative Improvement Loops:** Skills that include self-evaluation and refinement cycles. The skill instructs Claude to evaluate its output against quality criteria and iterate until standards are met.

**4. Context-Aware Tool Selection:** Skills that guide Claude to choose different tools or approaches based on the current context—project size, tech stack, user expertise level, etc.

**5. Domain-Specific Intelligence:** Skills that embed deep domain knowledge to guide decisions that generic Claude wouldn't make optimally—like knowing that certain database migrations should always be reversible, or that specific API endpoints require rate limiting.

### Common Problems and Solutions

**Problem: Skill never triggers**
Solution: Review your `description` field. It must clearly state *when* the skill should be used, not just *what* it does. Test with various prompt phrasings.

**Problem: Claude ignores skill instructions**
Solution: Instructions may be too vague or contradictory. Use specific, actionable language. Check for conflicts with other loaded skills.

**Problem: Output is inconsistent**
Solution: Add more examples of expected output. Tighten quality criteria. Include a self-evaluation step before final output.

**Problem: Token usage too high**
Solution: Move detailed reference material to Level 3 (linked files). Keep the SKILL.md body focused on core workflow logic. Use progressive disclosure effectively.

## Resources and References

- **[Official Anthropic Skills Documentation](https://docs.anthropic.com/en/docs/build-with-claude/skills):** Authoritative source for technical specifications and requirements
- **[Skills.sh Directory](https://skills.sh/):** Community directory of reusable skills
- **[AgentSkills.io](https://agentskills.io/):** Open standard for packaging agent knowledge
- **[Skill Creator Tool](https://docs.anthropic.com/en/docs/build-with-claude/skills#skill-creator):** Interactive tool for building your first skill

### Quick Reference: Technical Requirements

| Requirement | Specification |
| --- | --- |
| Folder name | kebab-case only |
| Required file | `SKILL.md` (exact case) |
| Prohibited file | `README.md` inside skill folder |
| Frontmatter `name` | kebab-case, matching folder name |
| Frontmatter `description` | Must include what + when |
| Angle brackets | Not allowed in YAML frontmatter |
| Platforms | Claude.ai, Claude Code, API |

Building effective skills is an iterative process. Start simple, test thoroughly, and refine based on real-world usage. The investment pays off every time Claude correctly follows your workflow without needing to be re-taught.
