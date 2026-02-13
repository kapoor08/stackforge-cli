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
  for (const feature of config.features) {
    if (!supported.features.includes(feature as any)) {
      throw new Error(`Unsupported feature: ${feature}`);
    }
  }

  if (config.auth.provider === 'nextauth' && config.frontend.type !== 'nextjs') {
    throw new Error('NextAuth requires Next.js.');
  }

  if (config.api.type === 'trpc' && config.frontend.language !== 'ts') {
    throw new Error('tRPC requires TypeScript.');
  }

  if (config.database.orm && config.database.provider === 'none') {
    throw new Error('ORM requires a database provider.');
  }
}