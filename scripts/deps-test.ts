import { collectDependencies } from '../src/generators/deps/deps-registry.js';
import type { StackforgeConfig } from '../src/types/config.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const config: StackforgeConfig = {
  projectName: 'vite-rest-app',
  packageManager: 'npm',
  frontend: { type: 'vite', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'rest' },
  features: {},
  aiAgents: []
};

const deps = collectDependencies(config);
assert(deps.devDependencies['tsx'] !== undefined, 'tsx should be added for Vite REST TS');
assert(deps.devDependencies['@types/node'] !== undefined, 'types node should be added for Vite REST TS');

console.log('deps test passed');