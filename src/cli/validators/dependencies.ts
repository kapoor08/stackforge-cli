import type { StackforgeConfig } from '../../types/config.js';
import { resolveDependencies, resolveScripts } from '../../utils/dependency-resolver.js';

export function validateDependencies(config: StackforgeConfig): void {
  const deps = resolveDependencies(config);
  const scripts = resolveScripts(config);

  if (Object.keys(scripts).length === 0) {
    throw new Error('No scripts resolved for the selected stack.');
  }

  if (Object.keys(deps.dependencies).length === 0 && Object.keys(deps.devDependencies).length === 0) {
    throw new Error('No dependencies resolved for the selected stack.');
  }
}
