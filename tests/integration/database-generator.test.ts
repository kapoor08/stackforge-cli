import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateDatabaseFiles } from '../../src/generators/database/database-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateDatabaseFiles creates prisma files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-db-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'prisma' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };

  await generateDatabaseFiles(root, config);
  const schemaPath = join(root, 'app', 'prisma', 'schema.prisma');
  await stat(schemaPath);
  assert.ok(true);
});
