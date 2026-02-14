import { mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runGenerators } from '../src/cli/run-generators.js';
import { validateConfig } from '../src/cli/validators/config.js';
import { updateCommand } from '../src/cli/commands/update.js';
import type { StackforgeConfig } from '../src/types/config.js';

const tempRoot = join(process.cwd(), 'tmp-update');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const config: StackforgeConfig = {
  projectName: 'test-update',
  packageManager: 'npm',
  frontend: { type: 'nextjs', language: 'ts' },
  ui: { library: 'none' },
  database: { provider: 'postgres', orm: 'drizzle' },
  auth: { provider: 'none' },
  api: { type: 'none' },
  features: {},
  aiAgents: []
};

validateConfig(config);
await runGenerators(tempRoot, config, { dryRun: false, log: () => {} });

const projectRoot = join(tempRoot, config.projectName);
const pkgPath = join(projectRoot, 'package.json');
const pkgRaw = await readFile(pkgPath, 'utf8');
const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
if (pkg.scripts) {
  delete pkg.scripts['db:generate'];
}
await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

process.chdir(projectRoot);
await updateCommand.parseAsync(['node', 'update']);

const next = JSON.parse(await readFile(pkgPath, 'utf8')) as { scripts?: Record<string, string> };
if (!next.scripts || next.scripts['db:generate'] !== 'npx drizzle-kit generate') {
  throw new Error('update failed to restore db:generate');
}

console.log('update test passed');