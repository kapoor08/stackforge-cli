import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createCommand } from '../src/cli/commands/create.js';

const tempRoot = join(process.cwd(), 'tmp-create-preset');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

await createCommand.parseAsync([
  'node',
  'create',
  'preset-app',
  '--preset',
  'saas',
  '--no-install',
  '--yes',
  '--out-dir',
  tempRoot
]);

console.log('create preset test passed');