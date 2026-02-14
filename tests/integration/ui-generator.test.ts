import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateUiFiles } from '../../src/generators/ui/ui-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('generateUiFiles creates shadcn scaffolds', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-ui-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'shadcn' },
    database: { provider: 'none' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };

  await generateUiFiles(root, config);
  const buttonPath = join(root, 'app', 'src', 'components', 'ui', 'button.tsx');
  await stat(buttonPath);
  assert.ok(true);
});
