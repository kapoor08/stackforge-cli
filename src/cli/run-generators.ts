import type { StackforgeConfig } from '../types/config.js';
import { createProjectSkeleton } from '../generators/core/project-creator.js';
import { generateDatabaseFiles } from '../generators/database/database-files.js';
import { generateFrontendFiles } from '../generators/frontend/frontend-files.js';
import { generateUiFiles } from '../generators/ui/ui-files.js';
import { generateAuthFiles } from '../generators/auth/auth-files.js';
import { generateApiFiles } from '../generators/api/api-files.js';
import type { GeneratorContext } from '../generators/context.js';
import { generateAiAgentConfigs } from '../ai-agents/config-generator.js';
import { generateFeatureFiles } from '../generators/features/feature-files.js';

export async function runGenerators(
  cwd: string,
  config: StackforgeConfig,
  ctx: GeneratorContext
): Promise<void> {
  await createProjectSkeleton(cwd, config, ctx);
  await generateFrontendFiles(cwd, config, ctx);
  await generateUiFiles(cwd, config, ctx);
  await generateDatabaseFiles(cwd, config, ctx);
  await generateAuthFiles(cwd, config, ctx);
  await generateApiFiles(cwd, config, ctx);
  await generateFeatureFiles(cwd, config, ctx);
  await generateAiAgentConfigs(cwd, config, ctx);
}