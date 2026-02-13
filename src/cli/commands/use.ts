import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { removeLockfiles } from '../../utils/package-manager.js';
import { runInstall } from '../../utils/install.js';
import type { PackageManager } from '../../types/config.js';

const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export const useCommand = new Command('use')
  .argument('<packageManager>', 'npm | pnpm | yarn | bun')
  .option('--no-install', 'skip installing dependencies after switching')
  .action(async (packageManager: string, options) => {
    if (!PACKAGE_MANAGERS.includes(packageManager as PackageManager)) {
      throw new Error(`Unsupported package manager: ${packageManager}`);
    }

    const cwd = process.cwd();
    const config = await readProjectConfig(cwd);
    const nextManager = packageManager as PackageManager;

    if (config.packageManager === nextManager) {
      logger.info(`Package manager already set to ${nextManager}.`);
      return;
    }

    await removeLockfiles(cwd);
    await writeProjectConfig(cwd, { ...config, packageManager: nextManager });

    if (options.install !== false) {
      await runInstall(nextManager, cwd);
    }

    logger.info(`Package manager switched to ${nextManager}.`);
  });
