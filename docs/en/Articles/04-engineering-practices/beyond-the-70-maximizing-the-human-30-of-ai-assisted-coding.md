---
title: "Beyond the 70%: Maximizing the Human 30% of AI-Assisted Coding"
description: Why enduring human skills remain critical in the age of AI-assisted programming
author: Addy Osmani
source: https://addyo.substack.com/p/beyond-the-70-maximizing-the-human
date: '2026-03-07'
category: 04-engineering-practices
tags:
  - AI-Assisted Programming
  - Software Engineering
  - Human Skills
  - Architecture
  - Code Review
---

# Beyond the 70%: Maximizing the Human 30% of AI-Assisted Coding

> Original article: [Beyond the 70%: Maximizing the Human 30% of AI-Assisted Coding](https://addyo.substack.com/p/beyond-the-70-maximizing-the-human) by Addy Osmani

## The 70/30 Split

A pattern has emerged across teams using AI coding assistants: AI can reliably handle roughly 70% of routine coding tasks. The remaining 30% requires human judgment, creativity, and domain expertise that AI can't replicate—at least not yet.

Understanding what falls into each bucket, and optimizing how you spend your time in the 30%, is the key to maximizing your effectiveness as an AI-assisted developer.

## What's in the 70%

The 70% that AI handles well is characterized by predictability, established patterns, and abundant training data:

### Boilerplate Code

Setting up project structures, configuration files, build scripts, CI/CD pipelines. AI excels here because these tasks follow well-documented patterns with little room for creative interpretation.

### CRUD Operations

Create-Read-Update-Delete endpoints, form handling, data validation, database queries for standard operations. These are the bread and butter of most web applications, and AI generates them quickly and correctly.

### Standard Patterns

Authentication flows, pagination, sorting, filtering, caching implementations, logging setup. Patterns that have been implemented millions of times in public codebases are AI's sweet spot.

### Test Scaffolding

Generating test boilerplate, creating test fixtures, writing straightforward unit tests for deterministic functions. AI is particularly good at generating the repetitive parts of test suites.

### Documentation

API documentation, JSDoc comments, README files, inline code comments for straightforward logic. AI generates serviceable documentation quickly.

### Code Transformations

Refactoring, migrating between frameworks, converting between languages, updating deprecated APIs. Pattern-based transformations are mechanical work that AI handles efficiently.

## What's in the 30%

The 30% that requires human judgment is characterized by ambiguity, trade-offs, and consequences:

### Architecture Decisions

Where to draw service boundaries. Whether to use a monolith or microservices. How to structure the data model for a domain that doesn't map cleanly to CRUD. Which trade-offs to accept between consistency and availability. These decisions shape the entire system and have long-lasting consequences that AI can't fully evaluate.

### Edge Case Handling

AI handles the happy path well. But what happens when the payment processor times out mid-transaction? When a user uploads a 2GB file to a field expecting a profile photo? When two users edit the same document simultaneously? Edge cases require understanding the real-world context that the code operates in—context that isn't in the codebase.

### Performance Optimization

AI can write code that works, but writing code that works *fast* under real-world load requires understanding your specific performance profile. Which queries are slow? Where are the memory bottlenecks? What's the access pattern? Performance optimization requires measurement, hypothesis, and iterative tuning—a fundamentally human process.

### Security Review

Security isn't about following a checklist (AI can do that). It's about thinking adversarially: how could this code be exploited? What assumptions does it make that an attacker could violate? Security review requires a paranoid mindset that goes beyond pattern matching.

### UX Judgment

Does this flow make sense to users? Is the error message helpful or confusing? Should this be a modal or a new page? UX judgment requires empathy with end users and an understanding of human behavior that goes beyond what AI can infer from code patterns.

### Requirement Interpretation

Translating vague stakeholder requests into precise technical requirements. "Make it faster" could mean reduce page load time, improve perceived performance, optimize database queries, or add caching. Understanding what people actually need—versus what they say they need—is a deeply human skill.

## Why the 30% Matters More Than Ever

Here's the counterintuitive insight: as AI handles more of the routine work, the human 30% becomes *more* important, not less.

**Errors multiply at scale.** When AI generates code at 10x the speed of manual coding, a flawed architecture decision doesn't just affect one component—it propagates through the entire codebase at 10x speed. A security oversight in a pattern that AI replicates across 50 endpoints creates 50 vulnerabilities, not one.

**The leverage is asymmetric.** Getting the 70% right produces working software. Getting the 30% right produces *good* software—software that's maintainable, secure, performant, and pleasant to use. The difference between mediocre and excellent software lives almost entirely in the 30%.

**AI amplifies both good and bad decisions.** If your architecture is sound, AI will generate clean, consistent code that fits the architecture. If your architecture is flawed, AI will generate code that efficiently implements the flawed design. AI is an amplifier, not a corrector.

## How to Maximize Your Human Leverage

### Focus on Requirements Clarity

The single highest-leverage activity is getting requirements right. A clear, complete specification lets AI generate correct code on the first pass. A vague specification produces code that technically works but misses the point. Invest time upfront in understanding what you're building and why.

### Invest in Architecture Quality

Before asking AI to generate code, design the architecture. Define the boundaries, the interfaces, the data flow. Write the types and interfaces yourself if possible—they serve as contracts that guide AI generation. A well-designed architecture makes every AI interaction more productive.

### Go Deep on Review

Don't just check that AI-generated code works. Ask: Is this the right approach? Are there edge cases it missed? What assumptions is it making? Would this scale? Is this testable? Deep review is where human judgment adds the most value.

### Question the Defaults

AI tends to generate conventional solutions. Sometimes conventional is exactly right. But sometimes the problem calls for an unconventional approach—a denormalized data model for read-heavy workloads, a non-standard caching strategy, an unusual component architecture. Knowing when to deviate from convention requires experience and judgment.

## Practical Workflow: Let AI Draft, Human Review Critically, Iterate

The most effective workflow treats AI as a prolific but junior collaborator:

1. **Define**: Clearly articulate what you need, including edge cases, constraints, and non-functional requirements.
2. **Generate**: Let AI produce the initial implementation.
3. **Review critically**: Don't just check for bugs. Evaluate the approach, the architecture, the trade-offs.
4. **Challenge**: Ask "what about X?" for each edge case, failure mode, and performance scenario.
5. **Iterate**: Refine the implementation based on your review. Use AI to make the changes, but direct the changes yourself.
6. **Verify**: Test thoroughly, including edge cases that the happy path doesn't cover.

## The "AI Speed Trap"

There's a dangerous failure mode in AI-assisted development: **going fast in the wrong direction**. AI makes it incredibly easy to generate large amounts of code quickly. This feels productive. But if the direction is wrong—wrong architecture, wrong abstraction, wrong approach—all that speed just means you arrive at the wrong destination faster.

The AI speed trap manifests as:

- Generating a complete feature before validating the approach with stakeholders.
- Building elaborate abstractions that turn out to be unnecessary.
- Implementing a complex solution when a simple one would suffice.
- Scaling a flawed pattern across the codebase before discovering the flaw.

The antidote is intentional slowness at decision points. Move fast on implementation (the 70%), but move deliberately on decisions (the 30%). Pause to think before you prompt. Validate your direction before accelerating.

The developers who thrive in the AI era won't be the fastest coders. They'll be the ones who best understand where human judgment matters, and who invest their energy there. The 30% is where the real engineering happens—make it count.
