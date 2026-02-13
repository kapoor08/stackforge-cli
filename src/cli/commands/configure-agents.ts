import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { generateAiAgentConfigs } from '../../ai-agents/config-generator.js';
import { supported } from '../../utils/supported.js';

export const configureAgentsCommand = new Command('configure-agents')
  .option('--agents <list>', 'comma-separated list of agents')
  .action(async (options) => {
    const cwd = process.cwd();
    const config = await readProjectConfig(cwd);
    const agents = options.agents
      ? String(options.agents)
          .split(',')
          .map((a: string) => a.trim())
          .filter(Boolean)
      : config.aiAgents;

    const invalid = (agents ?? []).filter((a) => !supported.agents.includes(a as typeof supported.agents[number]));
    if (invalid.length) {
      throw new Error(`Unsupported agents: ${invalid.join(', ')}`);
    }

    const next = { ...config, aiAgents: agents };
    await writeProjectConfig(cwd, next);
    await generateAiAgentConfigs(cwd, next, { dryRun: false, log: logger.info });
    logger.info('AI agents configured.');
  });
