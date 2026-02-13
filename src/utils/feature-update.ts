import type { StackforgeConfig } from '../types/config.js';
import { collectDependencies } from '../generators/deps/deps-registry.js';
import { collectScripts } from '../generators/scripts/scripts-registry.js';
import {
  mergeDependencies,
  mergeScripts,
  readPackageJson,
  removeDependencies,
  removeScripts,
  writePackageJson
} from './package-json.js';
import { supported } from './supported.js';

export function updateConfigForFeature(
  config: StackforgeConfig,
  category: string,
  value: string | undefined,
  action: 'add' | 'remove'
): StackforgeConfig {
  const next = { ...config, database: { ...config.database }, ui: { ...config.ui }, auth: { ...config.auth }, api: { ...config.api } };

  switch (category) {
    case 'ui':
      if (action === 'add' && value && !supported.ui.includes(value as StackforgeConfig['ui']['library'])) {
        throw new Error(`Unsupported UI library: ${value}`);
      }
      next.ui.library = action === 'remove' ? 'none' : (value as StackforgeConfig['ui']['library']);
      break;
    case 'auth':
      if (action === 'add' && value && !supported.auth.includes(value as StackforgeConfig['auth']['provider'])) {
        throw new Error(`Unsupported auth provider: ${value}`);
      }
      next.auth.provider = action === 'remove' ? 'none' : (value as StackforgeConfig['auth']['provider']);
      break;
    case 'api':
      if (action === 'add' && value && !supported.api.includes(value as StackforgeConfig['api']['type'])) {
        throw new Error(`Unsupported API type: ${value}`);
      }
      next.api.type = action === 'remove' ? 'none' : (value as StackforgeConfig['api']['type']);
      break;
    case 'database':
      if (action === 'add' && value && !supported.database.includes(value as StackforgeConfig['database']['provider'])) {
        throw new Error(`Unsupported database: ${value}`);
      }
      next.database.provider = action === 'remove' ? 'none' : (value as StackforgeConfig['database']['provider']);
      if (action === 'remove' || value === 'none') next.database.orm = undefined;
      break;
    case 'orm':
      if (action === 'add' && value && !supported.orm.includes(value as NonNullable<StackforgeConfig['database']['orm']>)) {
        throw new Error(`Unsupported ORM: ${value}`);
      }
      next.database.orm = action === 'remove' ? undefined : (value as NonNullable<StackforgeConfig['database']['orm']>);
      break;
    case 'feature':
      if (action === 'add' && value && !supported.features.includes(value as any)) {
        throw new Error(`Unsupported feature: ${value}`);
      }
      if (action === 'add' && value) {
        next.features = Array.from(new Set([...next.features, value]));
      } else if (action === 'remove' && value) {
        next.features = next.features.filter((f) => f !== value);
      }
      break;
    default:
      throw new Error(`Unknown feature category: ${category}`);
  }

  return next;
}

function diffKeys<T extends Record<string, string>>(oldMap: T, newMap: T): T {
  const diff: Record<string, string> = {};
  for (const key of Object.keys(oldMap)) {
    if (!(key in newMap)) diff[key] = oldMap[key];
  }
  return diff as T;
}

export async function syncPackageJson(
  path: string,
  oldConfig: StackforgeConfig,
  newConfig: StackforgeConfig
): Promise<void> {
  const pkg = await readPackageJson(path);
  const oldScripts = collectScripts(oldConfig);
  const newScripts = collectScripts(newConfig);
  const oldDeps = collectDependencies(oldConfig);
  const newDeps = collectDependencies(newConfig);

  const scriptsToRemove = diffKeys(oldScripts, newScripts);
  const depsToRemove = {
    dependencies: diffKeys(oldDeps.dependencies, newDeps.dependencies),
    devDependencies: diffKeys(oldDeps.devDependencies, newDeps.devDependencies)
  };

  let nextPkg = removeScripts(pkg, scriptsToRemove);
  nextPkg = removeDependencies(nextPkg, depsToRemove);
  nextPkg = mergeScripts(nextPkg, newScripts);
  nextPkg = mergeDependencies(nextPkg, newDeps);

  await writePackageJson(path, nextPkg);
}