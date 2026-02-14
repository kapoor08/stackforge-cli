import inquirer from 'inquirer';
import type { PackageManager, StackforgeConfig } from '../../types/config.js';
import { detectPackageManager } from '../../utils/package-manager.js';
import { buildConfig } from '../config-builder.js';
import { defaultConfig } from '../defaults.js';
import { supported } from '../../utils/supported.js';

const displayNames: Record<string, string> = {
  // Frontend
  nextjs: 'Next.js',
  vite: 'Vite',
  // Component library
  none: 'None',
  shadcn: 'shadcn/ui',
  mui: 'Material UI',
  chakra: 'Chakra UI',
  mantine: 'Mantine',
  antd: 'Ant Design',
  nextui: 'NextUI',
  // Database
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  mongodb: 'MongoDB',
  neon: 'Neon',
  supabase: 'Supabase',
  // ORM
  drizzle: 'Drizzle',
  prisma: 'Prisma',
  mongoose: 'Mongoose',
  typeorm: 'TypeORM',
  // Auth
  nextauth: 'NextAuth',
  clerk: 'Clerk',
  'better-auth': 'Better Auth',
  // API
  rest: 'REST',
  trpc: 'tRPC',
  graphql: 'GraphQL',
  // Feature categories
  email: 'Email',
  storage: 'File Storage',
  payments: 'Payments',
  analytics: 'Analytics',
  'error-tracking': 'Error Tracking',
  // Email providers
  resend: 'Resend',
  sendgrid: 'SendGrid',
  'aws-ses': 'Amazon SES',
  mailgun: 'Mailgun',
  nodemailer: 'Nodemailer',
  mailersend: 'MailerSend',
  // Storage providers
  cloudinary: 'Cloudinary',
  'aws-s3': 'AWS S3',
  'cloudflare-r2': 'Cloudflare R2',
  'vercel-blob': 'Vercel Blob',
  'supabase-storage': 'Supabase Storage',
  'firebase-storage': 'Firebase Storage',
  'azure-blob': 'Azure Blob Storage',
  gcs: 'Google Cloud Storage',
  // Payment providers
  stripe: 'Stripe',
  paypal: 'PayPal',
  razorpay: 'Razorpay',
  // Analytics providers
  posthog: 'PostHog',
  ga4: 'Google Analytics (GA4)',
  'vercel-analytics': 'Vercel Analytics',
  segment: 'Segment',
  // Error tracking providers
  sentry: 'Sentry',
  logrocket: 'LogRocket',
  // AI Agents
  claude: 'Claude (Anthropic)',
  copilot: 'GitHub Copilot',
  codex: 'OpenAI Codex',
  gemini: 'Google Gemini',
  cursor: 'Cursor',
  codeium: 'Codeium',
  windsurf: 'Windsurf',
  tabnine: 'Tabnine'
};

function label(value: string): string {
  return displayNames[value] || value;
}

export async function promptForConfig(input: {
  projectName?: string;
  preset?: string;
  skipPrompts?: boolean;
}): Promise<StackforgeConfig> {
  if (input.skipPrompts) {
    const base = defaultConfig();
    const merged: StackforgeConfig = {
      ...base,
      projectName: input.projectName ?? base.projectName,
      preset: input.preset
    };
    return buildConfig(merged);
  }

  const detected = detectPackageManager(process.cwd());

  // Build prompts array conditionally
  const prompts: any[] = [];

  // Only prompt for project name if not provided
  if (!input.projectName) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name',
      default: 'my-app'
    });
  }

  prompts.push({
    type: 'list',
    name: 'packageManager',
    message: 'Package manager',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'pnpm', value: 'pnpm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'bun', value: 'bun' }
    ],
    default: detected || 'npm'
  });
  prompts.push(
    {
      type: 'list',
      name: 'frontend',
      message: 'Frontend framework',
      choices: supported.frontend.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'list',
      name: 'language',
      message: 'Language',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' }
      ]
    },
    {
      type: 'list',
      name: 'uiLibrary',
      message: 'Component library (Tailwind CSS included by default)',
      choices: supported.ui.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'list',
      name: 'databaseProvider',
      message: 'Database provider',
      choices: supported.database.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'list',
      name: 'orm',
      message: 'ORM',
      when: (ans) => ans.databaseProvider !== 'none',
      choices: supported.orm.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'list',
      name: 'authProvider',
      message: 'Authentication',
      choices: supported.auth.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'list',
      name: 'apiType',
      message: 'API type',
      choices: supported.api.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'checkbox',
      name: 'featureCategories',
      message: 'Additional features (select categories)',
      choices: supported.featureCategories.map((v) => ({ name: label(v), value: v }))
    },
    {
      type: 'checkbox',
      name: 'aiAgents',
      message: 'AI coding assistants (optional)',
      choices: supported.agents.map((v) => ({ name: label(v), value: v }))
    }
  );

  const answers = await inquirer.prompt(prompts);

  // Follow-up prompts for each selected feature category
  const featureProviders: any = {};

  if (answers.featureCategories?.includes('email')) {
    const { emailProvider } = await inquirer.prompt([{
      type: 'list',
      name: 'emailProvider',
      message: 'Email provider',
      choices: supported.email.map((v) => ({ name: label(v), value: v }))
    }]);
    featureProviders.email = emailProvider;
  }

  if (answers.featureCategories?.includes('storage')) {
    const { storageProvider } = await inquirer.prompt([{
      type: 'list',
      name: 'storageProvider',
      message: 'File Storage provider',
      choices: supported.storage.map((v) => ({ name: label(v), value: v }))
    }]);
    featureProviders.storage = storageProvider;
  }

  if (answers.featureCategories?.includes('payments')) {
    const { paymentProvider } = await inquirer.prompt([{
      type: 'list',
      name: 'paymentProvider',
      message: 'Payment provider',
      choices: supported.payments.map((v) => ({ name: label(v), value: v }))
    }]);
    featureProviders.payments = paymentProvider;
  }

  if (answers.featureCategories?.includes('analytics')) {
    const { analyticsProvider } = await inquirer.prompt([{
      type: 'list',
      name: 'analyticsProvider',
      message: 'Analytics provider',
      choices: supported.analytics.map((v) => ({ name: label(v), value: v }))
    }]);
    featureProviders.analytics = analyticsProvider;
  }

  if (answers.featureCategories?.includes('error-tracking')) {
    const { errorTrackingProvider } = await inquirer.prompt([{
      type: 'list',
      name: 'errorTrackingProvider',
      message: 'Error Tracking provider',
      choices: supported.errorTracking.map((v) => ({ name: label(v), value: v }))
    }]);
    featureProviders.errorTracking = errorTrackingProvider;
  }

  const base: StackforgeConfig = {
    projectName: input.projectName || answers.projectName,
    packageManager: answers.packageManager as PackageManager,
    frontend: { type: answers.frontend, language: answers.language },
    ui: { library: answers.uiLibrary },
    database: { provider: answers.databaseProvider, orm: answers.orm },
    auth: { provider: answers.authProvider },
    api: { type: answers.apiType },
    features: featureProviders,
    aiAgents: answers.aiAgents ?? [],
    preset: input.preset
  };

  return buildConfig(base);
}
