import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { checkProject } from '../../utils/doctor.js';

export const validateCommand = new Command('validate')
  .description('validate project configuration and generated files')
  .action(async () => {
    const result = await checkProject(process.cwd());
    if (result.issues.length === 0) {
      logger.info('Validation passed.');
      return;
    }
    for (const issue of result.issues) {
      logger.error(issue);
    }
    process.exitCode = 1;
  });
