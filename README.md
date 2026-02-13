# StackForge CLI

**The universal full-stack boilerplate generator.** Scaffold production-ready apps with your choice of frontend, API, database, ORM, auth, UI library, features, and AI agent integrations — all in one command.

```bash
npx create-stackforge my-app
```

---

## Table of Contents

- [Why StackForge?](#why-stackforge)
- [Quick Start](#quick-start)
- [Supported Stack](#supported-stack)
- [Presets](#presets)
- [Commands](#commands)
  - [create](#create)
  - [add / remove](#add--remove)
  - [list](#list)
  - [update](#update)
  - [doctor / fix / validate](#doctor--fix--validate)
  - [migrate / upgrade](#migrate--upgrade)
  - [use](#use)
  - [list-presets](#list-presets)
  - [AI Agent Commands](#ai-agent-commands)
- [AI Agent Integrations](#ai-agent-integrations)
- [Project Structure](#project-structure)
- [Configuration File](#configuration-file)
- [Compatibility Rules](#compatibility-rules)
- [Contributing](#contributing)
- [License](#license)

---

## Why StackForge?

Setting up a full-stack project means wiring together a frontend framework, a UI library, a database, an ORM, authentication, an API layer, and dozens of supporting packages — each with its own config files, environment variables, and boilerplate. StackForge handles all of that in seconds.

- **One command** to scaffold a complete, working project
- **Modular** — add or remove any feature after creation
- **Preset-driven** — start with a proven stack for your use case
- **AI-ready** — generates config files for 8 AI coding agents
- **TypeScript & JavaScript** — first-class support for both
- **Package manager agnostic** — npm, pnpm, yarn, or bun

---

## Quick Start

### Create with interactive prompts

```bash
npx create-stackforge my-app
```

You will be guided through selecting your frontend, language, UI library, database, ORM, auth provider, API type, features, and AI agents.

### Create with a preset (no prompts)

```bash
npx create-stackforge my-app --preset saas --yes
```

### Create with specific options

```bash
npx create-stackforge my-app --preset starter --features email,payments --ai-agents claude,cursor --yes
```

### Global install

```bash
npm install -g create-stackforge
stackforge create my-app --preset saas --yes
```

---

## Supported Stack

### Frontends

| Frontend | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `nextjs` | Next.js (App Router) — SSR, SSG, API routes, server actions |
| `vite`   | Vite + React — fast SPA development with HMR                |

### Languages

| Language | Description                   |
| -------- | ----------------------------- |
| `ts`     | TypeScript with strict config |
| `js`     | JavaScript with JSX           |

### UI Libraries

| Library    | Description                           |
| ---------- | ------------------------------------- |
| `tailwind` | Tailwind CSS utility classes          |
| `shadcn`   | shadcn/ui (built on Tailwind + Radix) |
| `mui`      | Material UI (MUI)                     |
| `chakra`   | Chakra UI                             |
| `mantine`  | Mantine                               |
| `antd`     | Ant Design                            |
| `nextui`   | NextUI                                |
| `none`     | No UI library                         |

### Databases

| Provider   | Description                |
| ---------- | -------------------------- |
| `postgres` | PostgreSQL                 |
| `mysql`    | MySQL                      |
| `sqlite`   | SQLite                     |
| `neon`     | Neon (serverless Postgres) |
| `supabase` | Supabase (hosted Postgres) |
| `none`     | No database                |

### ORMs

| ORM       | Description                                           |
| --------- | ----------------------------------------------------- |
| `drizzle` | Drizzle ORM — lightweight, type-safe SQL              |
| `prisma`  | Prisma — schema-first, auto-generated client          |
| `typeorm` | TypeORM — decorator-based (PostgreSQL, MySQL, SQLite) |

### Auth Providers

| Provider   | Description                    |
| ---------- | ------------------------------ |
| `nextauth` | NextAuth.js (requires Next.js) |
| `clerk`    | Clerk (requires Next.js)       |
| `supabase` | Supabase Auth                  |
| `none`     | No auth                        |

### API Types

| Type      | Description                                            |
| --------- | ------------------------------------------------------ |
| `rest`    | REST API — route handlers with fetch client            |
| `trpc`    | tRPC — end-to-end type-safe APIs (requires TypeScript) |
| `graphql` | GraphQL — schema + Yoga server + client                |
| `none`    | No API layer                                           |

### Features

| Feature          | Description                                  |
| ---------------- | -------------------------------------------- |
| `email`          | Email via Resend                             |
| `storage`        | File storage via Cloudinary                  |
| `payments`       | Payments via Stripe                          |
| `analytics`      | Analytics via PostHog                        |
| `error-tracking` | Error tracking via Sentry (requires Next.js) |

### AI Agents

| Agent      | Generated Files                                             |
| ---------- | ----------------------------------------------------------- |
| `claude`   | MCP server, `claude_desktop_config.json`, `.claude/` config |
| `copilot`  | `functions.json` with tool definitions                      |
| `codex`    | `functions.json`, `.codex/` config                          |
| `gemini`   | `function_declarations.json` for AI Studio                  |
| `cursor`   | `.cursorrules`, `.cursor/extensions.json`                   |
| `codeium`  | `server-config.json` with LSP protocol                      |
| `windsurf` | `cascade.json` with Cascade protocol                        |
| `tabnine`  | `config.json` with plugin configuration                     |

---

## Presets

Presets are pre-configured stacks for common use cases. Use `--preset <name>` with the `create` command.

### `starter`

A minimal Next.js + TypeScript starting point.

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Next.js (TypeScript) |
| UI       | Tailwind             |
| Database | PostgreSQL + Drizzle |
| Auth     | None                 |
| API      | tRPC                 |
| Features | None                 |

```bash
npx create-stackforge my-app --preset starter --yes
```

### `saas`

Everything you need for a SaaS product.

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Next.js (TypeScript) |
| UI       | Tailwind             |
| Database | PostgreSQL + Prisma  |
| Auth     | NextAuth             |
| API      | tRPC                 |
| Features | Email, Payments      |

```bash
npx create-stackforge my-app --preset saas --yes
```

### `ecommerce`

A storefront with payments and file uploads.

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Next.js (TypeScript) |
| UI       | Tailwind             |
| Database | PostgreSQL + Prisma  |
| Auth     | None                 |
| API      | REST                 |
| Features | Payments, Storage    |

```bash
npx create-stackforge my-app --preset ecommerce --yes
```

### `blog`

A lightweight blog with storage for images.

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Next.js (TypeScript) |
| UI       | Tailwind             |
| Database | SQLite + Prisma      |
| Auth     | None                 |
| API      | REST                 |
| Features | Storage              |

```bash
npx create-stackforge my-app --preset blog --yes
```

### `api`

A headless API backend.

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Vite (TypeScript)    |
| UI       | None                 |
| Database | PostgreSQL + Drizzle |
| Auth     | None                 |
| API      | REST                 |
| Features | None                 |

```bash
npx create-stackforge my-app --preset api --yes
```

List all presets:

```bash
stackforge list-presets --details
```

---

## Commands

### `create`

Scaffold a new project.

```bash
npx create-stackforge <project-name> [options]
```

| Option                  | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `--preset <name>`       | Use a preset (`starter`, `saas`, `ecommerce`, `blog`, `api`)                              |
| `--features <list>`     | Comma-separated features (`email,storage,payments,analytics,error-tracking`)              |
| `--ai-agents <list>`    | Comma-separated AI agents (`claude,copilot,codex,gemini,cursor,codeium,windsurf,tabnine`) |
| `--yes`, `--no-prompts` | Accept defaults, skip interactive prompts                                                 |
| `--no-install`          | Skip `npm install` after scaffolding                                                      |
| `--dry-run`             | Preview file writes without creating anything                                             |
| `--out-dir <path>`      | Output directory (default: current directory)                                             |

**Examples:**

```bash
# Interactive mode
npx create-stackforge my-app

# SaaS with AI agents, no prompts
npx create-stackforge my-app --preset saas --ai-agents claude,cursor --yes

# Preview what would be generated
npx create-stackforge my-app --preset starter --dry-run

# Custom feature selection
npx create-stackforge my-app --features email,payments,analytics --yes

# Output to a specific directory
npx create-stackforge my-app --preset blog --out-dir ./projects --yes
```

---

### `add` / `remove`

Add or remove a feature from an existing project. Run these from inside a StackForge project directory.

```bash
stackforge add <category:value>
stackforge remove <category:value>
```

**Categories:** `ui`, `auth`, `api`, `database`, `orm`, `feature`

**Examples:**

```bash
# UI
stackforge add ui:shadcn
stackforge remove ui:shadcn

# Auth
stackforge add auth:nextauth
stackforge remove auth:nextauth

# API
stackforge add api:trpc
stackforge remove api:trpc

# Database & ORM
stackforge add database:postgres
stackforge add orm:prisma
stackforge remove orm:prisma

# Features
stackforge add feature:email
stackforge add feature:payments
stackforge add feature:storage
stackforge remove feature:email
```

When you add a feature, StackForge:

1. Updates `stackforge.json`
2. Adds/removes dependencies in `package.json`
3. Generates/removes the relevant source files and templates
4. Updates the project README

---

### `list`

Show the current project stack or available features.

```bash
# Show current project configuration
stackforge list

# Show all available features
stackforge list --available

# Filter by category
stackforge list --category database
stackforge list --category features
```

**Output example:**

```
frontend: nextjs (ts)
ui: tailwind
database: postgres (prisma)
auth: nextauth
api: trpc
features: email, payments
```

---

### `update`

Sync dependencies and scripts to match the current `stackforge.json`.

```bash
# Apply updates
stackforge update

# Check for mismatches without applying
stackforge update --check

# Compare against latest npm registry versions
stackforge update --live

# Allow major version bumps
stackforge update --live --major
```

---

### `doctor` / `fix` / `validate`

Check project health and fix issues.

```bash
# Check for missing scripts, dependencies, env keys, agent files
stackforge doctor

# Check and auto-fix
stackforge doctor --fix

# Quick fix (same as doctor --fix, without the report)
stackforge fix

# Validate stackforge.json against supported values and compatibility rules
stackforge validate
```

**What `doctor` checks:**

- Missing npm scripts
- Missing dependencies and devDependencies
- Missing environment variables in `.env.example`
- Missing AI agent configuration files
- Schema version mismatches

---

### `migrate` / `upgrade`

Manage schema versions and preset upgrades.

```bash
# Migrate stackforge.json to the latest schema version
stackforge migrate

# Preview migration without writing
stackforge migrate --dry-run

# Upgrade project to match a preset
stackforge upgrade --preset saas
```

---

### `use`

Switch the project's package manager.

```bash
stackforge use pnpm
stackforge use yarn
stackforge use bun
stackforge use npm --no-install
```

---

### `list-presets`

Show available presets.

```bash
# List preset names
stackforge list-presets

# Show full details for each preset
stackforge list-presets --details
```

---

### AI Agent Commands

Manage AI coding agent integrations.

```bash
# Configure multiple agents at once
stackforge configure-agents --agents claude,copilot,cursor,gemini

# Add a single agent
stackforge add-agent claude

# Remove an agent
stackforge remove-agent codex

# List configured agents
stackforge list-agents
```

---

## AI Agent Integrations

StackForge generates configuration files that help AI coding assistants understand your project. Each agent gets:

- **`context.json`** — your project stack, features, and hints
- **`tools.json`** — available tool definitions based on your stack
- **Agent-specific config** — MCP servers, function declarations, rules files, etc.

### Claude

Generates an MCP (Model Context Protocol) server with `/tools` and `/invoke` endpoints. The server exposes your project's database, ORM, API, auth, and feature tools.

```
.claude/claude_desktop_config.json
.ai-agents/servers/claude/mcp-server.(ts|js)
```

### Copilot / Codex

Generates OpenAI-compatible function definitions for tool calling.

```
.ai-agents/copilot/functions.json
.codex/functions.json
```

### Gemini

Generates function declarations for Google AI Studio.

```
.ai-agents/gemini/function_declarations.json
```

### Cursor

Generates rules files that Cursor auto-discovers.

```
.cursorrules
.cursor/extensions.json
```

### Codeium / Windsurf / Tabnine

Generates protocol-specific configuration files.

```
.ai-agents/codeium/server-config.json
.windsurf/cascade.json
.tabnine/config.json
```

---

## Project Structure

A generated StackForge project has this structure (varies based on your stack):

```
my-app/
├── app/                          # Next.js App Router (or src/ for Vite)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   ├── hello/route.ts        # REST endpoint
│   │   ├── graphql/route.ts      # GraphQL endpoint
│   │   ├── trpc/[trpc]/route.ts  # tRPC handler
│   │   └── auth/[...nextauth]/   # Auth route
│   └── auth/
│       ├── signin/page.tsx
│       └── protected/page.tsx
├── src/
│   ├── api/client.ts             # REST client
│   ├── trpc/client.ts            # tRPC client
│   ├── graphql/client.ts         # GraphQL client
│   ├── db/                       # Database client
│   └── lib/
│       ├── stripe.ts             # Payments
│       ├── resend.ts             # Email
│       ├── posthog.ts            # Analytics
│       └── sentry.ts             # Error tracking
├── auth/
│   ├── auth-options.ts           # Auth configuration
│   └── README.md
├── drizzle/ or prisma/           # ORM schema
├── .ai-agents/                   # AI agent configs
├── docs/                         # Feature documentation
├── stackforge.json               # Project configuration
├── package.json
├── .env.example                  # Required environment variables
├── .gitignore
└── .editorconfig
```

---

## Configuration File

Every StackForge project has a `stackforge.json` at the root:

```json
{
  "_schemaVersion": 1,
  "projectName": "my-app",
  "packageManager": "pnpm",
  "frontend": { "type": "nextjs", "language": "ts" },
  "ui": { "library": "tailwind" },
  "database": { "provider": "postgres", "orm": "prisma" },
  "auth": { "provider": "nextauth" },
  "api": { "type": "trpc" },
  "features": ["email", "payments"],
  "aiAgents": ["claude", "cursor"]
}
```

This file is the source of truth. All CLI commands (`add`, `remove`, `update`, `doctor`, etc.) read and write this file. It auto-migrates when the schema version changes.

---

## Compatibility Rules

Not every combination is valid. StackForge validates these rules before generating:

| Rule                                          | Reason                                         |
| --------------------------------------------- | ---------------------------------------------- |
| NextAuth requires Next.js                     | NextAuth uses Next.js API routes               |
| Clerk requires Next.js                        | Clerk middleware is Next.js-specific           |
| tRPC requires TypeScript                      | tRPC relies on TypeScript type inference       |
| TypeORM requires PostgreSQL, MySQL, or SQLite | TypeORM does not support Neon/Supabase drivers |
| Error tracking (Sentry) requires Next.js      | Sentry integration uses `@sentry/nextjs`       |
| ORM requires a database provider              | Cannot use an ORM without selecting a database |

---

## Requirements

- **Node.js** >= 18.0.0
- **npm**, **pnpm**, **yarn**, or **bun**

---

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup, testing, and contribution guidelines.

```bash
# Development
pnpm install
pnpm dev

# Build
pnpm build

# Run all tests
pnpm test:all
```

---

## License

MIT
