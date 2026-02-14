import { Command } from 'commander';
import { promptForConfig } from '../prompts/index.js';
import { runGenerators } from '../run-generators.js';
import { validateConfig } from '../validators/config.js';
import { validateCompatibility } from '../validators/compatibility.js';
import { validateDependencies } from '../validators/dependencies.js';
import { logger } from '../../utils/logger.js';
import { runInstall } from '../../utils/install.js';
import { join, resolve, basename } from 'node:path';

function parseCsv(input?: string): string[] | undefined {
  if (!input) return undefined;
  return input.split(',').map((a) => a.trim()).filter(Boolean);
}

export const createCommand = new Command('create')
  .argument('[project-name]', 'name of the project')
  .option('--preset <name>', 'use a preset config')
  .option('--no-install', 'skip dependency install')
  .option('--dry-run', 'print planned actions without writing files')
  .option('--ai-agents <list>', 'comma-separated list of AI agents to configure')
  .option('--features <list>', 'comma-separated list of features to include')
  .option('--yes', 'skip prompts and use defaults')
  .option('--no-prompts', 'alias for --yes')
  .option('--out-dir <path>', 'output directory (defaults to current working directory)')
  .action(async (projectName, options) => {
    logger.info('Starting StackForge create flow...');
    const skipPrompts = Boolean(options.yes || options.noPrompts);

    // Handle '.' to use current directory name
    let resolvedProjectName = projectName;
    if (projectName === '.') {
      resolvedProjectName = basename(process.cwd());
    }

    const config = await promptForConfig({ projectName: resolvedProjectName, preset: options.preset, skipPrompts });
    if (options.aiAgents) {
      config.aiAgents = parseCsv(options.aiAgents) ?? [];
    }
    if (options.features) {
      config.features = parseCsv(options.features) ?? [];
    }
    validateConfig(config);
    validateCompatibility(config);
    validateDependencies(config);
    const ctx = {
      dryRun: Boolean(options.dryRun),
      log: (message: string) => logger.info(message)
    };
    const outDir = options.outDir ? resolve(options.outDir) : process.cwd();
    await runGenerators(outDir, config, ctx);
    if (options.install !== false && !options.dryRun) {
      const projectRoot = join(outDir, config.projectName);
      logger.info('Installing dependencies...');
      await runInstall(config.packageManager, projectRoot);
    }
    logger.info(`Project created: ${config.projectName}`);
  });
