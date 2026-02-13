import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { collectScripts } from '../generators/scripts/scripts-registry.js';
import { collectDependencies } from '../generators/deps/deps-registry.js';
import { syncPackageJson } from './feature-update.js';
import { buildProjectReadme } from '../generators/core/readme.js';
import { writeTextFile } from './file-system.js';
import { appendEnvLine } from './env-file.js';
import { generateAiAgentConfigs } from '../ai-agents/config-generator.js';
import { readProjectConfig } from './project-config.js';

export interface DoctorResult {
  issues: string[];
  config: Awaited<ReturnType<typeof readProjectConfig>>;
  pkgPath: string;
  envPath: string;
  hasConfig: boolean;
  hasPackageJson: boolean;
}

function requiredEnvKeys(config: DoctorResult['config']): string[] {
  const keys: string[] = [];
  if (config.database.provider !== 'none') keys.push('DATABASE_URL');
  if (config.database.provider === 'neon') keys.push('NEON_API_KEY', 'NEON_PROJECT_ID');
  if (config.database.provider === 'supabase') keys.push('SUPABASE_URL', 'SUPABASE_ANON_KEY');
  if (config.auth.provider === 'nextauth') keys.push('NEXTAUTH_SECRET', 'NEXTAUTH_URL');
  if (config.auth.provider === 'clerk') keys.push('CLERK_SECRET_KEY', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  if (config.auth.provider === 'supabase') keys.push('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (config.features.includes('email')) keys.push('RESEND_API_KEY');
  if (config.features.includes('storage')) keys.push('CLOUDINARY_URL');
  if (config.features.includes('payments')) keys.push('STRIPE_SECRET_KEY');
  if (config.features.includes('analytics')) keys.push('NEXT_PUBLIC_POSTHOG_KEY', 'NEXT_PUBLIC_POSTHOG_HOST');
  if (config.features.includes('error-tracking')) keys.push('SENTRY_DSN');
  return keys;
}

function agentFiles(agent: string): string[] {
  const files = ['context.json', 'tools.json'];
  if (agent === 'claude') files.push('claude_desktop_config.json');
  if (agent === 'copilot') files.push('functions.json');
  if (agent === 'codex') files.push('functions.json');
  if (agent === 'gemini') files.push('function_declarations.json');
  if (agent === 'cursor') files.push('.cursorrules');
  if (agent === 'codeium') files.push('server-config.json');
  return files;
}

export async function checkProject(cwd: string): Promise<DoctorResult> {
  const configPath = join(cwd, 'stackforge.json');
  const pkgPath = join(cwd, 'package.json');
  const envPath = join(cwd, '.env.example');
  const issues: string[] = [];

  if (!existsSync(configPath)) {
    return {
      issues: ['Missing stackforge.json. Run from a StackForge project root.'],
      config: await Promise.reject(new Error('Missing stackforge.json')),
      pkgPath,
      envPath,
      hasConfig: false,
      hasPackageJson: existsSync(pkgPath)
    };
  }

  if (!existsSync(pkgPath)) {
    return {
      issues: ['Missing package.json'],
      config: await readProjectConfig(cwd),
      pkgPath,
      envPath,
      hasConfig: true,
      hasPackageJson: false
    };
  }

  const config = await readProjectConfig(cwd);
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const requiredScripts = collectScripts(config);
  const requiredDeps = collectDependencies(config);

  for (const key of Object.keys(requiredScripts)) {
    if (!pkg.scripts || !(key in pkg.scripts)) {
      issues.push(`Missing script: ${key}`);
    }
  }

  for (const key of Object.keys(requiredDeps.dependencies)) {
    if (!pkg.dependencies || !(key in pkg.dependencies)) {
      issues.push(`Missing dependency: ${key}`);
    }
  }

  for (const key of Object.keys(requiredDeps.devDependencies)) {
    if (!pkg.devDependencies || !(key in pkg.devDependencies)) {
      issues.push(`Missing devDependency: ${key}`);
    }
  }

  let envContent = '';
  if (existsSync(envPath)) {
    envContent = await readFile(envPath, 'utf8');
  }
  const envKeys = new Set(
    envContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('=')[0])
  );
  const requiredEnv = requiredEnvKeys(config);
  for (const key of requiredEnv) {
    if (!envKeys.has(key)) {
      issues.push(`Missing env key in .env.example: ${key}`);
    }
  }

  for (const agent of config.aiAgents) {
    const agentRoot = join(cwd, '.ai-agents', agent);
    for (const file of agentFiles(agent)) {
      if (!existsSync(join(agentRoot, file))) {
        issues.push(`Missing AI agent file: .ai-agents/${agent}/${file}`);
      }
    }
    if (agent === 'claude' && !existsSync(join(cwd, '.claude', 'claude_desktop_config.json'))) {
      issues.push('Missing Claude config: .claude/claude_desktop_config.json');
    }
    if (agent === 'codex' && !existsSync(join(cwd, '.codex', 'functions.json'))) {
      issues.push('Missing Codex config: .codex/functions.json');
    }
    if (agent === 'cursor' && !existsSync(join(cwd, '.cursor', 'extensions.json'))) {
      issues.push('Missing Cursor config: .cursor/extensions.json');
    }
    if (agent === 'windsurf' && !existsSync(join(cwd, '.windsurf', 'cascade.json'))) {
      issues.push('Missing Windsurf config: .windsurf/cascade.json');
    }
    if (agent === 'tabnine' && !existsSync(join(cwd, '.tabnine', 'config.json'))) {
      issues.push('Missing Tabnine config: .tabnine/config.json');
    }
  }

  return {
    issues,
    config,
    pkgPath,
    envPath,
    hasConfig: true,
    hasPackageJson: true
  };
}

export async function fixProject(result: DoctorResult): Promise<void> {
  const { config, pkgPath, envPath } = result;
  await syncPackageJson(pkgPath, config, config);

  const envContent = existsSync(envPath) ? await readFile(envPath, 'utf8') : '';
  const envKeys = new Set(
    envContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('=')[0])
  );
  const missingEnv = requiredEnvKeys(config).filter((key) => !envKeys.has(key));
  for (const key of missingEnv) {
    await appendEnvLine(envPath, `${key}=""`);
  }

  if (config.aiAgents.length > 0) {
    const base = basename(process.cwd()) === config.projectName ? dirname(process.cwd()) : process.cwd();
    await generateAiAgentConfigs(base, config);
  }

  const readme = buildProjectReadme(config);
  await writeTextFile(join(process.cwd(), 'README.md'), readme + '\n');
}
