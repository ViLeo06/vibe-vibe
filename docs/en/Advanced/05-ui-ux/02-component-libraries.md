---
title: "5.2 Component Libraries"
description: "shadcn/ui, Ant Design, Element Plus, TDesign...when should you use each of these ready-made building blocks?"
---

# 5.2 Component Libraries

> **Goal of this section**: Understand the characteristics and best use cases of mainstream component libraries, and learn how to choose the right one based on your project needs.

A component library is like a set of prebuilt "LEGO blocks." You don't need to hand-code buttons, input fields, or dialogs every single time—just use what's already built. As the veterans say: "Choose the right component library, and you'll save 80% of your UI work."

## shadcn/ui (Recommended)

[shadcn/ui](https://ui.shadcn.com/)

![image-20260222210620318](/images/Advanced/image-20260222210620318.png)

It was already introduced in the preface, but here let's dive deeper into why it's the top choice for VibeCoding.

**Core idea**: It's not an npm package. Instead, the component source code is copied directly into your project. You have full control.

![image-20260222210651904](/images/Advanced/image-20260222210651904.png)

**Why it's great for AI development**:

With traditional component libraries, the code is buried deep inside `node_modules`, so AI can't see or modify it; with shadcn/ui, the code lives right in your project folder, so AI can edit it just like code you wrote yourself.

- The code lives in your project, so AI can read and modify it directly
- High-quality components with solid accessibility support—for example, visually impaired users using screen readers can still interact with buttons and forms normally
- A rich ecosystem with plenty of extension components and templates

**How to help AI use shadcn/ui well**:

Tell the AI that your project uses shadcn/ui, and it will prioritize using those components.

![image-20260222210713180](/images/Advanced/image-20260222210713180.png)

**shadcn/ui ecosystem extensions**:

The shadcn/ui ecosystem keeps growing, and the community has contributed many high-quality extensions:

| Extension Library | Use Case |
|-------|------|
| [Magic UI](https://magicui.design/) | Animated components, special effects components |
| [Aceternity](https://www.aceternity.com/) | Advanced UI effects components |

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222210923284.png" /></td>
    <td><img src="/images/Advanced/image-20260222210905692.png" /></td>
  </tr>
</tbody></table>

## Other Mainstream Component Libraries

<div class="lib-grid">

<a href="https://ant.design/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211429267.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Ant Design</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">Alibaba's enterprise-grade component library, with 60+ components covering nearly every scenario and the most comprehensive Chinese documentation.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Admin dashboards</span>
    <span class="lib-card-tag">Internal enterprise tools</span>
    <span class="lib-card-tag">Data-intensive</span>
  </div>
</a>

<a href="https://element-plus.org/zh-CN/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212101447.png" />

  <div class="lib-card-header">
    <span class="lib-card-name">Element Plus</span>
    <span class="lib-card-badge lib-badge-vue">Vue 3</span>
  </div>
  <div class="lib-card-desc">Built by the Ele.me team, it's the most mainstream component library in the Vue 3 ecosystem. If you're building an admin backend with Vue, this is basically the default choice.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Top Vue choice</span>
    <span class="lib-card-tag">Admin dashboards</span>
    <span class="lib-card-tag">Chinese docs</span>
  </div>
</a>

<a href="https://tdesign.tencent.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212117578.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">TDesign</span>
    <span class="lib-card-badge lib-badge-multi">Multi-framework</span>
  </div>
  <div class="lib-card-desc">Built by Tencent, with support for React, Vue 2/3, and mini programs. It offers a complete design system and provides Figma resources.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">React/Vue/mini programs</span>
    <span class="lib-card-tag">Design system</span>
  </div>
</a>

<a href="https://arco.design/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212134560.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Arco Design</span>
    <span class="lib-card-badge lib-badge-multi">React / Vue</span>
  </div>
  <div class="lib-card-desc">Built by ByteDance, with 60+ components proven at scale, plus a built-in icon library and style configuration platform.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Data-intensive</span>
    <span class="lib-card-tag">Theme customization</span>
  </div>
</a>

<a href="https://m3.material.io/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222222521284.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Material Design 3</span>
    <span class="lib-card-badge lib-badge-multi">Official Google</span>
  </div>
  <div class="lib-card-desc">Google's official design system (now updated to version 3), defining standards for color, typography, components, and more. It's not a component library, but the design language itself.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Design system</span>
    <span class="lib-card-tag">Cross-platform</span>
    <span class="lib-card-tag">Dynamic Color</span>
  </div>
</a>

<a href="https://mui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211543203.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">MUI (Material UI)</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">A third-party React component library based on Google's Material Design spec. It's the most widely used worldwide and offers strong theme customization capabilities.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Material Design</span>
    <span class="lib-card-tag">Internationalization</span>
  </div>
</a>

<a href="https://www.radix-ui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211603616.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Radix UI</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">An unstyled low-level component library that only handles behavior and accessibility—the styling is entirely up to you. It's the foundation of shadcn/ui.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Unstyled</span>
    <span class="lib-card-tag">Accessibility</span>
    <span class="lib-card-tag">Fully customizable</span>
  </div>
</a>

<a href="https://www.heroui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212148692.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">HeroUI</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">Formerly known as NextUI, it's built on Tailwind CSS, looks great out of the box, and comes with built-in animations.</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Tailwind CSS</span>
    <span class="lib-card-tag">Out of the box</span>
    <span class="lib-card-tag">Modern look</span>
  </div>
</a>

</div>



## Component Library Selection Decision Tree

<LibraryDecisionTree />

## Let AI Help You Use Component Libraries

No matter which component library you choose, the key is to **clearly tell the AI which one you're using** in your prompt:

> "Use the shadcn/ui Table component to display a user list with sorting and pagination"

> "Use Ant Design to build an order management table with filtering and export support"

---

::: info Next Step
Component libraries solve the problem of static interfaces. Want to make your pages "come alive"? Continue to [5.3 Animation and Interaction Libraries](./03-animation-libraries.md).
:::