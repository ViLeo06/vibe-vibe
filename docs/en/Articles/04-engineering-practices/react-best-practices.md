---
title: "React Best Practices: Vercel's 10+ Years of Performance Optimization"
description: Vercel packages 10+ years of React and Next.js performance optimization knowledge into a structured repository, optimized for AI agents and LLMs, covering 40+ rules on eliminating waterfalls, reducing bundle size, and more
author: Shu Ding, Andrew Qu
source: https://vercel.com/blog/introducing-react-best-practices
date: '2026-01-14'
category: 04-engineering-practices
tags:
  - Vercel
  - React
  - Next.js
  - Performance
  - Best Practices
---

# React Best Practices: Vercel's 10+ Years of Performance Optimization

> Original article: [Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices) by Shu Ding, Andrew Qu

## Why a Structured Best Practices Repository?

Performance knowledge for React and Next.js has historically been scattered across blog posts, conference talks, GitHub issues, and tribal knowledge within teams. A developer trying to optimize their app had to piece together advice from dozens of sources, often finding contradictory or outdated guidance.

Vercel's React Best Practices repository changes this. It packages over a decade of performance optimization knowledge into a structured, machine-readable format that both humans and AI agents can consume effectively. The key insight is that AI coding agents need structured guidance—not scattered blog posts—to consistently produce optimized code.

## The Repository Structure

The repository is organized around a hierarchy: **rules → examples → tests**.

Each rule follows a consistent format:

- **Rule name and ID**: A concise identifier for referencing (e.g., `eliminate-client-server-waterfalls`)
- **Description**: What the rule addresses and why it matters
- **Bad example**: Code that violates the rule, with annotations explaining the problem
- **Good example**: The corrected version, with annotations explaining the improvement
- **Impact**: Expected performance improvement (quantified where possible)
- **References**: Links to deeper explanations

This structure isn't just for human readability. It's designed so that AI agents can parse the rules, understand the patterns, and apply them during code generation and review.

## Key Areas Covered

The 40+ rules are organized into high-impact categories:

### Eliminating Waterfalls

Waterfall requests—where data fetching is sequential rather than parallel—are the single biggest performance killer in React applications. The repository covers:

- Identifying client-server waterfalls (component mounts → fetch → child mounts → fetch)
- Using Server Components to move data fetching to the server
- Parallel data fetching with `Promise.all` and React's built-in request deduplication
- Preloading data with `preload` patterns to eliminate sequential fetches
- Streaming with Suspense to show progressive UI while data loads

### Reducing Bundle Size

Shipping less JavaScript directly improves Time to Interactive:

- Moving components to Server Components when they don't need interactivity
- Dynamic imports with `next/dynamic` for heavy client components
- Analyzing and eliminating unused dependencies
- Tree-shaking best practices and barrel file anti-patterns
- Font and image optimization patterns

### Optimizing Re-renders

Unnecessary re-renders waste CPU and create janky UIs:

- Composition patterns over `React.memo` (lifting state up, children as props)
- Proper hook dependency arrays
- State colocation—keeping state close to where it's used
- Context splitting to prevent broad re-renders
- Using `useMemo` and `useCallback` judiciously (not everywhere)

### Server Components Patterns

React Server Components represent the biggest architectural shift in React's history:

- When to use Server vs Client Components
- The `"use client"` boundary and its implications for the component tree
- Passing server data to client components via props (not fetching again)
- Composing Server and Client Components effectively
- Avoiding common mistakes like importing server-only modules in client code

### Streaming and Suspense

Progressive loading dramatically improves perceived performance:

- Wrapping slow data sources in Suspense boundaries
- Loading UI patterns (skeletons, spinners, progressive content)
- Nested Suspense for granular loading states
- Error boundaries paired with Suspense for resilient UIs

## Integration with AI Agents

The repository is designed as an AI-native knowledge source:

- **Skills for Claude Code**: The rules can be loaded as a Skill, giving Claude Code structured guidance on React performance during code generation and review.
- **AGENTS.md integration**: Teams can reference specific rules in their AGENTS.md files, telling AI agents which optimizations matter most for their project.
- **Structured for RAG**: The consistent rule format makes the repository ideal for retrieval-augmented generation, where AI agents pull relevant rules based on the code they're writing.

When an AI agent has access to these rules, the output quality improves measurably. Instead of generating React code that "works," it generates React code that works *fast*.

## Common Anti-Patterns and Fixes

Some examples of high-impact rules:

**Anti-pattern**: Fetching data in `useEffect` inside a client component that's nested three levels deep.
**Fix**: Move the data fetching to a Server Component at the route level and pass data down as props.

**Anti-pattern**: Using a barrel file (`index.ts`) that re-exports everything from a large component library.
**Fix**: Import directly from the component file to enable tree-shaking.

**Anti-pattern**: Wrapping every component in `React.memo` as a performance "optimization."
**Fix**: Use composition patterns—restructure the component tree so that re-renders don't propagate unnecessarily in the first place.

## How to Adopt Incrementally

You don't need to apply all 40+ rules at once. The repository suggests an adoption path:

1. **Start with waterfalls**: These have the highest performance impact and are the easiest to measure. Audit your network tab for sequential request chains.
2. **Move to bundle size**: Analyze your build output. Identify the largest client-side chunks and look for Server Component opportunities.
3. **Then tackle re-renders**: Use React DevTools Profiler to identify components that re-render excessively.
4. **Adopt continuously**: As you write new features, apply the rules from the start. Retrofitting is harder than building correctly.

The structured format means you can also selectively load only the rules relevant to your current work—waterfall rules when building data-heavy pages, bundle rules when optimizing for mobile, re-render rules when building interactive UIs.

## Why This Matters

Performance isn't a feature—it's a baseline expectation. Users leave slow sites. Search engines penalize them. And with AI agents writing an increasing share of production code, ensuring those agents have access to performance best practices isn't optional—it's infrastructure.

Vercel's React Best Practices repository turns hard-won optimization knowledge into a reusable, AI-consumable asset. Whether you're a human developer looking for guidance or an AI agent generating code, the rules provide a shared standard for what "good React code" looks like in 2026.
