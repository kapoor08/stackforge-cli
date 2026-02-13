import { mkdir, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-agent-tools');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-agent-tools',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: [],
  aiAgents: ['claude']
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

const toolsPath = join(tempRoot, config.projectName, '.ai-agents', 'claude', 'tools.json');
const tools = JSON.parse(await readFile(toolsPath, 'utf8')) as { tools: string[] };
if (!tools.tools.includes('database') || !tools.tools.includes('orm')) {
  throw new Error('tools.json missing database/orm');
}

console.log('agent tools test passed');