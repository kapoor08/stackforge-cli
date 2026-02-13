import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGenerators } from '../../src/cli/run-generators.js';

test('runGenerators creates package.json with scripts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-e2e-'));
  const config = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'vite', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: ['analytics'],
    aiAgents: []
  };

  await runGenerators(root, config as any, { dryRun: false, log: () => {} });
  const pkgRaw = await readFile(join(root, 'app', 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgRaw);
  assert.ok(pkg.scripts.dev);
  assert.ok(pkg.devDependencies['tailwindcss']);
});
