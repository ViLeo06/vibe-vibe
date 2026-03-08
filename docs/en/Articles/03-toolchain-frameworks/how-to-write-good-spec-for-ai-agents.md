---
title: How to Write Good Specifications for AI Agents
description: Learn how to write truly executable specifications for AI agents—covering five core principles from high-level vision to task decomposition, self-verification, and continuous iteration.
author: Addy Osmani
source: https://addyosmani.com/blog/good-spec/
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
  - Specifications
  - Prompt Engineering
  - AI Agents
  - PRD
  - Requirements
---

# How to Write Good Specifications for AI Agents

**Author: Addy Osmani**

**Original: [Read the full article](https://addyosmani.com/blog/good-spec/)**

<div class="article-meta">
</div>

> ## Summary
>
> **TL;DR:** The goal of writing specs is to give the AI a clear, sufficiently detailed, yet non-overloaded execution baseline. You need to specify structure, style, tests, and boundaries; break large tasks into smaller ones; plan in read-only mode first, then execute, and iterate continuously throughout the process.

_"I've seen plenty of discussions about AI agent specs, but I've never found a truly stable, reusable framework. I can write specs approaching RFC-level detail, but once the context grows too large, the model starts losing focus."_

Many developers share this frustration: you write what looks like an RFC-quality spec, yet the model gradually drifts as the context grows. The issue often isn't "not writing enough"—it's whether the spec is truly designed for agent consumption. A good spec should clearly constrain direction, control context burden, and evolve as the project progresses. This article distills practices from tools like Claude Code and Gemini CLI into a more reusable spec-writing framework.

We'll cover five principles for excellent AI agent specifications, each starting with a bold key point.

## 1. Start with High-Level Vision, Let AI Draft the Details

**Launch your project with a concise high-level spec, then let AI expand it into a detailed plan.**

Don't try to nail down every detail from the start. Instead, begin with clear goal statements and a few core requirements. Treat it as a "product brief" and let the agent draft a more complete specification from there. This leverages AI's strength at expansion and completion, while keeping the steering wheel in your hands. Unless your project has very strict technical constraints from the outset, this approach is usually more efficient.

**Why this works:** LLM-based agents are great at filling in details when high-level goals are clear—but only when they truly know their task boundaries. Give it a short but reliable outline, then let it expand into a full spec (e.g., `spec.md`). You're essentially building a sustainably referenceable "source of truth" for subsequent implementation. For agents, upfront planning is often even more important than for humans: align the plan first, and the code that follows will be more stable.

**Practical approach:** Start a new session with: "You are an AI software engineer. Draft a detailed specification for [Project X], covering goals, features, constraints, and a step-by-step plan." Keep the initial prompt high-level, e.g., "Build a web app that lets users manage to-dos, with accounts, a database, and simple UI." The agent will typically produce a structured draft: overview, feature list, tech stack suggestions, data models, etc. This draft becomes your shared reference baseline. Review it before writing any code—fix misalignments, fill in gaps.

**Use plan mode to force upfront planning:** Tools like Claude Code offer a plan mode that restricts the agent to read-only—it can read code, analyze context, and generate plans, but won't modify files. This phase is perfect for refining specs: you describe what needs to be done, it explores existing code while drafting an approach, and asks clarifying questions to fill in ambiguous areas. Once architecture, testing, security risks, and key constraints are clear, switch back to execution mode. This significantly reduces the risk of "code flying before the spec is stable."

**Treat specs as persistent context:** Once you confirm the plan, save the spec (e.g., `SPEC.md`) and re-feed relevant fragments to the agent as needed. Many experienced users do this: the spec file isn't a one-time document—it's a cross-session anchor. This mitigates context drift from long conversations and enables quick state recovery when starting new sessions. It works the same way PRDs function in teams—whether the executor is human or AI, everyone aligns around the same baseline.

## 2. Structure Your Spec Like a Professional PRD

**Treat your AI spec as a structured document (PRD) with clear sections, not a loose pile of notes.**

Many developers approach agent specs like traditional Product Requirements Documents (PRDs) or system design docs—comprehensive, well-organized, and easy for AI to parse literally. This formal approach gives the agent a blueprint and reduces ambiguity.

**Six core domains:** GitHub's analysis of [over 2,500 agent configuration files](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) reveals a clear pattern: the most effective specs cover six domains. Use this as a completeness checklist:

**1. Commands:** Place executable commands early—not just tool names, but full commands with flags: `npm test`, `pytest -v`, `npm run build`. Agents reference these constantly.

**2. Tests:** How to run tests, what framework you use, where test files live, and what coverage expectations exist.

**3. Project Structure:** Where source code lives, where tests go, where docs belong. Be explicit: "`src/` for app code, `tests/` for unit tests, `docs/` for documentation."

**4. Code Style:** One real code snippet showing your style beats three paragraphs describing it. Include naming conventions, formatting rules, and examples of good output.

**5. Git Workflow:** Branch naming, commit message format, PR requirements. Agents can follow these if you spell them out.

**6. Boundaries:** What the agent should never touch—secrets, vendor directories, production configs, specific folders. "Never commit secrets" is the most common useful constraint from GitHub's research.

**Be specific about your tech stack:** Say "React 18 with TypeScript, Vite, and Tailwind CSS" instead of "React project." Include versions and key dependencies. Vague specs produce vague code.

**Use consistent formatting:** Clarity is king. Many developers use Markdown headings or XML-like tags to delineate sections because AI models handle well-structured text better than free-form prose. For example:

```markdown
# Project Spec: My Team Task App

## Goals
- Build a web app for small teams to manage tasks...

## Tech Stack
- React 18+, TypeScript, Vite, Tailwind CSS
- Node.js/Express backend, PostgreSQL, Prisma ORM

## Commands
- Build: `npm run build` (compiles TypeScript, outputs to dist/)
- Test: `npm test` (runs Jest, must pass before commit)
- Lint: `npm run lint --fix` (auto-fix ESLint errors)

## Project Structure
- `src/` – Application source code
- `tests/` – Unit and integration tests
- `docs/` – Documentation

## Boundaries
- ✅ Always: Run tests before committing, follow naming conventions
- ⚠️ Ask First: Database schema changes, adding dependencies
- 🚫 Never: Commit secrets, edit node_modules/, modify CI config
```

## 3. Split Large Tasks into Focused Modules

**Avoid the "curse of instructions"—break large specs into focused tasks to keep agent context manageable.**

The "curse of instructions" is when overly detailed, monolithic specs become counterproductive. When you dump everything into a single prompt, the agent may struggle to prioritize, lose focus on the immediate task, or introduce inconsistencies.

**Hierarchical summaries:** For large specs, use expandable table-of-contents structures. The top level has short descriptions of each module; the agent can drill down into detail only when working on that specific module.

**Leverage sub-agents:** For specialized domains (security review, performance audit, test generation), consider delegating to sub-agents with focused context rather than loading everything into one conversation.

**Run multiple agents in parallel:** For truly independent tasks (frontend component vs. API endpoint vs. database migration), parallel agents with separate contexts outperform a single agent context-switching between domains.

| Approach | Best For |
| --- | --- |
| Single agent | Sequential tasks, small scope, same-file changes |
| Sub-agents | Focused tasks where you only need the result |
| Agent teams | Complex work needing cross-domain coordination |

**Use inline TODO comments:** Code comments like `// TODO: implement validation per spec section 3.2` serve as in-context specifications. The agent can discover and act on them naturally.

**Fresh context for each major task:** Starting a new conversation for each distinct task prevents accumulated context from earlier work from degrading performance on the current task. Bring forward only the spec, not the full conversation history.

## 4. Build in Self-Verification and Constraints

**Use a three-tier boundary model and embed verification directly into your spec.**

The three-tier boundary system provides clear, unambiguous guidance:

- **✅ Always** (no asking required): Run tests before committing, follow naming conventions, include error handling
- **⚠️ Ask First** (needs approval): Database schema changes, adding new dependencies, modifying API contracts
- **🚫 Never** (hard stops): Commit secrets, edit `node_modules/`, modify CI configuration, delete production data

**Encourage self-validation:** Include instructions like "After implementing, verify your changes against these criteria..." followed by a checklist. This prompts the agent to self-check before reporting completion.

**Use "LLM as judge" for subjective criteria:** For quality standards that can't be verified with tests alone (code readability, naming quality, documentation completeness), instruct the agent to evaluate its own output against stated criteria.

**Embed tests into specs:** Rather than treating testing as a separate phase, include test expectations directly in your spec: "The `createUser` function must handle duplicate emails by returning a 409 status code. Write a test for this." This makes tests a natural part of implementation, not an afterthought.

**Inject domain knowledge:** Include known edge cases, common pitfalls, and best practices specific to your domain. "Our API handles timezone-aware dates—always use UTC internally and convert only at the presentation layer." This kind of context prevents entire classes of bugs.

**Scale spec detail to task complexity:** Keep specs minimal for simple tasks. A button color change doesn't need an RFC. But for a payment processing integration, comprehensiveness pays for itself many times over.

## 5. Continuous Testing and Feedback Loop

**Don't wait until the end to verify compliance—run tests at every milestone and iterate on the spec itself.**

Specs are living documents, not contracts carved in stone. As the agent works and you discover gaps, update the spec. The iteration loop is:

1. **Write initial spec** → Agent generates plan
2. **Review plan** → Adjust spec if needed
3. **Agent implements** → Run tests
4. **Tests reveal gaps** → Update spec and iterate
5. **Repeat** until feature is complete

**Run tests at every milestone:** Don't accumulate implementation debt. After each meaningful change, run the relevant test suite. Early detection of drift is much cheaper than end-stage debugging.

**Update specs based on agent misunderstandings:** If the agent consistently misinterprets a requirement, the spec isn't clear enough. Refine the language and add examples. The spec should evolve to become increasingly precise about areas where ambiguity caused problems.

**Version control your specs:** Treat spec files like code—they belong in your repository, tracked by git, reviewed in PRs. This creates a natural history of decisions and enables rollback if needed.

**Balance cost vs. quality:** Not every task needs the most expensive model or the most detailed spec. Use cheaper, faster models for straightforward tasks and reserve premium models for complex reasoning. Batch related small tasks when possible.

**Log and monitor:** In production agent workflows, track what the agent did, what tools it used, how many iterations it took, and where it got stuck. This data feeds directly into spec improvements.

## Common Pitfalls to Avoid

- **Vague prompts without anchors:** "Make it better" gives the agent no actionable direction. "Improve the error handling in `src/api/users.ts` to return proper HTTP status codes and log errors to our Winston logger" does.

- **Dumping long unstructured context:** A 50-page document pasted into a prompt is not a spec—it's noise. Structured, referenced content beats raw volume.

- **Skipping human review:** The agent's plan should be reviewed before execution begins. Trust but verify.

- **Ignoring the six core domains:** Missing any of commands, tests, project structure, code style, git workflow, or boundaries leaves gaps that will manifest as incorrect agent behavior.

- **Overspecifying implementation details:** "Use a for loop starting at index 0" micromanages the agent. "Iterate over all users and filter by active status" communicates intent while leaving implementation flexibility.

## Key Takeaways

1. **Start high-level, expand iteratively:** Let AI draft the details from your vision. Review, refine, then execute.

2. **Structure matters:** Six core domains (commands, tests, structure, style, git workflow, boundaries) cover what agents need most.

3. **Modularize aggressively:** Break large tasks into focused chunks. Fresh context per task beats accumulated context.

4. **Three-tier boundaries:** ✅ Always / ⚠️ Ask First / 🚫 Never provides clear, unambiguous agent guidance.

5. **Iterate on the spec, not just the code:** When agents misunderstand, the spec needs updating—not just the prompt.

Good specs + rigorous iteration + proper boundaries = dramatically lower rework rates and context drift. Spec-driven development treats specifications as executable engineering artifacts, not one-time documents.
