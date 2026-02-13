import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, writeTextFile } from '../../utils/file-system.js';
import { collectScripts } from '../scripts/scripts-registry.js';
import { collectDependencies } from '../deps/deps-registry.js';
import { buildProjectReadme } from './readme.js';
import type { GeneratorContext } from '../context.js';
import { writeProjectConfig } from '../../utils/project-config.js';

const GITIGNORE_CONTENT = `node_modules/
.next/
dist/
.env
.env.local
.env.*.local
.DS_Store
`;

const EDITORCONFIG_CONTENT = `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
`;

interface PackageJson {
  name: string;
  version: string;
  private: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function createProjectSkeleton(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);
  await ensureDir(projectRoot, ctx);

  const readme = buildProjectReadme(config);
  await writeTextFile(join(projectRoot, 'README.md'), readme + '\n', ctx);

  const envExample = `# Environment Variables\n`;
  await writeTextFile(join(projectRoot, '.env.example'), envExample, ctx);
  await writeTextFile(join(projectRoot, '.gitignore'), GITIGNORE_CONTENT, ctx);
  await writeTextFile(join(projectRoot, '.editorconfig'), EDITORCONFIG_CONTENT, ctx);

  const pkg: PackageJson = {
    name: config.projectName,
    version: '0.0.0',
    private: true
  };

  const featureScripts = collectScripts(config);
  const featureDeps = collectDependencies(config);

  if (Object.keys(featureScripts).length > 0) {
    pkg.scripts = featureScripts;
  }
  pkg.dependencies = featureDeps.dependencies;
  pkg.devDependencies = featureDeps.devDependencies;

  await writeTextFile(join(projectRoot, 'package.json'), JSON.stringify(pkg, null, 2) + '\n', ctx);

  if (!ctx?.dryRun) {
    await writeProjectConfig(projectRoot, config);
  }

  if (config.frontend.language === 'ts') {
    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        jsx: 'preserve',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        },
        esModuleInterop: true,
        resolveJsonModule: true,
        incremental: true,
        noEmit: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true
      },
      include: ['src', 'app']
    };

    await writeTextFile(join(projectRoot, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n', ctx);
  }
}
