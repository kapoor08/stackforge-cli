import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { updateConfigForFeature, syncPackageJson } from '../../utils/feature-update.js';
import { validateConfig } from '../validators/config.js';
import { validateCompatibility } from '../validators/compatibility.js';
import { validateDependencies } from '../validators/dependencies.js';
import { cleanupFeature } from '../../utils/feature-cleanup.js';
import { buildProjectReadme } from '../../generators/core/readme.js';
import { writeTextFile } from '../../utils/file-system.js';
import { join } from 'node:path';

function parseFeature(feature: string): { category: string; value: string } {
  const [category, value] = feature.split(':');
  if (!category || !value) {
    throw new Error('Feature must be in the form category:value (e.g., auth:nextauth).');
  }
  return { category, value };
}

function assertRemovalTarget(category: string, value: string, current: Awaited<ReturnType<typeof readProjectConfig>>): void {
  switch (category) {
    case 'ui':
      if (current.ui.library !== value) {
        throw new Error(`UI library ${value} is not installed.`);
      }
      break;
    case 'auth':
      if (current.auth.provider !== value) {
        throw new Error(`Auth provider ${value} is not installed.`);
      }
      break;
    case 'api':
      if (current.api.type !== value) {
        throw new Error(`API type ${value} is not installed.`);
      }
      break;
    case 'database':
      if (current.database.provider !== value) {
        throw new Error(`Database provider ${value} is not installed.`);
      }
      break;
    case 'orm':
      if (current.database.orm !== value) {
        throw new Error(`ORM ${value} is not installed.`);
      }
      break;
    case 'feature':
      if (!current.features.includes(value)) {
        throw new Error(`Feature ${value} is not installed.`);
      }
      break;
    default:
      throw new Error(`Unknown feature category: ${category}`);
  }
}

export const removeCommand = new Command('remove')
  .argument('<feature>', 'feature to remove (category:value)')
  .action(async (feature) => {
    const cwd = process.cwd();
    const { category, value } = parseFeature(feature);
    const current = await readProjectConfig(cwd);
    assertRemovalTarget(category, value, current);
    await cleanupFeature(cwd, current, category, value);

    const next = updateConfigForFeature(current, category, value, 'remove');
    validateConfig(next);
    validateCompatibility(next);
    validateDependencies(next);

    await writeProjectConfig(cwd, next);
    await syncPackageJson(`${cwd}/package.json`, current, next);

    const readme = buildProjectReadme(next);
    await writeTextFile(join(cwd, 'README.md'), readme + '\n');

    logger.info(`Removed ${feature}`);
  });
