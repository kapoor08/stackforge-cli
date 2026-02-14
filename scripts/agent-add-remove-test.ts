import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';
import { addAgentCommand } from '../src/cli/commands/add-agent.js';
import { removeAgentCommand } from '../src/cli/commands/remove-agent.js';

const tempRoot = join(process.cwd(), 'tmp-agent-add-remove');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-agent-add-remove',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: {},
  aiAgents: []
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

process.chdir(join(tempRoot, config.projectName));
await addAgentCommand.parseAsync(['node', 'add-agent', 'claude']);
await removeAgentCommand.parseAsync(['node', 'remove-agent', 'claude']);

console.log('agent add/remove test passed');