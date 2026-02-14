import { test } from 'node:test';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { generateApiFiles } from '../../src/generators/api/api-files.js';
import type { StackforgeConfig } from '../../src/types/config.js';

test('rest server responds on /api/hello', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-rest-'));
  const config: StackforgeConfig = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'vite', language: 'js' },
    ui: { library: 'none' },
    database: { provider: 'none' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: {},
    aiAgents: []
  };

  await generateApiFiles(root, config);
  const serverPath = join(root, 'app', 'src', 'server', 'index.js');
  const child = spawn('node', [serverPath], { stdio: 'ignore' });

  t.after(() => {
    child.kill();
  });

  await new Promise((resolve) => setTimeout(resolve, 300));
  const res = await fetch('http://localhost:3001/api/hello');
  const data = await res.json();
  if (data.message !== 'hello') {
    throw new Error('Unexpected response');
  }
});
