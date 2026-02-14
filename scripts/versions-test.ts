import { collectDependencies } from '../src/generators/deps/deps-registry.js';
import { versions } from '../src/utils/versions.js';
import type { StackforgeConfig } from '../src/types/config.js';

const config: StackforgeConfig = {
  projectName: 'test',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: {},
  aiAgents: []
};

const deps = collectDependencies(config);
if (deps.dependencies['next'] !== versions.next) {
  throw new Error('deps should use versions map for next');
}

console.log('versions test passed');