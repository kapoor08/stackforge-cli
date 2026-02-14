export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type EmailProvider = 'resend' | 'sendgrid' | 'aws-ses' | 'mailgun' | 'nodemailer' | 'mailersend';
export type StorageProvider = 'cloudinary' | 'aws-s3' | 'cloudflare-r2' | 'vercel-blob' | 'supabase-storage' | 'firebase-storage' | 'azure-blob' | 'gcs';
export type PaymentProvider = 'stripe' | 'paypal' | 'razorpay';
export type AnalyticsProvider = 'posthog' | 'ga4' | 'vercel-analytics' | 'segment';
export type ErrorTrackingProvider = 'sentry' | 'logrocket';

export interface Features {
  email?: EmailProvider;
  storage?: StorageProvider;
  payments?: PaymentProvider;
  analytics?: AnalyticsProvider;
  errorTracking?: ErrorTrackingProvider;
}

export interface StackforgeConfig {
  projectName: string;
  packageManager: PackageManager;
  frontend: { type: 'nextjs' | 'vite'; language: 'ts' | 'js' };
  ui: { library: 'shadcn' | 'mui' | 'chakra' | 'mantine' | 'antd' | 'nextui' | 'none' };
  database: {
    provider: 'postgres' | 'mysql' | 'sqlite' | 'mongodb' | 'neon' | 'supabase' | 'none';
    orm?: 'drizzle' | 'prisma' | 'mongoose' | 'typeorm';
  };
  auth: { provider: 'clerk' | 'nextauth' | 'better-auth' | 'supabase' | 'none' };
  api: { type: 'trpc' | 'graphql' | 'rest' | 'none' };
  features: Features;
  aiAgents: string[];
  preset?: string;
}
