---
title: "6.0 领取你的数据库"
description: "注册免费数据库服务，获取连接字符串，5 分钟跑通第一次连接"
---

# 6.0 领取你的数据库

> **本节目标**：注册一个免费的云端 PostgreSQL 数据库，拿到连接字符串，验证连接成功。

在序言里你已经理解了数据库的概念。现在，动手领一个属于你自己的数据库。

## 为什么用云端数据库

你可能想问：能不能在自己电脑上装一个 PostgreSQL？当然可以，但老师傅不推荐新手这么做：

- 本地安装配置繁琐，容易踩坑
- 部署到线上时还要迁移数据
- 云端数据库**免费套餐**对个人项目完全够用

云端数据库的好处是：注册即用、自动备份、随处可访问。你在家写代码连的是它，部署到 Vercel 连的也是它，省去了环境差异的烦恼。

## 方案一：Neon（推荐）

**Neon** 是一个专注于 PostgreSQL 的无服务器数据库平台——你不用自己装数据库、管服务器，Neon 帮你搞定，你只管连上去用。免费套餐慷慨，冷启动快（冷启动是数据库闲置后第一次被访问时的"热身"延迟），非常适合个人项目。

![image-20260222223036476](/images/Advanced/image-20260222223036476.jpg)

### 注册步骤

**第一步：访问 Neon 官网**

打开 [neon.tech](https://neon.tech)，点击右上角 **Log In**。推荐使用 GitHub 账号登录，一键授权即可。

![image-20260222223100463](/images/Advanced/image-20260222223100463.png)

**第二步：创建项目**

![image-20260222223148855](/images/Advanced/image-20260222223148855.png)

登录后创建第一个项目（Project）。填写以下信息：

- **Project Name**：随便起，比如 `my-first-app`
- **Region**：选择离你最近的区域。国内用户推荐选 **Singapore（新加坡）**，延迟最低
- **Database Name**：默认 `neondb` 即可

![image-20260222223211499](/images/Advanced/image-20260222223211499.png)

**第三步：获取连接字符串**

项目创建完成后，Neon 会直接展示你的 **Connection String（连接字符串）**。它长这样：

```
postgresql://username:password@ep-xxx-xxx-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

![image-20260222223303602](/images/Advanced/image-20260222223303602.png)

::: warning 保管好你的连接字符串
连接字符串包含用户名和密码，相当于数据库的钥匙。**绝对不要**提交到 GitHub 或发给别人。把它存到项目的 `.env` 文件里：

```bash
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

:::

### Neon 免费套餐包含什么

| 资源 | 免费额度 |
|------|---------|
| 存储空间 | 512 MB |
| 计算时长 | 每个项目100计算 |
| 项目数量 | 100  个 |
| 分支数量 | 10 个 |

对于学习和个人项目，这些额度绑绑有余。

## 方案二：Supabase

**Supabase** 不仅提供 PostgreSQL 数据库，还自带认证、存储、实时订阅等功能。如果你想要一个"全家桶"式的后端服务，可以选它。

### 注册步骤

**第一步：访问 Supabase 官网**

打开 [supabase.com](https://supabase.com)，点击 **Start your project**，用 GitHub 登录。

![image-20260222223411365](/images/Advanced/image-20260222223411365.png)

**第二步：创建组织和项目**

![image-20260222223437677](/images/Advanced/image-20260222223437677.png)

- **Organization**：填一个组织名

- **Project Name**：比如 `my-first-app`

- **Database Password**：设置一个强密码，**记下来**

- **Region**：选 **Southeast Asia (Singapore)**

  ![image-20260222223509375](/images/Advanced/image-20260222223509375.png)



**第三步：获取连接字符串**

项目创建后，进入主页，点击顶部 Connect ：

![image-20260222223646279](/images/Advanced/image-20260222223646279.png)

Method 选择 Transaction pooler（这就是前面说的"连接池"的具体实现方式，选它就对了）；如有空还可以配置MCP。

![image-20260222224026943](/images/Advanced/image-20260222224026943.png)

```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```



### Supabase 免费套餐包含什么

| 资源 | 免费额度 |
|------|---------|
| 数据库存储 | 500 MB |
| 文件存储 | 1 GB |
| 带宽 | 5 GB / 月 |
| 项目数量 | 2 个 |
| Edge Functions | 50 万次 / 月 |

::: tip Neon vs Supabase 怎么选？

- **只要数据库** → 选 Neon，专注、轻量、免费额度大
- **想要全家桶**（数据库 + 认证 + 存储 + 实时） → 选 Supabase
- 本教程推荐 **Neon**，因为我们用标准 PostgreSQL + 独立的认证方案（Better Auth），不被平台捆绑
:::

## 验证连接

拿到连接字符串后，怎么确认它能用？

### 方法一：让 AI 帮你验证

最简单的方式，直接告诉 AI：

> "用我 .env 里的 DATABASE_URL 测试数据库连接，确认能连上"

AI 会写一段简单的测试脚本，运行后告诉你连接是否成功。

### 方法二：用 Drizzle Studio 可视化查看

如果你的项目已经配置了 Drizzle ORM，可以运行：

```bash
pnpm drizzle-kit studio
```

浏览器会打开一个可视化界面，你能直接看到数据库里的表和数据。如果能打开，说明连接没问题。

![image-20260222230115049](/images/Advanced/image-20260222230115049.png)

### 方法三：去平台控制台直接看

最直观的方式是直接打开数据库平台的 Web 控制台，像看 Excel 一样浏览数据。开发时建议常开着控制台页面，随时确认数据是否写入正确。

**Neon Console**：登录后进入项目，点击左侧 **Tables** 即可浏览表数据，也可以在 **SQL Editor** 里直接运行查询。

![image-20260222230548275](/images/Advanced/image-20260222230548275.png)

**Supabase Table Editor**：登录后进入项目，点击左侧 **Table Editor**，可以像 Excel 一样直接浏览、筛选、编辑表数据。

![image-20260222230528345](/images/Advanced/image-20260222230528345.png)

### 常见连接问题

| 报错信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Invalid URL` | 连接字符串格式错误 | 检查有没有多余的空格、引号是否匹配 |
| `password authentication failed` | 密码错误 | 去平台重置密码，更新 `.env` |
| `connection refused` | 网络不通 | 检查是否需要 `?sslmode=require`（SSL 加密你和数据库之间的通信，防止密码在传输中被截获） |
| `too many connections` | 连接数超限 | 使用连接池（Pooler）地址 |

::: tip 连接池是什么？
数据库的每个连接都要消耗 1-3 MB 内存，而且连接数有上限（通常几十到几百个）。如果你的应用每次请求都新建一个连接、用完就断开，很快就会耗尽连接数，后面的用户全部报错。

**连接池（Connection Pooler）** 就像一个"连接中介"——它预先建好一批数据库连接，应用需要时借一个用，用完还回去，下一个请求复用同一个连接。这样 100 个并发用户可能只需要 10 个数据库连接。

Neon 和 Supabase 都提供连接池地址（通常端口不同，比如 Supabase 的直连是 5432，连接池是 6543）。**部署到生产环境时，务必使用连接池地址**，否则流量一大就会 `too many connections`。
:::

## 把连接字符串配置到项目

在你的 Next.js 项目根目录，创建或编辑 `.env` 文件：

```bash
# 数据库连接（替换成你自己的）
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

确保 `.gitignore` 里有 `.env`（Next.js 项目默认已包含）。

然后告诉 AI：

> "项目已配置好 DATABASE_URL，请用 Drizzle ORM 初始化数据库连接"

AI 会帮你创建 `src/db/index.ts` 等文件，把数据库连接跑通。

---

::: info 下一步
数据库领到了，连接也通了。接下来在 [6.1 数据存储演进](./01-storage-evolution.md) 中，你会理解为什么需要数据库，以及它比 JSON 文件强在哪里。
:::
