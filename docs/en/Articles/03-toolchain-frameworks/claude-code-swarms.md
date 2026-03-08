---
title: "Claude Code Swarms: Multi-Agent Collaborative Development"
description: Claude Code now supports agent teams (Swarms)—multiple AI agents collaborating to research, debug, and build in parallel. Explore this evolution from experimental feature to first-class capability.
author: Addy Osmani
source: https://addyosmani.com/blog/claude-code-agent-teams/
date: '2026-03-07'
category: 03-toolchain-frameworks
tags:
  - Claude Code
  - Multi-Agent
  - Swarm
  - Parallel Development
  - Task Coordination
---

# Claude Code Swarms: Multi-Agent Collaborative Development

**Author: Addy Osmani**

**Original: [Read the full article](https://addyosmani.com/blog/claude-code-agent-teams/)**

<div class="article-meta">
</div>

> ## Summary
>
> Claude Code now supports [agent teams](https://code.claude.com/docs/en/agent-teams) (swarms)—no longer a single agent working sequentially, but a lead agent delegating to multiple teammates working in parallel. Enable agent teams in your `settings.json` to try it. If you've been exploring multi-agent orchestration through Conductor, Gas Town, or similar tools, this is where those ideas become native.

The community has been calling these patterns **swarms**—coordinated teams of AI agents, each with a specialized role, working in parallel through structured communication. What started with developers discovering feature flags in Claude Code's binary and building workarounds via sub-agents and bash scripts is now a first-class feature. TeammateTool, inbox-based communication, tmux split-screen—it's all here.

This matters because it's a fundamentally different architecture from the single-agent model most of us have been using. If you've been following the [shift from commander to orchestrator](https://addyosmani.com/blog/future-agentic-coding/) or experimenting with [parallel agent workflows](https://addyosmani.com/blog/coding-agents-manager/), agent teams are where those ideas become reality.

## Why Multi-Agent Coordination Matters

The single-agent model has a well-known failure mode. You ask Claude to do something complex—like refactoring authentication across three services—and it might get 60% through before the context starts degrading. Details from step 2 blur into step 5. You `/clear` and start over. Repeat until frustrated.

The core insight behind swarms is simple: **LLMs perform worse as context expands**. It's not just about hitting token limits—the more information in the context window, the harder it is for the model to focus on what currently matters. Adding a project manager's strategic notes to the context of an agent trying to fix a CSS bug actually hurts performance.

Human teams work similarly. We don't put backend engineers in frontend code reviews. We don't CC the entire company on every Slack thread. Specialization is about focus.

The multi-agent pattern formalizes this. By giving each agent a narrow scope and clean context, you get better reasoning within each domain, independent quality checks, natural checkpoints between phases, and graceful degradation when one agent fails. The testing agent has tests in its context—not three hours of planning discussion. The security reviewer doesn't need to wade through performance optimization notes.

One caveat: this only works when tasks are properly scoped. "Build me an app" will burn tokens as agents struggle. "Implement these five well-defined API endpoints per this spec" produces good results.

## What Are Agent Teams

The architecture is straightforward. One Claude Code session becomes the **team lead**. It spawns **teammates**—each a full, independent Claude Code instance with its own large-token context window. There's a shared task list with dependency tracking, an inbox-based messaging system for inter-agent communication, and teammates can self-claim work as they finish tasks.

| Component | Role |
| --- | --- |
| **Team Lead** | Creates team, spawns teammates, coordinates work |
| **Teammates** | Independent Claude Code instances handling assigned tasks |
| **Task List** | Shared work items with dependency tracking and auto-unblocking |
| **Inbox** | Direct messaging between agents—not just reporting to the lead |

This differs from Claude Code's existing sub-agents. Sub-agents are focused workers that report results back to a single parent—they can't communicate with each other. Agent teams are true collaboration—teammates share findings, challenge each other's approaches, and coordinate independently. The tradeoff is token cost—each teammate is a separate Claude instance.

|  | Sub-Agents | Agent Teams |
| --- | --- | --- |
| **Context** | Own window; results return to caller | Own window; fully independent |
| **Communication** | Reports to lead only | Teammates message each other directly |
| **Coordination** | Lead manages everything | Shared task list with self-coordination |
| **Best For** | Focused tasks where you only care about results | Complex work requiring discussion and collaboration |
| **Token Cost** | Lower | Higher—each teammate is an independent instance |

Use sub-agents when you need fast, focused workers. Use agent teams when teammates need to share findings, challenge each other, and coordinate on their own.

## Getting Started

Enable agent teams by adding the experimental flag in your settings:

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Then tell Claude in natural language what team you want. It handles spawning and coordination from there:

> I'm designing a CLI tool that helps developers track TODO comments in codebases. Create an agent team to explore this from different angles: one teammate for UX, one for technical architecture, one as devil's advocate.

Claude creates the team with a shared task list, spawns teammates for each perspective, lets them explore the problem, and synthesizes the findings. The lead's terminal lists all teammates and what they're working on.

You can also be explicit about team structure:

> Create a team of 4 teammates to refactor these modules in parallel. Each teammate uses Opus.

## Where This Excels

Here's a pattern that works well: **tasks where parallel exploration adds genuine value and teammates can operate mostly independently.**

**Competing hypotheses for debugging.** Spawn five teammates, each investigating a different theory about why the app exits after one message. Let them communicate to disprove each other's theories, like a scientific debate. This genuinely works better than sequential investigation, which suffers from anchoring bias—once you explore one theory, subsequent investigation gets biased toward it. Multiple investigators with adversarial debate converge on root causes faster.

**Parallel code review with different perspectives.** One teammate focuses on security implications, one checks performance impact, one verifies test coverage. A single reviewer tends to lean toward one type of issue at a time. Splitting review criteria into independent domains means each gets thorough attention simultaneously.

**Cross-layer feature work.** Changes spanning frontend, backend, and tests—each handled by a different teammate. Instead of one agent context-switching between layers, three agents work in parallel with full focus on their domain.

**Research and exploration.** Multiple teammates investigating different approaches simultaneously, sharing their findings, and converging on the best path. Research findings flow directly into implementation context—no telephone game.

## Controlling the Team

You interact with agent teams through the lead's terminal. Some controls that matter in practice:

### Display Modes

Two options. **In-process** (default): all teammates run inside your main terminal. Use `Shift+Up/Down` to select a teammate and type to message them directly. Press `Enter` to view a teammate's session, `Escape` to interrupt their turn, `Ctrl+T` to toggle the task list. Works in any terminal.

**Split-screen**: each teammate gets its own pane via tmux or iTerm2. You see everyone's output at once and click into panes to interact directly. Set in config or per-session:

```json
{
  "teammateMode": "tmux"
}
```

Or override for a single session:

```bash
claude --teammate-mode in-process
```

### Plan Approval

For risky work, require teammates to plan before implementing. Teammates work in read-only mode until the lead approves their approach:

> Spawn an architect teammate to refactor the authentication module. Require plan approval before they make any changes.

If rejected, they revise and resubmit. You can bias the lead's judgment with criteria: "Only approve plans that include test coverage" or "Reject plans that modify the database schema."

### Delegation Mode

Press `Shift+Tab` to restrict the lead to coordination only—spawning, messaging, shutting down teammates, and managing tasks. No touching code. This prevents a common problem: the lead getting distracted and implementing things itself instead of waiting for teammates.

### Direct Teammate Interaction

Each teammate is a full Claude Code session. You can message any of them directly to provide additional instructions, ask follow-up questions, or redirect their approach—without going through the lead.

### Task Management

The shared task list coordinates work across the team. Tasks have three states: pending, in-progress, and completed. Tasks can depend on other tasks—pending tasks with unresolved dependencies can't be claimed until those dependencies complete. Auto-unblocking happens when blocking tasks finish.

The lead can explicitly assign tasks, or teammates can self-claim the next unassigned, unblocked task when they finish. Task claiming uses file locking to prevent race conditions.

Teams and tasks are stored locally:

```
~/.claude/teams/{team-name}/config.json    # Team metadata + members
~/.claude/tasks/{team-name}/               # Task list
```

### Shutdown

Ask the lead to shut down specific teammates—they can approve or reject with an explanation. Always use the lead for cleanup. Teammates shouldn't run it since their team context may not properly resolve, potentially leaving resources in an inconsistent state.

## The Management Analogy

This keeps coming back: the [skills that make someone a strong engineering manager](https://addyosmani.com/blog/coding-agents-manager/) translate directly into effective agent orchestration. Agent teams make this even more explicit.

**Task sizing matters.** Too small, and coordination overhead dominates. Too large, and teammates work too long without checkpoints, risking wasted effort. The sweet spot is self-contained units that produce clear deliverables. Around 5-6 tasks per teammate keeps everyone productive and lets the lead reassign work if someone gets stuck.

**File ownership matters.** Two teammates editing the same file causes overwrites. Decompose work so each teammate owns a different set of files. Same boundary-setting you'd do with human teams to avoid merge conflicts.

**Context loading matters.** Teammates automatically get your project's `CLAUDE.md`, MCP servers, and skills, but they don't inherit the lead's conversation history. Include task-specific details in the spawn prompt:

> Spawn a security reviewer teammate with prompt: "Review the authentication module in src/auth/ for security vulnerabilities. Focus on token handling, session management, and input validation. The app uses JWT tokens stored in httpOnly cookies. Report any issues with severity ratings."

The more specific the brief, the better the output. As always—but now you're writing briefs for a team, not a single agent.

## Things to Watch For

This is experimental. The rough edges are real and worth knowing about.

**The lead sometimes implements instead of delegating.** Tell it to wait: "Wait for your teammates to finish their tasks before proceeding." Or use delegation mode (`Shift+Tab`) to restrict the lead to coordination-only tools.

**In-process teammates don't have session recovery.** `/resume` and `/rewind` won't restore in-process teammates. After resuming, the lead may try to message teammates that no longer exist. Spawn new ones.

**Task status can lag.** Teammates sometimes fail to mark tasks complete, blocking dependent tasks. Check if work is actually done and nudge the lead or manually update.

**One team per session, no nested teams.** The lead manages one team at a time. Teammates can't spawn their own teams or teammates. Only the lead manages the team. This is deliberate—preventing infinite recursion, runaway token costs, and loss of human oversight. Clean up the current team before starting a new one.

**Token costs scale with teammates.** Each teammate is an independent Claude instance with its own context window. For routine tasks, a single session is more cost-effective. Multi-agent mode pays off on larger, parallelizable work—not fixing typos.

**Split-screen requires tmux or iTerm2.** VS Code's integrated terminal, Windows Terminal, or Ghostty aren't supported. The default in-process mode works everywhere.

**Permissions propagate from the lead.** All teammates start with the lead's permission settings. If the lead runs with `--dangerously-skip-permissions`, all teammates do too.

## A Word of Caution

Watching agents work in parallel has an addictive quality. The activity metrics look impressive—commits per hour, parallel task completion, lines of code touched.

But activity doesn't always translate to value.

The risk with multi-agent systems is that they make it easy to generate lots of code quickly. That code still needs to be correct, maintainable, and actually solve the problem. I've seen developers lose the plot, spending more time configuring orchestration patterns than thinking about what they're building.

**Let the problem guide the tool, not the other way around.** If a single agent in a focused session gets you there faster, use that. If you need parallel experts, use agent teams. Agent teams add coordination overhead and use significantly more tokens than a single session. They work best when teammates can operate independently. For sequential tasks, same-file edits, or work with many dependencies, a single session or sub-agents are more effective.

## Maximizing Your Swarms with Compound Engineering

If you want a more structured workflow around agent teams, Every's [Compound Engineering Plugin](https://github.com/EveryInc/compound-engineering-plugin) is worth a look. It's a Claude Code plugin that adds specialized review agents and a plan → work → review → compound loop, with the philosophy that each unit of engineering work should make the next easier.

Install it directly in Claude Code:

```
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

The parts most relevant to agent teams: `/workflows:plan` turns feature ideas into detailed implementation plans (exactly the kind of upfront spec that makes agent delegation work well), `/workflows:review` runs multi-agent code review before merging (security, performance, architecture, and complexity—each with its own specialized reviewer), and `/workflows:compound` records learnings so future agents benefit from past work.

The plugin's philosophy—80% planning and review, 20% execution—maps cleanly onto what makes agent teams effective. The better your specs, the better the agent output. The more learnings you codify, the less each subsequent agent struggles.

## Getting Started—Here's What I'd Do

If you're new to multi-agent coordination, start small.

**Start with research and review.** Tasks with clear boundaries that don't require writing code—review a PR from three angles, research libraries, investigate a bug with competing theories. These demonstrate the value of parallel exploration without the coordination complexity of parallel code changes.

**Then try cross-layer features.** Frontend, backend, and testing each handled by a different teammate. Clear boundaries, clear deliverables.

**Then scale to larger refactors.** Multiple services, parallel implementation after a shared design phase. This is where time compression gets dramatic—what might take days of sequential work compresses into hours of parallel execution plus review.

The core skill isn't writing less code. It's **decomposing problems into structures that agent teams can execute**—knowing what to build, what correctness means, and how to verify results. Implementation is increasingly a matter of sufficiently precise specification.

This is what [agentic engineering](https://addyosmani.com/blog/agentic-engineering/) looks like when the agents can actually coordinate. The architecture for coordinating AI agent systems is here. Use it wisely.

The full [Claude Code agent teams documentation](https://code.claude.com/docs/en/agent-teams) has complete setup and usage guides.

---

_I write about the evolution of agentic coding workflows in my [Elevate newsletter](https://addyo.substack.com/) and my O'Reilly book [Beyond Vibe Coding](https://beyond.addy.ie/). If you're experimenting with agent teams or multi-agent workflows, I'd love to hear what's working for you._
