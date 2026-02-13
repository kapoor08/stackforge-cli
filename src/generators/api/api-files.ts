import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, writeTextFile, readTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';

export async function generateApiFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);

  const templatesRoot = fileURLToPath(new URL('../../../templates', import.meta.url));

  if (config.api.type === 'rest') {
    const apiDir = join(projectRoot, 'api');
    await ensureDir(apiDir, ctx);
    await writeTextFile(
      join(apiDir, 'README.md'),
      `# REST API

## Overview
- Next.js: app/api/hello/route.(ts|js) provides a sample GET route.
- If a database is selected, app/api/users/route.(ts|js) includes CRUD examples.
- Vite: src/server/index.(ts|js) hosts the API server (run npm run api:dev).

## Client usage
- src/api/client.(ts|js) wraps fetch helpers.
- src/api/client-usage.(tsx|jsx) shows usage in the UI.
- For Vite, set VITE_API_URL in .env to point at the API server.
`,
      ctx
    );

    if (config.frontend.type === 'nextjs') {
      const routeDir = join(projectRoot, 'app', 'api', 'hello');
      await ensureDir(routeDir, ctx);
      const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
      const handler = await readTextFile(join(templatesRoot, 'api', 'rest', `route.${ext}`));
      await writeTextFile(join(routeDir, `route.${ext}`), handler, ctx);

      if (config.database.orm) {
        const usersDir = join(projectRoot, 'app', 'api', 'users');
        await ensureDir(usersDir, ctx);
        const usersRoute = await readTextFile(
          join(templatesRoot, 'api', 'rest', config.frontend.language === 'ts' ? 'users-route.ts' : 'users-route.js')
        );
        await writeTextFile(
          join(usersDir, config.frontend.language === 'ts' ? 'route.ts' : 'route.js'),
          usersRoute,
          ctx
        );
      }
    }

    if (config.frontend.type === 'vite') {
      const serverDir = join(projectRoot, 'src', 'server');
      await ensureDir(serverDir, ctx);
      const serverTemplate = await readTextFile(
        join(templatesRoot, 'api', 'rest', config.frontend.language === 'ts' ? 'vite-server.ts' : 'vite-server.js')
      );
      await writeTextFile(
        join(serverDir, config.frontend.language === 'ts' ? 'index.ts' : 'index.js'),
        serverTemplate,
        ctx
      );
    }

    const clientDir = join(projectRoot, 'src', 'api');
    await ensureDir(clientDir, ctx);
    const client = await readTextFile(
      join(templatesRoot, 'api', 'rest', config.frontend.language === 'ts' ? 'client.ts' : 'client.js')
    );
    await writeTextFile(join(clientDir, config.frontend.language === 'ts' ? 'client.ts' : 'client.js'), client, ctx);
    const usage = await readTextFile(
      join(templatesRoot, 'api', 'rest', config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx')
    );
    await writeTextFile(
      join(clientDir, config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx'),
      usage,
      ctx
    );
  }

  if (config.api.type === 'trpc') {
    const apiDir = join(projectRoot, 'api');
    await ensureDir(apiDir, ctx);
    await writeTextFile(
      join(apiDir, 'README.md'),
      `# tRPC Setup

## Overview
- Router lives in src/server/api/trpc.ts and src/server/api/root.ts.
- Next.js: app/api/trpc/[trpc]/route.(ts|js) wires the handler.
- Vite: src/server/index.(ts|js) runs the API server (npm run api:dev).

## Client usage
- src/trpc/client.(ts|js) configures the tRPC client.
- src/trpc/client-usage.(tsx|jsx) shows usage in the UI.
- For Vite, set VITE_API_URL in .env to point at the API server.
`,
      ctx
    );

    if (config.frontend.type === 'nextjs') {
      const trpcDir = join(projectRoot, 'src', 'server', 'api');
      await ensureDir(trpcDir, ctx);
      const router = await readTextFile(join(templatesRoot, 'api', 'trpc', 'trpc.ts'));
      const appRouter = await readTextFile(join(templatesRoot, 'api', 'trpc', 'root.ts'));
      await writeTextFile(join(trpcDir, 'trpc.ts'), router, ctx);
      await writeTextFile(join(trpcDir, 'root.ts'), appRouter, ctx);

      const routeDir = join(projectRoot, 'app', 'api', 'trpc', '[trpc]');
      await ensureDir(routeDir, ctx);
      const handler = await readTextFile(join(templatesRoot, 'api', 'trpc', 'route.ts'));
      await writeTextFile(join(routeDir, config.frontend.language === 'ts' ? 'route.ts' : 'route.js'), handler, ctx);

      const clientDir = join(projectRoot, 'src', 'trpc');
      await ensureDir(clientDir, ctx);
      const client = await readTextFile(
        join(templatesRoot, 'api', 'trpc', config.frontend.language === 'ts' ? 'client.ts' : 'client.js')
      );
      await writeTextFile(join(clientDir, config.frontend.language === 'ts' ? 'client.ts' : 'client.js'), client, ctx);
      const usage = await readTextFile(
        join(templatesRoot, 'api', 'trpc', config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx')
      );
      await writeTextFile(
        join(clientDir, config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx'),
        usage,
        ctx
      );
    }

    if (config.frontend.type === 'vite') {
      const trpcDir = join(projectRoot, 'src', 'server', 'api');
      await ensureDir(trpcDir, ctx);
      const router = await readTextFile(join(templatesRoot, 'api', 'trpc', 'trpc.ts'));
      const appRouter = await readTextFile(join(templatesRoot, 'api', 'trpc', 'root.ts'));
      await writeTextFile(join(trpcDir, 'trpc.ts'), router, ctx);
      await writeTextFile(join(trpcDir, 'root.ts'), appRouter, ctx);

      const clientDir = join(projectRoot, 'src', 'trpc');
      await ensureDir(clientDir, ctx);
      const client = await readTextFile(
        join(templatesRoot, 'api', 'trpc', config.frontend.language === 'ts' ? 'client-vite.ts' : 'client-vite.js')
      );
      await writeTextFile(join(clientDir, config.frontend.language === 'ts' ? 'client.ts' : 'client.js'), client, ctx);
      const usage = await readTextFile(
        join(templatesRoot, 'api', 'trpc', config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx')
      );
      await writeTextFile(
        join(clientDir, config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx'),
        usage,
        ctx
      );

      const serverDir = join(projectRoot, 'src', 'server');
      await ensureDir(serverDir, ctx);
      const serverTemplate = await readTextFile(
        join(templatesRoot, 'api', 'trpc', config.frontend.language === 'ts' ? 'vite-server.ts' : 'vite-server.js')
      );
      await writeTextFile(
        join(serverDir, config.frontend.language === 'ts' ? 'index.ts' : 'index.js'),
        serverTemplate,
        ctx
      );
    }
  }

  if (config.api.type === 'graphql') {
    const apiDir = join(projectRoot, 'api');
    await ensureDir(apiDir, ctx);
    await writeTextFile(
      join(apiDir, 'README.md'),
      `# GraphQL Setup

## Overview
- Schema in src/graphql/schema.graphql.
- Next.js: app/api/graphql/route.(ts|js) runs the Yoga handler.
- Vite: src/server/index.(ts|js) runs the API server (npm run api:dev).

## Client usage
- src/graphql/client.(ts|js) configures the GraphQL client.
- src/graphql/client-usage.(tsx|jsx) shows usage in the UI.
- For Vite, set VITE_API_URL in .env to point at the API server.
`,
      ctx
    );

    if (config.frontend.type === 'nextjs') {
      const gqlDir = join(projectRoot, 'src', 'graphql');
      await ensureDir(gqlDir, ctx);
      const schema = await readTextFile(join(templatesRoot, 'api', 'graphql', 'schema.graphql'));
      await writeTextFile(join(gqlDir, 'schema.graphql'), schema, ctx);

      const routeDir = join(projectRoot, 'app', 'api', 'graphql');
      await ensureDir(routeDir, ctx);
      const gqlExt = config.frontend.language === 'ts' ? 'ts' : 'js';
      const handler = await readTextFile(join(templatesRoot, 'api', 'graphql', `route.${gqlExt}`));
      await writeTextFile(join(routeDir, `route.${gqlExt}`), handler, ctx);

      const clientDir = join(projectRoot, 'src', 'graphql');
      const client = await readTextFile(
        join(templatesRoot, 'api', 'graphql', config.frontend.language === 'ts' ? 'client.ts' : 'client.js')
      );
      await writeTextFile(join(clientDir, config.frontend.language === 'ts' ? 'client.ts' : 'client.js'), client, ctx);
      const usage = await readTextFile(
        join(templatesRoot, 'api', 'graphql', config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx')
      );
      await writeTextFile(
        join(clientDir, config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx'),
        usage,
        ctx
      );
    }

    if (config.frontend.type === 'vite') {
      const gqlDir = join(projectRoot, 'src', 'graphql');
      await ensureDir(gqlDir, ctx);
      const schema = await readTextFile(join(templatesRoot, 'api', 'graphql', 'schema.graphql'));
      await writeTextFile(join(gqlDir, 'schema.graphql'), schema, ctx);

      const serverDir = join(projectRoot, 'src', 'server');
      await ensureDir(serverDir, ctx);
      const serverTemplate = await readTextFile(
        join(templatesRoot, 'api', 'graphql', config.frontend.language === 'ts' ? 'vite-server.ts' : 'vite-server.js')
      );
      await writeTextFile(
        join(serverDir, config.frontend.language === 'ts' ? 'index.ts' : 'index.js'),
        serverTemplate,
        ctx
      );

      const clientDir = join(projectRoot, 'src', 'graphql');
      const client = await readTextFile(
        join(templatesRoot, 'api', 'graphql', config.frontend.language === 'ts' ? 'client.ts' : 'client.js')
      );
      await writeTextFile(join(clientDir, config.frontend.language === 'ts' ? 'client.ts' : 'client.js'), client, ctx);
      const usage = await readTextFile(
        join(templatesRoot, 'api', 'graphql', config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx')
      );
      await writeTextFile(
        join(clientDir, config.frontend.language === 'ts' ? 'client-usage.tsx' : 'client-usage.jsx'),
        usage,
        ctx
      );
    }
  }
}
