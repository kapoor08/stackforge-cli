import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { generateAiAgentConfigs } from '../../ai-agents/config-generator.js';
import { supported } from '../../utils/supported.js';

export const addAgentCommand = new Command('add-agent')
  .argument('<agent>', 'agent to add')
  .action(async (agent) => {
    if (!supported.agents.includes(agent as typeof supported.agents[number])) {
      throw new Error(`Unsupported agent: ${agent}`);
    }
    const cwd = process.cwd();
    const config = await readProjectConfig(cwd);
    const set = new Set(config.aiAgents ?? []);
    set.add(agent);
    const next = { ...config, aiAgents: Array.from(set) };
    await writeProjectConfig(cwd, next);
    await generateAiAgentConfigs(cwd, next, { dryRun: false, log: logger.info });
    logger.info(`Added agent: ${agent}`);
  });