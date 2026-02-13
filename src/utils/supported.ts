export const supported = {
  frontend: ['nextjs', 'vite'] as const,
  ui: ['none', 'shadcn', 'mui', 'chakra', 'mantine', 'antd', 'nextui'] as const,
  database: ['none', 'postgres', 'mysql', 'sqlite', 'mongodb', 'neon', 'supabase'] as const,
  orm: ['drizzle', 'prisma', 'mongoose', 'typeorm'] as const,
  auth: ['none', 'nextauth', 'clerk', 'better-auth', 'supabase'] as const,
  api: ['none', 'rest', 'trpc', 'graphql'] as const,
  agents: ['claude', 'copilot', 'codex', 'gemini', 'cursor', 'codeium', 'windsurf', 'tabnine'] as const,
  features: ['email', 'storage', 'payments', 'analytics', 'error-tracking'] as const
};
