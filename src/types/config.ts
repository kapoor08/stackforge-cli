export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface StackforgeConfig {
  projectName: string;
  packageManager: PackageManager;
  frontend: { type: 'nextjs' | 'vite'; language: 'ts' | 'js' };
  ui: { library: 'tailwind' | 'shadcn' | 'mui' | 'chakra' | 'mantine' | 'antd' | 'nextui' | 'none' };
  database: {
    provider: 'postgres' | 'mysql' | 'sqlite' | 'mongodb' | 'neon' | 'supabase' | 'none';
    orm?: 'drizzle' | 'prisma' | 'mongoose' | 'typeorm';
  };
  auth: { provider: 'clerk' | 'nextauth' | 'better-auth' | 'supabase' | 'none' };
  api: { type: 'trpc' | 'graphql' | 'rest' | 'none' };
  features: string[];
  aiAgents: string[];
  preset?: string;
}
