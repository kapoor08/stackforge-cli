import { mkdir, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-feature-clients');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-feature-clients',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: ['email', 'payments'],
  aiAgents: []
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

const projectRoot = join(tempRoot, config.projectName);
await access(join(projectRoot, 'src', 'lib', 'resend.ts'));
await access(join(projectRoot, 'src', 'lib', 'stripe.ts'));

console.log('feature clients test passed');