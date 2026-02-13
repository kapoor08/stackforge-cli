import { Command } from 'commander';
import { createRequire } from 'node:module';
import { createCommand } from './cli/commands/create.js';
import { listCommand } from './cli/commands/list.js';
import { addCommand } from './cli/commands/add.js';
import { removeCommand } from './cli/commands/remove.js';
import { updateCommand } from './cli/commands/update.js';
import { doctorCommand } from './cli/commands/doctor.js';
import { configureAgentsCommand } from './cli/commands/configure-agents.js';
import { addAgentCommand } from './cli/commands/add-agent.js';
import { removeAgentCommand } from './cli/commands/remove-agent.js';
import { listAgentsCommand } from './cli/commands/list-agents.js';
import { migrateCommand } from './cli/commands/migrate.js';
import { listPresetsCommand } from './cli/commands/list-presets.js';
import { useCommand } from './cli/commands/use.js';
import { validateCommand } from './cli/commands/validate.js';
import { fixCommand } from './cli/commands/fix.js';
import { upgradeCommand } from './cli/commands/upgrade.js';
import { logger } from './utils/logger.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
  .name('create-stackforge')
  .description('Universal full-stack boilerplate generator')
  .version(version);

program.addCommand(createCommand);
program.addCommand(listCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(updateCommand);
program.addCommand(doctorCommand);
program.addCommand(configureAgentsCommand);
program.addCommand(addAgentCommand);
program.addCommand(removeAgentCommand);
program.addCommand(listAgentsCommand);
program.addCommand(migrateCommand);
program.addCommand(listPresetsCommand);
program.addCommand(useCommand);
program.addCommand(validateCommand);
program.addCommand(fixCommand);
program.addCommand(upgradeCommand);

program.parseAsync(process.argv).catch((err) => {
  logger.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
