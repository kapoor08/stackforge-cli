import { collectScripts } from '../src/generators/scripts/scripts-registry.js';
import { collectDependencies } from '../src/generators/deps/deps-registry.js';
import type { StackforgeConfig } from '../src/types/config.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const config: StackforgeConfig = {
  projectName: 'test-app',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'tailwind' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: [],
  aiAgents: []
};

const scripts = collectScripts(config);
assert(scripts['db:generate'] === 'npx drizzle-kit generate', 'drizzle db:generate missing');
assert(scripts['db:migrate'] === 'npx drizzle-kit migrate', 'drizzle db:migrate missing');
assert(scripts.dev === 'next dev', 'next dev script missing');

const deps = collectDependencies(config);
assert(deps.dependencies['drizzle-orm'] !== undefined, 'drizzle-orm dependency missing');
assert(deps.devDependencies['drizzle-kit'] !== undefined, 'drizzle-kit devDependency missing');
assert(deps.dependencies['next'] !== undefined, 'next dependency missing');

console.log('registry tests passed');