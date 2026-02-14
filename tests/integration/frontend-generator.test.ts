import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateFrontendFiles } from '../../src/generators/frontend/frontend-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateFrontendFiles creates vite files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-frontend-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'vite', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'none' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };

  await generateFrontendFiles(root, config);
  await stat(join(root, 'app', 'vite.config.ts'));
  await stat(join(root, 'app', 'src', 'main.tsx'));
});
