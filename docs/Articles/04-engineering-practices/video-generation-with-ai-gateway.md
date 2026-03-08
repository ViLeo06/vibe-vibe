---
title: 260307-使用 AI Gateway 生成视频
description: Vercel AI Gateway 已支持视频生成。借助 AI SDK 6，你可以生成电影级视频、同步音频，并构建可保持角色一致性的个性化内容工作流。
author: Jerilyn Zheng
source: https://vercel.com/blog/video-generation-with-ai-gateway
date: '2026-03-07'
category: 04-engineering-practices
tags:
- Vercel
- AI Gateway
- 视频生成
- AI SDK
---

# 使用 AI Gateway 生成视频

**作者：Jerilyn Zheng**

**原文：[查看原文](https://vercel.com/blog/video-generation-with-ai-gateway)**

<div class="article-meta">
</div>

AI Gateway 现在已经支持视频生成。你可以通过 AI SDK 6 生成电影级质感的视频、同步音频，以及具备角色一致性的个性化内容。

## 两种入门方式

视频生成功能目前处于 Beta 阶段，适用于 Pro、Enterprise 方案以及付费 AI Gateway 用户。

### AI SDK 6：编程式生成视频

你可以用和文本、图片相同的接口，以编程方式生成视频。统一的 API、统一的鉴权流程，以及统一的可观测性面板，覆盖整条 AI 调用链路。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'xai/grok-imagine-video',
  prompt: 'A golden retriever catching a frisbee mid-air at the beach'
})
```

### AI Gateway Playground：无代码实验

你也可以直接在模型详情页内嵌的 [AI Gateway Playground](https://vercel.com/ai-gateway/models/grok-imagine-video) 中试验视频模型，无需先写代码。你可以比较不同提供商、调整提示词并下载结果。要查看可用模型，可以打开[模型列表](https://vercel.com/ai-gateway/models?capabilities=video-generation)。

## 四个初始视频模型；17 个变体

- **Grok Imagine**（来自 xAI）：速度快，指令遵循能力强，适合快速生成和编辑带风格转换的视频。

- **Wan**（来自阿里巴巴）：擅长基于参考内容生成视频和多镜头叙事，能较好地保持角色或主体一致性。

- **Kling**（来自快手）：长于图生视频和原生音频生成；新的 3.0 模型还支持带自动场景转换的多镜头视频。

- **Veo**（来自 Google）：侧重高视觉保真度和更强的物理真实感，同时支持原生音频生成，适合电影感画面和复杂运动效果。

## 理解视频请求

视频模型需要的，不只是“你想要什么”。与图片生成不同，视频提示词通常还要描述运动信息，比如镜头移动、主体动作、时间变化，以及可选的音频指引。不同提供商会通过 `providerOptions` 暴露各自特有的能力，从而解锁不同的生成模式。具体能力可以参考[视频生成文档](https://vercel.com/docs/ai-gateway/capabilities/video-generation)。

## 生成类型

AI Gateway 初步支持 4 种视频生成类型：

| 类型 | 输入 | 描述 | 示例用例 |
| --- | --- | --- | --- |
| 文本生成视频 | 文本提示词 | 描述场景，直接生成视频 | 广告创意、解说视频、社交内容 |
| 图片生成视频 | 图片，可选文本提示词 | 为静态图片补充运动 | 产品展示、Logo 动画、照片动效 |
| 首尾帧 | 两张图片，可选文本提示词 | 定义起始与结束状态，由模型补齐中间过渡 | 前后对比、延时变化、转场效果 |
| 参考生成视频 | 图片或视频 | 从参考素材中提取角色或主体，并放入新场景 | 品牌角色内容、统一形象的视频系列 |

当前各模型创建方在 AI Gateway 中支持的能力如下：

| 模型创建方 | 能力 |
| --- | --- |
| xAI | 文本生成视频、图片生成视频、视频编辑、音频 |
| Wan | 文本生成视频、图片生成视频、参考生成视频、音频 |
| Kling | 文本生成视频、图片生成视频、首尾帧、音频 |
| Veo | 文本生成视频、图片生成视频、音频 |

## 文本生成视频

只用文字描述你想要的内容，就能直接生成视频。模型会处理视觉效果、运动轨迹以及可选音频，非常适合用简洁提示词生成高完成度镜头。

### 示例：大规模编程式视频生成

你可以按需为应用、平台或内容管道批量生成视频，无需传统拍摄和制作流程，只要给出提示词和参数即可。

下面这个示例使用 `klingai/kling-v2.6-t2v`，根据文本提示词生成指定宽高比和时长的视频。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

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
      sound: 'on'
    }
  }
})
```

### 示例：创意内容生成

你也可以把简短提示词转成更精致的视频片段，用于社交媒体、广告或叙事内容，让画面拥有自然运动和更强的电影感。

通过更具体、更具描写性的提示词，`google/veo-3.1-generate-001` 可以生成细节丰富、运动精准的视频。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'google/veo-3.1-generate-001',
  prompt: `Close-up of a great horned owl turning its head slowly.
    Enormous yellow eyes with intricate iris detail.
    Every feather texture visible, from soft facial disc to ear tufts.
    The owl blinks once, deliberately.`,
  aspectRatio: '16:9'
})
```

## 图片生成视频

提供一张起始图片，再为它补充运动。你可以先控制初始构图，再让模型负责后续动态表现。

### 示例：产品图片动画

把现有产品图转成更具互动感的视频内容。

下面的 `klingai/kling-v2.6-i2v` 会根据图片 URL 与提示词中的运动描述，为产品图片生成动态效果。

```typescript
const { videos } = await generateVideo({
  model: 'klingai/kling-v2.6-i2v',
  prompt: {
    image: blackHoodie,
    text: `The orange tabby cat walks slowly across the black hoodie.
      Warm natural light. Cozy lifestyle scene. Smooth, cinematic.`
  },
  duration: 5,
  providerOptions: {
    klingai: { mode: 'pro' }
  }
})
```

### 示例：动画插图

为静态插画注入细微运动。这类方式尤其适合做主题内容或大规模营销素材。

### 示例：生活方式和产品摄影

你也可以为食品、饮品或生活方式图片加入克制而自然的动态，适合社交内容制作。

这里，一张咖啡图片被转成更具互动感的视频，并带有微妙的光线和细节变化。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'alibaba/wan-v2.6-i2v',
  prompt: {
    image: 'https://your-storage.com/coffee-pour.png',
    text: `Coffee swirls gently in the cup, steam rises slowly,
     warm morning light shifts subtly`
  },
  resolution: '1280x720',
  duration: 3
})
```

## 首尾帧

你可以定义起始状态和结束状态，再由模型自动生成中间的平滑过渡。

### 示例：前后对比

这种方式适合表现服装更换、产品对比或时间变化。上传两张图片，就能得到自然衔接的过渡视频。

下面这个示例中，`klingai/kling-v3.0-i2v` 使用 `image` 定义起始帧，使用 `lastFrameImage` 定义结束帧，由模型补全两者之间的变化过程。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'klingai/kling-v3.0-i2v',
  prompt: {
    image: startFrameDataUrl,
    text: `Smooth cinematic transition: The empty loft fills with furniture.
      A green velvet sofa fades into view, followed by a wooden coffee table.
      Potted plants rise from the floor. A patterned rug materializes.
      Framed artwork appears on the walls. Bookshelves on the back wall.
      Gentle, seamless transformation.`
  },
  duration: 5,
  providerOptions: {
    klingai: {
      lastFrameImage: endFrameDataUrl,
      mode: 'std'
    }
  }
})
```

## 参考生成视频

你可以提供人物或角色的参考图片、参考视频，让模型提取外观特征并生成以它们为主体的新场景，同时尽量保持身份一致。

下面这个示例里，使用两张狗狗的参考图生成最终视频。

借助 `alibaba/wan-v2.6-r2v-flash`，你可以在提示词里通过 `character1`、`character2` 等角色名来对应多个参考对象。Wan 官方也建议在多参考视频生成时使用这种写法，以得到更稳定的结果。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'alibaba/wan-v2.6-r2v-flash',
  prompt: `character1 and character2 are playing together on the beach in San Francisco
    with the Golden Gate Bridge in the background, sunny day, waves crashing`,
  resolution: '1280x720',
  duration: 5,
  providerOptions: {
    alibaba: {
      referenceUrls: [shibaImage, yorkieImage]
    }
  }
})
```

## 视频编辑

你也可以直接改造现有视频，例如做风格迁移。只要提供视频 URL，再描述你希望发生的变化，模型就会在尽量保留原始运动的前提下应用新风格。

这里，`xai/grok-imagine-video` 会把一个已有视频改造成水彩画风格。

```typescript
import { experimental_generateVideo as generateVideo } from 'ai'

const { videos } = await generateVideo({
  model: 'xai/grok-imagine-video',
  prompt: `Transform into watercolor painting style, soft flowing brushstrokes,
   paint bleeding at edges, delicate washes of color, artistic and dreamlike`,
  providerOptions: {
    xai: {
      videoUrl: dogVideo
    }
  }
})
```

## 开始使用

如果你想看更多视频模型示例和详细配置项，可以直接查阅[视频生成文档](https://vercel.com/docs/ai-gateway/capabilities/video-generation)。

如果想快速上手，也可以查看[视频生成快速入门](https://vercel.com/docs/ai-gateway/getting-started/video)。

另外，模型更新日志里也会持续补充更多示例和提示词写法。
