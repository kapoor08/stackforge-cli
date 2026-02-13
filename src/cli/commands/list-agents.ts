import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig } from '../../utils/project-config.js';

export const listAgentsCommand = new Command('list-agents')
  .action(async () => {
    const config = await readProjectConfig(process.cwd());
    const agents = config.aiAgents ?? [];
    if (agents.length === 0) {
      logger.info('No agents configured.');
      return;
    }
    logger.info(`Configured agents: ${agents.join(', ')}`);
  });