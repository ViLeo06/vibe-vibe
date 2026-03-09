---
title: "全栈开发：21天养成思考习惯的小游戏"
author: "王星尧"
description: "从 idea、PRD、UI 设计、云开发到部署上线，完整复盘「问题呕吐机」这款 21 天思考习惯小游戏的全栈开发过程。"
---

# 全栈开发：21天养成思考习惯的小游戏

> 作者：王星尧

# 项目预览

![img](/images/Advanced/1773077481670-40.png)

创作初衷：在AI普及的当下，我发现自己逐渐养成了“遇问题就问AI”的习惯（虽然这很高效），但也让我慢慢丢失了主动思考的能力。于是我有了一个想法：能不能通过一种简单有趣的方式，重新唤醒主动思考的意识，让自己从“被动求助”回归“主动探索”，从一个问题出发，去思考生活中的点滴。基于这个初衷，「问题呕吐机」应运而生。

项目定位：这是一款以“唤醒主动思考”为核心的21天打卡挑战小游戏，旨在通过21天的持续练习，帮助大家重新养成主动思考的习惯（众所周知，养成一个新习惯需要21天的坚持）。

核心玩法与规则：

- 每日打卡：21天挑战期间，「问题呕吐机」每天会随机吐出一个问题，你只需将自己的思考过程填写到文本框中，完成填写即视为当日打卡成功。
- 问题重置：若对当日抽取的问题不满意，可强制重置一次，重新获取新问题。
- 解锁奖励：每次完成打卡、提交思考后，会解锁一段关于机器人的记忆碎片；当你坚持完成21天全部打卡，就能解锁机器人的完整故事，收获属于自己的坚持勋章。
- 注册登录：可保存与修改答案记录
- 每日一个问题，不是要一个正式的答案，只是提醒你，该思考些什么了

项目网址：https://space-vqm.site/

诚邀大家体验~

# 全栈开发流程总览

![img](/images/Advanced/1773077481667-4-1773078928206-121.png)

# 阶段一：产品设计师

在这个角色下，我们要做的是从一个idea到一份专业成熟的PRD（产品需求文档）

## Step 1：从想法到MVP

- 怎么做：

在与AI进行多轮对话之前，要明确这个产品构建的目的，形式。

> 比如：我要做一个21天打卡思考的网页版小游戏，目的是让用户从每日一个问题开始，养成主动思考的习惯。

把核心目标想清楚之后再和AI展开对话，这时候可以一股脑地将你能想到的东西全告诉AI，经过多轮对话之后，让AI总结一个MVP版本出来。

> 比如：我要做一个21天打卡思考的网页版小游戏，目的是让用户从每日一个问题开始，养成主动思考的习惯。问题是由一个叫“问题呕吐机”的小机器人生成的，每天生成一个问题，生成之后用户记录问题回答，之后存入历史库中，之后想修改随时修改。该应用目的不是为了解答问题，而是唤起思考......

- 对话小技巧：

1. 让AI评估这个想法有哪些不足，怎么解决
2. 让AI自己检查想法的逻辑漏洞
3. 最后让AI生成10个关于产品的问题，如果你能回答上来就证明该产品MVP目前合格了

## Step 2：从MVP到PRD

- 怎么做：

把以下标准PRD模版投给AI，你们一起朝着规范PRD的方向完善想法

https://www.vibevibe.cn/Advanced/03-prd-doc-driven/03-prd-template-guide.html

我用到了Gemini的canvas功能，可以一边完善想法，一边修改文档，最终可以导出一份完整的markdown格式的PRD。

![img](/images/Advanced/1773077481667-1.jpeg)

# 阶段二：前端设计师

## Step 1：Stitch设计UI

1. 将写好的PRD再投给AI，并讲清楚你要让Stitch生成该产品的UI，让AI来生成适配的提示词。
2. 用该提示词在Stitch中生成初稿，之后根据需求，和他对话修改就好。

> PS：不用过多纠结文字，文字用代码来修改会很快，样式风格满意即可。

![img](/images/Advanced/1773077481667-2.jpeg)

1. 在生成UI设计图之后，按照以下流程导入Google AIStudio转代码进行调试。

![img](/images/Advanced/1773077481667-3.jpeg)

## Step 2: AI Studio调整UX

这是初步导入进来的样子~

![img](/images/Advanced/1773077481667-4.png)

1. 在AI Studio中调整交互逻辑（界面跳转、按钮设置等），右边窗口中的Preview可以随时查看效果。
2. 调整好之后，按以下流程把项目导入到GitHub中，就可以开始正式的构建了~

![img](/images/Advanced/1773077481667-5.jpeg)![img](/images/Advanced/1773077481667-6.jpeg)

点击右上角GitHub小图标

将项目导入到GitHub上

# 阶段三：后端架构师

> 这里选择了全线上的开发环境，无需本地下载，按以下步骤配置即可，新手友好~

## Step 1：将项目导入云开发环境

> 建议将GitHub仓库设置为Public

1. 打开网站：https://cnb.cool/微信登录注册

![img](/images/Advanced/1773077481667-7.jpeg)

1. 新建仓库，并填写相应信息

![img](/images/Advanced/1773077481667-8.jpeg)![img](/images/Advanced/1773077481667-9.png)

1. 将刚刚的GitHub项目导入开发环境

![img](/images/Advanced/1773077481667-10.jpeg)

创建开发环境之后，在终端执行图中命令，将网址换成你github的项目地址

## Step 2：配置yml文件

1. 打开我的仓库，点击进入项目，右键新建  .cnb.yml文件，复制以下代码并保存

```YAML
# .cnb.yml
$:
  vscode:
    - runner:
        cpus: 8
      docker:
        image: docker.cnb.cool/nfeyre/default-dev-env:latest
      services:
        - vscode
        - docker
      env:
        CNB_WELCOME_CMD: |
          npx @z_ai/coding-helper
      stages:
        - name: start 1P
          script: 1pctl start all
```

![img](/images/Advanced/1773077481667-11.jpeg)![img](/images/Advanced/1773077481667-12.jpeg)![img](/images/Advanced/1773077481667-13.png)

## Step 3：进入开发环境

1. 云原生构建

![img](/images/Advanced/1773077481667-14.jpeg)![img](/images/Advanced/1773077481667-15.png)![img](/images/Advanced/1773077481668-16.jpeg)

1. 启动claude code

![img](/images/Advanced/1773077481668-17.png)![img](/images/Advanced/1773077481668-18.png)

> https://bigmodel.cn/usercenter/proj-mgmt/apikeys在此获取GLM的API Key~
>
> 也可以在咸鱼上搜索GLM API Key
>
> 注意要保存保护好你的API Key哦

进入后选择claude code，按步骤进行需要的配置，启动claude code就可以开始正式的后端构建了~

![img](/images/Advanced/1773077481668-19.png)

## Step 4：后端开发

1. 成功进入开发环境后先让claude code启动项目看一下是否能正常运行。

> 从AI Studio导出的项目，在启动时会遇到在'/workspace/index.html'里没有'/workspace/index.tsx'入口的问题，只需要将文件名为'/workspace/index.html'和'/workspace/index.tsx'的文件从左侧管理栏拖到对话框中，告诉他添加入口即可。

1. 预览无误后，将之前写好的PRD输入给claude code，或者直接以文档形式添加到左侧栏，让其阅读。
2. 如果对前端不满意，依然可以进行迭代调整。
3. 在进行后端开发之前，先让claude code阅读项目文件，并进行后端技术文档的规划，你可以阅读进行修改，无误之后开始实施。

> PS：
>
> 1. 如果是小白，建议先阅读vibe vibe的进阶版内容，你需要先了解后端的相关知识，如注册登录功能要用到的数据库、接入LLM等。
> 2. 在规划好技术文档之后，可以告诉AI将实施计划分步来执行，执行完一步进行反馈与修改。

## Step 5：提交

1. 由于是线上开发环境，在每天修改之后一定要进行提交，保留记录。 在侧边栏中的分支图标中，提交信息可以任意写，写好点击提交即可。

## 其他

1. 关于配乐：我将挑选好的背景音乐导入，让claude code帮我进行了简单的裁剪和添加。 如果要进行较为复杂的音效处理，可以让问问它有什么好用的库。
2. 关于3D效果：同样我让AI统计了一些3D效果的库，比如GSAP库和three.js,根据我的制作需求选择了gasp。
3. 建议在每次开发后，让claude code写一个当次的总结文档，以便下次开发可以同步进度。
4. 由于每次做改动的时候，重新启动网页会出现不成功的状况，手动修改很不方便，可以告诉他创建一个用于检查维护的skill。

# 阶段四：部署

提前决定好在哪里部署，把部署计划交给A。跟着AI做，有错误如实报给AI就好。

prompt：我计划将项目在腾讯云部署，请给我一份详细的部署计划，一步一步指导我完成部署

## 腾讯EdgeOne部署

> 在此之前保证代码已经提交到github上，且本地运行`pnpm build`命令可以成功。

**step1：导入github仓库**

1. 打开EdgeOne控制台 https://console.cloud.tencent.com/edgeone/pages
2. 导入Git仓库
3. 选择github

![img](/images/Advanced/1773077481668-20.jpeg)![img](/images/Advanced/1773077481668-21.jpeg)

**Step2：配置项目**

1. 选择加速区域“全球可用区（不含中国大陆）” 不用担心选择“不含中国大陆”会访问不了，这是快速的部署方式，国内访问依旧正常。 如果你选了包含"中国大陆"的加速区域，就需要 ICP 备案，要走流程消耗一些时间。

2. 构建设置 根据项目的开发框架来填写

   1. | 类型         | Vite   | Next.js |
      | ------------ | ------ | ------- |
      | 部署输出目录 | `dist` | `.next` |

3. 配置环境变量 将.env文件中的变量名和对应变量值填写到表格中

![img](/images/Advanced/1773077481668-22.jpeg)![img](/images/Advanced/1773077481668-23.jpeg)

**Step3：开始部署**

1. 配置完成后，点击开始部署即可。
2. 部署完成后你会得到一个预览地址。这个免费的预览地址只能保留三个小时，下一步需要购买一个自定义域名来使其长期保留。

![img](/images/Advanced/1773077481668-24.jpeg)![img](/images/Advanced/1773077481668-25.jpeg)

**Step4：购买自定义域名**

1. 登录[腾讯云官网](https://cloud.tencent.com/act/pro/spring2026?fromSource=gwzcw.10491264.10491264.10491264&utm_medium=cpc&utm_id=gwzcw.10491264.10491264.10491264&msclkid=df4cc86d430e1fbe76c7a1c7c5ba5eee)，搜索域名注册。
2. 给项目起一个名字，在搜索框中搜索域名。（后缀不同的域名价格不一，具体可参考vibevibe相关教程https://www.vibevibe.cn/Advanced/13-domain-dns/01-domain-setup.html）
3. 将域名加入购物车进行购买，第一次购买要进行实名认证。

**Step5：添加自定义域名**

1. 按照下图步骤输入购买好的域名

![img](/images/Advanced/1773077481668-26.jpeg)![img](/images/Advanced/1773077481668-27.jpeg)

1. 验证域名的归属权

![img](/images/Advanced/1773077481668-28.png)

1. 在控制台搜索云解析 DNS，找到购买的域名

![img](/images/Advanced/1773077481668-29.jpeg)![img](/images/Advanced/1773077481668-30.jpeg)![img](/images/Advanced/1773077481668-31.jpeg)

1. 将解析内容复制到主机记录，将记录值复制到对应记录值栏中，等待两分钟，开始验证

![img](/images/Advanced/1773077481668-32.jpeg)![img](/images/Advanced/1773077481668-33.jpeg)

**Step6：添加CNAME**

1. 按照设置指引打开DNAPod控制台
2. 找到域名，添加记录，复制主机记录和记录值进行填写

![img](/images/Advanced/1773077481668-34.jpeg)

![img](/images/Advanced/1773077481668-35.jpeg)![img](/images/Advanced/1773077481668-36.jpeg)

**Step7：获取HTTPS证书**

1. 在域名管理中，找到自定义域名，获取HTTPS
2. 配置HTTPS证书

![img](/images/Advanced/1773077481668-37.jpeg)![img](/images/Advanced/1773077481668-38.jpeg)![img](/images/Advanced/1773077481668-39.jpeg)

## Vercel部署

> Vercel免费分配域名，且操作简单，但只能境外访问。
>
> 我是先将项目部署到vercel，之后在腾讯云进行国内访问的配置，也可以直接配置到腾讯云。

**Step1：注册 Vercel 账号**

1. 访问 [vercel.com](https://vercel.com)
2.  点击 **Sign Up**
3.  使用 **GitHub** 账号登录（推荐，方便导入仓库）

**Step2：导入项目**

1. 登录后，点击 **"New Project"**
2. 选择 **"Import Git Repository"**
3. 选择你的仓库
4. 点击 **"Import"**

**Step3：配置项目**

Vercel 会自动检测到这是一个 Vite 项目，但我们需要配置环境变量：

**环境变量配置**：

1. 在 **Environment Variables** 部分点击 **"Add New"**
2. 填写变量
3. 点击 **"Add"** 保存

**Step4：开始部署**

1. 检查配置是否正确：

   \- **Framework Preset**: Vite

   \- **Build Command**: `npm run build`

   \- **Output Directory**: `dist`

   \- **Install Command**: `npm install`

1. 点击 **"Deploy"**
2. 等待部署完成（通常 1-2 分钟）
3. 部署成功后，你会得到一个 URL

**Step5：验证部署**

1. 访问你的 Vercel URL
2. 测试核心功能

从一个idea开始，构建你的第一个项目吧！
