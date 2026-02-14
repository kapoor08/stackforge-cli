import type { StackforgeConfig } from '../../types/config.js';
import { supported } from '../../utils/supported.js';

export function validateConfig(config: StackforgeConfig): void {
  if (!supported.frontend.includes(config.frontend.type)) {
    throw new Error(`Unsupported frontend: ${config.frontend.type}`);
  }
  if (!supported.ui.includes(config.ui.library)) {
    throw new Error(`Unsupported UI library: ${config.ui.library}`);
  }
  if (!supported.database.includes(config.database.provider)) {
    throw new Error(`Unsupported database: ${config.database.provider}`);
  }
  if (config.database.orm && !supported.orm.includes(config.database.orm)) {
    throw new Error(`Unsupported ORM: ${config.database.orm}`);
  }
  if (!supported.auth.includes(config.auth.provider)) {
    throw new Error(`Unsupported auth: ${config.auth.provider}`);
  }
  if (!supported.api.includes(config.api.type)) {
    throw new Error(`Unsupported API: ${config.api.type}`);
  }
  if (config.features.email && !supported.email.includes(config.features.email)) {
    throw new Error(`Unsupported email provider: ${config.features.email}`);
  }
  if (config.features.storage && !supported.storage.includes(config.features.storage)) {
    throw new Error(`Unsupported storage provider: ${config.features.storage}`);
  }
  if (config.features.payments && !supported.payments.includes(config.features.payments)) {
    throw new Error(`Unsupported payment provider: ${config.features.payments}`);
  }
  if (config.features.analytics && !supported.analytics.includes(config.features.analytics)) {
    throw new Error(`Unsupported analytics provider: ${config.features.analytics}`);
  }
  if (config.features.errorTracking && !supported.errorTracking.includes(config.features.errorTracking)) {
    throw new Error(`Unsupported error tracking provider: ${config.features.errorTracking}`);
  }

  if (config.database.orm && config.database.provider === 'none') {
    throw new Error('ORM requires a database provider.');
  }
}