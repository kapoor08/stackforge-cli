import type { StackforgeConfig } from '../types/config.js';

export type ScriptMap = Record<string, string>;

export function collectScripts(config: StackforgeConfig): ScriptMap {
  const scripts: ScriptMap = {};

  if (config.frontend.type === 'nextjs') {
    scripts['dev'] = 'next dev';
    scripts['build'] = 'next build';
    scripts['start'] = 'next start';
    scripts['lint'] = 'next lint';
  }

  if (config.frontend.type === 'vite') {
    scripts['dev'] = 'vite';
    scripts['build'] = 'vite build';
    scripts['preview'] = 'vite preview';

    if (config.api.type === 'rest' || config.api.type === 'graphql' || config.api.type === 'trpc') {
      scripts['api:dev'] = config.frontend.language === 'ts' ? 'tsx src/server/index.ts' : 'node src/server/index.js';
    }
  }

  if (config.database.orm === 'drizzle') {
    scripts['db:generate'] = 'npx drizzle-kit generate';
    scripts['db:migrate'] = 'npx drizzle-kit migrate';
  }

  if (config.database.orm === 'prisma') {
    scripts['db:generate'] = 'npx prisma generate';
    scripts['db:migrate'] = 'npx prisma migrate dev';
    scripts['db:studio'] = 'npx prisma studio';
  }

  if (config.ui.library === 'shadcn') {
    scripts['ui:add'] = 'npx shadcn-ui@latest add';
  }

  if (config.database.orm === 'typeorm') {
    scripts['db:generate'] = 'npx typeorm migration:generate';
    scripts['db:migrate'] = 'npx typeorm migration:run';
  }

  return scripts;
}
