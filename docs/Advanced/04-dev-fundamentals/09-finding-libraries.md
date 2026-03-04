---
title: "4.9 别再重复造轮子"
---

# 4.9 别再重复造轮子

> **本节目标**：掌握 Node.js 生态中最常用的库，学会快速找到合适的轮子，把时间花在业务逻辑上。

小明想给应用加个无限滚动功能，打开 Claude Code 说："帮我写一个无限滚动的实现。"

Claude Code 立刻开始写代码。老师傅在旁边看到了，赶紧喊停："等等！你确定要让它写吗？"

小明愣了："AI 能写出来啊，为什么不让它写？"

老师傅说："它确实能写，但那是最低效的方案。如果你用 React，`SWR` 或 `TanStack Query` 已经帮你处理好了无限滚动、缓存、重新验证、错误重试、乐观更新……让 AI 写的话，光处理边界情况就得几百行代码，而且没有经过生产验证。用成熟库更靠谱。"

"AI 的价值不是帮你重新发明轮子，"老师傅继续说，"而是帮你找到最合适的轮子，然后教你怎么用。"

## 一个真实项目遇到的问题和解决方案

在开始之前，先看看一个真实的 Next.js 全栈项目在开发过程中遇到了哪些问题，以及用什么库解决的：

### 问题 1：用户数据频繁变化，每次都重新 fetch 太慢

**遇到的问题**：用户列表页面，每次切换回来都要重新加载，体验很差。而且多个组件同时请求同一个接口，浪费带宽。

**解决方案**：`swr` - 自动缓存请求结果，多个组件共享同一份数据，还能自动重新验证保证数据新鲜度。

### 问题 2：表单验证逻辑散落在各处，改一个地方要改好几个文件

**遇到的问题**：前端验证一遍，后端验证一遍，两边逻辑不一致，经常出 bug。

**解决方案**：`zod` - 定义一次 schema，前后端共用，类型安全，改一处全部生效。

### 问题 3：用户认证要处理 session、cookie、密码加密……太复杂了

**遇到的问题**：自己写认证系统，光处理安全问题就得几周，还不一定靠谱。

**解决方案**：`better-auth` - 开箱即用的认证方案，支持多种登录方式，安全问题都帮你处理好了。

### 问题 4：数据库查询写 SQL 太繁琐，还容易出错

**遇到的问题**：手写 SQL 容易拼错，没有类型提示，改表结构要全局搜索修改。

**解决方案**：`drizzle-orm` - 类型安全的 ORM，写查询有智能提示，改表结构编译器会报错。

### 问题 5：用户上传的内容可能包含恶意脚本

**遇到的问题**：用户输入的 Markdown 或 HTML 可能包含 XSS 攻击代码。

**解决方案**：`sanitize-html` + `rehype-sanitize` - 自动清理危险内容，保留安全的格式。

### 问题 6：表单状态管理太复杂，每个字段都要写一堆代码

**遇到的问题**：受控组件写起来很繁琐，验证、错误提示、提交状态……代码量爆炸。

**解决方案**：`react-hook-form` - 用 Hook 管理表单，代码量减少 70%，性能还更好。

### 问题 7：生产环境进程崩溃了没人知道

**遇到的问题**：Node.js 进程挂了，网站就挂了，还得手动重启。

**解决方案**：`pm2` - 自动重启、负载均衡、日志管理，一个命令搞定。

### 问题 8：日志输出太慢，影响性能

**遇到的问题**：`console.log` 在高并发下会阻塞事件循环。

**解决方案**：`pino` - 异步日志，性能是 `console.log` 的 10 倍以上。

### 问题 9：拖拽排序功能要处理各种边界情况

**遇到的问题**：拖拽涉及鼠标事件、触摸事件、动画、碰撞检测……自己写至少几百行。

**解决方案**：`@dnd-kit/core` - 专业的拖拽库，可访问性、触摸支持、动画全都有。

### 问题 10：图片上传前要压缩，否则太大了

**遇到的问题**：用户上传的照片动辄几 MB，服务器带宽扛不住。

**解决方案**：`browser-image-compression` - 浏览器端压缩图片，减少 80% 流量。

---

**看到了吗？**每一个都是为了解决一个具体的问题。没有一个是"为了用而用"，都是"遇到问题 → 找库 → 解决问题"。

这就是现代 Web 开发的常态——**不是你会不会写，而是你知不知道有现成的解决方案**。

## 为什么不要重复造轮子？

在 AI 辅助开发时代，很多人有个误区：**"反正 AI 能帮我写，为什么不自己写？"**

真相是：

1. **AI 写的"轮子"质量不如成熟库**：
   - 成熟库经过几百万次生产验证，AI 写的代码只经过你的测试
   - 成熟库有完整的边界情况处理，AI 写的代码可能漏掉 90% 的边界情况
   - 成熟库有持续维护和安全更新，AI 写的代码出了问题只能你自己修

2. **维护成本远超你的想象**：
   - 你以为写完就完了？依赖更新、安全漏洞、新需求……都得你自己处理
   - 成熟库有社区帮你解决这些问题，你的代码只有你自己

3. **AI 的真正价值是帮你选库和集成**：
   - 找到最合适的库
   - 读懂库的文档
   - 写出正确的集成代码
   - 处理特殊场景

::: tip AI 时代的开发者价值
你的价值不是"会让 AI 写代码"，而是"会选方案、会组装、会解决问题"。让 AI 帮你造轮子是最低效的行为。
:::

## 如何找到合适的轮子？

### 1. Awesome 系列（精选列表）

Awesome 系列是社区维护的精选资源列表，每个列表都经过严格筛选：

- **[awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs)** - Node.js 生态最全面的精选列表
- **[awesome-react](https://github.com/enaqx/awesome-react)** - React 生态
- **[awesome-vue](https://github.com/vuejs/awesome-vue)** - Vue 生态
- **[awesome-python](https://github.com/vinta/awesome-python)** - Python 生态
- **[awesome](https://github.com/sindresorhus/awesome)** - 所有 awesome 列表的入口

::: tip 快速访问
访问 [node.cool](https://node.cool) 可以直接跳转到 awesome-nodejs
:::

### 2. 其他资源

- **[npm trends](https://npmtrends.com/)** - 对比 npm 包的下载量和趋势
- **[bundlephobia](https://bundlephobia.com/)** - 查看包的体积和依赖
- **[npms.io](https://npms.io/)** - 深度分析包质量的搜索引擎
- **[GitHub Explore](https://github.com/explore)** - 发现热门项目
- **[Libraries.io](https://libraries.io/)** - 跨平台的库搜索引擎

### 3. 让 AI 帮你选库

这是最高效的方式。把需求告诉 Claude Code，让它帮你筛选：

```
我需要一个 Node.js 的日期处理库，要求：
- 活跃维护（最近 6 个月有更新）
- TypeScript 支持
- 文档完善
- 体积小（< 50KB）
- 支持时区处理

请推荐 3 个选项，并说明各自的优缺点。
```

Claude Code 会根据最新的生态情况给你推荐，比你自己搜索快得多。

## 常用 Node.js 库速查

以下是 Node.js 生态中最常用的库，按分类整理。完整列表请查看 [awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs)。

### Web 框架

**什么时候需要**：当你需要处理 HTTP 请求、路由、中间件时。如果只是写个简单脚本，Node.js 内置的 `http` 模块就够了。但如果要构建 Web 应用或 API 服务，框架能帮你省掉 90% 的重复代码（路由匹配、请求解析、错误处理、中间件管理……）。

- **[Fastify](https://github.com/fastify/fastify)** - 高性能 Web 框架
  **场景**：API 服务，需要高并发处理，性能是 Express 的 2-3 倍

- **[Express](https://github.com/expressjs/express)** - 最流行的 Web 框架
  **场景**：通用 Web 应用，生态最完善，找资料最容易，团队协作首选

- **[Hono](https://github.com/honojs/hono)** - 轻量级现代框架
  **场景**：需要在 Cloudflare Workers、Deno、Bun 等多运行时部署时

- **[Next.js](https://github.com/vercel/next.js)** - React 全栈框架（教程推荐）
  **场景**：React 应用，需要 SSR、路由、API 一体化解决方案

- **[Nest](https://github.com/nestjs/nest)** - 企业级框架
  **场景**：大型项目，需要依赖注入、模块化架构、完整的工程化方案

- **[Koa](https://github.com/koajs/koa)** - Express 团队的新作品
  **场景**：喜欢 async/await 风格，需要更灵活的中间件控制

### 数据库 ORM/ODM

**什么时候需要**：当你需要在代码中操作数据库时。手写 SQL 容易拼错、没有类型提示、改表结构要全局搜索修改。ORM 让你用 TypeScript 写查询，有智能提示，改表结构编译器会报错。

- **[Drizzle](https://github.com/drizzle-team/drizzle-orm)** - 类型安全的 ORM（教程推荐）
  **遇到的问题**：手写 SQL 容易拼错，没有类型提示，改表结构要全局搜索修改。
  **解决方案**：用 TypeScript 定义 schema，查询有智能提示，改表结构编译器会报错。
  **为什么不自己写**：类型推导、查询构建器、迁移管理、连接池……自己写的话至少几千行代码。

- **[Prisma](https://github.com/prisma/prisma)** - 功能最全面的 ORM
  **场景**：需要可视化数据库管理、自动生成类型、完整的迁移工具时

- **[TypeORM](https://github.com/typeorm/typeorm)** - 老牌 ORM
  **场景**：需要支持多种数据库（MySQL、PostgreSQL、SQLite 等）的传统 ORM

- **[Mongoose](https://github.com/Automattic/mongoose)** - MongoDB ODM
  **场景**：使用 MongoDB 时的首选，提供 schema 验证和查询构建

- **[Sequelize](https://github.com/sequelize/sequelize)** - 多数据库 ORM
  **场景**：需要在多种 SQL 数据库之间切换时

- **[Knex](https://github.com/knex/knex)** - SQL 查询构建器
  **场景**：不想要完整 ORM，只需要类型安全的查询构建时

### 数据库驱动

**什么时候需要**：当你不想用 ORM，需要直接执行 SQL 时。或者 ORM 底层就是用这些驱动。如果你追求极致性能或需要执行复杂的原生 SQL，直接用驱动更合适。

- **[node-postgres](https://github.com/brianc/node-postgres)** - PostgreSQL 客户端
  **场景**：直接操作 PostgreSQL，不需要 ORM 的抽象层

- **[ioredis](https://github.com/luin/ioredis)** - Redis 客户端
  **场景**：缓存、会话存储、消息队列，性能和功能都比官方客户端强

- **[mongodb](https://github.com/mongodb/node-mongodb-native)** - MongoDB 驱动
  **场景**：不想用 Mongoose，需要更底层的 MongoDB 操作

- **[mysql2](https://github.com/sidorares/node-mysql2)** - MySQL 客户端
  **场景**：操作 MySQL/MariaDB，支持 Promise 和 Prepared Statements

### 数据验证

**什么时候需要**：当你需要验证用户输入、API 请求参数、配置文件时。不验证的话，错误数据会导致应用崩溃或安全漏洞。手写验证逻辑散落各处，前后端不一致，改一个字段要改好几个文件。

- **[Zod](https://github.com/colinhacks/zod)** - TypeScript 优先的 schema 验证（教程推荐）
  **遇到的问题**：前端验证一遍，后端验证一遍，两边逻辑不一致，经常出 bug。改一个字段要改好几个文件。
  **解决方案**：定义一次 schema，前后端共用，类型安全，改一处全部生效。
  **为什么不自己写**：验证规则、错误消息、类型推导……自己写的话至少几百行代码，还没有类型安全。

- **[Joi](https://github.com/sideway/joi)** - 功能强大的验证库
  **场景**：需要复杂验证规则（条件验证、依赖字段）时

- **[Yup](https://github.com/jquense/yup)** - 简单易用的验证库
  **场景**：配合 React Hook Form 使用，语法简洁

- **[ajv](https://github.com/ajv-validator/ajv)** - 最快的 JSON Schema 验证器
  **场景**：需要验证大量数据，性能是首要考虑时

### 认证授权

**什么时候需要**：当你需要用户登录、权限管理时。自己写认证系统要处理密码加密、session 管理、cookie 安全、CSRF 防护、OAuth 集成……光处理安全问题就得几周，还不一定靠谱。

- **[Better Auth](https://github.com/better-auth/better-auth)** - 现代认证库（教程推荐）
  **遇到的问题**：自己写认证系统，光处理安全问题就得几周，还不一定靠谱。密码加密、session、cookie、CSRF……每个都是坑。
  **解决方案**：开箱即用的认证方案，支持多种登录方式（邮箱、OAuth、魔法链接），安全问题都帮你处理好了。
  **为什么不自己写**：密码哈希、盐值、session 管理、token 刷新、CSRF 防护……自己写的话至少几千行代码，还容易出安全漏洞。

- **[Passport](https://github.com/jaredhanson/passport)** - 老牌认证中间件
  **场景**：需要支持 500+ 种登录策略（OAuth、SAML 等）时

- **[Auth.js](https://github.com/nextauthjs/next-auth)** - Next.js 认证方案
  **场景**：Next.js 项目，需要快速集成 OAuth 登录

- **[CASL](https://github.com/stalniy/casl)** - 权限管理库
  **场景**：需要细粒度的权限控制（RBAC、ABAC）时

- **[node-casbin](https://github.com/casbin/node-casbin)** - 访问控制库
  **场景**：需要复杂的访问控制模型（ACL、RBAC、ABAC）时

### HTTP 客户端

**什么时候需要**：当你需要在服务端调用外部 API 时。Node.js 内置的 `http` 模块太底层，要手动处理请求体、响应解析、错误重试……这些库帮你封装好了。

- **[undici](https://github.com/nodejs/undici)** - Node.js 官方高性能 HTTP 客户端
  **场景**：需要极致性能，Node.js 18+ 内置的 `fetch` 就是基于它

- **[axios](https://github.com/axios/axios)** - 最流行的 HTTP 客户端
  **场景**：通用 HTTP 请求，拦截器、自动转换、浏览器兼容性好

- **[got](https://github.com/sindresorhus/got)** - 更好的 HTTP 接口
  **场景**：需要重试、缓存、钩子等高级功能时

- **[node-fetch](https://github.com/node-fetch/node-fetch)** - Fetch API 实现
  **场景**：想在 Node.js 中使用浏览器的 `fetch` API（Node.js 18+ 已内置）

### React 数据获取（重要）

::: tip 为什么需要专门的数据获取库？
你可能觉得"不就是 `fetch` 吗，为什么要用库？"但实际上，数据获取涉及：缓存、重新验证、错误重试、乐观更新、竞态条件处理、离线支持……自己写的话至少几百行代码，还不一定靠谱。
:::

- **[SWR](https://github.com/vercel/swr)** - Vercel 出品的 React Hooks 数据获取库（教程项目使用）
  - 自动缓存、重新验证
  - 实时更新、乐观更新
  - 轻量级（~5KB）
  - 适合简单场景

- **[TanStack Query](https://github.com/TanStack/query)** - 功能最强大的数据获取库
  - 强大的缓存管理
  - 无限滚动、分页
  - 离线支持
  - DevTools 调试工具
  - 适合复杂场景

**对比**：
- SWR：简单、轻量、够用（推荐新手）
- TanStack Query：功能强大、适合复杂应用

### React UI 与交互

**什么时候需要**：当你需要处理复杂的 UI 交互时（表单、拖拽、动画、内容安全）。这些功能自己写的话要处理大量边界情况，用成熟库更可靠。

- **[React Hook Form](https://github.com/react-hook-form/react-hook-form)** - 表单状态管理
  **遇到的问题**：受控组件写起来很繁琐，每个字段都要写 `value`、`onChange`、验证、错误提示、提交状态……代码量爆炸。
  **解决方案**：用 Hook 管理表单，代码量减少 70%，性能还更好（减少重渲染）。
  **为什么不自己写**：表单验证、错误处理、提交状态、字段依赖、动态表单……自己写的话至少几百行代码，还容易出性能问题。

- **[@dnd-kit/core](https://github.com/clauderic/dnd-kit)** - 拖拽库
  **遇到的问题**：拖拽涉及鼠标事件、触摸事件、动画、碰撞检测……自己写至少几百行，还要处理各种边界情况。
  **解决方案**：专业的拖拽库，可访问性、触摸支持、动画全都有，API 灵活易用。
  **为什么不自己写**：拖拽的边界情况太多了——多点触控、键盘操作、屏幕阅读器、性能优化……自己写容易漏掉 90% 的场景。

- **[sanitize-html](https://github.com/apostrophecms/sanitize-html)** - HTML 内容清理
  **遇到的问题**：用户输入的 Markdown 或 HTML 可能包含 XSS 攻击代码（`<script>` 标签、`onerror` 事件等）。
  **解决方案**：自动清理危险内容，保留安全的格式（如 `<b>`、`<a>` 等）。
  **为什么不自己写**：XSS 攻击手段太多了——不仅是 `<script>`，还有事件处理器、`javascript:` 协议、CSS 注入……自己写的话很容易漏掉某种攻击方式。

- **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)** - 浏览器端图片压缩
  **遇到的问题**：用户上传的照片动辄几 MB，服务器带宽扛不住，上传速度慢。
  **解决方案**：浏览器端压缩图片，减少 80% 流量，上传速度快，服务器压力小。
  **为什么不自己写**：图片压缩涉及 Canvas API、EXIF 信息保留、多种格式支持、Worker 线程……自己写的话至少几百行代码，还不一定能保证质量。

### 日期处理

**什么时候需要**：当你需要格式化日期、计算时间差、处理时区时。JavaScript 原生的 `Date` 对象 API 很难用，时区处理容易出错。这些库提供了更友好的 API。

- **[date-fns](https://github.com/date-fns/date-fns)** - 现代日期工具库（推荐）
  **场景**：需要格式化日期、计算时间差，函数式 API，支持 tree-shaking

- **[Day.js](https://github.com/iamkun/dayjs)** - 轻量级替代方案
  **场景**：需要 Moment.js 的 API 但体积更小（2KB vs 67KB）

- **[Luxon](https://github.com/moment/luxon)** - Moment.js 团队的新作品
  **场景**：需要强大的时区和国际化支持

### 测试框架

**什么时候需要**：当你需要确保代码质量、防止回归 bug 时。手动测试太慢，改一个地方要测十个地方。自动化测试让你改代码更有信心。

- **[Vitest](https://github.com/vitest-dev/vitest)** - 快速的单元测试框架（推荐）
  **场景**：Vite 项目的首选，配置简单，速度快，兼容 Jest API

- **[Playwright](https://github.com/microsoft/playwright)** - E2E 测试框架（教程推荐）
  **场景**：测试真实用户流程（登录、下单、支付），支持多浏览器

- **[Jest](https://github.com/jestjs/jest)** - 老牌测试框架
  **场景**：React 项目的传统选择，生态完善

- **[AVA](https://github.com/avajs/ava)** - 并发测试框架
  **场景**：需要并发运行测试，提高测试速度

- **[Mocha](https://github.com/mochajs/mocha)** - 灵活的测试框架
  **场景**：需要高度自定义测试流程时

- **[Sinon.JS](https://github.com/sinonjs/sinon)** - 测试 spy/stub/mock
  **场景**：需要模拟函数调用、监听函数行为

- **[Nock](https://github.com/nock/nock)** - HTTP mocking
  **场景**：测试时需要模拟外部 API 响应

### 命令行工具

**什么时候需要**：当你需要写 CLI 工具、脚本、自动化任务时。原生的 `console.log` 太简陋，参数解析要自己写，交互式提示要处理各种边界情况。

- **[chalk](https://github.com/chalk/chalk)** - 终端字符串样式
  **场景**：CLI 工具需要彩色输出、高亮重要信息时

- **[ora](https://github.com/sindresorhus/ora)** - 优雅的终端 spinner
  **场景**：长时间任务需要显示进度动画时

- **[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)** - 交互式命令行提示
  **场景**：需要用户输入、选择、确认时（如项目初始化向导）

- **[zx](https://github.com/google/zx)** - 用 JavaScript 写 shell 脚本
  **场景**：需要写复杂的自动化脚本，比 Bash 更易维护

- **[commander](https://github.com/tj/commander.js)** - 命令行参数解析
  **场景**：构建复杂的 CLI 工具，需要子命令、选项、帮助文档

- **[yargs](https://github.com/yargs/yargs)** - 命令行参数解析
  **场景**：需要更灵活的参数解析和验证

- **[meow](https://github.com/sindresorhus/meow)** - CLI 应用助手
  **场景**：快速构建简单的 CLI 工具

- **[boxen](https://github.com/sindresorhus/boxen)** - 在终端创建盒子
  **场景**：需要在终端显示醒目的提示框

- **[Ink](https://github.com/vadimdemedes/ink)** - 用 React 写 CLI 应用
  **场景**：需要复杂的终端 UI（如仪表盘、实时更新）

### 日志记录

**什么时候需要**：当你需要在生产环境追踪问题时。`console.log` 在高并发下会阻塞事件循环，没有日志级别、没有结构化输出、没有日志轮转。专业的日志库能提升性能和可维护性。

- **[pino](https://github.com/pinojs/pino)** - 极快的日志库（推荐）
  **遇到的问题**：`console.log` 在高并发下会阻塞事件循环，影响性能。
  **解决方案**：异步日志，性能是 `console.log` 的 10 倍以上，支持结构化输出。
  **为什么不自己写**：异步写入、日志轮转、格式化、性能优化……自己写的话至少几百行代码，还不一定快。

- **[winston](https://github.com/winstonjs/winston)** - 多传输异步日志库
  **场景**：需要同时输出到文件、数据库、远程服务时

- **[consola](https://github.com/unjs/consola)** - 优雅的控制台日志
  **场景**：开发环境需要美观的日志输出

- **[debug](https://github.com/debug-js/debug)** - 轻量级调试工具
  **场景**：需要按模块开关调试日志时

### 文件系统

**什么时候需要**：当你需要操作文件、目录、监听文件变化时。Node.js 内置的 `fs` 模块 API 不够友好，没有 Promise 支持（旧版本），很多常用操作要自己实现。

- **[fs-extra](https://github.com/jprichardson/node-fs-extra)** - fs 模块的增强版
  **场景**：需要复制目录、确保目录存在、读写 JSON 等常用操作

- **[globby](https://github.com/sindresorhus/globby)** - 用 glob 模式匹配文件
  **场景**：需要查找符合特定模式的文件（如 `src/**/*.ts`）

- **[chokidar](https://github.com/paulmillr/chokidar)** - 文件监听器
  **场景**：需要监听文件变化并触发操作（如热重载）

- **[del](https://github.com/sindresorhus/del)** - 删除文件/文件夹
  **场景**：需要安全地删除文件，支持 glob 模式

- **[find-up](https://github.com/sindresorhus/find-up)** - 向上查找文件
  **场景**：需要查找最近的配置文件（如 `package.json`）

### 实用工具

**什么时候需要**：当你需要处理常见的编程任务时。虽然现代 JavaScript 已经很强大，但有些操作还是需要工具库来简化。

- **[lodash](https://github.com/lodash/lodash)** - 实用工具库
  **场景**：需要深拷贝、防抖、节流等工具函数（但优先用原生 JS）

- **[nanoid](https://github.com/ai/nanoid)** - 生成唯一 ID
  **场景**：需要生成短小、安全、URL 友好的唯一标识符

- **[ms](https://github.com/vercel/ms)** - 时间单位转换
  **场景**：需要将 "2 days" 转换为毫秒数

- **[execa](https://github.com/sindresorhus/execa)** - 更好的 child_process
  **场景**：需要执行外部命令，比原生 API 更易用

- **[dotenv](https://github.com/motdotla/dotenv)** - 加载 .env 文件
  **场景**：需要从 `.env` 文件加载环境变量

- **[cheerio](https://github.com/cheeriojs/cheerio)** - 服务端 jQuery
  **场景**：需要在服务端解析和操作 HTML

- **[jsdom](https://github.com/jsdom/jsdom)** - JavaScript 实现的 DOM
  **场景**：需要在 Node.js 中模拟浏览器环境（如测试）

### 构建工具

**什么时候需要**：当你需要打包前端代码、转译 TypeScript、优化资源时。现代前端项目离不开构建工具，它们帮你处理模块打包、代码转译、资源优化、开发服务器等。

- **[Vite](https://github.com/vitejs/vite)** - 现代前端构建工具（推荐）
  **场景**：新项目首选，开发服务器秒启动，HMR 极快

- **[esbuild](https://github.com/evanw/esbuild)** - 极快的 JavaScript 打包器
  **场景**：需要极致的构建速度，用 Go 编写，比 JS 工具快 10-100 倍

- **[Rollup](https://github.com/rollup/rollup)** - ES 模块打包器
  **场景**：构建库（而非应用），输出更小更干净

- **[webpack](https://github.com/webpack/webpack)** - 老牌打包器
  **场景**：老项目维护，或需要特定的 webpack 插件

- **[Parcel](https://github.com/parcel-bundler/parcel)** - 零配置打包器
  **场景**：快速原型开发，不想写配置文件

### 图像处理

**什么时候需要**：当你需要在服务端处理图片时（缩放、裁剪、格式转换、生成缩略图）。浏览器端有 Canvas API，但服务端需要专门的库。

- **[sharp](https://github.com/lovell/sharp)** - 高性能图像处理（推荐）
  **场景**：需要快速处理大量图片，性能是其他库的 4-5 倍

- **[jimp](https://github.com/oliver-moran/jimp)** - 纯 JavaScript 图像处理
  **场景**：需要跨平台兼容性，不想安装原生依赖

- **[qrcode](https://github.com/soldair/node-qrcode)** - 二维码生成器
  **场景**：需要生成二维码（支付、分享链接等）

### 邮件发送

**什么时候需要**：当你需要发送邮件（注册确认、密码重置、通知）时。SMTP 协议很复杂，邮件格式有很多坑（HTML、附件、编码），这些库帮你处理好了。

- **[Nodemailer](https://github.com/nodemailer/nodemailer)** - 发送邮件
  **场景**：需要发送邮件，支持各种 SMTP 服务和传输方式

- **[email-templates](https://github.com/forwardemail/email-templates)** - 邮件模板
  **场景**：需要用模板引擎生成邮件内容

- **[MJML](https://github.com/mjmlio/mjml)** - 响应式邮件标记语言
  **场景**：需要编写在各种邮件客户端都能正常显示的 HTML 邮件

### 任务队列

**什么时候需要**：当你有耗时任务不能阻塞主线程时（发送邮件、处理图片、生成报表）。把任务放到队列里异步处理，失败了可以重试，还能限制并发数。

- **[BullMQ](https://github.com/taskforcesh/bullmq)** - 基于 Redis 的任务队列（推荐）
  **场景**：需要可靠的任务队列，支持优先级、延迟、重试、并发控制

- **[Agenda](https://github.com/agenda/agenda)** - 基于 MongoDB 的任务调度
  **场景**：已经在用 MongoDB，需要定时任务调度

- **[Bree](https://github.com/breejs/bree)** - 任务调度器
  **场景**：需要 cron 风格的定时任务，支持 worker threads

- **[node-resque](https://github.com/actionhero/node-resque)** - Redis 任务队列
  **场景**：需要与 Ruby 的 Resque 兼容

### 进程管理

**什么时候需要**：当你需要在生产环境运行 Node.js 应用时。Node.js 进程崩溃了，网站就挂了。开发环境用 `nodemon` 自动重启，生产环境需要更强大的进程管理器。

- **[PM2](https://github.com/Unitech/pm2)** - 进程管理器（推荐）
  **遇到的问题**：Node.js 进程挂了，网站就挂了，还得手动重启。没有日志管理，出问题不知道原因。
  **解决方案**：自动重启、负载均衡、日志管理、监控面板，一个命令搞定。
  **为什么不自己写**：进程守护、崩溃重启、日志轮转、集群管理……自己写的话至少几千行代码，还不一定稳定。

- **[nodemon](https://github.com/remy/nodemon)** - 自动重启开发服务器
  **场景**：开发环境，代码改动后自动重启服务器

### Node.js 版本管理

**什么时候需要**：当你需要在不同项目间切换 Node.js 版本时。不同项目可能需要不同的 Node.js 版本，手动安装卸载太麻烦。

- **[fnm](https://github.com/Schniz/fnm)** - 快速的 Node.js 版本管理器（推荐）
  **场景**：需要快速切换 Node.js 版本，用 Rust 编写，比 nvm 快得多

- **[nvm](https://github.com/nvm-sh/nvm)** - Node.js 版本管理器
  **场景**：最流行的版本管理器，社区资源最多

- **[n](https://github.com/tj/n)** - 简单的版本管理器
  **场景**：需要最简单的版本切换工具

### 解析器

**什么时候需要**：当你需要解析和处理各种格式的数据时（Markdown、YAML、XML、CSV）。手写解析器容易出错，这些库经过充分测试，处理了各种边界情况。

- **[markdown-it](https://github.com/markdown-it/markdown-it)** - Markdown 解析器
  **场景**：需要将 Markdown 转换为 HTML，支持插件扩展

- **[remark](https://github.com/remarkjs/remark)** - Markdown 处理器
  **场景**：需要对 Markdown 进行复杂的转换和处理

- **[js-yaml](https://github.com/nodeca/js-yaml)** - YAML 解析器
  **场景**：需要读写 YAML 配置文件

- **[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)** - XML 解析器
  **场景**：需要解析 XML 数据（如 RSS、SOAP）

- **[csv-parser](https://github.com/mafintosh/csv-parser)** - CSV 解析器
  **场景**：需要处理 CSV 文件（导入导出数据）

- **[PEG.js](https://github.com/pegjs/pegjs)** - 解析器生成器
  **场景**：需要解析自定义语法（如 DSL、配置语言）

### 压缩

**什么时候需要**：当你需要创建或解压压缩包时（备份、文件下载、资源打包）。Node.js 内置的 `zlib` 模块只支持 gzip，这些库支持更多格式。

- **[Archiver](https://github.com/archiverjs/node-archiver)** - 创建 ZIP/TAR 压缩包
  **场景**：需要打包多个文件供用户下载

- **[pako](https://github.com/nodeca/pako)** - zlib 的纯 JS 实现
  **场景**：需要在浏览器端压缩解压数据

### 安全

**什么时候需要**：当你需要保护 Web 应用免受常见攻击时（XSS、CSRF、点击劫持、SQL 注入）。安全问题很容易被忽视，这些库帮你设置正确的 HTTP 头和防护措施。

- **[helmet](https://github.com/helmetjs/helmet)** - Express 安全中间件
  **场景**：需要设置安全的 HTTP 响应头（CSP、HSTS 等）

- **[rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)** - 速率限制
  **场景**：需要防止暴力破解、DDoS 攻击，限制 API 调用频率

- **[crypto-hash](https://github.com/sindresorhus/crypto-hash)** - 异步哈希
  **场景**：需要计算文件或数据的哈希值

### 静态网站生成器

**什么时候需要**：当你需要构建文档网站、博客、营销页面时。静态网站加载快、安全、易部署，这些生成器让你用 Markdown 写内容，自动生成美观的网站。

- **[VitePress](https://github.com/vuejs/vitepress)** - Vue 驱动的静态网站生成器（教程使用）
  **场景**：构建文档网站，基于 Vite，速度快，主题美观

- **[Astro](https://github.com/withastro/astro)** - 现代静态网站生成器
  **场景**：需要极致性能，支持多框架（React、Vue、Svelte）

- **[Docusaurus](https://github.com/facebook/docusaurus)** - React 文档网站生成器
  **场景**：构建产品文档，功能完善，Facebook 出品

- **[Hexo](https://github.com/hexojs/hexo)** - 博客框架
  **场景**：快速搭建个人博客，主题丰富

### CMS（内容管理系统）

**什么时候需要**：当你需要让非技术人员管理网站内容时。自己写后台管理系统要几周甚至几个月，这些 CMS 提供了开箱即用的内容管理界面。

- **[Strapi](https://github.com/strapi/strapi)** - Headless CMS
  **场景**：需要灵活的内容管理后台，通过 API 提供内容

- **[Ghost](https://github.com/TryGhost/Ghost)** - 博客平台
  **场景**：专业的博客和出版平台，编辑体验好

- **[KeystoneJS](https://github.com/keystonejs/keystone)** - CMS 和 Web 应用平台
  **场景**：需要快速构建数据驱动的应用和管理后台

### 包管理器

**什么时候需要**：当你需要安装和管理 npm 包时。npm 是默认的包管理器，但有更快、更节省磁盘空间的替代品。

- **[pnpm](https://pnpm.io)** - 磁盘空间高效的包管理器（教程推荐）
  **场景**：需要节省磁盘空间（硬链接共享依赖），安装速度快

- **[npm](https://docs.npmjs.com/about-npm)** - 默认包管理器
  **场景**：Node.js 自带，兼容性最好

- **[yarn](https://yarnpkg.com)** - 替代包管理器
  **场景**：需要离线安装、确定性依赖解析

- **[bun](https://bun.sh)** - 一体化工具包
  **场景**：需要极致速度，集成了运行时、打包器、测试框架

::: tip 完整列表
以上只是最常用的库。完整的 Node.js 生态资源请查看：
- [awesome-nodejs 完整列表](https://github.com/sindresorhus/awesome-nodejs)（CC0 协议，可自由使用）
- 或访问 [node.cool](https://node.cool) 快速跳转
:::

## 如何评估一个库？

找到候选库后，用这个清单快速判断：

### 快速判断清单

- ✅ **GitHub stars > 1000**（说明有一定用户基础）
- ✅ **最近 6 个月有更新**（说明在维护）
- ✅ **Issues 响应及时**（说明作者负责）
- ✅ **有完整文档和示例**
- ✅ **TypeScript 支持**（如果你用 TS）
- ⚠️ **依赖数量合理**（太多依赖 = 潜在风险）
- ⚠️ **包体积合理**（用 bundlephobia 查看）
- ⚠️ **License 友好**（MIT/Apache 2.0 等）

### 让 Claude Code 帮你评估

把库的 README 和 package.json 发给 Claude Code，问：

```
这个库适合我的项目吗？有没有更好的替代品？
请从以下角度评估：
1. 维护状态
2. 社区活跃度
3. 文档质量
4. 性能表现
5. 是否有更好的替代方案
```

Claude Code 会给你详细的分析和建议。

## 什么时候可以"造轮子"？

只有以下情况才考虑自己写：

1. **现有方案都不满足需求**（但先确认你真的找遍了）
2. **学习目的**（但别用在生产环境）
3. **性能极致优化**（但先 profile，别过早优化）
4. **依赖太重**（一个简单功能引入 100MB 依赖不值得）

小明听完，重新打开 Claude Code，这次换了个问法："我需要一个 React 数据获取库，要支持缓存和自动重新验证。"

几秒钟后，Claude Code 回复：

```
推荐两个选项：

1. SWR（推荐新手）
   - 轻量级（~5KB）
   - 自动缓存和重新验证
   - 简单易用
   - Vercel 官方维护

2. TanStack Query（功能更强）
   - 强大的缓存管理
   - 支持无限滚动、分页
   - 有 DevTools
   - 适合复杂场景

你的项目是简单的 CRUD 应用，推荐用 SWR。
需要我帮你写集成代码吗？
```

小明选了 SWR，Claude Code 立刻生成了完整的使用示例。从找库到集成，不到 5 分钟。

"看到了吗？"老师傅说，"同样是用 AI，问法不同，结果天差地别。让它帮你造轮子，你得到的是几百行未经验证的代码。让它帮你选轮子，你得到的是经过千万次生产验证的成熟方案。"

---

::: info 下一步
学会找轮子后，接下来学习如何用 AI 高效地集成这些库——[4.7 API 集成实战](./07-api-integration.md)。
:::
