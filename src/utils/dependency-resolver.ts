import type { StackforgeConfig } from '../types/config.js';
import { collectDependencies } from '../generators/deps/deps-registry.js';
import { collectScripts } from '../generators/scripts/scripts-registry.js';
import { resolveVersions } from './version-manager.js';

export function resolveDependencies(config: StackforgeConfig, options?: { allowMajor?: boolean }) {
  resolveVersions(options);
  return collectDependencies(config);
}

export function resolveScripts(config: StackforgeConfig) {
  return collectScripts(config);
}
