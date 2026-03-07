---
title: "5.1 AI 设计工具"
description: "v0.dev、Figma、Google Stitch...这些专门做 UI 的 AI 工具，什么时候用？"
---

# 5.1 AI 设计工具

> **本节目标**：了解主流 AI 设计工具的定位和用法，学会在合适的场景选择合适的工具，与 Claude Code 配合使用。

市面上有很多专门针对 UI/UX 的 AI 工具。它们各有擅长，合理组合能事半功倍。

::: tip 工作流
使用这些工具**生成初始 UI**，Claude Code 擅长**集成和修改**。推荐流程：用设计工具出原型 → 复制代码到项目 → 用 Claude Code 做业务逻辑集成和细节调整。
:::

## Google AI Studio —— AI 应用开发平台（强烈推荐）

Google 的 AI 应用开发平台，可以用 Gemini 模型生成完整的 Web 应用，包括 UI 界面。你可以把它理解成一个在线版的 Claude Code，但由 Google 提供，打开浏览器就能用，不需要本地环境。

![image-20260222173132952](/images/Advanced/image-20260222173132952.png)

**适合场景**：

- 快速搭建 AI 驱动的应用原型
- 需要集成 Gemini 模型能力的项目
- 想要一站式从设计到部署
- 免费用户

访问地址：[aistudio.google.com](https://aistudio.google.com/apps)

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


## Google Stitch —— AI 原型设计

Google 推出的 AI UI 原型设计工具，可以从文字描述或草图生成完整的 UI 设计稿。

![image-20260222173221042](/images/Advanced/image-20260222173221042.png)

**适合场景**：

- 从零开始设计页面布局
- 需要设计稿而不是代码（设计稿是一张可以看但不能跑的图，代码是可以直接运行的程序——Stitch 给你的是前者）
- 想快速验证产品想法的视觉效果
- 免费

访问地址：[stitch.withgoogle.com](https://stitch.withgoogle.com/)

![image-20260227000703458](/images/Advanced/image-20260227000703458.png)



## v0.app —— AI UI 代码生成器

Vercel 出品，用自然语言描述你想要的界面，它直接生成 React + Tailwind + shadcn/ui 代码。

![image-20260222173330046](/images/Advanced/image-20260222173330046.png)

**适合场景**：

- 快速生成单个组件或页面原型
- 需要 shadcn/ui 风格的代码
- 想要可以直接复制到项目里的代码

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

## Figma —— 设计界的标准工具

Figma 是专业设计师的标配工具，现在也加入了 AI 辅助功能。它不直接生成代码，但能帮你做出精确的设计稿。如果你对页面的视觉效果有明确想法，但用文字描述不清楚，Figma 就是你的画板——先画出来，再让 AI 照着写代码。

![image-20260222180858852](/images/Advanced/image-20260222180858852.png)

**适合场景**：

- 需要精确到像素的设计稿
- 团队协作设计（设计师 + 开发者）
- 需要设计系统和组件规范

**与 Claude Code 配合**：

Claude Code 可以直接连接 Figma（通过一个叫 MCP 的插件协议）。配置好后，你可以直接告诉 AI：

> "根据 Figma 设计稿实现这个页面"

AI 会读取 Figma 中的设计信息（颜色、间距、字体），生成匹配的代码。

![image-20260222181216119](/images/Advanced/image-20260222181216119.png)

访问地址：[figma.com](https://www.figma.com/)

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

## Lovable —— 全栈应用生成器

Lovable 不只是做 UI，它能生成包含前后端的完整应用。适合快速验证产品想法。和 Google AI Studio 类似，但 Lovable 更侧重于生成可部署的成品，而不只是原型。



访问地址：[lovable.dev](https://lovable.dev/)

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

## 工具选择指南与推荐工作流

<DesignToolWorkflow />

## 让 AI 帮你选工具

不确定用哪个？直接问 AI：

> "我想做一个电商产品详情页，有图片轮播、价格展示、加入购物车按钮。用什么工具最快？"

AI 会根据你的具体需求推荐最合适的工具和工作流。

---

::: tip 工具只是手段
AI 工具能帮你快速生成界面，但**产品设计思维**仍然是你的核心竞争力。工具会不断更新换代，但"理解用户需要什么"这个能力永远不会过时。
:::

::: info 下一步
知道了用什么工具，接下来看看有哪些现成的组件库可以用。继续看 [5.2 组件库](./02-component-libraries.md)。
:::
