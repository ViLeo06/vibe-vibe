---
title: "7.0 Build and Run Your First Full-Stack App"
description: "Build a complete CRUD flow from scratch and verify the full-stack data flow"
chapter: "Chapter 7"
---

# 7.0 Build and Run Your First Full-Stack App

> **Goal of this section**: Have AI generate a complete CRUD app for you, run it, and verify that the data is correct.

In Chapter 6, you got your database set up, and in the introduction, you learned the concept of APIs. Now it’s time to connect them—by building the most classic app of all: a **Todo app**.

## Full-stack data flow: understand it at a glance

Before you start, first understand how data flows:

```
User clicks "Add" → Frontend sends request → Backend API receives it → Drizzle writes to the database
                                                        ↓
User sees new data ← Frontend renders response ← Backend returns result ← Database returns confirmation
```

This is the core loop of a full-stack app. All four CRUD operations follow this same path.

<FullStackFlow mode="dataflow" />

## Tell AI to create the project

You don’t need to handwrite this code. Just tell AI directly:

> "Help me create a Todo app using Next.js + Drizzle ORM + PostgreSQL. It needs full CRUD functionality: add todos, view the list, mark items as complete, and delete todos. Use DATABASE_URL from .env for the database connection."

AI will help you generate the following file structure:

```
src/
├── db/
│   ├── index.ts          # Database connection
│   └── schema.ts         # Table schema definition
├── app/
│   ├── api/todos/
│   │   └── route.ts      # API route (handles CRUD requests)
│   └── page.tsx           # Frontend page (display and interaction)
```

## Review AI’s work

AI generated three types of files. You don’t need to understand every line of code, but you should know what each file is responsible for—so when something goes wrong, you know which file to ask AI to fix.

### 1. Database schema (`schema.ts`)

This file defines "what the data looks like"—what fields a Todo has and what type each field is. Think of it as the database blueprint.

<details>
<summary>Expand if you're curious—totally fine to skip</summary>

```typescript
// src/db/schema.ts
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})
```

Compare this to what you learned in Chapter 6: `id` is the primary key, `title` cannot be empty, `completed` defaults to `false`, and `createdAt` automatically records the creation time.

</details>

### 2. API route (`route.ts`)

This file is the "backend interface"—the frontend sends requests here, and it handles interacting with the database. `POST` corresponds to "Create," `GET` corresponds to "Read"—this is the RESTful design introduced earlier.

<details>
<summary>Expand if you're curious—totally fine to skip</summary>

```typescript
// src/app/api/todos/route.ts

// C - Create: Add a new to-do item
export async function POST(request: Request) {
  const { title } = await request.json()
  const newTodo = await db.insert(todos).values({ title }).returning()
  return Response.json(newTodo[0])
}

// R - Read: Get all to-do items
export async function GET() {
  const allTodos = await db.select().from(todos).orderBy(todos.createdAt)
  return Response.json(allTodos)
}
```

</details>

### 3. Frontend page (`page.tsx`)

This file is the interface users see—the input field, list, checkbox, and delete button. It operates on data by calling the API above:

- When the page loads, call `GET /api/todos` to fetch the list
- When the user enters a title and clicks "Add," call `POST /api/todos`
- When the user clicks a checkbox, call `PATCH /api/todos/[id]` to update the status
- When the user clicks delete, call `DELETE /api/todos/[id]`

## Run it

Now let’s actually run it. It’s completely normal if it doesn’t work the first time—maybe an environment variable is missing, the table hasn’t been pushed, or the port is already in use. These are all part of the beginner experience. Just paste the error into AI.

**Step 1: Push the schema to the database**

```bash
pnpm drizzle-kit push
```

This command syncs the table schema you defined in `schema.ts` to your cloud database.

**Step 2: Start the development server**

```bash
pnpm dev
```

Open `http://localhost:3000`, and you should see an empty todo list.

**Step 3: Try CRUD**

| Operation | What you do | What happens behind the scenes |
|------|---------|--------------|
| Add | Enter "Learn databases" and click Add | `POST /api/todos` → Database inserts a row |
| View | The page automatically refreshes the list | `GET /api/todos` → Database queries all rows |
| Complete | Click the checkbox | `PATCH /api/todos/1` → Database updates the `completed` field |
| Delete | Click the delete button | `DELETE /api/todos/1` → Database deletes the row |

## Verify with Drizzle Studio

Want to see for yourself what’s happening in the database?

```bash
pnpm drizzle-kit studio
```

Once it opens, you’ll be able to see every row in the `todos` table, and it will match exactly what you did on the page.

This is one of your core skills as a product owner—not reading code, but verifying outcomes. Is the data in the database correct? Is the API response format correct? Is the page displaying the right content? If you can verify these three things, you can confidently let AI help you write the backend.

## Common issues

**Q: The list doesn’t update after adding an item?**
Tell AI: "Automatically refresh the list after adding a todo. I don’t want to manually refresh the page." AI will re-fetch the data after the POST request succeeds.

**Q: Deleting returns a 404 error?**
Check whether the API route file path is correct. Next.js dynamic routes require an `[id]` folder: `app/api/todos/[id]/route.ts`.

**Q: There’s no table in the database?**
Make sure you ran `pnpm drizzle-kit push`. If it throws an error, check whether `DATABASE_URL` in `.env` is correct.

## What this example teaches you

What you just completed is a **minimal but complete full-stack app**. It includes:

- **Frontend**: UI, event handling, API calls
- **Backend**: API routes, request handling, data validation
- **Database**: table schema, CRUD operations, data persistence

No matter what kind of app you build next—blog, e-commerce, social—the underlying logic always comes down to these four letters: **CRUD**. The only difference is that the schema gets more complex, the business logic grows, and the UI gets fancier.

---

::: info Next step
Now that you’ve built a working CRUD flow, you’ve experienced the full-stack data flow firsthand. Next, go to [One API Isn’t Enough Anymore](./01-api-growing-pains.md)—to learn how a simple CRUD API needs to evolve as data volume and requirements grow.
:::