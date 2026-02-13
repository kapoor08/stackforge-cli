import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGenerators } from '../../src/cli/run-generators.js';
import { getPreset } from '../../src/presets/index.js';

test('saas preset generates expected files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-preset-'));
  const preset = getPreset('saas');
  assert.ok(preset);

  const config = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: preset.frontend!,
    ui: preset.ui!,
    database: preset.database!,
    auth: preset.auth!,
    api: preset.api!,
    features: preset.features ?? [],
    aiAgents: []
  };

  await runGenerators(root, config as any, { dryRun: false, log: () => {} });
  await stat(join(root, 'app', 'README.md'));
  await stat(join(root, 'app', 'package.json'));
});
