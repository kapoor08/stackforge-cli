import { join } from 'node:path';
import type { StackforgeConfig } from '../types/config.js';
import { removePath } from './file-system.js';
import { removeEnvKey } from './env-file.js';

export async function cleanupFeature(
  cwd: string,
  config: StackforgeConfig,
  category: string,
  value?: string
): Promise<void> {
  const root = cwd;

  if (category === 'ui') {
    if (config.ui.library === 'shadcn') {
      await removePath(join(root, 'components'));
      await removePath(join(root, 'components.json'));
      await removePath(join(root, 'src', 'lib', 'utils.ts'));
      await removePath(join(root, 'src', 'lib', 'utils.js'));
      await removePath(join(root, 'src', 'components', 'ui'));
      await removePath(join(root, 'src', 'components', 'ui-demo.tsx'));
      await removePath(join(root, 'src', 'components', 'ui-demo.jsx'));
    }
    if (
      config.ui.library === 'mui' ||
      config.ui.library === 'chakra' ||
      config.ui.library === 'mantine' ||
      config.ui.library === 'antd' ||
      config.ui.library === 'nextui'
    ) {
      await removePath(join(root, 'components'));
      await removePath(join(root, 'src', 'theme.ts'));
      await removePath(join(root, 'src', 'theme.js'));
      await removePath(join(root, 'src', 'components', 'ui-demo.tsx'));
      await removePath(join(root, 'src', 'components', 'ui-demo.jsx'));
    }
  }

  if (category === 'auth') {
    if (config.auth.provider === 'nextauth') {
      await removePath(join(root, 'app', 'api', 'auth'));
      await removePath(join(root, 'app', 'auth', 'protected'));
      await removePath(join(root, 'app', 'auth', 'signin'));
      await removeEnvKey(join(root, '.env.example'), 'NEXTAUTH_SECRET');
      await removeEnvKey(join(root, '.env.example'), 'NEXTAUTH_URL');
    }
    if (config.auth.provider === 'clerk') {
      await removePath(join(root, 'middleware.ts'));
      await removePath(join(root, 'middleware.js'));
      await removePath(join(root, 'src', 'lib', 'clerk.ts'));
      await removePath(join(root, 'src', 'lib', 'clerk.js'));
      await removePath(join(root, 'app', 'auth', 'protected'));
      await removePath(join(root, 'app', 'auth', 'signin'));
      await removeEnvKey(join(root, '.env.example'), 'CLERK_SECRET_KEY');
      await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    }
    if (config.auth.provider === 'supabase') {
      await removePath(join(root, 'src', 'lib', 'supabase.ts'));
      await removePath(join(root, 'src', 'lib', 'supabase.js'));
      await removePath(join(root, 'src', 'lib', 'supabase-server.ts'));
      await removePath(join(root, 'src', 'lib', 'supabase-server.js'));
      await removePath(join(root, 'app', 'auth', 'protected'));
      await removePath(join(root, 'app', 'auth', 'signin'));
      await removePath(join(root, 'src', 'auth', 'signin.tsx'));
      await removePath(join(root, 'src', 'auth', 'signin.jsx'));
      await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_SUPABASE_URL');
      await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    await removePath(join(root, 'auth'));
  }

  if (category === 'api') {
    if (config.api.type === 'rest') {
      await removePath(join(root, 'app', 'api', 'hello'));
      await removePath(join(root, 'app', 'api', 'users'));
      await removePath(join(root, 'app', 'examples'));
      await removePath(join(root, 'src', 'server'));
      await removePath(join(root, 'src', 'api'));
      await removePath(join(root, 'src', 'api', 'client-usage.tsx'));
      await removePath(join(root, 'src', 'api', 'client-usage.jsx'));
    }
    if (config.api.type === 'trpc') {
      await removePath(join(root, 'app', 'api', 'trpc'));
      await removePath(join(root, 'app', 'examples'));
      await removePath(join(root, 'src', 'server', 'api'));
      await removePath(join(root, 'src', 'trpc'));
      await removePath(join(root, 'src', 'trpc', 'client-usage.tsx'));
      await removePath(join(root, 'src', 'trpc', 'client-usage.jsx'));
      await removePath(join(root, 'src', 'server'));
    }
    if (config.api.type === 'graphql') {
      await removePath(join(root, 'app', 'api', 'graphql'));
      await removePath(join(root, 'app', 'examples'));
      await removePath(join(root, 'src', 'graphql'));
      await removePath(join(root, 'src', 'server'));
      await removePath(join(root, 'src', 'graphql', 'client-usage.tsx'));
      await removePath(join(root, 'src', 'graphql', 'client-usage.jsx'));
    }
    await removePath(join(root, 'api'));
  }

  if (category === 'database') {
    if (config.database.orm === 'drizzle') {
      await removePath(join(root, 'drizzle.config.ts'));
      await removePath(join(root, 'drizzle'));
    }
    if (config.database.orm === 'prisma') {
      await removePath(join(root, 'prisma'));
      await removePath(join(root, 'src', 'db', 'prisma.ts'));
      await removePath(join(root, 'src', 'db', 'prisma.js'));
      await removePath(join(root, 'src', 'db', 'prisma-example.ts'));
      await removePath(join(root, 'src', 'db', 'prisma-example.js'));
    }
    if (config.database.orm === 'mongoose') {
      await removePath(join(root, 'src', 'db', 'mongoose.ts'));
      await removePath(join(root, 'src', 'db', 'mongoose.js'));
      await removePath(join(root, 'src', 'db', 'mongoose-model.ts'));
      await removePath(join(root, 'src', 'db', 'mongoose-model.js'));
    }
    if (config.database.orm === 'typeorm') {
      await removePath(join(root, 'src', 'db', 'data-source.ts'));
      await removePath(join(root, 'src', 'db', 'data-source.js'));
      await removePath(join(root, 'src', 'db', 'entities'));
      await removePath(join(root, 'src', 'db', 'migrations'));
    }
    await removeEnvKey(join(root, '.env.example'), 'DATABASE_URL');
    await removeEnvKey(join(root, '.env.example'), 'NEON_API_KEY');
    await removeEnvKey(join(root, '.env.example'), 'NEON_PROJECT_ID');
    await removeEnvKey(join(root, '.env.example'), 'SUPABASE_URL');
    await removeEnvKey(join(root, '.env.example'), 'SUPABASE_ANON_KEY');
  }

  if (category === 'orm') {
    if (config.database.orm === 'drizzle') {
      await removePath(join(root, 'drizzle.config.ts'));
      await removePath(join(root, 'drizzle'));
    }
    if (config.database.orm === 'prisma') {
      await removePath(join(root, 'prisma'));
      await removePath(join(root, 'src', 'db', 'prisma.ts'));
      await removePath(join(root, 'src', 'db', 'prisma.js'));
      await removePath(join(root, 'src', 'db', 'prisma-example.ts'));
      await removePath(join(root, 'src', 'db', 'prisma-example.js'));
    }
    if (config.database.orm === 'mongoose') {
      await removePath(join(root, 'src', 'db', 'mongoose.ts'));
      await removePath(join(root, 'src', 'db', 'mongoose.js'));
      await removePath(join(root, 'src', 'db', 'mongoose-model.ts'));
      await removePath(join(root, 'src', 'db', 'mongoose-model.js'));
    }
    if (config.database.orm === 'typeorm') {
      await removePath(join(root, 'src', 'db', 'data-source.ts'));
      await removePath(join(root, 'src', 'db', 'data-source.js'));
      await removePath(join(root, 'src', 'db', 'entities'));
      await removePath(join(root, 'src', 'db', 'migrations'));
    }
  }

  if (category === 'email' || (category === 'feature' && (value === 'email' || !value && config.features.email))) {
    const provider = config.features.email;
    await removePath(join(root, 'features', 'email'));
    await removePath(join(root, 'src', 'lib', `${provider}.ts`));
    await removePath(join(root, 'src', 'lib', `${provider}.js`));
    // Remove all possible email env keys
    await removeEnvKey(join(root, '.env.example'), 'RESEND_API_KEY');
    await removeEnvKey(join(root, '.env.example'), 'SENDGRID_API_KEY');
    await removeEnvKey(join(root, '.env.example'), 'MAILGUN_API_KEY');
    await removeEnvKey(join(root, '.env.example'), 'MAILGUN_DOMAIN');
    await removeEnvKey(join(root, '.env.example'), 'SMTP_HOST');
    await removeEnvKey(join(root, '.env.example'), 'SMTP_PORT');
    await removeEnvKey(join(root, '.env.example'), 'SMTP_USER');
    await removeEnvKey(join(root, '.env.example'), 'SMTP_PASS');
    await removeEnvKey(join(root, '.env.example'), 'MAILERSEND_API_KEY');
    await removeEnvKey(join(root, '.env.example'), 'AWS_SES_REGION');
  }

  if (category === 'storage' || (category === 'feature' && (value === 'storage' || !value && config.features.storage))) {
    const provider = config.features.storage;
    await removePath(join(root, 'features', 'storage'));
    await removePath(join(root, 'src', 'lib', `${provider}.ts`));
    await removePath(join(root, 'src', 'lib', `${provider}.js`));
    // Remove all possible storage env keys
    await removeEnvKey(join(root, '.env.example'), 'CLOUDINARY_URL');
    await removeEnvKey(join(root, '.env.example'), 'AWS_S3_BUCKET');
    await removeEnvKey(join(root, '.env.example'), 'AWS_REGION');
    await removeEnvKey(join(root, '.env.example'), 'R2_ACCOUNT_ID');
    await removeEnvKey(join(root, '.env.example'), 'R2_ACCESS_KEY_ID');
    await removeEnvKey(join(root, '.env.example'), 'R2_SECRET_ACCESS_KEY');
    await removeEnvKey(join(root, '.env.example'), 'R2_BUCKET');
    await removeEnvKey(join(root, '.env.example'), 'BLOB_READ_WRITE_TOKEN');
    await removeEnvKey(join(root, '.env.example'), 'FIREBASE_STORAGE_BUCKET');
    await removeEnvKey(join(root, '.env.example'), 'AZURE_STORAGE_CONNECTION_STRING');
    await removeEnvKey(join(root, '.env.example'), 'GCS_BUCKET');
    await removeEnvKey(join(root, '.env.example'), 'GOOGLE_APPLICATION_CREDENTIALS');
  }

  if (category === 'payments' || (category === 'feature' && (value === 'payments' || !value && config.features.payments))) {
    const provider = config.features.payments;
    await removePath(join(root, 'features', 'payments'));
    await removePath(join(root, 'src', 'lib', `${provider}.ts`));
    await removePath(join(root, 'src', 'lib', `${provider}.js`));
    // Remove all possible payment env keys
    await removeEnvKey(join(root, '.env.example'), 'STRIPE_SECRET_KEY');
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    await removeEnvKey(join(root, '.env.example'), 'PAYPAL_CLIENT_ID');
    await removeEnvKey(join(root, '.env.example'), 'PAYPAL_CLIENT_SECRET');
    await removeEnvKey(join(root, '.env.example'), 'RAZORPAY_KEY_ID');
    await removeEnvKey(join(root, '.env.example'), 'RAZORPAY_KEY_SECRET');
  }

  if (category === 'analytics' || (category === 'feature' && (value === 'analytics' || !value && config.features.analytics))) {
    const provider = config.features.analytics;
    await removePath(join(root, 'features', 'analytics'));
    await removePath(join(root, 'src', 'lib', `${provider}.ts`));
    await removePath(join(root, 'src', 'lib', `${provider}.js`));
    // Remove all possible analytics env keys
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_POSTHOG_KEY');
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_POSTHOG_HOST');
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_GA4_MEASUREMENT_ID');
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_SEGMENT_WRITE_KEY');
  }

  if (category === 'error-tracking' || (category === 'feature' && (value === 'error-tracking' || !value && config.features.errorTracking))) {
    const provider = config.features.errorTracking;
    await removePath(join(root, 'features', 'error-tracking'));
    await removePath(join(root, 'src', 'lib', `${provider}.ts`));
    await removePath(join(root, 'src', 'lib', `${provider}.js`));
    // Remove all possible error tracking env keys
    await removeEnvKey(join(root, '.env.example'), 'SENTRY_DSN');
    await removeEnvKey(join(root, '.env.example'), 'NEXT_PUBLIC_LOGROCKET_APP_ID');
  }
}
