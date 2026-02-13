# StackForge

Developer setup for the StackForge CLI.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Smoke Test

```bash
pnpm test:smoke
```

## Add/Remove Test

```bash
pnpm test:add-remove
```

## List/Doctor/Agents Tests

```bash
pnpm test:list
pnpm test:doctor
pnpm test:agents
pnpm test:agent-add-remove
pnpm test:deps
```

## Add/Remove Usage

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

## Agents Usage

```bash
stackforge configure-agents --agents claude,copilot
stackforge add-agent claude
stackforge remove-agent copilot
stackforge list-agents
```

## AI Agent Files

- `.ai-agents/<agent>/context.json` - project stack summary + feature hints
- `.ai-agents/<agent>/tools.json` - enabled tools derived from selected features

## Create Usage

```bash
stackforge create my-app --yes
stackforge create my-app --no-prompts
stackforge create my-app --ai-agents claude,copilot --yes
stackforge create my-app --features email,storage --yes
stackforge create my-app --out-dir ./apps --yes
```

During interactive create, you can select extra features (email/storage/payments).

## Presets

```bash
stackforge list-presets
stackforge list-presets --details
```

Presets include feature defaults (e.g., saas -> email + payments).

## Migrate Usage

```bash
stackforge migrate
stackforge migrate --dry-run
```

## Schema Notes

- `stackforge.json` is auto-migrated on read if schema version changes.

## Notes

- `create` scaffolds a project using the selected frontend, API, auth, DB, UI, and features.
- Generated projects include `.gitignore`, `.editorconfig`, and `.env.example`.
- Feature docs: `docs/FEATURE_EMAIL.md`, `docs/FEATURE_STORAGE.md`, `docs/FEATURE_PAYMENTS.md`.
- Docs: `docs/API.md`, `docs/AI_AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/TROUBLESHOOTING.md`.
- Extra docs: `docs/PRESETS.md`, `docs/MIGRATIONS.md`, `docs/COMPATIBILITY.md`.
- Release guide: `RELEASE.md`.
