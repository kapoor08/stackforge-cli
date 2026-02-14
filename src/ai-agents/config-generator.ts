import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { StackforgeConfig } from '../types/config.js';
import { ensureDir, writeTextFile } from '../utils/file-system.js';
import type { GeneratorContext } from '../generators/context.js';

function buildAgentContext(config: StackforgeConfig) {
  return {
    stack: {
      frontend: config.frontend,
      ui: config.ui,
      database: config.database,
      auth: config.auth,
      api: config.api
    },
    features: config.features,
    aiAgents: config.aiAgents,
    hints: buildHints(config)
  };
}

function buildTools(config: StackforgeConfig): string[] {
  const tools: string[] = [];
  if (config.database.provider !== 'none') tools.push('database');
  if (config.database.orm) tools.push('orm');
  if (config.api.type !== 'none') tools.push('api');
  if (config.auth.provider !== 'none') tools.push('auth');
  if (config.features.email) tools.push('email');
  if (config.features.storage) tools.push('storage');
  if (config.features.payments) tools.push('payments');
  if (config.features.analytics) tools.push('analytics');
  if (config.features.errorTracking) tools.push('error-tracking');
  return tools;
}

function buildFunctionDefinitions(tools: string[]) {
  return tools.map((tool) => {
    switch (tool) {
      case 'database':
        return {
          name: 'stackforge_database',
          description: 'Inspect database connection and configuration.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['status', 'env', 'client-paths'] }
            },
            required: ['action']
          }
        };
      case 'orm':
        return {
          name: 'stackforge_orm',
          description: 'Inspect ORM configuration and schema locations.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['schema', 'migrations', 'examples'] }
            },
            required: ['action']
          }
        };
      case 'api':
        return {
          name: 'stackforge_api',
          description: 'Inspect API routes and clients.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['routes', 'clients', 'examples'] }
            },
            required: ['action']
          }
        };
      case 'auth':
        return {
          name: 'stackforge_auth',
          description: 'Inspect auth routes and helpers.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['routes', 'helpers', 'env'] }
            },
            required: ['action']
          }
        };
      case 'email':
        return {
          name: 'stackforge_email',
          description: 'Inspect email client and docs.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['client', 'docs', 'env'] }
            },
            required: ['action']
          }
        };
      case 'storage':
        return {
          name: 'stackforge_storage',
          description: 'Inspect storage setup.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['docs', 'env'] }
            },
            required: ['action']
          }
        };
      case 'payments':
        return {
          name: 'stackforge_payments',
          description: 'Inspect payments setup.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['client', 'docs', 'env'] }
            },
            required: ['action']
          }
        };
      case 'analytics':
        return {
          name: 'stackforge_analytics',
          description: 'Inspect analytics setup.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['client', 'env'] }
            },
            required: ['action']
          }
        };
      case 'error-tracking':
        return {
          name: 'stackforge_error-tracking',
          description: 'Inspect error tracking setup.',
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['client', 'env'] }
            },
            required: ['action']
          }
        };
      default:
        return {
          name: `stackforge_${tool}`,
          description: `Access ${tool} helpers for this project.`,
          parameters: {
            type: 'object',
            properties: {
              action: { type: 'string' }
            },
            required: ['action']
          }
        };
    }
  });
}

function buildHints(config: StackforgeConfig): string[] {
  const hints: string[] = [];
  if (config.api.type === 'trpc') hints.push('tRPC router at src/server/api/root.ts');
  if (config.api.type === 'graphql') hints.push('GraphQL schema at src/graphql/schema.graphql');
  if (config.api.type === 'rest') {
    hints.push(
      config.frontend.type === 'nextjs'
        ? 'REST route at app/api/hello/route.ts'
        : 'REST server at src/server/index.ts'
    );
  }
  if (config.database.orm === 'drizzle') hints.push('Drizzle schema at drizzle/schema.ts');
  if (config.database.orm === 'prisma') hints.push('Prisma schema at prisma/schema.prisma');
  if (config.database.orm === 'mongoose') hints.push('Mongoose connection at src/db/mongoose.ts');
  if (config.database.orm === 'typeorm') hints.push('TypeORM data source at src/db/data-source.ts');
  if (config.ui.library === 'mui') hints.push('MUI components docs in components/README.md');
  if (config.ui.library === 'chakra') hints.push('Chakra UI docs in components/README.md');
  if (config.ui.library === 'mantine') hints.push('Mantine docs in components/README.md');
  if (config.ui.library === 'antd') hints.push('Ant Design docs in components/README.md');
  if (config.ui.library === 'nextui') hints.push('NextUI docs in components/README.md');
  if (config.features.analytics) hints.push(`Analytics client at src/lib/${config.features.analytics}.ts`);
  if (config.features.errorTracking) hints.push(`Error tracking at src/lib/${config.features.errorTracking}.ts`);
  if (config.auth.provider === 'nextauth') hints.push('NextAuth route at app/api/auth/[...nextauth]/route.ts');
  if (config.auth.provider === 'clerk') hints.push('Clerk middleware at middleware.ts');
  if (config.auth.provider === 'supabase') hints.push('Supabase client at src/lib/supabase.ts');
  return hints;
}

export async function generateAiAgentConfigs(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  if (!config.aiAgents || config.aiAgents.length === 0) return;

  const projectRoot = resolveProjectRoot(root, config);
  const agentsRoot = join(projectRoot, '.ai-agents');
  await ensureDir(agentsRoot, ctx);
  const serversRoot = join(agentsRoot, 'servers');
  await ensureDir(serversRoot, ctx);
  const protocolsRoot = join(agentsRoot, 'protocols');
  await ensureDir(protocolsRoot, ctx);
  const tools = buildTools(config);
  const hints = buildHints(config);

  for (const agent of config.aiAgents) {
    const agentDir = join(agentsRoot, agent);
    await ensureDir(agentDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';

    const contextJson = JSON.stringify(buildAgentContext(config), null, 2);
    await writeTextFile(join(agentDir, 'context.json'), contextJson + '\n', ctx);
    const toolsJson = JSON.stringify({ tools }, null, 2);
    await writeTextFile(join(agentDir, 'tools.json'), toolsJson + '\n', ctx);

    if (agent === 'claude') {
      const content = JSON.stringify(
        {
          mcpServers: {
            stackforge: {
              command: 'node',
              args: [`.ai-agents/servers/claude/mcp-server.${ext}`]
            }
          }
        },
        null,
        2
      );
      await writeTextFile(join(agentDir, 'claude_desktop_config.json'), content + '\n', ctx);
      const claudeRoot = join(projectRoot, '.claude');
      await ensureDir(claudeRoot, ctx);
      await writeTextFile(join(claudeRoot, 'claude_desktop_config.json'), content + '\n', ctx);
      await writeTextFile(
        join(claudeRoot, 'README.md'),
        'StackForge generated this folder for Claude. Use claude_desktop_config.json to configure the MCP server. The server lives in .ai-agents/servers/claude/mcp-server.(ts|js).\n',
        ctx
      );
      const serverDir = join(serversRoot, 'claude');
      await ensureDir(serverDir, ctx);
      const serverContent = buildMcpServerContent(ext, tools, hints);
      await writeTextFile(join(serverDir, `mcp-server.${ext}`), serverContent, ctx);
      const mcpSpec = JSON.stringify(
        {
          name: 'stackforge',
          tools
        },
        null,
        2
      );
      await writeTextFile(join(serverDir, 'mcp.json'), mcpSpec + '\n', ctx);
      await writeTextFile(
        join(serverDir, 'README.md'),
        'Run the MCP server: `node mcp-server.js` (or .ts with tsx). Endpoints: /tools and /invoke.\n',
        ctx
      );
    }

    if (agent === 'copilot') {
      const content = JSON.stringify({ functions: buildFunctionDefinitions(tools) }, null, 2);
      await writeTextFile(join(agentDir, 'functions.json'), content + '\n', ctx);
      const serverDir = join(serversRoot, 'copilot');
      await ensureDir(serverDir, ctx);
      const serverContent = `export const functions = ${JSON.stringify(buildFunctionDefinitions(tools), null, 2)};\n\nexport function handleFunctionCall(name, args) {\n  return { name, args, ok: true, message: 'Implement tool logic here.' };\n}\n`;
      await writeTextFile(join(serverDir, `functions.${ext}`), serverContent, ctx);
      await writeTextFile(join(serverDir, 'functions.json'), content + '\n', ctx);
    }

    if (agent === 'codex') {
      const content = JSON.stringify({ functions: buildFunctionDefinitions(tools) }, null, 2);
      await writeTextFile(join(agentDir, 'functions.json'), content + '\n', ctx);
      const codexRoot = join(projectRoot, '.codex');
      await ensureDir(codexRoot, ctx);
      await writeTextFile(join(codexRoot, 'functions.json'), content + '\n', ctx);
      await writeTextFile(
        join(codexRoot, 'README.md'),
        'StackForge generated this folder for Codex. Use functions.json for OpenAI function calling integrations.\n',
        ctx
      );
      const serverDir = join(serversRoot, 'codex');
      await ensureDir(serverDir, ctx);
      const serverContent = `export const functions = ${JSON.stringify(buildFunctionDefinitions(tools), null, 2)};\n\nexport function handleFunctionCall(name, args) {\n  return { name, args, ok: true, message: 'Implement tool logic here.' };\n}\n`;
      await writeTextFile(join(serverDir, `functions.${ext}`), serverContent, ctx);
      await writeTextFile(join(serverDir, 'functions.json'), content + '\n', ctx);
    }

    if (agent === 'gemini') {
      const content = JSON.stringify({ functions: buildFunctionDefinitions(tools) }, null, 2);
      await writeTextFile(join(agentDir, 'function_declarations.json'), content + '\n', ctx);
      const serverDir = join(serversRoot, 'gemini');
      await ensureDir(serverDir, ctx);
      const serverContent = `export const functions = ${JSON.stringify(buildFunctionDefinitions(tools), null, 2)};\n\nexport function handleFunctionCall(name, args) {\n  return { name, args, ok: true, message: 'Implement tool logic here.' };\n}\n`;
      await writeTextFile(join(serverDir, `functions.${ext}`), serverContent, ctx);
      await writeTextFile(join(serverDir, 'function_declarations.json'), content + '\n', ctx);
    }

    if (agent === 'cursor') {
      const content = `# Cursor rules\n# See context.json for project stack details\n`;
      await writeTextFile(join(agentDir, '.cursorrules'), content, ctx);
      await writeTextFile(join(projectRoot, '.cursorrules'), content, ctx);
      const cursorRoot = join(projectRoot, '.cursor');
      await ensureDir(cursorRoot, ctx);
      const extensions = JSON.stringify({ recommendations: ['cursor.cursor'] }, null, 2);
      await writeTextFile(join(cursorRoot, 'extensions.json'), extensions + '\n', ctx);
      const serverDir = join(serversRoot, 'cursor');
      await ensureDir(serverDir, ctx);
      const serverContent = `# Cursor uses .cursorrules for guidance.\n`;
      await writeTextFile(join(serverDir, 'README.md'), serverContent, ctx);
    }

    if (agent === 'codeium') {
      const content = JSON.stringify({ protocol: 'lsp', tools, hints }, null, 2);
      await writeTextFile(join(agentDir, 'server-config.json'), content + '\n', ctx);
    }

    if (agent === 'windsurf') {
      const windsurfRoot = join(projectRoot, '.windsurf');
      await ensureDir(windsurfRoot, ctx);
      const content = JSON.stringify({ protocol: 'cascade', tools, hints }, null, 2);
      await writeTextFile(join(windsurfRoot, 'cascade.json'), content + '\n', ctx);
    }

    if (agent === 'tabnine') {
      const tabnineRoot = join(projectRoot, '.tabnine');
      await ensureDir(tabnineRoot, ctx);
      const content = JSON.stringify({ tools, hints }, null, 2);
      await writeTextFile(join(tabnineRoot, 'config.json'), content + '\n', ctx);
    }
  }

  const protocolTools = tools;
  const openAiFunctions = buildFunctionDefinitions(protocolTools);
  const openAiSchema = JSON.stringify({ functions: openAiFunctions }, null, 2);
  await writeTextFile(join(protocolsRoot, 'openai-functions.json'), openAiSchema + '\n', ctx);
  const lspSchema = JSON.stringify(
    {
      version: '0.1',
      capabilities: {
        tools: protocolTools
      }
    },
    null,
    2
  );
  await writeTextFile(join(protocolsRoot, 'lsp.json'), lspSchema + '\n', ctx);

  const docsDir = join(projectRoot, 'docs');
  await ensureDir(docsDir, ctx);
  const aiDoc = buildAiAgentsDoc(config);
  await writeTextFile(join(docsDir, 'AI_AGENTS.md'), aiDoc + '\n', ctx);
}

function resolveProjectRoot(root: string, config: StackforgeConfig): string {
  const candidate = join(root, 'stackforge.json');
  if (existsSync(candidate)) return root;
  return join(root, config.projectName);
}

function buildAiAgentsDoc(config: StackforgeConfig): string {
  const agentsList = config.aiAgents.map((agent) => `- ${agent}`).join('\n');
  const tools = buildTools(config).map((tool) => `- ${tool}`).join('\n');
  const hints = buildHints(config).map((hint) => `- ${hint}`).join('\n');

  return `# AI Agent Integrations

This project includes configuration files for the selected AI agents.

## Enabled Agents
${agentsList || '- none'}

## Tools Enabled
${tools || '- none'}

## Project Hints
${hints || '- none'}

## Files
- .ai-agents/<agent>/context.json
- .ai-agents/<agent>/tools.json
- .ai-agents/servers/<agent>/
- .claude/claude_desktop_config.json (when Claude is enabled)
- .codex/functions.json (when Codex is enabled)
- .cursor/extensions.json and .cursorrules (when Cursor is enabled)
- .windsurf/cascade.json (when Windsurf is enabled)
- .tabnine/config.json (when Tabnine is enabled)

## Setup Notes
- Claude Desktop: copy .ai-agents/claude/claude_desktop_config.json into your Claude config folder.
- Claude MCP server: run .ai-agents/servers/claude/mcp-server.(ts|js).
- Copilot: use .ai-agents/copilot/functions.json for function calling.
- Codex: use .codex/functions.json for function calling.
- Gemini: use .ai-agents/gemini/function_declarations.json in AI Studio.
- Cursor: .ai-agents/cursor/.cursorrules is auto-discovered when opening the project.
- Codeium: use .ai-agents/codeium/server-config.json for LSP tools.
- Windsurf: use .windsurf/cascade.json for Cascade protocol.
- Tabnine: use .tabnine/config.json for plugin configuration.

## Notes
- Agent configs are generated based on stackforge.json.
- Re-run \`stackforge configure-agents\` after changing your stack.
`;
}

function buildMcpServerContent(ext: string, tools: string[], hints: string[]): string {
  const toolCases = [
    "case 'stackforge_database':\n      return { ok: true, message: 'Check DATABASE_URL in .env and review db clients in src/db or drizzle/' };",
    "case 'stackforge_orm':\n      return { ok: true, message: 'Review ORM schema or models in drizzle/ or prisma/ or src/db' };",
    "case 'stackforge_api':\n      return { ok: true, message: 'API routes in app/api and clients in src/api, src/graphql, or src/trpc' };",
    "case 'stackforge_auth':\n      return { ok: true, message: 'Auth routes in app/api/auth and auth helpers in auth/' };",
    "case 'stackforge_email':\n      return { ok: true, message: 'Email client at src/lib/resend.ts and docs in features/email' };",
    "case 'stackforge_storage':\n      return { ok: true, message: 'Storage docs in features/storage' };",
    "case 'stackforge_payments':\n      return { ok: true, message: 'Stripe client at src/lib/stripe.ts and docs in features/payments' };",
    "case 'stackforge_analytics':\n      return { ok: true, message: 'PostHog client at src/lib/posthog.ts' };",
    "case 'stackforge_error-tracking':\n      return { ok: true, message: 'Sentry client at src/lib/sentry.ts' };"
  ].join('\n    ');

  const nameType = ext === 'ts' ? ': string' : '';
  const actionType = ext === 'ts' ? ': string' : '';
  const createServerExpr = ext === 'ts' ? 'createServer' : 'http.createServer';
  const importLine = ext === 'ts'
    ? "import { createServer } from 'node:http';"
    : "const http = require('node:http');";

  return `${importLine}

const tools = ${JSON.stringify(tools, null, 2)};
const hints = ${JSON.stringify(hints, null, 2)};

function handleTool(name${nameType}, action${actionType}) {
  switch (name) {
    ${toolCases}
    default:
      return { ok: false, message: 'Unknown tool' };
  }
}

const server = ${createServerExpr}((req, res) => {
  if (req.url === '/tools') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tools, hints }));
    return;
  }
  if (req.url === '/invoke' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = payload.name || '';
        const action = payload.arguments?.action || '';
        const result = handleTool(name, action);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: 'Invalid JSON' }));
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

const port = Number(process.env.MCP_PORT || 7341);
server.listen(port, () => {
  console.log('MCP server listening on', port);
});
`;
}
