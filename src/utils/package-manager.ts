import { existsSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import type { PackageManager } from '../types/config.js';

export const LOCKFILES: Array<{ pm: PackageManager; file: string }> = [
  { pm: 'pnpm', file: 'pnpm-lock.yaml' },
  { pm: 'yarn', file: 'yarn.lock' },
  { pm: 'bun', file: 'bun.lockb' },
  { pm: 'npm', file: 'package-lock.json' }
];

export function detectPackageManager(cwd: string): PackageManager | null {
  for (const entry of LOCKFILES) {
    if (existsSync(join(cwd, entry.file))) {
      return entry.pm;
    }
  }
  return null;
}

export async function removeLockfiles(cwd: string): Promise<void> {
  for (const entry of LOCKFILES) {
    const target = join(cwd, entry.file);
    if (existsSync(target)) {
      await unlink(target);
    }
  }
}
