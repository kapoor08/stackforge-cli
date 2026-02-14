import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import type { StackforgeConfig } from '../../src/types/config.js';

test('config shape supports required fields', () => {
  const config: StackforgeConfig = {
    projectName: 'demo',
    packageManager: 'pnpm',
    frontend: { type: 'vite', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'sqlite', orm: 'prisma' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: { email: 'resend' },
    aiAgents: ['claude']
  };

  assert.equal(config.frontend.type, 'vite');
  assert.equal(config.database.orm, 'prisma');
  assert.equal(config.features.email, 'resend');
});
