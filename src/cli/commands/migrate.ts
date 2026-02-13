import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { STACKFORGE_SCHEMA_VERSION } from '../../utils/schema.js';
import { migrateConfig } from '../../utils/migrations.js';

export const migrateCommand = new Command('migrate')
  .option('--dry-run', 'show planned migration without writing')
  .action(async (options) => {
    try {
      const cwd = process.cwd();
      const path = join(cwd, 'stackforge.json');
      const raw = await readFile(path, 'utf8');
      const parsed = JSON.parse(raw) as { _schemaVersion?: number };
      const current = parsed._schemaVersion ?? 0;

      if (current === STACKFORGE_SCHEMA_VERSION) {
        logger.info('No migration needed.');
        return;
      }

      logger.info(`Migrating schema ${current} -> ${STACKFORGE_SCHEMA_VERSION}`);
      const migrated = migrateConfig(parsed as any);
      if (!options.dryRun) {
        await writeFile(path, JSON.stringify(migrated, null, 2) + '\n', 'utf8');
        logger.info('Migration complete.');
      }
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });