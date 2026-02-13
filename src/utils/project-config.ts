import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { StackforgeConfig } from '../types/config.js';
import { STACKFORGE_SCHEMA_VERSION } from './schema.js';
import type { StackforgeProjectFile } from './migrations.js';
import { migrateConfig } from './migrations.js';

export async function writeProjectConfig(root: string, config: StackforgeConfig): Promise<void> {
  const path = join(root, 'stackforge.json');
  const payload: StackforgeProjectFile = { ...config, _schemaVersion: STACKFORGE_SCHEMA_VERSION };
  await writeFile(path, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

export async function readProjectConfig(root: string): Promise<StackforgeConfig> {
  const path = join(root, 'stackforge.json');
  const raw = await readFile(path, 'utf8');
  const parsed = JSON.parse(raw) as StackforgeProjectFile;
  const migrated = migrateConfig(parsed);
  if (migrated._schemaVersion !== parsed._schemaVersion) {
    await writeFile(path, JSON.stringify(migrated, null, 2) + '\n', 'utf8');
  }
  return migrated as StackforgeConfig;
}