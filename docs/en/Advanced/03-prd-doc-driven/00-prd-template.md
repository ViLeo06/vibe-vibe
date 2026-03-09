---
title: "3.0 PRD Template"
description: "A ready-to-copy product requirements document template"
chapter: "Chapter 3"
---

# 3.0 PRD Template

> - A PRD template you can copy and use right away


---

# [Product/Feature Name] - Product Requirements Document (PRD)

# 0. Document Information

### 0.1 Document Status

- **Current Version**: `[e.g.: Draft 5.1]`
- **Current Stage**: `[e.g.: Requirements Review / UI Design in Progress / In Development / Launched]`
- **Created By**: `[Your Name]`
- **Creation Date**: `[YYYY-MM-DD]`
- **Last Updated**: `[YYYY-MM-DD]`
- **Key Stakeholders**: `[Names of leads from key roles such as product, engineering, design, testing, business, etc.]`

### 0.2 Revision History

*Following the "three-stage iteration" principle, clearly document the evolution of the document so team members can understand how the requirements have changed over time.*

| Version | Version Status | Updated By | Update Date | Core Updates                                       |
| ------ | ---------- | ------ | ---------- | -------------------------------------------------- |
| 1.1    | Initial Requirements Draft | [Name] | YYYY-MM-DD | Initial description of the requirement background, goals, and core value |
| 2.1    | Solution Review Draft | [Name] | YYYY-MM-DD | Added the core business flow, feature flowcharts, and prototype interaction notes |
| 2.2    | Solution Review Draft | [Name] | YYYY-MM-DD | Revised the logic of Feature XX based on suggestions from the project review meeting |
| 3.1    | Development Handoff Draft | [Name] | YYYY-MM-DD | Incorporated the final UI design, added edge cases, tracking plan, and launch plan |
| ...    | ...        | ...    | ...        | ...                                                |

### 0.3 Related Documents

*List all reference materials related to this project for easy access by team members.*

- **Market Research Report**: `[Link]`
- **Competitive Analysis Document**: `[Link]`
- **User Research/Interview Notes**: `[Link]`
- **Project Proposal (if applicable)**: `[Link]`
- **Interactive Prototype (Figma/Axure, etc.)**: `[Link]`
- **UI Design Files (MasterGo/Figma, etc.)**: `[Link]`
- **Analytics Tracking Requirements Document (if maintained separately)**: `[Link]`
- **Technical Solution Design Document**: `[Link]`

### 0.4 Glossary

*Explain any technical terms in the document that may be ambiguous or unfamiliar to the team.*

| Term            | Definition                                 |
| --------------- | ------------------------------------------ |
| **[e.g.: UGC]** | **[User Generated Content]** |
| **[e.g.: CTR]** | **[Click-Through Rate]**           |
| ...             | ...                                        |

## I. Requirement Background and Goals (Corresponds to the core content of the "Initial Requirements Draft")

### 1.1 Project Overview

*Use one or two sentences to summarize what this product/feature does so readers can quickly form an initial understanding.*

> [Example: This project aims to add an "AI Smart Summary" feature to the XX platform, automatically generating concise summaries for long-form articles to help users understand the main point within 30 seconds.]

### 1.2 Core Problem to Solve (Problem Statement)

*Describe in detail why we are building this requirement. Who are the target users? What specific problems or pain points do they encounter, and in what scenarios? What negative impact do these problems cause?*

- **Target User Profiles**: [Describe the characteristics of 1–3 core user groups, for example: knowledge workers, college students, content creators, etc.]
- **User Scenario**: [Describe when, where, and in what context users will use our product]
- **Core Pain Points**:
  1. **Pain Point 1**: [Example: Information overload. Users need to read a large number of industry reports every day, but they have limited time and cannot read everything in depth, causing them to miss key information.]
  2. **Pain Point 2**: [Example: Low reading efficiency. For articles that are not in the user's native language or are highly specialized, the barrier to understanding is high and reading takes a long time.]
  3. **Pain Point 3**: [...]

### 1.3 User Stories

*Describe specific requirements from the user's perspective using the format: "As a `<role>`, I want to `<complete a task>`, so that I can `<achieve a value>`."*

- **Story 1**: As a **content operations specialist**, I want to **generate a summary for long-form articles with one click**, so that I can **quickly create social media copy and improve work efficiency**.
- **Story 2**: As a **general reader**, I want to **quickly preview the core points of an article before reading**, so that I can **decide whether it's worth spending time reading in depth**.
- **Story 3**: [...]

### 1.4 Project Goals and Value

*Explain the business value and user value of this project, and what specific goals we expect to achieve.*

- **User Value**: [What benefits does this feature provide to users? For example: save reading time, improve information access efficiency, etc.]
- **Business Value**: [What benefits does this feature provide to the company? For example: increase user activity, improve retention, build a technical moat, etc.]
- **Project Goals (SMART Principle)**:
  - **[S] Specific**: [Example: After launch, the usage rate of Feature XX reaches XX%]
  - **[M] Measurable**: [Example: Track feature click-through rate, summary generation success rate, user satisfaction score, etc. through analytics tracking]
  - **[A] Achievable**: [Based on existing resources and technical capabilities, this goal is attainable]
  - **[R] Relevant**: [This goal aligns with the company's strategic direction of "improving user efficiency"]
  - **[T] Time-bound**: [To be achieved within 3 months after launch]

### 1.5 Scope

*Clearly define what is included and excluded in this iteration to manage team expectations effectively and avoid scope creep.*

- **In-Scope**:
  1. [Feature Point 1]
  2. [Feature Point 2]
  3. ...
- **Out-of-Scope**:
  1. [Feature point not included this time, but may be considered in the future 1]
  2. [Feature point not included this time, but may be considered in the future 2]
  3. ...

### 1.6 Requirements List

*Break down high-level requirements into specific requirement items and prioritize them.*

| Requirement ID | Module     | Requirement Description                               | Priority | Status   | Notes         |
| ------ | -------- | -------------------------------------- | ------ | ------ | ------------ |
| R001   | Summary Generation | Users can click the "Generate Summary" button on the article page     | **High** | Planned | Core feature     |
| R002   | Summary Display | The generated summary is displayed as a card at the top of the article     | **High** | Planned |              |
| R003   | User Feedback | Users can rate the summary quality with "Like" or "Dislike" | **Medium** | Planned | Used for model iteration |
| R004   | Copy & Share | Users can copy the summary content with one click or share it with friends   | **Medium** | Planned | Improve shareability   |
| R005   | History | Users can view previously generated summaries in the personal center   | **Low** | Planned | Consider for V2.0     |
| ...    | ...      | ...                                    | ...    | ...    |              |

## II. Solution Overview (Corresponds to the core content of the "Solution Review Draft")

*This section aims to introduce the product solution from a high-level perspective so the team can clearly understand the overall product structure and flow.*

### 2.1 Core Business Flowchart (Business Flow)

*Describe the complete process by which users complete the core task through a series of actions, reflecting the business logic.*

```mermaid
graph TD
    A[User enters the article detail page] --> B{Has a summary already been generated for the article?};
    B -- Yes --> C[Display the summary directly];
    B -- No --> D[User clicks the "Generate Summary" button];
    D --> E[System calls the AI model];
    E --> F{Generation successful?};
    F -- Yes --> G[Display the summary card at the top of the page];
    G --> H[User reads the summary];
    F -- No --> I[Prompt the user with "Generation failed, please try again"];
    H --> J(User performs actions such as like/dislike/copy/share);
```

**Caption**: [Add any necessary explanatory notes for the flowchart above]

### 2.2 Core Feature Flowchart (Function Flow)

*Show how the product's main pages and feature modules are organized and connected, reflecting the information architecture.*

> **Caption**: [Add any necessary explanatory notes for the flowchart above]

### 2.3 Information Architecture Diagram (IA)

*Show all information content included in the product, as well as the hierarchy and organizational relationships between them.*

- **Home**
  - Navigation Bar
  - Recommendation List
- **Article Detail Page**
  - Article Content
  - AI Summary Module
  - Comments Section
- **Personal Center**
  - Personal Information
  - History
    - Summary History
  - Settings

## III. Detailed Solution (Corresponds to the core content of the "Development Handoff Draft")

*This section provides the most detailed description of the product solution and serves as the direct basis for the work of engineering, design, and testing teams.*

### 3.1 Feature Details: [Module/Feature Point 1, e.g.: AI Summary Generation and Display]

*Break it down by feature module or page and explain each one individually.*

#### 3.1.1 Page Prototype and Interaction Notes

- **UI Design File**: `[Attach a screenshot or link to the final confirmed UI design for this feature]`
- **Interaction Logic**:
  1. **Initial State**:
     - By default, the summary module is not displayed below the article title.
     - A floating icon button labeled "Generate Summary" appears on the right side of the page.
  2. **Trigger Action**:
     - The user clicks the "Generate Summary" button.
     - The button changes to a loading state labeled "Generating..." with animation and cannot be clicked again.
  3. **Success State**:
     - After loading finishes, the floating button disappears.
     - A summary card expands smoothly below the article title.
     - The card includes: summary text and four action buttons: "Like," "Dislike," "Copy," and "Share."
  4. **Failure State (Network/Service Exception)**:
     - The button returns to the initial "Generate Summary" state.
     - A Toast message appears at the top of the page: "Failed to generate summary. Please check your network and try again."
  5. **Empty State (Article Too Short to Generate a Summary)**:
     - After clicking the button, a Toast message appears at the top of the page: "This article is too short. No summary is needed."
- **Data Requirements**:
  - The frontend needs to pass the current article's `Article_ID` to the backend.
  - The backend returns the summary content `Summary_Text` and summary `Summary_ID`.

#### 3.1.2 Edge Case Handling

- What if the user leaves the page while the summary is being generated? [Define handling logic, e.g.: cancel the generation request]
- What if the user clicks the "Generate Summary" button rapidly and repeatedly? [Define handling logic, e.g.: apply debouncing]
- If the summary content is too long, how should it be displayed in the card? [Define handling logic, e.g.: show up to N lines, expand the rest...]

### 3.2 Feature Details: [Module/Feature Point 2, e.g.: User Feedback]

... (Repeat the structure of 3.1 to describe the next feature point) ...

### 3.3 Non-Functional Requirements

- **Performance Requirements**:
- **Compatibility Requirements**: [Example: Must support the latest two versions of the three major browsers: Chrome, Safari, and Firefox, as well as iOS and Android systems]
- **Data Analytics/Tracking Requirements**:

| Event Name                   | Trigger Timing             | Page/Location           | Reported Parameters                 | Notes                 |
| -------------------------- | -------------------- | ------------------- | ------------------------ | -------------------- |
| `click_generate_summary`   | When the "Generate Summary" button is clicked | Article Detail Page - Floating Button | `article_id`             |                      |
| `summary_generate_success` | When summary generation succeeds       | -                   | `article_id`, `duration` | `duration` is elapsed time (ms) |
| `click_summary_like`       | When the summary "Like" button is clicked   | Article Detail Page - Summary Card | `summary_id`             |                      |

## IV. Launch Plan and Operations

*Define the lifecycle of the requirement and related post-launch plans.*

### 4.1 Launch Timeline (Roadmap)

- **Requirements Review**: `[YYYY-MM-DD]`
- **UI/UX Design**: `[YYYY-MM-DD] ~ [YYYY-MM-DD]`
- **Development Phase**: `[YYYY-MM-DD] ~ [YYYY-MM-DD]`
- **Testing Phase**: `[YYYY-MM-DD] ~ [YYYY-MM-DD]`
- **Expected Launch Date**: `[YYYY-MM-DD]`

### 4.2 A/B Test Plan (if needed)

- **Test Objective**: [Example: Verify whether the new summary card UI can improve the user feedback rate]
- **Experiment Groups**:
  - **Group A (Control Group)**: Use the old UI
  - **Group B (Experiment Group)**: Use the new UI
- **Traffic Allocation**: [Group A 50%, Group B 50%]
- **Core Metric**: [User feedback rate (likes + dislikes / summary impressions)]
- **Launch/Rollback Criteria**: [If Group B significantly outperforms Group A on the core metric and there are no negative indicators, roll out to all users]

### 4.3 Gradual Rollout Plan (if needed)

- **Phase 1**: `[YYYY-MM-DD]`, open to internal employees only.
- **Phase 2**: `[YYYY-MM-DD]`, open to 1% of seed users.
- **Phase 3**: `[YYYY-MM-DD]`, gradually increase traffic to 10%, 50%, and eventually 100%.

## V. Appendix

*Store information here that does not belong in the main body but still provides important reference value for the project.*

- **Meeting Notes**: `[Link]`
- **Raw User Feedback Records**: `[Link]`
- **Q&A**:
  - **Q1: [Question raised by engineering/testing]**
  - **A1: [Answer from the product manager]**