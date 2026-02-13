import { STACKFORGE_SCHEMA_VERSION } from './schema.js';
import type { StackforgeConfig } from '../types/config.js';

export interface StackforgeProjectFile extends StackforgeConfig {
  _schemaVersion?: number;
}

export function migrateConfig(input: StackforgeProjectFile): StackforgeProjectFile {
  let current = input._schemaVersion ?? 0;
  let config: StackforgeProjectFile = { ...input };

  if (current < 1) {
    config = { ...config, _schemaVersion: 1 };
    current = 1;
  }

  if (current !== STACKFORGE_SCHEMA_VERSION) {
    config._schemaVersion = STACKFORGE_SCHEMA_VERSION;
  }

  return config;
}