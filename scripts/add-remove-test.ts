import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import { readProjectConfig, writeProjectConfig } from '../src/utils/project-config.js';
import { updateConfigForFeature, syncPackageJson } from '../src/utils/feature-update.js';
import { cleanupFeature } from '../src/utils/feature-cleanup.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-add-remove');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-add-remove',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: [],
  aiAgents: []
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

const projectRoot = join(tempRoot, config.projectName);
const current = await readProjectConfig(projectRoot);

// Add UI
const nextUi = updateConfigForFeature(current, 'ui', 'shadcn', 'add');
await writeProjectConfig(projectRoot, nextUi);
await syncPackageJson(join(projectRoot, 'package.json'), current, nextUi);

const afterAdd = await readProjectConfig(projectRoot);
if (afterAdd.ui.library !== 'shadcn') throw new Error('Add UI failed');

// Remove ORM
await cleanupFeature(projectRoot, afterAdd, 'orm');
const noOrm = updateConfigForFeature(afterAdd, 'orm', undefined, 'remove');
await writeProjectConfig(projectRoot, noOrm);
await syncPackageJson(join(projectRoot, 'package.json'), afterAdd, noOrm);

const afterOrmRemove = await readProjectConfig(projectRoot);
if (afterOrmRemove.database.orm) throw new Error('Remove ORM failed');

// Remove Database provider (should clear ORM too)
await cleanupFeature(projectRoot, afterOrmRemove, 'database');
const noDb = updateConfigForFeature(afterOrmRemove, 'database', undefined, 'remove');
await writeProjectConfig(projectRoot, noDb);
await syncPackageJson(join(projectRoot, 'package.json'), afterOrmRemove, noDb);

const afterDbRemove = await readProjectConfig(projectRoot);
if (afterDbRemove.database.provider !== 'none') throw new Error('Remove database failed');
if (afterDbRemove.database.orm) throw new Error('Database removal should clear ORM');

// Remove UI
await cleanupFeature(projectRoot, afterDbRemove, 'ui');
const removed = updateConfigForFeature(afterDbRemove, 'ui', undefined, 'remove');
await writeProjectConfig(projectRoot, removed);
await syncPackageJson(join(projectRoot, 'package.json'), afterDbRemove, removed);

const afterRemove = await readProjectConfig(projectRoot);
if (afterRemove.ui.library !== 'none') throw new Error('Remove UI failed');

console.log('add/remove test passed');