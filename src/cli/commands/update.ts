import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { readProjectConfig } from '../../utils/project-config.js';
import { syncPackageJson } from '../../utils/feature-update.js';
import { buildProjectReadme } from '../../generators/core/readme.js';
import { writeTextFile } from '../../utils/file-system.js';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { resolveDependencies, resolveScripts } from '../../utils/dependency-resolver.js';
import { readPackageJson, writePackageJson } from '../../utils/package-json.js';

export const updateCommand = new Command('update')
  .option('--check', 'check for updates')
  .option('--major', 'allow major updates')
  .option('--live', 'compare against latest registry versions')
  .action(async (options) => {
    const cwd = process.cwd();

    const config = await readProjectConfig(cwd);
    const pkgPath = join(cwd, 'package.json');
    if (options.check) {
      const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as {
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const expectedScripts = resolveScripts(config);
      const expectedDeps = resolveDependencies(config, { allowMajor: Boolean(options.major) });

      const issues: string[] = [];
      for (const key of Object.keys(expectedScripts)) {
        if (!pkg.scripts || !(key in pkg.scripts)) {
          issues.push(`Missing script: ${key}`);
        } else if (pkg.scripts[key] !== expectedScripts[key]) {
          issues.push(`Script mismatch: ${key}`);
        }
      }

      for (const key of Object.keys(expectedDeps.dependencies)) {
        if (!pkg.dependencies || !(key in pkg.dependencies)) {
          issues.push(`Missing dependency: ${key}`);
        } else if (pkg.dependencies[key] !== expectedDeps.dependencies[key]) {
          issues.push(`Dependency version mismatch: ${key}`);
        }
      }

      for (const key of Object.keys(expectedDeps.devDependencies)) {
        if (!pkg.devDependencies || !(key in pkg.devDependencies)) {
          issues.push(`Missing devDependency: ${key}`);
        } else if (pkg.devDependencies[key] !== expectedDeps.devDependencies[key]) {
          issues.push(`Dev dependency version mismatch: ${key}`);
        }
      }

      if (options.live) {
        const { fetchLatestVersion } = await import('../../utils/npm-registry.js');
        const allDeps = {
          ...expectedDeps.dependencies,
          ...expectedDeps.devDependencies
        };
        for (const [name, version] of Object.entries(allDeps)) {
          const latest = await fetchLatestVersion(name);
          if (latest && !version.includes(latest)) {
            issues.push(`Latest available: ${name}@${latest} (current ${version})`);
          }
        }
      }

      if (issues.length === 0) {
        logger.info('No updates needed.');
      } else {
        for (const issue of issues) logger.warn(issue);
      }
      return;
    }

    await syncPackageJson(pkgPath, config, config);
    if (options.live) {
      const { fetchLatestVersion } = await import('../../utils/npm-registry.js');
      const pkg = await readPackageJson(pkgPath);
      const allowMajor = Boolean(options.major);

      const updateMap = async (deps: Record<string, string> | undefined) => {
        if (!deps) return;
        for (const [name, current] of Object.entries(deps)) {
          const latest = await fetchLatestVersion(name);
          if (!latest) continue;
          const currentMajor = parseMajor(current);
          const latestMajor = parseMajor(latest);
          if (!allowMajor && currentMajor !== null && latestMajor !== null && latestMajor > currentMajor) {
            continue;
          }
          deps[name] = `^${latest}`;
        }
      };

      await updateMap(pkg.dependencies);
      await updateMap(pkg.devDependencies);
      await writePackageJson(pkgPath, pkg);
    }

    const readme = buildProjectReadme(config);
    await writeTextFile(join(cwd, 'README.md'), readme + '\n');

    logger.info('Project updated.');
  });

function parseMajor(version: string): number | null {
  const match = version.match(/(\d+)\./);
  if (!match) return null;
  return Number(match[1]);
}
