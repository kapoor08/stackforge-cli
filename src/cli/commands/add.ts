import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig, writeProjectConfig } from '../../utils/project-config.js';
import { updateConfigForFeature, syncPackageJson } from '../../utils/feature-update.js';
import { validateConfig } from '../validators/config.js';
import { validateCompatibility } from '../validators/compatibility.js';
import { validateDependencies } from '../validators/dependencies.js';
import { generateUiFiles } from '../../generators/ui/ui-files.js';
import { generateDatabaseFiles } from '../../generators/database/database-files.js';
import { generateAuthFiles } from '../../generators/auth/auth-files.js';
import { generateApiFiles } from '../../generators/api/api-files.js';
import { generateFeatureFiles } from '../../generators/features/feature-files.js';
import { dirname, join } from 'node:path';
import { buildProjectReadme } from '../../generators/core/readme.js';
import { writeTextFile } from '../../utils/file-system.js';

function parseFeature(feature: string): { category: string; value: string } {
  const [category, value] = feature.split(':');
  if (!category || !value) {
    throw new Error('Feature must be in the form category:value (e.g., auth:nextauth).');
  }
  return { category, value };
}

export const addCommand = new Command('add')
  .argument('<feature>', 'feature to add (category:value)')
  .action(async (feature) => {
    const cwd = process.cwd();
    const { category, value } = parseFeature(feature);
    const current = await readProjectConfig(cwd);
    const next = updateConfigForFeature(current, category, value, 'add');
    validateConfig(next);
    validateCompatibility(next);
    validateDependencies(next);

    await writeProjectConfig(cwd, next);
    await syncPackageJson(`${cwd}/package.json`, current, next);

    const root = dirname(cwd);
    if (category === 'ui') await generateUiFiles(root, next);
    if (category === 'database' || category === 'orm') await generateDatabaseFiles(root, next);
    if (category === 'auth') await generateAuthFiles(root, next);
    if (category === 'api') await generateApiFiles(root, next);
    if (category === 'feature') await generateFeatureFiles(root, next);

    const readme = buildProjectReadme(next);
    await writeTextFile(join(cwd, 'README.md'), readme + '\n');

    logger.info(`Added ${feature}`);
  });
