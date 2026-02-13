import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { generateAiAgentConfigs } from '../../ai-agents/config-generator.js';
import { supported } from '../../utils/supported.js';

export const removeAgentCommand = new Command('remove-agent')
  .argument('<agent>', 'agent to remove')
  .action(async (agent) => {
    if (!supported.agents.includes(agent as typeof supported.agents[number])) {
      throw new Error(`Unsupported agent: ${agent}`);
    }
    const cwd = process.cwd();
    const config = await readProjectConfig(cwd);
    const next = { ...config, aiAgents: (config.aiAgents ?? []).filter((a) => a !== agent) };
    await writeProjectConfig(cwd, next);
    await generateAiAgentConfigs(cwd, next, { dryRun: false, log: logger.info });
    logger.info(`Removed agent: ${agent}`);
  });