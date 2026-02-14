export const supported = {
  frontend: ['nextjs', 'vite'] as const,
  ui: ['none', 'shadcn', 'mui', 'chakra', 'mantine', 'antd', 'nextui'] as const,
  database: ['none', 'postgres', 'mysql', 'sqlite', 'mongodb', 'neon', 'supabase'] as const,
  orm: ['drizzle', 'prisma', 'mongoose', 'typeorm'] as const,
  auth: ['none', 'nextauth', 'clerk', 'better-auth', 'supabase'] as const,
  api: ['none', 'rest', 'trpc', 'graphql'] as const,
  agents: ['claude', 'copilot', 'codex', 'gemini', 'cursor', 'codeium', 'windsurf', 'tabnine'] as const,
  featureCategories: ['email', 'storage', 'payments', 'analytics', 'error-tracking'] as const,
  email: ['resend', 'sendgrid', 'aws-ses', 'mailgun', 'nodemailer', 'mailersend'] as const,
  storage: ['cloudinary', 'aws-s3', 'cloudflare-r2', 'vercel-blob', 'supabase-storage', 'firebase-storage', 'azure-blob', 'gcs'] as const,
  payments: ['stripe', 'paypal', 'razorpay'] as const,
  analytics: ['posthog', 'ga4', 'vercel-analytics', 'segment'] as const,
  errorTracking: ['sentry', 'logrocket'] as const
};
