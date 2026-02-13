import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { GeneratorContext } from '../generators/context.js';

export async function ensureDir(path: string, ctx?: GeneratorContext): Promise<void> {
  if (ctx?.dryRun) {
    ctx.log(`dry-run: mkdir ${path}`);
    return;
  }
  await mkdir(path, { recursive: true });
}

export async function writeTextFile(
  path: string,
  content: string,
  ctx?: GeneratorContext
): Promise<void> {
  if (ctx?.dryRun) {
    ctx.log(`dry-run: write ${path}`);
    return;
  }
  await ensureDir(dirname(path), ctx);
  await writeFile(path, content, 'utf8');
}

export async function readTextFile(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

export async function removePath(path: string, ctx?: GeneratorContext): Promise<void> {
  if (ctx?.dryRun) {
    ctx.log(`dry-run: remove ${path}`);
    return;
  }
  await rm(path, { recursive: true, force: true });
}