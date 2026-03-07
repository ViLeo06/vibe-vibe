---
title: "260307-使用 AI Gateway 生成视频"
description: "Vercel AI Gateway 现已支持视频生成功能，通过 AI SDK 6 可以创建电影级质量的视频、同步音频、生成个性化内容并保持身份一致性"
author: "Jerilyn Zheng"
source: "https://vercel.com/blog/video-generation-with-ai-gateway"
date: "2026-03-07"
category: engineering-practice
tags: [Vercel, AI Gateway, 视频生成, AI SDK]
---

# 使用 AI Gateway 生成视频

<div class="article-meta">
📅 2026-03-07 | 👤 Jerilyn Zheng | 🔗 <a href="https://vercel.com/blog/video-generation-with-ai-gateway" target="_blank">查看原文</a>
</div>

AI Gateway 现已支持视频生成，你可以通过 AI SDK 6 创建电影级质量的视频、同步音频、生成具有一致身份的个性化内容。

## 两种入门方式

视频生成功能目前处于 Beta 阶段，适用于 Pro 和 Enterprise 计划以及付费 AI Gateway 用户。

### AI SDK 6：编程式生成视频

使用与文本和图像相同的接口以编程方式生成视频。一个 API、一个认证流程、一个可观测性仪表板，覆盖整个 AI 管道。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'xai/grok-imagine-video',
  prompt: 'A golden retriever catching a frisbee mid-air at the beach',
});
```

### AI Gateway Playground：无代码实验

在嵌入每个模型页面的可配置 [AI Gateway playground](https://vercel.com/ai-gateway/models/grok-imagine-video) 中无需编写代码即可实验视频模型。比较提供商、调整提示词并下载结果。要访问，请点击 [模型列表](https://vercel.com/ai-gateway/models?capabilities=video-generation) 中的任何视频生成模型。

## 四个初始视频模型；17 个变体

- **Grok Imagine**（来自 xAI）：速度快，擅长指令遵循。可在几秒钟内创建和编辑带有风格转换的视频。

- **Wan**（来自阿里巴巴）：专注于基于参考的生成和多镜头叙事，能够在场景间保持身份一致性。

- **Kling**（来自快手）：擅长图片生成视频和原生音频。新的 3.0 模型支持带自动场景转换的多镜头视频。

- **Veo**（来自 Google）：提供高视觉保真度和物理真实感。原生音频生成，具有电影级照明和物理效果。

## 理解视频请求

视频模型需要的不仅仅是描述你想要什么。与图像生成不同，视频提示词可以包括运动提示（相机移动、物体动作、时间）以及可选的音频指导。每个提供商通过 `providerOptions` 暴露不同的能力，解锁根本不同的生成模式。详见 [文档](https://vercel.com/docs/ai-gateway/capabilities/video-generation) 了解特定模型的选项。

## 生成类型

AI Gateway 初步支持 4 种视频生成类型：

| 类型 | 输入 | 描述 | 示例用例 |
|------|------|------|----------|
| 文本生成视频 | 文本提示词 | 描述场景，获得视频 | 广告创意、解说视频、社交内容 |
| 图片生成视频 | 图片，可选文本提示词 | 为静态图片添加动画 | 产品展示、Logo 动画、照片动画 |
| 首尾帧 | 2 张图片，可选文本提示词 | 定义开始和结束状态，模型填充中间 | 前后对比、延时摄影、过渡效果 |
| 参考生成视频 | 图片或视频 | 从参考图片或视频中提取角色并将其放入新场景 | 代言人内容、一致的品牌角色 |

各模型创建者在 AI Gateway 上的当前能力如下：

| 模型创建者 | 能力 |
|-----------|------|
| xAI | 文本生成视频、图片生成视频、视频编辑、音频 |
| Wan | 文本生成视频、图片生成视频、参考生成视频、音频 |
| Kling | 文本生成视频、图片生成视频、首尾帧、音频 |
| Veo | 文本生成视频、图片生成视频、音频 |

## 文本生成视频

描述你想要的内容，获得视频。模型处理视觉效果、运动，以及可选的音频。非常适合仅用简单文本提示词生成超现实、制作级质量的镜头。

### 示例：大规模编程式视频生成

按需为你的应用、平台或内容管道生成视频。无需许可费用或制作，只需提示词和输出。

此示例使用 `klingai/kling-v2.6-t2v` 从文本提示词生成指定宽高比和时长的视频。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'klingai/kling-v2.6-t2v',
  prompt: `Wide shot of a rocket lifting off from launch pad at dawn.
    Massive plume of orange fire and white smoke billows outward
    from the base. The rocket rises slowly at first, engines blazing,
    then accelerates upward. Pink and orange sunrise sky
    in the background. Ocean visible in the distance.`,
  aspectRatio: '16:9',
  duration: 5,
  providerOptions: {
    klingai: {
      mode: 'pro',
      sound: 'on',
    },
  },
});
```

### 示例：创意内容生成

将简单的提示词转化为精美的视频片段，用于社交媒体、广告或叙事，具有自然的运动和电影级质量。

通过设置非常具体和描述性的提示词，`google/veo-3.1-generate-001` 生成具有巨大细节和精确所需运动的视频。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'google/veo-3.1-generate-001',
  prompt: `Close-up of a great horned owl turning its head slowly.
    Enormous yellow eyes with intricate iris detail.
    Every feather texture visible, from soft facial disc to ear tufts.
    The owl blinks once, deliberately.`,
  aspectRatio: '16:9',
});
```

## 图片生成视频

提供起始图片并为其添加动画。控制初始构图，然后让模型生成运动。

### 示例：产品图片动画

将现有产品照片转化为交互式视频。

`klingai/kling-v2.6-i2v` 模型在你传递图片 URL 和提示词中的运动描述后为产品图片添加动画。

```typescript
const { videos } = await generateVideo({
  model: 'klingai/kling-v2.6-i2v',
  prompt: {
    image: blackHoodie, // 图片 URL 或 Data URL
    text: `The orange tabby cat walks slowly across the black hoodie.
      Warm natural light. Cozy lifestyle scene. Smooth, cinematic.`,
  },
  duration: 5,
  providerOptions: {
    klingai: { mode: 'pro' },
  },
});
```

### 示例：动画插图

为静态艺术作品注入微妙的运动。非常适合主题内容或大规模营销。

### 示例：生活方式和产品摄影

为食品、饮料或生活方式照片添加微妙的运动，用于社交内容。

这里，一张咖啡的图片被渲染为更具交互性的视频，带有光照方向和细微细节。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'alibaba/wan-v2.6-i2v',
  prompt: {
    image: 'https://your-storage.com/coffee-pour.png',
    text: `Coffee swirls gently in the cup, steam rises slowly,
     warm morning light shifts subtly`,
  },
  resolution: '1280x720',
  duration: 3,
});
```

## 首尾帧

定义开始和结束状态，模型在它们之间生成无缝过渡。

### 示例：前后对比

服装更换、产品对比、时间变化。上传两张图片，获得无缝过渡。

这里使用两张图片定义开始和结束状态，用于提示词和提供商选项中。

在此示例中，`klingai/kling-v3.0-i2v` 允许你在 `image` 中定义起始帧，在 `lastFrameImage` 中定义结束帧。模型生成它们之间的过渡。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'klingai/kling-v3.0-i2v',
  prompt: {
    image: startFrameDataUrl, // 空房间
    text: `Smooth cinematic transition: The empty loft fills with furniture.
      A green velvet sofa fades into view, followed by a wooden coffee table.
      Potted plants rise from the floor. A patterned rug materializes.
      Framed artwork appears on the walls. Bookshelves on the back wall.
      Gentle, seamless transformation.`,
  },
  duration: 5,
  providerOptions: {
    klingai: {
      lastFrameImage: endFrameDataUrl, // 装修后的房间
      mode: 'std',
    },
  },
});
```

## 参考生成视频

提供人物/角色的参考视频或图片，模型提取其外观和声音，生成以他们为主角的新场景，保持身份一致性。

在此示例中，使用 2 张狗的参考图片生成最终视频。

使用 `alibaba/wan-v2.6-r2v-flash`，你可以指示模型利用提示词中的人物/角色。Wan 建议在多参考视频生成的提示词中使用 `character1`、`character2` 等以获得最佳结果。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'alibaba/wan-v2.6-r2v-flash',
  prompt: `character1 and character2 are playing together on the beach in San Francisco
    with the Golden Gate Bridge in the background, sunny day, waves crashing`,
  resolution: '1280x720',
  duration: 5,
  providerOptions: {
    alibaba: {
      referenceUrls: [shibaImage, yorkieImage],
    },
  },
});
```

## 视频编辑

通过风格转换改造现有视频。提供视频 URL 并描述你想要的转换。模型应用新风格，同时保留原始运动。

这里，`xai/grok-imagine-video` 利用先前生成的源视频编辑为水彩风格。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai';

const { videos } = await generateVideo({
  model: 'xai/grok-imagine-video',
  prompt: `Transform into watercolor painting style, soft flowing brushstrokes,
   paint bleeding at edges, delicate washes of color, artistic and dreamlike`,
  providerOptions: {
    xai: {
      videoUrl: dogVideo,
    },
  },
});
```

## 开始使用

有关视频模型的更多示例和详细配置选项，请查看 [视频生成文档](https://vercel.com/docs/ai-gateway/capabilities/video-generation)。你还可以在 [视频生成快速入门](https://vercel.com/docs/ai-gateway/getting-started/video) 中找到简单的入门脚本。

查看这些视频模型的更新日志，了解更详细的示例和提示词。
