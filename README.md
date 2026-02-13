# StackForge

StackForge is a full-stack app generator. It scaffolds a project based on your selected frontend, API, database/ORM, auth, UI library, and features, plus AI tool integrations.

## Install and Create

```bash
npx create-stackforge my-app
```

Or if installed globally:

```bash
stackforge create my-app
```

## Common Create Examples

```bash
stackforge create my-app --yes
stackforge create my-app --preset saas --yes
stackforge create my-app --features email,storage,payments --yes
stackforge create my-app --ai-agents claude,codex,gemini,cursor --yes
stackforge create my-app --out-dir ./apps --yes
```

## Presets

```bash
stackforge list-presets
stackforge list-presets --details
```

## Add/Remove Features

```bash
stackforge add ui:tailwind
stackforge add auth:nextauth
stackforge add api:trpc
stackforge add database:postgres
stackforge add orm:drizzle
stackforge add feature:email
stackforge add feature:storage
stackforge add feature:payments

stackforge remove auth:nextauth
stackforge remove api:trpc
```

## Update, Validate, Fix, Doctor

```bash
stackforge update
stackforge update --check
stackforge update --live --major
stackforge validate
stackforge fix
stackforge doctor
stackforge doctor --fix
```

## Package Manager

```bash
stackforge use npm
stackforge use pnpm
stackforge use yarn --no-install
```

## Migrations and Upgrade

```bash
stackforge migrate
stackforge migrate --dry-run
stackforge upgrade --preset saas
```

## AI Agent Integrations

```bash
stackforge configure-agents --agents claude,codex,gemini,cursor
stackforge add-agent claude
stackforge remove-agent codex
stackforge list-agents
```

Generated AI outputs:

- `.ai-agents/<agent>/context.json`
- `.ai-agents/<agent>/tools.json`
- `.ai-agents/servers/<agent>/`
- `.claude/claude_desktop_config.json` (Claude)
- `.codex/functions.json` (Codex)
- `.cursor/extensions.json` and `.cursorrules` (Cursor)
- `.windsurf/cascade.json` (Windsurf)
- `.tabnine/config.json` (Tabnine)

## Project Notes

- `stackforge.json` is auto-migrated on read when schema versions change.
- Generated apps include `.gitignore`, `.editorconfig`, and `.env.example`.
- Feature docs: `docs/FEATURE_EMAIL.md`, `docs/FEATURE_STORAGE.md`, `docs/FEATURE_PAYMENTS.md`.
- Docs: `docs/API.md`, `docs/AI_AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/TROUBLESHOOTING.md`.
- Extra docs: `docs/PRESETS.md`, `docs/MIGRATIONS.md`, `docs/COMPATIBILITY.md`.
- Release guide: `RELEASE.md`.

## CLI Development

```bash
pnpm install
pnpm dev
```

## Tests

```bash
pnpm test:smoke
pnpm test:add-remove
pnpm test:list
pnpm test:doctor
pnpm test:agents
pnpm test:agent-add-remove
pnpm test:deps
pnpm test:all
```
