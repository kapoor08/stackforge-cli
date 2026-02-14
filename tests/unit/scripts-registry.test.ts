import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { collectScripts } from '../../src/generators/scripts/scripts-registry.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('collectScripts adds db scripts for drizzle', () => {
  const config: StackforgeConfig = {
    projectName: 'demo',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };

  const scripts = collectScripts(config);
  assert.equal(scripts['db:generate'], 'npx drizzle-kit generate');
  assert.equal(scripts['db:migrate'], 'npx drizzle-kit migrate');
});
