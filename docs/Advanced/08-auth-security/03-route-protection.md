---
title: "8.3 路由保护与权限控制"
description: "Middleware、CORS、页面级 vs 接口级保护、角色权限——确保每个请求都经过检查"
chapter: "第八章"
---

# 8.3 路由保护与权限控制

> **本节目标**：理解为什么前端隐藏入口不等于安全，学会用 Middleware 和权限控制守住每一个路由。

---

## 前端隐藏不是安全

小明给"个人豆瓣"加了管理后台 `/admin`，可以批量删除电影、管理用户评论。他在前端导航栏里没有放 `/admin` 的入口，觉得这样就安全了——普通用户看不到入口，自然就进不去。

直到有一天，朋友老王在群里说："你这个管理后台挺好用的，我帮你删了几条重复的电影。"

小明吓了一跳："你怎么进去的？"

老王："我在浏览器地址栏直接输了 `localhost:3000/admin`，就进去了啊。"

小明这才明白：**前端隐藏入口只是掩耳盗铃**。不在导航栏放链接，只是让用户"看不到"入口，但任何人都可以在地址栏手动输入 URL。更进一步，攻击者可以用 curl 发请求、写脚本批量调用你的 API——前端的"隐藏"在这些方式面前形同虚设。这就像你把家门钥匙藏在花盆下面，然后把花盆用布盖住。你觉得别人看不到花盆就找不到钥匙，但任何人只要掀开布就能拿到。真正的保护必须在**服务端**完成——不是"藏起入口"，而是"没有钥匙就打不开门"。

## Middleware——Next.js 的守门员

在 Next.js 中，你不需要在每个页面都写权限判断。只需要在项目根目录放一个 `middleware.ts` 文件——它就像网站的守门员，**每一个请求**到达页面或 API 之前，都要先经过它的检查。用户请求 `/admin`，Middleware 拦截，检查是否登录、是否是管理员。未登录就重定向到 `/login`，不是管理员就返回 403——403 的意思是"我知道你是谁，但你没权限"，和 401"你是谁？先登录"不同——通过了才放行到 `/admin` 页面。这个检查发生在服务端，用户的浏览器根本不会收到 `/admin` 页面的内容——不是"页面加载了再跳转"，而是"页面压根没发给你"。

> 跟 AI 说："创建一个 middleware.ts，拦截所有以 /admin 开头的路径。如果用户没有登录或者角色不是 admin，重定向到登录页。同时保护所有 /api/admin 开头的接口。"

<details>
<summary>好奇 Middleware 长什么样？展开看看</summary>

```typescript
// middleware.ts（项目根目录）
import { betterFetch } from '@better-fetch/fetch'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 检查用户是否登录
  const { data: session } = await betterFetch('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') || '' },
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// 指定哪些路径需要保护
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

</details>

Middleware 不只能保护页面，也能保护 API。通过 `matcher` 配置，你可以精确控制哪些路径需要检查——`/dashboard/:path*` 保护所有 dashboard 页面，`/admin/:path*` 保护管理后台，`/api/admin/:path*` 保护管理 API。`:path*` 是通配符，意思是"这个路径下的所有子路径"，所以 `/admin/users`、`/admin/settings` 都会被保护。不需要保护的路径（首页、登录页、注册页、公开 API）不写在 matcher 里就行——Middleware 只拦截你指定的路径，其他路径直接放行。

<MiddlewareFlow />

## 页面保护和接口保护缺一不可

小明加了 Middleware，保护了 `/admin` 页面。他觉得安全了——用户在浏览器里访问 `/admin` 会被拦截。但老师傅问了一个问题："你的删除电影接口 `/api/admin/delete-movie` 也保护了吗？"

小明说："Middleware 不是已经拦了 `/admin` 开头的路径吗？"

老师傅说："Middleware 拦的是页面请求。但如果有人直接用 curl 调用 `POST /api/admin/delete-movie`，带上一个合法用户的 Cookie，Middleware 可能拦不住——取决于你的 matcher 配置。而且即使 Middleware 拦了，API 内部也应该有自己的权限检查，这是**纵深防御**的原则。"

为什么两层都要？因为 Middleware 是一道"大门"，但大门后面的每个房间也应该有自己的锁。即使页面被保护了，攻击者仍然可以绕过浏览器，直接用 curl 或 Postman 调用 API 接口——就像有人不走商场正门，而是从员工通道直接进了仓库，你在正门设的安检对他完全无效。如果 API 没有自己的权限检查，攻击者只要拿到一个合法用户的 Cookie，就能用 curl 删除数据、修改配置、甚至提升权限。页面级保护靠 Middleware 拦截加服务端检查，接口级保护靠 API Route 内部校验——两层都在服务端控制，都无法被绕过。这就是安全领域常说的**纵深防御**：不把所有鸡蛋放在一个篮子里，每一层都有自己的防护。

<DefenseInDepth />

> 跟 AI 说："确保所有 /api/admin 开头的接口都在代码内部检查用户权限，不要只依赖 Middleware。"

## CORS——浏览器的跨域安全机制

<CORSMechanism />

小明后来想给"个人豆瓣"加一个功能：调用豆瓣的公开 API 获取电影海报。他在前端写了一个 `fetch('https://api.douban.com/...')`，浏览器控制台立刻报了一个红色错误："跨域请求被阻止（CORS policy）"。他很困惑——这个 API 在浏览器地址栏里直接打开是能看到数据的，为什么用 JavaScript 调用就不行？

这不是 bug，是浏览器的**安全机制**。想象一下：你登录了银行网站，浏览器里存着你的登录 Cookie。然后你打开了一个恶意网站。如果没有跨域限制，这个恶意网站的 JavaScript 可以偷偷向银行网站发请求——因为浏览器会自动带上银行的 Cookie，银行服务器以为是你本人在操作。攻击者就能冒充你转账。CORS（跨域资源共享）就是浏览器的防线：**默认禁止网页里的 JavaScript 向其他域名发请求，除非对方的服务器明确允许**。在浏览器地址栏直接访问不受限制（那是你主动访问），但网页里的 JavaScript 代码发请求会被拦截（因为可能是恶意代码在偷偷发）。

什么时候会遇到 CORS？如果前后端在同一个 Next.js 项目内（本教程的情况），前端调自己的 API Route，不会遇到 CORS 问题，因为是同源的。但如果前后端分离部署——前端在 `app.example.com`，API 在 `api.example.com`——就会遇到。从前端直接调用第三方 API 也会遇到。如果你的前后端在同一个 Next.js 项目里，通常不需要配置 CORS。如果确实需要跨域，告诉 AI："我的前端在 `https://app.example.com`，需要调用 `https://api.example.com` 的接口，帮我配置 CORS，只允许这个域名访问。"

::: warning 不要配置 `Access-Control-Allow-Origin: *`
允许所有域名访问等于没有 CORS 保护。始终指定具体的域名。
:::

## 角色权限控制

<RBACMatrix />

Middleware 解决了"有没有登录"的问题，但小明很快遇到了新问题：老王登录后，居然也能访问 `/admin` 页面——因为 Middleware 只检查了"是否登录"，没检查"是不是管理员"。小明的应用有两种用户：他自己是管理员，能删除电影、管理评论；朋友们是普通用户，只能看电影、写评论。这就需要**基于角色的访问控制（RBAC）**——不同角色能做不同的事。

最简单的实现是在 `user` 表里加一个 `role` 字段：小明的 role 是 `admin`，老王的 role 是 `user`。然后在 Middleware 或 API 里检查 `session.user.role !== 'admin'` 就返回 403。这个检查可以放在 Middleware 里（统一拦截），也可以放在每个 API Route 里（精细控制），最好两个地方都放——又是纵深防御。

随着应用复杂度增长，简单的 admin/user 两个角色可能不够。比如小明的"个人豆瓣"火了，有了几百个用户，他需要几个信任的朋友帮忙管理评论区。这时候就需要更细的角色划分：guest 只能浏览公开内容，user 可以浏览、发布、编辑自己的内容，moderator 拥有 user 的所有权限加上删除违规内容的权力，admin 拥有所有权限。Better Auth 的组织管理插件支持更复杂的权限模型，但对于大多数个人项目，admin/user 两个角色就够了。不要过度设计——等真正需要时再扩展，到时候告诉 AI 你的需求，它会帮你调整权限模型。

> 跟 AI 说："帮我实现完整的路由保护方案：创建 middleware.ts 保护 /dashboard 和 /admin 路径，/admin 路径额外检查用户角色必须是 admin，所有 /api/admin 开头的接口也要在代码内部检查权限，未登录用户重定向到 /login，登录用户访问 /login 时重定向到 /dashboard。"

---

::: tip 本节核心要点
- 前端隐藏入口不是安全措施，真正的保护在服务端
- Middleware 是 Next.js 的统一拦截层，用 `matcher` 指定保护范围
- 页面保护和接口保护缺一不可
- CORS 是浏览器的安全机制，同项目内通常不需要配置
- 角色权限从简单的 admin/user 开始，需要时再扩展
:::

::: info 下一步
路由守住了，接下来去 [安全检查与问题排查](./04-security-checklist.md)——一份开发各阶段的安全清单，以及遇到问题时的快速排查手册。
:::
