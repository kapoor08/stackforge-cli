import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGenerators } from '../../src/cli/run-generators.js';

async function readText(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

test('generated output includes real README content and env keys', async () => {
  const root = await mkdtemp(join(tmpdir(), 'stackforge-output-'));
  const config = {
    projectName: 'app',
    packageManager: 'pnpm',
    frontend: { type: 'vite', language: 'ts' },
    ui: { library: 'tailwind' },
    database: { provider: 'postgres', orm: 'drizzle' },
    auth: { provider: 'none' },
    api: { type: 'rest' },
    features: ['email', 'storage', 'payments'],
    aiAgents: []
  };

  await runGenerators(root, config as any, { dryRun: false, log: () => {} });

  const apiReadme = await readText(join(root, 'app', 'api', 'README.md'));
  assert.ok(apiReadme.includes('# REST API'));

  const emailReadme = await readText(join(root, 'app', 'features', 'email', 'README.md'));
  assert.ok(emailReadme.includes('Email (Resend)'));

  const storageReadme = await readText(join(root, 'app', 'features', 'storage', 'README.md'));
  assert.ok(storageReadme.includes('Storage (Cloudinary)'));

  const paymentsReadme = await readText(join(root, 'app', 'features', 'payments', 'README.md'));
  assert.ok(paymentsReadme.includes('Payments (Stripe)'));

  const envExample = await readText(join(root, 'app', '.env.example'));
  assert.ok(envExample.includes('RESEND_API_KEY'));
  assert.ok(envExample.includes('CLOUDINARY_URL'));
  assert.ok(envExample.includes('STRIPE_SECRET_KEY'));
});
