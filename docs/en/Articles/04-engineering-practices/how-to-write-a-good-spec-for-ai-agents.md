---
title: How to Write a Good Spec for AI Coding Agents
description: Learn how to write truly effective specifications for AI coding agents to improve clarity, focus, and productivity in AI-driven development workflows
author: Addy Osmani
source: https://addyosmani.com/blog/good-spec/
date: '2026-03-07'
category: 04-engineering-practices
tags:
  - Coding Agents
  - Specification Writing
  - Prompt Engineering
  - AI Development
  - Requirements
---

# How to Write a Good Spec for AI Coding Agents

> Original article: [How to Write a Good Spec for AI Coding Agents](https://addyosmani.com/blog/good-spec/) by Addy Osmani

## Why Specs Matter More Than Ever

In traditional development, a vague spec meant a developer would fill in the gaps with their own judgment—sometimes well, sometimes poorly. With AI coding agents, a vague spec means the AI fills in the gaps with statistical averages from its training data. The result is code that's technically functional but may not match your actual needs.

Good specs have always been important. With AI agents, they're essential. The quality of your spec directly determines the quality of the AI's output—far more than the sophistication of the AI model itself.

## Five Principles for Effective AI Specs

### 1. Start with High-Level Vision, Let AI Expand the Details

Don't try to specify every implementation detail. Instead, paint a clear picture of what you're building and why. AI agents are excellent at expanding high-level intent into detailed implementation—that's what they're designed to do.

**Bad spec**: "Create a React component with useState for email and password, add a form with two inputs and a button, validate email with regex /^[a-zA-Z0-9...]/, call the auth API on submit..."

**Good spec**: "Build a login form that collects email and password, validates inputs on the client side, submits to our auth API at /api/auth/login, and handles loading/error/success states. Follow the existing form patterns in our codebase."

The good spec communicates intent and constraints while leaving implementation decisions to the AI, which has access to your codebase and knows the current best practices.

### 2. Use PRD Structure with Six Key Fields

For larger features, structure your spec as a lightweight PRD (Product Requirements Document) with these six fields:

- **Objective**: What are we building and why? One or two sentences max.
- **User Stories**: Who uses this and what do they need? Use "As a [role], I want [capability] so that [benefit]" format.
- **Acceptance Criteria**: How do we know it's done? Specific, testable conditions.
- **Technical Constraints**: What must we work within? Framework versions, API contracts, performance budgets, existing patterns.
- **Out of Scope**: What are we explicitly not building? This prevents AI from over-engineering.
- **Edge Cases**: What unusual situations must be handled? Empty states, error cases, concurrent access, large datasets.

This structure gives AI agents exactly the information they need: what to build, for whom, how to verify success, what constraints to respect, what to ignore, and what could go wrong.

### 3. Write Modular Prompts

Break complex features into modular specs that can be implemented independently. Each module should have:

- A clear boundary (what's in scope for this piece)
- Defined inputs and outputs (how it connects to other pieces)
- Independent testability (how to verify it works in isolation)

This approach works with how AI agents operate. They perform better on focused, well-scoped tasks than on sprawling, interconnected ones. It also makes review easier—you can verify each piece independently before moving on.

### 4. Include Self-Checks and Constraints

Tell the AI how to verify its own work. This is one of the most powerful spec techniques:

- "After implementing, run the existing test suite and fix any failures."
- "The component must render correctly at viewport widths of 320px, 768px, and 1440px."
- "API response time must stay under 200ms for the test dataset."
- "No new TypeScript errors or lint warnings should be introduced."

Self-checks turn the AI from a code generator into a code generator with a built-in quality gate.

### 5. Bake in Continuous Testing

Every spec should include testing expectations:

- What types of tests are needed (unit, integration, e2e)?
- What coverage is expected for the new code?
- Are there existing test patterns to follow?
- Should tests be written before, during, or after implementation?

AI agents that run tests as part of their workflow catch more issues before submission. Making testing expectations explicit in the spec ensures the AI includes testing in its plan.

## The Curse of Instructions

There's a counterintuitive danger in spec writing: **over-specifying hurts**. When you dictate every implementation detail, you remove the AI's ability to apply its knowledge of best practices, your codebase's patterns, and current library APIs.

Over-specification manifests as:

- Prescribing specific variable names and function signatures for internal code
- Dictating the exact order of operations when it doesn't matter
- Specifying library versions when the AI has access to your lockfile
- Writing pseudo-code that the AI simply translates rather than designs

The cure is to specify **what** and **why**, not **how**. Specify the interface (what goes in, what comes out, what the constraints are) and let the AI determine the implementation.

## Three-Tier Boundary System

One of the most effective spec techniques is defining explicit boundaries for the AI's autonomy:

### ✅ Always (Do Without Asking)

Things the AI should handle automatically:
- Follow existing code style and conventions
- Add appropriate error handling
- Include TypeScript types
- Write tests for new functions
- Use existing utility functions and helpers

### ⚠️ Ask First (Propose Before Doing)

Things the AI should plan before executing:
- Creating new files or directories
- Adding new dependencies
- Changing public API interfaces
- Modifying database schemas
- Altering build configuration

### 🚫 Never (Hard Boundaries)

Things the AI must not do:
- Delete existing tests without explanation
- Change authentication or authorization logic without explicit request
- Modify production environment configuration
- Remove accessibility features
- Bypass type checking with `any` or `@ts-ignore`

This three-tier system gives the AI clear rails to operate within, reducing the need for back-and-forth while preventing unwanted changes.

## Good vs. Bad Specs: Examples

**Bad**: "Add search to the app."

**Good**: "Add a search feature to the products page (/products). Users should be able to search by product name and description. Use debounced input (300ms) to avoid excessive API calls. The search endpoint is GET /api/products?q={query}. Show a loading spinner during search, display 'No results found' for empty results, and handle API errors gracefully. Follow the existing list/filter pattern in src/components/ProductList.tsx."

**Bad**: "Make the dashboard faster."

**Good**: "The dashboard at /dashboard currently takes 4.2s to load (measured via Lighthouse). The main bottleneck is the analytics widget that fetches all-time data on mount. Optimize by: (1) adding pagination to the analytics API, (2) implementing skeleton loading states for each widget, (3) lazy-loading the charts below the fold. Target: under 2s LCP. Don't change the dashboard layout or existing functionality."

## How Specs Evolve as Projects Grow

Early in a project, specs need to be more detailed because the AI doesn't have much codebase context. As the project grows and patterns are established, specs can become more concise:

- **Early stage**: "Build a data table component with sorting, filtering, and pagination. Use Tanstack Table for the table logic. Style with Tailwind CSS. Follow the component pattern in src/components/Button.tsx for the file structure."
- **Later stage**: "Add a data table to the orders page. Same pattern as the products table, but with columns for order ID, customer, total, status, and date. Add a status filter dropdown."

The later spec is shorter because it can reference existing patterns. This is one reason why consistent architecture matters—it compounds the effectiveness of future specs.

## Common Spec Mistakes

### Too Vague

"Build a user management system." This gives the AI no constraints, no scope boundaries, and no acceptance criteria. The result will be something functional but probably not what you wanted.

### Too Detailed

A 500-line spec that dictates every function name, every CSS class, and every database column. This wastes the AI's pattern-matching capabilities and makes the spec harder to maintain than the code.

### Missing Acceptance Criteria

"Build a checkout flow." How do we know it's done? What payment methods? What validation? What happens on failure? Without acceptance criteria, you'll cycle through revisions as you discover requirements you forgot to mention.

### Assuming Context

"Fix the bug in the cart." Which bug? What's the expected behavior? What's the actual behavior? How do you reproduce it? AI agents need context explicitly stated, not implied.

### Ignoring Non-Functional Requirements

"Build the API endpoint." What about rate limiting? Input validation? Response time requirements? Error format? API versioning? The functional requirements are often obvious; the non-functional ones are where bugs hide.

Writing good specs is a skill, and like all skills, it improves with practice. Start with the five principles, use the three-tier boundary system, and iterate based on what produces the best results with your AI agent of choice. The investment in spec quality pays dividends in code quality.
