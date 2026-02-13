import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const cwd = process.cwd();
const entries = await readdir(cwd, { withFileTypes: true });

const tmpDirs = entries
  .filter((e) => e.isDirectory() && e.name.startsWith('tmp-'))
  .map((e) => join(cwd, e.name));

for (const dir of tmpDirs) {
  await rm(dir, { recursive: true, force: true });
  console.log(`removed ${dir}`);
}

if (tmpDirs.length === 0) {
  console.log('no tmp-* directories found');
}