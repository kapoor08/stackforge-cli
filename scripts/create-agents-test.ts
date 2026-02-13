import { mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createCommand } from '../src/cli/commands/create.js';

const tempRoot = join(process.cwd(), 'tmp-create-agents');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

await createCommand.parseAsync([
  'node',
  'create',
  'my-app',
  '--ai-agents',
  'claude,copilot',
  '--no-install',
  '--yes',
  '--out-dir',
  tempRoot
]);

const agentsDir = join(tempRoot, 'my-app', '.ai-agents');
const entries = await readdir(agentsDir, { withFileTypes: true });
const names = entries.filter((e) => e.isDirectory()).map((e) => e.name);
if (!names.includes('claude') || !names.includes('copilot')) {
  throw new Error('create --ai-agents failed');
}

console.log('create agents test passed');