import { mkdir, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { createCommand } from '../src/cli/commands/create.js';

const tempRoot = join(process.cwd(), 'tmp-create-preset-features');
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

const projectRoot = join(tempRoot, 'preset-app');
await access(join(projectRoot, 'src', 'lib', 'resend.ts'));
await access(join(projectRoot, 'src', 'lib', 'stripe.ts'));

console.log('create preset features test passed');