import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';
import { listCommand } from '../src/cli/commands/list.js';

const tempRoot = join(process.cwd(), 'tmp-list');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-list',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'nextauth' },
  api: { type: 'trpc' },
  features: ['email'],
  aiAgents: []
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

process.chdir(join(tempRoot, config.projectName));
await listCommand.parseAsync(['node', 'list']);

console.log('list test passed');