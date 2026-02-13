import { exec } from 'node:child_process';
import type { PackageManager } from '../types/config.js';

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install';
    case 'yarn':
      return 'yarn install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

export function runInstall(pm: PackageManager, cwd: string): Promise<void> {
  const command = getInstallCommand(pm);
  return new Promise((resolve, reject) => {
    const child = exec(command, { cwd }, (err) => {
      if (err) reject(err);
      else resolve();
    });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}