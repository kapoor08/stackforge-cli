import type { StackforgeConfig } from '../types/config.js';

export function defaultConfig(): StackforgeConfig {
  return {
    projectName: 'my-app',
    packageManager: 'npm',
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'none' },
    auth: { provider: 'none' },
    api: { type: 'none' },
    features: {},
    aiAgents: []
  };
}