import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StackforgeConfig } from '../../types/config.js';
import { appendEnvLine } from '../../utils/env-file.js';
import { writeTextFile, ensureDir, readTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';

export async function generateAuthFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);

  const templatesRoot = fileURLToPath(new URL('../../../templates', import.meta.url));

  if (config.auth.provider === 'nextauth') {
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXTAUTH_SECRET=""', ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXTAUTH_URL=""', ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';

    if (config.frontend.type === 'nextjs') {
      const routeDir = join(projectRoot, 'app', 'api', 'auth', '[...nextauth]');
      await ensureDir(routeDir, ctx);

      const route = await readTextFile(join(templatesRoot, 'auth', 'nextauth-route.ts'));
      await writeTextFile(join(routeDir, config.frontend.language === 'ts' ? 'route.ts' : 'route.js'), route, ctx);
    }

    const authDir = join(projectRoot, 'auth');
    await ensureDir(authDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'auth', 'nextauth.README.md'));
    await writeTextFile(join(authDir, 'README.md'), readme, ctx);
    const options = await readTextFile(join(templatesRoot, 'auth', `nextauth-options.${ext}`));
    await writeTextFile(join(authDir, `auth-options.${ext}`), options, ctx);
    if (config.frontend.type === 'nextjs') {
      const protectedDir = join(projectRoot, 'app', 'auth', 'protected');
      await ensureDir(protectedDir, ctx);
      const protectedPage = await readTextFile(
        join(templatesRoot, 'auth', `nextauth-protected-page.${ext}x`)
      );
      await writeTextFile(join(protectedDir, `page.${ext}x`), protectedPage, ctx);

      const signInDir = join(projectRoot, 'app', 'auth', 'signin');
      await ensureDir(signInDir, ctx);
      const signInPage = await readTextFile(join(templatesRoot, 'auth', `nextauth-signin.${ext}x`));
      await writeTextFile(join(signInDir, `page.${ext}x`), signInPage, ctx);
    } else {
      const protectedPage = await readTextFile(join(templatesRoot, 'auth', `nextauth-protected.${ext}x`));
      await writeTextFile(join(authDir, `protected.${ext}x`), protectedPage, ctx);
    }
  }

  if (config.auth.provider === 'clerk') {
    await appendEnvLine(join(projectRoot, '.env.example'), 'CLERK_SECRET_KEY=""', ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""', ctx);

    const libDir = join(projectRoot, 'src', 'lib');
    await ensureDir(libDir, ctx);
    const clerkClient = `import { clerkClient } from '@clerk/nextjs/server';\n\nexport { clerkClient };\n`;
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    await writeTextFile(join(libDir, `clerk.${ext}`), clerkClient, ctx);

    if (config.frontend.type === 'nextjs') {
      const middleware = `import { authMiddleware } from '@clerk/nextjs';\n\nexport default authMiddleware();\n\nexport const config = {\n  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']\n};\n`;
      await writeTextFile(join(projectRoot, `middleware.${ext}`), middleware, ctx);
    }

    const authDir = join(projectRoot, 'auth');
    await ensureDir(authDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'auth', 'clerk.README.md'));
    await writeTextFile(join(authDir, 'README.md'), readme, ctx);
    if (config.frontend.type === 'nextjs') {
      const protectedDir = join(projectRoot, 'app', 'auth', 'protected');
      await ensureDir(protectedDir, ctx);
      const protectedPage = await readTextFile(
        join(templatesRoot, 'auth', `clerk-protected-page.${ext}x`)
      );
      await writeTextFile(join(protectedDir, `page.${ext}x`), protectedPage, ctx);

      const signInDir = join(projectRoot, 'app', 'auth', 'signin');
      await ensureDir(signInDir, ctx);
      const signInPage = await readTextFile(join(templatesRoot, 'auth', `clerk-signin.${ext}x`));
      await writeTextFile(join(signInDir, `page.${ext}x`), signInPage, ctx);
    } else {
      const protectedPage = await readTextFile(join(templatesRoot, 'auth', `clerk-protected.${ext}x`));
      await writeTextFile(join(authDir, `protected.${ext}x`), protectedPage, ctx);
    }
  }

  if (config.auth.provider === 'supabase') {
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_SUPABASE_URL=""', ctx);
    await appendEnvLine(join(projectRoot, '.env.example'), 'NEXT_PUBLIC_SUPABASE_ANON_KEY=""', ctx);

    const libDir = join(projectRoot, 'src', 'lib');
    await ensureDir(libDir, ctx);
    const supabaseClient = `import { createClient } from '@supabase/supabase-js';\n\nconst url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';\nconst key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';\n\nexport const supabase = createClient(url, key);\n`;
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    await writeTextFile(join(libDir, `supabase.${ext}`), supabaseClient, ctx);

    if (config.frontend.type === 'nextjs') {
      const supabaseServer = `import { createServerClient } from '@supabase/ssr';\nimport { cookies } from 'next/headers';\n\nexport function createSupabaseServerClient() {\n  const cookieStore = cookies();\n  return createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL || '',\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',\n    {\n      cookies: {\n        get(name) {\n          return cookieStore.get(name)?.value;\n        }\n      }\n    }\n  );\n}\n`;
      await writeTextFile(join(libDir, `supabase-server.${ext}`), supabaseServer, ctx);
    }

    const authDir = join(projectRoot, 'auth');
    await ensureDir(authDir, ctx);
    const readme = await readTextFile(join(templatesRoot, 'auth', 'supabase.README.md'));
    await writeTextFile(join(authDir, 'README.md'), readme, ctx);
    if (config.frontend.type === 'nextjs') {
      const protectedDir = join(projectRoot, 'app', 'auth', 'protected');
      await ensureDir(protectedDir, ctx);
      const protectedPage = await readTextFile(
        join(templatesRoot, 'auth', `supabase-protected-page.${ext}x`)
      );
      await writeTextFile(join(protectedDir, `page.${ext}x`), protectedPage, ctx);

      const signInDir = join(projectRoot, 'app', 'auth', 'signin');
      await ensureDir(signInDir, ctx);
      const signInPage = await readTextFile(join(templatesRoot, 'auth', `supabase-signin.${ext}x`));
      await writeTextFile(join(signInDir, `page.${ext}x`), signInPage, ctx);
    } else {
      const protectedPage = await readTextFile(join(templatesRoot, 'auth', `supabase-protected.${ext}x`));
      await writeTextFile(join(authDir, `protected.${ext}x`), protectedPage, ctx);
      const signin = await readTextFile(
        join(templatesRoot, 'auth', `supabase-vite-signin.${ext}x`)
      );
      const authUiDir = join(projectRoot, 'src', 'auth');
      await ensureDir(authUiDir, ctx);
      await writeTextFile(join(authUiDir, `signin.${ext}x`), signin, ctx);
    }
  }
}
