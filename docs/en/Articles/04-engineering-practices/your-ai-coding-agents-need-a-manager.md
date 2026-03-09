---
title: Your AI Coding Agents Need a Manager
description: In the near future, high-leverage developers will act more like async-first managers, orchestrating multiple AI coding agents in parallel. The skills that make someone a great tech lead or manager will directly translate into new AI collaboration capabilities
author: Addy Osmani
source: https://addyosmani.com/blog/coding-agents-manager/
date: '2026-03-07'
category: 04-engineering-practices
tags:
  - AI Coding
  - Agent Orchestration
  - Engineering Management
  - Multi-Agent
  - Productivity
---

# Your AI Coding Agents Need a Manager

> Original article: [Your AI Coding Agents Need a Manager](https://addyosmani.com/blog/coding-agents-manager/) by Addy Osmani

## The Shift

Something fundamental is changing in software development. The highest-leverage developers are spending less time writing code and more time **managing agents that write code**. This isn't a prediction—it's already happening. Running multiple Claude Code sessions, Cursor windows, and Copilot Workspaces in parallel means the bottleneck has shifted from "how fast can I type" to "how well can I coordinate."

The irony is that the skills needed to be great at this new paradigm aren't traditional coding skills at all. They're **management skills**: task decomposition, delegation, quality oversight, and unblocking. Developers who think in terms of async-first coordination and clear work breakdown have a massive advantage.

## Management Skills That Transfer

### Task Decomposition

A great manager breaks an ambiguous project into clear, actionable work items. This is exactly what AI agents need. An agent given "build the user dashboard" will produce mediocre results. An agent given "create a React Server Component that fetches the user's last 10 transactions from the /api/transactions endpoint and renders them in a table with columns for date, description, and amount" will produce something you can actually ship.

The skill isn't just breaking things down—it's knowing the right granularity. Too coarse and the agent has too much freedom to make wrong choices. Too fine and you're spending more time writing specs than it would take to write the code yourself.

### Delegation

Not all tasks are equal, and not all agents are equal. Effective delegation means matching the right task to the right tool:

- **High-context, multi-file changes**: Claude Code with full repository access
- **Focused, single-file edits**: Cursor or Windsurf with inline editing
- **Boilerplate and patterns**: GitHub Copilot autocompletion
- **Research and exploration**: An agent session dedicated to reading docs and proposing approaches
- **Testing and validation**: A separate agent session focused solely on writing and running tests

A good manager doesn't give every task to their strongest engineer. They distribute work based on the nature of the task and the strengths of each team member. The same principle applies to agents.

### Quality Oversight

Managing agents requires the same quality mindset as managing people: trust but verify. You set standards upfront (coding conventions, architectural patterns, test requirements), give the agent autonomy to execute, then review the output against those standards.

The critical difference from managing humans is that agents don't learn from feedback across sessions. Every new session starts with the same baseline. This means your quality standards need to be **encoded**, not just communicated—in AGENTS.md files, linting rules, test suites, and CI/CD pipelines.

### Unblocking

When an agent gets stuck—hitting an authentication error, encountering an ambiguous API, or producing output that doesn't match your expectations—your job as the manager is to unblock it. This might mean:

- Providing additional context ("The auth token is in the .env file, not passed as a parameter")
- Narrowing the scope ("Ignore the caching layer for now, just get the basic query working")
- Redirecting the approach ("Don't try to modify the existing component—create a new one alongside it")

The fastest developers in an AI-assisted world are the ones who unblock agents quickly, keeping multiple workstreams moving in parallel.

## Orchestration Patterns

### Parallel Agent Execution

The biggest productivity multiplier is running agents in parallel on independent tasks. While one agent builds the API endpoint, another writes the frontend component, and a third creates the test suite. This requires upfront investment in task decomposition but pays off dramatically:

- **3-5x throughput**: Three agents working in parallel complete roughly three times as much work per hour
- **Reduced context switching**: Each agent has a clean, focused context for its specific task
- **Natural integration points**: Parallel work creates clear integration milestones where you review and combine outputs

### Dependency Management

Not all tasks are independent. Effective orchestration means identifying and managing dependencies:

1. **Foundation first**: Start agents on tasks that produce artifacts other tasks depend on (database schema, API contracts, shared types)
2. **Parallel middle**: Once foundations are in place, fan out to independent implementation tasks
3. **Integration last**: Combine the outputs, resolve conflicts, and verify end-to-end behavior

This mirrors how a good engineering manager sequences sprints—you don't start frontend work before the API contract is defined.

### Conflict Resolution

When multiple agents work on a shared codebase, conflicts are inevitable. Strategies for managing them:

- **Clear boundaries**: Assign each agent distinct files or modules. "Agent A owns `/src/api/*`, Agent B owns `/src/components/*`"
- **Shared interfaces**: Define the contracts between modules upfront (TypeScript interfaces, API schemas). Each agent works to the contract.
- **Sequential integration**: Don't let agents work on overlapping files. If Agent B depends on Agent A's output, wait for A to complete before starting B on dependent areas.

## Practical Workflow

### Morning: Define and Distribute

Start the day by planning:

1. Review yesterday's pending agent outputs
2. Break today's work into agent-sized tasks
3. Write clear specs for each task, including acceptance criteria
4. Prioritize by dependency order and impact
5. Kick off independent tasks in parallel

### Day: Agents Execute, You Manage

While agents work:

1. Monitor progress—check in on each agent periodically
2. Unblock stuck agents quickly
3. Review completed outputs as they arrive
4. Queue follow-up tasks based on completed work
5. Handle the tasks that need human judgment (architecture decisions, product trade-offs, stakeholder communication)

### Evening: Review and Merge

End the day by consolidating:

1. Review all agent outputs against acceptance criteria
2. Run the full test suite
3. Merge completed work, noting any integration issues
4. Document decisions made during the day
5. Plan tomorrow's agent tasks based on what was learned

## When to Intervene vs Let Agents Iterate

A common anti-pattern is micromanaging agents—interrupting them mid-task to course-correct based on partial output. This is rarely productive. Instead:

- **Let the agent complete its attempt** before reviewing. Partial output is misleading.
- **Intervene early** if the agent is clearly going in the wrong direction (wrong file, wrong framework, wrong approach entirely)
- **Give feedback as new tasks**, not mid-stream corrections. "The output from the previous task had X issue. Create a new version that fixes X and also adds Y."
- **Batch feedback**: Instead of five small corrections, consolidate into one clear revision request.

## Common Anti-Patterns

### Micromanaging Agents

Watching every line of code an agent produces and interrupting frequently. This negates the speed advantage of using agents and often produces worse results than letting the agent finish its thought.

### Insufficient Specs

Giving agents vague tasks and being surprised by vague results. "Build the settings page" is not a spec. What settings? What layout? What validation? What happens on save?

### No Quality Gates

Merging agent output without review, testing, or verification. Agents are fast, not infallible. Every output needs human validation before it reaches production.

### Single-Threading

Running one agent at a time, waiting for it to finish before starting the next. This leaves the biggest advantage of AI agents—parallelism—on the table.

## The Future of Software Development Roles

The developer-as-manager paradigm doesn't eliminate the need for coding skills—it raises the bar. You need deep technical expertise to:

- Write effective specs that anticipate edge cases
- Review agent output for correctness, security, and performance
- Architect systems that can be built in parallel by independent agents
- Debug integration issues when agent outputs don't fit together

What changes is the **leverage**. A developer managing five agents has the output capacity of a small team. The skills that differentiate top performers shift from "writes code fast" to "decomposes problems clearly, delegates effectively, and maintains quality at scale."

This is already the job description of a great engineering manager. The future of individual contribution looks a lot like management—and the developers who embrace that shift will define the next era of software development.
