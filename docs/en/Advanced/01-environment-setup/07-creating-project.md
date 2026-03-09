---
title: "1.7 Creating a Project"
description: "From folder naming conventions to creating a project template"
chapter: "Chapter 1"
---

# 1.7 Creating a Project

> **After reading this section, you will gain:**
>
> - Learn folder naming conventions and avoid development issues caused by Chinese paths
> - Learn how to use the official scaffolding tool to quickly create a standard project structure
> - Understand the directory structure of a Next.js project

The most common mistake beginners make is manually creating AI-generated code file by file. The right approach is to use a project template and let AI help you create a standard project through scaffolding commands.

## Preparation

### Create a project folder

Before creating a project, first create a folder with an **English-only path** in your file manager.

**Important**: No level in the full path can contain Chinese characters or spaces.

| Incorrect Example | Reason |
|----------|------|
| `C:/Users/张三/projects` | Username is in Chinese |
| `C:/Users/李/my project` | Folder name contains a space |

| Correct Example | Notes |
|----------|------|
| `C:/Users/YourName/projects` | All English, no spaces |
| `/Users/yourname/projects` | macOS user directory |

**Recommended folder structure**:

```
my-projects/          ← Main folder
├── my-first-app/     ← Project 1
├── blog-app/         ← Project 2
└── store-app/        ← Project 3
```

### Open a terminal in the folder

After creating the folder, you need to open a terminal inside it to run commands.

| System | Action |
|------|------|
| **Windows** | Right-click an empty area in the folder → "Open in Terminal" |
| **Older Windows** | Hold `Shift + Right-click` → "Open PowerShell window here" |
| **Mac** | Finder → Services → New Terminal at Folder |
| **IDE** | Cursor/VS Code/Trae: File → Open Folder, built-in terminal auto-locates |

### What is a file path

A file path is the location of a file in the file system. When you tell AI "modify src/app/page.tsx", AI needs to find that file through its path.

**Absolute path**: The full path starting from the root directory

```
Windows:  C:\Users\YourName\projects\my-app\package.json
macOS:    /Users/yourname/projects/my-app/package.json
```

**Relative path**: A path starting from the current directory

```
./package.json        # package.json in the current directory
../other-project      # other-project in the parent directory
src/app/page.tsx      # src/app/page.tsx in the current directory
```

## Naming conventions

Development tools do not handle Chinese paths well, which can easily lead to all kinds of strange errors.

| Correct Example | Incorrect Example |
|----------|----------|
| `my-project` | `我的项目`, `my project` |
| `user-profile` | `user profile`, `用户资料` |
| `app.tsx` | `应用.tsx`, `app 文件.tsx` |

**Rules**:

- ✅ Use lowercase English letters
- ✅ Use hyphens `-` to separate words
- ❌ Avoid Chinese characters, spaces, and special characters

::: tip Why can't I use Chinese?

**Common errors**: `ENOENT: no such file or directory`, `MODULE_NOT_FOUND`

Chinese paths may cause encoding issues, path parsing errors, and tool compatibility problems.

:::

## Create a project

Modern frameworks all provide official scaffolding tools. A standard project can be created with a single command.

```bash
# Create a Next.js project (my-app is the project name, you can change it)
pnpm create next-app@latest my-app

# Create a Vite + React project
pnpm create vite@latest my-app -- --template react
```

During creation, you will be asked about configuration options:

- **TypeScript**: Recommended to choose Yes
- **ESLint**: Recommended to choose Yes
- **Tailwind CSS**: Choose based on your needs
- **src directory**: Recommended to choose Yes (placing code in the `src/` directory makes the structure clearer)
- **App Router**: Recommended to choose Yes

::: tip Don't want to memorize commands?

If you can't remember the command, you can directly copy the example command from this tutorial. But the command is simple, so it's recommended to memorize it:

```bash
pnpm create next-app@latest my-app
```

:::

::: details 🎮 Click to try: Scaffolding simulator
<ProjectScaffoldFlow />

> 💡 **Practice**: Click "Start Creating Project", choose configuration options step by step, and observe how the project file structure is generated
>
> 🎯 **Core concept**: Scaffolding creates a project with a single command—don't manually create files one by one
:::

## Next.js project structure

After creation is complete, you will see a structure like this:

```
my-next-app/
├── src/
│   ├── app/                 # Pages and APIs
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Global layout
│   │   └── api/             # API endpoints
│   │
│   ├── components/          # UI components
│   └── lib/                 # Utility functions
│
├── public/                  # Static assets (images, fonts)
├── package.json             # Dependency management
└── tsconfig.json            # TypeScript configuration
```

**Simple explanation**:

- `src/app/` - Stores page files and endpoints
- `src/components/` - Stores reusable UI components
- `src/lib/` - Stores utility functions
- `public/` - Stores static assets like images

::: tip Where should code go?

When AI says "create a user list page", create `users/page.tsx` under `src/app/`.

When AI says "create a button component", create `Button.tsx` under `src/components/`.

:::

## A more convenient way: use /project-init

::: tip Coming soon

This tutorial provides the `/project-init` skill, which can automate the entire project initialization process.

**What it can do**:

1. **Environment check**: Automatically checks the Node.js version and whether pnpm is installed
2. **Smart template recommendations**: Recommends the right tech stack based on your needs (PRD, design mockups, feature ideas)
3. **Preset templates**:
   - Recommended configuration (frontend only)
   - SaaS full stack (with database, authentication, payment)
   - Marketing website/Landing Page
   - Admin panel/Dashboard
   - Lightweight SPA
4. **Compatibility check**: Automatically handles issues such as React version, Tailwind v4, component library conflicts, and more
5. **Automated installation**: Non-interactive commands to create a project in one click

**Usage example**:

> Use /project-init to create a SaaS project that requires user login and a database

It will guide you through the entire process, including environment checks, requirements analysis, template selection, dependency installation, and environment variable configuration.

After the tutorial is officially released, installation instructions will be provided. To learn more about Skills, see [2.3 Skills System](../02-ai-tuning-guide/03-mcp-and-skills.md).

:::

## Start the project

```bash
# Enter the project directory (replace my-app with your project name)
cd my-app

# Start the development server
pnpm dev
```

Open your browser and visit `http://localhost:3000`. If you see the welcome page, the project was created successfully.

## FAQ

### Q: Which template should I use?

| Project Type | Recommended Template |
|----------|----------|
| Full-stack app | Next.js |
| Frontend SPA | Vite + React |
| Static site | Astro |

This tutorial uses **Next.js + TypeScript + Tailwind CSS**, which is a full-stack solution well-suited for AI-assisted development.

### Q: What should I do if I'm already using a Chinese path?

In File Explorer, do the following:

1. Delete the `node_modules` folder
2. Create a new English-named folder
3. Copy the remaining files into the new folder
4. Run `pnpm install` in the new folder

### Q: Can I have AI create files one by one?

Not recommended. Letting AI create files one by one can easily lead to missing files, wasted time, and configuration mistakes. **The correct approach**: first use scaffolding to create a standard project, then let AI modify it within the existing structure.

## Core idea

**Use templates instead of starting from scratch**.

| Method | Result |
|------|------|
| Scaffolded creation | Standard structure, preconfigured, one-click startup |
| Manual creation | Easy to miss files, configuration errors, time wasted |

::: tip Project naming suggestions
It is recommended to use lowercase letters and hyphens in project names, and avoid Chinese characters and spaces (for example, `my-todo-app`). This helps prevent compatibility issues with some tools.
:::

**Verification after project creation**:

- [ ] Understand the purpose of each folder (`src/`, `public/`, `app/`, etc.)
- [ ] The project starts successfully (`pnpm dev` succeeds, and the browser can access `http://localhost:3000`)

## Related content

- See also: [1.5 Package Management and Project Configuration](./05-package-manager-and-config.md)
- See also: [1.8 Localhost and Ports](./08-localhost-and-ports.md)
- Next: [Chapter 2 AI Tuning Guide](../02-ai-tuning-guide/)