import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { getPreset } from '../../presets/index.js';
import { validateConfig } from '../validators/config.js';
import { validateCompatibility } from '../validators/compatibility.js';
import { validateDependencies } from '../validators/dependencies.js';
import { cleanupFeature } from '../../utils/feature-cleanup.js';
import { syncPackageJson } from '../../utils/feature-update.js';
import { generateUiFiles } from '../../generators/ui/ui-files.js';
import { generateDatabaseFiles } from '../../generators/database/database-files.js';
import { generateAuthFiles } from '../../generators/auth/auth-files.js';
import { generateApiFiles } from '../../generators/api/api-files.js';
import { generateFeatureFiles } from '../../generators/features/feature-files.js';
import { generateFrontendFiles } from '../../generators/frontend/frontend-files.js';
import { buildProjectReadme } from '../../generators/core/readme.js';
import { writeTextFile } from '../../utils/file-system.js';
import { join, dirname } from 'node:path';

export const upgradeCommand = new Command('upgrade')
  .option('--preset <name>', 'preset to upgrade to')
  .action(async (options) => {
    const cwd = process.cwd();
    const current = await readProjectConfig(cwd);
    const preset = getPreset(options.preset);
    if (!preset) {
      throw new Error('Unknown preset. Use stackforge list-presets.');
    }

    const next = {
      ...current,
      ...preset,
      preset: options.preset,
      projectName: current.projectName,
      packageManager: current.packageManager,
      aiAgents: current.aiAgents
    };

    if (current.frontend.type !== next.frontend.type || current.frontend.language !== next.frontend.language) {
      throw new Error('Preset upgrade does not support changing frontend type or language yet.');
    }

    validateConfig(next);
    validateCompatibility(next);
    validateDependencies(next);

    if (current.ui.library !== next.ui.library) {
      await cleanupFeature(cwd, current, 'ui', current.ui.library);
    }
    if (current.database.provider !== next.database.provider) {
      await cleanupFeature(cwd, current, 'database', current.database.provider);
    }
    if (current.database.orm !== next.database.orm) {
      await cleanupFeature(cwd, current, 'orm', current.database.orm);
    }
    if (current.auth.provider !== next.auth.provider) {
      await cleanupFeature(cwd, current, 'auth', current.auth.provider);
    }
    if (current.api.type !== next.api.type) {
      await cleanupFeature(cwd, current, 'api', current.api.type);
    }
    const removedFeatures = current.features.filter((f) => !next.features.includes(f));
    for (const feature of removedFeatures) {
      await cleanupFeature(cwd, current, 'feature', feature);
    }

    await writeProjectConfig(cwd, next);
    await syncPackageJson(join(cwd, 'package.json'), current, next);

    const root = dirname(cwd);
    await generateFrontendFiles(root, next);
    await generateUiFiles(root, next);
    await generateDatabaseFiles(root, next);
    await generateAuthFiles(root, next);
    await generateApiFiles(root, next);
    await generateFeatureFiles(root, next);

    const readme = buildProjectReadme(next);
    await writeTextFile(join(cwd, 'README.md'), readme + '\n');

    logger.info(`Upgraded project to preset: ${options.preset}`);
  });
