import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import type { StackforgeConfig } from '../src/types/config.js';

const config: StackforgeConfig = {
  projectName: 'smoke-app',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'tailwind' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: [],
  aiAgents: []
};

validateConfig(config);
await runGenerators(process.cwd(), config, {
  dryRun: true,
  log: (message: string) => console.log(message)
});