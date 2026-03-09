---
title: "3.2 Confirming Requirements with AI"
description: "Communication techniques to avoid misunderstandings"
chapter: "Chapter 3"
priority: "🔴"
---

# 3.2 Confirming Requirements with AI 🔴

> **After reading this section, you will learn:**
>
> - Understanding AI's blind spots and knowing when to proactively confirm
> - Mastering prompt templates for getting AI to confirm its understanding
> - Learning to use confirmation checklists to verify critical details
> - Mastering prompt techniques for discovering blind spots

> As mentioned in the preface: AI won't necessarily ask about all critical details—you need to proactively ask it to confirm its understanding.

---

## AI's Understanding Blind Spots

AI won't necessarily ask about all critical details. When requirements are ambiguous, it may proactively ask questions, or it may proceed with common patterns. This default handling often doesn't match expectations.

AI's understanding comes from context. The more complete the context, the more accurate the understanding. But context isn't "the more words the better"—it's "the clearer the key information, the better."

This difference stems from how AI works. When you discuss requirements with a human developer, if something is unclear, they'll stop and ask you: "Should this button go in the top-left or top-right corner?" "Can users see this page without logging in?" These questions might feel tedious, but they ensure both sides have aligned understanding. AI sometimes asks questions, but doesn't guarantee it will hit the key points. When requirements are ambiguous, it may make assumptions based on common patterns and start working. If those assumptions happen to match your expectations, great; but if they're wrong, you'll pay more communication costs in subsequent iterations to correct them.

Worse, AI's assumptions are often "reasonable"—the solution it chooses is technically feasible and logically consistent, it just doesn't match your specific needs. This deviation is hard to catch before code generation, because you might not think to confirm those "obvious" details. Only when the code runs and results don't match expectations does the problem surface.

Common sources of understanding deviation:

| Source of Deviation | Resulting Problem |
|---------------------|-------------------|
| Ambiguous user definition | AI guesses target users, may guess wrong |
| Unclear feature boundaries | AI may add features or miss features |
| Unstated technical constraints | AI chooses incompatible technologies |
| Unconsidered edge cases | Generated code lacks error handling |

The core of proactive confirmation is: **Don't wait for AI to ask you—make AI explicitly state its understanding.**

---

## Prompt Template for Confirming Understanding

After each requirements discussion, use this template to have AI confirm its understanding:

> Please confirm you understand my requirements. Reply in this format:
>
> 1. **Target Users**: [who you understand the target users to be]
> 2. **Core Features**: [3-5 core features you understand]
> 3. **Out of Scope**: [features you understand we won't do]
> 4. **Potential Issues**: [areas you think I might not have considered]
>
> If anything is uncertain, please list your questions.

This template's purpose is to make AI explicitly output its understanding for easy item-by-item checking.

When using this template, don't treat it as a formalistic process. Its real value lies in forcing AI to make implicit assumptions explicit. When AI writes "target users are working professionals," you can immediately spot if this understanding is accurate—perhaps you meant "college students," perhaps you meant "freelancers." This explicit comparison leaves misunderstandings nowhere to hide.

Another easily overlooked benefit is that this template actually trains AI to better understand your needs. When you first use it, AI's confirmation may have many deviations; but as you continually correct these deviations, AI gradually learns your preferences and habits, and subsequent understanding becomes increasingly accurate. This is a mutual adaptation process.

### Why This Works

| Just saying "help me do X" | Using confirmation template |
|---------------------------|----------------------------|
| AI understands by guessing | AI must explicitly state understanding |
| Don't know if AI's understanding is correct | Can check AI's understanding item by item |
| Misunderstandings only found during rework | Catch misunderstandings before writing code |

---

## Let AI Proactively Ask Questions

**Don't wait for AI to confirm—let AI proactively ask questions.** After giving requirements, directly tell AI "Based on the current plan, list multiple questions you're uncertain about and ask me to confirm." AI will actively dig out hidden assumptions, and both sides align understanding through multiple rounds of Q&A.

### Why Let AI Proactively Ask Questions

In the traditional "user asks, AI answers" model, users need to discover problems themselves, which requires users to have complete product thinking. But in reality, many details become clear gradually through conversation.

Benefits of letting AI proactively ask questions:

- **AI can discover issues you overlooked** — Based on common patterns in training data, AI knows where ambiguity tends to occur
- **More natural conversation** — Like a discussion, back and forth, gradually going deeper
- **Reduces your cognitive load** — Don't need to think through all details at once

### How to Start

After describing your requirements, simply say:

> "Based on the current plan, list multiple questions you're uncertain about and ask me to confirm"

AI will output a batch of questions (usually 3-5). After you answer each one, AI continues asking follow-up questions based on your answers until both sides are aligned.

### Follow-up Example

**You propose requirements:**

```
You: I want to make a todo list app.
```

**Start follow-up:**

```
You: Based on the current plan, list multiple questions you're uncertain about and ask me to confirm
```

**AI first round of questions:**

```
AI: Okay, based on your requirements, I have several questions:

1. Who are the target users? Personal use or team collaboration?
2. What are the core features? (e.g., add tasks, set deadlines, category tags, etc.)
3. Where is data stored? Local browser or cloud?
4. Do users need to log in? Or is it ready to use out of the box?
5. Is there a mobile requirement? Or just desktop?

Please answer each one, and I'll continue asking about details that need clarification.
```

**After you answer, AI continues asking:**

```
You: 1. Personal use 2. Add/complete/delete tasks, no tags 3. Local storage
    4. No login needed 5. Desktop only

AI: Understood. Based on your answers, I have a few more questions:

1. With local storage, if users clear browser data, will tasks be lost?
   Do we need to handle this risk, or is it acceptable?
2. Are "completed" tasks deleted or kept but marked as completed?
3. Do tasks have deadlines? Or just a simple checklist?

Please confirm these details.
```

**Key insight:** AI continuously digs out new hidden assumptions based on your answers (e.g., "data loss risk," "handling of completed tasks") until all critical details are clear.

### When to Stop Follow-up

Stop when these conditions are met:

1. **AI's understanding completely matches your expectations** — Check item by item, no deviations
2. **All critical details are clear** — No gray areas, no "it depends"
3. **Edge cases have been discussed** — How to handle exceptions, with clear solutions
4. **You yourself feel clear** — Through answering AI's questions, you also have a more complete understanding of your own requirements

At this point you say "No more questions, let's start," and AI can generate solutions or code based on the aligned understanding.

::: tip Follow-up is mutual clarification

When answering AI's questions, you'll also discover details you hadn't considered before. This "only remembered when asked" situation is normal—it's exactly the value of AI follow-up.

:::

### Common Pitfalls

**Pitfall 1: AI's questions are too basic, feel unnecessary to answer**

- Result: Skip key confirmations, understanding deviations remain hidden
- Correct approach: Even for basic questions, give clear answers to eliminate ambiguity

**Pitfall 2: Answer vaguely, let AI "figure it out"**

- Result: AI handles with default approach, doesn't match your specific needs
- Correct approach: Give clear choices, don't say "either is fine" or "you decide"

**Pitfall 3: Impatient, stop after one round of Q&A**

- Result: Deep assumptions not uncovered, higher rework costs later
- Correct approach: Patiently answer multiple rounds of questions until true alignment

---

## Must-Confirm Details Checklist

When having AI confirm, check whether it answers these key questions.

### Users and Scenarios

| Confirmation Item | Why It Matters |
|-------------------|----------------|
| Who are target users | Determines UI complexity, interaction methods |
| What is the usage scenario | Determines technology choices (mobile/desktop) |
| What problem does it solve | Ensures you're building valuable features |

### Core Features

| Confirmation Item | Why It Matters |
|-------------------|----------------|
| Top 3-5 core features | Prevents AI from adding too many features |
| User task completion flow | Ensures AI understands business logic |
| What state changes exist | Affects UI design (loading, success, failure) |

### Out of Scope

| Confirmation Item | Why It Matters |
|-------------------|----------------|
| Which features won't be done this time | Prevents scope creep |
| Which features will never be done | Keeps product focused |

AI tends to "do more"—you must explicitly tell it the boundaries.

This tendency has its roots. In training data, AI has seen many feature-rich applications; it has learned "what a complete product should include." But your need might just be a minimal prototype, or a tool for a specific scenario. Without clear boundaries, AI will default to generating code according to "complete product" standards, resulting in over-engineering.

Clarifying "what not to do" also has a psychological benefit: it forces you to think about what the product's core is. When you list "no login, no cloud sync, no category tags," you're actually confirming what this product's essential value is. This focus is crucial for early-stage products.

### Data and State

| Confirmation Item | Why It Matters |
|-------------------|----------------|
| What data needs to be stored | Determines data structure design |
| Where does data come from | Determines implementation approach |
| How are edge cases handled | Prevents bugs (rapid clicks, network errors, etc.) |

### Technical Constraints

| Confirmation Item | Why It Matters |
|-------------------|----------------|
| Any tech stack limitations? | Affects AI's code choices |
| Which devices need compatibility? | Affects UI implementation |
| Any performance requirements? | Affects technical solutions |

---

## Prompt for Discovering Blind Spots

After discussing requirements, use this prompt to have AI help discover issues:

> Based on our discussion just now, please list:
>
> 1. Edge cases I might not have considered
> 2. Features you think are common but I might not need
> 3. Technical details that need clarification
>
> Please list item by item, and I'll confirm each one.

AI might point out:

- After users delete data, does it need to be recoverable?
- Is there a quantity limit for data lists?
- If users input very long content, how should it display?
- Does it need to work on mobile phones?

These are the overlooked details.

Having AI help you discover blind spots is an efficient approach. As a product owner, you inevitably have some mental models—you'll assume certain things are "obvious," or certain situations "won't happen." AI doesn't have these models; it examines your requirements from a pure logic perspective, pointing out issues you've overlooked because you're too familiar with them.

Of course, not all issues AI points out need to be solved. Some edge cases may indeed rarely occur, not worth the added complexity. But knowing these issues exist lets you make informed trade-offs, rather than taking risks in ignorance.

---

## Solution-First Principle

Before having AI generate complete code, have it generate a solution or architecture first.

Benefits of having AI output a solution first:

- Can discover understanding deviations faster
- Modifying solutions costs less than modifying code
- Ensures overall architecture is sound before diving into details

Outputting a solution first gives you an opportunity to review the overall design. Reviewing a solution document only requires checking whether high-level design is reasonable—easier to spot directional issues than reviewing code directly.

From a cognitive load perspective, solution confirmation also reduces your review difficulty. Reviewing a solution document, you only need to check whether high-level design is reasonable; reviewing code, you need to simultaneously check architectural logic and syntax details. The former makes it easier to discover fundamental misunderstandings; the latter often gets people bogged down in details while missing overall direction problems.

Solution confirmation template:

> Please don't write code yet—first give me the implementation plan:
>
> 1. Data structure design
> 2. Main pages/components and their responsibilities
> 3. Implementation approach for core flows
> 4. Potential technical difficulties

---

<AIConfirmationDemo />

## Comparison: With vs Without Confirmation

### Without Confirmation (Common Mistake)

```
You: Help me make a todo list.
AI: [Generates complex version with login, cloud sync, category tags]
You: Too much, I just want something simple.
AI: [Regenerates, but may have other features you didn't mention]
```

### With Confirmation (Correct Approach)

```
You: Help me make a todo list. Please confirm understanding...
AI: I have some questions... Personal use or team use?
You: Personal use, just add/check/delete.
AI: Confirmed: Personal use, core features are add/check/delete tasks, no login/cloud sync/category tags.
AI: [Generates accurate version]
```

---

## Discussion End Checklist

When you can check all boxes, you can have AI generate PRD or code:

<ConfirmationChecklist />

- [ ] AI explicitly stated who the target users are
- [ ] AI listed 3-5 core features
- [ ] AI clarified which features won't be done
- [ ] AI understood the complete usage flow
- [ ] How and what data to store is clear
- [ ] Edge cases have been discussed
- [ ] Technical constraints have been stated
- [ ] **Have AI summarize confirmation that its understanding is accurate**

---

## FAQ

### Q1: AI listed many features I don't need

**A**: This indicates boundaries aren't clear enough. Emphasize "out of scope" in the confirmation template, and specifically list categories of features you don't need.

### Q2: AI's understanding is completely wrong

**A**: Don't just say "that's wrong." First understand how it understood, then point out the deviation. Use "When I said X, I meant..., what you understood was..." this comparison approach.

### Q3: Do I have to write such a long confirmation prompt every time?

**A**: No. First time or complex requirements need full confirmation. Simple or subsequent iterations can be simplified to "please confirm understanding" or "anything unclear?"

### Q4: AI confirmed, but generated code is still wrong

**A**: Check if certain details were missed, or if you didn't carefully review when AI generated the solution. The solution is the blueprint for code—if the solution is wrong, the code will definitely be wrong.

---

## Key Takeaways

- ✅ **AI won't necessarily ask about all critical details—you need to proactively ask it to ask questions**
- ✅ Use "Based on the current plan, list multiple questions you're uncertain about and ask me to confirm" to start follow-up
- ✅ **Multiple rounds of Q&A until all hidden assumptions are uncovered**
- ✅ Give clear answers to each question, don't let AI "figure it out"
- ✅ Solution first, confirm solution before generating code
- ✅ After both sides' understanding aligns, then have AI generate PRD
- ✅ Answering AI's questions is also a process of self-clarification

After confirming understanding, next use standard templates to write PRD.

---

## Related Content

- Prerequisite: [3.1 Product Validation in Practice](./01-product-validation.md)
- Details: [3.3 PRD Writing in Practice](./03-prd-template-guide.md)