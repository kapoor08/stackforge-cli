import { exec } from 'node:child_process';

export function fetchLatestVersion(pkg: string): Promise<string | null> {
  return new Promise((resolve) => {
    exec(`npm view ${pkg} version`, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      const version = String(stdout).trim();
      resolve(version || null);
    });
  });
}
