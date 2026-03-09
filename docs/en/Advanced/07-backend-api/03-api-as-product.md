---
title: "7.3 Making APIs Better"
description: "Version management, API docs, batch operations, file uploads, real-time updates—treat your API like a product"
chapter: "Chapter 7"
---

# 7.3 Making APIs Better

> **Goal for this section**: As your API grows and gains more consumers, learn how to evolve it from "functional" to "great"—with documentation, version management, batch operations, file uploads, and real-time updates.

---

## Xiaoming's New Headaches

Xiaoming's "Personal Douban" has been running smoothly for a month. Input validation is in place, error handling is unified, and the connection pool is configured. He's adding new features—favorites, share links, user comments.

Each new feature means more endpoints. Favorites: add favorite, remove favorite, get favorites list. Comments: post comment, delete comment, get comments list, like comment. Sharing: generate share link, get share statistics.

Xiaoming counted—he already has over thirty endpoints.

Then he ran into three headaches.

---

## Can't Even Remember All the Endpoints

Every time he writes frontend code, Xiaoming has to open the backend folder and dig through `route.ts` files to confirm "what's this endpoint called, what parameters does it need, what format does it return?" Sometimes he misremembers a parameter name—writing `movieId` as `movie_id`—and spends half an hour debugging before realizing it was a typo.

More awkwardly, his friend Lao Wang wants to build a "Year in Review" mini-program based on his movie data. Lao Wang asks: "Where's your API documentation? I need to know what endpoints you have and how to call them."

Xiaoming froze—he had no documentation. He could only open WeChat and tell Lao Wang one endpoint at a time: "Movie list is GET /api/movies, supports page, limit, tag, sort parameters..." After twenty-something messages, Lao Wang said: "Can't you just give me a documentation link?"

### Let AI Generate API Documentation

You don't need to write documentation by hand. The industry has a standard format called **OpenAPI** (formerly Swagger), specifically designed to describe API endpoints—each endpoint's URL, HTTP method, request parameters, response format, error codes, all defined in a structured way.

Once you generate OpenAPI documentation, you can render it with **Swagger UI** into an interactive web page. This page isn't just for reading—you can fill in parameters and click "Send" right on the page to test each endpoint in real-time. Like a built-in Postman.

This benefits you too: no more digging through code to confirm endpoint details, just open the docs page and see everything at a glance.

Tell AI:

> "Help me generate OpenAPI 3.0 documentation based on all existing API Routes. Then add an `/api-docs` page using Swagger UI for display, with the ability to test endpoints directly on the page in development environment."

::: tip Keep docs and code in sync
The worst thing is writing documentation, then changing the API later and forgetting to update the docs. The solution is auto-generating docs from code—whenever the endpoint code changes, the docs update automatically. Tell AI "use next-swagger-doc or similar tools to auto-generate OpenAPI docs from route.ts files", and it will set up the automation for you.
:::

---

## Changed One Field Name, Several Frontend Pages Crashed

Xiaoming thought the `score` field in the movie API response wasn't descriptive enough and wanted to rename it to `rating`. He had AI replace all `score` with `rating` in the backend, ran it—and the homepage crashed, search page crashed, favorites page crashed. Because all three pages' frontend code was using `movie.score` to get values, and the backend suddenly changed it to `rating`, the frontend couldn't find the `score` field and threw `undefined`.

"Just changed a field name, why did so many things break?" Xiaoming was frustrated.

The veteran said: "Once an API is in use, changing it is like modifying public infrastructure. You moved a streetlight, everyone who remembered the old location will bump into it at night."

### Backward Compatibility: The Safe Way to Change APIs

**Backward compatibility** means: you changed the API, but the old way of calling it still works. New features are added, old features aren't affected.

A few practical principles:

**Adding fields is fine, deleting fields is dangerous.** Adding a new `rating` field to the response won't affect anyone—the frontend code doesn't use this field, so it just sits quietly in the JSON, no harm done. But deleting the `score` field breaks every place using `movie.score`.

**Keep both during transition.** Want to rename `score` to `rating`? The right approach is:

1. First, **return both** `score` and `rating` in the response (same value)
2. Notify all consumers (including your own frontend): "Please use `rating` going forward, `score` will be removed in the next version"
3. Wait until all callers have migrated, then remove `score`

This process is called **Deprecation**. Don't delete directly—mark as "deprecated" first, giving consumers time to migrate.

**Big changes use version numbers.** If the API needs incompatible major changes (like the entire response structure changing), use URL versioning:

- `/api/v1/movies` — old version, unchanged
- `/api/v2/movies` — new version, new data structure

Old users continue with v1, new features use v2. Once everyone has migrated to v2, sunset v1.

::: warning Do personal projects need version management?
If only your own frontend is calling the API, version management can be simplified—change frontend and backend together. But if others are using your API (like Lao Wang's mini-program), or if your app has a mobile client (app updates are slower than web, old app versions may still call old endpoints), version management becomes essential.

Even for personal projects, developing the habit of "add fields, don't delete fields" does no harm—it prevents many "changed backend but forgot to change frontend" rookie mistakes.
:::

Tell AI:

> "I want to rename the score field to rating in the movie API. Help me do a backward-compatible transition: return both score and rating in the response (same value), and add a Deprecation header. Once I confirm all frontend pages have switched to rating, tell me when I can safely remove score."

---

## Deleting 50 Items at Once vs. Calling Delete 50 Times

Xiaoming wants to build a "batch delete" feature—users check multiple movies on the list page, click "delete selected," and delete them all at once.

The most intuitive approach is frontend looping:

```
for (const id of selectedIds) {
  await fetch(`/api/movies/${id}`, { method: 'DELETE' })
}
```

50 movies, 50 DELETE requests. It works, but has three problems:

**Slow.** 50 requests means 50 network round trips. Even at 50ms each, that's 2.5 seconds total. Users wait several seconds after clicking "delete" before seeing results.

**Inconsistent.** If the network drops on the 30th delete, the first 30 are gone, the last 20 remain. Data is in a "half-finished" awkward state—users think everything is deleted, but 20 are actually left.

**Resource waste.** 50 requests occupy 50 database connections (briefly), adding pressure to the connection pool under high concurrency.

### Batch Operation Endpoints

A better approach is providing a **batch operation endpoint**:

`DELETE /api/movies/batch`

Request body carries the list of IDs to delete: `{ "ids": [1, 3, 5, 7, 9, ...] }`

The backend completes all deletions in **one database transaction**—either all succeed or all rollback, no "half-deleted" situation. And only one network round trip, much faster.

Same idea applies to batch updates (like "mark all selected movies as watched") and batch creation (like "import 100 movies from CSV").

**Rule of thumb: when you find the frontend looping to call the same endpoint, consider whether a batch version is needed.**

Tell AI:

> "Help me add a batch delete movies endpoint `DELETE /api/movies/batch`, receiving an array of IDs (max 100), completing deletion in one database transaction. If any deletion fails (like ID doesn't exist), rollback all and return error message."

::: warning Batch endpoints need quantity limits
Don't let users delete 100,000 items at once—this causes transactions to be too large, table locks too long, even memory overflow. Add a limit to batch endpoints (like max 100 at a time), exceed that and have frontend call in batches.
:::

---

## Users Want to Upload Movie Posters

Xiaoming wants users to attach a poster image to movies. But he found a problem: all previous endpoints send and receive JSON data, but images are binary files that don't fit in JSON.

### multipart/form-data: The Way to Send Files

All previous requests had `Content-Type: application/json`—the request body is a JSON text. But files (images, videos, PDFs) are binary data that can't be directly stuffed into JSON.

**multipart/form-data** is the HTTP format specifically designed for file uploads. It can send text fields and binary files in one request—like submitting movie title (text) and poster image (file) together.

You don't need to understand multipart's underlying encoding. Just know the whole flow:

1. **Frontend**: Use `<input type="file">` for users to select files, then use `FormData` object to package files with other fields, send with `fetch`
2. **Backend**: Extract file from request, validate (size, format), store somewhere, save the **relative path** of the file to database
3. **Frontend**: Prepend domain prefix, display image with full URL

Why store relative paths instead of full URLs? Because domains may change—`localhost:3000` in development, `yourdomain.com` after launch, `cos.ap-shanghai.myqcloud.com` after migrating cloud storage. If the database stores full URLs, every domain change requires batch database updates. Storing relative paths (like `/uploads/poster-abc123.jpg`), frontend prepends domain prefix based on current environment, database stays untouched.

Of course, if your cloud storage domain is already stable (like with custom domain bound), storing full URLs is fine—less concatenation, more direct to use.

### Where to Store Files?

File storage has two options:

**Local storage**—save to server's file system, like `public/uploads/` directory. Simple and direct, use this for development. But problematic after launch: server disk space is limited, and if you use Serverless deployment (like Vercel), there's no persistent file system—files are lost on every deploy.

**Cloud storage**—save to dedicated file storage services, like Tencent Cloud COS, Cloudflare R2, AWS S3, Alibaba Cloud OSS. Files live in cloud, accessed via URL, not consuming server resources. Use this after launch.

Tell AI (development phase):

> "Help me add a movie poster upload feature. Frontend uses file picker, backend receives image and saves to public/uploads directory, stores image path in movies table's posterUrl field. Limit file size to 5MB, only allow jpg/png/webp formats. Preview image on frontend before upload."

Tell AI (before launch):

> "Change file upload from local storage to Cloudflare R2 (or your chosen cloud storage service). Return public access URL after upload."

::: warning File upload security considerations
- **Limit file size**: Without limits, someone uploading a 1GB file can crash your server memory
- **Limit file types**: Only allow formats you need (images only allow jpg/png/webp), don't accept .exe, .sh, or other executables
- **Don't use user-provided filenames**: Users might upload a file named `../../../etc/passwd` for path traversal attacks. Backend should generate filenames itself (like using UUID)
:::

::: tip Unified upload entry, swappable backend
Whether you're using local storage or cloud storage now, tell AI: "Encapsulate file upload logic into a unified function, local storage in development, switch to cloud storage by only changing this function's implementation at launch." This way frontend code and business logic don't change at all, only the storage layer.

This is like wall sockets—whether you plug in a desk lamp or electric fan, the socket interface is the same. To the frontend, the upload endpoint is always "send file, get URL"—whether the file ultimately lives on local hard drive or Tencent Cloud COS, the frontend doesn't need to know.
:::

---

## When Do You Need Real-Time Updates

Xiaoming added the comments feature. User A posts a comment, User B has to refresh the page to see it. Xiaoming wants to make it "see new comments without refreshing"—like WeChat chat, messages appear in real-time.

Real-time updates have three solutions, increasing in complexity:

<RealtimeComparison />

### Polling

The simplest solution: frontend automatically requests the endpoint every few seconds to check for new data.

```
Every 10 seconds: GET /api/movies/1/comments?since=timestamp_of_last_request
```

The benefit is **extremely simple implementation**—just a `setInterval` plus `fetch`, no additional infrastructure needed.

The downside is **resource waste**. Most requests return "no new data." With 1000 users online simultaneously, that's 100 requests per second every 10 seconds, 99% of them useless.

But for Xiaoming's movie comments, polling is completely sufficient—comments aren't high-frequency operations, checking for new comments every 10-30 seconds provides perfectly acceptable user experience.

### SSE (Server-Sent Events)

Server actively pushes data to frontend. Frontend establishes a long connection, server pushes when there's new data, no need for frontend to repeatedly request.

**One-way**: Only server can push, frontend can't send messages through this channel. Good for "notification push," "new comment alerts," "order status updates"—server has new message and pushes to you, you don't need to reply.

Benefit is **good real-time performance, low resource consumption**—only transmits when there's actually new data, no useless requests. And based on HTTP, no additional protocol support needed, simple deployment.

### WebSocket

A **persistent bidirectional channel** between frontend and server, both sides can send messages anytime.

Good for **scenarios needing frequent bidirectional communication**—online chat, collaborative editing (multiple people editing one document simultaneously), real-time games. In these scenarios, not only does server push data to frontend, but frontend also frequently sends data to server.

Downside is **high complexity**—need to handle connection drops and reconnection, heartbeat detection, message ordering guarantees. Deployment is also more complex, requiring WebSocket-supporting servers.

### How to Choose?

| Scenario | Recommended Solution | Reason |
|------|---------|------|
| Comment list, notification alerts | Polling or SSE | Low update frequency, one-way push is enough |
| Data dashboard (updates per minute) | Polling | Low update frequency, polling is simplest |
| Real-time order status updates | SSE | Server push, no frontend reply needed |
| Online chat | WebSocket | Needs bidirectional real-time communication |
| Collaborative editing | WebSocket | Needs bidirectional real-time communication + conflict resolution |
| Real-time games | WebSocket | Needs extremely low-latency bidirectional communication |

A simple decision rule: **If only server needs to push data to frontend, use SSE. If frontend also needs to frequently send data to server, use WebSocket. If update frequency is low (seconds to minutes), polling is easiest.**

For Xiaoming's comments feature, polling is enough:

> "Comment list needs auto-refresh, check for new comments every 15 seconds. Use SWR's refreshInterval for automatic polling, no need to hand-write setInterval. Only return comments added since last request. No WebSocket needed."

::: tip Why use SWR or TanStack Query instead of hand-written polling
When you tell AI "make an auto-refreshing comment list", Claude Code with `vercel-react-best-practices` Skill loaded will likely use **SWR** or **TanStack Query** (formerly React Query) and similar data fetching libraries. Both come with built-in request deduplication (same data used by multiple components on same page, only one request), automatic caching, automatic cleanup when component unmounts, automatic retry on failure. Much more worry-free than hand-writing `setInterval + fetch`, and less prone to "page switched away but requests keep firing" bugs.

SWR is lighter, API is cleaner, maintained by Vercel team. TanStack Query has richer features, supports more complex caching strategies, optimistic updates, infinite scroll, etc. For Xiaoming's comment polling, both are more than enough. You don't need to understand their usage, AI will pick an appropriate one based on project situation—don't be surprised when you see them appear in code.
:::

---

## API as Product

Reviewing everything covered in this section, there's a common mindset shift: **APIs aren't just "backend concerns," they're "products" for frontend (and other consumers)**.

Good APIs, like good products:

- **Have documentation**—consumers know how to use without digging through code or asking
- **Are backward compatible**—upgrades don't break old users, changes have transition periods
- **Support batch operations**—efficient, don't make consumers do repetitive work
- **Have clear error messages**—when problems occur, know whose issue it is and how to fix
- **Support multiple data formats**—not just JSON, but also handle file uploads
- **Are real-time when needed**—real-time when appropriate, don't waste resources when not

You don't need to be perfect from the start. First get CRUD working (7.0), when data volume and requirements grow add pagination and filtering (7.1), after launch when encountering dirty data and errors add validation and error handling (7.2), when you have many endpoints add documentation and version management (7.3)—this is the complete path from "runs" to "great."

Each step is driven by real problems, not premature over-engineering. This is also the core philosophy of Vibe Coding: **make it run first, then make it run well.**

---

::: tip Core takeaways from this section

- **API documentation**: Use OpenAPI/Swagger for auto-generation, convenient for yourself, reference for others
- **Backward compatibility**: Adding fields is fine, deleting fields needs transition; big changes use version numbers
- **Batch operations**: Looping endpoint calls → convert to batch endpoint, use transactions for consistency
- **File uploads**: Local storage for development, cloud storage for launch; remember to limit size and types
- **Real-time updates**: Polling is simplest, SSE good for one-way push, WebSocket for bidirectional communication
:::

---

::: info Next step
API is built, but now anyone can call your endpoints—no login, no access control. Go to [Chapter 8: Who Can Access My Data](../08-auth-security/index.md) to learn about authentication and security.
:::