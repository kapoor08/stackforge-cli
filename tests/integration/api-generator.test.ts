import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateApiFiles } from '../../src/generators/api/api-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateApiFiles creates rest route and client', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-api-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: [],
    aiAgents: []
  };

  await generateApiFiles(root, config);
  await stat(join(root, 'app', 'app', 'api', 'hello', 'route.ts'));
  await stat(join(root, 'app', 'src', 'api', 'client.ts'));
});
