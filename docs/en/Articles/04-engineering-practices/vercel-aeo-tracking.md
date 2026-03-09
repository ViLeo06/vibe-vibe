---
title: How Vercel Built AEO Tracking for Coding Agents
description: Deep dive into how Vercel uses Sandbox, AI Gateway, and Workflows to build an AEO system that tracks coding agent behavior
author: Eric Dodds, Allen Zhou
source: https://vercel.com/blog/how-we-built-aeo-tracking-for-coding-agents
date: '2026-03-07'
category: 04-engineering-practices
tags:
  - Vercel
  - Agent Engineering
  - AEO
  - Analytics
  - Monitoring
---

# How Vercel Built AEO Tracking for Coding Agents

> Original article: [How We Built AEO Tracking for Coding Agents](https://vercel.com/blog/how-we-built-aeo-tracking-for-coding-agents) by Eric Dodds, Allen Zhou

## What Is AEO?

If SEO (Search Engine Optimization) is about making your content discoverable by search engines, **AEO (Agent Experience Optimization)** is about making your infrastructure, APIs, and documentation work well for AI agents. As coding agents become a primary consumer of developer tools and platforms, understanding how they interact with your systems is no longer optional—it's a competitive necessity.

Vercel recognized this shift early: coding agents are now some of the most active "users" of their platform. They deploy apps, read documentation, call APIs, and interact with dashboards—all programmatically. Tracking and optimizing these interactions requires fundamentally different tooling than traditional user analytics.

## Why Tracking Matters

Traditional analytics tools are built around human interaction patterns: page views, click-through rates, session duration. AI agents interact with infrastructure in fundamentally different ways:

- **No sessions**: An agent makes discrete API calls, not browsing sessions
- **No UI**: Agents don't see your dashboard—they consume your API responses and documentation
- **High volume, low variety**: Agents often make many similar requests in rapid succession
- **Success is binary**: An agent either completes its task or fails. There's no "browsing" behavior

Without purpose-built tracking, you're blind to how agents experience your platform. You can't tell if they're struggling with your API design, misunderstanding your documentation, or hitting rate limits that silently degrade their performance.

## Technical Architecture

Vercel's AEO tracking system is built on three core components:

### Sandbox for Safe Execution

Vercel Sandbox provides isolated execution environments where coding agents can run code, test deployments, and interact with platform APIs safely. From an AEO perspective, Sandbox serves as a controlled observation point:

- Every agent action within a Sandbox is logged with full context
- Resource usage (compute, memory, network) is tracked per agent session
- Failures are captured with complete stack traces and environment state
- Agent behavior can be replayed for debugging and optimization

### AI Gateway for Request Routing

The AI Gateway sits between coding agents and Vercel's backend services, providing a unified observation layer:

- **Request classification**: Automatically identifies whether a request comes from a human user, an AI agent, or an automated pipeline
- **Agent fingerprinting**: Identifies which agent framework is making requests (Claude Code, Cursor, Copilot, custom agents) based on request patterns and headers
- **Request routing**: Optimizes response format and content based on the requesting agent's capabilities
- **Rate limiting**: Agent-aware rate limiting that accounts for the bursty, parallel nature of agent requests

### Workflows for Orchestration

Vercel Workflows manage multi-step agent interactions—deployments, test runs, preview generations—as first-class tracked entities:

- Each workflow step is individually timed and monitored
- Dependencies between steps are explicitly modeled
- Failures at any step capture the full workflow context, not just the failing step
- Workflow patterns across agents are analyzed to identify common sequences and bottlenecks

## Data Collection

### Agent Fingerprinting

Identifying which agent is making a request is the foundation of AEO tracking. Vercel uses a combination of signals:

- **User-Agent headers**: Many agents identify themselves, though not consistently
- **Request patterns**: Different agents have characteristic request sequences (e.g., Claude Code tends to read project structure before making changes)
- **Authentication context**: API keys and tokens are associated with agent configurations
- **Behavioral signatures**: Request timing, concurrency patterns, and retry behavior create identifiable fingerprints

### Request Patterns

AEO tracking captures not just individual requests but the patterns between them:

- **Sequence analysis**: What does a typical agent workflow look like? (Read docs → call API → verify response → retry on failure)
- **Parallelism**: How many concurrent requests does an agent make? Does it respect concurrency limits?
- **Error recovery**: When an agent encounters an error, what does it do? Retry? Try a different approach? Give up?

### Success and Failure Rates

Every agent interaction is classified as a success or failure:

- **Task completion**: Did the agent achieve its stated goal (deploy an app, update a configuration, read documentation)?
- **Partial success**: Did the agent complete some steps but fail on others?
- **Failure taxonomy**: Why did the agent fail? (API error, authentication issue, rate limit, documentation ambiguity, timeout)

## Metrics That Matter

Through building AEO tracking, Vercel identified the metrics that most directly predict agent satisfaction and effectiveness:

### Task Completion Rate

The percentage of agent-initiated workflows that reach their intended end state. This is the north star metric for AEO—if agents can't complete their tasks on your platform, they (and their users) will go elsewhere.

### Token Efficiency

How many tokens does an agent consume to complete a given task? Lower is better. High token consumption usually indicates that the agent is struggling—re-reading documentation, retrying failed requests, or exploring dead ends.

### Error Patterns

Not just error rates, but error clustering. A single API endpoint that causes 80% of agent failures is a clear optimization target. Error patterns also reveal documentation gaps: if agents consistently misuse an API parameter, the documentation for that parameter needs improvement.

### Time to Completion

How long does it take an agent to complete a standard task? This metric, combined with token efficiency, reveals whether agent difficulties are due to complexity (legitimate long tasks) or friction (unnecessary retries and exploration).

## Implementation Details

The AEO tracking pipeline processes millions of events daily:

1. **Ingestion**: Raw events from Sandbox, AI Gateway, and Workflows are collected in a unified event stream
2. **Enrichment**: Events are enriched with agent identification, workflow context, and user account data
3. **Aggregation**: Events are aggregated into agent sessions, workflow completions, and metric time series
4. **Storage**: Aggregated data feeds both real-time dashboards and long-term analytical storage
5. **Analysis**: Automated anomaly detection flags sudden changes in agent behavior or success rates

## Dashboards and Alerting

Vercel built purpose-specific dashboards for AEO:

- **Agent health dashboard**: Real-time view of agent success rates, error rates, and active sessions
- **Workflow funnel**: Visualizes where agents drop off in multi-step workflows, similar to a marketing conversion funnel
- **Documentation effectiveness**: Tracks which documentation pages agents access most and whether access correlates with task success
- **Alert rules**: Automated alerts when agent success rates drop below thresholds, when new error patterns emerge, or when token consumption spikes unexpectedly

## How AEO Insights Improve Product Development

AEO tracking isn't just monitoring—it's a product development feedback loop:

- **API design**: When agents struggle with an API, it often reveals design issues that human users work around silently. Fixing these improves the experience for everyone.
- **Documentation**: Agent interaction data reveals exactly which documentation is useful and which is confusing. Pages that agents repeatedly visit without successfully completing their task need rewriting.
- **Error messages**: Generic error messages that humans can interpret through context are useless to agents. AEO data drives investment in structured, machine-parseable error responses.
- **Rate limiting**: Traditional rate limits designed for human usage patterns don't account for agent burst behavior. AEO data informs agent-aware rate limiting policies.

## The Bigger Picture

AEO tracking represents a fundamental shift in how platforms think about their users. As AI agents become the primary interface between developers and tools, optimizing for agent experience is optimizing for developer experience. Vercel's investment in AEO tracking isn't just about understanding current agent behavior—it's about building the infrastructure to support a future where agents are first-class platform citizens.
