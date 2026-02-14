import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, readTextFile, writeTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';
import { appendEnvLine } from '../../utils/env-file.js';
import { TEMPLATES_DIR } from '../../utils/templates-dir.js';

export async function generateFeatureFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);
  const templatesRoot = TEMPLATES_DIR;
  const libDir = join(projectRoot, 'src', 'lib');
  const isTs = config.frontend.language === 'ts';
  const ext = isTs ? 'ts' : 'js';

  // Email providers
  if (config.features.email) {
    const dir = join(projectRoot, 'features', 'email');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);

    const provider = config.features.email;
    const readme = await readTextFile(join(templatesRoot, 'features', 'email', `${provider}.README.md`));
    const client = await readTextFile(join(templatesRoot, 'features', 'email', `${provider}.${ext}`));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, `${provider}.${ext}`), client, ctx);

    // Provider-specific env vars
    if (provider === 'resend') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'RESEND_API_KEY=""', ctx);
    } else if (provider === 'sendgrid') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'SENDGRID_API_KEY=""', ctx);
    } else if (provider === 'aws-ses') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_SES_REGION=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_ACCESS_KEY_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_SECRET_ACCESS_KEY=""', ctx);
    } else if (provider === 'mailgun') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'MAILGUN_API_KEY=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'MAILGUN_DOMAIN=""', ctx);
    } else if (provider === 'nodemailer') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'SMTP_HOST=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'SMTP_PORT=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'SMTP_USER=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'SMTP_PASS=""', ctx);
    } else if (provider === 'mailersend') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'MAILERSEND_API_KEY=""', ctx);
    }
  }

  // Storage providers
  if (config.features.storage) {
    const dir = join(projectRoot, 'features', 'storage');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);

    const provider = config.features.storage;
    const readme = await readTextFile(join(templatesRoot, 'features', 'storage', `${provider}.README.md`));
    const client = await readTextFile(join(templatesRoot, 'features', 'storage', `${provider}.${ext}`));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, `${provider}.${ext}`), client, ctx);

    // Provider-specific env vars
    if (provider === 'cloudinary') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'CLOUDINARY_URL=""', ctx);
    } else if (provider === 'aws-s3') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_S3_BUCKET=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_REGION=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_ACCESS_KEY_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'AWS_SECRET_ACCESS_KEY=""', ctx);
    } else if (provider === 'cloudflare-r2') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'R2_ACCOUNT_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'R2_ACCESS_KEY_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'R2_SECRET_ACCESS_KEY=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'R2_BUCKET=""', ctx);
    } else if (provider === 'vercel-blob') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'BLOB_READ_WRITE_TOKEN=""', ctx);
    } else if (provider === 'supabase-storage') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'SUPABASE_URL=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'SUPABASE_ANON_KEY=""', ctx);
    } else if (provider === 'firebase-storage') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'FIREBASE_STORAGE_BUCKET=""', ctx);
    } else if (provider === 'azure-blob') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'AZURE_STORAGE_CONNECTION_STRING=""', ctx);
    } else if (provider === 'gcs') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'GCS_BUCKET=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'GOOGLE_APPLICATION_CREDENTIALS=""', ctx);
    }
  }

  // Payment providers
  if (config.features.payments) {
    const dir = join(projectRoot, 'features', 'payments');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);

    const provider = config.features.payments;
    const readme = await readTextFile(join(templatesRoot, 'features', 'payments', `${provider}.README.md`));
    const client = await readTextFile(join(templatesRoot, 'features', 'payments', `${provider}.${ext}`));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, `${provider}.${ext}`), client, ctx);

    // Provider-specific env vars
    if (provider === 'stripe') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'STRIPE_SECRET_KEY=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""', ctx);
    } else if (provider === 'paypal') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'PAYPAL_CLIENT_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'PAYPAL_CLIENT_SECRET=""', ctx);
    } else if (provider === 'razorpay') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'RAZORPAY_KEY_ID=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'RAZORPAY_KEY_SECRET=""', ctx);
    }
  }

  // Analytics providers
  if (config.features.analytics) {
    const dir = join(projectRoot, 'features', 'analytics');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);

    const provider = config.features.analytics;
    const readme = await readTextFile(join(templatesRoot, 'features', 'analytics', `${provider}.README.md`));
    const client = await readTextFile(join(templatesRoot, 'features', 'analytics', `${provider}.${ext}`));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, `${provider}.${ext}`), client, ctx);

    // Provider-specific env vars
    if (provider === 'posthog') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_POSTHOG_KEY=""', ctx);
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_POSTHOG_HOST=""', ctx);
    } else if (provider === 'ga4') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_GA4_MEASUREMENT_ID=""', ctx);
    } else if (provider === 'vercel-analytics') {
      // Vercel Analytics doesn't need env vars
    } else if (provider === 'segment') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_SEGMENT_WRITE_KEY=""', ctx);
    }
  }

  // Error tracking providers
  if (config.features.errorTracking) {
    const dir = join(projectRoot, 'features', 'error-tracking');
    await ensureDir(dir, ctx);
    await ensureDir(libDir, ctx);

    const provider = config.features.errorTracking;
    const readme = await readTextFile(join(templatesRoot, 'features', 'error-tracking', `${provider}.README.md`));
    const client = await readTextFile(join(templatesRoot, 'features', 'error-tracking', `${provider}.${ext}`));
    await writeTextFile(join(dir, 'README.md'), readme, ctx);
    await writeTextFile(join(libDir, `${provider}.${ext}`), client, ctx);

    // Provider-specific env vars
    if (provider === 'sentry') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'SENTRY_DSN=""', ctx);
    } else if (provider === 'logrocket') {
      await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_LOGROCKET_APP_ID=""', ctx);
    }
  }
}
