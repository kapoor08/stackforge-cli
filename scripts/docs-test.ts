import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
await readFile(join(root, 'docs', 'README.md'));
await readFile(join(root, 'docs', 'FEATURE_EMAIL.md'));
await readFile(join(root, 'docs', 'FEATURE_STORAGE.md'));
await readFile(join(root, 'docs', 'FEATURE_PAYMENTS.md'));

console.log('docs test passed');