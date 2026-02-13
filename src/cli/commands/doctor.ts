import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { STACKFORGE_SCHEMA_VERSION } from '../../utils/schema.js';
import { checkProject, fixProject } from '../../utils/doctor.js';
import { readProjectConfig } from '../../utils/project-config.js';
import { readFile } from 'node:fs/promises';

export const doctorCommand = new Command('doctor')
  .option('--fix', 'apply non-destructive fixes')
  .action(async (options) => {
    const cwd = process.cwd();
    const configPath = join(cwd, 'stackforge.json');
    if (!existsSync(configPath)) {
      logger.error('Missing stackforge.json. Run from a StackForge project root.');
      return;
    }

    let config;
    try {
      const raw = JSON.parse(await readFile(configPath, 'utf8')) as { _schemaVersion?: number };
      const schemaVersion = raw._schemaVersion ?? 0;
      if (schemaVersion !== STACKFORGE_SCHEMA_VERSION) {
        logger.warn(`stackforge.json schema version ${schemaVersion} (expected ${STACKFORGE_SCHEMA_VERSION})`);
      } else {
        logger.info('stackforge.json OK');
      }
      config = await readProjectConfig(cwd);
    } catch (err) {
      logger.error('Failed to read stackforge.json');
      return;
    }

    const pkgPath = join(cwd, 'package.json');
    if (!existsSync(pkgPath)) {
      logger.error('Missing package.json');
      return;
    }
    const result = await checkProject(cwd);
    if (result.issues.length === 0) {
      logger.info('No issues found.');
      return;
    }

    for (const issue of result.issues) {
      logger.warn(issue);
    }

    if (options.fix) {
      await fixProject(result, cwd);
      logger.info('Applied fixes.');
    }
  });
