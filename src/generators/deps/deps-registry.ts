import type { StackforgeConfig } from '../types/config.js';
import { versions } from '../../utils/versions.js';

export interface DependencyResult {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export function collectDependencies(config: StackforgeConfig): DependencyResult {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  if (config.frontend.type === 'nextjs') {
    dependencies['next'] = versions.next;
    dependencies['react'] = versions.react;
    dependencies['react-dom'] = versions.reactDom;
  }

  if (config.frontend.type === 'vite') {
    dependencies['react'] = versions.react;
    dependencies['react-dom'] = versions.reactDom;
    devDependencies['vite'] = versions.vite;
    devDependencies['@vitejs/plugin-react-swc'] = versions.viteReactSwc;

    if ((config.api.type === 'rest' || config.api.type === 'graphql') && config.frontend.language === 'ts') {
      devDependencies['tsx'] = versions.tsx;
      devDependencies['@types/node'] = versions.typesNode;
    }
  }

  if (config.frontend.language === 'ts') {
    devDependencies['typescript'] = versions.typescript;
    devDependencies['@types/react'] = versions.typesReact;
    devDependencies['@types/react-dom'] = versions.typesReactDom;
  }

  if (config.ui.library === 'tailwind' || config.ui.library === 'shadcn') {
    devDependencies['tailwindcss'] = versions.tailwindcss;
    devDependencies['postcss'] = versions.postcss;
    devDependencies['autoprefixer'] = versions.autoprefixer;
  }

  if (config.ui.library === 'shadcn') {
    dependencies['class-variance-authority'] = versions.cva;
    dependencies['clsx'] = versions.clsx;
    dependencies['tailwind-merge'] = versions.tailwindMerge;
  }

  if (config.ui.library === 'mui') {
    dependencies['@mui/material'] = versions.muiMaterial;
    dependencies['@emotion/react'] = versions.muiEmotionReact;
    dependencies['@emotion/styled'] = versions.muiEmotionStyled;
  }

  if (config.ui.library === 'chakra') {
    dependencies['@chakra-ui/react'] = versions.chakraUi;
    dependencies['@emotion/react'] = versions.chakraEmotionReact;
    dependencies['@emotion/styled'] = versions.chakraEmotionStyled;
    dependencies['framer-motion'] = versions.chakraFramerMotion;
  }

  if (config.ui.library === 'mantine') {
    dependencies['@mantine/core'] = versions.mantineCore;
    dependencies['@mantine/hooks'] = versions.mantineHooks;
    dependencies['@mantine/dates'] = versions.mantineDates;
    dependencies['@mantine/notifications'] = versions.mantineNotifications;
  }

  if (config.ui.library === 'antd') {
    dependencies['antd'] = versions.antd;
  }

  if (config.ui.library === 'nextui') {
    dependencies['@nextui-org/react'] = versions.nextui;
  }

  if (config.database.provider === 'postgres' || config.database.provider === 'neon' || config.database.provider === 'supabase') {
    dependencies['pg'] = versions.pg;
    if (config.frontend.language === 'ts') {
      devDependencies['@types/pg'] = versions.typesPg;
    }
  }

  if (config.database.provider === 'mysql') {
    dependencies['mysql2'] = versions.mysql2;
  }

  if (config.database.provider === 'sqlite') {
    dependencies['better-sqlite3'] = versions.betterSqlite3;
  }

  if (config.database.provider === 'neon') {
    dependencies['@neondatabase/serverless'] = versions.neonServerless;
  }

  if (config.database.provider === 'supabase') {
    dependencies['@supabase/supabase-js'] = versions.supabaseJs;
  }

  if (config.database.orm === 'drizzle') {
    dependencies['drizzle-orm'] = versions.drizzleOrm;
    devDependencies['drizzle-kit'] = versions.drizzleKit;
  }

  if (config.database.orm === 'prisma') {
    devDependencies['prisma'] = versions.prisma;
    dependencies['@prisma/client'] = versions.prismaClient;
  }

  if (config.database.orm === 'mongoose') {
    dependencies['mongoose'] = versions.mongoose;
  }

  if (config.database.orm === 'typeorm') {
    dependencies['typeorm'] = versions.typeorm;
    dependencies['reflect-metadata'] = versions.reflectMetadata;
  }

  if (config.auth.provider === 'nextauth') {
    dependencies['next-auth'] = versions.nextAuth;
  }

  if (config.auth.provider === 'clerk') {
    dependencies['@clerk/nextjs'] = versions.clerkNext;
  }

  if (config.auth.provider === 'supabase') {
    dependencies['@supabase/supabase-js'] = versions.supabaseJs;
    if (config.frontend.type === 'nextjs') {
      dependencies['@supabase/ssr'] = versions.supabaseSsr;
    }
  }

  if (config.api.type === 'trpc') {
    dependencies['@trpc/server'] = versions.trpcServer;
    dependencies['@trpc/client'] = versions.trpcClient;
    dependencies['@trpc/react-query'] = versions.trpcReactQuery;
    dependencies['@tanstack/react-query'] = versions.tanstackQuery;
    dependencies['zod'] = versions.zod;
    if (config.frontend.type === 'vite') {
      devDependencies['tsx'] = versions.tsx;
      devDependencies['@types/node'] = versions.typesNode;
    }
  }

  if (config.api.type === 'graphql') {
    dependencies['graphql'] = versions.graphql;
    dependencies['graphql-request'] = versions.graphqlRequest;
    dependencies['graphql-yoga'] = versions.graphqlYoga;
  }

  if (config.features.includes('email')) {
    dependencies['resend'] = versions.resend;
  }

  if (config.features.includes('storage')) {
    dependencies['cloudinary'] = versions.cloudinary;
  }

  if (config.features.includes('payments')) {
    dependencies['stripe'] = versions.stripe;
  }

  if (config.features.includes('analytics')) {
    dependencies['posthog-js'] = versions.posthog;
  }

  if (config.features.includes('error-tracking') && config.frontend.type === 'nextjs') {
    dependencies['@sentry/nextjs'] = versions.sentryNext;
  }

  return { dependencies, devDependencies };
}
