# StackForge CLI

**The universal full-stack boilerplate generator.** Scaffold production-ready apps with your choice of frontend, API, database, ORM, auth, UI library, 23 service providers, and AI agent integrations — all in one command.

```bash
npx create-stackforge my-app
```

---

## Table of Contents

- [Why StackForge?](#why-stackforge)
- [Quick Start](#quick-start)
- [Supported Stack](#supported-stack)
- [Service Providers](#service-providers)
- [Provider Selection Flow](#provider-selection-flow)
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
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

---

## Why StackForge?

Setting up a full-stack project means wiring together a frontend framework, a UI library, a database, an ORM, authentication, an API layer, service providers (email, storage, payments, analytics), and dozens of supporting packages — each with its own config files, environment variables, and boilerplate. StackForge handles all of that in seconds.

- **One command** to scaffold a complete, working project
- **23 service providers** — choose from 6 email, 8 storage, 3 payment, 4 analytics, and 2 error tracking providers
- **Modular** — add or remove any feature after creation
- **Preset-driven** — start with a proven stack for your use case
- **AI-ready** — generates config files for 8 AI coding agents (optional)
- **TypeScript & JavaScript** — first-class support for both
- **Package manager agnostic** — npm, pnpm, yarn, or bun
- **Fast** — optimized installation with cache-first strategy (30-50% faster)

---

## Quick Start

### Create with interactive prompts

```bash
npx create-stackforge my-app
```

You will be guided through selecting:

1. **Core Stack**: Frontend, language, UI library, database, ORM, auth provider, API type
2. **Service Providers**: Email, storage, payments, analytics, error tracking (optional, category-based selection)
3. **AI Coding Assistants**: Claude, Copilot, Cursor, Gemini, Codeium, Windsurf, Tabnine, Codex (optional)

The CLI uses a smart two-step selection flow:

- First, select feature **categories** (checkbox: choose multiple)
- Then, select a specific **provider** for each category (radio: choose one per category)

### Create with a preset (no prompts)

```bash
npx create-stackforge my-app --preset saas --yes
```

### Create with specific providers

```bash
# Specify exact providers using category:provider syntax
npx create-stackforge my-app \
  --preset starter \
  --features email:resend,payments:stripe,analytics:posthog \
  --ai-agents claude,cursor \
  --yes
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

**Note:** Tailwind CSS is **always included** by default for all projects. The UI library selection determines which additional component library to add on top of Tailwind.

| Library   | Description                              |
| --------- | ---------------------------------------- |
| `shadcn`  | shadcn/ui (built on Tailwind + Radix)    |
| `mui`     | Material UI (MUI)                        |
| `chakra`  | Chakra UI                                |
| `mantine` | Mantine                                  |
| `antd`    | Ant Design                               |
| `nextui`  | NextUI                                   |
| `none`    | Tailwind CSS only (no component library) |

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

---

## Service Providers

StackForge supports **23 service providers** across 5 categories. Each category is optional, and you select **one provider per category** during setup.

### Email Providers

Send transactional emails, newsletters, and notifications.

| Provider     | Description                               |
| ------------ | ----------------------------------------- |
| `resend`     | Resend — modern email API for developers  |
| `sendgrid`   | SendGrid — email delivery platform        |
| `aws-ses`    | Amazon SES — AWS email service            |
| `mailgun`    | Mailgun — email automation for developers |
| `nodemailer` | Nodemailer — classic SMTP email library   |
| `mailersend` | MailerSend — transactional email service  |

### Storage Providers

Handle file uploads, image optimization, and cloud storage.

| Provider           | Description                                   |
| ------------------ | --------------------------------------------- |
| `cloudinary`       | Cloudinary — media management & optimization  |
| `aws-s3`           | AWS S3 — object storage service               |
| `cloudflare-r2`    | Cloudflare R2 — S3-compatible object storage  |
| `vercel-blob`      | Vercel Blob — serverless file storage         |
| `supabase-storage` | Supabase Storage — open source S3-alternative |
| `firebase-storage` | Firebase Storage — Google Cloud Storage       |
| `azure-blob`       | Azure Blob Storage — Microsoft cloud storage  |
| `gcs`              | Google Cloud Storage — GCP object storage     |

### Payment Providers

Process payments, subscriptions, and transactions.

| Provider   | Description                          |
| ---------- | ------------------------------------ |
| `stripe`   | Stripe — online payment processing   |
| `paypal`   | PayPal — global payment platform     |
| `razorpay` | Razorpay — payment gateway for India |

### Analytics Providers

Track user behavior, events, and product analytics.

| Provider           | Description                             |
| ------------------ | --------------------------------------- |
| `posthog`          | PostHog — open source product analytics |
| `ga4`              | Google Analytics 4 — web analytics      |
| `vercel-analytics` | Vercel Analytics — serverless analytics |
| `segment`          | Segment — customer data platform        |

### Error Tracking Providers

Monitor errors, exceptions, and application health. **Requires Next.js.**

| Provider    | Description                                 |
| ----------- | ------------------------------------------- |
| `sentry`    | Sentry — error tracking & performance       |
| `logrocket` | LogRocket — session replay & error tracking |

---

## Provider Selection Flow

During project creation, you'll follow this two-step flow:

### Step 1: Select Categories (Checkbox)

Choose which feature categories you want to include:

```
? Additional features (select categories)
❯ ◯ Email
  ◯ File Storage
  ◯ Payments
  ◯ Analytics
  ◯ Error Tracking
```

You can select **multiple categories** (or none).

### Step 2: Select Provider (Radio Button)

For each selected category, choose a specific provider:

```
? Email provider
❯ ◉ Resend
  ◯ SendGrid
  ◯ Amazon SES
  ◯ Mailgun
  ◯ Nodemailer
  ◯ MailerSend
```

You can select **one provider per category**.

### CLI Syntax

When using `--features` flag, use the `category:provider` format:

```bash
# Single provider
npx create-stackforge my-app --features email:resend

# Multiple providers (comma-separated)
npx create-stackforge my-app --features email:sendgrid,storage:aws-s3,payments:stripe

# All categories configured
npx create-stackforge my-app \
  --features email:resend,storage:cloudinary,payments:stripe,analytics:posthog,error-tracking:sentry
```

---

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

| Layer     | Choice               |
| --------- | -------------------- |
| Frontend  | Next.js (TypeScript) |
| UI        | Tailwind CSS only    |
| Database  | PostgreSQL + Drizzle |
| Auth      | None                 |
| API       | tRPC                 |
| Providers | None                 |

```bash
npx create-stackforge my-app --preset starter --yes
```

### `saas`

Everything you need for a SaaS product with email and payments.

| Layer     | Choice                            |
| --------- | --------------------------------- |
| Frontend  | Next.js (TypeScript)              |
| UI        | Tailwind CSS only                 |
| Database  | PostgreSQL + Prisma               |
| Auth      | NextAuth                          |
| API       | tRPC                              |
| Providers | Email (Resend), Payments (Stripe) |

```bash
npx create-stackforge my-app --preset saas --yes
```

### `ecommerce`

A storefront with payments and file storage.

| Layer     | Choice                                  |
| --------- | --------------------------------------- |
| Frontend  | Next.js (TypeScript)                    |
| UI        | Tailwind CSS only                       |
| Database  | PostgreSQL + Prisma                     |
| Auth      | None                                    |
| API       | REST                                    |
| Providers | Payments (Stripe), Storage (Cloudinary) |

```bash
npx create-stackforge my-app --preset ecommerce --yes
```

### `blog`

A lightweight blog with image storage.

| Layer     | Choice               |
| --------- | -------------------- |
| Frontend  | Next.js (TypeScript) |
| UI        | Tailwind CSS only    |
| Database  | SQLite + Prisma      |
| Auth      | None                 |
| API       | REST                 |
| Providers | Storage (Cloudinary) |

```bash
npx create-stackforge my-app --preset blog --yes
```

### `api`

A headless API backend.

| Layer     | Choice               |
| --------- | -------------------- |
| Frontend  | Vite (TypeScript)    |
| UI        | None                 |
| Database  | PostgreSQL + Drizzle |
| Auth      | None                 |
| API       | REST                 |
| Providers | None                 |

```bash
npx create-stackforge my-app --preset api --yes
```

### Customize Any Preset

You can override preset defaults:

```bash
# Use saas preset but change providers
npx create-stackforge my-app \
  --preset saas \
  --features email:sendgrid,payments:paypal,analytics:posthog \
  --yes
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
| `--features <list>`     | Comma-separated providers in `category:provider` format                                   |
| `--ai-agents <list>`    | Comma-separated AI agents (`claude,copilot,codex,gemini,cursor,codeium,windsurf,tabnine`) |
| `--yes`, `--no-prompts` | Accept defaults, skip interactive prompts                                                 |
| `--no-install`          | Skip dependency installation after scaffolding                                            |
| `--dry-run`             | Preview file writes without creating anything                                             |
| `--out-dir <path>`      | Output directory (default: current directory)                                             |

**Examples:**

```bash
# Interactive mode (recommended)
npx create-stackforge my-app

# SaaS preset with AI agents
npx create-stackforge my-app --preset saas --ai-agents claude,cursor --yes

# Custom providers with specific choices
npx create-stackforge my-app \
  --features email:sendgrid,storage:aws-s3,payments:stripe,analytics:posthog \
  --ai-agents claude,copilot \
  --yes

# Preview what would be generated
npx create-stackforge my-app --preset starter --dry-run

# E-commerce with alternative providers
npx create-stackforge my-app \
  --features payments:razorpay,storage:cloudflare-r2,analytics:ga4 \
  --yes

# Use current directory name as project name
npx create-stackforge . --preset starter --yes

# Output to a specific directory
npx create-stackforge my-app --preset blog --out-dir ./projects --yes
```

---

### `add` / `remove`

Add or remove features from an existing project. Run these from inside a StackForge project directory.

```bash
stackforge add <category:value>
stackforge remove <category:value>
```

**Categories:** `ui`, `auth`, `api`, `database`, `orm`, `feature`

**Examples:**

```bash
# UI Library
stackforge add ui:shadcn
stackforge remove ui:shadcn

# Authentication
stackforge add auth:nextauth
stackforge remove auth:nextauth

# API Layer
stackforge add api:trpc
stackforge remove api:trpc

# Database & ORM
stackforge add database:postgres
stackforge add orm:prisma
stackforge remove orm:prisma

# Service Providers (use category:provider format)
stackforge add feature:email:resend
stackforge add feature:storage:aws-s3
stackforge add feature:payments:stripe
stackforge add feature:analytics:posthog
stackforge add feature:error-tracking:sentry

# Remove providers
stackforge remove feature:email:resend
stackforge remove feature:storage:aws-s3

# Switch providers (remove old, add new)
stackforge remove feature:email:resend
stackforge add feature:email:sendgrid
```

When you add or remove a feature, StackForge:

1. Updates `stackforge.json` with the new configuration
2. Adds/removes dependencies in `package.json`
3. Generates/removes provider-specific source files and templates
4. Updates `.env.example` with required environment variables
5. Adds/removes provider documentation in `docs/`

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
ui: none (Tailwind CSS included)
database: postgres (prisma)
auth: nextauth
api: trpc
features:
  email: resend
  storage: aws-s3
  payments: stripe
  analytics: posthog
ai-agents: claude, cursor
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
│       ├── resend.ts             # Email (Resend)
│       ├── sendgrid.ts           # Email (SendGrid)
│       ├── aws-ses.ts            # Email (AWS SES)
│       ├── stripe.ts             # Payments (Stripe)
│       ├── paypal.ts             # Payments (PayPal)
│       ├── cloudinary.ts         # Storage (Cloudinary)
│       ├── aws-s3.ts             # Storage (AWS S3)
│       ├── posthog.ts            # Analytics (PostHog)
│       ├── ga4.ts                # Analytics (Google Analytics)
│       ├── sentry.ts             # Error Tracking (Sentry)
│       └── logrocket.ts          # Error Tracking (LogRocket)
├── auth/
│   ├── auth-options.ts           # Auth configuration
│   └── README.md
├── drizzle/ or prisma/           # ORM schema & migrations
├── docs/                         # Provider documentation
│   ├── email/
│   │   └── README.md             # Provider-specific setup guide
│   ├── storage/
│   │   └── README.md
│   ├── payments/
│   │   └── README.md
│   ├── analytics/
│   │   └── README.md
│   └── error-tracking/
│       └── README.md
├── .ai-agents/                   # AI agent configs
│   ├── context.json              # Project context
│   ├── tools.json                # Tool definitions
│   ├── claude/
│   │   └── mcp-server.ts         # MCP server
│   ├── copilot/
│   │   └── functions.json
│   └── gemini/
│       └── function_declarations.json
├── .claude/
│   └── claude_desktop_config.json
├── .cursorrules                  # Cursor AI rules
├── stackforge.json               # Project configuration (source of truth)
├── package.json
├── .env.example                  # All required env vars for selected providers
├── .gitignore
└── .editorconfig
```

### Provider-Specific Files

Each service provider generates:

- **Client/SDK file** in `src/lib/{provider}.{ts|js}` with ready-to-use functions
- **Documentation** in `docs/{category}/README.md` with setup instructions
- **Environment variables** in `.env.example` with required keys
- **Dependencies** in `package.json` with exact versions

---

## Configuration File

Every StackForge project has a `stackforge.json` at the root:

```json
{
  "_schemaVersion": 1,
  "projectName": "my-app",
  "packageManager": "pnpm",
  "frontend": { "type": "nextjs", "language": "ts" },
  "ui": { "library": "none" },
  "database": { "provider": "postgres", "orm": "prisma" },
  "auth": { "provider": "nextauth" },
  "api": { "type": "trpc" },
  "features": {
    "email": "resend",
    "storage": "aws-s3",
    "payments": "stripe",
    "analytics": "posthog",
    "errorTracking": "sentry"
  },
  "aiAgents": ["claude", "cursor"]
}
```

### Field Descriptions

| Field            | Type     | Description                                          |
| ---------------- | -------- | ---------------------------------------------------- |
| `_schemaVersion` | number   | Schema version (auto-migrated)                       |
| `projectName`    | string   | Project name                                         |
| `packageManager` | string   | `npm`, `pnpm`, `yarn`, or `bun`                      |
| `frontend`       | object   | Frontend framework and language                      |
| `ui`             | object   | UI library (`none` = Tailwind only)                  |
| `database`       | object   | Database provider and ORM                            |
| `auth`           | object   | Authentication provider                              |
| `api`            | object   | API type                                             |
| `features`       | object   | Service providers (optional properties per category) |
| `aiAgents`       | string[] | List of configured AI coding assistants              |

### Features Object Structure

The `features` object uses **optional properties** for each category:

```typescript
interface Features {
  email?:
    | "resend"
    | "sendgrid"
    | "aws-ses"
    | "mailgun"
    | "nodemailer"
    | "mailersend";
  storage?:
    | "cloudinary"
    | "aws-s3"
    | "cloudflare-r2"
    | "vercel-blob"
    | "supabase-storage"
    | "firebase-storage"
    | "azure-blob"
    | "gcs";
  payments?: "stripe" | "paypal" | "razorpay";
  analytics?: "posthog" | "ga4" | "vercel-analytics" | "segment";
  errorTracking?: "sentry" | "logrocket";
}
```

**Note:** You can only have **one provider per category**. To switch providers, remove the old one and add the new one.

This file is the **source of truth**. All CLI commands (`add`, `remove`, `update`, `doctor`, etc.) read and write this file. It auto-migrates when the schema version changes.

---

## Compatibility Rules

Not every combination is valid. StackForge validates these rules before generating:

| Rule                                               | Reason                                                    |
| -------------------------------------------------- | --------------------------------------------------------- |
| NextAuth requires Next.js                          | NextAuth uses Next.js API routes                          |
| Clerk requires Next.js                             | Clerk middleware is Next.js-specific                      |
| tRPC requires TypeScript                           | tRPC relies on TypeScript type inference                  |
| TypeORM requires PostgreSQL, MySQL, or SQLite      | TypeORM does not support Neon/Supabase drivers            |
| Error tracking (Sentry/LogRocket) requires Next.js | Error tracking SDKs use `@sentry/nextjs` or Next.js hooks |
| ORM requires a database provider                   | Cannot use an ORM without selecting a database            |

---

## Performance

StackForge is optimized for speed with several performance improvements:

### Fast Dependency Installation (30-50% faster)

All package managers use **cache-first installation** strategies:

```bash
# pnpm
pnpm install --prefer-offline

# yarn
yarn install --prefer-offline --silent

# npm
npm install --prefer-offline --no-audit --no-fund

# bun (already fast by default)
bun install
```

**What this means:**

- Uses locally cached packages when available (no network request)
- Falls back to registry only when necessary
- Significantly faster on subsequent project creations
- Typical installation: **15-30 seconds** (vs 45-60 seconds without cache)

### Project Creation Time

Typical timing for `npx create-stackforge my-app --preset saas --yes`:

| Step                    | Duration   |
| ----------------------- | ---------- |
| Template generation     | 1-2s       |
| Dependency installation | 15-30s     |
| **Total**               | **16-32s** |

### Tips for Faster Setup

1. **Use `--dry-run`** to preview without installation:

   ```bash
   npx create-stackforge my-app --preset saas --dry-run
   ```

2. **Skip installation** and run it later:

   ```bash
   npx create-stackforge my-app --no-install --yes
   cd my-app
   pnpm install  # or your preferred package manager
   ```

3. **Use bun** for the fastest installation:
   ```bash
   npx create-stackforge my-app --yes
   # When prompted, select bun as package manager
   ```

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
