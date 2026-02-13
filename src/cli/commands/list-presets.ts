import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { getPreset, presetNames } from '../../presets/index.js';

export const listPresetsCommand = new Command('list-presets')
  .option('--details', 'show preset details')
  .action((options) => {
    const presets = presetNames;
    for (const name of presets) {
      const preset = getPreset(name);
      if (!preset) {
        logger.info(`${name}: missing`);
        continue;
      }
      if (options.details) {
        const features = preset.features && preset.features.length ? preset.features.join(', ') : 'none';
        logger.info(`${name}: frontend=${preset.frontend?.type ?? 'n/a'} ui=${preset.ui?.library ?? 'n/a'} db=${preset.database?.provider ?? 'n/a'} orm=${preset.database?.orm ?? 'n/a'} auth=${preset.auth?.provider ?? 'n/a'} api=${preset.api?.type ?? 'n/a'} features=${features}`);
      } else {
        logger.info(`${name}: available`);
      }
    }
  });