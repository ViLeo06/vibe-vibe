---
title: "My Vibe Coding Experience: From Executor to Decision-Maker"
---

# My Vibe Coding Experience: From Executor to Decision-Maker

> Written for experienced developers — this is about using AI as an efficiency multiplier when you already have strong engineering skills.

## Background

I'm a backend developer with years of experience building distributed systems, databases, and APIs. When AI coding assistants emerged, I didn't see them as replacements — I saw them as the most powerful development tool since the IDE.

My recent project — a **streaming media file management system** — was built with approximately **99% AI-generated code** and **1% hand-written code**. Not because I couldn't write it myself, but because my time is better spent on architecture and decisions than on typing boilerplate.

Here's the methodology that made that possible.

## Core Methodology 1: Scheme First, Implementation Second

The biggest mistake developers make with AI tools is jumping straight to "write me the code." That's like asking a contractor to start building before the blueprints are done.

My workflow follows a strict sequence:

### Step 1: Generate the Data Model

Before any code, I describe the domain and have the AI generate the complete data model — entities, relationships, constraints, indexes. I review this carefully because everything downstream depends on it.

This is where engineering experience matters most. The AI generates a reasonable model, but I know which fields will be queried together, where we'll need indexes, what the access patterns look like at scale. I reshape the model based on that knowledge.

### Step 2: AI Generates Three-Layer Code

With the data model locked, I have the AI generate code in layers:

1. **DAO layer** — Database access objects, queries, CRUD operations
2. **Service layer** — Business logic, validation, orchestration
3. **Controller layer** — API endpoints, request/response handling

Each layer is generated separately, reviewed, and approved before moving to the next. This mirrors how a well-run team operates — you don't write controllers before the service layer is stable.

### Step 3: AI Generates API Documentation

From the controller layer, the AI generates OpenAPI/Swagger documentation. This serves dual purpose: it's the contract for any frontend work, and it's a validation step — if the API docs don't make sense to me as a consumer, the API design needs revision.

### Step 4: Frontend Pages

With documented APIs, generating frontend pages becomes mechanical. The AI has a clear contract to build against, so the output is predictable and consistent.

### Step 5: End-to-End Testing

Finally, the AI generates integration tests that exercise the full stack. I run these, review failures, and iterate.

### Why This Works

Think of it like AI image generation. You don't type "draw something cool." You describe the scene in detail — the composition, lighting, mood, style — and then the AI generates from that description. Code generation works the same way: **describe the architecture first, then generate the implementation from the architecture.**

The architecture document is your "prompt" for the entire codebase.

## Core Methodology 2: Small Steps, Continuous Advancement

A streaming media file management system has dozens of features: upload, transcode, thumbnail generation, search, permissions, streaming playback, bandwidth management, and more. Trying to build everything at once — even with AI — is a recipe for an incoherent codebase.

### Break Into Independent Tasks

Each feature becomes its own task with clear boundaries:

- **Task**: Implement file upload with chunked upload support
- **Task**: Add FFmpeg-based transcoding pipeline
- **Task**: Build thumbnail generation for video files
- **Task**: Implement full-text search on file metadata

Tasks should be independent enough that completing one doesn't require modifying another. This is good software engineering regardless of whether humans or AI write the code.

### Maintain a Fractal Documentation Structure

This is the key innovation in my workflow. I maintain a **living documentation structure** that grows with the project:

```
docs/
├── architecture.md          ← High-level system design
├── data-model.md            ← Current entity definitions
├── api/
│   ├── upload.md            ← Upload API contract
│   ├── transcode.md         ← Transcoding API contract
│   └── search.md            ← Search API contract
├── decisions/
│   ├── 001-chunked-upload.md    ← Why chunked upload
│   ├── 002-ffmpeg-over-gstreamer.md  ← Transcoding choice
│   └── 003-meilisearch.md      ← Search engine selection
└── status.md                ← Current state of each feature
```

Before each AI coding session, I feed the relevant documentation as context. The AI doesn't have persistent memory across sessions, but my documentation serves as that memory. Each session picks up exactly where the last one left off.

### Validate Each Step

After every task:

1. Run the existing test suite — nothing should break
2. Run the new feature's tests — everything should pass
3. Manual smoke test — does it actually work?
4. Update the documentation — what changed?

This discipline prevents the codebase from degrading over time. Each step leaves the project in a working state.

## The Critical Pitfall: Infinite Debug Loops

This is the one thing that almost derailed the project, and it's something every developer using AI tools needs to understand.

### What Happens

You hit a bug. You describe it to the AI. The AI suggests a fix. You apply it. The fix introduces a new bug — or doesn't fix the original. You describe the new state. The AI suggests another fix. Apply. New bug. Describe. Fix. Apply. Bug.

You've entered an **infinite debug loop**.

### Why It Happens

AI coding assistants have two fundamental limitations that cause this:

1. **No metacognition** — The AI doesn't realize it's going in circles. It treats each message as a fresh problem, so it doesn't notice that its last three "fixes" all made things worse.

2. **No persistent memory** — Within a long debugging session, the AI loses track of what was already tried. It may suggest reverting to an approach you already proved doesn't work.

The result: the AI builds on an ever-growing stack of errors, each "fix" compounding the confusion rather than resolving the root cause.

### The Solution

When you notice repeated failures (my rule of thumb: three failed attempts at the same bug), stop and:

1. **Step back** — Stop feeding the AI more error messages
2. **Do root cause analysis yourself** — Use your engineering knowledge. Read the stack trace. Understand the actual flow. Identify the real issue.
3. **State the root cause to the AI** — Don't say "it's still broken." Say "The issue is that the WebSocket connection is being closed by the proxy because we're not sending ping frames within the 60-second timeout. Add a ping/pong heartbeat mechanism with a 30-second interval."
4. **Let the AI regenerate from the correct diagnosis** — With a clear root cause, the AI produces a correct fix on the first try almost every time.

The pattern is: **human diagnosis, AI implementation**. This is where engineering experience becomes irreplaceable — not in writing the code, but in understanding why the code fails.

## Key Insight: The Steering Wheel Must Stay in Human Hands

AI-generated code isn't inherently worse than human-written code. In many cases, it's more consistent, better documented, and follows patterns more reliably. But AI lacks judgment about your specific system, your users, your constraints.

The role shift is profound:

| Before AI | With AI |
|---|---|
| You write code | You review code |
| You debug line by line | You diagnose root causes |
| You are the executor | You are the decision-maker |
| Your value is typing speed | Your value is engineering judgment |

This is why experienced developers benefit enormously from AI tools. Not because the tools are harder to use (they're not), but because **the ability to make good decisions about code is more valuable when code is cheap to produce**.

Your engineering experience didn't become obsolete. It became the most important part of the workflow.

## Summary

1. **Scheme first**: Generate architecture documents before generating code. The docs are your "prompt" for the entire system.
2. **Small steps**: Break features into independent tasks with clear boundaries. Validate after each one.
3. **Living documentation**: Maintain a documentation structure that serves as persistent memory across AI sessions.
4. **Break debug loops early**: When the AI starts circling, stop, diagnose the root cause yourself, and hand the AI a clear problem statement.
5. **Stay in the driver's seat**: AI generates. You decide. That's the optimal division of labor.
