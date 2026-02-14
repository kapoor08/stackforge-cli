import { buildProjectReadme } from '../src/generators/core/readme.js';
import type { StackforgeConfig } from '../src/types/config.js';

const config: StackforgeConfig = {
  projectName: 'vite-rest-app',
  packageManager: 'npm',
  frontend: { type: 'vite', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'none' },
  auth: { provider: 'none' },
  api: { type: 'rest' },
  features: { email: 'resend' },
  aiAgents: []
};

const readme = buildProjectReadme(config);
if (!readme.includes('api:dev')) {
  throw new Error('README should mention api:dev for Vite REST');
}
if (!readme.includes('features/email/README.md')) {
  throw new Error('README should include feature docs link');
}

console.log('readme test passed');