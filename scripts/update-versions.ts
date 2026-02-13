/**
 * Fetches the latest versions of all packages from npm and updates src/utils/versions.ts.
 *
 * Usage:
 *   pnpm tsx scripts/update-versions.ts            # update all (minor/patch only)
 *   pnpm tsx scripts/update-versions.ts --major     # include major bumps
 *   pnpm tsx scripts/update-versions.ts --dry-run   # preview without writing
 */

import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const VERSIONS_PATH = join(import.meta.dirname, '..', 'src', 'utils', 'versions.ts');

// Maps versions.ts key → npm package name
const packageMap: Record<string, string> = {
  next: 'next',
  react: 'react',
  reactDom: 'react-dom',
  vite: 'vite',
  viteReactSwc: '@vitejs/plugin-react-swc',
  typescript: 'typescript',
  typesReact: '@types/react',
  typesReactDom: '@types/react-dom',
  typesNode: '@types/node',
  tsx: 'tsx',
  tailwindcss: 'tailwindcss',
  postcss: 'postcss',
  autoprefixer: 'autoprefixer',
  cva: 'class-variance-authority',
  clsx: 'clsx',
  tailwindMerge: 'tailwind-merge',
  muiMaterial: '@mui/material',
  muiEmotionReact: '@emotion/react',
  muiEmotionStyled: '@emotion/styled',
  chakraUi: '@chakra-ui/react',
  chakraEmotionReact: '@emotion/react',
  chakraEmotionStyled: '@emotion/styled',
  chakraFramerMotion: 'framer-motion',
  mantineCore: '@mantine/core',
  mantineHooks: '@mantine/hooks',
  mantineDates: '@mantine/dates',
  mantineNotifications: '@mantine/notifications',
  antd: 'antd',
  nextui: '@nextui-org/react',
  drizzleOrm: 'drizzle-orm',
  drizzleKit: 'drizzle-kit',
  prisma: 'prisma',
  prismaClient: '@prisma/client',
  mongoose: 'mongoose',
  typeorm: 'typeorm',
  reflectMetadata: 'reflect-metadata',
  pg: 'pg',
  typesPg: '@types/pg',
  mysql2: 'mysql2',
  betterSqlite3: 'better-sqlite3',
  neonServerless: '@neondatabase/serverless',
  nextAuth: 'next-auth',
  clerkNext: '@clerk/nextjs',
  supabaseJs: '@supabase/supabase-js',
  supabaseSsr: '@supabase/ssr',
  trpcServer: '@trpc/server',
  trpcClient: '@trpc/client',
  trpcReactQuery: '@trpc/react-query',
  tanstackQuery: '@tanstack/react-query',
  zod: 'zod',
  graphql: 'graphql',
  graphqlRequest: 'graphql-request',
  graphqlYoga: 'graphql-yoga',
  resend: 'resend',
  cloudinary: 'cloudinary',
  stripe: 'stripe',
  posthog: 'posthog-js',
  sentryNext: '@sentry/nextjs',
};

function fetchLatestVersion(pkg: string): Promise<string | null> {
  return new Promise((resolve) => {
    execFile('npm', ['view', pkg, 'version'], { shell: true }, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      const version = String(stdout).trim();
      resolve(version || null);
    });
  });
}

function parseMajor(version: string): number | null {
  const clean = version.replace(/^\^|~/, '');
  const match = clean.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const allowMajor = args.includes('--major');
  const dryRun = args.includes('--dry-run');

  const source = await readFile(VERSIONS_PATH, 'utf8');

  // Parse current versions from the file
  const currentVersions: Record<string, string> = {};
  const versionRegex = /(\w+):\s*'([^']+)'/g;
  let match;
  while ((match = versionRegex.exec(source)) !== null) {
    currentVersions[match[1]] = match[2];
  }

  console.log(`Fetching latest versions for ${Object.keys(packageMap).length} packages...\n`);

  const updates: Array<{ key: string; pkg: string; from: string; to: string; major: boolean }> = [];
  const skipped: Array<{ key: string; pkg: string; from: string; latest: string }> = [];
  const failed: string[] = [];

  // Fetch in batches of 10 to avoid overwhelming npm
  const entries = Object.entries(packageMap);
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async ([key, pkg]) => {
        const latest = await fetchLatestVersion(pkg);
        return { key, pkg, latest };
      })
    );

    for (const { key, pkg, latest } of results) {
      const current = currentVersions[key];
      if (!current) {
        console.log(`  SKIP  ${key}: not found in versions.ts`);
        continue;
      }
      if (!latest) {
        failed.push(pkg);
        console.log(`  FAIL  ${pkg}: could not fetch`);
        continue;
      }

      const currentMajor = parseMajor(current);
      const latestMajor = parseMajor(latest);
      const isMajorBump = currentMajor !== null && latestMajor !== null && latestMajor > currentMajor;
      const newVersion = `^${latest}`;

      if (newVersion === current) {
        console.log(`  OK    ${pkg}: ${current}`);
        continue;
      }

      if (isMajorBump && !allowMajor) {
        skipped.push({ key, pkg, from: current, latest: newVersion });
        console.log(`  MAJOR ${pkg}: ${current} → ${newVersion} (skipped, use --major to include)`);
        continue;
      }

      updates.push({ key, pkg, from: current, to: newVersion, major: isMajorBump });
      console.log(`  ${isMajorBump ? 'MAJOR' : 'BUMP'}  ${pkg}: ${current} → ${newVersion}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Updates:  ${updates.length}`);
  console.log(`Skipped:  ${skipped.length} (major bumps)`);
  console.log(`Failed:   ${failed.length}`);

  if (updates.length === 0) {
    console.log('\nNo updates to apply.');
    return;
  }

  if (dryRun) {
    console.log('\nDry run — no files written.');
    return;
  }

  // Apply updates to the file content
  let updated = source;
  for (const { key, to } of updates) {
    const regex = new RegExp(`(${key}:\\s*)'[^']+'`);
    updated = updated.replace(regex, `$1'${to}'`);
  }

  await writeFile(VERSIONS_PATH, updated, 'utf8');
  console.log(`\nUpdated ${VERSIONS_PATH}`);

  // Output for CI: set outputs
  if (process.env.GITHUB_OUTPUT) {
    const { appendFile } = await import('node:fs/promises');
    const majorNames = updates.filter((u) => u.major).map((u) => u.pkg).join(', ');
    await appendFile(process.env.GITHUB_OUTPUT, `updated_count=${updates.length}\n`);
    await appendFile(process.env.GITHUB_OUTPUT, `major_bumps=${majorNames}\n`);
    await appendFile(process.env.GITHUB_OUTPUT, `skipped_count=${skipped.length}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
