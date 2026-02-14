import { exec } from 'node:child_process';
import type { PackageManager } from '../types/config.js';

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      // --prefer-offline uses cache when possible, --reporter=silent reduces output
      return 'pnpm install --prefer-offline';
    case 'yarn':
      // --prefer-offline uses cache, --silent reduces output
      return 'yarn install --prefer-offline --silent';
    case 'bun':
      // Bun is already fast, just use default
      return 'bun install';
    default:
      // --prefer-offline uses cache, --no-audit skips security audit, --no-fund skips funding messages
      return 'npm install --prefer-offline --no-audit --no-fund';
  }
}

export function runInstall(pm: PackageManager, cwd: string): Promise<void> {
  const command = getInstallCommand(pm);
  return new Promise((resolve, reject) => {
    const child = exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (err) => {
      if (err) reject(err);
      else resolve();
    });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}