import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, readTextFile, writeTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';
import { appendEnvLine } from '../../utils/env-file.js';
import { fileURLToPath } from 'node:url';

export async function generateFeatureFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);
  const templatesRoot = fileURLToPath(new URL('../../../templates', import.meta.url));
  const libDir = join(projectRoot, 'src', 'lib');
  const isTs = config.frontend.language === 'ts';

  if (config.features.includes('email')) {
    const dir = join(projectRoot, 'features', 'email');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'features', 'email', 'README.md'));
    const resendClient = await readTextFile(
      join(templatesRoot, 'features', 'email', isTs ? 'resend.ts' : 'resend.js')
    );
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, isTs ? 'resend.ts' : 'resend.js'), resendClient, ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'RESEND_API_KEY=""', ctx);
  }

  if (config.features.includes('storage')) {
    const dir = join(projectRoot, 'features', 'storage');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'features', 'storage', 'README.md'));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    const storageClient = await readTextFile(
      join(templatesRoot, 'features', 'storage', isTs ? 'storage.ts' : 'storage.js')
    );
    await writeTextFile(join(libDir, isTs ? 'storage.ts' : 'storage.js'), storageClient, ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'CLOUDINARY_URL=""', ctx);
  }

  if (config.features.includes('payments')) {
    const dir = join(projectRoot, 'features', 'payments');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'features', 'payments', 'README.md'));
    const stripeClient = await readTextFile(
      join(templatesRoot, 'features', 'payments', isTs ? 'stripe.ts' : 'stripe.js')
    );
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, isTs ? 'stripe.ts' : 'stripe.js'), stripeClient, ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'STRIPE_SECRET_KEY=""', ctx);
  }

  if (config.features.includes('analytics')) {
    const dir = join(projectRoot, 'features', 'analytics');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'features', 'analytics', 'README.md'));
    const client = await readTextFile(
      join(templatesRoot, 'features', 'analytics', isTs ? 'posthog.ts' : 'posthog.js')
    );
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, isTs ? 'posthog.ts' : 'posthog.js'), client, ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_POSTHOG_KEY=""', ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_POSTHOG_HOST=""', ctx);
  }

  if (config.features.includes('error-tracking')) {
    const dir = join(projectRoot, 'features', 'error-tracking');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'features', 'error-tracking', 'README.md'));
    const client = await readTextFile(
      join(templatesRoot, 'features', 'error-tracking', isTs ? 'sentry.ts' : 'sentry.js')
    );
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, isTs ? 'sentry.ts' : 'sentry.js'), client, ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'SENTRY_DSN=""', ctx);
  }
}
