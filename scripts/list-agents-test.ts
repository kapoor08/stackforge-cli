import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';
import { listAgentsCommand } from '../src/cli/commands/list-agents.js';

const tempRoot = join(process.cwd(), 'tmp-list-agents');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-list-agents',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: {},
  aiAgents: ['claude', 'copilot']
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

process.chdir(join(tempRoot, config.projectName));
await listAgentsCommand.parseAsync(['node', 'list-agents']);

console.log('list-agents test passed');