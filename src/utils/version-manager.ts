import { versions } from './versions.js';

export function resolveVersions(options?: { allowMajor?: boolean }): typeof versions {
  return versions;
}
