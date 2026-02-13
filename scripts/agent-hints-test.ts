import { mkdir, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-agent-hints');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-agent-hints',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'nextauth' },
  api: { type: 'trpc' },
  features: [],
  aiAgents: ['claude']
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

const contextPath = join(tempRoot, config.projectName, '.ai-agents', 'claude', 'context.json');
const context = JSON.parse(await readFile(contextPath, 'utf8')) as { hints?: string[] };
if (!context.hints || context.hints.length === 0) {
  throw new Error('context.json missing hints');
}

console.log('agent hints test passed');