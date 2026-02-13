import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readProjectConfig } from '../src/utils/project-config.js';

const tempRoot = join(process.cwd(), 'tmp-auto-migrate');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const projectRoot = join(tempRoot, 'auto-migrate-app');
await mkdir(projectRoot, { recursive: true });
await writeFile(join(projectRoot, 'stackforge.json'), JSON.stringify({ projectName: 'auto-migrate-app', _schemaVersion: 0 }));

await readProjectConfig(projectRoot);
const updated = JSON.parse(await readFile(join(projectRoot, 'stackforge.json'), 'utf8')) as { _schemaVersion?: number };
if (!updated._schemaVersion || updated._schemaVersion < 1) {
  throw new Error('auto-migrate failed');
}

console.log('auto-migrate test passed');