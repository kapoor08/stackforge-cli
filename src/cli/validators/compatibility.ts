import type { StackforgeConfig } from '../../types/config.js';

export function validateCompatibility(config: StackforgeConfig): void {
  if (config.auth.provider === 'nextauth' && config.frontend.type !== 'nextjs') {
    throw new Error('NextAuth requires Next.js.');
  }

  if (config.auth.provider === 'clerk' && config.frontend.type !== 'nextjs') {
    throw new Error('Clerk requires Next.js.');
  }

  if (config.api.type === 'trpc' && config.frontend.language !== 'ts') {
    throw new Error('tRPC requires TypeScript.');
  }

  if (config.database.orm === 'mongoose') {
    throw new Error('Mongoose requires MongoDB. Use drizzle, prisma, or typeorm with SQL databases.');
  }

  if (config.database.orm === 'typeorm') {
    const supported = ['postgres', 'mysql', 'sqlite'];
    if (!supported.includes(config.database.provider)) {
      throw new Error('TypeORM requires postgres, mysql, or sqlite.');
    }
  }

  if (config.features.includes('error-tracking') && config.frontend.type !== 'nextjs') {
    throw new Error('Error tracking (Sentry) requires Next.js.');
  }
}
