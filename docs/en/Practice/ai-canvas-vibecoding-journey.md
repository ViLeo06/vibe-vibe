---
title: "Open Source AI Canvas: My Vibecoding Journey"
---

# Open Source AI Canvas: My Vibecoding Journey

> Author: Xiao Huaihua · Live Site: [xhh-drawing-board.vibevibe.cn](https://xhh-drawing-board.vibevibe.cn)

## How It Started

The spark came from a Datawhale article about AI image generation. It showed how AI could create images from text prompts — and I immediately thought: what if there was a dedicated canvas where you could combine drawing with AI generation in real time?

I explored several existing workflow tools — ComfyUI, various Gradio-based apps, even some commercial platforms — but none of them felt like a true "canvas" experience. They were either too complex for casual users or too rigid for creative exploration. I wanted something that felt like opening a sketchpad, except AI was your co-artist.

So I decided to build one myself, with Gemini as the AI backbone.

## The First Attempt: One-Shot Chaos

My initial approach was ambitious: describe the entire application to Gemini in one massive prompt and let it generate everything at once.

The result? Chaos.

The generated code was a tangled mess — drawing logic mixed with API calls, UI state scattered everywhere, event handlers conflicting with each other. When something broke, fixing one thing would break two others.

I was on a deadline for a community showcase, and found myself debugging at 4 AM, desperately trying to untangle spaghetti code that neither I nor the AI could fully reason about anymore.

**Lesson learned: one-shot complex implementation is a trap.** The AI can generate a lot of code, but without structure, you get a lot of *bad* code.

## The Pivot: Docs First, Small Iterations

After that painful night, I completely changed my strategy:

### 1. Generate Detailed Dev Docs First

Before writing a single line of code, I had Gemini help me create comprehensive development documentation:

- Feature specifications for each module
- Data flow diagrams
- API interface definitions
- Component responsibility boundaries

### 2. Break Into Versioned Components

Instead of one monolithic app, I split the project into clearly versioned components:

- **v0.1**: Basic canvas with freehand drawing
- **v0.2**: Shape tools (rectangles, circles, lines)
- **v0.3**: AI image generation integration
- **v0.4**: Layer management
- **v0.5**: Export and sharing

### 3. Single Focus Per Iteration

Each version addressed exactly one concern. No "while we're at it" scope creep. If I was working on shape tools, I wasn't touching the AI integration — even if I had ideas for it.

### 4. Version Control on Docs

This was the unexpected game-changer. I version-controlled the development docs alongside the code. When the AI needed context for a new feature, I could feed it the relevant doc version and get coherent output that fit the existing architecture.

## Wrestling with Gemini's API

One of the trickiest parts was the API integration. Gemini's multimodal API has a non-standard format compared to what most tutorials cover:

- Image inputs need specific encoding and MIME type handling
- The response format for image generation tasks differs from text completion
- Rate limiting and error handling required careful retry logic
- Token counting for mixed text-and-image prompts isn't straightforward

I spent considerable time reading API documentation and experimenting with different request formats. The AI helped me write the integration code, but I had to guide it with precise API specs — it couldn't guess the correct format from general knowledge alone.

## Design Philosophy: Accessibility First

Two key design choices shaped the final product:

### Pure Frontend HTML

I deliberately built the canvas as a pure frontend application — no backend server required. Just HTML, CSS, and JavaScript. This means:

- Anyone can open the link and start drawing immediately
- No account creation, no installation, no dependencies
- Works on any device with a modern browser
- Easy to fork and self-host

### API-Friendly Architecture

The AI integration is cleanly abstracted behind an API layer. Users bring their own API key, which stays in their browser's local storage. The architecture makes it trivial to swap Gemini for another provider in the future.

## What I'd Do Differently

If I started over today, I'd follow the docs-first approach from day one. The time "lost" writing specifications is repaid tenfold in coherent AI output and maintainable code.

I'd also set up automated tests earlier. The canvas has a lot of interactive state, and manual testing became a bottleneck as features accumulated.

## Try It Out

The project is open source. Visit [xhh-drawing-board.vibevibe.cn](https://xhh-drawing-board.vibevibe.cn) to try the live version, or check out the source code to see how it all fits together.

Building this taught me that Vibe Coding isn't about letting AI do everything — it's about creating the right structure so that AI can do its best work within clear boundaries.
