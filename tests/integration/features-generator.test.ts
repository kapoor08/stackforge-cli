import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateFeatureFiles } from '../../src/generators/features/feature-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateFeatureFiles creates analytics client', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-features-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'none' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: ['analytics'],
    aiAgents: []
  };

  await generateFeatureFiles(root, config);
  await stat(join(root, 'app', 'src', 'lib', 'posthog.ts'));
});
