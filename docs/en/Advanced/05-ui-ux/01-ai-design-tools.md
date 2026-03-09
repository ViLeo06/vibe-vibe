---
title: "5.1 AI Design Tools"
description: "v0.dev, Figma, Google Stitch...when should you use these AI tools built specifically for UI?"
---

# 5.1 AI Design Tools

> **Goal of this section**: Understand the positioning and use cases of mainstream AI design tools, learn how to choose the right tool for the right scenario, and use them together with Claude Code.

There are many AI tools on the market built specifically for UI/UX. Each has its own strengths, and combining them wisely can make your work much more efficient.

::: tip Workflow
Use these tools to **generate the initial UI**, and let Claude Code handle **integration and modifications**. Recommended flow: create a prototype with a design tool → copy the code into your project → use Claude Code for business logic integration and fine-tuning.
:::

## Google AI Studio — AI App Development Platform (Highly Recommended)

Google's AI app development platform can use Gemini models to generate complete web apps, including the UI. You can think of it as an online version of Claude Code provided by Google—just open it in your browser and start using it, with no local setup required.

![image-20260222173132952](/images/Advanced/image-20260222173132952.png)

**Best for**:

- Quickly building AI-powered app prototypes
- Projects that need Gemini model integration
- Wanting a one-stop workflow from design to deployment
- Free users

Visit: [aistudio.google.com](https://aistudio.google.com/apps)

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222173412942.png" /></td>
    <td><img src="/images/Advanced/image-20260222173528903.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222173540818.png" /></td>
    <td><img src="/images/Advanced/image-20260222173829118.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222173907920.png" /></td>
    <td><img src="/images/Advanced/image-20260222173934821.png" /></td>
  </tr>
</tbody></table>


## Google Stitch — AI Prototype Design

Google's AI UI prototyping tool can generate complete UI mockups from text descriptions or sketches.

![image-20260222173221042](/images/Advanced/image-20260222173221042.png)

**Best for**:

- Designing page layouts from scratch
- When you need design mockups rather than code (a mockup is something you can look at but not run, while code is a program you can run directly—Stitch gives you the former)
- Quickly validating the visual direction of a product idea
- Free

Visit: [stitch.withgoogle.com](https://stitch.withgoogle.com/)

![image-20260227000703458](/images/Advanced/image-20260227000703458.png)



## v0.app — AI UI Code Generator

Built by Vercel, it lets you describe the interface you want in natural language and directly generates React + Tailwind + shadcn/ui code.

![image-20260222173330046](/images/Advanced/image-20260222173330046.png)

**Best for**:

- Quickly generating a single component or page prototype
- Needing code in the shadcn/ui style
- Wanting code you can copy directly into your project

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222174541135.png" /></td>
    <td><img src="/images/Advanced/image-20260222174730883.jpg" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222174800532.png" /></td>
    <td><img src="/images/Advanced/image-20260222174901391.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222174926727.png" /></td>
    <td><img src="/images/Advanced/image-20260222174958816.png" /></td>
  </tr>
</tbody></table>

## Figma — The Standard Tool in Design

Figma is the go-to tool for professional designers, and it now includes AI-assisted features as well. It doesn't generate code directly, but it helps you create precise design mockups. If you have a clear idea of how a page should look but can't describe it well in words, Figma is your canvas—draw it first, then have AI write the code based on it.

![image-20260222180858852](/images/Advanced/image-20260222180858852.png)

**Best for**:

- Design mockups that need pixel-level precision
- Collaborative team design (designers + developers)
- Design systems and component specifications

**How it works with Claude Code**:

Claude Code can connect directly to Figma (through a plugin protocol called MCP). Once configured, you can simply tell the AI:

> "Implement this page based on the Figma design"

The AI will read the design information in Figma (colors, spacing, fonts) and generate matching code.

![image-20260222181216119](/images/Advanced/image-20260222181216119.png)

Visit: [figma.com](https://www.figma.com/)

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222180953413.png" /></td>
    <td><img src="/images/Advanced/image-20260222181002982.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222181024025.jpg" /></td>
    <td><img src="/images/Advanced/image-20260222181106163.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222180950077.png" /></td>
    <td><img src="/images/Advanced/image-20260222181145149.png" /></td>
  </tr>
</tbody></table>

## Lovable — Full-Stack App Generator

Lovable does more than just UI—it can generate complete apps with both frontend and backend. It's well suited for quickly validating product ideas. Similar to Google AI Studio, but Lovable is more focused on generating deployable finished products rather than just prototypes.



Visit: [lovable.dev](https://lovable.dev/)

![image-20260222183416399](/images/Advanced/image-20260222183416399.png)

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222183506857.png" /></td>
    <td><img src="/images/Advanced/image-20260222183546410.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222183557356.png" /></td>
    <td><img src="/images/Advanced/image-20260222183609472.png" /></td>
  </tr>
  <tr>
    <td><img src="/images/Advanced/image-20260222183617930.png" /></td>
    <td><img src="/images/Advanced/image-20260222183631655.png" /></td>
  </tr>
</tbody></table>

## Tool Selection Guide and Recommended Workflow

<DesignToolWorkflow />

## Let AI Help You Choose a Tool

Not sure which one to use? Just ask AI directly:

> "I want to build a product detail page for an e-commerce site, with an image carousel, price display, and add-to-cart button. Which tool is the fastest option?"

AI will recommend the most suitable tool and workflow based on your specific needs.

---

::: tip Tools are just a means
AI tools can help you generate interfaces quickly, but **product design thinking** is still your core competitive advantage. Tools will keep evolving, but the ability to "understand what users actually need" will never go out of date.
:::

::: info Next step
Now that you know which tools to use, next let's look at the component libraries you can use right away. Continue to [5.2 Component Libraries](./02-component-libraries.md).
:::