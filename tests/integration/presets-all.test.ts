import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGenerators } from '../../src/cli/run-generators.js';
import { getPreset } from '../../src/presets/index.js';

const presetNames = ['starter', 'saas', 'ecommerce', 'blog', 'api'] as const;

for (const name of presetNames) {
  test(`preset ${name} generates project`, async () => {
    const root = await mkdtemp(join(tmpdir(), `stackforge-${name}-`));
    const preset = getPreset(name);
    if (!preset) throw new Error(`Missing preset ${name}`);

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
    await stat(join(root, 'app', 'package.json'));
  });
}
