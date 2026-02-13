import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createCommand } from '../src/cli/commands/create.js';

const tempRoot = join(process.cwd(), 'tmp-create');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

await createCommand.parseAsync([
  'node',
  'create',
  'my-app',
  '--no-install',
  '--yes',
  '--out-dir',
  tempRoot
]);

console.log('create test passed');