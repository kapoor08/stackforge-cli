import type { StackforgeConfig } from '../types/config.js';
import { getPreset } from '../presets/index.js';

export function buildConfig(base: StackforgeConfig): StackforgeConfig {
  const preset = getPreset(base.preset);
  const merged: StackforgeConfig = preset
    ? {
        ...base,
        ...preset,
        frontend: preset.frontend ?? base.frontend,
        ui: preset.ui ?? base.ui,
        database: preset.database ?? base.database,
        auth: preset.auth ?? base.auth,
        api: preset.api ?? base.api,
        features: preset.features ?? base.features,
        aiAgents: preset.aiAgents ?? base.aiAgents
      }
    : base;

  if (merged.ui.library === 'shadcn') {
    // Ensure Tailwind base requirements are satisfied by generator/deps.
    merged.ui = { library: 'shadcn' };
  }

  return merged;
}