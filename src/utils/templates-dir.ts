import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Resolves the templates directory reliably, whether running from:
 * - Source: `tsx src/cli.ts` (import.meta.url = src/cli.ts)
 * - Bundle: `node dist/cli.js` (import.meta.url = dist/cli.js)
 *
 * Walks up from the current file's directory until it finds package.json,
 * then resolves templates/ from there.
 */
function findPackageRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, 'package.json'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Could not find package root (package.json)');
}

export const TEMPLATES_DIR = join(findPackageRoot(), 'templates');
