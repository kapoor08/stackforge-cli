import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import { readProjectConfig, writeProjectConfig } from '../src/utils/project-config.js';
import { updateConfigForFeature, syncPackageJson } from '../src/utils/feature-update.js';
import { cleanupFeature } from '../src/utils/feature-cleanup.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-feature-storage');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-feature-storage',
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

const projectRoot = join(tempRoot, config.projectName);
const current = await readProjectConfig(projectRoot);
const next = updateConfigForFeature(current, 'feature', 'storage', 'add');
await writeProjectConfig(projectRoot, next);
await syncPackageJson(join(projectRoot, 'package.json'), current, next);

const afterAdd = await readProjectConfig(projectRoot);
if (!afterAdd.features.includes('storage')) throw new Error('feature add failed');

await cleanupFeature(projectRoot, afterAdd, 'feature');
const removed = updateConfigForFeature(afterAdd, 'feature', 'storage', 'remove');
await writeProjectConfig(projectRoot, removed);
await syncPackageJson(join(projectRoot, 'package.json'), afterAdd, removed);

const afterRemove = await readProjectConfig(projectRoot);
if (afterRemove.features.includes('storage')) throw new Error('feature remove failed');

console.log('feature storage test passed');