---
title: "Set Up a Cloud Development Environment in 5 Minutes"
description: "A Beginner's Guide to CNB Cloud-Native Development"
order: 1
---

# Just a Browser to Start, and Your Entire Coding Environment Is Ready

Are you tired of:

- Spending days setting up a development environment?
- Your computer not being powerful enough to run Docker?
- Slow GitHub downloads, where cloning a repo takes half an hour?

Stop struggling with it! **Just open a browser and start coding**—the environment is configured automatically, and all dependencies are preinstalled and ready to use.

> In theory, any device that can run a browser can do VibeCoding—even a refrigerator or a smartwatch.

## Preinstalled Development Environment

This project is based on the image built and published by [Eyre@VibeVibe.cn](https://www.hangkangfu.cn), and it's ready to use out of the box:

- **AI Coding**: Claude Code, OpenAI Codex, Gemini Code Assist
- **Runtime**: Node.js 24.x, Python 3.11+, Docker
- **Development Tools**: Git, GitHub CLI, VS Code (53 extensions)
- **Operations Panel**: 1Panel (port 34246, username `cnb`, password `IloveCNB.`)

For detailed configuration, see [default-dev-env](https://cnb.cool/nfeyre/default-dev-env).

## Basic Concepts

| Concept | Description |
|-----|------|
| **Repository** | A place to store code, essentially a project's folder |
| **Organization** | A namespace for managing multiple repositories and team members |
| **Fork** | Copy someone else's repository to your own account so you can modify it freely without affecting the original |
| **Clone** | Download a remote repository locally for development |
| **Branch** | An independent line of code used to develop different features in parallel |

## 1. Sign Up and Log In

Open Tencent Cloud [cnb.cool](https://cnb.cool) and use WeChat to scan the QR code in the upper-right corner to sign up or log in.

![Scan to log in](/images/Advanced/image-20260203194524705.jpg)

![Registration page](/images/Advanced/image-20260203194703145.png)

### Real-Name Verification (Required)

After registering, you must complete real-name verification before you can use CNB services.

![Real-name verification](/images/Advanced/image-20260203194825714.png)

After verification, go to the [verification page](https://cnb.cool/profile/auth):

![Verification page](/images/Advanced/image-20260203194851637.png)

![Fill in information](/images/Advanced/image-20260203194948051.png)

## 2. Create an Organization

CNB repositories must be managed under an organization. Click the `＋` in the upper-right corner, select `Create Organization`, fill in the organization name and related description, then click `Create` to finish creating the organization.

- [Create organization page](https://cnb.cool/new/groups)

![Create organization](/images/Advanced/image-20260203195108016.png)

![Enter organization name](/images/Advanced/image-20260203195234651.png)

An organization is a namespace for teams to manage members and resources. Before creating repository resources, you need to create an organization to manage members, repositories, and other resources.

## 3. Create a Development Environment

### Fork the Repository

Click to open the [vibestudio-default-dev](https://cnb.cool/vibevibe/vibestudio-default-dev) repository, then click Fork:

![Fork repository](/images/Advanced/image-20260203195620152.png)

### Start Cloud-Native Development

After forking it to your own repository, click the "Cloud-Native Development" button and wait a moment for the development environment to be created:

![Start development environment](/images/Advanced/image-20260203195641644.png)

### Connect to the Development Environment

After the workspace is created successfully, you can:

- Open WebIDE directly for online editing
- Use the SSH login command to connect with an IDE that has Remote SSH installed

![Connection methods](/images/Advanced/image-20260203200027101.png)

::: danger
**Important Reminder:**

Any code modified in the cloud IDE **must be committed to Git and pushed!**

The cloud-native development environment will be automatically reclaimed after being idle. If your code is not pushed to the remote repository, it will be lost once the environment is reclaimed.
:::

## 4. Configure Claude Code

The environment automatically installs the dependencies needed for development. When you open it, you'll be prompted to configure the GLM KEY to use Claude Code.

| Configure Key | Clipboard Permission |
|----------|-----------|
| ![Configure key](/images/Advanced/image-20260203200258701.png) | ![Clipboard permission](/images/Advanced/image-20260203200406122.png) |

When pasting the key, you'll be prompted to access your computer's clipboard—just allow it.

One-click configuration for the MCP dedicated to the GLM coding package:

| Configure MCP | Configuration Complete |
|----------|----------|
| ![Configure MCP](/images/Advanced/image-20260203200450374.png) | ![MCP configuration complete](/images/Advanced/image-20260203200500173.png) |

After the configuration is complete, enter `claude` to begin your coding journey:

![Launch Claude](/images/Advanced/image-20260203200538588.png)

## 5. Connect to a CNB Repository Locally

### Get an Access Token

After logging in, go to the [Access Token](https://cnb.cool/profile/token) page and create a token.

### Clone the Repository

```bash
git clone https://cnb.cool/your-org-name/repo-name.git
# Username: cnb
# Password: the access token you created
```

For more usage details, see [CNB Official Documentation - Access Token](https://docs.cnb.cool/zh/develops/token).

## Appendix

### 1. Set the Interface to Chinese

Click the Extensions button in the sidebar and install the Chinese language pack:

![Extensions button](/images/Advanced/image-20260203202605236.png)

Press `Ctrl+Shift+P` to open the "Command Palette", then type `display` to filter and show the "Configure Display Language" command, and press `Enter`:

![Command Palette](/images/Advanced/image-20260203202810201.png)

Select "Language" to switch the UI language:

![Select language](/images/Advanced/image-20260203202830872.png)

Select Chinese and confirm. After the automatic restart, the interface will switch to Chinese:

![Chinese interface](/images/Advanced/image-20260203202918342.png)

### 2. Migrate an Existing Local Project

If you already have a local project, you can migrate it to CNB in one click:

```bash
cnb-init-from https://your-repo-url.git
```

### 3. What Is an Access Token?

An access token is like your "digital key" and is used for:

- Cloning code from a remote repository
- Pushing code to a repository
- Accessing the artifact repository

How to get it: After logging in, go to the [Access Token](https://cnb.cool/profile/token) page and create one.

---

For more information, see the [CNB Official Documentation](https://docs.cnb.cool/zh/)