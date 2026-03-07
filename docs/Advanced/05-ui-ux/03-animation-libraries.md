---
title: "5.3 动画与交互库"
description: "Motion、GSAP、Three.js...让页面'动'起来的选项"
---

# 5.3 动画与交互库

> **本节目标**：了解主流动画库的定位，学会根据需求选择合适的动画方案，掌握与 AI 配合的提示词技巧。

一个恰到好处的动画，能让页面从"能用"变成"好用"。但过度动画会让用户头晕。老师傅说："好动画应该是用户几乎察觉不到的——它只是让交互更流畅，而不是抢戏。"

## Motion（原 Framer Motion）—— React 动画首选

[Official Motion Examples | React, JS & Vue Animations](https://motion.dev/examples)

Motion（包名 `motion`，前身是 `framer-motion`）是 React 生态最流行的动画库，GitHub 30,000+ Star。你只需要描述"动画结束时元素长什么样"，Motion 自己算出中间过程——和 React"描述结果而非步骤"的写法一致。

![image-20260222213320488](/images/Advanced/image-20260222213320488.jpg)

**常用动画场景和提示词**：

| 你想要的效果 | 告诉 AI |
|------------|---------|
| 元素淡入 | "用 Motion 给这个卡片加淡入动画" |
| 列表逐个出现 | "用 Motion 的 staggerChildren 让列表项依次淡入" |
| 拖拽排序 | "用 Motion 的 Reorder 组件实现拖拽排序" |
| 页面切换动画 | "用 Motion 的 AnimatePresence 做页面过渡" |
| 滚动触发动画 | "用 Motion 的 whileInView 在元素进入视口时触发动画" |

## GSAP —— 专业级动画引擎


## GSAP —— 专业级动画引擎

[Homepage | GSAP](https://gsap.com/)

GSAP（GreenSock Animation Platform）是 Web 动画领域的老牌王者，性能极强，能做出最复杂的动画效果。

![image-20260222213406770](/images/Advanced/image-20260222213406770.png)

**特点**：

- 性能最强，复杂动画不掉帧
- 支持时间线（Timeline），可以编排多个动画的先后顺序——类似剪辑视频时的时间轴，你可以安排哪个动画先播、哪个后播、中间隔多久
- 插件丰富：ScrollTrigger（滚动触发）、Draggable（拖拽）、MorphSVG（SVG 变形）
- 不限于 React，任何框架都能用

**适合场景**：

- 营销落地页的炫酷滚动动画
- 复杂的 SVG 动画和路径动画
- 需要精确控制时间线的动画序列
- 性能要求极高的场景

**提示词示例**：

> "用 GSAP 的 ScrollTrigger 做一个滚动视差效果（就是你在 Apple 官网常看到的那种，背景和前景滚动速度不一样），背景图片比内容滚动慢"

> "用 GSAP Timeline 做一个开场动画：先 Logo 淡入，然后标题从左滑入，最后按钮弹出"

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222213514935.jpg" /></td>
    <td><img src="/images/Advanced/image-20260222213459756.png" /></td>
  </tr>
</tbody></table>

## Three.js —— 3D 效果的终极武器

[Three.js – JavaScript 3D Library](https://threejs.org/)

如果你想在网页上做 3D 效果，Three.js 是唯一的选择。配合 React 封装库 `@react-three/fiber`，可以用 React 组件的方式写 3D 场景。

![image-20260222213553727](/images/Advanced/image-20260222213553727.jpg)

**适合场景**：

- 3D 产品展示（旋转查看）
- 粒子效果背景
- 交互式 3D 场景
- 数据可视化的 3D 图表

<MotionEffectsDemo />

## 轻量级动画方案

不是所有动画都需要引入大型库。有些简单效果用 CSS 就够了：

| 效果 | 方案 | 是否需要库 |
|------|------|-----------|
| 按钮悬停变色 | CSS `transition` | 不需要 |
| 元素淡入淡出 | CSS `@keyframes` | 不需要 |
| 简单的滑入滑出 | Tailwind CSS `animate-*` | 不需要 |
| 列表项交错动画 | Motion | 需要 |
| 复杂滚动动画 | GSAP ScrollTrigger | 需要 |
| 3D 效果 | Three.js | 需要 |

**提示词示例**：

> "给这个按钮加一个悬停效果，用纯 CSS transition，不要引入额外的库"

> "这个加载动画用 Tailwind 的 animate-spin 就行，不需要 Motion"

## 动画库选择决策树

<AnimationDecisionTree />

## 动画的度

**少即是多**。

- 动画时长控制在 200-500ms，太快看不清，太慢觉得卡
- 用户主动触发的动画（点击、悬停）可以明显一点
- 自动播放的动画（进入视口）要含蓄一点
- 移动端减少动画，省电省流量

---

::: info 下一步
知道了怎么让页面动起来，但动成什么样才好看？继续看 [5.4 UI 风格与灵感](./04-ui-inspiration.md)，找找设计灵感。
:::
