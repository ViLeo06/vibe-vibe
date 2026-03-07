---
title: "5.2 组件库"
description: "shadcn/ui、Ant Design、Element Plus、TDesign...这些现成的积木，什么时候用哪个？"
---

# 5.2 组件库

> **本节目标**：了解主流组件库的特点和适用场景，学会根据项目需求选择合适的组件库。

组件库是预先做好的"乐高积木"。你不需要每次都手写按钮、输入框、对话框，直接拿现成的来用。老师傅说："选对组件库，能省掉 80% 的 UI 工作。"

## shadcn/ui（推荐）

[shadcn/ui](https://ui.shadcn.com/)

![image-20260222210620318](/images/Advanced/image-20260222210620318.png)

序言里已经介绍过，这里展开说说为什么它是 VibeCoding 的首选。

**核心理念**：不是 npm 包，而是把组件源代码直接复制到你的项目里。你拥有完全控制权。

![image-20260222210651904](/images/Advanced/image-20260222210651904.png)

**为什么适合 AI 开发**：

普通组件库装完后代码藏在 node_modules 深处，AI 看不到也改不了；shadcn/ui 把代码直接放进你的项目文件夹，AI 可以像改你自己写的代码一样修改它。

- 代码在你项目里，AI 可以直接读取和修改
- 组件质量高，无障碍支持好——比如视障用户用屏幕朗读器也能正常操作按钮和表单
- 生态丰富，有大量扩展组件和模板

**让 AI 用好 shadcn/ui**：

告诉 AI 你项目需要使用 shadcn/ui，它就会优先使用这些组件。

![image-20260222210713180](/images/Advanced/image-20260222210713180.png)

**shadcn/ui 生态扩展**：

shadcn/ui 的生态在持续壮大，社区贡献了很多高质量的扩展：

| 扩展库 | 用途 |
|-------|------|
| [Magic UI](https://magicui.design/) | 动画组件、特效组件 |
| [Aceternity](https://www.aceternity.com/) | 高级 UI 特效组件 |

<table><tbody>
  <tr>
    <td><img src="/images/Advanced/image-20260222210923284.png" /></td>
    <td><img src="/images/Advanced/image-20260222210905692.png" /></td>
  </tr>
</tbody></table>

## 其他主流组件库

<div class="lib-grid">

<a href="https://ant.design/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211429267.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Ant Design</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">阿里出品的企业级组件库，60+ 组件覆盖几乎所有场景，中文文档最完善。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">后台管理</span>
    <span class="lib-card-tag">企业内部工具</span>
    <span class="lib-card-tag">数据密集型</span>
  </div>
</a>

<a href="https://element-plus.org/zh-CN/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212101447.png" />

  <div class="lib-card-header">
    <span class="lib-card-name">Element Plus</span>
    <span class="lib-card-badge lib-badge-vue">Vue 3</span>
  </div>
  <div class="lib-card-desc">饿了么团队出品，Vue 3 生态最主流的组件库。用 Vue 做后台，这基本是默认选择。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Vue 首选</span>
    <span class="lib-card-tag">后台管理</span>
    <span class="lib-card-tag">中文文档</span>
  </div>
</a>

<a href="https://tdesign.tencent.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212117578.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">TDesign</span>
    <span class="lib-card-badge lib-badge-multi">多框架</span>
  </div>
  <div class="lib-card-desc">腾讯出品，同时支持 React、Vue 2/3、小程序。设计规范完整，提供 Figma 资源。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">React/Vue/小程序</span>
    <span class="lib-card-tag">设计体系</span>
  </div>
</a>

<a href="https://arco.design/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212134560.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Arco Design</span>
    <span class="lib-card-badge lib-badge-multi">React / Vue</span>
  </div>
  <div class="lib-card-desc">字节跳动出品，60+ 组件经过大规模验证，内置图标库和风格配置平台。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">数据密集型</span>
    <span class="lib-card-tag">主题定制</span>
  </div>
</a>

<a href="https://m3.material.io/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222222521284.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Material Design 3</span>
    <span class="lib-card-badge lib-badge-multi">Google 官方</span>
  </div>
  <div class="lib-card-desc">Google 官方设计规范（目前已更新到第 3 版），定义了颜色、排版、组件等标准。非组件库，而是设计语言本身。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">设计规范</span>
    <span class="lib-card-tag">跨平台</span>
    <span class="lib-card-tag">Dynamic Color</span>
  </div>
</a>

<a href="https://mui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211543203.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">MUI (Material UI)</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">基于 Google Material Design 规范的第三方 React 组件库，全球使用最广泛，主题定制能力强。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Material Design</span>
    <span class="lib-card-tag">国际化</span>
  </div>
</a>

<a href="https://www.radix-ui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222211603616.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">Radix UI</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">无样式底层组件库，只管行为和无障碍，样式完全你说了算。shadcn/ui 的底层。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">零样式</span>
    <span class="lib-card-tag">无障碍</span>
    <span class="lib-card-tag">完全定制</span>
  </div>
</a>

<a href="https://www.heroui.com/" target="_blank" class="lib-card">
  <img src="/images/Advanced/image-20260222212148692.png" />
  <div class="lib-card-header">
    <span class="lib-card-name">HeroUI</span>
    <span class="lib-card-badge lib-badge-react">React</span>
  </div>
  <div class="lib-card-desc">原名 NextUI，基于 Tailwind CSS，开箱即用就好看，内置动画效果。</div>
  <div class="lib-card-tags">
    <span class="lib-card-tag">Tailwind CSS</span>
    <span class="lib-card-tag">开箱即用</span>
    <span class="lib-card-tag">现代感</span>
  </div>
</a>

</div>



## 组件库选择决策树

<LibraryDecisionTree />

## 让 AI 帮你用组件库

不管选了哪个组件库，关键是在提示词里**明确告诉 AI 你用的是哪个**：

> "用 shadcn/ui 的 Table 组件展示用户列表，支持排序和分页"

> "用 Ant Design 做一个订单管理表格，支持筛选和导出"

---

::: info 下一步
组件库解决了静态界面的问题。想让页面"动"起来？继续看 [5.3 动画与交互库](./03-animation-libraries.md)。
:::

