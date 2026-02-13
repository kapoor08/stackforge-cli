import inquirer from 'inquirer';
import type { PackageManager, StackforgeConfig } from '../../types/config.js';
import { detectPackageManager } from '../../utils/package-manager.js';
import { buildConfig } from '../config-builder.js';
import { defaultConfig } from '../defaults.js';
import { supported } from '../../utils/supported.js';

export async function promptForConfig(input: {
  projectName?: string;
  preset?: string;
  skipPrompts?: boolean;
}): Promise<StackforgeConfig> {
  if (input.skipPrompts) {
    const base = defaultConfig();
    const merged: StackforgeConfig = {
      ...base,
      projectName: input.projectName ?? base.projectName,
      preset: input.preset
    };
    return buildConfig(merged);
  }

  const detected = detectPackageManager(process.cwd());

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name',
      default: input.projectName || 'my-app'
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'bun', value: 'bun' }
      ],
      default: detected || 'npm'
    },
    {
      type: 'list',
      name: 'frontend',
      message: 'Frontend framework',
      choices: supported.frontend.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'list',
      name: 'language',
      message: 'Language',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' }
      ]
    },
    {
      type: 'list',
      name: 'uiLibrary',
      message: 'UI library',
      choices: supported.ui.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'list',
      name: 'databaseProvider',
      message: 'Database provider',
      choices: supported.database.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'list',
      name: 'orm',
      message: 'ORM',
      when: (ans) => ans.databaseProvider !== 'none',
      choices: supported.orm.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'list',
      name: 'authProvider',
      message: 'Authentication',
      choices: supported.auth.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'list',
      name: 'apiType',
      message: 'API type',
      choices: supported.api.map((v) => ({ name: v, value: v }))
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Additional features',
      choices: supported.features.map((v) => ({ name: v, value: v }))
    }
  ]);

  const base: StackforgeConfig = {
    projectName: answers.projectName,
    packageManager: answers.packageManager as PackageManager,
    frontend: { type: answers.frontend, language: answers.language },
    ui: { library: answers.uiLibrary },
    database: { provider: answers.databaseProvider, orm: answers.orm },
    auth: { provider: answers.authProvider },
    api: { type: answers.apiType },
    features: answers.features ?? [],
    aiAgents: [],
    preset: input.preset
  };

  return buildConfig(base);
}