import { readFile, writeFile } from 'node:fs/promises';
import { ensureDir } from './file-system.js';
import { dirname } from 'node:path';
import type { GeneratorContext } from '../generators/context.js';

export async function appendEnvLine(
  path: string,
  line: string,
  ctx?: GeneratorContext
): Promise<void> {
  if (ctx?.dryRun) {
    ctx.log(`dry-run: append ${path} -> ${line}`);
    return;
  }
  await ensureDir(dirname(path), ctx);
  let existing = '';
  try {
    existing = await readFile(path, 'utf8');
  } catch {
    existing = '';
  }

  const normalized = existing.endsWith('\n') || existing.length === 0 ? existing : existing + '\n';
  const content = normalized + line + (line.endsWith('\n') ? '' : '\n');
  await writeFile(path, content, 'utf8');
}

export async function removeEnvKey(
  path: string,
  key: string,
  ctx?: GeneratorContext
): Promise<void> {
  if (ctx?.dryRun) {
    ctx.log(`dry-run: remove env ${key} from ${path}`);
    return;
  }
  let existing = '';
  try {
    existing = await readFile(path, 'utf8');
  } catch {
    return;
  }
  const lines = existing.split(/\r?\n/);
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return true;
    return !trimmed.startsWith(`${key}=`);
  });
  await writeFile(path, filtered.join('\n'), 'utf8');
}