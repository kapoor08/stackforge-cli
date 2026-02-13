import type { PackageManager } from '../../types/config.js';

const VALID: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export function assertValidPackageManager(value: string): asserts value is PackageManager {
  if (!VALID.includes(value as PackageManager)) {
    throw new Error(`Invalid package manager: ${value}`);
  }
}