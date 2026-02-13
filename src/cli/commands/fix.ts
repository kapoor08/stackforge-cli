import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { checkProject, fixProject } from '../../utils/doctor.js';

export const fixCommand = new Command('fix')
  .description('apply safe fixes to project configuration')
  .action(async () => {
    const cwd = process.cwd();
    const result = await checkProject(cwd);
    if (result.issues.length === 0) {
      logger.info('No issues found.');
      return;
    }
    await fixProject(result, cwd);
    logger.info('Applied fixes.');
  });
