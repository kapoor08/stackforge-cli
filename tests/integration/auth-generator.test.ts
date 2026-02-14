import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateAuthFiles } from '../../src/generators/auth/auth-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateAuthFiles creates nextauth protected page', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-auth-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'none' },
    auth: { provider: 'nextauth' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };

  await generateAuthFiles(root, config);
  await stat(join(root, 'app', 'app', 'auth', 'protected', 'page.tsx'));
});
