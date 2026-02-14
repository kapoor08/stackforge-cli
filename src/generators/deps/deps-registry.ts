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

  // Tailwind CSS is always included as the base CSS framework
  devDependencies['tailwindcss'] = versions.tailwindcss;
  devDependencies['postcss'] = versions.postcss;
  devDependencies['autoprefixer'] = versions.autoprefixer;

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

  if (config.database.provider === 'mongodb') {
    dependencies['mongodb'] = versions.mongodb;
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

  if (config.auth.provider === 'better-auth') {
    dependencies['better-auth'] = versions.betterAuth;
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

  // Email providers
  if (config.features.email === 'resend') {
    dependencies['resend'] = versions.resend;
  } else if (config.features.email === 'sendgrid') {
    dependencies['@sendgrid/mail'] = versions.sendgrid;
  } else if (config.features.email === 'aws-ses') {
    dependencies['@aws-sdk/client-ses'] = versions.awsSes;
  } else if (config.features.email === 'mailgun') {
    dependencies['mailgun.js'] = versions.mailgun;
  } else if (config.features.email === 'nodemailer') {
    dependencies['nodemailer'] = versions.nodemailer;
    if (config.frontend.language === 'ts') {
      devDependencies['@types/nodemailer'] = versions.typesNodemailer;
    }
  } else if (config.features.email === 'mailersend') {
    dependencies['mailersend'] = versions.mailersend;
  }

  // Storage providers
  if (config.features.storage === 'cloudinary') {
    dependencies['cloudinary'] = versions.cloudinary;
  } else if (config.features.storage === 'aws-s3') {
    dependencies['@aws-sdk/client-s3'] = versions.awsS3;
  } else if (config.features.storage === 'cloudflare-r2') {
    dependencies['@aws-sdk/client-s3'] = versions.cloudflareR2;
  } else if (config.features.storage === 'vercel-blob') {
    dependencies['@vercel/blob'] = versions.vercelBlob;
  } else if (config.features.storage === 'supabase-storage') {
    dependencies['@supabase/supabase-js'] = versions.supabaseStorage;
  } else if (config.features.storage === 'firebase-storage') {
    dependencies['firebase'] = versions.firebaseStorage;
  } else if (config.features.storage === 'azure-blob') {
    dependencies['@azure/storage-blob'] = versions.azureBlob;
  } else if (config.features.storage === 'gcs') {
    dependencies['@google-cloud/storage'] = versions.gcs;
  }

  // Payment providers
  if (config.features.payments === 'stripe') {
    dependencies['stripe'] = versions.stripe;
  } else if (config.features.payments === 'paypal') {
    dependencies['@paypal/checkout-server-sdk'] = versions.paypal;
  } else if (config.features.payments === 'razorpay') {
    dependencies['razorpay'] = versions.razorpay;
  }

  // Analytics providers
  if (config.features.analytics === 'posthog') {
    dependencies['posthog-js'] = versions.posthog;
  } else if (config.features.analytics === 'ga4') {
    dependencies['react-ga4'] = versions.reactGa4;
  } else if (config.features.analytics === 'vercel-analytics') {
    dependencies['@vercel/analytics'] = versions.vercelAnalytics;
  } else if (config.features.analytics === 'segment') {
    dependencies['@segment/analytics-next'] = versions.segment;
  }

  // Error tracking providers
  if (config.features.errorTracking === 'sentry' && config.frontend.type === 'nextjs') {
    dependencies['@sentry/nextjs'] = versions.sentryNext;
  } else if (config.features.errorTracking === 'logrocket') {
    dependencies['logrocket'] = versions.logrocket;
  }

  return { dependencies, devDependencies };
}
