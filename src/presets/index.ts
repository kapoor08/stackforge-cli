import type { StackforgeConfig } from '../types/config.js';

export type PresetName = 'starter' | 'saas' | 'ecommerce' | 'blog' | 'api';

const presets: Record<PresetName, Partial<StackforgeConfig>> = {
  starter: {
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'trpc' },
    features: []
  },
  saas: {
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'prisma' },
    auth: { provider: 'nextauth' },
    api: { type: 'trpc' },
    features: ['email', 'payments']
  },
  ecommerce: {
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'prisma' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: ['payments', 'storage']
  },
  blog: {
    frontend: { type: 'nextjs', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'sqlite', orm: 'prisma' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: ['storage']
  },
  api: {
    frontend: { type: 'vite', language: 'ts' },
    ui: { library: 'none' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: []
  }
};

export const presetNames: PresetName[] = Object.keys(presets) as PresetName[];

export function getPreset(name: string | undefined): Partial<StackforgeConfig> | null {
  if (!name) return null;
  return presets[name as PresetName] ?? null;
}