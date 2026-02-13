import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, writeTextFile, readTextFile } from '../../utils/file-system.js';
import { appendEnvLine } from '../../utils/env-file.js';
import type { GeneratorContext } from '../context.js';
import { TEMPLATES_DIR } from '../../utils/templates-dir.js';

export async function generateDatabaseFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);

  const templatesRoot = TEMPLATES_DIR;

  if (config.database.provider !== 'none') {
    const envPath = join(projectRoot, '.env.example');
    if (config.database.provider === 'mongodb') {
      await appendEnvLine(envPath, 'MONGODB_URI=""', ctx);
    } else {
      await appendEnvLine(envPath, 'DATABASE_URL=""', ctx);
    }
    if (config.database.provider === 'neon') {
      await appendEnvLine(envPath, 'NEON_API_KEY=""', ctx);
      await appendEnvLine(envPath, 'NEON_PROJECT_ID=""', ctx);
      const providerDir = join(projectRoot, 'database');
      await ensureDir(providerDir, ctx);
      const providerReadme = await readTextFile(join(templatesRoot, 'database', 'providers', 'neon.README.md'));
      await writeTextFile(join(providerDir, 'README.md'), providerReadme, ctx);
    }
    if (config.database.provider === 'supabase') {
      await appendEnvLine(envPath, 'SUPABASE_URL=""', ctx);
      await appendEnvLine(envPath, 'SUPABASE_ANON_KEY=""', ctx);
      const providerDir = join(projectRoot, 'database');
      await ensureDir(providerDir, ctx);
      const providerReadme = await readTextFile(join(templatesRoot, 'database', 'providers', 'supabase.README.md'));
      await writeTextFile(join(providerDir, 'README.md'), providerReadme, ctx);
    }
  }

  if (config.database.orm === 'drizzle') {
    const drizzleDir = join(projectRoot, 'drizzle');
    await ensureDir(drizzleDir, ctx);
    const configContent = await readTextFile(join(templatesRoot, 'database', 'drizzle', 'drizzle.config.ts'));
    const schemaContent = await readTextFile(join(templatesRoot, 'database', 'drizzle', 'schema.ts'));
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const clientContent = await readTextFile(join(templatesRoot, 'database', 'drizzle', `client.${ext}`));
    const exampleContent = await readTextFile(join(templatesRoot, 'database', 'drizzle', `example.${ext}`));
    await writeTextFile(join(projectRoot, 'drizzle.config.ts'), configContent, ctx);
    await writeTextFile(join(drizzleDir, 'schema.ts'), schemaContent, ctx);
    await writeTextFile(join(drizzleDir, `client.${ext}`), clientContent, ctx);
    await writeTextFile(join(drizzleDir, `example.${ext}`), exampleContent, ctx);
  }

  if (config.database.orm === 'prisma') {
    const prismaDir = join(projectRoot, 'prisma');
    await ensureDir(prismaDir, ctx);
    const schema = await readTextFile(join(templatesRoot, 'database', 'prisma', 'schema.prisma'));
    await writeTextFile(join(prismaDir, 'schema.prisma'), schema, ctx);
    const dbDir = join(projectRoot, 'src', 'db');
    await ensureDir(dbDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const client = await readTextFile(join(templatesRoot, 'database', 'prisma', `client.${ext}`));
    const example = await readTextFile(join(templatesRoot, 'database', 'prisma', `example.${ext}`));
    await writeTextFile(join(dbDir, `prisma.${ext}`), client, ctx);
    await writeTextFile(join(dbDir, `prisma-example.${ext}`), example, ctx);
    const usage = await readTextFile(join(templatesRoot, 'database', 'usage', `prisma-users.${ext}`));
    await writeTextFile(join(dbDir, `users.${ext}`), usage, ctx);
  }

  if (config.database.orm === 'mongoose') {
    const dbDir = join(projectRoot, 'src', 'db');
    await ensureDir(dbDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const connection = await readTextFile(join(templatesRoot, 'database', 'mongoose', `connection.${ext}`));
    const model = await readTextFile(join(templatesRoot, 'database', 'mongoose', `model.${ext}`));
    await writeTextFile(join(dbDir, `mongoose.${ext}`), connection, ctx);
    await writeTextFile(join(dbDir, `mongoose-model.${ext}`), model, ctx);
    const usage = await readTextFile(join(templatesRoot, 'database', 'usage', `mongoose-users.${ext}`));
    await writeTextFile(join(dbDir, `users.${ext}`), usage, ctx);
  }

  if (config.database.orm === 'typeorm') {
    const dbDir = join(projectRoot, 'src', 'db');
    await ensureDir(dbDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const template = await readTextFile(join(templatesRoot, 'database', 'typeorm', `data-source.${ext}`));
    const typeormType =
      config.database.provider === 'mysql'
        ? 'mysql'
        : config.database.provider === 'sqlite'
        ? 'sqlite'
        : 'postgres';
    const migrationsPath = config.frontend.language === 'ts' ? 'migrations/*.ts' : 'migrations/*.js';
    const content = template.replace('{{typeormType}}', typeormType).replace('{{migrationsPath}}', migrationsPath);
    await writeTextFile(join(dbDir, `data-source.${ext}`), content, ctx);
    const entitiesDir = join(dbDir, 'entities');
    await ensureDir(entitiesDir, ctx);
    const entity = await readTextFile(join(templatesRoot, 'database', 'typeorm', `entity.${ext}`));
    await writeTextFile(join(entitiesDir, `User.${ext}`), entity, ctx);
    const migrationsDir = join(dbDir, 'migrations');
    await ensureDir(migrationsDir, ctx);
    const migrationReadme = await readTextFile(join(templatesRoot, 'database', 'typeorm', 'migrations', 'README.md'));
    await writeTextFile(join(migrationsDir, 'README.md'), migrationReadme, ctx);
    const usage = await readTextFile(join(templatesRoot, 'database', 'usage', `typeorm-users.${ext}`));
    await writeTextFile(join(dbDir, `users.${ext}`), usage, ctx);
  }

  if (config.database.orm === 'drizzle') {
    const dbDir = join(projectRoot, 'src', 'db');
    await ensureDir(dbDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const usage = await readTextFile(join(templatesRoot, 'database', 'usage', `drizzle-users.${ext}`));
    await writeTextFile(join(dbDir, `users.${ext}`), usage, ctx);
  }
}
