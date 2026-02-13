import { readFile, writeFile } from 'node:fs/promises';
import type { ScriptMap } from '../generators/scripts/scripts-registry.js';
import type { DependencyResult } from '../generators/deps/deps-registry.js';

interface PackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function readPackageJson(path: string): Promise<PackageJson> {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as PackageJson;
}

export async function writePackageJson(path: string, pkg: PackageJson): Promise<void> {
  await writeFile(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

export function mergeScripts(pkg: PackageJson, scripts: ScriptMap): PackageJson {
  return { ...pkg, scripts: { ...(pkg.scripts ?? {}), ...scripts } };
}

export function mergeDependencies(pkg: PackageJson, deps: DependencyResult): PackageJson {
  return {
    ...pkg,
    dependencies: { ...(pkg.dependencies ?? {}), ...deps.dependencies },
    devDependencies: { ...(pkg.devDependencies ?? {}), ...deps.devDependencies }
  };
}

export function removeScripts(pkg: PackageJson, scriptsToRemove: ScriptMap): PackageJson {
  if (!pkg.scripts) return pkg;
  const next = { ...pkg.scripts };
  for (const key of Object.keys(scriptsToRemove)) {
    delete next[key];
  }
  return { ...pkg, scripts: next };
}

export function removeDependencies(pkg: PackageJson, depsToRemove: DependencyResult): PackageJson {
  const nextDeps = { ...(pkg.dependencies ?? {}) };
  const nextDev = { ...(pkg.devDependencies ?? {}) };

  for (const key of Object.keys(depsToRemove.dependencies)) {
    delete nextDeps[key];
  }
  for (const key of Object.keys(depsToRemove.devDependencies)) {
    delete nextDev[key];
  }

  return { ...pkg, dependencies: nextDeps, devDependencies: nextDev };
}