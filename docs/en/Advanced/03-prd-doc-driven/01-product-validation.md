---
title: "3.1 Idea Validation in Practice"
description: "How to avoid building something nobody wants"
chapter: "Chapter 3"
priority: "🔴"
---

# 3.1 Idea Validation in Practice 🔴

> **After reading this section, you will gain:**
>
> - Mastery of the core points of the three-step product validation method
> - Understanding of the three principles of authentic interviews, distinguishing good questions from bad ones
> - Ability to use MVP thinking to quickly validate hypotheses
> - Knowledge of how to avoid false validation signals

> The three-step product validation method mentioned in the preface: Three Soul-Searching Questions, MVP Thinking, and Rapid Validation.

---

## When This Section Applies

::: tip Already have a clear idea?

**If you already have a specific product idea you want to build, you can skip this section** and just go for it! The content below is mainly for readers who **don't have a clear direction yet**—teaching you how to find and validate ideas worth pursuing from scratch.

Of course, even if you have an idea, quickly skimming this section might help you spot blind spots in your validation process and avoid common pitfalls.

:::

---

## Prerequisites

::: tip What is MVP

MVP (Minimum Viable Product) is a product version that validates core hypotheses with minimal resources. The goal isn't "perfection" but "sufficient for validation."

:::

::: tip What is Product-Market Fit (PMF)

Product-Market Fit (PMF) refers to how well a product satisfies market demand. When a product meets market needs, users actively refer others, retention curves flatten, and PMF is achieved.

:::

---

## Why Validate Ideas

Before investing time in writing PRDs and development, confirm one thing first: **Is this idea worth pursuing?**

Many people skip this step and jump straight into development, only to build something nobody uses. This isn't rare—the #1 reason startups fail is "no market need," accounting for 42% of failures. Behind this statistic are countless "I think users need this" assumptions treated as facts without any validation. Entrepreneurs are often passionate about their ideas; this passion is both fuel and blind spot. When fully immersed in an idea, it's easy to fall into confirmation bias—only seeing evidence that supports you while ignoring danger signals.

The cost of premature development far exceeds imagination. Investing three months building a feature nobody wants wastes not just time, but also opportunities to validate other hypotheses. **The earlier you fail, the lower the cost.** Discovering problems at the idea stage costs only some paper and conversations; at the prototype stage, weeks of time; but after product launch, possibly team morale and precious funding windows. Validation is essentially risk management—not to ensure success, but to eliminate doomed paths at minimal cost.

The purpose of validation isn't to prove your idea correct, but to discover fatal flaws early. The best outcome is finding your idea won't work—this saves months of development. Many entrepreneurs fear validation, worried about discovering problems with their ideas. But consider: if a problem can be found during validation, how lucky is that? What's truly terrifying are problems that lurk until after launch, when there's no turning back. Validation can feel discouraging because many "great ideas" don't hold up to scrutiny. But this discouragement is healthy—it means you're testing your ideas against real-world standards, not indulging in fantasy.

---

## Three Soul-Searching Questions

Before any validation, ask yourself three questions. These seem simple, yet countless entrepreneurs stumble here repeatedly. Their value lies not in getting answers, but in forcing you to wake from self-intoxication and re-examine your idea through a market lens.

<SoulThreeQuestions />

### Question 1: Who is the user?

Vague answers equal no answers. "Everyone" isn't a user. "Young people" isn't a user. "People who need this feature" isn't a user either.

Specific answers point to reachable groups: working professionals handling 5-10 tasks daily; sales teams spending 2 hours every Friday compiling weekly reports; parents who only use WeChat and can't handle complex operations.

Why do specific users matter? Because different user groups have completely different pain points, usage scenarios, and willingness to pay. Products designed for "everyone" ultimately serve no one well. When you say "everyone," you're actually avoiding choice. Choice means giving up—abandoning unsuitable users to better serve truly suitable ones. Many entrepreneurs fear this choice, worried about shrinking the potential market. But the truth is, a product trying to please everyone often fails to truly satisfy anyone. The value of specific user personas lies in enabling you to imagine a real person using your product in a real context. This concrete imagination is the foundation for making correct product decisions.

### Question 2: Where is the pain point?

"I think it's needed" isn't a real pain point. "Someone should use this" isn't either. Real pain points are: users currently have solutions, but those solutions are painful.

Sticky notes get lost easily; phone memos take too long to open—these are real pain points because users experience them daily. "No tool like this exists" isn't a real pain point, because users might not care about this problem at all.

How to judge pain point authenticity? Look at whether users have tried to solve it. If users haven't actively searched for solutions, haven't spent money or time on alternatives, then this "pain point" may just be your imagination.

Another characteristic of real pain points is that users are already paying a price for them. This price can be monetary—buying expensive software or services; time—spending significant effort on tedious processes; or emotional burden—anxiety, frustration, or embarrassment. When users are already paying to solve a problem, it shows the issue is real and important to them. Conversely, if users merely say "this is indeed a problem" verbally but never take action to solve it, that "pain point" likely has low priority and isn't worth your resources to develop solutions for.

### Three Levels of Needs

When defining product requirements, user needs actually have three levels. Understanding these helps you position product value more precisely.

The first level is **Pain Points (Must-have)**—problems users must solve. For example, a developer manually executing 10 commands for each deployment, easily missing steps and causing deployment failures—this is a real pain point. Pain points are characterized by: if unsolved, users suffer continuously, even willing to pay for solutions. MVPs should focus on solving pain points, as only pain points make users truly willing to use your product.

The second level is **Itch Points (Nice-to-have)**—ideal states in users' minds. For example, a deployment system that automatically detects code changes and triggers deployment—this would make developers' work easier, but isn't essential—manual deployment is troublesome but acceptable. Itch points are characterized by: if implemented, users are happy, but not implementing won't block product usage. Itch points should be added gradually during iteration, not pursued during the MVP stage.

The third level is **Delight Points (Wow-factor)**—experiences exceeding user expectations. For example, a system that not only auto-deploys but also auto-rolls back on failure, and notifies the team in Slack with specific failure causes and suggested fixes. Users never expected you'd go this far—this "wow" feeling is the delight point. Delight points are your product's differentiated competitiveness, the key to making users actively recommend your product to friends.

When writing PRDs, listing these three levels separately enables more precise product positioning. Ensure pain points are solved first, then gradually add itch points, and finally use delight points to build differentiation.

### Question 3: Why you?

"Because we have the best technology"—users don't care. "Because the interface looks good"—users won't buy. "Because it's AI-powered"—this isn't a selling point.

Real advantages come from three aspects: better pain point resolution (faster, cheaper, simpler), unique acquisition channels (you can reach users others can't), unique data or resources (others don't have).

Often, the answer isn't "why you" but "you're not needed at all." Accepting this answer saves all subsequent investment.

This question matters because it forces you to face competitive reality. Most markets aren't blank slates—users are already solving their problems in some way. Your competitors might not be another startup, but Excel spreadsheets, paper notebooks, or the default option of "doing nothing." To win users, you must provide improvement significant enough to justify changing existing habits. This change has costs—time to learn new tools, hassle of migrating data, discomfort of adapting to new workflows. If your advantages don't outweigh these costs, users won't switch. Admitting "users don't need me" is painful, but far less painful than discovering market non-existence after heavy investment.

---

## Authentic Interview Method: Three Principles

The authentic interview method is a user interview approach with a core principle: **obtain real data through good questions, avoiding false signals**. Its philosophy: if questions are well-designed, even close acquaintances cannot give insincere answers.

### Principle 1: Talk about their lives, not your ideas

When discussing your ideas, people give positive feedback out of politeness. This feedback is worthless because it doesn't reflect real behavior.

The right way is to talk about their lives: What have you been busy with lately? What problems have you encountered? How did you solve them? In this process, if issues related to your idea arise, natural opportunities emerge to explore deeper.

This principle's core is avoiding the "pitch trap." When you start describing your idea, the other person immediately enters social etiquette mode. They nod, smile, say "sounds good"—not because they're truly interested, but because they're kind people who don't want to dampen your enthusiasm. This social lubricant is useful in daily life but fatal in user interviews. You need not polite agreement, but information about users' real situations. Only when you focus the conversation on them will they drop their guard and start sharing truly valuable details.

### Principle 2: Ask about past specific behaviors, not future assumptions

"Would you use it?" yields false positives. "How much would you pay?" yields unreal numbers. People are extremely inaccurate at predicting their own future behavior.

The right way is to ask about the past: When did you last encounter this problem? How did you handle it then? What methods did you try? How much time and money did you spend?

Humans' optimistic bias when predicting future behavior is deeply rooted. When asked "would you use it," people tend to imagine an ideal self—more organized, more willing to try new things, better at maintaining habits. But the real self is different. This is why asking about past behavior matters so much. Past behavior is established fact, immune to distortion by idealized self-image. When users describe specific contexts of their last encounter with a problem, you learn the real frequency, severity, and actual solutions attempted. This information far outweighs any declarations about future intentions.

### Principle 3: Listen more, talk less

The more you talk in a conversation, the less real data you obtain. When the other person starts expressing opinions or raising questions, they often reveal their true thoughts and concerns. Don't interrupt, don't rush to "correct" or "supplement."

This principle is especially difficult for technical people. When you hear users describe their problems, your brain immediately starts building solutions. You'll want to tell them "actually you could do this," or "our product solves exactly this." But this impulse must be restrained. Every time you speak to explain, you lose a learning opportunity. Users' descriptions often contain deep information they themselves aren't aware of—their workflows, priority rankings, internal power structures. This information only emerges when they use their own language and logic. Your task is to create space for them to think aloud freely, not guide them toward your predetermined answers.

---

## Good Questions vs. Bad Questions

Good questions lead to specific behaviors and real motivations; bad questions lead to opinions and commitments.

### Bad Question Types

**Opinion questions**:

- "Do you think this is a good idea?"
- "Would you buy this product?"

Besides the market itself, no one can predict whether an idea will succeed. These questions yield only comfort, not data.

**Hypothetical questions**:

- "How much would you be willing to pay?"
- "If there were a feature that could do X, would you use it?"

People's predictions of future behavior are often overly optimistic. These numbers look specific but have no reference value.

**Leading questions**:

- "Don't you find this problem annoying?"
- "You've encountered this problem too, right?"

These questions suggest expected answers; out of politeness, people will agree.

### Good Question Types

**Behavior tracing**:

- "When did you last encounter this problem?"
- "Can you tell me how you handled it then?"

Specific behaviors cannot lie; they reveal real pain points and priorities.

**Current situation exploration**:

- "How do you solve this problem now?"
- "How much did this solution cost? How much time?"

Understanding current situations not only validates pain points but also provides pricing anchors.

**Motivation investigation**:

- "Why bother doing this?"
- "What impact did this have?"

Motivation determines willingness to pay. Some problems exist but have minor impact—users won't pay for them.

---

<InterviewSimulator />

## Traps of False Signals

### Praise is not data

When someone says "great idea" or "let's keep in touch" at conversation's end, it sounds positive but is worthless. People won't crush your enthusiasm to your face.

How to identify false praise? See if they've made substantive investment: willing to spend more time discussing in depth? Willing to introduce relevant people? Willing to prepay or make other commitments? If none, this is just polite rejection.

Praise is the most deceptive false signal because it feels good while requiring no commitment. Humans are social animals; we naturally tend to maintain harmonious relationships. When facing an enthusiastic entrepreneur, most choose encouraging words even if they don't truly believe in the idea. This isn't malicious deception but social instinct. The key to identifying false praise is observing actions, not words. A truly interested person will actively ask details, want to learn more, offer specific suggestions or introductions. They'll invest their social capital—time, connections, reputation—to express support. If after conversation they only politely say "let's keep in touch" then disappear, treat this as a negative signal, not future hope.

### The truth behind "I'd use it"

"I'd use it" has three meanings: really would, politeness, or procrastination. How to distinguish? See if they've already paid a price for this problem (time, money, effort). If they've never actively searched for solutions, then "I'd use it" is just politeness.

### The feature suggestion trap

During interviews, people suggest "it would be great if you could add XXX feature." This looks like demand, but direct implementation may waste time.

The right way is to dig into motivation: Why is this feature needed? How did you handle things without it? What value does this feature bring? Often, behind surface needs lie simpler, more essential solutions.

---

## MVP Validation Thinking

MVP isn't a "crippled product," but "the simplest version that can validate hypotheses."

This definition is crucial because it corrects a common misunderstanding. Many hearing MVP think "build a crude version first, improve later." This understanding causes two problems: first, "crude" often means terrible user experience, and bad experience makes potential users abandon your product too early; second, "improve later" often never comes, because once launched, new demands and bugs occupy all your time.

The correct understanding is that MVP is an experimental tool whose purpose is to validate core hypotheses at minimal cost. If validated, continue investing; if falsified, cut losses timely. MVP's "minimum" doesn't mean so few features it's unusable, but only including features essential for hypothesis validation. An excellent MVP should let users complete the experience promised by your core value proposition, even if that experience is backed by manual processes.

### MVP Forms

MVPs don't have to be code. There are many ways to validate hypotheses:

| Validation Method | Applicable Scenario | Cost |
|---------|---------|------|
| Manual service | Validate whether demand exists | Time |
| Landing page | Validate user interest | Almost zero |
| Prototype demo | Validate solution feasibility | Medium |
| Simplified version | Validate core functionality | Development cost |

When choosing MVP form, ask yourself: **Can this hypothesis be validated with a simpler method?**

### Validation Hypothesis Levels

Hypotheses have multiple levels, from "users exist" to "users are willing to pay." Each level needs validation; don't skip.

| Hypothesis Level | Validation Method | Pass Standard |
|---------|---------|---------|
| Users exist | Talk to target users | Can find 5-10 people matching persona |
| Pain point is real | Understand current situation and costs | They've tried to solve it |
| Solution is feasible | Prototype or manual service | They're willing to use or pay |
| Sustainable | Payment validation | Someone actually pays |

---

## Rapid Validation Methods

### Manual validation

Before writing code, serve users manually first. This validates demand fastest.

For example, if you want to build a food delivery app, start with a WeChat group taking orders. If there are few orders in a week, the app won't have users either.

### Landing page test

Create a simple page describing product features, collecting emails or pre-orders. If no one leaves contact info, demand doesn't exist.

### Interview techniques

Find target users for 15-30 minute conversations. Don't pitch, don't show products—focus on understanding their lives and problems.

Prepare 3 key questions to validate before each interview. Ensure every conversation advances your understanding.

---

## Common Questions

### Q1: How many people do I need to interview?

**A**: The goal is 5-10 effective interviews, not hundreds. When 3 consecutive interviews yield no new information, you can basically stop.

### Q2: What if I can't find target users?

**A**: This is a risk signal. If you can't find users to interview, the user group may not exist or be unreachable—both fatal problems.

### Q3: What if all interview feedback is positive?

**A**: Check if you mentioned your idea, if you asked about future behavior rather than past behavior. Redesign questions focusing on specific behaviors and real costs.

### Q4: After validation passes, do I need to keep validating?

**A**: Validation isn't a one-time event. As the product develops, new hypotheses need new validation. Maintain a continuous validation mindset.

---

## Key Takeaways

- ✅ **Purpose of validation** is to discover fatal flaws early, not to prove ideas correct
- ✅ **Three Soul-Searching Questions** quickly screen ideas: Who is the user, Where is the pain point, Why you
- ✅ **Three principles of authentic interviews**: Talk about lives not ideas, Ask past not future, Listen more talk less
- ✅ **Good questions** lead to specific behaviors, **Bad questions** lead to opinions and commitments
- ✅ **MVP isn't a crippled product**, but the simplest version that can validate hypotheses
- ✅ **Praise and promises aren't data**, real behavior and investment are

After validation passes, the next step is confirming requirements with AI.

---

## Related Content

- See: [3.2 Discussing Requirements with AI](./02-discuss-with-ai.md)
- Next: [3.3 PRD Writing in Practice](./03-prd-template-guide.md)