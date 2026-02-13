import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { migrateCommand } from '../src/cli/commands/migrate.js';

const tempRoot = join(process.cwd(), 'tmp-migrate');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const projectRoot = join(tempRoot, 'migrate-app');
await mkdir(projectRoot, { recursive: true });
await writeFile(join(projectRoot, 'stackforge.json'), JSON.stringify({ projectName: 'migrate-app', _schemaVersion: 0 }));

process.chdir(projectRoot);
await migrateCommand.parseAsync(['node', 'migrate', '--dry-run']);

console.log('migrate test passed');