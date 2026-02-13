import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig } from '../../utils/project-config.js';
import { supported } from '../../utils/supported.js';

export const listCommand = new Command('list')
  .option('--available', 'show available features')
  .option('--category <name>', 'filter by category')
  .action(async (options) => {
    if (options.available) {
      logger.info('Available features:');
      logger.info(`frontend: ${supported.frontend.join(', ')}`);
      logger.info(`ui: ${supported.ui.join(', ')}`);
      logger.info(`database: ${supported.database.join(', ')}`);
      logger.info(`orm: ${supported.orm.join(', ')}`);
      logger.info(`auth: ${supported.auth.join(', ')}`);
      logger.info(`api: ${supported.api.join(', ')}`);
      logger.info(`features: ${supported.features.join(', ')}`);
      return;
    }

    const config = await readProjectConfig(process.cwd());
    if (!options.category) {
      logger.info(`frontend: ${config.frontend.type} (${config.frontend.language})`);
      logger.info(`ui: ${config.ui.library}`);
      logger.info(`database: ${config.database.provider}${config.database.orm ? ' (' + config.database.orm + ')' : ''}`);
      logger.info(`auth: ${config.auth.provider}`);
      logger.info(`api: ${config.api.type}`);
      logger.info(`features: ${config.features.length ? config.features.join(', ') : 'none'}`);
      return;
    }

    switch (options.category) {
      case 'frontend':
        logger.info(`frontend: ${config.frontend.type} (${config.frontend.language})`);
        break;
      case 'ui':
        logger.info(`ui: ${config.ui.library}`);
        break;
      case 'database':
        logger.info(`database: ${config.database.provider}${config.database.orm ? ' (' + config.database.orm + ')' : ''}`);
        break;
      case 'auth':
        logger.info(`auth: ${config.auth.provider}`);
        break;
      case 'api':
        logger.info(`api: ${config.api.type}`);
        break;
      case 'features':
        logger.info(`features: ${config.features.length ? config.features.join(', ') : 'none'}`);
        break;
      default:
        logger.error(`Unknown category: ${options.category}`);
    }
  });