import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, readTextFile, writeTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';
import { applyTemplate } from '../templates/template-engine.js';
import { appendEnvLine } from '../../utils/env-file.js';
import { TEMPLATES_DIR } from '../../utils/templates-dir.js';

export async function generateFrontendFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);
  const templatesRoot = TEMPLATES_DIR;

  if (config.frontend.type === 'nextjs') {
    const appDir = join(projectRoot, 'app');
    await ensureDir(appDir, ctx);

    const uiCssImports = buildUiCssImports(config, 'nextjs');
    const importCss = uiCssImports.length ? uiCssImports.join('') + '\n' : '';
    const hasTrpc = config.api.type === 'trpc';
    const hasUiProvider = requiresUiProvider(config);
    const hasProviders = hasTrpc || hasUiProvider;
    const providersImport = hasProviders ? "import { Providers } from './providers';\n" : '';
    const wrapChildren = hasProviders ? '<Providers>{children}</Providers>' : '{children}';

    const layoutTemplatePath = join(
      templatesRoot,
      'nextjs',
      'app',
      config.frontend.language === 'ts' ? 'layout.tsx' : 'layout.jsx'
    );
    const pageTemplatePath = join(
      templatesRoot,
      'nextjs',
      'app',
      config.frontend.language === 'ts' ? 'page.tsx' : 'page.jsx'
    );
    const actionsTemplatePath = join(
      templatesRoot,
      'nextjs',
      'app',
      config.frontend.language === 'ts' ? 'actions.ts' : 'actions.js'
    );
    const nextConfigTemplatePath = join(
      templatesRoot,
      'nextjs',
      config.frontend.language === 'ts' ? 'next.config.ts' : 'next.config.js'
    );

    const layoutTemplate = await readTextFile(layoutTemplatePath);
    const pageTemplate = await readTextFile(pageTemplatePath);
    const examplesTemplate = await readTextFile(
      join(
        templatesRoot,
        'nextjs',
        'app',
        config.frontend.language === 'ts' ? 'examples-page.tsx' : 'examples-page.jsx'
      )
    );
    const nextConfigTemplate = await readTextFile(nextConfigTemplatePath);
    const actionsTemplate = await readTextFile(actionsTemplatePath);

    const layout = applyTemplate(layoutTemplate, {
      importCss,
      providersImport,
      wrapChildren
    });
    const links = buildPageLinks(config);
    const page = applyTemplate(pageTemplate, { projectName: config.projectName, links });

    await writeTextFile(
      join(projectRoot, config.frontend.language === 'ts' ? 'next.config.ts' : 'next.config.js'),
      nextConfigTemplate,
      ctx
    );
    await writeTextFile(join(appDir, config.frontend.language === 'ts' ? 'layout.tsx' : 'layout.jsx'), layout, ctx);
    await writeTextFile(join(appDir, config.frontend.language === 'ts' ? 'page.tsx' : 'page.jsx'), page, ctx);
    await writeTextFile(join(appDir, config.frontend.language === 'ts' ? 'actions.ts' : 'actions.js'), actionsTemplate, ctx);

    if (config.api.type !== 'none') {
      const examplesDir = join(appDir, 'examples');
      await ensureDir(examplesDir, ctx);
      const { imports, components } = buildApiExamples(config, 'nextjs');
      const featureNotes = buildFeatureNotes(config);
      const { uiDemoImport, uiDemoComponent } = buildUiDemoTokens(config, 'nextjs');
      const examplesPage = applyTemplate(examplesTemplate, {
        imports,
        components,
        featureNotes,
        uiDemoImport,
        uiDemoComponent
      });
      await writeTextFile(
        join(examplesDir, config.frontend.language === 'ts' ? 'page.tsx' : 'page.jsx'),
        examplesPage,
        ctx
      );
    }

    if (hasProviders) {
      const providers = buildProvidersComponent(config, 'nextjs');
      await writeTextFile(
        join(appDir, config.frontend.language === 'ts' ? 'providers.tsx' : 'providers.jsx'),
        providers,
        ctx
      );
    }
  }

  if (config.frontend.type === 'vite') {
    const srcDir = join(projectRoot, 'src');
    await ensureDir(srcDir, ctx);

    const uiCssImports = buildUiCssImports(config, 'vite');
    const cssImport = uiCssImports.length ? uiCssImports.join('') : '';
    const ext = config.frontend.language === 'ts' ? 'tsx' : 'jsx';
    const mainTemplatePath = join(templatesRoot, 'vite', config.frontend.language === 'ts' ? 'main.tsx' : 'main.jsx');
    const appTemplatePath = join(templatesRoot, 'vite', config.frontend.language === 'ts' ? 'App.tsx' : 'App.jsx');
    const indexTemplatePath = join(templatesRoot, 'vite', 'index.html');
    const viteConfigTemplatePath = join(templatesRoot, 'vite', 'vite.config.ts');
    const viteEnvTemplatePath = join(templatesRoot, 'vite', 'vite-env.d.ts');

    const mainTemplate = await readTextFile(mainTemplatePath);
    const appTemplate = await readTextFile(appTemplatePath);
    const indexTemplate = await readTextFile(indexTemplatePath);
    const viteConfigTemplate = await readTextFile(viteConfigTemplatePath);
    const viteEnvTemplate = await readTextFile(viteEnvTemplatePath);

    const hasTrpc = config.api.type === 'trpc';
    const hasUiProvider = requiresUiProvider(config);
    const hasProviders = hasTrpc || hasUiProvider;
    const providersImport = hasProviders ? "import { Providers } from './providers';\n" : '';
    const wrapApp = hasProviders ? '<Providers><App /></Providers>' : '<App />';

    const { initImports, initCalls } = buildFeatureInit(config, 'vite');
    const main = applyTemplate(mainTemplate, {
      importCss: cssImport,
      providersImport,
      wrapApp,
      initImports,
      initCalls
    });
    const { imports, components } = buildApiExamples(config, 'vite');
    const featureNotes = buildFeatureNotes(config);
    const { uiDemoImport, uiDemoComponent } = buildUiDemoTokens(config, 'vite');
    const apiImports = imports ? imports + '\n' : '';
    const apiExamples = components || '';
    const app = applyTemplate(appTemplate, {
      projectName: config.projectName,
      apiImports,
      apiExamples,
      featureNotes,
      uiDemoImport,
      uiDemoComponent
    });
    const indexHtml = applyTemplate(indexTemplate, { projectName: config.projectName, ext });

    await writeTextFile(join(projectRoot, 'index.html'), indexHtml, ctx);
    await writeTextFile(join(projectRoot, 'vite.config.ts'), viteConfigTemplate, ctx);
    await writeTextFile(join(srcDir, config.frontend.language === 'ts' ? 'main.tsx' : 'main.jsx'), main, ctx);
    await writeTextFile(join(srcDir, config.frontend.language === 'ts' ? 'App.tsx' : 'App.jsx'), app, ctx);
    if (config.frontend.language === 'ts') {
      await writeTextFile(join(srcDir, 'vite-env.d.ts'), viteEnvTemplate, ctx);
    }
    await appendEnvLine(join(projectRoot, '.env.example'), 'VITE_API_URL="http://localhost:3001"', ctx);

    if (hasProviders) {
      const providers = buildProvidersComponent(config, 'vite');
      await writeTextFile(join(srcDir, config.frontend.language === 'ts' ? 'providers.tsx' : 'providers.jsx'), providers, ctx);
    }
  }
}

function buildUiCssImports(config: StackforgeConfig, target: 'nextjs' | 'vite'): string[] {
  const imports: string[] = [];
  const tailwindPath = target === 'nextjs' ? "../src/styles.css" : "./styles.css";
  if (config.ui.library === 'tailwind') {
    imports.push(`import '${tailwindPath}';\n`);
  }
  if (config.ui.library === 'mantine') {
    imports.push("import '@mantine/core/styles.css';\n");
    imports.push("import '@mantine/dates/styles.css';\n");
    imports.push("import '@mantine/notifications/styles.css';\n");
  }
  if (config.ui.library === 'antd') {
    imports.push("import 'antd/dist/reset.css';\n");
  }
  return imports;
}

function requiresUiProvider(config: StackforgeConfig): boolean {
  return ['mui', 'chakra', 'mantine', 'antd', 'nextui'].includes(config.ui.library);
}

function buildProvidersComponent(config: StackforgeConfig, target: 'nextjs' | 'vite'): string {
  const hasTrpc = config.api.type === 'trpc';
  const ui = config.ui.library;
  const needsTheme = ['mui', 'chakra', 'mantine', 'antd', 'nextui'].includes(ui);
  const isTypescript = config.frontend.language === 'ts';
  const hasFeatureInit = config.features.includes('analytics') || config.features.includes('error-tracking');
  const themeImportPath = target === 'nextjs' ? '../src/theme' : './theme';

  const imports: string[] = [];
  const lines: string[] = [];

  if (target === 'nextjs') {
    lines.push('"use client";\n');
  }

  if (hasTrpc && isTypescript) {
    imports.push("import type React from 'react';");
    imports.push("import { useState, useEffect } from 'react';");
  } else if (hasTrpc) {
    imports.push("import { useState, useEffect } from 'react';");
  } else if (isTypescript) {
    imports.push("import type React from 'react';");
    if (hasFeatureInit) {
      imports.push("import { useEffect } from 'react';");
    }
  } else if (hasFeatureInit) {
    imports.push("import { useEffect } from 'react';");
  }

  if (hasTrpc) {
    imports.push("import { QueryClient, QueryClientProvider } from '@tanstack/react-query';");
  }

  if (ui === 'mui') {
    imports.push("import { ThemeProvider, CssBaseline } from '@mui/material';");
  }
  if (ui === 'chakra') {
    imports.push("import { ChakraProvider } from '@chakra-ui/react';");
  }
  if (ui === 'mantine') {
    imports.push("import { MantineProvider } from '@mantine/core';");
  }
  if (ui === 'antd') {
    imports.push("import { ConfigProvider } from 'antd';");
  }
  if (ui === 'nextui') {
    imports.push("import { NextUIProvider } from '@nextui-org/react';");
  }
  if (needsTheme) {
    imports.push(`import { theme } from '${themeImportPath}';`);
  }
  if (config.features.includes('analytics')) {
    const analyticsPath = target === 'nextjs' ? '../src/lib/posthog' : './lib/posthog';
    imports.push(`import { initPosthog } from '${analyticsPath}';`);
  }
  if (config.features.includes('error-tracking')) {
    const sentryPath = target === 'nextjs' ? '../src/lib/sentry' : './lib/sentry';
    imports.push(`import { initSentry } from '${sentryPath}';`);
  }

  lines.push(imports.join('\n') + '\n');

  const propsType = isTypescript ? ': { children: React.ReactNode }' : '';
  lines.push(`export function Providers({ children }${propsType}) {\n`);

  if (hasTrpc) {
    lines.push('  const [client] = useState(() => new QueryClient());\n\n');
  }
  if (hasFeatureInit) {
    lines.push('  useEffect(() => {\n');
    if (config.features.includes('analytics')) {
      lines.push('    initPosthog();\n');
    }
    if (config.features.includes('error-tracking')) {
      lines.push('    initSentry();\n');
    }
    lines.push('  }, []);\n\n');
  }

  let body = '{children}';
  if (ui === 'mui') {
    body = '<ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>';
  } else if (ui === 'chakra') {
    body = '<ChakraProvider theme={theme}>{children}</ChakraProvider>';
  } else if (ui === 'mantine') {
    body = '<MantineProvider theme={theme}>{children}</MantineProvider>';
  } else if (ui === 'antd') {
    body = '<ConfigProvider theme={theme}>{children}</ConfigProvider>';
  } else if (ui === 'nextui') {
    body = '<NextUIProvider theme={theme}>{children}</NextUIProvider>';
  }

  if (hasTrpc) {
    body = `<QueryClientProvider client={client}>${body}</QueryClientProvider>`;
  }

  lines.push(`  return ${body};\n`);
  lines.push('}\n');

  return lines.join('');
}

function buildFeatureInit(config: StackforgeConfig, target: 'vite' | 'nextjs'): { initImports: string; initCalls: string } {
  if (target !== 'vite') return { initImports: '', initCalls: '' };
  const imports: string[] = [];
  const calls: string[] = [];
  if (config.features.includes('analytics')) {
    imports.push("import { initPosthog } from './lib/posthog';");
    calls.push('initPosthog();');
  }
  if (config.features.includes('error-tracking')) {
    imports.push("import { initSentry } from './lib/sentry';");
    calls.push('initSentry();');
  }
  return {
    initImports: imports.length ? imports.join('\n') + '\n' : '',
    initCalls: calls.length ? calls.join('\n') + '\n' : ''
  };
}

function buildApiExamples(
  config: StackforgeConfig,
  target: 'nextjs' | 'vite'
): { imports: string; components: string } {
  if (config.api.type === 'none') {
    return { imports: '', components: '' };
  }

  const imports: string[] = [];
  const components: string[] = [];

  if (config.api.type === 'rest') {
    const path = target === 'nextjs' ? '../../src/api/client-usage' : './api/client-usage';
    imports.push(`import { RestExample } from '${path}';`);
    components.push('<RestExample />');
  }

  if (config.api.type === 'graphql') {
    const path = target === 'nextjs' ? '../../src/graphql/client-usage' : './graphql/client-usage';
    imports.push(`import { GraphqlExample } from '${path}';`);
    components.push('<GraphqlExample />');
  }

  if (config.api.type === 'trpc') {
    const path = target === 'nextjs' ? '../../src/trpc/client-usage' : './trpc/client-usage';
    imports.push(`import { TrpcExample } from '${path}';`);
    components.push('<TrpcExample />');
  }

  return { imports: imports.join('\n') + '\n', components: components.join('\n      ') };
}

function buildFeatureNotes(config: StackforgeConfig): string {
  const notes: string[] = [];
  if (config.features.includes('analytics')) notes.push('<p>Analytics enabled (PostHog).</p>');
  if (config.features.includes('error-tracking')) notes.push('<p>Error tracking enabled (Sentry).</p>');
  if (config.features.includes('email')) notes.push('<p>Email feature enabled (Resend).</p>');
  if (config.features.includes('payments')) notes.push('<p>Payments feature enabled (Stripe).</p>');
  if (config.features.includes('storage')) notes.push('<p>Storage feature enabled (Cloudinary).</p>');
  if (!notes.length) return '';
  return notes.join('\n      ');
}

function buildUiDemoTokens(
  config: StackforgeConfig,
  target: 'nextjs' | 'vite'
): { uiDemoImport: string; uiDemoComponent: string } {
  if (config.ui.library === 'none') {
    return { uiDemoImport: '', uiDemoComponent: '' };
  }
  const importPath = target === 'nextjs' ? '../../src/components/ui-demo' : './components/ui-demo';
  return {
    uiDemoImport: `import { UiDemo } from '${importPath}';\n`,
    uiDemoComponent: '<UiDemo />'
  };
}

function buildPageLinks(config: StackforgeConfig): string {
  const items: string[] = [];
  if (config.api.type === 'rest') {
    items.push('<li><Link href="/api/hello">REST hello</Link></li>');
  }
  if (config.api.type === 'graphql') {
    items.push('<li><Link href="/api/graphql">GraphQL endpoint</Link></li>');
  }
  if (config.api.type !== 'none') {
    items.push('<li><Link href="/examples">API examples</Link></li>');
  }
  if (config.auth.provider !== 'none') {
    items.push('<li><Link href="/auth/protected">Auth protected page</Link></li>');
  }
  return items.join('\n        ');
}
