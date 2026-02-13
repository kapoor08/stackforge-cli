import { mkdir, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { createCommand } from '../src/cli/commands/create.js';

const tempRoot = join(process.cwd(), 'tmp-create-features');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

await createCommand.parseAsync([
  'node',
  'create',
  'feature-app',
  '--no-install',
  '--yes',
  '--features',
  'email,payments',
  '--out-dir',
  tempRoot
]);

const projectRoot = join(tempRoot, 'feature-app');
await access(join(projectRoot, 'src', 'lib', 'resend.ts'));
await access(join(projectRoot, 'src', 'lib', 'stripe.ts'));

console.log('create features test passed');